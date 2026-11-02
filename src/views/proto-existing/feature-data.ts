import type { PrototypeRole } from '@/types/admin'
import aktivitasPembinaan from './assets/aktivitas-pembinaan.svg'
import daftarPembinaan from './assets/daftar-pembinaan.svg'
import daftarPencairanNonGadai from './assets/daftar-pencairan-non-gadai.svg'
import daftarProspek from './assets/daftar-prospek.svg'
import coachingHistory from './assets/coaching-history.png'
import depositoOpenConfirmation from './assets/deposito-open-confirmation.png'
import depositoOpenRequest from './assets/deposito-open-request.png'
import depositoPrint from './assets/deposito-print.png'
import depositoRenewConfirmation from './assets/deposito-renew-confirmation.png'
import depositoRenewRequest from './assets/deposito-renew-request.png'
import depositoWithdrawConfirmation from './assets/deposito-withdraw-confirmation.png'
import depositoWithdrawRequest from './assets/deposito-withdraw-request.png'
import egcCrm from './assets/egc-crm.svg'
import egcFollowUp from './assets/egc-follow-up.svg'
import egcInput from './assets/egc-input.svg'
import employeeLoan from './assets/employee-loan.png'
import managementPrint from './assets/management-print.png'
import managementSerial from './assets/management-serial.png'
import monitorArrum from './assets/monitor-arrum.png'
import monitorDeposito from './assets/monitor-deposito.png'
import monitorGadaiRumah from './assets/monitor-gadai-rumah.png'
import monitorProblemLoan from './assets/monitor-problem-loan.png'
import monitorPumk from './assets/monitor-pumk.png'
import monitorRestructurization from './assets/monitor-restrukturisasi.png'
import monitorTitipan from './assets/monitor-titipan.png'
import pencairanGadai from './assets/pencairan-gadai.svg'
import pencairanNonGadai from './assets/pencairan-non-gadai.svg'
import pengajuanGadai from './assets/pengajuan-gadai.svg'
import problemAuctionRequest from './assets/problem-auction-request.png'
import problemAuctionSale from './assets/problem-auction-sale.png'
import problemPayoff from './assets/problem-payoff.png'
import prospekBaru from './assets/prospek-baru.svg'
import restructuringDisbursement from './assets/restructuring-disbursement.png'
import pumkPostReclassification from './assets/pumk-post-reclassification.png'
import pumkPostRestructure from './assets/pumk-post-restructure.png'
import pumkCashReport from './assets/pumk-cash-report.png'
import pumkCashTransaction from './assets/pumk-cash-transaction.png'
import pumkFundRequest from './assets/pumk-fund-request.png'
import pumkJournalInquiry from './assets/pumk-journal-inquiry.png'
import pumkOverpaymentReturn from './assets/pumk-overpayment-return.png'
import pumkPayment from './assets/pumk-payment.png'
import pumkUnidentifiedPayment from './assets/pumk-unidentified-payment.png'
import pumkWorkingCapital from './assets/pumk-working-capital.png'
import rahnDisbursement from './assets/rahn-disbursement.png'
import rahnSubmission from './assets/rahn-submission.png'
import reportBalanceGadai from './assets/report-balance-gadai.png'
import reportBalanceMicro from './assets/report-balance-micro.png'
import reportDashboardNonGadai from './assets/report-dashboard-non-gadai.png'
import reportDashboardProspek from './assets/report-dashboard-prospek.png'
import reportDashboardPumk from './assets/report-dashboard-pumk.png'
import reportDaftarPinjaman from './assets/report-daftar-pinjaman.png'
import reportDataMitraPumk from './assets/report-data-mitra-pumk.png'
import reportEgcCrm from './assets/report-egc-crm.png'
import reportEgcReactivation from './assets/report-egc-reactivation.png'
import reportKpiRealisasi from './assets/report-kpi-realisasi.png'
import reportOslDaily from './assets/report-osl-daily.png'
import reportPortofolioKredit from './assets/report-portofolio-kredit.png'
import reportRekeningDeposito from './assets/report-rekening-deposito.png'
import titipanPayment from './assets/titipan-payment.png'
import titipanPrint from './assets/titipan-print.png'
import titipanRequest from './assets/titipan-request.png'
import egcReactivation from '@/assets/figma/entry/egc-reactivation.svg'
import eformManage from '@/assets/figma/entry/eform-manage.svg'
import eformPrint from '@/assets/figma/entry/eform-print.svg'
import monitorHomeReport from '@/assets/figma/entry/monitor-home-report.svg'

