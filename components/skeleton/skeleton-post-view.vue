<template>
  <VRow justify="center">
    <VCol sm="12" md="10" lg="8" xl="5">
      <VRow justify="center" class="pt-4">
        <VCol> <VSkeletonLoader type="heading" /></VCol>
      </VRow>
      <VRow>
        <VCol> <VSkeletonLoader type="list-item-avatar-three-line" /></VCol>
      </VRow>
      <VRow>
        <VDivider />
      </VRow>
      <VRow>
        <VCol class="py-4">
          <VSkeletonLoader type="article" />
          <br />
          <VChipGroup>
            <VSkeletonLoader type="chip" />
            <VSkeletonLoader type="chip" />
            <VSkeletonLoader type="chip" />
          </VChipGroup>
        </VCol>
      </VRow>
      <VRow>
        <VDivider />
      </VRow>
      <VRow>
        <VCol>
          <span class="text-h4"> Respostas </span>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VTextField
            readonly
            placeholder="Comentar algo sobre"
            variant="filled"
            counter
            maxlength="200"
          >
            <template #append-inner>
              <VBtn
                readonly
                icon="mdi-send"
                variant="plain"
                density="compact"
                :ripple="false"
              />
            </template>
          </VTextField>
        </VCol>
      </VRow>
      <VRow>
        <VDivider />
      </VRow>
      <VRow>
        <VCol>
          <VRow>
            <VCol class="pa-0 ma-0">
              <VSkeletonLoader type="list-item-avatar-three-line" />
            </VCol>
          </VRow>
        </VCol>
        <VDivider />
      </VRow>
    </VCol>
  </VRow>
</template>

<script lang="ts" setup></script>

<style></style>
