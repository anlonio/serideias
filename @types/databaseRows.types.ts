type DatabaseTables = Database['public']['Tables']

export type ProfilesRow = DatabaseTables['profiles']['Row'] & {
  location: DatabaseTables['locations']['Row'] | null
}

export type PostsRow = DatabaseTables['posts']['Row']
export type PostsRowFull = DatabaseTables['posts']['Row'] & {
  author: ProfilesRow
  location: DatabaseTables['locations']['Row'] | null
  totalReplies: { count: number }[]
}

export type PostsRowFullWithReplies = DatabaseTables['posts']['Row'] & {
  author: ProfilesRow
  location: DatabaseTables['locations']['Row'] | null
  totalReplies: { count: number }[]
  replies: RepliesRow[]
}

export type RepliesRow = DatabaseTables['replies']['Row'] & {
  author: ProfilesRow
}
export type LocationsRow = DatabaseTables['locations']['Row']

