<template>
  <v-card class="mx-auto" hover variant="outlined">
    <VCardTitle>Problema na mobilidade é pior do que parece</VCardTitle>
    <VCardSubtitle> 2 de fevereiro de 2025 </VCardSubtitle>

    <v-card-text>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat iusto
        assumenda cumque dolorum! Cupiditate quibusdam quasi dolores rem saepe
        voluptatem, ad eos ratione iure accusamus perferendis hic unde optio
        consequatur...
      </p>
      <VChipGroup>
        <VChip variant="outlined">Mobilidade Urbana</VChip>
        <VChip variant="outlined">Qualidade de vida</VChip>
        <VChip variant="outlined">Lagoa Nova</VChip>
        <VChip variant="outlined">+5</VChip>
      </VChipGroup>
    </v-card-text>
    <v-card-actions>
      <v-list-item class="w-100">
        <template v-if="$vuetify.display.smAndUp" #prepend>
          <v-avatar color="grey-darken-3" />
        </template>

        <v-list-item-title>Antonio Machado</v-list-item-title>

        <v-list-item-subtitle>Programador</v-list-item-subtitle>
        <template #append>
          <div>
            <v-icon class="me-1" icon="mdi-arrow-up-bold" />
            <span class="subheading me-2">256</span>
            <span class="me-1">·</span>
            <v-icon class="me-1" icon="mdi-comment" />
            <span class="subheading">45</span>
          </div>
        </template>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
const { post } = defineProps(['post'])
</script>

<style></style>

