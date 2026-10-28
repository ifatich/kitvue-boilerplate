<script setup lang="ts">
/**
 * @file ModalBottomSheet.vue
 * @description Official Kitvue Modal / BottomSheet responsive hybrid component.
 * On desktop (>= 768px), it presents as a centered Pegadaian modal.
 * On mobile (< 768px), it automatically adapts as an accessible bottom-sheet modal.
 */
import { useMediaQuery } from '@vueuse/core'
import CustomModal from 'kitvue-public/src/components/Modal/CustomModal.vue'

defineOptions({ name: 'ModalBottomSheet' })

const props = withDefaults(
  defineProps<{
    title?: string
    size?: string
    persistent?: boolean
    centered?: boolean
    scrollable?: boolean
    showCloseButton?: boolean
    hideDivider?: boolean
    useBottomSheet?: boolean
  }>(),
  {
    title: '',
    size: 'lg',
    persistent: false,
    centered: true,
    scrollable: false,
    showCloseButton: true,
    hideDivider: false,
    useBottomSheet: undefined,
  },
)

const model = defineModel<boolean>({ default: false })
const isMobile = useMediaQuery('(max-width: 768px)')
</script>

<template>
  <CustomModal
    v-model="model"
    :title="props.title"
    :size="props.size"
    :persistent="props.persistent"
    :centered="props.centered"
    :scrollable="props.scrollable"
    :showCloseButton="props.showCloseButton"
    :hideDivider="props.hideDivider"
    :useBottomSheet="props.useBottomSheet !== undefined ? props.useBottomSheet : isMobile"
  >
    <template #body>
      <slot name="body">
        <slot />
      </slot>
    </template>
    <template #footer v-if="$slots.footer">
      <slot name="footer" />
    </template>
  </CustomModal>
</template>
