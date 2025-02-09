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
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().email(),
      password: z.string(),
    }),
  ),
})

const email = useField('email')
const password = useField('password')

const onSubmit = handleSubmit((value) => {
  console.log(value)
})

// const signInWithPassword = async () => {
//   if (!email.value) return

//   const { error } = await supabase.auth.signInWithPassword({
//     email: email.value,
//     password: password.value,
//   })
//   if (error) console.log(error)
// }
</script>

<style></style>

