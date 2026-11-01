<template>
    <div
        class="image-view"
        :class="{ 'image-view--fluid': props.fluid }"
        v-bind="$attrs"
    >
        <div v-if="props.title" class="image-view-title">{{ props.title }}</div>

        <div
            class="image-container"
            :class="{
                'is-clickable': isClickable,
                'has-image': hasImage,
            }"
            :style="containerStyle"
            :role="isClickable ? 'button' : undefined"
            :tabindex="isClickable ? 0 : undefined"
            :aria-label="isClickable ? (props.title || props.imgAlt || 'Preview gambar') : undefined"
            @click="handleContainerClick"
            @keydown.enter.prevent="handleContainerClick"
            @keydown.space.prevent="handleContainerClick"
        >
            <div class="illustration-container" v-if="!effectiveImgSrc || isBroken">
                <!-- Broken Image State -->
                <svg v-if="isBroken" class="illustration-svg" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <path d="M28.623 28.1377C28.5848 28.508 28.7614 28.8682 29.0771 29.0654L35.7411 33.2305C36.1107 33.4617 36.2823 33.9103 36.161 34.3291L33.8798 42.209C33.7625 42.6148 33.9199 43.0499 34.2694 43.2871L40.036 47.2002C40.3296 47.3994 40.4918 47.7425 40.4599 48.0957L39.6552 56.9502C31.5167 58.5552 22.9138 60.9204 14.9306 64.3369C13.8379 64.8044 12.5641 64.6065 11.7567 63.7344C5.96909 57.4806 -2.20295 43.8721 2.30264 29.1074C2.51181 28.4221 2.95472 27.8308 3.55362 27.4375C8.67702 24.0729 18.0325 19.762 29.6737 17.9268L28.623 28.1377Z" fill="#EEEEEF" stroke="#939597" stroke-width="0.5"/>
                    <path d="M28.6243 28.1381C28.609 28.2874 28.6295 28.4347 28.679 28.5707L28.6234 29.1136C28.5854 29.4837 28.762 29.8442 29.0775 30.0414L35.7415 34.2064C35.8934 34.3015 36.0098 34.434 36.0882 34.5853L33.8812 42.2094C33.81 42.4559 33.8404 42.7129 33.9534 42.9301L33.8802 43.1849C33.7631 43.5906 33.9204 44.0259 34.2698 44.2631L40.0364 48.1761C40.2135 48.2964 40.3409 48.4696 40.4085 48.6654L39.9075 54.1801C31.8355 55.6807 23.084 57.9737 14.9652 61.3529C14.4412 61.5709 13.8371 61.4797 13.4329 61.0814C8.37738 56.0977 1.99229 44.5239 5.26497 31.5658C5.46064 30.7911 5.94797 30.1292 6.6302 29.7133C11.1902 26.934 19.2574 23.4518 29.2698 21.8558L28.6243 28.1381Z" fill="#939597"/>
                    <path d="M28.6232 28.1376C28.5851 28.5078 28.7617 28.868 29.0773 29.0653L35.7414 33.2303C36.1111 33.4615 36.2825 33.9101 36.1613 34.329L33.8801 42.2089C33.7627 42.6147 33.9201 43.0498 34.2697 43.287L40.0363 47.2001C40.3299 47.3993 40.4923 47.7432 40.4601 48.0966L39.9972 53.1874C31.9003 54.6877 23.1141 56.9851 14.965 60.3768C14.4409 60.595 13.837 60.5038 13.4328 60.1053C8.37718 55.1216 1.9919 43.548 5.26482 30.5897C5.46052 29.8149 5.94771 29.1531 6.63006 28.7372C11.2056 25.9484 19.3122 22.4516 29.3722 20.8632L28.6232 28.1376Z" fill="#BBBDC0" stroke="#939597" stroke-width="0.5"/>
                    <path d="M19.6593 32.4631C19.8121 31.8396 20.5149 31.5313 21.0773 31.841L34.7081 39.3469L33.88 42.2082C33.7625 42.6141 33.92 43.0501 34.2697 43.2873L38.4132 46.0988C30.225 47.5269 21.8612 50.2383 16.5587 53.8947C15.7461 54.4545 14.4606 53.6726 14.6954 52.7141L19.6593 32.4631Z" fill="#EEEEEF" stroke="#939597" stroke-width="0.5"/>
                    <path d="M40.5378 15.8964C49.0926 14.5438 58.8837 14.5275 69.1384 17.207C70.7574 17.63 71.8593 19.094 71.9714 20.7636C72.5057 28.74 74.4738 41.6073 79.2585 48.9785C79.9827 50.0941 79.2016 51.8472 77.8718 51.873C71.2391 52.0015 61.3081 52.7932 50.5681 54.9101L51.3591 46.0488C51.39 45.7019 51.2337 45.3645 50.9489 45.164L45.3786 41.2441C45.0453 41.0095 44.8932 40.5924 44.9968 40.1982L47.0798 32.2802C47.1885 31.867 47.0163 31.4305 46.654 31.204L39.9723 27.0283C39.6577 26.8316 39.4814 26.4737 39.5182 26.1044L40.5378 15.8964Z" fill="#EEEEEF" stroke="#939597" stroke-width="0.5"/>
                    <path d="M40.2448 18.8317C48.3123 17.5551 57.6379 17.504 67.4069 20.0329C68.4316 20.2983 69.1412 21.2162 69.198 22.2731C69.5837 29.4552 71.1395 41.1783 75.6384 47.8815C75.8658 48.2204 75.6256 48.6919 75.2175 48.6901C69.816 48.6646 60.8834 49.3014 50.903 51.1501L51.3591 46.0485C51.3901 45.7015 51.2338 45.3642 50.9489 45.1637L45.3786 41.2448C45.0452 41.0092 44.893 40.5922 44.9968 40.1979L47.0798 32.28C47.1884 31.8669 47.016 31.4313 46.654 31.2048L39.9724 27.029C39.6576 26.8323 39.4813 26.4735 39.5183 26.1042L40.2448 18.8317Z" fill="#BBBDC0" stroke="#939597" stroke-width="0.5"/>
                    <path d="M58.3637 30.9632C58.8005 30.6568 59.4028 30.7583 59.7153 31.1908L67.1616 41.5013C67.6865 42.2286 67.0292 43.2699 66.1382 43.1674C61.5659 42.6413 55.5199 42.9852 49.3706 44.0531L45.3784 41.2445C45.045 41.0099 44.8928 40.5919 44.9966 40.1976L45.7368 37.3851L45.8218 37.432C46.9637 38.0609 48.3651 37.9839 49.4321 37.2347L58.3637 30.9632Z" fill="#EEEEEF" stroke="#939597" stroke-width="0.5"/>
                    <circle cx="46.4685" cy="26.9954" r="3.6572" fill="#EEEEEF" stroke="#939597" stroke-width="0.5"/>
                </svg>

                <!-- Empty Image State -->
                <svg v-else-if="!effectiveImgSrc" class="illustration-svg" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <path d="M63.2417 17.207C39.0509 10.886 17.4389 19.5671 8.55393 25.4021C7.95495 25.7954 7.51183 26.3865 7.30267 27.0719C2.79708 41.8367 10.9688 55.4447 16.7565 61.6985C17.5639 62.5709 18.8379 62.7685 19.9308 62.3008C38.4554 54.3731 60.3133 52.0992 71.975 51.8732C73.3049 51.8475 74.0861 50.0944 73.3618 48.9787C68.577 41.6075 66.6091 28.7406 66.0747 20.7641C65.9629 19.0943 64.8609 17.6301 63.2417 17.207Z" fill="#EEEEEF"/>
                    <path d="M63.2417 18.1826C39.0509 11.8616 17.4389 20.5427 8.55393 26.3777C7.95495 26.771 7.51183 27.3621 7.30267 28.0475C2.79708 42.8122 10.9688 56.4203 16.7565 62.6741C17.5639 63.5465 18.8379 63.7441 19.9308 63.2764C38.4554 55.3487 60.3133 53.0748 71.975 52.8488C73.3049 52.8231 74.0861 51.0699 73.3618 49.9543C68.577 42.5831 66.6091 29.7162 66.0747 21.7397C65.9629 20.0699 64.8609 18.6057 63.2417 18.1826Z" fill="#939597"/>
                    <path d="M8.6875 25.6055C17.5321 19.797 39.0735 11.1445 63.1797 17.4434C64.6873 17.8373 65.7254 19.2045 65.8311 20.7803C66.0989 24.7783 66.7265 30.0024 67.8867 35.1523C69.046 40.2979 70.7417 45.3901 73.1572 49.1113C73.4647 49.585 73.4606 50.2108 73.2178 50.7314C72.9754 51.251 72.5194 51.6181 71.9707 51.6289C60.293 51.8552 38.3997 54.1314 19.835 62.0762C18.825 62.5084 17.6645 62.3207 16.9355 61.5332C11.1716 55.3051 3.06826 41.7853 7.53613 27.1436C7.72865 26.5127 8.13608 25.9676 8.6875 25.6055Z" fill="#EEEEEF" stroke="#939597" stroke-width="0.487805"/>
                    <path d="M61.5095 21.0087C39.5721 15.3299 19.872 22.6532 11.6297 27.6768C10.9473 28.0928 10.4605 28.7549 10.2648 29.5298C6.9919 42.4881 13.3772 54.0611 18.4328 59.0448C18.8371 59.4434 19.4402 59.5352 19.9643 59.3171C38.1617 51.743 59.5352 49.6192 69.3203 49.6654C69.7285 49.6673 69.9693 49.1962 69.7418 48.8573C65.2427 42.1541 63.687 30.4309 63.3013 23.2488C63.2445 22.1916 62.5344 21.274 61.5095 21.0087Z" fill="#939597"/>
                    <path d="M61.5095 20.0331C39.5721 14.3543 19.872 21.6777 11.6297 26.7013C10.9473 27.1172 10.4605 27.7793 10.2648 28.5542C6.9919 41.5125 13.3772 53.0855 18.4328 58.0693C18.8371 58.4678 19.4402 58.5596 19.9643 58.3415C38.1617 50.7674 59.5352 48.6436 69.3203 48.6898C69.7285 48.6918 69.9693 48.2207 69.7418 47.8817C65.2427 41.1786 63.687 29.4554 63.3013 22.2732C63.2445 21.2161 62.5344 20.2984 61.5095 20.0331Z" fill="#BBBDC0" stroke="#939597" stroke-width="0.487805"/>
                    <circle cx="44.2928" cy="26.3789" r="3.41463" fill="#EEEEEF" stroke="#939597" stroke-width="0.487805"/>
                    <path d="M24.6585 30.4273L19.695 50.6783C19.46 51.637 20.7462 52.4191 21.5588 51.8588C30.857 45.447 49.5663 41.9385 60.2411 43.1667C61.1323 43.2692 61.7893 42.2281 61.2641 41.5008L53.8179 31.1907C53.5054 30.758 52.9032 30.6568 52.4664 30.9635L43.5343 37.235C42.4673 37.9841 41.0668 38.0604 39.9249 37.4314L26.0767 29.8049C25.5144 29.4952 24.8113 29.8037 24.6585 30.4273Z" fill="#EEEEEF" stroke="#939597" stroke-width="0.487805"/>
                    <circle cx="66.8779" cy="50.643" r="8.5" fill="#EEEEEF" stroke="#939597" stroke-width="1"/>
                    <path d="M58.002 41.8715L63.9072 42.1459" stroke="#939597" stroke-width="2" stroke-linecap="round"/>
                    <path d="M66.6221 52.1999C66.4241 52.1999 66.2666 52.1369 66.1496 52.0109C66.0416 51.8759 65.9876 51.6959 65.9876 51.4709C65.9876 51.2099 66.0191 50.9669 66.0821 50.7419C66.1451 50.5079 66.2441 50.2739 66.3791 50.0399C66.5231 49.8059 66.7121 49.5674 66.9461 49.3244C67.1081 49.1354 67.2386 48.9734 67.3376 48.8384C67.4456 48.6944 67.5176 48.5594 67.5536 48.4334C67.5986 48.2984 67.6211 48.1634 67.6211 48.0284C67.6211 47.7764 67.5266 47.5784 67.3376 47.4344C67.1576 47.2904 66.8966 47.2184 66.5546 47.2184C66.2306 47.2184 65.9291 47.2589 65.6501 47.3399C65.3801 47.4209 65.1146 47.5379 64.8536 47.6909C64.6196 47.8169 64.4081 47.8664 64.2191 47.8394C64.0391 47.8034 63.8951 47.7224 63.7871 47.5964C63.6791 47.4614 63.6161 47.3039 63.5981 47.1239C63.5801 46.9439 63.6206 46.7684 63.7196 46.5974C63.8186 46.4174 63.9851 46.2599 64.2191 46.1249C64.5881 45.9089 64.9976 45.7469 65.4476 45.6389C65.8976 45.5309 66.3161 45.4769 66.7031 45.4769C67.2971 45.4769 67.8191 45.5759 68.2691 45.7739C68.7191 45.9719 69.0656 46.2419 69.3086 46.5839C69.5606 46.9259 69.6866 47.3264 69.6866 47.7854C69.6866 48.0644 69.6461 48.3254 69.5651 48.5684C69.4841 48.8114 69.3536 49.0544 69.1736 49.2974C68.9936 49.5314 68.7461 49.7789 68.4311 50.0399C68.1521 50.2739 67.9316 50.4854 67.7696 50.6744C67.6076 50.8544 67.4906 51.0299 67.4186 51.2009C67.3466 51.3629 67.2971 51.5384 67.2701 51.7274C67.2431 51.8624 67.1756 51.9749 67.0676 52.0649C66.9686 52.1549 66.8201 52.1999 66.6221 52.1999ZM66.5951 55.2104C66.2351 55.2104 65.9471 55.1024 65.7311 54.8864C65.5241 54.6704 65.4206 54.3914 65.4206 54.0494C65.4206 53.7164 65.5241 53.4464 65.7311 53.2394C65.9471 53.0234 66.2351 52.9154 66.5951 52.9154C66.9551 52.9154 67.2341 53.0234 67.4321 53.2394C67.6391 53.4464 67.7426 53.7164 67.7426 54.0494C67.7426 54.3914 67.6391 54.6704 67.4321 54.8864C67.2341 55.1024 66.9551 55.2104 66.5951 55.2104Z" fill="#939597"/>
                </svg>

                <span class="illustration-text">
                    {{ isBroken ? (props.errorText || 'Gambar Gagal Dimuat') : (props.placeholderText || 'Tidak Ada Gambar') }}
                </span>
            </div>

            <template v-else>
                <img
                    class="image-view-img"
                    :src="effectiveImgSrc"
                    :alt="props.imgAlt || props.alt"
                    :style="imageStyle"
                    @error="handleImgError"
                    @load="handleImgLoad"
                />

                <!-- Hover overlay for previewable images -->
                <div v-if="isClickable" class="image-preview-overlay">
                    <span class="preview-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M11 8V14M8 11H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Lihat</span>
                    </span>
                </div>
            </template>
        </div>

        <!-- ModalSlider Preview Modal (with full carousel, responsive desktop/mobile offcanvas, and timestamp support) -->
        <ModalSlider
            v-if="(props.previewable || props.preview) && hasImage"
            v-model="isPreviewOpen"
            :title="effectiveModalTitle"
            :images="effectiveImages"
            :ratio="effectiveModalRatio"
            :whitespace="effectiveWhitespace"
            :uploader="props.uploader"
            :date-images="effectiveDateImages"
            :time-images="effectiveTimeImages"
            :interval="props.interval"
        >
            <template v-if="$slots.footer" #footer="footerProps">
                <slot name="footer" v-bind="footerProps" />
            </template>
        </ModalSlider>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import ModalSlider from '../modal/ModalSlider.vue';

