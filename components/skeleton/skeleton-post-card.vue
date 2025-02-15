<template>
  <VMainCard class="mx-auto">
    <template #title>
      <VSkeletonLoader type="text" width="50%" />
    </template>
    <template #subtitle>
      <VSkeletonLoader type="text" width="25%" />
    </template>
    <template #text>
      <VSkeletonLoader type="paragraph" />
      <VSkeletonLoader type="chip@3" />
    </template>
    <VRow>
      <VCol>
        <VSkeletonLoader type="list-item-avatar-two-line" />
      </VCol>
      <VCol>
        <VSkeletonLoader type="actions" />
      </VCol>
    </VRow>
  </VMainCard>
</template>

<script lang="ts" setup></script>

<style></style>

