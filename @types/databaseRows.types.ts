type DatabaseTables = Database['public']['Tables']

export type ProfilesRow = DatabaseTables['profiles']['Row']

export type PostsRow = DatabaseTables['posts']['Row']
export type PostsRowFull = DatabaseTables['posts']['Row'] & {
  author: DatabaseTables['profiles']['Row']
  totalReplies: { count: number }[]
}

export type RepliesRow = DatabaseTables['replies']['Row']
export type LocationsRow = DatabaseTables['locations']['Row']

