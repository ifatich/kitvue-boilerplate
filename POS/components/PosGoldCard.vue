<script setup lang="ts">
import ButtonComponent from 'kitvue-public/src/components/Button/Button.vue'
import goldIcon from '../assets/figma/gold-product.svg'
import trendDownIcon from '../assets/figma/trend-down.svg'
import trendUpIcon from '../assets/figma/trend-up.svg'

const emit = defineEmits<{
  action: [label: 'Beli' | 'Jual']
}>()
</script>

<template>
  <section class="pos-gold-card" aria-labelledby="pos-gold-title">
    <div class="pos-gold-card__heading">
      <span class="pos-gold-card__icon">
        <img :src="goldIcon" alt="" width="18" height="13.7561" />
      </span>
      <h2 id="pos-gold-title">Emas Pegadaian</h2>
    </div>

    <div class="pos-gold-card__offers">
      <div class="pos-gold-offer">
        <div class="pos-gold-offer__title">Beli Emas</div>
        <div class="pos-gold-offer__price">
          <img class="pos-gold-offer__trend-icon" :src="trendUpIcon" alt="Naik" width="12" height="12" />
          <div class="pos-gold-offer__price-val">
            <span class="pos-gold-offer__currency">Rp</span>
            <span class="pos-gold-offer__amount">23.600</span>
            <span class="pos-gold-offer__unit">/ 0,01 gr</span>
          </div>
        </div>
        <ButtonComponent
          class="pos-gold-offer__button pos-gold-offer__button--primary"
          label="Beli"
          type="primary"
          size="sm"
          @click="emit('action', 'Beli')"
        />
      </div>

      <div class="pos-gold-card__divider" aria-hidden="true" />

      <div class="pos-gold-offer">
        <div class="pos-gold-offer__title">Jual Emas</div>
        <div class="pos-gold-offer__price">
          <img class="pos-gold-offer__trend-icon" :src="trendDownIcon" alt="Turun" width="12" height="12" />
          <div class="pos-gold-offer__price-val">
            <span class="pos-gold-offer__currency">Rp</span>
            <span class="pos-gold-offer__amount">22.770.000</span>
            <span class="pos-gold-offer__unit">/ 0,01 gr</span>
          </div>
        </div>
        <ButtonComponent
          class="pos-gold-offer__button pos-gold-offer__button--secondary"
          label="Jual"
          type="secondary"
          size="sm"
          @click="emit('action', 'Jual')"
        />
      </div>
    </div>
  </section>
</template>
