<template>
  <VMain>
    <VContainer fluid class="fill-height">
      <VRow justify="center" align="center" class="fill-height">
        <VCol cols="12" sm="8" lg="5" xl="4">
          <VSheet elevation="1" class="pa-4">
            <VForm @submit.prevent="onSubmit">
              <VContainer>
                <h1>Fazer Login</h1>
                <VRow align="center" class="pt-4">
                  <VCol>
                    <VTextField
                      v-model="email.value.value"
                      :error="!!authError"
                      :error-messages="email.errors.value"
                      label="Email"
                      type="email"
                    />
                  </VCol>
                </VRow>
                <VRow>
                  <VCol>
                    <VTextField
                      v-model="password.value.value"
                      :error="!!authError"
                      :error-messages="password.errors.value"
                      label="Senha"
                      type="password"
                    />
                  </VCol>
                </VRow>
                <VExpandTransition>
                  <VAlert
                    v-if="authError"
                    density="compact"
                    type="error"
                    :title="authError"
                  />
                </VExpandTransition>
                <VRow v-if="$vuetify.display.xs" class="pt-4" justify="end">
                  <VBtn
                    class="mr-4 text-none"
                    variant="text"
                    to="/forgot-password"
                  >
                    Esqueci a senha
                  </VBtn>
                </VRow>
                <VRow class="pt-4" justify="end" justify-sm="start">
                  <VBtn
                    v-if="!$vuetify.display.xs"
                    class="mr-4 text-none"
                    variant="text"
                    to="/forgot-password"
                  >
                    Esqueci a senha
                  </VBtn>
                  <VSpacer />
                  <VBtn color="info" class="mr-4" variant="text" to="/register">
                    Criar conta
                  </VBtn>
                  <VBtn color="success" type="submit" :loading="loading">
                    Entrar
                  </VBtn>
                </VRow>
              </VContainer>
            </VForm>
          </VSheet>
          <VBtn block color="info" variant="plain" class="text-none" to="/">
            Voltar para o início
          </VBtn>
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
const authError = ref('')

const loading = ref(false)

const onSubmit = handleSubmit(async (data) => {
  try {
    loading.value = true
    const { error } = await authStore.signIn(data)

    if (error) {
      authError.value = t(`supabase.errors.${error.code}`)
      loading.value = false
      return
    }
    authError.value = ''
  } catch (error) {
    console.error(error)
    authError.value = 'Erro no sistema. Contate o administrador'
  }
})
</script>

<style></style>

