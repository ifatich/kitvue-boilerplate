<script setup>

import { BModal, BButton, BCarousel, BCarouselSlide, BOffcanvas } from 'bootstrap-vue-next'
import {ref , onMounted, onUnmounted, watch, computed} from 'vue'

defineOptions({ name: 'ModalSlider' })

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  images: {
    type: Array,
    default: () => []
  },
  interval: {
    type: Number,
    default: 0
  },
  /**
   * CSS aspect-ratio value — any valid ratio like '3/2', '16/9', '9/16', '85.6/54', '1/1'.
   * Passed directly from ImageView via effectiveModalRatio.
   */
  ratio: {
    type: String,
    default: '3/2',
  },
  uploader: {
    type: String,
    default:  'Unknown'
  },
  timeImages: {
    type: Array,
  },
  dateImages: {
    type: Array,
  },
  /**
   * Mengatur apakah modal menampilkan whitespace letterbox (contain) atau pas mengikuti rasio aspek gambar (cover).
   * Nilai: true (force whitespace), false (no whitespace / exact crop), null/undefined (auto / default).
   */
  whitespace: {
    type: [Boolean, String],
    default: null,
  },
})


const model = defineModel()
const carousel = defineModel('carousel')
const carouselModel = ref(0)

watch(carousel, (val) => {
  carouselModel.value = val
})

watch(carouselModel, (val) => {
  carousel.value = val
})

const isDesktop = ref(true)

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 576
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

watch(isDesktop, (newVal) => {
  if (!newVal) model.value = false
})

/**
 * Parses 'W/H' string into numeric ratio W/H.
 * Returns null if unparseable.
 */
function parseRatio(ratioStr) {
  if (!ratioStr) return null;
  const parts = String(ratioStr).split('/');
  if (parts.length === 2) {
    const w = parseFloat(parts[0]);
    const h = parseFloat(parts[1]);
    if (w > 0 && h > 0) return w / h;
  }
  const n = parseFloat(ratioStr);
  return isNaN(n) ? null : n;
}

/**
 * CSS aspect-ratio string passed to .single-image-inner and .carousel-ratio containers.
 * Uses props.ratio directly — it is already a valid CSS aspect-ratio value from ImageView.
 */
const innerAspectRatio = computed(() => props.ratio || '3/2')

/**
 * Checks if the current modal ratio is 3:2, 2:3, or KTP (85.6:54).
 * Whitespace letterboxing (object-fit: contain with white background)
 * is specifically applied for these aspect ratios.
 */
const isWhitespaceRatio = computed(() => {
  // Explicit override has highest priority
  if (props.whitespace === false || props.whitespace === 'false') return false;
  if (props.whitespace === true || props.whitespace === 'true') return true;

  const clean = String(props.ratio || '').trim().toLowerCase().replace(':', '/').replace(/\s+/g, '');
  if (!clean || clean === '3/2' || clean === 'photo') return true;
  if (clean === '2/3' || clean === 'ktp' || clean === 'id-card' || clean === '85.6/54') return true;
  const r = parseRatio(props.ratio);
  if (r !== null) {
    return Math.abs(r - 1.5) < 0.01 || Math.abs(r - (2 / 3)) < 0.01 || Math.abs(r - (85.6 / 54)) < 0.01;
  }
  return false;
});

/**
 * Computes img-height for BCarousel in slide mode.
 * Fixed at 532px as requested for slide/carousel mode.
 */
const carouselImgHeight = computed(() => {
  return 532;
});
</script>

