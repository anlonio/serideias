export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient()
  const session = useSupabaseSession()

  const user = useSupabaseUser()

  const profile = ref<ProfilesRow | null>(null)

  const fetchProfile = (id: string) =>
    supabase
      .from('profiles')
      .select()
      .eq('id', id)
      .returns<ProfilesRow>()
      .maybeSingle()
      .then((profileDB) => {
        profile.value = profileDB.data
      })

  watchEffect(() => {
    if (user.value) {
      return fetchProfile(user.value.id)
    }
    profile.value = null
  })

  const signUp = (user: SignUpUser) =>
    supabase.auth.signUp({
      email: user.email,
      options: {
        data: {
          username: user.username,
          full_name: user.fullName,
        },
      },
      password: user.password,
    })

  const signIn = (user: SignInUser) =>
    supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    })

  const signOut = () => supabase.auth.signOut()

  const isAnon = computed(() => !session.value)

  return { signUp, signIn, signOut, isAnon, user, profile, session }
})