const imageUrl = (asset: unknown): string => asset as unknown as string

export interface FeatureMenuItem {
  label: string
  icon: string
}

export interface FeatureGroup {
  title: string
  items: FeatureMenuItem[]
}

const item = (label: string, icon: unknown): FeatureMenuItem => ({ label, icon: imageUrl(icon) })

export const featureColumns: FeatureGroup[][] = [
  [
    {
      title: 'Prospek',
      items: [
        item('Prospek Baru', prospekBaru),
        item('Daftar Prospek', daftarProspek),
      ],
    },
    {
      title: 'Pinjaman Non Gadai',
      items: [
        item('Daftar Pencairan', daftarPencairanNonGadai),
        item('Pencairan Non Gadai', pencairanNonGadai),
      ],
    },
    {
      title: 'Restrukturisasi Pinjaman',
      items: [
        item('Pencairan Restrukturisasi', restructuringDisbursement),
      ],
    },
    {
      title: 'Pembinaan Kredit',
      items: [
        item('Daftar Pembinaan', daftarPembinaan),
        item('Aktifitas Pembinaan', aktivitasPembinaan),
        item('Riwayat Pembinaan', coachingHistory),
      ],
    },
    {
      title: 'Penanganan Pinjaman Bermasalah',
      items: [
        item('Pelunasan Pinjaman Bermasalah', problemPayoff),
        item('Pengajuan Penjualan Lelang Pinjaman Bermasalah', problemAuctionRequest),
        item('Penjualan Lelang Pinjaman Bermasalah', problemAuctionSale),
      ],
    },
    {
      title: 'Utilitas',
      items: [
        item('Tes Print', eformPrint),
      ],
    },
    {
      title: 'Manajemen Surat Bukti Gadai/Rahn',
      items: [
        item('Pengajuan Cetak Ulang SBG/SBR', managementPrint),
        item('Pembaruan Nomor Seri SBG/SBR', managementSerial),
      ],
    },
    {
      title: 'Titipan Emas Syariah',
      items: [
        item('Pengajuan Titipan Emas Syariah', titipanRequest),
        item('Pembayaran dan Penebusan Titipan Emas Syariah', titipanPayment),
        item('Cetak Dokumen Titipan Emas Syariah', titipanPrint),
      ],
    },
    {
      title: 'Pasca Kredit PUMK',
      items: [
        item('Realisasi Restrukturisasi PUMK', pumkPostRestructure),
        item('Realisasi Reklasifikasi PUMK', pumkPostReclassification),
      ],
    },
    {
      title: 'Pinjaman Karyawan',
      items: [
        item('Pengajuan dan Konfirmasi Pinjaman Karyawan', employeeLoan),
      ],
    },
  ],
  [
    {
      title: 'Pinjaman Rahn',
      items: [
        item('Pengajuan Rahn', rahnSubmission),
        item('Pencairan Rahn', rahnDisbursement),
      ],
    },
    {
      title: 'Pinjaman Gadai',
      items: [
        item('Pengajuan Gadai Dari Rumah', monitorHomeReport),
        item('Pengajuan Gadai', pengajuanGadai),
        item('Pencairan Gadai', pencairanGadai),
      ],
    },
    {
      title: 'E-Form',
      items: [
        item('Proses Transaksi', eformPrint),
        item('Manajemen Transaksi', eformManage),
      ],
    },
    {
      title: 'EGC / OGC',
      items: [
        item('Input Data EGC/OGC', egcInput),
        item('EGC Leads Reaktivasi', egcReactivation),
        item('Daftar Leads EGC - CRM', egcCrm),
        item('Follow Up EGC - CRM', egcFollowUp),
      ],
    },
    {
      title: 'Deposito Emas',
      items: [
        item('Pengajuan Pembukaan Deposito Emas', depositoOpenRequest),
        item('Konfirmasi Pembukaan Deposito Emas', depositoOpenConfirmation),
        item('Pengajuan Penarikan Deposito Emas', depositoWithdrawRequest),
        item('Konfirmasi Penarikan Deposito Emas', depositoWithdrawConfirmation),
        item('Pengajuan Pembatalan/Perpanjangan Otomatis', depositoRenewRequest),
        item('Konfirmasi Pembatalan/Perpanjangan Otomatis', depositoRenewConfirmation),
        item('Cetak Dokumen Deposito Emas', depositoPrint),
      ],
    },
    {
      title: 'Program UMK (PUMK)',
      items: [
        item('Permohonan Dana Program UMK', pumkFundRequest),
        item('Pembayaran Angsuran dan Pelunasan PUMK', pumkPayment),
        item('Pembayaran PUMK Belum Teridentifikasi', pumkUnidentifiedPayment),
        item('Pengembalian Kelebihan Bayar PUMK', pumkOverpaymentReturn),
        item('Pelaporan Harian Kas dan Bank PUMK', pumkCashReport),
        item('Transfer Modal Kerja (RAK)', pumkWorkingCapital),
        item('Transaksi Kas', pumkCashTransaction),
        item('Inquiry Jurnal Transaksi', pumkJournalInquiry),
      ],
    },
  ],
  [
    {
      title: 'Laporan',
      items: [
        item('OSL Rata Harian', reportOslDaily),
        item('Realisasi KPI', reportKpiRealisasi),
        item('Saldo List Gadai/Rahn', reportBalanceGadai),
        item('Saldo List Mikro', reportBalanceMicro),
        item('Dashboard Kinerja Non Gadai', reportDashboardNonGadai),
        item('Dashboard Prospek Non Gadai', reportDashboardProspek),
        item('Riwayat EGC (Reaktivasi)', reportEgcReactivation),
        item('Riwayat EGC (CRM)', reportEgcCrm),
        item('Portofolio Kredit', reportPortofolioKredit),
        item('Daftar Pinjaman', reportDaftarPinjaman),
        item('Laporan Rekening Deposito Emas', reportRekeningDeposito),
        item('Data Mitra Program UMK', reportDataMitraPumk),
        item('Dashboard Program UMK', reportDashboardPumk),
      ],
    },
    {
      title: 'Monitoring',
      items: [
        item('Laporan Aktivitas Gadai Dari Rumah', monitorGadaiRumah),
        item('Laporan Restrukturisasi', monitorRestructurization),
        item('Laporan Penyelesaian Pinjaman Bermasalah', monitorProblemLoan),
        item('Monitoring Aktivitas Deposito Emas', monitorDeposito),
        item('Monitoring Titipan Emas Syariah', monitorTitipan),
        item('Monitoring Program UMK', monitorPumk),
        item('Monitoring Arrum Multiguna Internal', monitorArrum),
      ],
    },
  ],
]

