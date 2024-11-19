<template>
  <VMain>
    <VContainer>
      <VRow justify="center">
        <VCol md="6" lg="4" xl="3">
          <VCard class="mx-auto">
            <template #title> Preciso fazer meu TCC </template>
            <template #text>
              <p>
                Esse é o problema mór. Sem sua solução, nenhum outro problema
                será solucionado nesse projeto.
              </p>
            </template>
            <template #actions>
              <VBtn color="success">Solucionar</VBtn>
              <VTooltip text="Nem tenta, não é uma solução">
                <template #activator="{ props }">
                  <VBtn v-bind="props" :ripple="false" variant="plain">
                    <VBtn color="error" disabled> Desistir </VBtn>
                  </VBtn>
                </template>
              </VTooltip>
            </template>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </VMain>
</template>

<script lang="ts" setup>
definePageMeta({
  title: 'Problemas',
  name: 'problems',
})
</script>

<style></style>

