<script setup lang="ts">
import { ref } from 'vue'
import chevronDownAsset from 'kitvue-public/src/assets/icon/icon-system/icon-chevron-down.svg'
import infoIconAsset from 'kitvue-public/src/assets/icon/icon-system/icon-info.svg'

type DashboardMetric = 'egc' | 'osl' | 'npl' | 'omset' | 'profitability' | 'gold'

const infoIcon = infoIconAsset as unknown as string
const chevronDown = chevronDownAsset as unknown as string
const dashboardPage = ref(0)
const dashboardSlides: DashboardMetric[][] = [
  ['egc', 'osl', 'npl'],
  ['omset', 'profitability', 'gold'],
]

const changeDashboardPage = (direction: number) => {
  dashboardPage.value = direction > 0 ? 1 : 0
}
</script>

<template>
  <section class="panel dashboard-panel" aria-labelledby="dashboard-title">
    <h1 id="dashboard-title">Dashboard</h1>
    <div class="dashboard-carousel">
      <button
        type="button"
        class="dashboard-arrow dashboard-arrow--previous"
        aria-label="Dashboard sebelumnya"
        @click="changeDashboardPage(-1)"
      >
        <img :src="chevronDown" alt="" aria-hidden="true" />
      </button>

      <div class="dashboard-metrics">
        <article
          v-for="metric in dashboardSlides[dashboardPage]"
          :key="metric"
          :class="['dashboard-metric', `dashboard-metric--${metric}`]"
        >
          <template v-if="metric === 'egc'">
            <div class="dashboard-metric__heading">
              <strong>EGC / OGC</strong>
              <img :src="infoIcon" alt="" aria-hidden="true" />
            </div>
            <span class="dashboard-metric__subtitle">Pencapaian per Pegawai</span>
            <div class="dashboard-metric__stats">
              <div><small>Referral</small><b>2</b></div>
              <div><small>Closing</small><b>0</b></div>
              <div><small>Total XP</small><b>0</b></div>
            </div>
          </template>

          <template v-else-if="metric === 'osl'">
            <div class="dashboard-metric__heading">
              <strong>OSL</strong>
              <img :src="infoIcon" alt="" aria-hidden="true" />
            </div>
            <div class="dashboard-metric__osl">
              <div class="dashboard-metric__subheading">
                <span>OSL Gross</span>
                <b class="dashboard-badge">99%</b>
              </div>
              <div class="dashboard-progress"><span /></div>
              <div class="dashboard-metric__footer">
                <small>Pencapaian</small>
                <b>Rp 100,5 M / 105,6 M</b>
              </div>
            </div>
          </template>

          <template v-else-if="metric === 'npl'">
            <div class="dashboard-metric__heading">
              <strong>NPL</strong>
              <img :src="infoIcon" alt="" aria-hidden="true" />
            </div>
            <span class="dashboard-metric__subtitle">Kualitas Kredit</span>
            <div class="dashboard-metric__stats dashboard-metric__stats--npl">
              <div>
                <small>Skor Gadai</small>
                <span><b>0,29</b><em class="dashboard-badge">99%</em></span>
              </div>
              <div>
                <small>Skor Non Gadai</small>
                <span><b>0,05</b><em class="dashboard-badge dashboard-badge--red">50%</em></span>
              </div>
            </div>
          </template>

          <template v-else-if="metric === 'omset'">
            <div class="dashboard-metric__heading">
              <strong>Omset</strong>
              <img :src="infoIcon" alt="" aria-hidden="true" />
            </div>
            <span class="dashboard-metric__subtitle">Per Posisi</span>
            <div class="dashboard-metric__footer dashboard-metric__footer--large">
              <small>Tercapai</small>
              <b>Rp 2,57 M</b>
            </div>
          </template>

          <template v-else-if="metric === 'profitability'">
            <div class="dashboard-metric__heading">
              <strong>Profitabilitas</strong>
              <img :src="infoIcon" alt="" aria-hidden="true" />
            </div>
            <div class="dashboard-metric__footer dashboard-metric__footer--large">
              <small>Total</small>
              <b>61,5%</b>
            </div>
          </template>

          <template v-else>
            <div class="dashboard-metric__heading dashboard-metric__heading--stacked">
              <strong>Harga Tabungan Emas</strong>
              <small>10 Januari 2024</small>
            </div>
            <div class="dashboard-gold-prices">
              <div>
                <span>Beli Emas <img :src="chevronDown" alt="" aria-hidden="true" /></span>
                <b>Rp 5.000 <small>/ 0,01 gr</small></b>
              </div>
              <div>
                <span>Jual Emas <img :src="chevronDown" alt="" aria-hidden="true" /></span>
                <b>Rp 5.000 <small>/ 0,01 gr</small></b>
              </div>
            </div>
          </template>
        </article>
      </div>

      <button
        type="button"
        class="dashboard-arrow dashboard-arrow--next"
        aria-label="Dashboard berikutnya"
        @click="changeDashboardPage(1)"
      >
        <img :src="chevronDown" alt="" aria-hidden="true" />
      </button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.dashboard-panel {
  min-width: 0;
  height: 226px;
  overflow: visible;

  h1 {
    margin: 0;
    color: var(--g-kit-black-80);
    font-size: 20px;
    font-weight: var(--g-kit-font-weight-bold);
    line-height: 30px;
  }
}

.dashboard-carousel {
  position: relative;
  margin: 16px -16px 0;
}

.dashboard-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin: 0 16px;
}

