<template>
  <VMain>
    <VContainer fluid class="fill-height">
      <VRow justify="center" align="center" class="fill-height">
        <VCol cols="6" xl="4">
          <VSheet elevation="1" class="pa-4">
            <VForm @submit.prevent="onSubmit">
              <VContainer>
                <h1>Criar Conta</h1>
                <VRow align="center" class="pt-4">
                  <VCol class="text-end">
                    <VTextField
                      v-model="fullName.value.value"
                      :error-messages="fullName.errors.value"
                      label="Seu nome"
                    />
                    <VTextField
                      v-model="username.value.value"
                      :error-messages="username.errors.value"
                      label="Seu usuário"
                      type="email"
                      prefix="@"
                    />
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
                    <VTextField
                      v-model="confirmPassword.value.value"
                      :error-messages="confirmPassword.errors.value"
                      label="Confirme a Senha"
                      type="password"
                    />
                    <VRow class="pt-4">
                      <VBtn class="mr-4" variant="text">Esqueci a senha</VBtn>
                      <VSpacer />
                      <VBtn color="info" class="mr-4" variant="text" to="/login"
                        >Fazer Login</VBtn
                      >
                      <VBtn color="success" type="submit">Cadastrar</VBtn>
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
  validationSchema: toTypedSchema(signUpUserSchema),
})

const email = useField('email')
const password = useField('password.password')
const confirmPassword = useField('password.confirmPassword')

const username = useField('username')
const fullName = useField('fullName')

const authStore = useAuthStore()

const onSubmit = handleSubmit(async (data) => {
  const result = await useAsyncData('signUp', () => authStore.signUp(data))
  console.log(result)
})
</script>

<style></style>

