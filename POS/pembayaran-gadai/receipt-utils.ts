/**
 * receipt-utils.ts
 *
 * Dedicated printable receipt generator and print window dispatcher for SPRINT POS.
 * Conforms to Figma node 336:45674 ("akan open new tab print").
 */
import type { PaymentSummary } from './payment-types'

export interface ReceiptData {
  transactionId: string
  transactionDate?: string
  operatorName?: string
  operatorId?: string
  branchName?: string
  summary: PaymentSummary
}

export function formatCreditNumber(value: string | undefined): string {
  if (!value) return '-'
  return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function formatCurrencyIdr(value: number | undefined): string {
  if (value === undefined || value === null) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value).replace(/\u00a0/g, ' ')
}

export function buildReceiptHtml(data: ReceiptData): string {
  const {
    transactionId,
    transactionDate = new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }),
    operatorName = 'Thoriq Shadad',
    operatorId = 'P91234',
    branchName = 'CP Salemba',
    summary,
  } = data

  const formattedTrxId = transactionId || 'TRX-20241101-99812'

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bukti Pembayaran - ${formattedTrxId}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
      color: #252528;
      background-color: #ffffff;
      padding: 36px 24px;
      margin: 0 auto;
      max-width: 600px;
      line-height: 1.5;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #004d43;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .logo {
      font-size: 22px;
      font-weight: 800;
      color: #004d43;
      letter-spacing: 0.5px;
    }
    .sublogo {
      font-size: 13px;
      color: #58585b;
      margin-top: 4px;
      font-weight: 600;
    }
    .title {
      font-size: 16px;
      font-weight: 800;
      text-align: center;
      margin: 16px 0 12px;
      text-transform: uppercase;
      color: #004d43;
    }
    .section-title {
      font-size: 13px;
      font-weight: 800;
      color: #252528;
      margin: 16px 0 8px;
      border-bottom: 1px solid #eeeeef;
      padding-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
    }
    .table td {
      padding: 5px 0;
      font-size: 13px;
    }
    .table td.label {
      color: #58585b;
      width: 48%;
      font-weight: 600;
    }
    .table td.val {
      text-align: right;
      font-weight: 600;
      color: #252528;
    }
    .table td.val-bold {
      font-weight: 800;
      color: #004d43;
    }
    .divider {
      border-top: 1px dashed #bbbdc0;
      margin: 16px 0;
    }
    .total-row td {
      font-size: 15px;
      font-weight: 800;
      color: #004d43;
      padding-top: 8px;
    }
    .footer {
      margin-top: 32px;
      font-size: 11px;
      text-align: center;
      color: #939597;
      line-height: 1.6;
    }
    @media print {
      body { padding: 0; max-width: 100%; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">PT PEGADAIAN</div>
    <div class="sublogo">SPRINT POS - ${branchName} | Operator: ${operatorName} (${operatorId})</div>
  </div>
  <div class="title">Struk Bukti Pelunasan Gadai</div>

  <div class="section-title">Informasi Transaksi</div>
  <table class="table">
    <tr><td class="label">ID Transaksi</td><td class="val val-bold">${formattedTrxId}</td></tr>
    <tr><td class="label">Waktu Transaksi</td><td class="val">${transactionDate}</td></tr>
    <tr><td class="label">Nomor Kredit</td><td class="val">${formatCreditNumber(summary.number)}</td></tr>
    <tr><td class="label">Nama Nasabah</td><td class="val">${summary.customer || 'Bianca Putri'}</td></tr>
    <tr><td class="label">Jenis Transaksi</td><td class="val">${summary.transactionType || 'Pelunasan'}</td></tr>
    <tr><td class="label">Metode Pembayaran</td><td class="val">${summary.paymentMethod?.label || 'BCA Virtual Account'}</td></tr>
  </table>

  <div class="section-title">Rincian Pembayaran</div>
  <table class="table">
    <tr><td class="label">Sisa Uang Pinjaman</td><td class="val">${formatCurrencyIdr(summary.loanAmount)}</td></tr>
    <tr><td class="label">Sewa Modal (${summary.rentDays} Hari)</td><td class="val">${formatCurrencyIdr(summary.rentAmount)}</td></tr>
    <tr><td class="label">Biaya Layanan</td><td class="val">${formatCurrencyIdr(summary.serviceFee)}</td></tr>
    <tr class="total-row"><td class="label">Total Pembayaran</td><td class="val">${formatCurrencyIdr(summary.total)}</td></tr>
  </table>

  <div class="divider"></div>
  <div class="footer">
    Bukti ini merupakan dokumen sah pencatatan pelunasan gadai di PT Pegadaian.<br>
    Simpan struk ini untuk keperluan pengambilan barang jaminan.
  </div>
  <script>
    window.onload = function() {
      window.print();
    };
  <\/script>
</body>
</html>`
}

/**
 * Dispatches receipt printing to a popup tab with graceful window.print() fallback.
 */
export function printReceiptInNewTab(data: ReceiptData): void {
  if (typeof window === 'undefined') return
  const printWindow = window.open('', '_blank', 'width=780,height=900,menubar=no,toolbar=no,location=no,status=no')
  if (!printWindow || !printWindow.document) {
    // Fallback if popup blocker intercepts window.open or in mock test harness
    window.print()
    return
  }

  const html = buildReceiptHtml(data)
  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
}