<template>
  <div>
    <BModal v-if="isDesktop" :class="[`modal-slider-component desktop`,props.title && 'border-bottom', isWhitespaceRatio && 'is-whitespace-ratio']"
      v-model="model"
      :title="props.title"
      @hidden="carouselModel = 0"
      :hide-footer="!$slots.footer"
      centered
      scrollable>
      <template #modal-header="{ close }">
        <BButton class="btn btn-outline-danger" @click="close()">
          Close Modal
        </BButton>
      </template>

      <div>
          <BCarousel
            v-if="props.images.length > 1"
            no-hover-pause
            v-model="carouselModel"
            id="carousel"
            :key="model"
            :interval="props.interval"
            ride="carousel"
            controls
            :img-width="532"
            :img-height="carouselImgHeight">
            <BCarouselSlide v-for="(imgSrc, index) in props.images" :key="index" :img-src="imgSrc">
              <div v-if="props.timeImages && props.dateImages" class="timestamp flex content-between">
                <div class="uploader"> {{ "Diambil oleh: " + props.uploader }}</div>
                <div class="date-time"> {{ "Waktu: "+ dateImages[carouselModel] + ", " + timeImages[carouselModel] }}</div>
              </div>
            </BCarouselSlide>
          </BCarousel>

          <div v-else-if="props.images.length === 1" class="single-image-preview">
            <div class="single-image-inner" :style="{ aspectRatio: innerAspectRatio }">
              <img :src="props.images[0]" alt="Preview image" />
              <div v-if="props.timeImages && props.dateImages" class="timestamp flex content-between">
                <div class="uploader"> {{ "Diambil oleh: " + props.uploader }}</div>
                <div class="date-time"> {{ "Waktu: "+ dateImages[carouselModel] + ", " + timeImages[carouselModel] }}</div>
              </div>
            </div>
          </div>
      </div>

      <template v-slot:footer="{ hide }">
         <div class="modal-slider-footer d-flex w-100 gap-2 p-3 sticky rounded-3" v-if="$slots.footer">
           <slot name="footer" :hide="hide"></slot>
         </div>
      </template>
    </BModal>

    <BOffcanvas
      v-else
      v-model="model"
      @hidden="carouselModel = 0"
      :class="[`modal-slider-component mobile`,props.title && 'border-bottom', isWhitespaceRatio && 'is-whitespace-ratio']"
      placement="bottom"
      header-close
      >

      <template #header>
        <div class="title-offcanvas flex flex-row content-between">
          {{ props.title }}
          <button
            type="button"
            class="btn-close ms-2"
            aria-label="Close"
            @click="model = false"
          ></button>
        </div>
      </template>

      <div>
        <BCarousel
          v-if="props.images.length > 1"
          no-hover-pause
          v-model="carouselModel"
          id="carousel-mobile"
          :key="model"
          :interval="props.interval"
          ride="carousel"
          controls
          :img-width="532"
          :img-height="carouselImgHeight">
          <BCarouselSlide v-for="(imgSrc, index) in props.images" :key="index" :img-src="imgSrc">
            <div v-if="props.timeImages && props.dateImages" class="timestamp flex content-between">
              <div class="uploader"> {{ "Diambil oleh: " + props.uploader }}</div>
              <div class="date-time"> {{ "Waktu: "+ dateImages[carouselModel] + ", " + timeImages[carouselModel] }}</div>
            </div>
          </BCarouselSlide>
        </BCarousel>

        <div v-else-if="props.images.length === 1" class="single-image-preview">
          <div class="single-image-inner" :style="{ aspectRatio: innerAspectRatio }">
            <img :src="props.images[0]" alt="Preview image" />
            <div v-if="props.timeImages && props.dateImages" class="timestamp flex content-between">
              <div class="uploader"> {{ "Diambil oleh: " + props.uploader }}</div>
              <div class="date-time"> {{ "Waktu: "+ dateImages[0] + ", " + timeImages[0] }}</div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="modal-slider-footer d-flex w-100 gap-2 p-3 pt-0 sticky rounded-3" v-if="$slots.footer">
            <slot name="footer" :hide="hide"></slot>
          </div>
      </template>
    </BOffcanvas>

  </div>
</template>

