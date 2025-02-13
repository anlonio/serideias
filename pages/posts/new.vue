<template>
  <VMain class="mt-4">
    <VForm @submit.prevent="onSubmit">
      <h1 class="text-center">Nova Publicação</h1>
      <VContainer>
        <VRow justify="center">
          <VCol sm="12" md="10" lg="4" xl="5">
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
                <VTextarea
                  v-model="content.value.value"
                  :error-messages="content.errors.value"
                  label="Conteúdo"
                  placeholder="Escreva sua ideia aqui..."
                />
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
definePageMeta({
  title: 'Nova Publicação',
})

const postStore = usePostStore()
await postStore.fetchLocations()
const { locations } = storeToRefs(postStore)

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(newPostSchema),
})

const title = useField('title')
const content = useField('content')
const keywords = useField<string[]>('keywords')
const location = useField('location_id')

const loading = ref(false)

const router = useRouter()

const onSubmit = handleSubmit(async (post) => {
  loading.value = true
  await postStore.createPost(post)
  loading.value = false
  router.push('/')
})
</script>

<style></style>

