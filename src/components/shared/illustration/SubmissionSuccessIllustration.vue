<script setup lang="ts">
import circleBase from '@/assets/figma/rahn-submission-check-layer-circle-base.svg'
import circleInner from '@/assets/figma/rahn-submission-check-layer-circle-inner.svg'
import circleTop from '@/assets/figma/rahn-submission-check-layer-circle-top.svg'
import outline from '@/assets/figma/rahn-submission-check-layer-outline.svg'
import starLeft from '@/assets/figma/rahn-submission-check-star-left.svg'
import starRight from '@/assets/figma/rahn-submission-check-star-right.svg'
import tick from '@/assets/figma/rahn-submission-check-layer-tick.svg'

const layers = [
  { class: 'submission-success-illustration__circle-base', src: circleBase },
  { class: 'submission-success-illustration__circle-inner', src: circleInner },
  { class: 'submission-success-illustration__circle-top', src: circleTop },
  { class: 'submission-success-illustration__tick', src: tick },
  { class: 'submission-success-illustration__star-left', src: starLeft },
  { class: 'submission-success-illustration__star-right', src: starRight },
  { class: 'submission-success-illustration__outline', src: outline },
]
</script>

<template>
  <div class="submission-success-illustration" aria-hidden="true">
    <img
      v-for="layer in layers"
      :key="layer.class"
      :class="layer.class"
      :src="layer.src"
      alt=""
    >
  </div>
</template>

<style scoped lang="scss">
.submission-success-illustration {
  position: relative;
  display: block;
  width: 156px;
  height: 156px;
  flex: 0 0 156px;

  > img {
    position: absolute;
    display: block;
    max-width: none;
  }
}

.submission-success-illustration__circle-base {
  top: 4px;
  left: 5.16px;
  width: 147.08px;
  height: 147.08px;
}

.submission-success-illustration__circle-inner {
  top: 21.83px;
  left: 20.76px;
  width: 114.78px;
  height: 114.78px;
}

.submission-success-illustration__circle-top {
  top: 16.27px;
  left: 20.77px;
  width: 114.4px;
  height: 114.4px;
}

.submission-success-illustration__tick {
  top: 51.89px;
  left: 47.52px;
  width: 62.4px;
  height: 55.7165px;
}

.submission-success-illustration__star-left {
  top: 108.72px;
  left: 0.72px;
  width: 25.06px;
  height: 25.06px;
}

.submission-success-illustration__star-right {
  top: 11.79px;
  left: 122.15px;
  width: 34px;
  height: 33.98px;
}

.submission-success-illustration__outline {
  top: 11.31px;
  left: 0.22px;
  width: 156.44px;
  height: 123px;
}
</style>
