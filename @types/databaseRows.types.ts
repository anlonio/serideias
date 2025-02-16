type DatabaseTables = Database['public']['Tables']

export type ContactsRow = DatabaseTables['contacts']['Row']

export type ProfilesRow = DatabaseTables['profiles']['Row'] & {
  location: DatabaseTables['locations']['Row'] | null
  contacts: ContactsRow[]
}

export type PostsRow = DatabaseTables['posts']['Row']
export type PostsRowFull = DatabaseTables['posts']['Row'] & {
  author: ProfilesRow
  location: DatabaseTables['locations']['Row'] | null
  totalReplies: number
  upVotes: number
  downVotes: number
  myVote: VotesRow | null
}

export type PostsRowFullWithReplies = DatabaseTables['posts']['Row'] & {
  author: ProfilesRow
  location: DatabaseTables['locations']['Row'] | null
  totalReplies: number
  upVotes: number
  downVotes: number
  myVote: VotesRow | null
  replies: RepliesRow[]
}

export type RepliesRow = DatabaseTables['replies']['Row'] & {
  author: ProfilesRow
  totalReplies: number
  upVotes: number
  downVotes: number
  myVote: VotesRow | null
}
export type LocationsRow = DatabaseTables['locations']['Row']
export type LocationsRowWithPosts = DatabaseTables['locations']['Row'] & {
  posts: { count: number }[]
  profiles: { count: number }[]
}

export type VotesRow = DatabaseTables['votes']['Row']

