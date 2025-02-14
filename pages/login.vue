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
                    <VTextField
                      v-model="email.value.value"
                      :error-messages="email.errors.value"
                      label="Email"
                      type="email"
                    />
                    <VTextField
                      v-model="password.value.value"
                      :error-messages="password.errors.value"
                      label="Senha"
                      type="password"
                    />
                    <VRow class="pt-4">
                      <VBtn class="mr-4" variant="text">Esqueci a senha</VBtn>
                      <VSpacer />
                      <VBtn
                        color="info"
                        class="mr-4"
                        variant="text"
                        to="/register"
                        >Criar conta</VBtn
                      >
                      <VBtn color="success" type="submit">Entrar</VBtn>
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
import { toTypedSchema } from '@vee-validate/zod'
definePageMeta({
  layout: 'auth',
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(signInUserSchema),
})

const email = useField('email')
const password = useField('password')

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const router = useRouter()
watch(
  () => user.value,
  (value) => {
    if (value) {
      router.push('/')
    }
  },
)

const { t } = useI18n()
const snackbar = useSnackbar()

const loading = ref(false)

const onSubmit = handleSubmit(async (data) => {
  try {
    loading.value = true
    const { error } = await authStore.signIn(data)

    if (error) {
      snackbar.add({
        text: t(`supabase.errors.${error.code}`),
        type: 'error',
        title: 'Erro ao efetuar login',
      })
      return
    }
  } catch (error) {
    console.error(error)
    snackbar.add({
      text: 'Erro no sistema. Contate o administrador',
      type: 'error',
      title: 'Erro ao efetuar login',
    })
  } finally {
    loading.value = false
  }
})
</script>

<style></style>

