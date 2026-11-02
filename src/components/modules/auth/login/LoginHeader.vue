<script setup lang="ts">
import sprintMark from '@/assets/images/sprint/sprint-mark.svg'
import sprintWordmark from '@/assets/images/sprint/sprint-wordmark-dark.svg'
</script>

<template>
  <header class="login-header">
    <div class="sprint-logo" aria-label="SPRINT">
      <img class="sprint-logo__mark" :src="sprintMark" alt="" />
      <img class="sprint-logo__wordmark" :src="sprintWordmark" alt="SPRINT" />
    </div>
    <div class="tagline">
      <p>Single Platform for</p>
      <p>Rapid Information &amp; Transaction</p>
    </div>
  </header>
</template>

<style scoped>
.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.sprint-logo {
  display: flex;
  min-height: 85px;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 8px;

  padding: 1rem;
}

.sprint-logo__mark {
  display: block;
  width: 61px;
  height: 85px;
}

.sprint-logo__wordmark {
  display: block;
  width: 193px;
  height: 38px;
}

.tagline {
  color: var(--g-kit-broccoli-50, #004d43);
  font-size: 18px;
  font-weight: var(--g-kit-font-weight-bold, 800);
  line-height: 26px;
  text-align: center;
}

.tagline p {
  margin: 0;
}

@media (max-width: 420px) {
  .sprint-logo {
    gap: 12px;
  }

  .sprint-logo__mark {
    width: 48px;
    height: 67px;
  }

  .sprint-logo__wordmark {
    width: 154px;
    height: 30px;
  }

  .tagline {
    font-size: 16px;
    line-height: 24px;
  }
}
</style>