const existingItemsByLabel = new Map(
  featureColumns.flatMap((column) => column.flatMap((group) => (
    group.items.map((feature) => [feature.label, feature] as const)
  ))),
)

const groupIconFallbacks: Record<string, string> = {
  'Canvassing': imageUrl(prospekBaru),
  'E-Form': imageUrl(eformManage),
  'Pengawasan Melekat (Waskat)': imageUrl(monitorArrum),
  'Pembinaan Gadai': imageUrl(daftarPembinaan),
  'Pinjaman Gadai': imageUrl(pengajuanGadai),
  'Pinjaman Non Gadai': imageUrl(pencairanNonGadai),
  'Pinjaman Rahn': imageUrl(rahnSubmission),
  'Restrukturisasi Pinjaman': imageUrl(restructuringDisbursement),
  'Titipan Emas Syariah': imageUrl(titipanRequest),
  'Program UMK (PUMK)': imageUrl(pumkFundRequest),
  'Pasca Kredit PUMK': imageUrl(pumkPostRestructure),
  'Manajemen Surat Bukti Gadai/Rahn': imageUrl(managementPrint),
  'Penanganan Pinjaman Bermasalah': imageUrl(problemPayoff),
  'Laporan': imageUrl(reportOslDaily),
  'Monitoring': imageUrl(monitorGadaiRumah),
}

