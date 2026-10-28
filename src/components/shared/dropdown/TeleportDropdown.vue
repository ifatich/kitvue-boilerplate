<script setup lang="ts">
/**
 * TeleportDropdown — G-Kit styled select dropdown with body-teleported menu.
 * Styling is identical to kitvue's InputDropdown.vue while solving container
 * clipping issues in scrollable modals (such as BaseModal with overflow-y: auto).
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

defineOptions({ name: 'TeleportDropdown', inheritAttrs: false })

export interface DropdownItem {
  [key: string]: unknown
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    items: DropdownItem[]
    itemValue?: string
    itemText?: string
    itemDisabled?: string
    label?: string
    placeholder?: string
    name?: string
    id?: string
    class?: string
    disabled?: boolean
    loading?: boolean
    color?: string
    chevron?: string
    searchable?: boolean
    error?: string
    zIndex?: number
  }>(),
  {
    modelValue: '',
    itemValue: 'value',
    itemText: 'label',
    itemDisabled: 'disabled',
    label: undefined,
    placeholder: 'Pilih',
    name: undefined,
    id: undefined,
    class: '',
    disabled: false,
    loading: false,
    color: 'default',
    chevron: 'chevronDefault',
    searchable: undefined,
    error: undefined,
    zIndex: 12000, // Harus lebih tinggi dari BaseModal overlay (z-index: 11000)
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number, item: DropdownItem | undefined]
  open: []
  close: []
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const triggerRef = ref<HTMLButtonElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const menuRef = ref<HTMLDivElement | null>(null)

const menuTop = ref(0)
const menuLeft = ref(0)
const menuWidth = ref(0)
const menuMaxHeight = ref(358)
const opensUpward = ref(false)

const isSearchEnabled = computed(() => {
  if (typeof props.searchable === 'boolean') {
    return props.searchable
  }
  return (props.items?.length ?? 0) > 10
})

const selectedItem = computed(() => {
  if (!props.items || props.items.length === 0) return undefined
  if (props.modelValue === undefined || props.modelValue === null || props.modelValue === '') {
    return props.items.find(
      (item) => item[props.itemValue] === props.modelValue || (item[props.itemValue] === '' && props.modelValue === ''),
    )
  }
  return props.items.find((item) => String(item[props.itemValue]) === String(props.modelValue))
})

const selectedText = computed(() => {
  if (selectedItem.value) {
    return String(selectedItem.value[props.itemText] ?? '')
  }
  return ''
})

function isOptionSelected(item: DropdownItem): boolean {
  if (props.modelValue === undefined || props.modelValue === null || props.modelValue === '') {
    return item[props.itemValue] === props.modelValue || (item[props.itemValue] === '' && props.modelValue === '')
  }
  return String(item[props.itemValue]) === String(props.modelValue)
}

const filteredItems = computed(() => {
  if (!props.items) return []
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return props.items
  return props.items.filter((item) => {
    const text = String(item[props.itemText] ?? '').toLowerCase()
    return text.includes(q)
  })
})

function updatePosition() {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  const gap = 4
  const padding = 8

  // If trigger is scrolled out of viewport, close dropdown
  if (rect.bottom < 0 || rect.top > window.innerHeight) {
    closeDropdown()
    return
  }

  let menuHeight = menuRef.value?.offsetHeight || 0
  if (!menuHeight) {
    const count = filteredItems.value.length
    menuHeight = Math.min(358, count * 52 + (isSearchEnabled.value ? 60 : 32))
  }

  const spaceBelow = Math.max(0, window.innerHeight - rect.bottom - gap - padding)
  const spaceAbove = Math.max(0, rect.top - gap - padding)

  const shouldFlip = spaceBelow < Math.min(menuHeight, 180) && spaceAbove > spaceBelow
  opensUpward.value = shouldFlip

  if (shouldFlip) {
    const available = Math.min(358, spaceAbove)
    menuMaxHeight.value = Math.max(120, available)
    menuTop.value = Math.max(padding, rect.top - Math.min(menuHeight, menuMaxHeight.value) - gap)
  } else {
    const available = Math.min(358, spaceBelow)
    menuMaxHeight.value = Math.max(120, available)
    menuTop.value = rect.bottom + gap
  }

  const maxAllowedWidth = Math.max(120, window.innerWidth - padding * 2)
  menuWidth.value = Math.min(rect.width, maxAllowedWidth)
  menuLeft.value = Math.max(padding, Math.min(rect.left, window.innerWidth - menuWidth.value - padding))
}

function toggleDropdown() {
  if (props.disabled || props.loading) return
  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown()
  }
}

function openDropdown() {
  if (props.disabled || props.loading) return
  searchQuery.value = ''
  updatePosition()
  isOpen.value = true
  emit('open')

  nextTick(() => {
    updatePosition()
    if (isSearchEnabled.value && searchInputRef.value) {
      searchInputRef.value.focus()
    }
  })
}

function closeDropdown() {
  if (!isOpen.value) return
  isOpen.value = false
  searchQuery.value = ''
  emit('close')
}

function handleOptionClick(item: DropdownItem) {
  if (Boolean(item[props.itemDisabled])) return
  const val = item[props.itemValue] as string | number
  emit('update:modelValue', val)
  emit('change', val, item)
  closeDropdown()
}

function handlePointerDownOutside(event: PointerEvent) {
  if (!isOpen.value) return
  const target = event.target as Node | null
  if (!target) return

  if (triggerRef.value?.contains(target)) return
  if (menuRef.value?.contains(target)) return

  closeDropdown()
}

function handleKeydown(event: KeyboardEvent) {
  if (!isOpen.value) return
  if (event.key === 'Escape') {
    closeDropdown()
    triggerRef.value?.focus()
  }
}

function handleWindowChange() {
  if (isOpen.value) {
    updatePosition()
  }
}

watch(isOpen, (open) => {
  if (open) {
    window.addEventListener('pointerdown', handlePointerDownOutside)
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('resize', handleWindowChange)
    window.addEventListener('scroll', handleWindowChange, true)
  } else {
    window.removeEventListener('pointerdown', handlePointerDownOutside)
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('resize', handleWindowChange)
    window.removeEventListener('scroll', handleWindowChange, true)
  }
})

watch(
  () => props.disabled,
  (val) => {
    if (val && isOpen.value) {
      closeDropdown()
    }
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', handlePointerDownOutside)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleWindowChange)
  window.removeEventListener('scroll', handleWindowChange, true)
})
</script>

<template>
  <div :class="['group-input', props.class, { 'dd-error': Boolean(error) }]">
    <label v-if="label" :for="id" class="form-label">
      {{ label }}
      <slot name="label-icon" />
    </label>

    <button
      :id="id"
      ref="triggerRef"
      type="button"
      :class="[
        'btn btn-secondary dropdown-toggle w-100 gkit-dd d-flex justify-content-between align-items-center',
        `type-${color}`,
        { show: isOpen },
      ]"
      :name="name"
      :disabled="disabled || loading"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      @click="toggleDropdown"
    >
      <slot name="button-content">
        <p
          class="dropdown-placeholder overflow-hidden my-auto text-ellipsis"
          :style="[
            selectedText ? 'color: #252528 !important' : '',
            !selectedText ? 'color: #939597' : '',
          ]"
        >
          {{ selectedText || placeholder }}
        </p>
      </slot>

      <slot name="icon-right">
        <span>
          <svg
            :class="[chevron, isOpen ? 'dropdown-open' : 'dropdown-close', 'icon-dropdown']"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.1225 9.70253L12.0025 13.5825L15.8825 9.70253C16.2725 9.31253 16.9025 9.31253 17.2925 9.70253C17.6825 10.0925 17.6825 10.7225 17.2925 11.1125L12.7025 15.7025C12.3125 16.0925 11.6825 16.0925 11.2925 15.7025L6.7025 11.1125C6.3125 10.7225 6.3125 10.0925 6.7025 9.70253C7.0925 9.32253 7.7325 9.31253 8.1225 9.70253Z"
            />
          </svg>
        </span>
      </slot>
    </button>

    <div v-if="error" class="error-text mt-2">
      {{ error }}
    </div>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="menuRef"
        class="teleport-dropdown-menu"
        :style="{
          position: 'fixed',
          top: `${menuTop}px`,
          left: `${menuLeft}px`,
          width: `${menuWidth}px`,
          maxHeight: `${menuMaxHeight}px`,
          zIndex: zIndex,
        }"
        role="listbox"
      >
        <div v-if="isSearchEnabled" class="search-dropdown">
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            class="form-control mb-0"
            :placeholder="'Cari ' + (label ? label.toLowerCase() : '')"
            @click.stop
          />
        </div>

        <ul class="teleport-dropdown-list">
          <li
            v-for="option in filteredItems"
            :key="String(option[itemValue])"
            role="presentation"
          >
            <button
              type="button"
              class="dropdown-item"
              :class="{ disabled: Boolean(option[itemDisabled]) }"
              :disabled="Boolean(option[itemDisabled])"
              role="option"
              :aria-selected="isOptionSelected(option)"
              @click="handleOptionClick(option)"
            >
              <div
                class="list-dropdown d-flex justify-content-between align-items-center"
                style="text-wrap: wrap"
              >
                <span>{{ option[itemText] }}</span>
                <span v-if="isOptionSelected(option)">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="icon system/C/Check">
                      <path
                        id="Solid"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M20.4219 5.61269L20.2831 5.477C19.519 4.7986 18.3925 4.84383 17.6767 5.61269L9.65023 14.2353L6.32326 10.6612C5.56281 9.84431 4.33855 9.84431 3.57811 10.6612C2.8073 11.4893 2.8073 12.8393 3.57811 13.6674L7.75548 18.155C8.80431 19.2817 10.4961 19.2817 11.545 18.155L20.4219 8.61882C21.1445 7.84253 21.1897 6.60745 20.5574 5.77381L20.4219 5.61269Z"
                        fill="#00AB4E"
                      />
                    </g>
                  </svg>
                </span>
              </div>
            </button>
          </li>

          <li
            v-if="filteredItems.length === 0"
            class="text-center py-3 text-muted"
            style="font-size: 13px"
          >
            Tidak ada opsi yang sesuai
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.group-input {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;
  position: relative;
}

.form-label {
  display: block;
  margin-bottom: 4px;
  font-size: var(--g-kit-font-size-sigma, 14px);
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 20px;
  color: var(--g-kit-black-80, #252528);
}

.gkit-dd {
  font-size: var(--g-kit-font-size-omicron, 14px);
  line-height: var(--g-kit-line-height-omicron, 20px);
  font-weight: var(--g-kit-font-weight-normal, 400);
  border: 1px solid var(--g-kit-black-20, #e2e4e7);
  color: var(--g-kit-black-80, #252528);
  background-color: var(--g-kit-white, #ffffff);
  border-radius: 8px;
  height: 48px;
  padding-left: 11px;
  padding-right: 12px;
  cursor: pointer;
  text-align: left;
  outline: none;
  box-shadow: none;
  transition: all 0.2s;
}

.gkit-dd:hover {
  border-color: var(--g-kit-lime-50, #00a651);
  color: var(--g-kit-black-80, #252528);
}

.gkit-dd.show,
.gkit-dd:focus {
  border-color: var(--g-kit-lime-50, #00a651) !important;
  color: var(--g-kit-black-80, #252528);
  box-shadow: none !important;
}

.dropdown-placeholder {
  font-size: var(--g-kit-font-size-omicron, 14px);
  line-height: var(--g-kit-line-height-omicron, 20px);
  font-weight: var(--g-kit-font-weight-normal, 400);
  margin-bottom: 0;
}

.text-ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-dropdown {
  transition: transform 0.2s ease;
}

.icon-dropdown.dropdown-open {
  transform: rotate(180deg);
}

.icon-dropdown.dropdown-close {
  transform: rotate(0deg);
}

.chevronDefault {
  color: var(--g-kit-black-50, #58585b);
}

.error-text {
  color: var(--g-kit-red-50, #e53935);
  font-size: var(--g-kit-font-size-omega, 12px);
  line-height: var(--g-kit-line-height-omega, 16px);
  font-weight: var(--g-kit-font-weight-normal);
}

.dd-error .gkit-dd {
  border-color: var(--g-kit-red-50, #e53935) !important;
}

/* Teleported Dropdown Menu */
.teleport-dropdown-menu {
  display: block;
  box-sizing: border-box;
  margin: 0 !important;
  background-color: var(--g-kit-white, #ffffff);
  border: 1px solid var(--g-kit-black-20, #e2e4e7);
  border-radius: 8px;
  box-shadow: 0 10px 28px -4px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.08);
  padding-block: 16px;
  padding-inline: 0;
  max-height: 358px;
  overflow-y: auto;
}

.teleport-dropdown-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.teleport-dropdown-menu .search-dropdown {
  padding-inline: 16px;
  margin-bottom: 8px;
}

.teleport-dropdown-menu .search-dropdown input {
  width: 100%;
  padding: 8px 12px;
  font-size: var(--g-kit-font-size-omicron, 14px);
  line-height: var(--g-kit-line-height-omicron, 20px);
  border: 1px solid var(--g-kit-black-20, #e2e4e7);
  border-radius: 6px;
  outline: none;
  background-color: var(--g-kit-white, #ffffff);
  color: var(--g-kit-black-80, #252528);
}

.teleport-dropdown-menu .search-dropdown input:focus {
  border-color: var(--g-kit-lime-50, #00a651);
}

.teleport-dropdown-list li {
  padding: 0;
  padding-inline: 16px;
  list-style: none;
}

.teleport-dropdown-list li:has(:focus) {
  background-color: var(--g-kit-black-10, #f5f7f9);
}

.teleport-dropdown-list li button.dropdown-item {
  width: 100%;
  background: transparent;
  border: none;
  padding: 0;
  font-size: var(--g-kit-font-size-omicron, 14px);
  line-height: var(--g-kit-line-height-omicron, 20px);
  font-weight: var(--g-kit-font-weight-normal, 400);
  color: var(--g-kit-black-80, #252528) !important;
  border-bottom: 1px solid #eeeeef;
  cursor: pointer;
  text-align: left;
  transition: color 0.15s ease;
}

.teleport-dropdown-list li button.dropdown-item .d-flex.justify-content-between.align-items-center {
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.teleport-dropdown-list li button.dropdown-item:active,
.teleport-dropdown-list li button.dropdown-item:focus {
  background-color: white;
  outline: none;
}

.teleport-dropdown-list li button.dropdown-item:hover {
  background-color: white;
  color: var(--g-kit-lime-50, #00a651) !important;
}

.teleport-dropdown-list li button.dropdown-item.disabled {
  color: var(--g-kit-black-40, #b0b4b8) !important;
  cursor: not-allowed;
}

.teleport-dropdown-list li button.dropdown-item.disabled:hover,
.teleport-dropdown-list li button.dropdown-item.disabled:focus {
  color: var(--g-kit-black-40, #b0b4b8) !important;
  background-color: transparent;
}

.teleport-dropdown-list li:first-child button.dropdown-item .d-flex.justify-content-between.align-items-center {
  margin-top: 0 !important;
  margin-bottom: 1rem;
}

.teleport-dropdown-list li:last-child button.dropdown-item {
  border-bottom: none !important;
}

.teleport-dropdown-list li:last-child button.dropdown-item .d-flex.justify-content-between.align-items-center {
  margin-top: 1rem;
  margin-bottom: 0 !important;
}

.teleport-dropdown-list li:only-child button.dropdown-item {
  border-bottom: none !important;
}

.teleport-dropdown-list li:only-child button.dropdown-item .d-flex.justify-content-between.align-items-center {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
</style>
