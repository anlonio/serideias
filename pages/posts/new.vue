<template>
  <VMain class="mt-4">
    <VForm @submit.prevent="onSubmit">
      <h1 class="text-center">Nova Publicação</h1>
      <VContainer>
        <VRow justify="center">
          <VCol sm="12" md="10" lg="8" xl="5">
            <VRow>
              <VCol>
                <VTextField
                  v-model="title.value.value"
                  :error-messages="title.errors.value"
                  label="Título"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <ClientOnly>
                  <VuetifyTiptap
                    v-model="content.value.value"
                    markdown-theme="github"
                  ></VuetifyTiptap>
                </ClientOnly>
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <VCombobox
                  v-model="keywords.value.value"
                  :error-messages="keywords.errors.value"
                  multiple
                  label="palavras-chave"
                  chips
                >
                  <template #details>
                    <span
                      >Pressione <code>Enter</code> para adicionar a
                      palavra-chave</span
                    >
                  </template>
                </VCombobox>
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <VAutocomplete
                  v-model="location.value.value"
                  :error-messages="location.errors.value"
                  :items="locations"
                  item-title="name"
                  item-value="id"
                  label="Cidade"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <VBtn color="success" type="submit" block :loading="loading"
                  >Criar Publicação</VBtn
                >
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VContainer>
    </VForm>
  </VMain>
</template>

<script lang="ts" setup>
import { locale } from 'vuetify-pro-tiptap'

const postStore = usePostStore()
const authStore = useAuthStore()
await postStore.fetchLocations()
const { locations } = storeToRefs(postStore)
const { profile } = storeToRefs(authStore)

const { handleSubmit } = useForm({
  initialValues: {
    location_id: profile.value?.location_id ?? null,
    title: '',
    content: '',
  },
  validationSchema: toTypedSchema(newPostSchema),
})

const title = useField('title')
const content = useField<string>('content')
const keywords = useField<string[]>('keywords')
const location = useField('location_id')

const loading = ref(false)

const router = useRouter()
const snackbar = useSnackbar()

const onSubmit = handleSubmit(async (post) => {
  try {
    loading.value = true
    const { error, data } = await postStore.createPost(post)
    if (error) {
      snackbar.add({
        text: error.message,
        type: 'error',
        title: 'Erro ao atualizar perfil',
      })
      return
    }
    router.push(`/posts/${data?.uuid}`)
  } catch (error) {
    console.error(error)
    snackbar.add({
      text: 'Erro no sistema. Contate o administrador',
      type: 'error',
      title: 'Erro ao criar publicação',
    })
  } finally {
    loading.value = false
  }
})

locale.setMessage('ptBr', tipTapLocale)
locale.setLang('ptBr')
</script>

<style></style>

