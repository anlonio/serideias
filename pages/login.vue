<template>
  <VMain>
    <VContainer fluid class="fill-height">
      <VRow justify="center" align="center" class="fill-height">
        <VCol cols="6" xl="4">
          <VSheet elevation="1" class="pa-4">
            <VForm @submit.prevent="onSubmit">
              <VContainer>
                <h1>Fazer Login</h1>
                <VRow align="center" class="pt-4">
                  <VCol class="text-end">
                    <VTextField v-model="email" label="Email" type="email" />
                    <VTextField v-model="phone" label="Telefone" type="tel" />
                    <VTextField
                      v-model="password"
                      label="Senha"
                      type="password"
                    />
                    <VTextField
                      v-if="createAccount"
                      v-model="confirmPassword"
                      label="Confirme a Senha"
                      type="password"
                    />
                    <VRow>
                      <VBtn class="mr-4" variant="text">Esqueci a senha</VBtn>
                      <VSpacer />
                      <VBtn
                        color="info"
                        class="mr-4"
                        variant="text"
                        @click="createAccount = !createAccount"
                        >{{ toggleAction }}</VBtn
                      >
                      <VBtn color="success" type="submit">{{ action }}</VBtn>
                    </VRow>
                  </VCol>
                </VRow>
              </VContainer>
            </VForm>
          </VSheet>
        </VCol>
      </VRow>
    </VContainer>
  </VMain>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'auth',
})
const supabase = useSupabaseClient()

const user = useSupabaseUser()
supabase.auth.onAuthStateChange(() => {
  console.log('user: ', user.value)
})

const action = computed(() => (createAccount.value ? 'Criar conta' : 'Entrar'))
const toggleAction = computed(() =>
  createAccount.value ? 'Fazer login' : 'Criar conta',
)

const createAccount = ref(false)
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')

const onSubmit = () => {
  if (createAccount.value) {
    return signUp()
  }

  return signInWithPassword()
}

const signUp = async () => {
  if (password.value !== confirmPassword.value) return
  const { error } = await supabase.auth.signUp({
    email: email.value,
    phone: phone.value,
    password: password.value,
  })
  if (error) console.log(error)
}
const signInWithPassword = async () => {
  if (!email.value && !phone.value) return

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    phone: phone.value,
    password: password.value,
  })
  if (error) console.log(error)
}
</script>

<style></style>

