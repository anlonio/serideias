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
              <template v-if="!$vuetify.display.xs" #append>
                <template
                  v-if="
                    avatarUrl.value.value !== null &&
                    (previewAvatar || profile?.avatar_url)
                  "
                >
                  <VBtn
                    append-icon="mdi-pencil"
                    variant="plain"
                    density="compact"
                    slim
                    @click="open()"
                  >
                    alterar
                  </VBtn>
                  <VBtn
                    variant="plain"
                    density="compact"
                    slim
                    color="error"
                    append-icon="mdi-delete"
                    @click="avatarUrl.setValue(null)"
                  >
                    remover
                  </VBtn>
                </template>
                <VBtn v-else append-icon="mdi-pencil" @click="open()">
                  Adicionar foto
                </VBtn>
                <VAvatar
                  v-if="
                    avatarUrl.value.value !== null &&
                    (previewAvatar || profile?.avatar_url)
                  "
                  size="80"
                  :image="(previewAvatar || profile?.avatar_url) ?? ''"
                >
                </VAvatar>
                <VAvatar v-else size="80" image="/public/account-circle.png" />
              </template>
              <template #text>
                <template v-if="$vuetify.display.xs">
                  <VRow>
                    <VDivider></VDivider>
                    <VCol>
                      <VListSubheader class="text-h6">
                        Foto de perfil
                      </VListSubheader>
                    </VCol>
                  </VRow>
                  <VRow>
                    <VCol>
                      <VAvatar
                        v-if="
                          avatarUrl.value.value !== null &&
                          (previewAvatar || profile?.avatar_url)
                        "
                        size="80"
                        :image="(previewAvatar || profile?.avatar_url) ?? ''"
                      >
                      </VAvatar>
                      <VAvatar
                        v-else
                        size="80"
                        image="/public/account-circle.png"
                      />
                      <template
                        v-if="
                          avatarUrl.value.value !== null &&
                          (previewAvatar || profile?.avatar_url)
                        "
                      >
                        <VBtn
                          append-icon="mdi-pencil"
                          variant="plain"
                          density="compact"
                          slim
                          @click="open()"
                        >
                          alterar
                        </VBtn>
                        <VBtn
                          variant="plain"
                          density="compact"
                          slim
                          color="error"
                          append-icon="mdi-delete"
                          @click="avatarUrl.setValue(null)"
                        >
                          remover
                        </VBtn>
                      </template>
                      <VBtn v-else append-icon="mdi-pencil" @click="open()">
                        Adicionar foto
                      </VBtn>
                    </VCol>
                  </VRow>
                  <VRow>
                    <VDivider></VDivider>
                    <VCol>
                      <VListSubheader class="text-h6">
                        Dados Pessoais
                      </VListSubheader>
                    </VCol>
                  </VRow>
                </template>
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
                      auto-grow
                      rows="2"
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
        <VCol sm="12" md="10" lg="5" xl="6" xxl="4">
          <VMainCard>
            <template #title>
              <span class="text-h4">Adicionar contato</span>
            </template>
            <template #text>
              <FormContacts />
              <VDivider></VDivider>
              <VList>
                <VListSubheader>Contatos</VListSubheader>
                <FormContactItem
                  v-for="contact in profile?.contacts"
                  :key="contact.id"
                  :contact="contact"
                />
              </VList>
              <p
                v-if="profile?.contacts?.length === 0"
                class="text-caption text-center pt-2"
              >
                Nenhum contato cadastrado.
              </p>
            </template>
          </VMainCard>
        </VCol>
      </VRow>
    </VContainer>
  </VMain>
</template>

<script lang="ts" setup>
const authStore = useAuthStore()
const postStore = usePostStore()
const { locations } = storeToRefs(postStore)
const { profile } = storeToRefs(authStore)

const { status } = postStore.fetchLocations()
await useAsyncData('profile', async () => await authStore.fetchProfile())

const { file, open } = useFileSystemAccess({
  types: [
    {
      accept: {
        'images/*': ['.png', '.jpeg', '.jpg'],
      },
    },
  ],
  dataType: 'Blob',
})

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
const avatarUrl = useField('avatar_url')
const previewAvatar = ref('')

watch(file, (newFile) => {
  if (newFile) {
    // Converte o arquivo para uma URL
    avatarUrl.value.value = newFile
    previewAvatar.value = URL.createObjectURL(newFile)
  }
})

resetForm({
  values: {
    username: profile.value?.username,
    full_name: profile.value?.full_name,
    avatar_url: profile.value?.avatar_url ?? undefined,
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

    await authStore.fetchProfile()
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