defineOptions({
    name: 'ImageView',
    inheritAttrs: false,
});

/**
 * Props definition for ImageView component.
 */
const props = defineProps({
    /** Judul/label di atas gambar */
    title: {
        type: String,
        default: '',
    },
    /** Judul modal saat dibuka (default mengambil dari title atau 'Preview Gambar') */
    modalTitle: {
        type: String,
        default: '',
    },
    /** URL sumber gambar tunggal */
    imgSrc: {
        type: String,
        default: '',
    },
    /** Alias untuk imgSrc */
    src: {
        type: String,
        default: '',
    },
    /** Daftar gambar jika ingin menampilkan beberapa gambar dalam slider */
    images: {
        type: Array,
        default: () => [],
    },
    /** Alt text untuk gambar */
    imgAlt: {
        type: String,
        default: 'Image preview',
    },
    /** Alias untuk imgAlt */
    alt: {
        type: String,
        default: '',
    },
    /** State manual ketika gambar gagal dimuat */
    imgBroken: {
        type: Boolean,
        default: false,
    },
    /** Alias untuk imgBroken */
    broken: {
        type: Boolean,
        default: false,
    },
    /**
     * Rasio aspek kontainer gambar.
     * Mendukung preset string: '1:1', '4:3', '3:2', '16:9', '21:9', '9:16', '3:4', '2:3', 'ktp', 'auto'
     * atau rasio kustom seperti '16/9', '85.6/54', '2.35:1', 1.77
     */
    aspectRatio: {
        type: [String, Number],
        default: '3:2',
    },
    /** Alias untuk aspectRatio */
    aspect: {
        type: [String, Number],
        default: '',
    },
    /** Alias untuk aspectRatio */
    ratio: {
        type: [String, Number],
        default: '',
    },
    /** Lebar kustom kontainer (contoh: '11.25rem', '240px', '100%', 240) */
    width: {
        type: [String, Number],
        default: '',
    },
    /** Tinggi kustom kontainer (contoh: '7.5rem', '180px', 150) */
    height: {
        type: [String, Number],
        default: '',
    },
    /** Mengisi lebar 100% dari container parent dengan tetap menjaga aspect ratio */
    fluid: {
        type: Boolean,
        default: false,
    },
    /** Mode penyesuaian gambar (CSS object-fit): 'cover' | 'contain' | 'fill' | 'none' | 'scale-down' */
    fit: {
        type: String,
        default: 'cover',
        validator: (value) => ['cover', 'contain', 'fill', 'none', 'scale-down'].includes(value),
    },
    /** Posisi objek gambar (CSS object-position): contoh 'center', 'top', 'bottom' */
    position: {
        type: String,
        default: 'center',
    },
    /** Border radius kontainer (true = default 0.75rem, false = 0, atau string '1rem', '50%') */
    rounded: {
        type: [Boolean, String],
        default: true,
    },
    /** Teks saat tidak ada gambar */
    placeholderText: {
        type: String,
        default: 'Tidak Ada Gambar',
    },
    /** Teks saat gambar gagal dimuat */
    errorText: {
        type: String,
        default: 'Gambar Gagal Dimuat',
    },
    /** Mengaktifkan klik untuk membuka modal preview / ModalSlider gambar besar */
    previewable: {
        type: Boolean,
        default: false,
    },
    /** Mode preview: trigger thumbnail berasio 1:1 ukuran 120x120px, modal preview menyesuaikan aspect-ratio */
    preview: {
        type: Boolean,
        default: false,
    },
    /** Menampilkan icon zoom badge saat hover jika previewable aktif */
    showZoomIcon: {
        type: Boolean,
        default: false,
    },
    /** Nama/ID Pengunggah (Uploader) untuk info timestamp */
    uploader: {
        type: String,
        default: 'Unknown',
    },
    /** Tanggal pengambilan (Single string, contoh: '12 Jan 2024') */
    date: {
        type: String,
        default: '',
    },
    /** Waktu pengambilan (Single string, contoh: '13:00') */
    time: {
        type: String,
        default: '',
    },
    /** Daftar tanggal pengambilan untuk multi-gambar */
    dateImages: {
        type: Array,
        default: () => [],
    },
    /** Daftar waktu pengambilan untuk multi-gambar */
    timeImages: {
        type: Array,
        default: () => [],
    },
    /** Rasio modal preview ModalSlider ('1/1' | '2/3' | '3/2') */
    modalRatio: {
        type: String,
        default: '',
    },
    /** Interval auto slider (ms) */
    interval: {
        type: Number,
        default: 0,
    },
    /**
     * Mengatur apakah modal preview menampilkan whitespace letterbox (contain) atau pas sesuai rasio gambar (cover).
     * Nilai: true (selalu whitespace), false (tanpa whitespace / exact crop), null (auto-detect berdasarkan rasio asli).
     */
    whitespace: {
        type: [Boolean, String],
        default: null,
    },
});

