<script setup lang="ts">
import { inject } from 'vue'
import { GAlert, GButton, GDropdown, GInputSmallDate, GInputText, GModal, GTextArea } from '@/components'
import ModuleSectionCard from '@/components/shared/card/ModuleSectionCard.vue'
import RahnApplicationDropdowns from '@/components/modules/rahn/RahnApplicationDropdowns.vue'
import { RahnReadonlyInfoGrid } from '@/components/modules/rahn'
import ownerNotFoundIllustration from '@/assets/figma/beneficial-owner-not-found.svg'
import uploadSuratKuasaFrame from '@/assets/figma/upload-surat-kuasa.png'
import { rahnFlowKey } from '../rahnFlow'

const flow = inject(rahnFlowKey)
if (!flow) throw new Error('Rahn flow context is unavailable')
const {
  fields, isMobile, isSubmitted, purposeTransactionOptions, employmentOptions,
  ownerOptions,
  rahinTypeOptions, identityOptions, relationshipOptions, isOwnerResultsVisible, ownerMatchFound,
  ownerAge, validityOptions, provinceOptions, cityOptions, districtOptions, subdistrictOptions,
  isRtValid, isRwValid, isOwnerDataConfirmed, isOwnerAddressSame, genderOptions, educationOptions,
  maritalOptions, nationalityOptions, populationOptions, fundOptions, incomeOptions, isInformasiRahnOpen,
  isBeneficialOwnerOpen, isOwnerDetailsVisible,
  showOwnerNotFoundModal, dukcapilStatus, akadItems, searchBeneficialOwner,
  continueToAddBeneficialOwner, openBeneficialOwnerDetail, checkDukcapil,
} = flow
const dropdownError = (label: string) => `Pilih ${label.toLowerCase()}`
const requiredError = (value: string, label: string) => isSubmitted.value && !value?.trim()
  ? `Masukkan ${label}`
  : ''
</script>

