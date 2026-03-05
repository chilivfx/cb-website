/* =========================================================
   CARSTEN BAARS — VFX PORTFOLIO
   Main JS | carstenbaars.com
   ========================================================= */

'use strict';

/* ── Config ────────────────────────────────────────────── */
const VIMEO_ID = 'YOUR_VIMEO_ID'; // ← Replace with your Vimeo video ID

/* ── Helpers ───────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* =========================================================
   NAV — scroll state + hamburger
   ========================================================= */
(function initNav() {
    const nav = $('#nav');
    const hamburger = $('#hamburger');
    const mobileMenu = $('#mobileMenu');
    const mobLinks = $$('.mob-link');

    // Scroll class
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click
    mobLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            hamburger.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
})();

/* =========================================================
   REEL MODAL
   ========================================================= */
(function initModal() {
    const playBtn  = $('#playReel');
    const modal    = $('#reelModal');
    const modalBg  = $('#modalBg');
    const closeBtn = $('#modalClose');
    const iframe   = $('#reelIframe');

    function open() {
        iframe.src = `https://player.vimeo.com/video/${VIMEO_ID}?autoplay=1&color=00d4ff&title=0&byline=0&portrait=0`;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        modal.classList.remove('open');
        // Stop video by clearing src
        iframe.src = '';
        document.body.style.overflow = '';
    }

    playBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    modalBg.addEventListener('click', close);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });
})();

/* =========================================================
   WORK — FILTER
   ========================================================= */
(function initFilter() {
    const filterBtns = $$('.filter');
    const cards      = $$('.work-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            cards.forEach(card => {
                const cats = (card.dataset.cat || '').split(' ');
                const show = filter === 'all' || cats.includes(filter);

                if (show) {
                    card.style.display = '';
                    // Restore featured span on "all"
                    if (filter === 'all' && card.classList.contains('featured')) {
                        card.style.gridColumn = 'span 2';
                    } else {
                        card.style.gridColumn = '';
                    }
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
})();

/* =========================================================
   SCROLL REVEAL — Intersection Observer
   ========================================================= */
(function initReveal() {
    const els = $$('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (!entry.isIntersecting) return;
            // Staggered delay for grid children
            const delay = entry.target.closest('.work-grid, .bd-grid, .exp-layout')
                ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 70
                : 0;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    els.forEach(el => observer.observe(el));
})();

/* =========================================================
   SKILL BARS — animate on enter
   ========================================================= */
(function initSkillBars() {
    const fills = $$('.skill-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const pct = entry.target.dataset.pct || 0;
            entry.target.style.width = pct + '%';
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.4 });

    fills.forEach(fill => observer.observe(fill));
})();

/* =========================================================
   SMOOTH SCROLL — override anchor default
   ========================================================= */
(function initSmoothScroll() {
    document.addEventListener('click', e => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 68;
        window.scrollTo({ top, behavior: 'smooth' });
    });
})();

/* =========================================================
   CURSOR ACCENT (desktop only) — subtle dot follow
   ========================================================= */
(function initCursorGlow() {
    if (window.matchMedia('(hover: none)').matches) return; // skip touch

    const dot = document.createElement('div');
    dot.style.cssText = `
        position: fixed;
        width: 6px; height: 6px;
        background: rgba(0, 212, 255, 0.7);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s;
        mix-blend-mode: screen;
    `;
    document.body.appendChild(dot);

    const ring = document.createElement('div');
    ring.style.cssText = `
        position: fixed;
        width: 32px; height: 32px;
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s, border-color 0.3s;
        mix-blend-mode: screen;
    `;
    document.body.appendChild(ring);

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let raf;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
    });

    // Smooth ring follow
    function animateRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        raf = requestAnimationFrame(animateRing);
    }
    animateRing();

    // Expand ring on interactive elements
    const interactives = 'a, button, .work-card, .bd-card, .filter, .chip';
    document.addEventListener('mouseover', e => {
        if (e.target.closest(interactives)) {
            ring.style.width  = '52px';
            ring.style.height = '52px';
            ring.style.borderColor = 'rgba(0, 212, 255, 0.45)';
        } else {
            ring.style.width  = '32px';
            ring.style.height = '32px';
            ring.style.borderColor = 'rgba(0, 212, 255, 0.2)';
        }
    });
})();
