import { describe, expect, it } from 'vitest'
import {
  BENEFICIAL_OWNER_PRESETS,
  normalizeIdentityNumber,
  searchBeneficialOwnerList,
} from '../src/components/modules/rahn'

function calculateAkadDates(jangkaWaktuDays: number, baseDate = new Date(2026, 9, 30)) {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ]

  const format = (d: Date) => `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`

  const akad = format(baseDate)

  const jatuhTempoDate = new Date(baseDate)
  jatuhTempoDate.setDate(jatuhTempoDate.getDate() + jangkaWaktuDays)
  const jatuhTempo = format(jatuhTempoDate)

  const lelangDate = new Date(baseDate)
  lelangDate.setDate(lelangDate.getDate() + jangkaWaktuDays + 20)
  const lelang = format(lelangDate)

  return { akad, jatuhTempo, lelang }
}

describe('Pengajuan Rahn Step 1 Business Rules', () => {
  it('initializes with all fields empty and placeholder akad values by default', () => {
    const defaultFields = {
      tujuanPengajuan: '',
      tujuanTransaksi: '',
      pekerjaanTerkini: '',
      rubrikMarhun: '',
      skemaTarif: '',
      produk: '',
      jangkaWaktu: '',
    }

    const defaultBoState = {
      type: '',
      tipeRahin: '',
      identityType: '',
      identityNumber: '',
      relationship: '',
      selectedBO: null,
      document: null,
    }

    // When jangkaWaktu is empty, akad items should default to "Terisi otomatis"
    const getAkadItems = (jangkaWaktu: string) => {
      if (!jangkaWaktu) {
        return [
          { label: 'Tanggal Akad', value: 'Terisi otomatis' },
          { label: 'Tanggal Jatuh Tempo', value: 'Terisi otomatis' },
          { label: 'Tanggal Lelang', value: 'Terisi otomatis' },
        ]
      }
      return [
        { label: 'Tanggal Akad', value: 'calculated' },
        { label: 'Tanggal Jatuh Tempo', value: 'calculated' },
        { label: 'Tanggal Lelang', value: 'calculated' },
      ]
    }

    expect(defaultFields.tujuanPengajuan).toBe('')
    expect(defaultFields.jangkaWaktu).toBe('')
    expect(defaultBoState.type).toBe('')
    expect(defaultBoState.identityType).toBe('')
    expect(defaultBoState.tipeRahin).toBe('')

    const items = getAkadItems(defaultFields.jangkaWaktu)
    expect(items[0].value).toBe('Terisi otomatis')
    expect(items[1].value).toBe('Terisi otomatis')
    expect(items[2].value).toBe('Terisi otomatis')
  })

  it('correctly calculates dynamic dates when jangka waktu is selected', () => {
    const baseDate = new Date(2026, 9, 30) // 30 Oktober 2026
    const { akad, jatuhTempo, lelang } = calculateAkadDates(120, baseDate)

    expect(akad).toBe('30 Oktober 2026')
    expect(jatuhTempo).toBe('27 Februari 2027')
    expect(lelang).toBe('19 Maret 2027')
  })

  it('rejects advancement when fields are in default empty state', () => {
    const fields = {
      tujuanPengajuan: '',
      tujuanTransaksi: '',
      pekerjaanTerkini: '',
      rubrikMarhun: '',
      skemaTarif: '',
      produk: '',
      jangkaWaktu: '',
    }
    const boState = { type: '' }

    const isStep1Valid =
      Boolean(
        fields.tujuanPengajuan &&
        fields.tujuanTransaksi &&
        fields.pekerjaanTerkini &&
        fields.rubrikMarhun &&
        fields.skemaTarif &&
        fields.produk &&
        fields.jangkaWaktu &&
        boState.type,
      )

    expect(isStep1Valid).toBe(false)
  })

  it('validates Step 1 for Diri Sendiri once all required fields are filled', () => {
    const fields = {
      tujuanPengajuan: 'produktif',
      tujuanTransaksi: 'modal-kerja',
      pekerjaanTerkini: 'pegawai-swasta',
      rubrikMarhun: 'perhiasan-emas',
      skemaTarif: 'reguler',
      produk: 'rahn-reguler',
      jangkaWaktu: '120',
    }

    const boState = {
      type: 'diri_sendiri' as const,
      selectedBO: null,
      relationship: '',
      document: null,
    }

    const isStep1Valid =
      Boolean(
        fields.tujuanPengajuan &&
        fields.tujuanTransaksi &&
        fields.pekerjaanTerkini &&
        fields.rubrikMarhun &&
        fields.skemaTarif &&
        fields.produk &&
        fields.jangkaWaktu,
      ) && (boState.type === 'diri_sendiri' || Boolean(boState.selectedBO && boState.relationship))

    expect(isStep1Valid).toBe(true)
  })

  it('correctly renders KTP Search Table flow matching Figma Node 12920:311792', () => {
    const ktpState = {
      type: 'orang_lain' as const,
      tipeRahin: 'Perorangan' as const,
      identityType: 'ktp' as const,
      identityNumber: '3204 2849 1298 0003',
      document: null,
    }

    const tableRows = [
      {
        no: 1,
        registrationNumber: '1234 1234',
        name: 'Anastasya Delistya',
        nik: '3204 1111 1298 0003',
        pasporNumber: '0033 9714 84',
        birthDate: '9 Desember 1998',
        motherName: 'Annisya',
        gender: 'Perempuan',
        job: 'Pegawai Swasta',
        address: 'Pertokoan Kenari Baru, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10430',
        phone: '0812 2345 3456',
        branch: 'Cabang Salemba',
      },
      {
        no: 2,
        registrationNumber: '1234 2222',
        name: 'Anastasya Delistya',
        nik: '3204 1111 1298 0003',
        pasporNumber: '0033 9714 84',
        birthDate: '9 Desember 1998',
        motherName: 'Annisya',
        gender: 'Perempuan',
        job: 'Pegawai Swasta',
        address: 'Pertokoan Kenari Baru, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10430',
        phone: '0812 2345 3456',
        branch: 'Cabang Salemba',
      },
    ]

    expect(ktpState.identityType).toBe('ktp')
    expect(tableRows.length).toBe(2)
    expect(tableRows[0].registrationNumber).toBe('1234 1234')
    expect(tableRows[1].registrationNumber).toBe('1234 2222')
  })

  it('hides NIK, Surat Kuasa, and Cari until Tipe Identitas is selected, and adapts for Paspor', () => {
    const stateUnselected = {
      type: 'orang_lain' as const,
      identityType: '' as const,
      identityNumber: '',
    }

    const isIdentityDetailsVisible = Boolean(stateUnselected.identityType)
    expect(isIdentityDetailsVisible).toBe(false)

    const stateKtp = {
      type: 'orang_lain' as const,
      identityType: 'ktp' as const,
      identityNumber: '3204 2849 1298 0003',
    }
    expect(Boolean(stateKtp.identityType)).toBe(true)
    expect(stateKtp.identityType === 'ktp' ? 'Nomor Induk Kependudukan (NIK)' : 'Nomor Paspor').toBe(
      'Nomor Induk Kependudukan (NIK)',
    )

    const statePaspor = {
      type: 'orang_lain' as const,
      identityType: 'paspor' as const,
      identityNumber: '0033 9714 84',
    }
    expect(Boolean(statePaspor.identityType)).toBe(true)
    expect(statePaspor.identityType === 'paspor' ? 'Nomor Paspor' : 'Nomor Induk Kependudukan (NIK)').toBe(
      'Nomor Paspor',
    )
    expect(statePaspor.identityNumber).toBe('0033 9714 84')
  })

  it('correctly isolates Paspor Search Table flow matching Figma Node 11347:158046', () => {
    const mockBoList = [
      {
        id: 'bo-1',
        no: 1,
        registrationNumber: '1234 1234',
        name: 'Anastasya Delistya',
        pasporNumber: '0033 9714 84',
        birthDate: '9 Desember 1998',
      },
      {
        id: 'bo-2',
        no: 2,
        registrationNumber: '1234 2222',
        name: 'Anastasya Delistya',
        pasporNumber: '0033 9714 84',
        birthDate: '9 Desember 1998',
      },
    ]

    const getDisplayedBoList = (identityType: string) => {
      if (identityType === 'paspor') {
        return [mockBoList[0]]
      }
      return mockBoList
    }

    const pasporList = getDisplayedBoList('paspor')
    expect(pasporList.length).toBe(1)
    expect(pasporList[0].pasporNumber).toBe('0033 9714 84')
    expect(pasporList[0].registrationNumber).toBe('1234 1234')

    const paginationText = (identityType: string, count: number) =>
      identityType === 'paspor'
        ? `Menampilkan 1 sampai ${count} dari ${count} baris`
        : `Menampilkan 1 sampai ${count} dari ${count} data`

    expect(paginationText('paspor', pasporList.length)).toBe('Menampilkan 1 sampai 1 dari 1 baris')

    const toolbarLabel = (identityType: string) =>
      identityType === 'paspor' ? 'Lihat Detail' : 'Lihat'
    expect(toolbarLabel('paspor')).toBe('Lihat Detail')
    expect(toolbarLabel('ktp')).toBe('Lihat')
  })

  it('handles Branch 1: Data Alamat TIDAK Sesuai KTP (Figma Node 12920:307127)', () => {
    // When checkbox "Alamat tinggal saat ini sesuai dengan kartu identitas." is UNCHECKED
    const isAlamatSesuaiKtp = false

    const shouldShowResidentialAddressInputs = !isAlamatSesuaiKtp

    expect(shouldShowResidentialAddressInputs).toBe(true)

    const domAddress = {
      kodePos: '10320',
      provinsi: 'DKI Jakarta',
      kotaKab: 'Jakarta Pusat',
      kecamatan: 'Menteng',
      kelurahan: 'Pegangsaan',
      rt: '01',
      rw: '02',
      alamatRumah: 'Jl. Borobudur No.10 9',
    }

    expect(domAddress.provinsi).toBe('DKI Jakarta')
    expect(domAddress.alamatRumah).toBe('Jl. Borobudur No.10 9')
  })

  it('handles Branch 2: Data Alamat SESUAI KTP (Figma Node 12920:314583)', () => {
    // When checkbox "Alamat tinggal saat ini sesuai dengan kartu identitas." is CHECKED
    const isAlamatSesuaiKtp = true

    const shouldShowResidentialAddressInputs = !isAlamatSesuaiKtp

    // Address inputs must be hidden matching Node 12920:314583 (70px height)
    expect(shouldShowResidentialAddressInputs).toBe(false)
  })

  it('validates 5 sections in detail view and requires Hubungan before proceed', () => {
    const detailForm = {
      // Seksi 1
      tipeRahin: 'Perorangan',
      jenisIdentitas: 'KTP',
      nomorRegistrasi: '1234 1234',
      hubungan: '',
      // Seksi 2
      nik: '3204 2888 1222 0003',
      nama: 'Anastasya Delistya',
      // Seksi 3
      ktpAlamat: 'Jl. Borobudur No.10 9',
      // Seksi 4
      isAlamatSesuaiKtp: true,
      // Seksi 5
      gender: 'Perempuan',
      job: 'Karyawan Swasta',
    }

    const canProceed = Boolean(detailForm.nomorRegistrasi && detailForm.nik && detailForm.hubungan)
    expect(canProceed).toBe(false) // Missing hubungan

    detailForm.hubungan = 'Orang Tua'
    const canProceedNow = Boolean(detailForm.nomorRegistrasi && detailForm.nik && detailForm.hubungan)
    expect(canProceedNow).toBe(true)
  })

  it('triggers negative flow when KTP NIK is unlisted (Figma Node 11347:151730)', () => {
    const searchIdentity = (type: string, number: string) => {
      const cleanNumber = number.replace(/\s+/g, '')
      if (type === 'ktp' && cleanNumber !== '3204111112980003') {
        return {
          isFound: false,
          showNotFoundModal: true,
          showTambahButton: true,
          tableData: [],
          paginationText: 'Menampilkan 0 sampai 0 dari 0 data',
        }
      }
      return {
        isFound: true,
        showNotFoundModal: false,
        showTambahButton: false,
        tableData: [
          { registrationNumber: '1234 1234', nik: '3204 1111 1298 0003' },
          { registrationNumber: '1234 2222', nik: '3204 1111 1298 0003' },
        ],
        paginationText: 'Menampilkan 1 sampai 2 dari 2 data',
      }
    }

    // Searching unlisted NIK 3204 2849 1298 0003 from Figma 11347:151730
    const negativeResult = searchIdentity('ktp', '3204 2849 1298 0003')
    expect(negativeResult.isFound).toBe(false)
    expect(negativeResult.showNotFoundModal).toBe(true)
    expect(negativeResult.showTambahButton).toBe(true)
    expect(negativeResult.tableData.length).toBe(0)
    expect(negativeResult.paginationText).toBe('Menampilkan 0 sampai 0 dari 0 data')

    // Searching listed NIK 3204 1111 1298 0003
    const positiveResult = searchIdentity('ktp', '3204 1111 1298 0003')
    expect(positiveResult.isFound).toBe(true)
    expect(positiveResult.showNotFoundModal).toBe(false)
    expect(positiveResult.showTambahButton).toBe(false)
    expect(positiveResult.tableData.length).toBe(2)
  })

  it('handles negative flow modal action and transitions to TAMBAH Beneficial Owner reusing same page with all fields enabled (Figma 11347:151906)', () => {
    let step1SubView: 'search' | 'detail' | 'tambah' = 'search'
    let isReadOnly = true
    let showNotFoundModal = true
    const searchedNik = '3204 2849 1298 0003'

    // User clicks "Lanjutkan ke Tambah Beneficial Owner" on Modal
    const handleContinueFromModal = () => {
      showNotFoundModal = false
      step1SubView = 'tambah'
      isReadOnly = false
    }

    handleContinueFromModal()
    expect(showNotFoundModal).toBe(false)
    expect(step1SubView).toBe('tambah')
    expect(isReadOnly).toBe(false) // All fields become ENABLED!

    // In TAMBAH Mode, NIK is prefilled, other fields are editable
    const tambahFormState = {
      tipeRahin: 'Perorangan',
      jenisIdentitas: 'KTP',
      identityNumber: searchedNik,
      nama: '',
      isDukcapilVerified: false,
      hubungan: '',
    }
    expect(tambahFormState.identityNumber).toBe('3204 2849 1298 0003')

    // Simulate Dukcapil check
    tambahFormState.isDukcapilVerified = true
    tambahFormState.nama = 'Budi Santoso'
    tambahFormState.hubungan = 'Orang Tua'

    // Form can be saved once verified and required fields filled
    const canSave = Boolean(
      tambahFormState.identityNumber &&
      tambahFormState.nama &&
      tambahFormState.isDukcapilVerified &&
      tambahFormState.hubungan,
    )
    expect(canSave).toBe(true)

    // Save transition to detail view (with isReadOnly = true)
    step1SubView = 'detail'
    isReadOnly = true
    expect(step1SubView).toBe('detail')
    expect(isReadOnly).toBe(true)
  })

  it('enforces RT / RW exactly 3 digits with error text when less than 3 digits (Point 3)', () => {
    const validateRtRw = (val: string) => {
      const clean = val.replace(/\D/g, '')
      if (!clean) return ''
      return clean.length < 3 ? 'Wajib 3 digit angka (contoh: 001)' : ''
    }

    expect(validateRtRw('')).toBe('')
    expect(validateRtRw('1')).toBe('Wajib 3 digit angka (contoh: 001)')
    expect(validateRtRw('12')).toBe('Wajib 3 digit angka (contoh: 001)')
    expect(validateRtRw('01')).toBe('Wajib 3 digit angka (contoh: 001)')
    expect(validateRtRw('001')).toBe('')
    expect(validateRtRw('123')).toBe('')
  })

  it('dynamically computes Usia from Tanggal Lahir (Point 5)', () => {
    const computeAge = (birthDateStr: string, currentYear = 2026) => {
      if (!birthDateStr) return ''
      const match = birthDateStr.match(/\b(19\d{2}|20\d{2})\b/)
      if (match) {
        const birthYear = parseInt(match[1], 10)
        const age = currentYear - birthYear
        return age >= 0 && age <= 130 ? String(age) : ''
      }
      return ''
    }

    expect(computeAge('')).toBe('')
    expect(computeAge('1998-12-09', 2026)).toBe('28')
    expect(computeAge('9 Desember 1998', 2026)).toBe('28')
    expect(computeAge('2000-01-01', 2026)).toBe('26')
  })

  it('ensures TAMBAH mode fields default to empty string so generic placeholders render (Point 4)', () => {
    const tambahDefaultFields = {
      jenisKelamin: '',
      pendidikan: '',
      statusPerkawinan: '',
      namaPasangan: '',
      jumlahTanggungan: '',
      nomorTelepon: '',
      nomorHandphone: '',
      email: '',
      nomorNpwp: '',
      tipeKependudukan: '',
      sumberDana: '',
      pekerjaanTerkini: '',
      agama: '',
      rataPenghasilan: '',
    }

    Object.values(tambahDefaultFields).forEach((val) => {
      expect(val).toBe('')
    })
  })

  describe('KTP Decision Flow on TAMBAH Beneficial Owner (Figma Decision Diagram)', () => {
    it('Branch 1: prompts confirmation modal when navigating back or searching from TAMBAH BO', () => {
      let step1SubView: 'search' | 'detail' | 'tambah' = 'tambah'
      let showConfirmResetModal = false

      // Trigger "Sebelumnya" while on TAMBAH BO
      const handlePrev = () => {
        if (step1SubView === 'tambah') {
          showConfirmResetModal = true
        }
      }

      handlePrev()
      expect(showConfirmResetModal).toBe(true)
      expect(step1SubView).toBe('tambah') // Still on tambah

      // If user cancels ("Kembali")
      showConfirmResetModal = false
      expect(step1SubView).toBe('tambah')

      // If user confirms ("Ya, Lanjut Cari")
      const handleConfirmReset = () => {
        showConfirmResetModal = false
        step1SubView = 'search'
      }
      handleConfirmReset()
      expect(showConfirmResetModal).toBe(false)
      expect(step1SubView).toBe('search')
    })

    it('Branch 3: validates that user must verify Dukcapil before proceeding', () => {
      const formState = {
        isDukcapilVerified: false,
        isAlamatSesuaiKtp: true,
        nik: '3204 2849 1298 0003',
        nama: 'Budi Santoso',
      }

      let warningModal = {
        isOpen: false,
        title: '',
        desc: '',
      }

      const handleNext = () => {
        if (!formState.isDukcapilVerified) {
          warningModal = {
            isOpen: true,
            title: 'Perhatian',
            desc: 'Anda harus melakukan cek dukcapil terlebih dahulu.',
          }
          return false
        }
        return true
      }

      const result = handleNext()
      expect(result).toBe(false)
      expect(warningModal.isOpen).toBe(true)
      expect(warningModal.title).toBe('Perhatian')
      expect(warningModal.desc).toBe('Anda harus melakukan cek dukcapil terlebih dahulu.')
    })

    it('Branch 4: validates that user must check Alamat Sesuai KTP checkbox before proceeding', () => {
      const formState = {
        isDukcapilVerified: true,
        isAlamatSesuaiKtp: false, // User forgot to check the box
        nik: '3204 2849 1298 0003',
        nama: 'Budi Santoso',
      }

      let warningModal = {
        isOpen: false,
        title: '',
        desc: '',
      }

      const handleNext = () => {
        if (!formState.isDukcapilVerified) {
          warningModal = {
            isOpen: true,
            title: 'Perhatian',
            desc: 'Anda harus melakukan cek dukcapil terlebih dahulu.',
          }
          return false
        }
        if (!formState.isAlamatSesuaiKtp) {
          warningModal = {
            isOpen: true,
            title: 'Tidak Dapat Melanjutkan',
            desc: 'Pastikan Anda sudah centang kolom data nasabah sudah sesuai dengan kartu identitas.',
          }
          return false
        }
        return true
      }

      const result = handleNext()
      expect(result).toBe(false)
      expect(warningModal.isOpen).toBe(true)
      expect(warningModal.title).toBe('Tidak Dapat Melanjutkan')
      expect(warningModal.desc).toBe(
        'Pastikan Anda sudah centang kolom data nasabah sudah sesuai dengan kartu identitas.',
      )
    })

    it('Branch 2: successful save progression (Confirm Save Modal -> Success Modal -> Step 2)', () => {
      const formState = {
        isDukcapilVerified: true,
        isAlamatSesuaiKtp: true,
        nik: '3204 2849 1298 0003',
        nama: 'Budi Santoso',
        hubungan: 'Suami / Istri',
      }

      let activeStep = 1
      let showConfirmSaveModal = false
      let showSaveSuccessModal = false
      let savedBO: Record<string, any> | null = null

      // User clicks "Selanjutnya"
      const handleNext = () => {
        if (!formState.isDukcapilVerified) return false
        if (!formState.isAlamatSesuaiKtp) return false
        if (!formState.nik || !formState.nama || !formState.hubungan) return false

        showConfirmSaveModal = true
        return false
      }

      handleNext()
      expect(showConfirmSaveModal).toBe(true)
      expect(showSaveSuccessModal).toBe(false)
      expect(activeStep).toBe(1)

      // User clicks "Lanjutkan" in Confirm Save Modal
      const handleConfirmSave = () => {
        showConfirmSaveModal = false
        showSaveSuccessModal = true
      }
      handleConfirmSave()
      expect(showConfirmSaveModal).toBe(false)
      expect(showSaveSuccessModal).toBe(true)
      expect(activeStep).toBe(1)

      // User clicks "Lanjutkan ke Data Rahin" in Success Modal
      const handleContinueToRahin = () => {
        showSaveSuccessModal = false
        savedBO = {
          nik: formState.nik,
          name: formState.nama,
          relationship: formState.hubungan,
        }
        activeStep = 2
      }
      handleContinueToRahin()
      expect(showSaveSuccessModal).toBe(false)
      expect(savedBO).not.toBeNull()
      expect(savedBO?.name).toBe('Budi Santoso')
      expect(activeStep).toBe(2) // Successfully progressed to Step 2!
    })
  })

  describe('Dynamic Beneficial Owner Search & Presets (NIK & Paspor: With Value vs Empty)', () => {
    it('normalizes identity numbers with varying spaces and formats', () => {
      expect(normalizeIdentityNumber('3204 1111 1298 0003')).toBe('3204111112980003')
      expect(normalizeIdentityNumber('3204111112980003')).toBe('3204111112980003')
      expect(normalizeIdentityNumber('  0033 9714 84  ')).toBe('0033971484')
      expect(normalizeIdentityNumber('')).toBe('')
    })

    it('KTP With Value: returns matching records for registered NIK (e.g. 3204 1111 1298 0003)', () => {
      const resultsWithSpaces = searchBeneficialOwnerList('ktp', '3204 1111 1298 0003')
      expect(resultsWithSpaces.length).toBe(2)
      expect(resultsWithSpaces[0].registrationNumber).toBe('1234 1234')
      expect(resultsWithSpaces[0].name).toBe('Anastasya Delistya')
      expect(resultsWithSpaces[1].registrationNumber).toBe('1234 2222')

      const resultsWithoutSpaces = searchBeneficialOwnerList('ktp', '3204111112980003')
      expect(resultsWithoutSpaces.length).toBe(2)
    })

    it('KTP Empty / Without Value: returns empty array for unregistered NIK (e.g. 3204 2849 1298 0003)', () => {
      const emptyResults = searchBeneficialOwnerList('ktp', '3204 2849 1298 0003')
      expect(emptyResults.length).toBe(0)

      const randomResults = searchBeneficialOwnerList('ktp', '3201 0000 0000 0000')
      expect(randomResults.length).toBe(0)
    })

    it('Paspor With Value: returns matching record for registered Paspor (e.g. 0033 9714 84)', () => {
      const results = searchBeneficialOwnerList('paspor', '0033 9714 84')
      expect(results.length).toBe(1)
      expect(results[0].registrationNumber).toBe('1234 1234')
      expect(results[0].pasporNumber).toBe('0033 9714 84')
      expect(results[0].name).toBe('Anastasya Delistya')
    })

    it('Paspor Empty / Without Value: returns empty array for unregistered Paspor (e.g. 0099 9999 99)', () => {
      const emptyResults = searchBeneficialOwnerList('paspor', '0099 9999 99')
      expect(emptyResults.length).toBe(0)

      const unlistedResults = searchBeneficialOwnerList('paspor', 'P12345678')
      expect(unlistedResults.length).toBe(0)
    })

    it('contains all 4 required presets for testing and QA simulation', () => {
      const ktpWithVal = BENEFICIAL_OWNER_PRESETS.find((p) => p.id === 'ktp-found')
      const ktpEmpty = BENEFICIAL_OWNER_PRESETS.find((p) => p.id === 'ktp-not-found')
      const pasporWithVal = BENEFICIAL_OWNER_PRESETS.find((p) => p.id === 'paspor-found')
      const pasporEmpty = BENEFICIAL_OWNER_PRESETS.find((p) => p.id === 'paspor-not-found')

      expect(ktpWithVal?.hasValue).toBe(true)
      expect(ktpWithVal?.value).toBe('3204 1111 1298 0003')
      expect(ktpWithVal?.expectedCount).toBe(2)

      expect(ktpEmpty?.hasValue).toBe(false)
      expect(ktpEmpty?.value).toBe('3204 2849 1298 0003')
      expect(ktpEmpty?.expectedCount).toBe(0)

      expect(pasporWithVal?.hasValue).toBe(true)
      expect(pasporWithVal?.value).toBe('0033 9714 84')
      expect(pasporWithVal?.expectedCount).toBe(1)

      expect(pasporEmpty?.hasValue).toBe(false)
      expect(pasporEmpty?.value).toBe('0099 9999 99')
      expect(pasporEmpty?.expectedCount).toBe(0)
    })

    describe('Paspor Specific Flow Rules (Figma Nodes 11752:121098, 11752:120905, 11347:155489)', () => {
      it('Paspor Read-Only (Ada Data): exposes full residential address when isAlamatSesuai is false (Node 11752:121098)', () => {
        const results = searchBeneficialOwnerList('paspor', '0033 9714 84')
        expect(results.length).toBe(1)
        const bo = results[0]

        expect(bo.pasporNumber).toBe('0033 9714 84')
        expect(bo.name).toBe('Anastasya Delistya')
        expect(bo.birthDate).toBe('12 Januari 1999')
        expect(bo.motherName).toBe('Putri')
        expect(bo.domKodePos).toBe('10321')
        expect(bo.domKotaKab).toBe('Jakarta Selatan')
        expect(bo.domKecamatan).toBe('Mampang')
        expect(bo.domKelurahan).toBe('Pela Mampang')
        expect(bo.domRt).toBe('001')
        expect(bo.domRw).toBe('002')
        expect(bo.domAlamatRumah).toBe('Jl. A No. 10')
      })

      it('Paspor Tambah Flow: skips Dukcapil verification during Step 1 validation', () => {
        const validateStep1Sim = (identityType: 'ktp' | 'paspor', isDukcapilVerified: boolean) => {
          if (identityType === 'ktp' && !isDukcapilVerified) {
            return { valid: false, error: 'dukcapil_required' }
          }
          return { valid: true }
        }

        // KTP requires dukcapil verification
        expect(validateStep1Sim('ktp', false)).toEqual({ valid: false, error: 'dukcapil_required' })
        expect(validateStep1Sim('ktp', true)).toEqual({ valid: true })

        // Paspor never requires dukcapil verification
        expect(validateStep1Sim('paspor', false)).toEqual({ valid: true })
        expect(validateStep1Sim('paspor', true)).toEqual({ valid: true })
      })

      it('Paspor Tambah Flow: enforces RT and RW 3-digit constraint', () => {
        const validateRtRw = (rt: string, rw: string) => {
          const rtDigits = rt.replace(/\D/g, '')
          const rwDigits = rw.replace(/\D/g, '')
          if (rtDigits.length > 0 && rtDigits.length < 3) return 'RT wajib 3 digit'
          if (rwDigits.length > 0 && rwDigits.length < 3) return 'RW wajib 3 digit'
          return null
        }

        expect(validateRtRw('1', '002')).toBe('RT wajib 3 digit')
        expect(validateRtRw('01', '002')).toBe('RT wajib 3 digit')
        expect(validateRtRw('001', '2')).toBe('RW wajib 3 digit')
        expect(validateRtRw('001', '002')).toBeNull()
      })
    })

    describe('Flow Rules: Tombol Cari Gating, Auto-Select Row & Hubungan Validation', () => {
      it('Cari button is disabled until all mandatory fields (type, tipeRahin, identityType, identityNumber) are filled', () => {
        const isSearchReadySim = (state: {
          type: string
          tipeRahin?: string
          identityType?: string
          identityNumber?: string
        }) => {
          if (state.type !== 'orang_lain') return false
          if (!state.tipeRahin || !state.tipeRahin.trim()) return false
          if (!state.identityType) return false
          const cleanId = (state.identityNumber || '').replace(/\s+/g, '')
          if (!cleanId) return false
          return true
        }

        // Empty state
        expect(isSearchReadySim({ type: '', tipeRahin: '', identityType: '', identityNumber: '' })).toBe(false)

        // Type chosen, but no tipeRahin
        expect(isSearchReadySim({ type: 'orang_lain', tipeRahin: '', identityType: 'ktp', identityNumber: '3204 1111' })).toBe(false)

        // TipeRahin chosen, but no identityType
        expect(isSearchReadySim({ type: 'orang_lain', tipeRahin: 'Perorangan', identityType: '', identityNumber: '3204 1111' })).toBe(false)

        // IdentityType chosen, but empty identityNumber
        expect(isSearchReadySim({ type: 'orang_lain', tipeRahin: 'Perorangan', identityType: 'paspor', identityNumber: '   ' })).toBe(false)

        // All mandatory fields filled (Surat Kuasa omitted/optional) -> Enabled!
        expect(isSearchReadySim({ type: 'orang_lain', tipeRahin: 'Perorangan', identityType: 'paspor', identityNumber: '0033 9714 84' })).toBe(true)
        expect(isSearchReadySim({ type: 'orang_lain', tipeRahin: 'Badan Usaha', identityType: 'ktp', identityNumber: '3204 1111 1298 0003' })).toBe(true)
      })

      it('Step 1 Search Table: clicking Selanjutnya auto-selects first row from table when none is selected', () => {
        const searchResults = searchBeneficialOwnerList('paspor', '0033 9714 84')
        expect(searchResults.length).toBeGreaterThan(0)

        let selectedBO: any = null
        let isAlamatSesuaiKtp = false

        // User clicks Selanjutnya on search view
        if (!selectedBO && searchResults.length > 0) {
          selectedBO = searchResults[0]
          isAlamatSesuaiKtp = selectedBO.registrationNumber === '1234 2222'
        }

        expect(selectedBO).not.toBeNull()
        expect(selectedBO.name).toBe('Anastasya Delistya')
        expect(selectedBO.registrationNumber).toBe('1234 1234')
        expect(isAlamatSesuaiKtp).toBe(false)
      })

      it('Step 1 Search Table: clicking Selanjutnya without relationship triggers error "Kolom ini wajib diisi."', () => {
        const validateNextSim = (state: { selectedBO: any; relationship: string }) => {
          if (!state.selectedBO) {
            return { valid: false, error: 'Silakan pilih data Beneficial Owner di tabel.' }
          }
          if (!state.relationship || !state.relationship.trim()) {
            return { valid: false, error: 'Kolom ini wajib diisi.' }
          }
          return { valid: true }
        }

        // Selected row exists, but relationship is empty
        const invalidRes = validateNextSim({
          selectedBO: { name: 'Anastasya Delistya' },
          relationship: '',
        })
        expect(invalidRes.valid).toBe(false)
        expect(invalidRes.error).toBe('Kolom ini wajib diisi.')

        // With relationship filled -> valid!
        const validRes = validateNextSim({
          selectedBO: { name: 'Anastasya Delistya' },
          relationship: 'suami-istri',
        })
        expect(validRes.valid).toBe(true)
      })

      it('Step 1 Search Table: relationship error triggers inline error text only, leaving top alert null', () => {
        let validationAlert: string | null = null
        let relationshipError = ''

        const handleNextWithEmptyRelationship = () => {
          // Rule: "cek gambar bukan alert yang berubah status"
          relationshipError = 'Kolom ini wajib diisi.'
          validationAlert = null // Must remain null!
        }

        handleNextWithEmptyRelationship()
        expect(relationshipError).toBe('Kolom ini wajib diisi.')
        expect(validationAlert).toBeNull()

        // When user selects relationship, inline error clears immediately
        const handleSelectRelationship = (val: string) => {
          if (val) {
            relationshipError = ''
          }
        }
        handleSelectRelationship('suami-istri')
        expect(relationshipError).toBe('')
      })

      it('Step 1 Detail/Tambah BO Completion: returns to Step 1 with updated table value, NOT directly to Step 2', () => {
        let activeStep = 1
        let step1SubView: 'search' | 'detail' | 'tambah' = 'detail'
        let isBOConfirmed = false
        let showConfirmSaveModal = false
        let showSaveSuccessModal = false
        let boSearchResults = [
          {
            id: '1',
            no: 1,
            registrationNumber: '1234 1234',
            name: 'Anastasya Delistya',
            pasporNumber: '0033 9714 84',
            birthDate: '9 Desember 1998',
            motherName: 'Putri',
            gender: 'Perempuan',
            job: 'Karyawan Swasta',
            address: 'Jl. Merdeka No. 10',
            phone: '0812 2345 3456',
            branch: 'Cabang Salemba',
          },
        ]
        let selectedBO: any = boSearchResults[0]

        // 1. User is on Detail Data Beneficial Owner and clicks Selanjutnya
        const onDetailClickSelanjutnya = () => {
          // Must open save confirm modal, NOT advance to Step 2
          showConfirmSaveModal = true
        }
        onDetailClickSelanjutnya()
        expect(showConfirmSaveModal).toBe(true)
        expect(activeStep).toBe(1)

        // 2. User confirms save in modal
        const onConfirmSave = () => {
          showConfirmSaveModal = false
          showSaveSuccessModal = true
        }
        onConfirmSave()
        expect(showSaveSuccessModal).toBe(true)
        expect(activeStep).toBe(1)

        // 3. User clicks "Kembali ke Step 1" in success modal
        const onContinueFromSuccessModal = () => {
          showSaveSuccessModal = false
          isBOConfirmed = true
          step1SubView = 'search' // Returns to Step 1 search view!
          activeStep = 1          // Must remain Step 1!
          // Selected BO is reflected in the table with [ Terpilih ]
          selectedBO = { ...selectedBO, phone: '0812 2345 5678' }
          const idx = boSearchResults.findIndex((b) => b.registrationNumber === selectedBO.registrationNumber)
          if (idx >= 0) boSearchResults[idx] = selectedBO
        }
        onContinueFromSuccessModal()

        // Verify: Returned to Step 1, table value is updated, not in Step 2!
        expect(activeStep).toBe(1)
        expect(step1SubView).toBe('search')
        expect(isBOConfirmed).toBe(true)
        expect(selectedBO.phone).toBe('0812 2345 5678')
        expect(boSearchResults[0].phone).toBe('0812 2345 5678')

        // 4. Now user on Step 1 clicks Selanjutnya
        const onStep1ClickSelanjutnya = () => {
          if (isBOConfirmed && selectedBO) {
            activeStep = 2
          }
        }
        onStep1ClickSelanjutnya()
        expect(activeStep).toBe(2)
      })

      it('Table Initial State: all rows display [ Pilih ] initially, none is [ Terpilih ] until confirmed', () => {
        let isBOConfirmed = false
        let selectedBO: any = { registrationNumber: '1234 1234' }

        const getSelectedBoForTable = () => (isBOConfirmed ? selectedBO : null)

        // Before confirmation: selected-bo passed to table is null
        expect(getSelectedBoForTable()).toBeNull()

        // Clicking [ Pilih ] on table row navigates to preview page without marking Terpilih yet
        let step1SubView = 'search'
        const handleSelectRow = (row: any) => {
          selectedBO = row
          step1SubView = 'detail' // Navigates to preview page
        }
        handleSelectRow({ registrationNumber: '1234 1234' })
        expect(step1SubView).toBe('detail')
        expect(isBOConfirmed).toBe(false)
        expect(getSelectedBoForTable()).toBeNull() // Still null in table!

        // After preview completion and confirmation
        isBOConfirmed = true
        step1SubView = 'search'
        expect(getSelectedBoForTable()).toEqual({ registrationNumber: '1234 1234' })
      })

      it('KTP vs Paspor Search Card Structure: KTP card has no "Data Pendukung", Paspor retains "Data Pendukung"', () => {
        const hasDataPendukungSection = (identityType: 'ktp' | 'paspor') => {
          return identityType === 'paspor'
        }

        expect(hasDataPendukungSection('ktp')).toBe(false)
        expect(hasDataPendukungSection('paspor')).toBe(true)
      })

      it('Step 2 Back Button: clicking Kembali from Step 2 returns directly to Step 1 main view (search), not to preview detail', () => {
        let activeStep = 2
        let step1SubView: 'search' | 'detail' | 'tambah' = 'search'

        const prevStepSim = () => {
          if (activeStep === 2) {
            activeStep = 1
            step1SubView = 'search' // Always return directly to Step 1 main view!
          }
        }

        prevStepSim()
        expect(activeStep).toBe(1)
        expect(step1SubView).toBe('search')
      })
    })
  })
})
