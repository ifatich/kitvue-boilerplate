/**
 * @file useFormAriaWorkaround.ts
 * @description Composable untuk memasang atribut aksesibilitas (ARIA) secara imperatif
 * pada komponen InputNominalStart dan InputNominalEnd Kitvue yang secara bawaan
 * mengeset aria-describedby="[id-sendiri]" dan aria-label="[id-sendiri]" (invalid a11y).
 *
 * TODO: Workaround imperatif ini dihapus saat Kitvue diperbaiki (dukungan prop aria-* bawaan pada InputNominalStart dan InputNominalEnd).
 */
import { onMounted, onBeforeUnmount, nextTick, watch, type Ref } from 'vue'

export interface AriaFieldConfig {
  inputId: string
  labelId?: string
  labelText?: string
  describedByIds?: string[]
}

/**
 * Composable untuk menjaga agar atribut aria-labelledby, aria-label, dan aria-describedby
 * terpasang secara tepat pada elemen input dan ter-cleanup saat unmount.
 *
 * @param containerRef - Ref elemen container form
 * @param configs - Daftar konfigurasi per field input
 */
export function useFormAriaWorkaround(
  containerRef: Ref<HTMLElement | null>,
  configs: AriaFieldConfig[],
  triggerRef?: Ref<unknown>
) {
  let observer: MutationObserver | null = null

  const applyAria = (): void => {
    if (!containerRef.value) return

    // Hentikan observer sementara untuk mencegah loop mutasi atribut
    if (observer) {
      observer.disconnect()
    }

    for (const config of configs) {
      const input = document.getElementById(config.inputId) as HTMLInputElement | null
      if (!input) continue

      // 1. Teks label terlihat & aria-labelledby / aria-label
      let labelEl = config.labelId ? document.getElementById(config.labelId) : null
      if (!labelEl) {
        labelEl = document.querySelector(`label[for="${config.inputId}"]`)
        if (labelEl && config.labelId) {
          labelEl.id = config.labelId
        }
      }

      if (labelEl) {
        const finalLabelId = labelEl.id || `label-${config.inputId}`
        labelEl.id = finalLabelId
        input.setAttribute('aria-labelledby', finalLabelId)
      }

      if (config.labelText) {
        input.setAttribute('aria-label', config.labelText)
      } else if (input.getAttribute('aria-label') === config.inputId) {
        // Hapus aria-label bawaan Kitvue jika hanya bernilai id input itu sendiri
        input.removeAttribute('aria-label')
      }

      // 2. aria-describedby ke elemen helper/terbilang yang benar (bukan id input sendiri)
      const validDescribedByIds: string[] = []
      if (config.describedByIds && config.describedByIds.length > 0) {
        for (const descId of config.describedByIds) {
          const descEl = document.getElementById(descId)
          if (descEl && descEl.textContent && descEl.textContent.trim().length > 0) {
            validDescribedByIds.push(descId)
          }
        }
      }

      if (validDescribedByIds.length > 0) {
        input.setAttribute('aria-describedby', validDescribedByIds.join(' '))
      } else {
        // Jika Kitvue mengeset aria-describedby ke id input itu sendiri, hapus/bersihkan
        if (input.getAttribute('aria-describedby') === config.inputId) {
          input.removeAttribute('aria-describedby')
        }
      }
    }

    if (observer && containerRef.value && typeof MutationObserver !== 'undefined') {
      observer.observe(containerRef.value, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-describedby', 'aria-label', 'aria-labelledby'],
      })
    }
  }

  onMounted(() => {
    void nextTick(() => {
      applyAria()
    })

    const container = containerRef.value
    if (container && typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(() => {
        applyAria()
      })
      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-describedby', 'aria-label', 'aria-labelledby'],
      })
    }
  })

  if (triggerRef) {
    watch(triggerRef, () => {
      void nextTick(() => {
        applyAria()
      })
    })
  }

  onBeforeUnmount(() => {
    // TODO: Workaround imperatif ini dihapus saat Kitvue diperbaiki (dukungan prop aria-* bawaan pada InputNominalStart dan InputNominalEnd).
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    applyAria,
  }
}