const emit = defineEmits(['click', 'preview', 'error', 'load', 'update:preview']);

const isImgError = ref(false);
const isPreviewOpen = ref(false);

watch(isPreviewOpen, (val) => {
    emit('update:preview', val);
});

const effectiveImgSrc = computed(() => {
    if (props.imgSrc || props.src) {
        return props.imgSrc || props.src;
    }
    if (Array.isArray(props.images) && props.images.length > 0) {
        return props.images[0];
    }
    return '';
});

// Reset error state if image source changes
watch(
    () => effectiveImgSrc.value,
    () => {
        isImgError.value = false;
    }
);

const isBroken = computed(() => props.imgBroken || props.broken || isImgError.value);
const hasImage = computed(() => Boolean(effectiveImgSrc.value) && !isBroken.value);
const isClickable = computed(() => hasImage.value && (props.previewable || props.preview || props.showZoomIcon));

const effectiveImages = computed(() => {
    if (Array.isArray(props.images) && props.images.length > 0) {
        return props.images;
    }
    return effectiveImgSrc.value ? [effectiveImgSrc.value] : [];
});

const effectiveDateImages = computed(() => {
    if (Array.isArray(props.dateImages) && props.dateImages.length > 0) {
        return props.dateImages;
    }
    if (props.date) {
        return [props.date];
    }
    return undefined;
});

