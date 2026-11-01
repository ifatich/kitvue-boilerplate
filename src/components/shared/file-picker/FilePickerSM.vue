<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import ButtonComponent from 'kitvue-public/src/components/Button/Button.vue'
import LoadAnimate from 'kitvue-public/src/components/Modal/Load.vue'
import addImageIcon from 'kitvue-public/src/assets/images/ico-image-upload.svg?url'
import cameraIcon from 'kitvue-public/src/assets/images/camera-outline.svg?url'
import galleryIcon from 'kitvue-public/src/assets/images/image-outline.svg?url'
import ImageViewComponent from '../image/ImageView.vue'

defineOptions({ name: 'FilePickerSM' })

const addImageIconUrl = addImageIcon as unknown as string
const cameraIconUrl = cameraIcon as unknown as string
const galleryIconUrl = galleryIcon as unknown as string

const props = withDefaults(defineProps<{
  imageOnly?: boolean
  pdfOnly?: boolean
  csvOnly?: boolean
  file?: string | File | null
  maxSize?: number
  loaderType?: 'modal' | 'inline'
  errorText?: string
  uniqueKey?: string
  isLoading?: boolean
}>(), {
  imageOnly: false,
  pdfOnly: false,
  csvOnly: false,
  file: null,
  maxSize: 1024 * 1024,
  loaderType: 'modal',
  errorText: '',
  uniqueKey: () => Math.random().toString(36).slice(2, 9),
  isLoading: false,
})

const emit = defineEmits<{
  input: [file: File | null]
}>()

const showSourceModal = ref(false)
const showPreviewModal = ref(false)
const isReading = ref(false)
const localError = ref('')
const previewUrl = ref('')
const galleryInput = ref<HTMLInputElement | null>(null)
const cameraInput = ref<HTMLInputElement | null>(null)
let previewRequest = 0
const previewCache = new WeakMap<File, string>()

const readFile = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') resolve(reader.result)
    else reject(new Error('File tidak dapat dibaca.'))
  }
  reader.onerror = () => reject(new Error('File tidak dapat dibaca.'))
  reader.readAsDataURL(file)
})

const accept = computed(() => {
  if (props.imageOnly) return 'image/*'
  if (props.pdfOnly) return '.pdf,application/pdf'
  if (props.csvOnly) return '.csv,text/csv'
  return 'image/*,.pdf,.csv,application/pdf,text/csv'
})
const isBusy = computed(() => props.isLoading || isReading.value)
const showInlineLoader = computed(() => isBusy.value && props.loaderType === 'inline')
const inputId = computed(() => `file-picker-sm-${props.uniqueKey}`)
const inputLabel = computed(() => props.imageOnly ? 'Tambah foto' : 'Tambah berkas')
const displayedError = computed(() => localError.value || props.errorText)

watch(() => props.file, async (file) => {
  const request = ++previewRequest
  localError.value = ''
  previewUrl.value = ''

  if (typeof file === 'string') {
    previewUrl.value = file
    return
  }
  if (!(file instanceof File)) return

  const cachedPreview = previewCache.get(file)
  if (cachedPreview) {
    previewUrl.value = cachedPreview
    return
  }

  try {
    const dataUrl = await readFile(file)
    if (request !== previewRequest) return
    previewCache.set(file, dataUrl)
    previewUrl.value = dataUrl
  } catch (error) {
    console.error('Gagal menampilkan pratinjau berkas.', error)
    localError.value = 'Pratinjau berkas tidak dapat ditampilkan.'
  }
}, { immediate: true })
onBeforeUnmount(() => {
  previewRequest += 1
})

const showFileError = (message: string) => {
  localError.value = props.errorText || message
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  const isImage = file.type.startsWith('image/')
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  const isCsv = file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')
  const isAllowed = props.imageOnly ? isImage
    : props.pdfOnly ? isPdf
      : props.csvOnly ? isCsv
        : isImage || isPdf || isCsv

  if (!isAllowed) {
    showFileError(props.imageOnly ? 'Pilih berkas gambar.' : 'Format berkas tidak didukung.')
    return
  }
  if (file.size > props.maxSize) {
    showFileError(`Ukuran berkas maksimal ${Math.floor(props.maxSize / 1024 / 1024) || 1} MB.`)
    return
  }

  localError.value = ''
  isReading.value = true
  try {
    const dataUrl = await readFile(file)
    previewCache.set(file, dataUrl)
    emit('input', file)
  } catch (error) {
    console.error('Gagal membaca berkas yang dipilih.', error)
    showFileError(error instanceof Error ? error.message : 'Berkas tidak dapat dibaca.')
  } finally {
    isReading.value = false
  }
}

