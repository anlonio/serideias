<template>
  <VMain>
    <VContainer fluid class="fill-height">
      <VRow justify="center" align="center" class="fill-height">
        <VCol cols="6" xl="4">
          <VSheet elevation="1" class="pa-4">
            <VForm @submit.prevent="onSubmit">
              <VContainer>
                <h1>Esqueci a senha</h1>
                <VRow align="center" class="pt-4">
                  <VCol class="text-end">
                    <VTextField
                      v-model="email.value.value"
                      :error-messages="email.errors.value"
                      label="Email"
                      type="email"
                    />
                  </VCol>
                </VRow>
                <VRow class="pt-4">
                  <VBtn class="mr-4" variant="text">Fazer login</VBtn>
                  <VSpacer />
                  <VBtn color="success" type="submit" :loading="loading">
                    Solicitar e-mail
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
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().email(),
    }),
  ),
})

const email = useField('email')

const authStore = useAuthStore()

const loading = ref(false)
const snackbar = useSnackbar()
const { t } = useI18n()

const onSubmit = handleSubmit(async (data) => {
  try {
    loading.value = true
    const { error } = await authStore.forgotPassword(data.email)
    if (error) {
      snackbar.add({
        text: t(`supabase.errors.${error.code}`),
        type: 'error',
        title: 'Erro ao solicitar e-mail',
      })
      return
    }

    snackbar.add({
      text: 'Caso exista uma conta associada, você receberá um link de recuperação de senha',
      type: 'success',
      title: 'Solicitação enviada',
    })
  } catch (error) {
    console.error(error)
    snackbar.add({
      text: 'Erro no sistema. Contate o administrador',
      type: 'error',
      title: 'Erro ao solicitar e-mail',
    })
  } finally {
    loading.value = false
  }
})
</script>

<style></style>