const effectiveTimeImages = computed(() => {
    if (Array.isArray(props.timeImages) && props.timeImages.length > 0) {
        return props.timeImages;
    }
    if (props.time) {
        return [props.time];
    }
    return undefined;
});

const naturalRatio = ref('');

const effectiveModalTitle = computed(() => {
    return props.modalTitle || props.title || props.imgAlt || props.alt || 'Foto Jaminan';
});

const effectiveModalRatio = computed(() => {
    if (props.modalRatio) {
        return props.modalRatio;
    }
    const cleanRatio = String(props.aspect || props.aspectRatio || props.ratio || '').trim().toLowerCase();

    /** Preset map → exact CSS aspect-ratio value */
    const presetMap = {
        // Square
        '1:1': '1/1', '1/1': '1/1', 'square': '1/1',
        // Landscape
        '4:3': '4/3',   '4/3': '4/3',
        '3:2': '3/2',   '3/2': '3/2',   'photo': '3/2',
        '16:9': '16/9', '16/9': '16/9',
        '21:9': '21/9', '21/9': '21/9',
        // Portrait
        '3:4': '3/4',   '3/4': '3/4',
        '2:3': '2/3',   '2/3': '2/3',
        '9:16': '9/16', '9/16': '9/16',
        // Special
        'ktp': '85.6/54',
    };

    if (presetMap[cleanRatio]) return presetMap[cleanRatio];

    // Already CSS slash format (e.g. custom "5/4")
    if (cleanRatio.includes('/')) return cleanRatio;

    // Numeric decimal ratio — use as-is, CSS aspect-ratio supports single numbers
    const numeric = parseFloat(cleanRatio);
    if (!isNaN(numeric) && numeric > 0) return String(numeric);

    // Natural image ratio when auto or unspecified
    if ((cleanRatio === 'auto' || !cleanRatio) && naturalRatio.value) {
        return naturalRatio.value;
    }

    // Fallback
    return '3/2';
});

