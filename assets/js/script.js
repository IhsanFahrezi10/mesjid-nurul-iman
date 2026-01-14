document.addEventListener("DOMContentLoaded", function () {
  // ============================================
  // 1. MENU HAMBURGER (RESPONSIF HP)
  // ============================================
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("nav-active");

      // Animasi garis burger menjadi X (Opsional, jika di CSS ada style-nya)
      menuToggle.classList.toggle("toggle-active");
    });
  }

  // ============================================
  // 2. JAM DIGITAL & TANGGAL (REAL-TIME)
  // ============================================
  function updateJam() {
    const jamElement = document.getElementById("jam-digital");
    const tanggalElement = document.getElementById("tanggal-hari-ini");

    const sekarang = new Date();

    // --- Update Jam ---
    if (jamElement) {
      // Format Jam (HH:MM:SS)
      const waktu = sekarang.toLocaleTimeString("id-ID", {
        hour12: false,
      });
      jamElement.innerText = waktu;
    }

    // --- Update Tanggal ---
    if (tanggalElement) {
      // Format: Senin, 12 Januari 2026
      const opsiTanggal = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
      const tanggalFull = sekarang.toLocaleDateString("id-ID", opsiTanggal);
      tanggalElement.innerText = tanggalFull;
    }
  }

  // Jalankan setiap 1 detik
  setInterval(updateJam, 1000);
  updateJam(); // Jalankan langsung saat halaman dimuat

  // ============================================
  // 3. API JADWAL SHOLAT (OTOMATIS)
  // ============================================
  const containerJadwal = document.getElementById("daftar-sholat");

  // PENGATURAN LOKASI
  const KOTA = "Medan";
  const NEGARA = "Indonesia";
  // Method 20 = Kemenag RI (Standar Indonesia)
  const METHOD = "20";

  async function getJadwalSholat() {
    if (!containerJadwal) return; // Stop jika elemen tidak ditemukan

    try {
      // Fetch data dari API Aladhan
      const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${KOTA}&country=${NEGARA}&method=${METHOD}`);
      const data = await response.json();
      const jadwal = data.data.timings;

      // Mapping Nama Waktu (Inggris API -> Indonesia)
      // Kita hanya mengambil 5 waktu wajib
      const sholatWajib = {
        Fajr: "Subuh",
        Dhuhr: "Dzuhur",
        Asr: "Ashar",
        Maghrib: "Maghrib",
        Isha: "Isya",
      };

      let htmlContent = "";

      // Loop untuk membuat Kartu Jadwal
      for (let [keyAPI, namaIndo] of Object.entries(sholatWajib)) {
        htmlContent += `
                    <div class="sholat-card">
                        <h4>${namaIndo}</h4>
                        <p>${jadwal[keyAPI]}</p>
                    </div>
                `;
      }

      containerJadwal.innerHTML = htmlContent;
    } catch (error) {
      console.error("Gagal mengambil jadwal:", error);
      containerJadwal.innerHTML = "<p style='color:red; text-align:center; width:100%;'>Gagal memuat jadwal. Cek koneksi internet.</p>";
    }
  }

  // Panggil fungsi jadwal
  getJadwalSholat();
});
// ============================================
// 4. ACTIVE LINK ON SCROLL (Fixed for Contact Us)
// ============================================

// Pastikan selektor ini benar
const sections = document.querySelectorAll("section");
const navLinksItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";

  // A. LOGIKA NORMAL (Untuk Home, Jadwal, Zakat)
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    // Jika scroll melewati (garis atas section - 200px)
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  // B. LOGIKA KHUSUS "MENTOK BAWAH" (Solusi Masalahmu)
  // Cek jika user sudah scroll sampai ujung paling bawah halaman
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
    current = "kontak"; // <--- WAJIB SAMA DENGAN ID SECTION KONTAK KAMU
  }

  // C. UPDATE TOMBOL NAVBAR
  navLinksItems.forEach((link) => {
    link.classList.remove("active");

    // Cek apakah href link mengandung ID yang sedang aktif
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});
