<template>
  <VListItem
    :prepend-icon="getContactIcon(contact.type)"
    :title="contact.contact"
    :subtitle="contact.label"
  >
    <template #append>
      <VBtn
        icon="mdi-delete"
        variant="plain"
        :loading="loading"
        @click="removeContact(contact.id)"
      ></VBtn>
    </template>
  </VListItem>
</template>

<script lang="ts" setup>
const { contact } = defineProps<{ contact: ContactsRow }>()
const getContactIcon = useContactIcon()
const authStore = useAuthStore()

const snackbar = useSnackbar()
const { t } = useI18n()

const loading = ref(false)

const removeContact = async (id: number) => {
  try {
    loading.value = true
    const { error } = await authStore.removeContact(id)
    if (error) {
      snackbar.add({
        title: 'Erro ao remover contato',
        type: 'error',
        text: t(`supabase.errors.${error.code}`),
      })
      return
    }
    await authStore.fetchProfile()
    snackbar.add({
      title: 'Show',
      text: 'Contato removido com sucesso',
      type: 'success',
    })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style></style>