.dashboard-arrow {
  position: absolute;
  z-index: 1;
  top: 53px;
  display: grid;
  width: 40px;
  height: 40px;
  padding: 8px;
  place-items: center;
  border: 1px solid var(--g-kit-black-20);
  border-radius: 50%;
  background: var(--g-kit-white);
  box-shadow: var(--bb-elevation-1);
  cursor: pointer;

  img {
    width: 22px;
    height: 22px;
  }

  &--previous {
    left: -20px;

    img {
      transform: rotate(90deg);
    }
  }

  &--next {
    right: -20px;

    img {
      transform: rotate(-90deg);
    }
  }
}

.dashboard-metric {
  display: flex;
  min-width: 0;
  height: 144px;
  flex-direction: column;
  padding: 11px 15px;
  border: 1px solid var(--g-kit-black-20);
  border-radius: 8px;
  box-sizing: border-box;

  &--egc {
    border-color: rgba(255, 243, 165, 0.5);
    background: rgba(255, 249, 237, 0.5);
  }

  &--osl {
    border-color: #e9f5e2;
    background: rgba(230, 246, 234, 0.5);
  }

  &--npl {
    border-color: #f8f7d3;
    background: rgba(248, 251, 234, 0.5);
  }

  &--omset {
    border-color: rgba(232, 244, 251, 0.5);
    background: rgba(232, 241, 249, 0.5);
  }

  &--profitability {
    border-color: #e6f6f3;
    background: rgba(230, 246, 243, 0.5);
  }

  &--gold {
    border-color: #fbf2e9;
    background: rgba(251, 242, 233, 0.5);
  }

  &__heading {
    display: flex;
    min-height: 24px;
    align-items: center;
    gap: 4px;

    strong {
      overflow: hidden;
      color: var(--g-kit-black-80);
      font-size: 16px;
      font-weight: var(--g-kit-font-weight-bold);
      line-height: 24px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    img {
      width: 20px;
      height: 20px;
      flex: 0 0 20px;
    }

    &--stacked {
      align-items: flex-start;
      flex-direction: column;
      gap: 2px;

      strong {
        max-width: 100%;
      }

      small {
        color: var(--g-kit-black-60);
        font-size: 12px;
        line-height: 18px;
      }
    }
  }

  &__subtitle {
    margin-top: 4px;
    color: var(--g-kit-black-60);
    font-size: 14px;
    font-weight: var(--g-kit-font-weight-normal);
    line-height: 20px;
  }

  &__stats {
    display: flex;
    width: 200px;
    max-width: 100%;
    justify-content: space-between;
    margin-top: auto;

    > div {
      display: flex;
      flex-direction: column;
    }

    small {
      color: var(--g-kit-black-50);
      font-size: 12px;
      line-height: 18px;
    }

    b {
      color: var(--g-kit-black-80);
      font-size: 20px;
      font-weight: var(--g-kit-font-weight-bold);
      line-height: 30px;
    }

    &--npl {
      margin-top: auto;

      > div > span {
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }
  }

  &__osl {
    display: flex;
    width: 200px;
    max-width: 100%;
    flex: 1;
    flex-direction: column;
    margin-top: 4px;
  }

  &__subheading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--g-kit-black-60);
    font-size: 14px;
    line-height: 22px;
  }

  &__footer {
    display: flex;
    width: 100%;
    flex-direction: column;
    margin-top: auto;

    small {
      color: var(--g-kit-black-50);
      font-size: 12px;
      line-height: 18px;
    }

    b {
      color: var(--g-kit-black-80);
      font-size: 20px;
      font-weight: var(--g-kit-font-weight-bold);
      line-height: 30px;
      white-space: nowrap;
    }

    &--large b {
      font-size: 30px;
      line-height: 44px;
    }
  }
}

.dashboard-badge {
  display: inline-flex;
  min-width: 38px;
  height: 22px;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  border-radius: 4px;
  color: var(--g-kit-lime-50);
  background: var(--g-kit-lime-10);
  font-size: 12px;
  font-style: normal;
  font-weight: var(--g-kit-font-weight-bold);
  line-height: 18px;

  &--red {
    color: var(--g-kit-red-50);
    background: var(--g-kit-red-10);
  }
}

.dashboard-progress {
  width: 100%;
  height: 10px;
  margin-top: 6px;
  overflow: hidden;
  border: 1px solid var(--g-kit-black-40);
  border-radius: 8px;
  background: var(--g-kit-white);

  span {
    display: block;
    width: 99%;
    height: 100%;
    background: var(--g-kit-lime-40);
  }
}

.dashboard-gold-prices {
  display: flex;
  gap: 8px;
  margin-top: 12px;

  > div {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 2px;
  }

  span {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--g-kit-black-60);
    font-size: 12px;
    line-height: 18px;

    img {
      width: 16px;
      height: 16px;
    }
  }

  b {
    color: var(--g-kit-black-80);
    font-size: 14px;
    font-weight: var(--g-kit-font-weight-bold);
    line-height: 20px;
    white-space: nowrap;

    small {
      color: var(--g-kit-black-60);
      font-size: 10px;
      font-weight: var(--g-kit-font-weight-normal);
    }
  }
}

@media (max-width: 767.98px) {
  .dashboard-carousel {
    margin-right: -8px;
    margin-left: -8px;
  }

  .dashboard-metrics {
    grid-template-columns: repeat(3, 232px);
    overflow-x: auto;
    padding-bottom: 4px;
    scroll-snap-type: x mandatory;
  }

  .dashboard-metric {
    scroll-snap-align: start;
  }

  .dashboard-arrow {
    top: 47px;
    width: 32px;
    height: 32px;
    padding: 4px;

    img {
      width: 20px;
      height: 20px;
    }

    &--previous {
      left: 0;
    }

    &--next {
      right: 0;
    }
  }
}
</style>