/**
 * Parses 'W/H' string into numeric ratio W/H.
 * Returns null if unparseable.
 */
const parseRatioToNumber = (ratioStr) => {
    if (!ratioStr) return null;
    const parts = String(ratioStr).split(/[/:]/);
    if (parts.length === 2) {
        const w = parseFloat(parts[0]);
        const h = parseFloat(parts[1]);
        if (w > 0 && h > 0) return w / h;
    }
    const n = parseFloat(ratioStr);
    return isNaN(n) ? null : n;
};

/**
 * Menghitung status whitespace untuk ModalSlider.
 * Mendukung override eksplisit (true/false) dan smart auto-detection
 * jika gambar sudah sesuai (hasil crop) dari InputKTP / rasio target.
 */
const effectiveWhitespace = computed(() => {
    if (props.whitespace === false || props.whitespace === 'false') return false;
    if (props.whitespace === true || props.whitespace === 'true') return true;

    // Smart Auto-detection: jika rasio natural gambar sudah cocok dengan rasio target (misal hasil crop presisi),
    // jangan paksakan whitespace letterbox!
    if (naturalRatio.value) {
        const parts = naturalRatio.value.split('/');
        if (parts.length === 2) {
            const naturalVal = parseFloat(parts[0]) / parseFloat(parts[1]);
            const targetVal = parseRatioToNumber(effectiveModalRatio.value);
            if (naturalVal > 0 && targetVal > 0) {
                return Math.abs(naturalVal - targetVal) / targetVal >= 0.05;
            }
        }
    }

    return null;
});

