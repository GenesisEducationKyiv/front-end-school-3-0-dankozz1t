import { gql } from '@apollo/client/core';

export const GET_GENRES = gql`
  query GetGenres {
    genres
  }
`;
