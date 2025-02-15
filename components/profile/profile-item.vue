<template>
  <VMenu
    open-on-hover
    :open-on-click="$vuetify.display.platform.touch"
    class="w-auto"
  >
    <template #activator="{ props }">
      <VListItem
        class="pa-0 no-hover"
        v-bind="props"
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
          <VAvatar v-if="author.avatar_url" :image="author.avatar_url" />
          <VAvatar v-else image="/public/account-circle.png" />
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
    <VCard
      width="420px"
      :title="author.full_name"
      :subtitle="`@${author.username}`"
    >
      <template #append>
        <VAvatar
          v-if="author.avatar_url"
          size="80"
          :image="author.avatar_url"
        />
        <VAvatar v-else size="80" image="/public/account-circle.png" />
      </template>
      <VCardText>
        <VBtn
          v-if="author.location"
          prepend-icon="mdi-map-marker"
          variant="text"
          class="text-none"
          density="compact"
          slim
          readonly
          >{{ author.location.name }}</VBtn
        >
        <br />
        <VBtn
          v-if="author.website"
          prepend-icon="mdi-web"
          variant="text"
          class="text-none"
          density="compact"
          slim
          target="_blank"
          >{{ author.website }}</VBtn
        >
        <br />
        <VBtn
          v-if="author.occupation"
          prepend-icon="mdi-briefcase"
          variant="text"
          class="text-none"
          density="compact"
          slim
          readonly
          >{{ author.occupation }}</VBtn
        >
        <br />
        <VBtn
          v-if="author.education"
          prepend-icon="mdi-school"
          variant="text"
          class="text-none"
          density="compact"
          slim
          readonly
          >{{ author.education }}</VBtn
        >
        <br />
        <br />
        <p>{{ author.bio }}</p>
      </VCardText>
    </VCard></VMenu
  >
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