<style lang="scss">


  .modal-slider-component.mobile{
    .offcanvas-body{
      padding-top: 1rem !important;
      padding-inline: 0 !important;
      padding-bottom: 1rem !important;
    }

     .title-offcanvas {
       margin-bottom: 0rem;
       align-items: center;
       width: 100%;
    }

    .carousel-inner .carousel-item {
      padding-inline: 1rem;
      height: auto !important;
      max-height: 80vh;
      img {
        height: auto !important;
        max-height: 70vh;
        width: 100%;
      }
    }

    .single-image-preview {
      .single-image-inner {
        height: auto;
        width: 100%;
        img {
          height: 100%;
          width: 100%;
          display: block;
        }
      }
    }

    &.is-whitespace-ratio {
      .single-image-preview {
        .single-image-inner {
          height: calc(100vw - 2rem);
          max-height: calc(100vw - 2rem);
          img {
            object-fit: contain !important;
            height: 100%;
            max-height: calc(100vw - 2rem);
          }
        }
      }
    }
  }

  .modal-slider-component {

    .carousel-caption {
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 32px);
      padding: 0;
      display: flex;
      justify-content: center;

      .timestamp {
        background-color: rgba(#252528, 0.74);
        padding-inline: 16px;
        padding-block: 8px;
        gap: 8px;
        color: var(--g-kit-white);
        display: flex;
        justify-content: space-between;
        width: 100%;
        border-bottom-right-radius: 0.6875rem;
        border-bottom-left-radius: 0.6875rem;

         @media screen and (max-width: 567px) {
          font-size: var(--g-kit-font-size-omega);
        }
      }
    }

     @media screen and (max-width: 567px) {
      .carousel-caption {
         width: 100%;
        .timestamp {
            padding-inline: 8px;
            border-bottom-right-radius: 0rem;
            border-bottom-left-radius: 0rem;
        }
      }
    }

    .carousel {
      button {

          &.carousel-control-next {
            left: unset;
            right: 28px;
          }

          &.carousel-control-prev {
              left: 28px;
          }


          &.carousel-control-next, &.carousel-control-prev  {
            display: flex;
            top: 50%;
            transform: translateY(-50%);
            padding: 0.5rem;
            height: 40px;
            background-color: white;
            border-radius: 20rem;
            opacity: 1;
            .carousel-control-next-icon, .carousel-control-prev-icon {
              width: 24px;
              height: 24px;
              background-size: cover;
            }
            .carousel-control-next-icon {
               background-image: url('./assets/chevron_right.svg');
            }

            .carousel-control-prev-icon {
               background-image: url('./assets/chevron_left.svg');
            }
          }

          @media screen and (max-width: 567px) {

            &.carousel-control-next {
              right: 12px;
            }

            &.carousel-control-prev {
                left: 12px;
            }
          }
      }
      .carousel-inner {
        .carousel-item {
          transition: transform 0.4s ease-out; // dari 0.6s ke 0.3s
          padding-inline: 1rem;
          background-color: transparent !important;
          height: 532px;
          max-height: 532px;
          img {
            border: 1px solid var(--g-kit-black-20);
            object-fit: cover;
            border-radius: 0.75rem;
            height: 532px;
            max-height: 532px;
            width: 100%;
          }
        }
      }
    }

    .modal-dialog{
      max-width: 566px;
      z-index: 11; // Keep modal content above BModal's fixed backdrop overlay.
    }

    .modal-body{
      padding-inline: 0;
    }

    .modal-slider-footer {
      flex-direction: column;
      width: 100%;
      gap: 0.75rem !important;

      > * {
        flex: 1 1 0% !important;
        width: 100% !important;
      }

      .btn {
        flex: 1 1 0% !important;
        width: 100% !important;
      }
    }

    @media screen and (min-width: 576px) {
      .modal-slider-footer {
        flex-direction: row;
      }
    }


  }
  .modal-slider-component.border-bottom {
    .modal-header{
      border-bottom: 1px solid var(--g-kit-black-20);
    }
  }

  // Khusus ketika whitespace aktif: tampilkan whitespace jika gambar tidak sesuai ukuran, jangan crop (contain)
  .modal-slider-component.is-whitespace-ratio {
    .carousel-inner {
      .carousel-item {
        background-color: var(--g-kit-white, #ffffff) !important;
        text-align: center;
        height: 532px;
        max-height: 532px;
        img {
          object-fit: contain;
          background-color: var(--g-kit-white, #ffffff);
          height: 532px;
          max-height: 532px;
          width: 100%;
        }
      }
    }

    .carousel-ratio {
      background-color: var(--g-kit-white, #ffffff);
      max-height: 532px;
      margin: 0 auto;
      img {
        object-fit: contain;
        background-color: var(--g-kit-white, #ffffff);
        max-height: 532px;
      }
    }

    .single-image-preview {
      .single-image-inner {
        border: 1px solid var(--g-kit-black-20);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--g-kit-white, #ffffff);
        height: 532px;
        margin: 0 auto;

        img {
          object-fit: contain !important;
          background-color: var(--g-kit-white, #ffffff);
          max-height: 532px;
        }
      }
    }
  }

  .carousel-ratio {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: 0.75rem;
    // aspect-ratio injected via inline :style from template — supports any ratio dynamically

  .carousel,
  .carousel-inner,
  .carousel-item,
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100% !important;
  }

  img {
    object-fit: cover;
    border-radius: 0.75rem;
  }
}

.single-image-preview {
  padding-left: 1rem;
  padding-right: 1rem;

  .single-image-inner {
    border: 1px solid var(--g-kit-black-20);
    position: relative;
    display: block;
    width: 100%;
    margin: 0 auto;
    border-radius: 0.75rem;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover !important;
      border-radius: 0.75rem;
    }

    .timestamp {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(#252528, 0.74);
      padding-inline: 16px;
      padding-block: 8px;
      gap: 8px;
      color: var(--g-kit-white);
      display: flex;
      justify-content: space-between;
      border-bottom-right-radius: 0.75rem;
      border-bottom-left-radius: 0.75rem;

      @media screen and (max-width: 567px) {
        font-size: var(--g-kit-font-size-omega);
        padding-inline: 8px;
        border-bottom-right-radius: 0rem;
        border-bottom-left-radius: 0rem;
      }
    }
  }
}


</style>