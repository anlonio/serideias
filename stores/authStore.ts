import { v4 as uuid } from 'uuid'

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

  const fetchProfile = () => {
    if (!user.value) {
      throw Error('boooo')
    }
    return supabase
      .from('profiles')
      .select(
        `
        *,
        location:locations(*),
        contacts(*)
        `,
      )
      .eq('id', user.value.id)
      .maybeSingle()
      .then((profileDB) => {
        profile.value = profileDB.data
        return profileDB.data
      })
  }

  watchEffect(() => {
    if (user.value) {
      if (user.value.id !== profile.value?.id) {
        fetchProfile()
      }
      return
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

  const upsertAvatar = async (avatar_url: EditProfile['avatar_url']) => {
    if (!profile.value) {
      throw Error('booooo')
    }

    const path = profile.value.avatar_url?.split('avatar/').pop()

    if (!avatar_url && path) {
      return supabase.storage
        .from('avatar')
        .remove([path])
        .then(() => null)
    }

    if (!avatar_url || !(avatar_url instanceof File)) {
      return
    }

    const ext = avatar_url.name.split('.').pop()

    if (path) {
      await supabase.storage.from('avatar').remove([path])
    }

    const result = await supabase.storage
      .from('avatar')
      .upload(`${profile.value.id}/${uuid()}.${ext}`, avatar_url)
    if (result.error) {
      throw Error('something went wrong with image upload')
    }

    if (result.data) {
      console.log(result.data)

      const publicUrl = await supabase.storage
        .from('avatar')
        .getPublicUrl(result.data.path)

      return publicUrl.data.publicUrl
    } else {
      return
    }
  }

  const updateProfile = async (data: EditProfile) => {
    if (!profile.value) {
      throw Error('booooo')
    }

    data.avatar_url = await upsertAvatar(data.avatar_url)

    return (
      supabase
        .from('profiles')
        // @ts-expect-error upsertAvatar function avoid File type to avatar_url
        .update(data)
        .eq('id', profile.value.id)
    )
  }

  const checkUsername = async (username: string) => {
    const { count } = await supabase
      .from('profiles')
      .select('username', { count: 'exact' })
      .eq('username', username)
      .maybeSingle()

    return count !== 0
  }

  const forgotPassword = (email: string) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getURL()}new-password`,
    })

  const newPassword = (password: string) =>
    supabase.auth.updateUser({ password })

  const removeContact = (id: number) =>
    supabase.from('contacts').delete().eq('id', id)

  const addContact = (data: Contact) => supabase.from('contacts').insert(data)

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
    removeContact,
    addContact,
  }
})