const openNativePicker = (source: 'gallery' | 'camera') => {
  showSourceModal.value = false
  window.setTimeout(() => {
    const input = source === 'gallery' ? galleryInput.value : cameraInput.value
    if (input) input.click()
    else console.error('Input file FilePickerSM tidak ditemukan.')
  }, 200)
}

const removeFile = () => {
  localError.value = ''
  emit('input', null)
}
</script>

<template>
  <div class="file-picker-sm">
    <input
      ref="galleryInput"
      :id="`${inputId}-gallery`"
      class="file-picker-sm__native-input"
      type="file"
      :accept="accept"
      aria-hidden="true"
      tabindex="-1"
      @change="handleFileChange"
    />
    <input
      ref="cameraInput"
      :id="`${inputId}-camera`"
      class="file-picker-sm__native-input"
      type="file"
      :accept="accept"
      capture="environment"
      aria-hidden="true"
      tabindex="-1"
      @change="handleFileChange"
    />

    <div v-if="previewUrl" class="file-picker-sm__preview">
      <button
        type="button"
        class="file-picker-sm__image-button"
        aria-label="Lihat pratinjau foto"
        @click="showPreviewModal = true"
      >
        <img :src="previewUrl" alt="Pratinjau foto" />
      </button>
      <button type="button" class="file-picker-sm__remove" aria-label="Hapus foto" @click="removeFile">
        <span aria-hidden="true">×</span>
      </button>
    </div>
    <button
      v-else
      type="button"
      class="file-picker-sm__add"
      :aria-label="inputLabel"
      :disabled="isBusy"
      @click="showSourceModal = true"
    >
      <span v-if="showInlineLoader" class="file-picker-sm__spinner" aria-hidden="true" />
      <img v-else :src="addImageIconUrl" alt="" />
    </button>

    <span v-if="displayedError" class="file-picker-sm__error" role="alert">{{ displayedError }}</span>

    <LoadAnimate
      v-if="props.loaderType === 'modal' && isBusy"
      class="kitvue-loading"
      :model-value="isBusy"
      title="Memproses Berkas"
    />
  </div>

  <Teleport to="body">
    <div
      v-if="showSourceModal"
      class="file-picker-sm__dialog-backdrop"
      @click.self="showSourceModal = false"
      @keydown.esc="showSourceModal = false"
    >
      <section
        class="file-picker-sm__dialog file-picker-sm__source-dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`${inputId}-source-title`"
        tabindex="-1"
      >
        <header class="file-picker-sm__dialog-header">
          <h2 :id="`${inputId}-source-title`">Ambil Foto Melalui</h2>
          <button type="button" aria-label="Tutup" @click="showSourceModal = false">×</button>
        </header>
        <div class="file-picker-sm__source-list">
          <button type="button" class="file-picker-sm__source" @click="openNativePicker('gallery')">
            <span>Galeri</span>
            <img :src="galleryIconUrl" alt="" />
          </button>
          <button type="button" class="file-picker-sm__source" @click="openNativePicker('camera')">
            <span>Kamera</span>
            <img :src="cameraIconUrl" alt="" />
          </button>
        </div>
      </section>
    </div>

    <div
      v-if="showPreviewModal && previewUrl"
      class="file-picker-sm__dialog-backdrop"
      @click.self="showPreviewModal = false"
      @keydown.esc="showPreviewModal = false"
    >
      <section
        class="file-picker-sm__dialog file-picker-sm__preview-dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`${inputId}-preview-title`"
        tabindex="-1"
      >
        <header class="file-picker-sm__dialog-header">
          <h2 :id="`${inputId}-preview-title`">Pratinjau Foto</h2>
          <button type="button" aria-label="Tutup" @click="showPreviewModal = false">×</button>
        </header>
        <div class="file-picker-sm__preview-body">
          <div class="file-picker-sm__large-preview">
            <ImageViewComponent
              :img-src="previewUrl"
              img-alt="Pratinjau foto"
              aspect-ratio="1:1"
              :width="'100%'"
              :height="'100%'"
              fit="contain"
            />
          </div>
        </div>
        <footer class="file-picker-sm__dialog-footer">
          <slot name="footer">
            <ButtonComponent label="Tutup" type="primary" size="md" @click="showPreviewModal = false" />
          </slot>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.file-picker-sm__native-input {
  display: none;
}

