/* ==========================================================================
   SFE Bimbingan Belajar - Main Script (Updated & Complete)
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
                alert(`Mencari informasi tentang: "${query}" di SFE Bimbingan Belajar...`);
            }
        });
    });
});