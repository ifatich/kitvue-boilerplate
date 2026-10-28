<script setup lang="ts">
withDefaults(
  defineProps<{
    subtitle?: string
    titleLine1?: string
    titleLine2?: string
    description?: string
  }>(),
  {
    subtitle: 'Selamat Datang di',
    titleLine1: 'Kitvue Starter',
    titleLine2: 'Admin Portal',
    description: 'Template frontend terstandardisasi untuk pengembangan aplikasi Pegadaian & Bullion Bank.',
  },
)
</script>

<template>
  <div class="hero">
    <img class="logo" src="@/assets/images/pegadaian-logo.svg" alt="Pegadaian" />

    <div class="content">
      <span class="subtitle">{{ subtitle }}</span>

      <h1>
        {{ titleLine1 }}
        <br />
        {{ titleLine2 }}
      </h1>

      <div class="line" />

      <p>{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.hero {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: var(--g-kit-white);
}

.logo {
  width: 220px;
  height: auto;
}

.content {
  width: 100%;
  max-width: 540px;
  margin-top: auto;
  margin-bottom: 40px;
}

.subtitle {
  color: var(--g-kit-broccoli-20);
  font-size: var(--g-kit-font-size-delta);
  font-weight: var(--g-kit-font-weight-bold);
  line-height: var(--g-kit-line-height-delta);
}

h1 {
  max-width: 454px;
  margin: 0;
  color: var(--g-kit-white);
  font-size: var(--g-kit-font-size-beta);
  font-weight: var(--g-kit-font-weight-bold);
  line-height: 80px;
  letter-spacing: 0;
}

.line {
  width: 50px;
  height: 2px;
  background: var(--g-kit-white);
  margin: 30px 0 28px;
}

p {
  max-width: 440px;
  margin: 0;
  color: var(--g-kit-white);
  font-size: var(--g-kit-font-size-omicron);
  font-weight: var(--g-kit-font-weight-normal);
  line-height: var(--g-kit-line-height-omicron);
}
</style>