/**
 * Normalizes preset and custom aspect ratio values into valid CSS aspect-ratio values.
 */
const normalizedAspectRatio = computed(() => {
    const rawRatio = props.aspect || props.aspectRatio || props.ratio;
    if (!rawRatio || rawRatio === 'auto') return 'auto';
    if (typeof rawRatio === 'number') return `${rawRatio}`;

    const clean = String(rawRatio).trim().toLowerCase();
    const presetMap = {
        '1:1': '1 / 1',
        '1/1': '1 / 1',
        'square': '1 / 1',
        '4:3': '4 / 3',
        '4/3': '4 / 3',
        '3:2': '3 / 2',
        '3/2': '3 / 2',
        'photo': '3 / 2',
        '16:9': '16 / 9',
        '16/9': '16 / 9',
        'video': '16 / 9',
        'widescreen': '16 / 9',
        '21:9': '21 / 9',
        '21/9': '21 / 9',
        'ultrawide': '21 / 9',
        '9:16': '9 / 16',
        '9/16': '9 / 16',
        'story': '9 / 16',
        'portrait': '9 / 16',
        '3:4': '3 / 4',
        '3/4': '3 / 4',
        '2:3': '2 / 3',
        '2/3': '2 / 3',
        'ktp': '85.6 / 54',
        'id-card': '85.6 / 54',
        '85.6:54': '85.6 / 54',
        '85.6/54': '85.6 / 54',
    };

    if (presetMap[clean]) {
        return presetMap[clean];
    }

    if (clean.includes(':')) {
        return clean.replace(':', ' / ');
    }

    return rawRatio;
});

