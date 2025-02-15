export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient<Database>()
  const session = useSupabaseSession()
  const user = useSupabaseUser()
  const router = useRouter()

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      'http://localhost:3000/'
    // Make sure to include `https://` when not localhost.
    url = url.startsWith('http') ? url : `https://${url}`
    // Make sure to include a trailing `/`.
    url = url.endsWith('/') ? url : `${url}/`
    return url
  }

  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      router.push('/')
    }
  })

  const profile = ref<ProfilesRow | null>(null)

  const fetchProfile = (id: string) => {
    return useAsyncData('profile', async () =>
      supabase
        .from('profiles')
        .select(
          `
        *,
        location:locations(*)
        `,
        )
        .eq('id', id)
        .maybeSingle()
        .then((profileDB) => {
          profile.value = profileDB.data
          return profileDB.data
        }),
    )
  }

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

  const updateProfile = (data: EditProfile) => {
    if (!profile.value) {
      throw Error('booooo')
    }

    return supabase
      .from('profiles')
      .update(data)
      .eq('id', profile.value.id)
      .select()
  }

  const checkUsername = async (username: string) => {
    const { count } = await supabase
      .from('profiles')
      .select('username', { count: 'exact' })
      .eq('username', username)
      .maybeSingle()
    console.log(count)

    return count !== 0
  }

  const forgotPassword = (email: string) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getURL()}new-password`,
    })

  const newPassword = (password: string) =>
    supabase.auth.updateUser({ password })

  return {
    signUp,
    signIn,
    signOut,
    isAnon,
    user,
    profile,
    session,
    fetchProfile,
    updateProfile,
    checkUsername,
    forgotPassword,
    newPassword,
  }
})

