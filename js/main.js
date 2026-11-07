/* ==========================================================================
   SFE - Smart Future Education - Main Script (Updated & Complete)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle & Icon Animation
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            // Mengubah ikon hamburger <-> x (close) secara interaktif
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('hidden')) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                } else {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                }
            }
        });
    }

    // 2. Language Switcher Logic
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        // Load saved language or default to 'id'
        const savedLang = localStorage.getItem('sfe_lang') || 'id';
        langSelect.value = savedLang;
        updateLanguage(savedLang);

        langSelect.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            localStorage.setItem('sfe_lang', selectedLang);
            updateLanguage(selectedLang);
        });
    }

    // Function to translate components with data-i18n attributes
    function updateLanguage(lang) {
        // Mendukung variabel 'translations' dari file language-data.js
        const t = (typeof translations !== 'undefined') ? translations[lang] : (typeof languageData !== 'undefined' ? languageData[lang] : null);
        if (!t) return;
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (t[key]) {
                element.textContent = t[key];
            }
        });
    }

    // 3. Highlight Active Navigation Menu
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active', 'text-amber-400', 'font-semibold', 'pb-1', 'border-b-2', 'border-amber-400');
            link.classList.remove('text-gray-200', 'text-slate-300');
        } else {
            // Jangan hapus styling link lain yang bukan nav utama
            if (link.closest('nav')) {
                link.classList.remove('active', 'text-amber-400', 'font-semibold', 'pb-1', 'border-b-2', 'border-amber-400');
            }
        }
    });

    // 4. Global Search Modal (Placeholder function)
    const searchBtns = document.querySelectorAll('.search-trigger');
    searchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = prompt('Masukkan kata kunci pencarian (misal: Les Privat, UTBK, ABK):');
            if (query) {
                alert(`Mencari informasi tentang: "${query}" di SFE - Smart Future Education...`);
            }
        });
    });

    // 5. Real-time WIB Clock & Operational Status (Open/Closed)
    initWibClock();

    // 6. Promotional Pop-up Modal (Muncul otomatis saat pertama kali akses Homepage)
    initPromoPopup();
});

/**
 * Fungsi untuk menghitung waktu WIB (UTC+7) dan mengupdate UI jam serta status buka/tutup secara realtime.
 */
function initWibClock() {
    function updateClock() {
        const clockElem = document.getElementById('wib-clock');
        const statusTextElem = document.getElementById('wib-status-text');
        const statusDotElem = document.getElementById('wib-status-dot');

        if (!clockElem || !statusTextElem || !statusDotElem) return;

        // Ambil waktu saat ini dan konversi ke zona waktu WIB (Asia/Jakarta)
        const now = new Date();
        const options = { timeZone: 'Asia/Jakarta', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const timeString = new Intl.DateTimeFormat('id-ID', options).format(now).replace(/\./g, ':');

        // Ambil hari dan jam di zona waktu Jakarta
        const dayOfWeekStr = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jakarta', weekday: 'short' }).format(now);
        const hourStr = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jakarta', hour: '2-digit', hour12: false }).format(now);
        const currentHour = parseInt(hourStr, 10);

        // Aturan Operasional SFE:
        // - Buka: Senin (Mon) - Sabtu (Sat), Pukul 08:00 sampai sebelum 17:00 WIB
        // - Tutup: Minggu (Sun) ATAU di luar jam 08:00 - 17:00 WIB
        const isSunday = (dayOfWeekStr === 'Sun');
        const isOpen = !isSunday && (currentHour >= 8 && currentHour < 17);

        // Update Text Tampilan Jam
        clockElem.textContent = `${timeString} WIB`;

        // Update UI Warna & Indikator berdasarkan status
        if (isOpen) {
            // Status BUKA: Teks Putih, Dot Hijau Berdenyut
            statusTextElem.textContent = 'BUKA';
            statusTextElem.className = 'text-white font-bold tracking-wider';
            statusDotElem.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse';
            clockElem.className = 'text-white font-mono border-l border-slate-700 pl-2';
        } else {
            // Status TUTUP: Teks Merah, Dot Merah
            statusTextElem.textContent = 'TUTUP';
            statusTextElem.className = 'text-red-400 font-bold tracking-wider';
            statusDotElem.className = 'w-2 h-2 rounded-full bg-red-500';
            clockElem.className = 'text-red-400 font-mono border-l border-slate-700 pl-2';
        }
    }

    // Jalankan pertama kali saat load lalu set interval tiap 1 detik
    updateClock();
    setInterval(updateClock, 1000);
}

/**
 * Fungsi untuk mengontrol kemunculan pop-up iklan promosi SFE
 */
function initPromoPopup() {
    const promoModal = document.getElementById('promoModal');
    if (!promoModal) return; // Hanya berjalan jika elemen modal promosi tersedia di halaman tersebut (index.html)

    const hasSeenPromo = sessionStorage.getItem('sfe_promo_seen');
    
    if (!hasSeenPromo) {
        setTimeout(() => {
            openPromoModal();
        }, 1000); // Muncul 1 detik setelah halaman dimuat
    }
}

function openPromoModal() {
    const modal = document.getElementById('promoModal');
    const container = document.getElementById('promoModalContainer');
    
    if (!modal || !container) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    setTimeout(() => {
        container.classList.remove('scale-90');
        container.classList.add('scale-100');
    }, 10);

    // Tandai agar dalam sesi browser ini pop-up tidak muncul berulang kali
    sessionStorage.setItem('sfe_promo_seen', 'true');
}

function closePromoModal() {
    const modal = document.getElementById('promoModal');
    const container = document.getElementById('promoModalContainer');

    if (!modal || !container) return;

    container.classList.remove('scale-100');
    container.classList.add('scale-90');

    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 200);
}