/**
 * Computes dynamic styles for the image container box.
 * When props.preview is true, the trigger thumbnail is fixed to ratio 1:1 and size 120x120px.
 */
const containerStyle = computed(() => {
    const style = {};

    if (props.preview) {
        style.aspectRatio = '1 / 1';
        style.width = '120px';
        style.height = '120px';
    } else {
        if (normalizedAspectRatio.value && normalizedAspectRatio.value !== 'auto') {
            style.aspectRatio = normalizedAspectRatio.value;
        }

        if (props.fluid) {
            style.width = '100%';
        } else if (props.width) {
            style.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
        } else if (props.height) {
            style.width = 'auto';
        }

        if (props.height) {
            style.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
        }
    }

    if (props.rounded === false) {
        style.borderRadius = '0px';
    } else if (typeof props.rounded === 'string') {
        style.borderRadius = props.rounded;
    }

    return style;
});

/**
 * Computes dynamic image styles.
 */
const imageStyle = computed(() => ({
    objectFit: props.fit || 'cover',
    objectPosition: props.position || 'center',
}));

const handleImgError = (event) => {
    isImgError.value = true;
    emit('error', event);
};

const handleImgLoad = (event) => {
    isImgError.value = false;
    if (event?.target?.naturalWidth && event?.target?.naturalHeight) {
        naturalRatio.value = `${event.target.naturalWidth}/${event.target.naturalHeight}`;
    }
    emit('load', event);
};

