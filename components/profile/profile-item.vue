<template>
  <VListItem
    class="pa-0"
    :title="author.full_name"
    :subtitle="`@${author.username}`"
  >
    <template #subtitle>
      <span>@{{ author.username }}</span>
      <VDivider vertical length="15" thickness="1" class="mx-2" />
      <VIcon size="16" icon="mdi-map-marker" />
      <span class="text-caption">
        {{ author.location?.name }}
      </span>
    </template>
    <template #prepend>
      <VIcon v-if="!author.avatar_url" icon="mdi-account-circle" size="48" />
      <VAvatar v-else :image="author.avatar_url ?? ''" />
    </template>
    <template #default>
      <div>
        <span class="text-caption">{{ showCreatedAt }}</span>
      </div>
    </template>
    <template #append>
      <slot name="append" />
    </template>
  </VListItem>
</template>

<script lang="ts" setup>
import { useDate } from 'vuetify'

const { author, createdAt } = defineProps<{
  author: ProfilesRow
  createdAt: string
}>()

const showCreatedAt = useDate().format(createdAt, 'fullDateWithWeekday')
</script>

<style></style>

