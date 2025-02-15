<template>
  <VMain>
    <VContainer>
      <VRow justify="center">
        <VCol sm="12" md="10" lg="7" xl="6" xxl="4">
          <VForm @submit.prevent="onSubmit">
            <VMainCard :loading="loading">
              <template #title>
                <span class="text-h4">Editar Perfil</span>
              </template>
              <template #text>
                <VRow>
                  <VCol cols="12" sm="6">
                    <VTextField
                      v-model="username.value.value"
                      :error-messages="username.errors.value"
                      label="usuário"
                      prefix="@"
                    />
                  </VCol>
                  <VCol cols="12" sm="6">
                    <VTextField
                      v-model="fullName.value.value"
                      :error-messages="fullName.errors.value"
                      label="Nome de exibição"
                    />
                  </VCol>
                  <VCol cols="12" sm="6">
                    <VTextField
                      v-model="website.value.value"
                      :error-messages="website.errors.value"
                      label="Website"
                    />
                  </VCol>
                  <VCol cols="12" sm="6">
                    <VTextField
                      v-model="occupation.value.value"
                      :error-messages="occupation.errors.value"
                      label="Profissão"
                    />
                  </VCol>
                  <VCol cols="12" sm="6">
                    <VTextField
                      v-model="education.value.value"
                      :error-messages="education.errors.value"
                      label="Formação Acadêmica"
                    />
                  </VCol>
                  <VCol cols="12" sm="6">
                    <VAutocomplete
                      v-model="locationId.value.value"
                      :loading="status === 'pending'"
                      :error-messages="locationId.errors.value"
                      :items="locations"
                      item-value="id"
                      item-title="name"
                      label="Sua Cidade"
                    />
                  </VCol>
                  <VCol cols="12">
                    <VTextarea
                      v-model="bio.value.value"
                      :error-messages="bio.errors.value"
                      label="Bio"
                    />
                  </VCol>
                </VRow>
              </template>
              <template #actions>
                <VBtn color="error" @click="handleReset"
                  >Cancelar alterações</VBtn
                >
                <VBtn type="submit" color="success" :loading="loading"
                  >Salvar</VBtn
                >
              </template>
            </VMainCard>
          </VForm>
        </VCol>
      </VRow>
    </VContainer>
  </VMain>
</template>

<script lang="ts" setup>
const authStore = useAuthStore()
const postStore = usePostStore()
const { locations } = storeToRefs(postStore)
const { profile, user } = storeToRefs(authStore)

const { status } = postStore.fetchLocations()
await authStore.fetchProfile(user.value?.id ?? '')

const { handleSubmit, handleReset, resetForm } = useForm({
  validationSchema: toTypedSchema(editProfileSchema),
})

const username = useField('username')
const fullName = useField('full_name')
const bio = useField('bio')
const website = useField('website')
const occupation = useField('occupation')
const education = useField('education')
const locationId = useField('location_id')

resetForm({
  values: {
    username: profile.value?.username,
    full_name: profile.value?.full_name,
    bio: profile.value?.bio ?? undefined,
    website: profile.value?.website ?? undefined,
    occupation: profile.value?.occupation ?? undefined,
    education: profile.value?.education ?? undefined,
    location_id: profile.value?.location_id ?? undefined,
  },
})

const snackbar = useSnackbar()
const loading = ref(false)

const onSubmit = handleSubmit(async (profile) => {
  try {
    loading.value = true
    const { error, status } = await authStore.updateProfile(profile)

    if (status === 409) {
      return username.setErrors('Usuário já existe')
    }

    if (error) {
      snackbar.add({
        text: error.message,
        type: 'error',
        title: 'Erro ao atualizar perfil',
      })
      return
    }

    snackbar.add({
      text: 'Perfil atualizado com sucesso',
      type: 'success',
      title: 'Show',
    })
  } catch (error) {
    console.error(error)
    snackbar.add({
      text: 'Erro no sistema. Contate o administrador',
      type: 'error',
      title: 'Erro ao atualizar perfil',
    })
  } finally {
    loading.value = false
  }
})
</script>

<style></style>