const handleContainerClick = (event) => {
    emit('click', event);
    if ((props.previewable || props.preview) && hasImage.value) {
        isPreviewOpen.value = true;
        emit('preview', {
            src: effectiveImgSrc.value,
            images: effectiveImages.value,
            alt: props.imgAlt || props.alt,
            title: effectiveModalTitle.value,
            uploader: props.uploader,
            date: props.date,
            time: props.time,
        });
    }
};

defineExpose({
    openPreview: () => {
        if (hasImage.value) {
            isPreviewOpen.value = true;
        }
    },
    closePreview: () => {
        isPreviewOpen.value = false;
    },
    isPreviewOpen,
});
</script>

<style lang="scss" scoped>
.image-view {
    display: inline-flex;
    flex-direction: column;
    box-sizing: border-box;

    &.image-view--fluid {
        display: flex;
        width: 100%;
    }

    .image-view-title {
        font-size: var(--g-kit-font-size-sigma, 0.875rem);
        font-weight: var(--g-kit-font-weight-bold, 700);
        color: var(--g-kit-black-90, #1f2328);
        margin-bottom: 0.375rem;
        line-height: 1.3;
    }

    .image-container {
        border: 1px solid var(--g-kit-black-20, #dcdcdc);
        width: 11.25rem;
        height: auto;
        max-width: 100%;
        border-radius: 0.75rem;
        background-color: var(--g-kit-white, #ffffff);
        overflow: hidden;
        position: relative;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;

        &.is-clickable {
            cursor: pointer;

            &:hover {
                border-color: var(--g-kit-broccoli-50, #004d43);
                box-shadow: 0 4px 12px rgba(0, 77, 67, 0.12);

                .image-preview-overlay {
                    opacity: 1;
                }
            }

            &:focus-visible {
                outline: 2px solid var(--g-kit-broccoli-50, #004d43);
                outline-offset: 2px;
            }
        }

        .image-view-img {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
            object-position: center;
            transition: transform 0.25s ease;
        }

        .image-preview-overlay {
            position: absolute;
            inset: 0;
            background-color: rgba(0, 30, 26, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            backdrop-filter: blur(2px);
            z-index: 3;

            .preview-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.375rem;
                padding: 0.375rem 0.625rem;
                background-color: rgba(255, 255, 255, 0.95);
                color: var(--g-kit-broccoli-80, #002e28);
                border-radius: 9999px;
                font-size: var(--g-kit-font-size-atom, 0.75rem);
                font-weight: 600;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            }
        }

        .illustration-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
            padding: 0.5rem;
            color: var(--g-kit-black-50, #8c8c8c);
            font-size: var(--g-kit-font-size-atom, 0.75rem);
            text-align: center;
            user-select: none;
            box-sizing: border-box;

            .illustration-svg {
                max-width: 4rem;
                max-height: 4rem;
                width: 100%;
                height: auto;
                flex-shrink: 0;
                margin-bottom: 0.25rem;
            }

            .illustration-text {
                font-size: var(--g-kit-font-size-atom, 0.75rem);
                color: var(--g-kit-black-50, #8c8c8c);
                font-weight: 500;
                line-height: 1.2;
            }
        }
    }
}
</style>