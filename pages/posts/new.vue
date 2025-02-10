<template>
  <VMain class="mt-4">
    <VForm>
      <h1 class="text-center">Nova Publicação</h1>
      <VContainer>
        <VRow justify="center">
          <VCol sm="12" md="10" lg="4" xl="5">
            <VRow>
              <VCol>
                <VTextField label="Título" variant="outlined" />
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <VTextarea
                  variant="outlined"
                  label="Conteúdo"
                  placeholder="Escreva sua ideia aqui..."
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <VCombobox
                  multiple
                  label="palavras-chave"
                  chips
                  variant="outlined"
                >
                  <template #details>
                    <span
                      >Pressione <kbd>Enter</kbd> para adicionar a
                      palavra-chave</span
                    >
                  </template>
                </VCombobox>
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <VAutocomplete
                  v-model="location"
                  variant="outlined"
                  :items="locations"
                  item-title="name"
                  item-value="id"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <VBtn color="success" block>Criar Publicação</VBtn>
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

const location = ref(null)
</script>

<style></style>

