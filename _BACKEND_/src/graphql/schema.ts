export const schema = `
  scalar Upload

  type Track {
    id: ID!
    title: String!
    artist: String!
    album: String
    genres: [String!]!
    slug: String!
    coverImage: String
    audioFile: String
    createdAt: String!
    updatedAt: String!
  }

  type PaginatedTracks {
    data: [Track!]!
    meta: PaginationMeta!
  }

  type PaginationMeta {
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  type BatchDeleteResult {
    success: [ID!]!
    failed: [ID!]!
  }

  input TrackInput {
    title: String!
    artist: String!
    album: String
    genres: [String!]!
    coverImage: String
  }

  input UpdateTrackInput {
    title: String
    artist: String
    album: String
    genres: [String!]
    coverImage: String
  }

  input TracksQueryInput {
    page: Int = 1
    limit: Int = 10
    sort: TrackSortField = createdAt
    order: SortOrder = desc
    search: String
    genre: String
    artist: String
  }

  enum TrackSortField {
    title
    artist
    album
    createdAt
  }

  enum SortOrder {
    asc
    desc
  }

  type Query {
    tracks(input: TracksQueryInput): PaginatedTracks!
    track(slug: String!): Track
    trackById(id: ID!): Track
    genres: [String!]!
  }

  type Mutation {
    createTrack(input: TrackInput!): Track!
    updateTrack(id: ID!, input: UpdateTrackInput!): Track!
    deleteTrack(id: ID!): Boolean!
    deleteTracks(ids: [ID!]!): BatchDeleteResult!
    uploadTrackFile(id: ID!, file: Upload!): Track!
    deleteTrackFile(id: ID!): Track!
  }
`; 
