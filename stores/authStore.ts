export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient()
  const session = useSupabaseSession()

  const user = useSupabaseUser()

  const profile = ref(null)

  const fetchProfile = (id: string) => supabase.from('profiles')
    .select().eq('id', id).maybeSingle().then((profileDB) => {
      profile.value = profileDB.data
    })

  watchEffect(() => {
    if (user.value) {
      fetchProfile(user.value.id)
    }
  })

  const signUp = (user: SignUpUser) => supabase.auth.signUp({
    email: user.email,
    options: {
      data: {
        username: user.username,
        full_name: user.fullName,
      },
    },
    password: user.password,
  })
  
  const signIn = (user: SignInUser) => supabase.auth.signInWithPassword({
    email: user.email,
    password: user.password,
  })

  const isAnon = computed(() => !session.value)

  return { signUp, signIn, isAnon, user, profile, session }
})
