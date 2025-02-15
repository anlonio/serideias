<template>
  <VMain>
    <VContainer fluid class="fill-height">
      <VRow justify="center" align="center" class="fill-height">
        <VCol cols="6" xl="4">
          <VSheet elevation="1" class="pa-4">
            <VForm @submit.prevent="onSubmit">
              <VContainer>
                <h1>Nova senha</h1>
                <VRow align="center" class="pt-4">
                  <VCol class="text-end">
                    <VTextField
                      v-model="password.value.value"
                      :error-messages="password.errors.value"
                      label="Senha"
                      type="password"
                    />
                    <VTextField
                      v-model="confirmPassword.value.value"
                      :error-messages="confirmPassword.errors.value"
                      label="Confirme a Senha"
                      type="password"
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
  validationSchema: toTypedSchema(newPasswordSchema),
})

const password = useField('password.password')
const confirmPassword = useField('password.confirmPassword')

const authStore = useAuthStore()

const loading = ref(false)
const snackbar = useSnackbar()
const { t } = useI18n()

const route = useRoute()

const hashParams = new URLSearchParams(route.hash)

if (hashParams.get('error_code')) {
  snackbar.add({
    text: t(`supabase.errors.${hashParams.get('error_code')}`),
    type: 'error',
    title: 'Erro ao cadastrar nova senha',
  })
}

const onSubmit = handleSubmit(async (data) => {
  try {
    loading.value = true
    const { error } = await authStore.newPassword(data.password)
    if (error) {
      snackbar.add({
        text: t(`supabase.errors.${error.code}`),
        type: 'error',
        title: 'Erro ao cadastrar nova senha',
      })
      return
    }

    snackbar.add({
      text: 'Sua nova senha foi cadastrada',
      type: 'success',
      title: 'Cadastro feito com sucesso',
    })
  } catch (error) {
    console.error(error)
    snackbar.add({
      text: 'Erro no sistema. Contate o administrador',
      type: 'error',
      title: 'Erro ao cadastrar nova senha',
    })
  } finally {
    loading.value = false
  }
})
</script>

<style></style>

