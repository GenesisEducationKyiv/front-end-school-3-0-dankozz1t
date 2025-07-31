import { gql } from '@apollo/client/core';

export const CREATE_TRACK = gql`
  mutation CreateTrack($input: TrackInput!) {
    createTrack(input: $input) {
      id
      title
      artist
      album
      genres
      slug
      coverImage
      audioFile
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TRACK = gql`
  mutation UpdateTrack($id: ID!, $input: UpdateTrackInput!) {
    updateTrack(id: $id, input: $input) {
      id
      title
      artist
      album
      genres
      slug
      coverImage
      audioFile
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TRACK = gql`
  mutation DeleteTrack($id: ID!) {
    deleteTrack(id: $id)
  }
`;

export const DELETE_TRACKS = gql`
  mutation DeleteTracks($ids: [ID!]!) {
    deleteTracks(ids: $ids) {
      success
      failed
    }
  }
`;
