import { gql } from '@apollo/client/core';

export const GET_TRACKS = gql`
  query GetTracks($input: TracksQueryInput) {
    tracks(input: $input) {
      data {
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
      meta {
        total
        page
        limit
        totalPages
      }
    }
  }
`;
