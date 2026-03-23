/*
    ARKIGREEN - Main Logic
    Handles Theme Toggle, Mobile Menu, and Animations
*/

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRTL();
    initMobileMenu();
    initAnimations();
    initScrollTop();
});


function initScrollTop() {
    const scrollTopBtn = document.getElementById('scroll-to-top');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY || document.documentElement.scrollTop;
        const threshold = document.documentElement.scrollHeight * 0.3;

        if (scrolled > threshold) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* FIX 3 — Theme Toggle works on BOTH desktop + mobile drawer */
function initTheme() {
    const body = document.body;

    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
    }

    const desktopToggle = document.getElementById('theme-toggle');
    const mobileToggle = document.getElementById('theme-toggle-mobile');

    function toggleTheme() {
        body.classList.toggle('light-mode');
        localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    }

    if (desktopToggle) desktopToggle.addEventListener('click', toggleTheme);
    if (mobileToggle) mobileToggle.addEventListener('click', toggleTheme);
}

/* RTL Toggle */
function initRTL() {
    if (localStorage.getItem('rtl') === 'true') {
        document.documentElement.setAttribute('dir', 'rtl');
    }

    const desktopToggle = document.getElementById('rtl-toggle');
    const mobileToggle = document.getElementById('rtl-toggle-mobile');

    function toggleRTL() {
        const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
        if (isRTL) {
            document.documentElement.setAttribute('dir', 'ltr');
            localStorage.setItem('rtl', 'false');
        } else {
            document.documentElement.setAttribute('dir', 'rtl');
            localStorage.setItem('rtl', 'true');
        }
    }

    if (desktopToggle) desktopToggle.addEventListener('click', toggleRTL);
    if (mobileToggle) mobileToggle.addEventListener('click', toggleRTL);
}

/* Mobile Drawer */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const closeDrawer = document.getElementById('close-drawer');
    const overlay = document.getElementById('drawer-overlay');

    if (!hamburger || !mobileDrawer) return;

    hamburger.addEventListener('click', () => {
        mobileDrawer.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeMenu() {
        mobileDrawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeDrawer) closeDrawer.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);
}

/* GSAP + AOS — respects reduced motion */
function initAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true, offset: 100 });
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray('.gsap-reveal').forEach(el => {
            gsap.from(el, {
                y: 30, opacity: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%' }
            });
        });
    }
}