.file-picker-sm {
  position: relative;
  display: grid;
  justify-items: start;
  width: 80px;
}

.file-picker-sm__add,
.file-picker-sm__image-button {
  display: grid;
  place-items: center;
  width: 80px;
  height: 80px;
  padding: 0;
  overflow: hidden;
  border: 1px dashed var(--g-kit-black-40, #bbbdc0);
  border-radius: 6px;
  background: var(--g-kit-white, #ffffff);
}

.file-picker-sm__add img {
  display: block;
  width: 80px;
  height: 80px;
}

.file-picker-sm__add:disabled {
  cursor: wait;
}

.file-picker-sm__preview {
  position: relative;
  width: 80px;
  height: 80px;
}

.file-picker-sm__image-button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-picker-sm__remove {
  position: absolute;
  top: -6px;
  right: -6px;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--g-kit-black-60, #58585b);
  color: var(--g-kit-white, #ffffff);
  line-height: 1;
}

.file-picker-sm__spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--g-kit-black-20, #eeeeef);
  border-top-color: var(--g-kit-lime-50, #00ab4e);
  border-radius: 50%;
  animation: file-picker-spin 0.8s linear infinite;
}

.file-picker-sm__error {
  width: max-content;
  max-width: 240px;
  margin-top: 4px;
  color: var(--g-kit-red-50, #ae1e22);
  font-size: 12px;
  line-height: 18px;
}

.file-picker-sm__source-list {
  display: grid;
  padding: 0 16px 16px;
}

.file-picker-sm__source {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  padding: 16px 0;
  border: 0;
  border-bottom: 1px solid var(--g-kit-black-20, #eeeeef);
  background: transparent;
  color: var(--g-kit-black-80, #252528);
  font: inherit;
  text-align: left;
}

.file-picker-sm__source:last-child {
  border-bottom: 0;
}

.file-picker-sm__source img {
  width: 24px;
  height: 24px;
}

.file-picker-sm__dialog-backdrop {
  position: fixed;
  z-index: 1100;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.5);
}

.file-picker-sm__dialog {
  width: min(100%, 360px);
  overflow: hidden;
  border-radius: 16px;
  background: var(--g-kit-white, #ffffff);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.16);
}

.file-picker-sm__preview-dialog {
  width: min(100%, 564px);
}

.file-picker-sm__dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  padding: 16px;
  border-bottom: 1px solid var(--g-kit-black-20, #eeeeef);

  h2 {
    margin: 0;
    color: var(--g-kit-black-80, #252528);
    font-size: 16px;
    font-weight: var(--g-kit-font-weight-bold, 800);
    line-height: 24px;
  }

  > button {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--g-kit-black-60, #58585b);
    font-size: 24px;
    line-height: 1;
  }
}

.file-picker-sm__preview-body {
  padding: 16px;
}

.file-picker-sm__dialog-footer {
  padding: 16px;
  border-top: 1px solid var(--g-kit-black-20, #eeeeef);

  :deep(.btn) {
    width: 100%;
  }
}

.file-picker-sm__large-preview {
  width: min(100%, 532px, 70vh);
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid var(--g-kit-black-20, #eeeeef);
  border-radius: 12px;
  background: var(--g-kit-white, #ffffff);

  :deep(.image-view) {
    display: flex;
    width: 100%;
    height: 100%;
  }

  :deep(.image-container) {
    width: 100%;
    height: 100%;
    border: 0;
    border-radius: inherit;
  }
}

@media (max-width: 767px) {
  .file-picker-sm__dialog-backdrop {
    align-items: end;
    padding: 0;
  }

  .file-picker-sm__dialog {
    width: 100%;
    border-radius: 16px 16px 0 0;
  }
}

@keyframes file-picker-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
