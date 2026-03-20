/*
    ARKIGREEN - Main Logic
    Handles Theme Toggle, Mobile Menu, and Animations
*/

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initAnimations();
});

/* FIX 3 — Theme Toggle works on BOTH desktop + mobile drawer */
function initTheme() {
    const body = document.body;

    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
    }

    const desktopToggle = document.getElementById('theme-toggle');
    const mobileToggle  = document.getElementById('theme-toggle-mobile');

    function toggleTheme() {
        body.classList.toggle('light-mode');
        localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    }

    if (desktopToggle) desktopToggle.addEventListener('click', toggleTheme);
    if (mobileToggle)  mobileToggle.addEventListener('click', toggleTheme);
}

/* Mobile Drawer */
function initMobileMenu() {
    const hamburger    = document.getElementById('hamburger');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const closeDrawer  = document.getElementById('close-drawer');
    const overlay      = document.getElementById('drawer-overlay');

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
    if (overlay)     overlay.addEventListener('click', closeMenu);
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