const roleGroup = (title: string, labels: string[]): FeatureGroup => ({
  title,
  items: labels.map((label) => ({
    label,
    icon: existingItemsByLabel.get(label)?.icon ?? groupIconFallbacks[title] ?? imageUrl(pengajuanGadai),
  })),
})

export const featureColumnsByRole: Record<PrototypeRole, FeatureGroup[][]> = {
  Kasir: [
    [
      roleGroup('Prospek', ['Prospek Baru', 'Daftar Prospek']),
      roleGroup('Pinjaman Non Gadai', ['Daftar Pencairan', 'Pencairan Non Gadai']),
      roleGroup('Restrukturisasi Pinjaman', ['Pencairan Restrukturisasi']),
      roleGroup('Pembinaan Kredit', ['Daftar Pembinaan', 'Aktivitas Pembinaan', 'Riwayat Pembinaan']),
      roleGroup('Penanganan Pinjaman Bermasalah', [
        'Pelunasan Pinjaman Bermasalah',
        'Pengajuan Penjualan Lelang Pinjaman Bermasalah',
        'Penjualan Lelang Pinjaman Bermasalah',
      ]),
      roleGroup('Utilitas', ['Tes Print']),
      roleGroup('Manajemen Surat Bukti Gadai/Rahn', [
        'Pengajuan Cetak Ulang SBG/SBR',
        'Pembaruan Nomor Seri SBG/SBR',
      ]),
      roleGroup('Titipan Emas Syariah', [
        'Pengajuan Titipan Emas Syariah',
        'Pembayaran dan Pelunasan Titipan Emas Syariah',
        'Cetak Dokumen Titipan Emas Syariah',
      ]),
      roleGroup('Pasca Kredit PUMK', [
        'Realisasi Restrukturisasi PUMK',
        'Realisasi Reklasifikasi PUMK',
      ]),
      roleGroup('Pinjaman Karyawan', ['Pengajuan dan Konfirmasi Pinjaman Karyawan']),
    ],
    [
      roleGroup('Pinjaman Rahn', ['Pengajuan Rahn', 'Pencairan Rahn']),
      roleGroup('Pinjaman Gadai', [
        'Pengajuan Gadai Dari Rumah',
        'Pengajuan Gadai',
        'Pencairan Gadai',
      ]),
      roleGroup('E-Form', ['Proses Transaksi', 'Manajemen Transaksi']),
      roleGroup('EGC / OGC', [
        'Input Data EGC/OGC',
        'EGC Leads Reaktivasi',
        'Daftar Leads EGC - CRM',
        'Follow Up EGC - CRM',
      ]),
      roleGroup('Deposito Emas', [
        'Pengajuan Pembukaan Deposito Emas',
        'Konfirmasi Pembukaan Deposito Emas',
        'Pengajuan Penarikan Deposito Emas',
        'Konfirmasi Penarikan Deposito Emas',
        'Pengajuan Pembatalan/Perpanjangan Otomatis',
        'Konfirmasi Pembatalan/Perpanjangan Otomatis',
        'Cetak Dokumen Deposito Emas',
      ]),
      roleGroup('Program UMK (PUMK)', [
        'Permohonan Dana Program UMK',
        'Pembayaran Angsuran dan Pelunasan PUMK',
        'Pembayaran PUMK Belum Teridentifikasi',
        'Pengembalian Kelebihan Bayar PUMK',
        'Pelaporan Harian Kas dan Bank PUMK',
        'Transfer Modal Kerja (RAK)',
        'Transaksi Kas',
        'Inquiry Jurnal Transaksi',
      ]),
    ],
    [
      roleGroup('Laporan', [
        'OSL Rata Harian',
        'Realisasi KPI',
        'Saldo List Gadai/Rahn',
        'Saldo List Mikro',
        'Dashboard Kinerja Non Gadai',
        'Dashboard Prospek Non Gadai',
        'Riwayat EGC (Reaktivasi)',
        'Riwayat EGC (CRM)',
        'Portofolio Kredit',
        'Daftar Pinjaman',
        'Laporan Rekening Deposito Emas',
        'Data Mitra Program UMK',
        'Dashboard Program UMK',
      ]),
      roleGroup('Monitoring', [
        'Laporan Aktivitas Gadai Dari Rumah',
        'Laporan Restrukturisasi',
        'Laporan Penyelesaian Pinjaman Bermasalah',
        'Monitoring Aktivitas Deposito Emas',
        'Monitoring Titipan Emas Syariah',
        'Monitoring Program UMK',
        'Monitoring Arrum Multiguna Internal',
      ]),
    ],
  ],
  Pinca: [
    [
      roleGroup('Pinjaman Rahn', ['Pengajuan Rahn', 'Persetujuan Rahn']),
      roleGroup('Pinjaman Gadai', [
        'Pengajuan Gadai Dari Rumah',
        'Pengajuan Gadai',
        'Persetujuan Gadai',
      ]),
      roleGroup('E-Form', [
        'Proses Data Nasabah',
        'Manajemen Data Nasabah',
        'Reset Password Tablet E-Form',
        'Manajemen Transaksi',
      ]),
      roleGroup('Pembinaan Kredit', ['Daftar Pembinaan', 'Aktivitas Pembinaan', 'Riwayat Pembinaan']),
      roleGroup('Penanganan Pinjaman Bermasalah', [
        'Penandaan Pinjaman Bermasalah',
        'Pengajuan Relaksasi Pinjaman Bermasalah',
        'Buku Pinjaman Bermasalah',
        'Persetujuan Lelang Pinjaman Bermasalah',
      ]),
      roleGroup('Utilitas', ['Tes Print']),
      roleGroup('Program UMK (PUMK)', [
        'Persetujuan Program UMK',
        'Persetujuan Laporan Harian Kas dan Bank PUMK',
      ]),
      roleGroup('Pasca Kredit PUMK', [
        'Buat Rencana Aktivitas Program UMK',
        'Persetujuan Restrukturisasi PUMK',
        'Persetujuan Reklasifikasi PUMK',
        'Persetujuan Hapus Buku PUMK',
      ]),
    ],
    [
      roleGroup('Pinjaman Non Gadai', ['Persetujuan Non Gadai', 'Otorisasi Pencairan Non Gadai']),
      roleGroup('Restrukturisasi Pinjaman', [
        'Pengajuan Restrukturisasi',
        'Survey Restrukturisasi',
        'Persetujuan Restrukturisasi',
        'Konfirmasi Restrukturisasi',
        'Persetujuan Buku Blokir',
      ]),
      roleGroup('Canvassing', ['Persetujuan Canvassing', 'Persetujuan KCA Take Over']),
      roleGroup('Pengawasan Melekat (Waskat)', [
        'Rencana Waskat',
        'Pelaksanaan Waskat',
        'Supervisi Waskat',
      ]),
      roleGroup('Deposito Emas', [
        'Persetujuan Pembukaan Deposito Emas',
        'Persetujuan Penarikan Deposito Emas',
        'Persetujuan Pembatalan/Perpanjangan Otomatis',
      ]),
      roleGroup('Pembinaan Gadai', [
        'Daftar Pembinaan Gadai',
        'Persetujuan Pembinaan Gadai',
        'Delegasi Pembinaan Gadai',
        'Riwayat Pembinaan Gadai',
      ]),
      roleGroup('Pinjaman Karyawan', [
        'Pengajuan dan Konfirmasi Pinjaman Karyawan',
        'Rekomendasi Pinjaman Karyawan',
        'Persetujuan Pinjaman Karyawan',
        'Otorisasi Pencairan Pinjaman Karyawan',
      ]),
    ],
    [
      roleGroup('Laporan', [
        'OSL Rata Harian',
        'Realisasi KPI',
        'Saldo List Gadai/Rahn',
        'Saldo List Mikro',
        'Laporan Penandaan Pinjaman Bermasalah',
        'Status Prospek',
        'Closing Aktivitas',
        'Closing Unit Kerja',
        'Dashboard Kinerja Non Gadai',
        'Dashboard Prospek Non Gadai',
        'Riwayat EGC (Reaktivasi)',
        'Riwayat EGC (CRM)',
        'Portofolio Kredit',
        'Daftar Pinjaman',
        'Laporan Rekening Deposito Emas',
        'Data Mitra Program UMK',
        'Dashboard Program UMK',
      ]),
      roleGroup('Monitoring', [
        'Laporan Aktivitas Gadai Dari Rumah',
        'Laporan Restrukturisasi',
        'Laporan Penyelesaian Pinjaman Bermasalah',
        'Closing Aktivitas',
        'Closing Unit Kerja',
        'Monitoring Aktivitas Deposito Emas',
        'Monitoring Titipan Emas Syariah',
        'Monitoring Program UMK',
        'Monitoring Arrum Multiguna Internal',
        'Monitoring Kinerja Pinjaman',
      ]),
    ],
  ],
  Penaksir: [
    [
      roleGroup('Prospek', ['Prospek Baru', 'Daftar Prospek']),
      roleGroup('E-Form', [
        'Proses Data Nasabah',
        'Proses Transaksi',
        'Manajemen Transaksi',
      ]),
      roleGroup('Utilitas', ['Tes Print']),
      roleGroup('Pengawasan Melekat (Waskat)', ['Pelaksanaan Waskat']),
      roleGroup('Manajemen Surat Bukti Gadai/Rahn', [
        'Pengajuan Cetak Ulang SBG/SBR',
        'Cetak Ulang SBG/SBR',
        'Pembaruan Nomor Seri SBG/SBR',
      ]),
      roleGroup('Titipan Emas Syariah', [
        'Pengajuan Titipan Emas Syariah',
        'Verifikasi Titipan Emas Syariah',
        'Persetujuan Titipan Emas Syariah',
        'Konfirmasi Titipan Emas Syariah',
        'Cetak Dokumen Titipan Emas Syariah',
      ]),
    ],
    [
      roleGroup('Pinjaman Rahn', ['Pengajuan Rahn', 'Verifikasi Rahn', 'Konfirmasi Rahn']),
      roleGroup('Pinjaman Gadai', [
        'Pengajuan Gadai Dari Rumah',
        'Pengajuan Gadai',
        'Verifikasi Gadai',
        'Konfirmasi Gadai',
        'Persetujuan Gadai',
        'Pencairan Gadai',
        'Daftar Dokumen',
      ]),
      roleGroup('Pinjaman Non Gadai', [
        'Pengajuan Non Gadai',
        'Proses Survey Non Gadai',
        'Konfirmasi Non Gadai',
      ]),
      roleGroup('Pembinaan Kredit', ['Daftar Pembinaan', 'Aktivasi Pembinaan', 'Riwayat Pembinaan']),
      roleGroup('EGC / OGC', [
        'Input Data EGC/OGC',
        'EGC Leads Reaktivasi',
        'Daftar Leads EGC - CRM',
        'Follow Up EGC - CRM',
      ]),
      roleGroup('Pembinaan Gadai', [
        'Daftar Pembinaan Gadai',
        'Delegasi Pembinaan Gadai',
        'Riwayat Pembinaan Gadai',
      ]),
      roleGroup('Pinjaman Karyawan', ['Pengajuan dan Konfirmasi Pinjaman Karyawan']),
    ],
    [
      roleGroup('Laporan', [
        'Dashboard Kinerja Non Gadai',
        'Saldo List Gadai/Rahn',
        'OSL Rata Harian',
        'Portofolio Kredit',
        'Riwayat EGC (Reaktivasi)',
        'Riwayat EGC (CRM)',
        'Realisasi KPI',
        'Daftar Pinjaman',
        'Data Mitra Program UMK',
        'Dashboard Program UMK',
      ]),
      roleGroup('Monitoring', [
        'Monitoring Titipan Emas Syariah',
        'Monitoring Arrum Multiguna Internal',
      ]),
    ],
  ],
}
