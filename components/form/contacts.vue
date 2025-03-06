<template>
  <VForm @submit.prevent="onSubmit">
    <VRow>
      <VCol cols="6" sm="3" lg="6" xxl="3">
        <VSelect
          v-model="type.value.value"
          :items="contactType"
          item-value="value"
          item-title="title"
          label="Tipo"
          required
        >
          <template #item="{ item, props }">
            <VListItem
              :prepend-icon="getContactIcon(item.value)"
              :title="item.title"
              v-bind="props"
            >
            </VListItem>
          </template>
        </VSelect>
      </VCol>
      <VCol cols="6" sm="3" lg="6" xxl="3">
        <VTextField
          v-model="label.value.value"
          label="Apelido"
          placeholder="Pessoal"
          required
        ></VTextField>
      </VCol>
      <VCol cols="12" sm="6" lg="12" xxl="6">
        <VTextField
          v-model="contact.value.value"
          :prepend-inner-icon="getContactIcon(type.value.value)"
          label="Contato"
          required
        >
          <template #append>
            <VBtn
              type="submit"
              :loading="loading"
              icon="mdi-content-save"
              variant="plain"
              slim
            />
          </template>
        </VTextField>
      </VCol>
    </VRow>
  </VForm>
</template>

<script lang="ts" setup>
const authStore = useAuthStore()

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(contactSchema),
})

const snackbar = useSnackbar()
const { t } = useI18n()

const onSubmit = handleSubmit(async (data) => {
  try {
    loading.value = true
    const { error } = await authStore.addContact(data)
    if (error) {
      snackbar.add({
        title: 'Erro ao adicionar contato',
        type: 'error',
        text: t(`supabase.errors.${error.code}`),
      })
      return
    }
    await authStore.fetchProfile()
    resetForm()
    snackbar.add({
      title: 'Show',
      text: 'Contato adicionado com sucesso',
      type: 'success',
    })
  } catch (error) {
    console.error(error)
    snackbar.add({
      title: 'Erro ao adicionar contato',
      type: 'error',
      text: 'Erro desconhecido. Contate o administrador',
    })
  } finally {
    loading.value = false
  }
})

const contact = useField('contact')
const label = useField('label')
const type = useField<string>('type')

const loading = ref(false)

const getContactIcon = useContactIcon()

const contactType = [
  { value: 'email', title: 'E-mail' },
  { value: 'phone', title: 'Telefone' },
  { value: 'whatsapp', title: 'Whatsapp' },
  { value: 'other', title: 'Outro' },
]

watch(type.value, (value) => {
  label.setValue(contactType.find((t) => t.value === value)?.['title'])
})
</script>

<style></style>