<template>
      <div class="form-content">
        <div class="form-card" :class="{ 'form-card--owner-details': isOwnerDetailsVisible }">
          <ModuleSectionCard title="Informasi Gadai" v-model="isInformasiRahnOpen">
            <h3>Transaksi dan Produk</h3>
            <RahnApplicationDropdowns
              class="form-grid"
              :purpose="fields.tujuanPengajuan"
              :transaction-purpose="fields.tujuanTransaksi"
              :employment="fields.pekerjaanTerkini"
              :rubric="fields.rubrikMarhun"
              :tariff="fields.skemaTarif"
              :product="fields.produk"
              :duration="fields.jangkaWaktu"
              :transaction-options="purposeTransactionOptions"
              :is-mobile="isMobile"
              :is-submitted="isSubmitted"
              @update:purpose="fields.tujuanPengajuan = $event"
              @update:transaction-purpose="fields.tujuanTransaksi = $event"
              @update:employment="fields.pekerjaanTerkini = $event"
              @update:rubric="fields.rubrikMarhun = $event"
              @update:tariff="fields.skemaTarif = $event"
              @update:product="fields.produk = $event"
              @update:duration="fields.jangkaWaktu = $event"
            />

            <div class="section-divider" />

            <RahnReadonlyInfoGrid
              class="akad-info"
              title="Informasi Kredit"
              :items="akadItems"
            />

          </ModuleSectionCard>

          <ModuleSectionCard :title="isOwnerDetailsVisible ? 'Data Beneficial Owner' : 'Beneficial Owner'" v-model="isBeneficialOwnerOpen" class="owner-detail-wrapper">
            <div v-if="!isOwnerDetailsVisible" class="owner-field">
              <GDropdown
                v-model="fields.beneficialOwner"
                label="Tipe Beneficial Owner"
                placeholder="Pilih tipe beneficial owner"
                :items="ownerOptions"
                item-value="value"
                item-text="label"
                :error="dropdownError('Tipe Beneficial Owner')"
                :required="isSubmitted"
                :is-checked="isSubmitted"
                :use-bottom-sheet="isMobile"
              />
            </div>

            <template v-if="isOwnerDetailsVisible">
              <div v-if="!isOwnerDetailsVisible" class="owner-subsection">
                <h3>Informasi Beneficial Owner</h3>
                <div class="form-grid">
                  <GDropdown v-model="fields.tipeRahin" label="Tipe Rahin" placeholder="Pilih tipe Rahin" :items="rahinTypeOptions" item-value="value" item-text="label" :error="dropdownError('Tipe Rahin')" :required="isSubmitted" :is-checked="isSubmitted" :use-bottom-sheet="isMobile" />
                  <GDropdown v-model="fields.tipeIdentitas" label="Tipe Identitas" placeholder="Pilih tipe identitas" :items="identityOptions" item-value="value" item-text="label" :error="dropdownError('Tipe Identitas')" :required="isSubmitted" :is-checked="isSubmitted" :use-bottom-sheet="isMobile" />
                  <GInputText
                    v-if="fields.tipeRahin === 'Perorangan' && fields.tipeIdentitas === 'KTP' && !isOwnerDetailsVisible"
                    v-model="fields.nikBeneficialOwner"
                    label="Nomor Induk Kependudukan (NIK)"
                    placeholder="Masukkan 16 digit NIK"
                    :error="requiredError(fields.nikBeneficialOwner, 'NIK')"
                    type="number"
                  />
                  <GInputText
                    v-else-if="fields.tipeRahin === 'Perorangan' && fields.tipeIdentitas === 'Paspor' && !isOwnerDetailsVisible"
                    v-model="fields.nikBeneficialOwner"
                    label="Nomor Paspor"
                    placeholder="Masukkan nomor paspor"
                    :error="requiredError(fields.nikBeneficialOwner, 'nomor paspor')"
                  />
                </div>

                <section
                  v-if="fields.beneficialOwner === 'Beneficial Owner' && fields.tipeRahin === 'Perorangan' && fields.tipeIdentitas === 'KTP' && !isOwnerDetailsVisible"
                  class="owner-support owner-support--ktp"
                >
                  <div class="form-grid owner-support-grid--ktp">
                    <label class="file-field">
                      <span>Upload Surat Kuasa (Opsional)</span>
                      <span class="file-dropzone">
                        <img :src="uploadSuratKuasaFrame" alt="" />
                        <input type="file" accept="image/*" aria-label="Upload Surat Kuasa (Opsional)" />
                      </span>
                      <small>Foto tampak depan. Maksimal ukuran file 1 MB.</small>
                    </label>
                  </div>
                </section>

                <div
                  v-if="fields.tipeRahin === 'Perorangan' && fields.tipeIdentitas === 'KTP' && !isOwnerDetailsVisible"
                  class="owner-search owner-search--ktp"
                >
                  <GButton label="Cari" type="outline" size="md" :disabled="!fields.nikBeneficialOwner" @click="searchBeneficialOwner" />
                </div>

                <div
                  v-if="fields.tipeRahin === 'Perorangan' && fields.tipeIdentitas === 'Paspor' && !isOwnerDetailsVisible"
                  class="owner-search owner-search--passport"
                >
                  <GButton label="Cari" type="outline" size="md" :disabled="!fields.nikBeneficialOwner" @click="searchBeneficialOwner" />
                </div>

                <section
                  v-if="fields.beneficialOwner === 'Beneficial Owner' && fields.tipeRahin === 'Perorangan' && fields.tipeIdentitas === 'Paspor' && !isOwnerDetailsVisible"
                  class="owner-support owner-support--passport"
                >
                  <h3>Data Pendukung Beneficial Owner</h3>
                  <div class="form-grid">
                    <GDropdown v-model="fields.hubunganBeneficialOwner" label="Hubungan" placeholder="Pilih hubungan" :items="relationshipOptions" item-value="value" item-text="label" :error="dropdownError('Hubungan')" :required="isSubmitted" :is-checked="isSubmitted" :use-bottom-sheet="isMobile" />
                    <label class="file-field">
                      <span>Upload Surat Kuasa (Opsional)</span>
                      <span class="file-dropzone">
                        <img :src="uploadSuratKuasaFrame" alt="" />
                        <input type="file" accept="image/*" aria-label="Upload Surat Kuasa (Opsional)" />
                      </span>
                      <small>Foto tampak depan. Maksimal ukuran file 1 MB.</small>
                    </label>
                  </div>
                </section>

                <ModuleSectionCard v-if="isOwnerResultsVisible && !isOwnerDetailsVisible" title="Data Beneficial Owner" class="owner-results-section">
                  <GAlert
                    class="owner-result-notice variant"
                    label="Pilih salah satu data untuk dilanjutkan ke detail data beneficial owner"
                    color="light-blue"
                    variant="info"
                  />
                  <div class="owner-table-toolbar">
                    <span class="owner-table-updated">Last updated on 10/01/2024, 10.00 AM</span>
                    <div class="owner-table-controls">
                      <button v-if="fields.tipeIdentitas === 'Paspor'" type="button" class="text-action" @click="openBeneficialOwnerDetail">Lihat Detail</button>
                      <label class="owner-page-size">
                        <span>Lihat</span>
                        <select :value="fields.tipeIdentitas === 'Paspor' ? 10 : 2" disabled aria-label="Jumlah baris">
                          <option>{{ fields.tipeIdentitas === 'Paspor' ? 10 : 2 }}</option>
                        </select>
                        <span>baris</span>
                      </label>
                    </div>
                  </div>
                  <div class="table-scroll">
                    <table>
                      <thead>
                        <tr v-if="fields.tipeIdentitas === 'Paspor'">
                          <th>No</th><th>Nomor Registrasi</th><th>Nama Beneficial Owner</th><th>Nomor Paspor</th><th>Tanggal Lahir</th>
                        </tr>
                        <tr v-else>
                          <th>No</th><th>Nomor Registrasi</th><th>Nama Beneficial Owner</th><th>NIK</th><th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-if="!ownerMatchFound"><td colspan="5">Tidak ada data yang ditampilkan.</td></tr>
                        <template v-else-if="fields.tipeIdentitas === 'Paspor'">
                          <tr>
                            <td>1</td><td>1234 1234</td><td>Anastasya Delistya</td><td>0033 9714 84</td><td>9 Desember 1998</td>
                          </tr>
                        </template>
                        <template v-else>
                          <tr v-for="index in 2" :key="index">
                            <td>{{ index }}</td><td>{{ index === 1 ? '1234 1234' : '1234 2222' }}</td><td>Anastasya Delistya</td>
                            <td>{{ index === 1 ? '3204 1111 1298 0003' : '3204 1111 1298 0003' }}</td>
                            <td><button type="button" class="text-action" @click="openBeneficialOwnerDetail">Pilih</button></td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                  <div class="owner-table-pagination">
                    <span class="table-count">Menampilkan {{ ownerMatchFound ? `1 sampai ${fields.tipeIdentitas === 'Paspor' ? 1 : 2} dari ${fields.tipeIdentitas === 'Paspor' ? 1 : 2}` : '0 sampai 0 dari 0' }} baris</span>
                    <div class="owner-page-buttons" aria-label="Navigasi halaman tabel">
                      <button type="button" disabled aria-label="Halaman sebelumnya">‹</button>
                      <button type="button" class="active" aria-current="page">1</button>
                      <button type="button" disabled aria-label="Halaman berikutnya">›</button>
                    </div>
                  </div>
                  <div v-if="!ownerMatchFound" class="mt-3 d-flex justify-content-end">
                    <GButton label="Lanjutkan ke Tambah Beneficial Owner" type="primary" size="md" @click="continueToAddBeneficialOwner" />
                  </div>
                </ModuleSectionCard>
              </div>

              <GModal v-model="showOwnerNotFoundModal" class="owner-not-found-dialog" centered title="" :show-close-button="true">
                  <template #header="{ close }">
                    <div class="d-flex justify-content-end w-100">
                      <button type="button" class="btn-close" aria-label="Tutup" @click="close" />
                    </div>
                  </template>
                  <template #body>
                    <div class="owner-not-found-modal">
                      <img :src="ownerNotFoundIllustration" alt="" />
                      <h3>Data Beneficial Owner Tidak Ditemukan</h3>
                      <p>{{ fields.tipeIdentitas === 'Paspor' ? 'Nomor Paspor tidak ditemukan, silakan tambah data beneficial owner baru.' : 'NIK tidak ditemukan, silakan tambah data beneficial owner baru.' }}</p>
                    </div>
                  </template>
                  <template #footer="{ hide }">
                    <GButton label="Lanjutkan ke Tambah Beneficial Owner" type="primary" size="md" @click="() => { hide(); continueToAddBeneficialOwner() }" />
                  </template>
              </GModal>

                <div v-if="isOwnerDetailsVisible" class="owner-detail-form">
                  <ModuleSectionCard title="Data Beneficial Owner" class="owner-base-section">
                    <div class="form-grid owner-base-grid">
                      <GDropdown
                        v-model="fields.tipeRahin"
                        label="Tipe Rahin"
                        placeholder="Pilih tipe Rahin"
                        :items="rahinTypeOptions"
                        item-value="value"
                        item-text="label"
                        :error="dropdownError('Tipe Rahin')"
                        :required="isSubmitted"
                        :is-checked="isSubmitted"
                        :use-bottom-sheet="isMobile"
                      />
                      <GDropdown
                        v-model="fields.tipeIdentitas"
                        label="Jenis Identitas"
                        placeholder="Pilih jenis identitas"
                        :items="identityOptions"
                        item-value="value"
                        item-text="label"
                        :error="dropdownError('Jenis Identitas')"
                        :required="isSubmitted"
                        :is-checked="isSubmitted"
                        :use-bottom-sheet="isMobile"
                      />
                      <GDropdown
                        v-if="fields.beneficialOwner === 'Beneficial Owner'"
                        v-model="fields.hubunganBeneficialOwner"
                        label="Hubungan"
                        placeholder="Pilih hubungan"
                        :items="relationshipOptions"
                        item-value="value"
                        item-text="label"
                        :error="dropdownError('Hubungan')"
                        :required="isSubmitted"
                        :is-checked="isSubmitted"
                        :use-bottom-sheet="isMobile"
                      />
                    </div>
                  </ModuleSectionCard>

                  <ModuleSectionCard
                    :title="fields.tipeIdentitas === 'Paspor' ? 'Informasi Beneficial Owner Sesuai Paspor' : 'Informasi Beneficial Owner Sesuai Kartu Identitas'"
                    class="owner-detail-section"
                  >
                    <div class="form-grid owner-identity-grid">
                      <GInputText
                        v-model="fields.nikBeneficialOwner"
                        :label="fields.tipeIdentitas === 'KTP' ? 'Nomor Induk Kependudukan (NIK)' : 'Nomor Paspor'"
                        :placeholder="fields.tipeIdentitas === 'KTP' ? 'Masukkan 16 digit NIK' : 'Masukkan nomor paspor'"
                        :error="requiredError(fields.nikBeneficialOwner, fields.tipeIdentitas === 'KTP' ? 'NIK' : 'nomor paspor')"
                      />
                      <GInputText
                        v-model="fields.namaBeneficialOwner"
                        label="Nama Beneficial Owner"
                        placeholder="Masukkan nama Rahin"
                        :error="requiredError(fields.namaBeneficialOwner, 'nama beneficial owner')"
                      />
                      <GInputText v-model="fields.namaIbu" label="Nama Ibu Kandung" placeholder="Masukkan nama ibu kandung" :error="requiredError(fields.namaIbu, 'nama ibu kandung')" />
                      <GInputText v-model="fields.tempatLahir" label="Tempat Lahir" placeholder="Masukkan tempat lahir" :error="requiredError(fields.tempatLahir, 'tempat lahir')" />
                      <div class="owner-date-age">
                        <GInputSmallDate
                          v-model="fields.tanggalLahir"
                          title="Tanggal Lahir"
                          placeholder="Pilih tanggal"
                          format-type="short"
                          :error="requiredError(fields.tanggalLahir, 'tanggal lahir')"
                        />
                        <GInputText :model-value="ownerAge === null ? '' : String(ownerAge)" label="Usia" placeholder="Tahun" disabled />
                      </div>
                      <GDropdown
                        v-model="fields.masaBerlaku"
                        label="Masa Berlaku"
                        placeholder="Pilih masa berlaku"
                        :items="validityOptions"
                        item-value="value"
                        item-text="label"
                        :error="dropdownError('Masa Berlaku')"
                        :required="isSubmitted"
                        :is-checked="isSubmitted"
                        :use-bottom-sheet="isMobile"
                      />
                      <GInputSmallDate
                        v-if="fields.masaBerlaku === 'Sampai Dengan'"
                        v-model="fields.masaBerlakuDate"
                        title="Sampai Dengan"
                        placeholder="Pilih tanggal"
                        format-type="short"
                        :error="requiredError(fields.masaBerlakuDate, 'tanggal masa berlaku')"
                      />
                    </div>
                    <p v-if="ownerAge !== null && ownerAge < 17" class="status-error mt-2">Usia Rahin minimal 17 tahun.</p>
                    <div v-if="fields.tipeIdentitas === 'KTP'" class="owner-dukcapil-action">
                      <GButton label="Cek Dukcapil" type="outline" size="md" @click="checkDukcapil" />
                      <span v-if="dukcapilStatus === 'success'" class="status-success">Terverifikasi Dukcapil.</span>
                      <span v-else-if="dukcapilStatus === 'failed'" class="status-error">Silakan periksa kembali nomor identitas.</span>
                    </div>
                  </ModuleSectionCard>

                  <ModuleSectionCard title="Alamat Sesuai Kartu Identitas" class="owner-detail-section">
                    <div class="form-grid owner-address-grid">
                      <GInputText v-model="fields.kodePos" label="Kode Pos" placeholder="Masukkan kode pos" :error="requiredError(fields.kodePos, 'kode pos')" />
                      <GDropdown
                        v-model="fields.provinsi"
                        label="Provinsi"
                        placeholder="Pilih provinsi"
                        :items="provinceOptions"
                        item-value="value"
                        item-text="label"
                        :error="dropdownError('Provinsi')"
                        :required="isSubmitted"
                        :is-checked="isSubmitted"
                        :use-bottom-sheet="isMobile"
                      />
                      <GDropdown
                        v-model="fields.kota"
                        label="Kota / Kabupaten"
                        placeholder="Pilih kota / kabupaten"
                        :items="fields.provinsi === 'DKI Jakarta' ? cityOptions : []"
                        item-value="value"
                        item-text="label"
                        :error="dropdownError('Kota / Kabupaten')"
                        :required="isSubmitted"
                        :is-checked="isSubmitted"
                        :use-bottom-sheet="isMobile"
                      />
                      <GDropdown
                        v-model="fields.kecamatan"
                        label="Kecamatan"
                        placeholder="Pilih kecamatan"
                        :items="fields.kota === 'Jakarta Pusat' ? districtOptions : []"
                        item-value="value"
                        item-text="label"
                        :error="dropdownError('Kecamatan')"
                        :required="isSubmitted"
                        :is-checked="isSubmitted"
                        :use-bottom-sheet="isMobile"
                      />
                      <GDropdown
                        v-model="fields.kelurahan"
                        label="Kelurahan"
                        placeholder="Pilih kelurahan"
                        :items="fields.kecamatan === 'Menteng' ? subdistrictOptions : []"
                        item-value="value"
                        item-text="label"
                        :error="dropdownError('Kelurahan')"
                        :required="isSubmitted"
                        :is-checked="isSubmitted"
                        :use-bottom-sheet="isMobile"
                      />
                      <div class="owner-rt-rw">
                        <div class="validated-field">
                          <GInputText v-model="fields.rt" label="RT" placeholder="Masukkan no RT" :error="requiredError(fields.rt, 'RT')" />
                          <small v-if="isSubmitted && fields.rt && !isRtValid" class="status-error">Harus diisi dengan 3 angka.</small>
                        </div>
                        <div class="validated-field">
                          <GInputText v-model="fields.rw" label="RW" placeholder="Masukkan no RW" :error="requiredError(fields.rw, 'RW')" />
                          <small v-if="isSubmitted && fields.rw && !isRwValid" class="status-error">Harus diisi dengan 3 angka.</small>
                        </div>
                      </div>
                      <GTextArea
                        v-model="fields.alamat"
                        class="owner-address-textarea"
                        label="Alamat Rumah"
                        placeholder="Masukkan alamat sesuai kartu identitas (Nama Jalan / Gedung / No. Rumah)"
                        :error="requiredError(fields.alamat, 'alamat rumah')"
                      />
                    </div>
                    <label class="same-address owner-data-confirmation">
                      <input v-model="isOwnerDataConfirmed" type="checkbox" />
                      <span>Data sudah sesuai dengan kartu identitas.</span>
                    </label>
                  </ModuleSectionCard>

                  <ModuleSectionCard title="Alamat Tinggal Saat Ini" class="owner-detail-section">
                    <label class="same-address owner-address-same">
                      <input v-model="isOwnerAddressSame" type="checkbox" />
                      <span>Alamat tinggal saat ini sama dengan kartu identitas.</span>
                    </label>
                    <p v-if="isOwnerAddressSame" class="address-same-note">Alamat tinggal saat ini sesuai dengan kartu identitas.</p>
                    <div v-else class="form-grid owner-address-grid">
                      <GInputText v-model="fields.kodePosSaatIni" label="Kode Pos" placeholder="Masukkan kode pos" :error="requiredError(fields.kodePosSaatIni, 'kode pos')" />
                      <GDropdown
                        v-model="fields.provinsiSaatIni"
                        label="Provinsi"
                        placeholder="Pilih provinsi"
                        :items="provinceOptions"
                        item-value="value"
                        item-text="label"
                        :error="dropdownError('Provinsi')"
                        :required="isSubmitted"
                        :is-checked="isSubmitted"
                        :use-bottom-sheet="isMobile"
                      />
                      <GDropdown
                        v-model="fields.kotaSaatIni"
                        label="Kota / Kabupaten"
                        placeholder="Pilih kota / kabupaten"
                        :items="fields.provinsiSaatIni === 'DKI Jakarta' ? cityOptions : []"
                        item-value="value"
                        item-text="label"
                        :error="dropdownError('Kota / Kabupaten')"
                        :required="isSubmitted"
                        :is-checked="isSubmitted"
                        :use-bottom-sheet="isMobile"
                      />
                      <GDropdown
                        v-model="fields.kecamatanSaatIni"
                        label="Kecamatan"
                        placeholder="Pilih kecamatan"
                        :items="fields.kotaSaatIni === 'Jakarta Pusat' ? districtOptions : []"
                        item-value="value"
                        item-text="label"
                        :error="dropdownError('Kecamatan')"
                        :required="isSubmitted"
                        :is-checked="isSubmitted"
                        :use-bottom-sheet="isMobile"
                      />
                      <GDropdown
                        v-model="fields.kelurahanSaatIni"
                        label="Kelurahan"
                        placeholder="Pilih kelurahan"
                        :items="fields.kecamatanSaatIni === 'Menteng' ? subdistrictOptions : []"
                        item-value="value"
                        item-text="label"
                        :error="dropdownError('Kelurahan')"
                        :required="isSubmitted"
                        :is-checked="isSubmitted"
                        :use-bottom-sheet="isMobile"
                      />
                      <div class="owner-rt-rw">
                        <GInputText v-model="fields.rtSaatIni" label="RT" placeholder="Masukkan no RT" :error="requiredError(fields.rtSaatIni, 'RT')" />
                        <GInputText v-model="fields.rwSaatIni" label="RW" placeholder="Masukkan no RW" :error="requiredError(fields.rwSaatIni, 'RW')" />
                      </div>
                      <GTextArea
                        v-model="fields.alamatSaatIni"
                        class="owner-address-textarea"
                        label="Alamat Rumah"
                        placeholder="Masukkan alamat sesuai kartu identitas (Nama Jalan / Gedung / No. Rumah)"
                        :error="requiredError(fields.alamatSaatIni, 'alamat rumah saat ini')"
                      />
                    </div>
                  </ModuleSectionCard>

                  <ModuleSectionCard title="Detail Data Beneficial Owner" class="owner-detail-section">
                    <div class="form-grid owner-personal-grid">
                      <GDropdown v-model="fields.jenisKelamin" label="Jenis Kelamin" placeholder="Pilih jenis kelamin" :items="genderOptions" item-value="value" item-text="label" :error="dropdownError('Jenis Kelamin')" :required="isSubmitted" :is-checked="isSubmitted" :use-bottom-sheet="isMobile" />
                      <GDropdown v-model="fields.pendidikan" label="Pendidikan" placeholder="Pilih pendidikan" :items="educationOptions" item-value="value" item-text="label" :error="dropdownError('Pendidikan')" :required="isSubmitted" :is-checked="isSubmitted" :use-bottom-sheet="isMobile" />
                      <GDropdown v-model="fields.statusPerkawinan" label="Status Perkawinan" placeholder="Pilih status perkawinan" :items="maritalOptions" item-value="value" item-text="label" :error="dropdownError('Status Perkawinan')" :required="isSubmitted" :is-checked="isSubmitted" :use-bottom-sheet="isMobile" />
                      <GInputText v-model="fields.namaPasangan" label="Nama Pasangan (Opsional)" placeholder="Masukkan nama pasangan" />
                      <GInputSmallDate v-model="fields.tanggalLahirPasangan" title="Tanggal Lahir Pasangan (Opsional)" placeholder="Pilih tanggal" format-type="short" />
                      <GInputText v-model="fields.tanggungan" label="Jumlah Tanggungan (Opsional)" placeholder="Pilih jumlah tanggungan" />
                      <GInputText v-model="fields.telepon" label="Nomor Telepon (Opsional)" placeholder="Masukkan nomor telepon" />
                      <GInputText v-model="fields.handphone" label="Nomor Handphone" placeholder="Masukkan nomor handphone" :error="requiredError(fields.handphone, 'nomor handphone')" />
                      <GInputText v-model="fields.email" label="Email (Opsional)" placeholder="Masukkan email" />
                      <GInputText v-model="fields.npwp" label="Nomor NPWP (Opsional)" placeholder="Masukkan nomor NPWP" />
                      <GDropdown v-model="fields.kewarganegaraan" label="Kewarganegaraan" placeholder="Pilih kewarganegaraan" :items="nationalityOptions" item-value="value" item-text="label" :error="dropdownError('Kewarganegaraan')" :required="isSubmitted" :is-checked="isSubmitted" :disabled="fields.tipeIdentitas === 'KTP'" :use-bottom-sheet="isMobile" />
                      <GDropdown v-model="fields.tipeKependudukan" label="Tipe Kependudukan" placeholder="Pilih tipe kependudukan" :items="populationOptions" item-value="value" item-text="label" :error="dropdownError('Tipe Kependudukan')" :required="isSubmitted" :is-checked="isSubmitted" :use-bottom-sheet="isMobile" />
                      <GDropdown v-model="fields.sumberDana" label="Sumber Dana" placeholder="Pilih sumber dana" :items="fundOptions" item-value="value" item-text="label" :error="dropdownError('Sumber Dana')" :required="isSubmitted" :is-checked="isSubmitted" :use-bottom-sheet="isMobile" />
                      <GDropdown v-model="fields.pekerjaanBeneficialOwner" label="Pekerjaan Terkini" placeholder="Pilih pekerjaan terkini" :items="employmentOptions" item-value="value" item-text="label" :error="dropdownError('Pekerjaan Terkini')" :required="isSubmitted" :is-checked="isSubmitted" :use-bottom-sheet="isMobile" />
                      <GInputText v-model="fields.agama" label="Agama" placeholder="Pilih agama" :error="requiredError(fields.agama, 'agama')" />
                      <GDropdown v-model="fields.penghasilan" label="Rata - Rata Penghasilan" placeholder="Pilih rata-rata penghasilan" :items="incomeOptions" item-value="value" item-text="label" :error="dropdownError('Rata-rata penghasilan')" :required="isSubmitted" :is-checked="isSubmitted" :use-bottom-sheet="isMobile" />
                    </div>
                  </ModuleSectionCard>
                </div>
            </template>
          </ModuleSectionCard>
        </div>
      </div>

</template>
