<template>
  <VMain>
    <VContainer>
      <VRow justify="center" sa>
        <VCol sm="12" md="10" lg="4" xl="5" v-for="n in 10" :key="n">
          <PostItem></PostItem>
        </VCol>
      </VRow>
    </VContainer>
  </VMain>
</template>

<script lang="ts" setup>
definePageMeta({
  title: 'Serideias',
  name: 'posts',
})
</script>

<style></style>

