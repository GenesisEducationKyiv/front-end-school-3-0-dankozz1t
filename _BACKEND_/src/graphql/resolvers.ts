import {
  createTrack,
  deleteTrack,
  getTrackById,
  getTrackBySlug,
  getTracks,
  updateTrack,
  deleteMultipleTracks,
  saveAudioFile,
  deleteAudioFile,
  getGenres
} from '../utils/db';
import { createSlug } from '../utils/slug';
import {  QueryParams,  } from '../types';

interface TrackInput {
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  coverImage?: string;
}

interface UpdateTrackInput {
  title?: string;
  artist?: string;
  album?: string;
  genres?: string[];
  coverImage?: string;
}

interface TracksQueryInput {
  page?: number;
  limit?: number;
  sort?: 'title' | 'artist' | 'album' | 'createdAt';
  order?: 'asc' | 'desc';
  search?: string;
  genre?: string;
  artist?: string;
}

export const resolvers = {
  Query: {
    tracks: async (parent: any, args: { input?: TracksQueryInput }) => {
      const queryParams: QueryParams = {
        page: args.input?.page || 1,
        limit: args.input?.limit || 10,
        sort: args.input?.sort || 'createdAt',
        order: args.input?.order || 'desc',
        search: args.input?.search,
        genre: args.input?.genre,
        artist: args.input?.artist
      };

      const { tracks, total } = await getTracks(queryParams);
      
      return {
        data: tracks,
        meta: {
          total,
          page: queryParams.page || 1,
          limit: queryParams.limit || 10,
          totalPages: Math.ceil(total / (queryParams.limit || 10))
        }
      };
    },

    track: async (parent: any, args: { slug: string }) => {
      return await getTrackBySlug(args.slug);
    },

    trackById: async (parent: any, args: { id: string }) => {
      return await getTrackById(args.id);
    },

    genres: async () => {
      return await getGenres();
    }
  },

  Mutation: {
    createTrack: async (parent: any, args: { input: TrackInput }) => {
      const { title, artist, album = '', genres = [], coverImage = '' } = args.input;
      
      if (!title || !artist) {
        throw new Error('Title and artist are required');
      }
      
      if (!genres || !Array.isArray(genres)) {
        throw new Error('Genres must be an array');
      }
      
      const slug = createSlug(title);
      
      const existingTrack = await getTrackBySlug(slug);
      if (existingTrack) {
        throw new Error('A track with this title already exists');
      }
      
      return await createTrack({
        title,
        artist,
        album,
        genres,
        coverImage,
        slug
      });
    },

    updateTrack: async (parent: any, args: { id: string; input: UpdateTrackInput }) => {
      const { id } = args;
      const { title, artist, album, genres, coverImage } = args.input;
      
      const existingTrack = await getTrackById(id);
      if (!existingTrack) {
        throw new Error('Track not found');
      }
      
      let updates: Partial<UpdateTrackInput & { slug?: string }> = { ...args.input };
      
      if (title && title !== existingTrack.title) {
        const newSlug = createSlug(title);
        
        const trackWithSameSlug = await getTrackBySlug(newSlug);
        if (trackWithSameSlug && trackWithSameSlug.id !== id) {
          throw new Error('A track with this title already exists');
        }
        
        updates.slug = newSlug;
      }
      
      const updatedTrack = await updateTrack(id, updates);
      if (!updatedTrack) {
        throw new Error('Failed to update track');
      }
      
      return updatedTrack;
    },

    deleteTrack: async (parent: any, args: { id: string }) => {
      return await deleteTrack(args.id);
    },

    deleteTracks: async (parent: any, args: { ids: string[] }) => {
      const { ids } = args;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new Error('Track IDs are required');
      }
      
      return await deleteMultipleTracks(ids);
    },

    uploadTrackFile: async (parent: any, args: { id: string; file: any }) => {
      const { id, file } = args;
      
      const existingTrack = await getTrackById(id);
      if (!existingTrack) {
        throw new Error('Track not found');
      }
      
      const allowedMimeTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new Error('Invalid file type. Only MP3 and WAV files are allowed.');
      }
      
      const buffer = await file.toBuffer();
      
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (buffer.length > maxSize) {
        throw new Error('File is too large. Maximum size is 10MB.');
      }
      
      const fileName = await saveAudioFile(id, file.filename, buffer);
      
      const updatedTrack = await updateTrack(id, { audioFile: fileName });
      if (!updatedTrack) {
        throw new Error('Failed to update track with audio file');
      }
      
      return updatedTrack;
    },

    deleteTrackFile: async (parent: any, args: { id: string }) => {
      const { id } = args;
      
      const existingTrack = await getTrackById(id);
      if (!existingTrack) {
        throw new Error('Track not found');
      }
      
      if (!existingTrack.audioFile) {
        throw new Error('Track has no audio file');
      }
      
      const success = await deleteAudioFile(id);
      
      if (!success) {
        throw new Error('Failed to delete audio file');
      }
      
      const updatedTrack = await getTrackById(id);
      if (!updatedTrack) {
        throw new Error('Failed to get updated track');
      }
      
      return updatedTrack;
    }
  }
}; 
