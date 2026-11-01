import { describe, it, expect, vi } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory, createRouter } from 'vue-router'
import PembayaranMenuPage from '../POS/pembayaran/PembayaranMenuPage.vue'

function createTestApp() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div>Dashboard</div>' } },
      { path: '/pembayaran', component: PembayaranMenuPage },
      { path: '/pembayaran-gadai', component: { template: '<div>Gadai</div>' } },
    ],
  })
  const app = createSSRApp(PembayaranMenuPage)
  app.use(router)
  return { app, router }
}

describe('PembayaranMenuPage (Figma Node 484-13592: Bayar & Beli)', () => {
  it('renders the page title "Bayar & Beli"', async () => {
    const { app } = createTestApp()
    const html = await renderToString(app)
    expect(html).toContain('Bayar &amp; Beli')
  })

  it('renders all three service categories', async () => {
    const { app } = createTestApp()
    const html = await renderToString(app)
    expect(html).toContain('Layanan Pegadaian')
    expect(html).toContain('Top Up')
    expect(html).toContain('Layanan Publik')
  })

  it('renders all 8 service buttons with proper test attributes and labels', async () => {
    const { app } = createTestApp()
    const html = await renderToString(app)

    // Layanan Pegadaian
    expect(html).toContain('data-test="service-kirim-uang"')
    expect(html).toContain('Western Union')
    expect(html).toContain('data-test="service-bayar-gadai"')
    expect(html).toContain('Bayar')
    expect(html).toContain('Gadai')
    expect(html).toContain('data-test="service-bayar-tagihan"')

    // Top Up
    expect(html).toContain('data-test="service-pulsa"')
    expect(html).toContain('data-test="service-ewallet"')

    // Layanan Publik
    expect(html).toContain('data-test="service-listrik"')
    expect(html).toContain('PLN')
    expect(html).toContain('data-test="service-pdam"')
    expect(html).toContain('data-test="service-bpjs"')
    expect(html).toContain('Kesehatan')
  })

  it('includes inline SVG vector icons for each service with zero raster bitmaps', async () => {
    const { app } = createTestApp()
    const html = await renderToString(app)

    expect(html).toContain('<svg')
    expect(html).not.toContain('.png')
    expect(html).not.toContain('.jpg')
  })
})
