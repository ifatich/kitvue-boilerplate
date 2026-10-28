/**
 * @file useNumericKeyboard.ts
 * @description Composable untuk memastikan elemen input di dalam container selalu memiliki atribut
 * inputmode="numeric" dan pattern="[0-9]*" agar perangkat mobile (iOS Safari, Android Chrome)
 * langsung memunculkan keyboard mode angka (numeric keypad) saat pengguna berinteraksi.
 * Mengatasi limitasi Kitvue InputText yang secara default menetapkan inputmode="text".
 */
import { onMounted, onBeforeUnmount, nextTick, type Ref } from 'vue'

/**
 * Mengatur atribut inputmode dan pattern ke numeric pada elemen input jika belum sesuai.
 *
 * @param el - Elemen HTMLInputElement target
 */
export function setNumericAttributes(el: HTMLInputElement): void {
  if (el.getAttribute('inputmode') !== 'numeric') {
    el.setAttribute('inputmode', 'numeric')
  }
  if (el.getAttribute('pattern') !== '[0-9]*') {
    el.setAttribute('pattern', '[0-9]*')
  }
}

/**
 * Composable untuk menjaga agar semua elemen input di dalam container referensi
 * selalu berada dalam mode keyboard angka.
 *
 * @param containerRef - Ref elemen container pembungkus form/input
 * @returns Object berisi handler interaksi dan helper sinkronisasi
 */
export function useNumericKeyboard(containerRef: Ref<HTMLElement | null>) {
  let observer: MutationObserver | null = null

  /**
   * Pindai dan perbarui semua input di dalam container
   */
  const applyNumericAttrs = (): void => {
    if (!containerRef.value) return

    // Hentikan observer sementara untuk menghindari rekursi mutasi atribut
    if (observer) {
      observer.disconnect()
    }

    const inputs = containerRef.value.querySelectorAll('input')
    inputs.forEach((input) => {
      setNumericAttributes(input)
    })

    if (observer && containerRef.value && typeof MutationObserver !== 'undefined') {
      observer.observe(containerRef.value, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['inputmode', 'pattern']
      })
    }
  }

  /**
   * Event handler fase capture untuk event pointer/touch/focus guna memastikan
   * atribut terpasang sebelum soft keyboard sistem muncul di layar.
   *
   * @param e - Event DOM yang memicu interaksi
   */
  const handleInteraction = (e: Event): void => {
    const target = e.target
    if (target instanceof HTMLInputElement) {
      setNumericAttributes(target)
    }
  }

  onMounted(() => {
    void nextTick(() => {
      applyNumericAttrs()
    })

    const container = containerRef.value
    if (container) {
      container.addEventListener('focusin', handleInteraction, true)
      container.addEventListener('pointerdown', handleInteraction, true)
    }

    if (container && typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(() => {
        applyNumericAttrs()
      })
      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['inputmode', 'pattern']
      })
    }
  })

  onBeforeUnmount(() => {
    // TODO: hapus workaround ini saat komponen InputText/InputNominal Kitvue diperbaiki untuk mendukung inputmode numerik bawaan.
    if (observer) {
      observer.disconnect()
      observer = null
    }
    const container = containerRef.value
    if (container) {
      container.removeEventListener('focusin', handleInteraction, true)
      container.removeEventListener('pointerdown', handleInteraction, true)
    }
  })

  return {
    applyNumericAttrs,
    handleInteraction
  }
}
