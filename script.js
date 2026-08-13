/* ============================================
   FIERCE FITNESS - Main JavaScript
   ============================================ */

const API_BASE = "http://localhost:8000";

async function api(path, options = {}) {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json", ...options.headers };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    let res;
    try {
        res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    } catch (e) {
        throw new Error("Серверот не е достапен. Проверете дали backend е вклучен.");
    }
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
    }
    if (res.status === 204) return null;
    return res.json();
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function showToast(message, isError = false) {
    const t = document.getElementById("toast");
    const m = document.getElementById("toastMessage");
    const i = t.querySelector("i");
    m.textContent = message;
    i.className = isError ? "fas fa-exclamation-circle" : "fas fa-check-circle";
    t.classList.toggle("error", isError);
    t.classList.add("show");
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => t.classList.remove("show"), 3000);
}

function showConfirmModal(message) {
    return new Promise(resolve => {
        const modal = document.getElementById("confirmModal");
        const msgEl = document.getElementById("confirmModalMessage");
        const okBtn = document.getElementById("confirmModalOk");
        const cancelBtn = document.getElementById("confirmModalCancel");
        const overlay = document.getElementById("confirmModalOverlay");
        msgEl.textContent = message;
        okBtn.textContent = translations[currentLang]?.confirm_ok || "Потврди";
        cancelBtn.textContent = translations[currentLang]?.confirm_cancel || "Откажи";
        modal.classList.add("show");
        function cleanup(result) {
            modal.classList.remove("show");
            okBtn.removeEventListener("click", onOk);
            cancelBtn.removeEventListener("click", onCancel);
            overlay.removeEventListener("click", onCancel);
            resolve(result);
        }
        function onOk() { cleanup(true); }
        function onCancel() { cleanup(false); }
        okBtn.addEventListener("click", onOk);
        cancelBtn.addEventListener("click", onCancel);
        overlay.addEventListener("click", onCancel);
    });
}

// --- Translations ---
const translations = {
    mk: {
        // Nav
        nav_home: "Почетна",
        nav_about: "За Нас",
        nav_programs: "Програми",
        nav_trainers: "Тренери",
        nav_pricing: "Членство",
        nav_blog: "Блог",
        nav_contact: "Контакт",
        nav_cta: "Приклучи се",
        // Hero
        hero_badge: "Најсилниот фитнес центар во Скопје",
        hero_title: 'ИЗГРАДИ ЈА СВОЈАТА<br><span class="text-accent">НАЈСИЛНА</span> ВЕРЗИЈА',
        hero_desc: "Fierce Fitness е повеќе од теретана — е место каде што се креираат шампиони. Со модерна опрема, сертифицирани тренери и атмосфера која те тера да дадеш се од себе, секој тренинг е чекор кон твојата најдобра верзија.",
        hero_cta1: "Приклучи се",
        hero_cta2: "Види членство",
        // About
        about_tag: "ЗА НАС",
        about_title: 'Нашата <span class="text-accent">приказна</span>',
        about_badge: "Години искуство",
        about_p1: "Fierce Fitness е основан во 2016 година со една мисија — да создаде простор каде што секој човек, без разлика на нивото на kondicioniranje, може да го постигне својот максимум. Започнавме како мала теретана, а денес сме еден од најголемите фитнес центри во земјата.",
        about_p2: "Нашата филозофија е едноставна: комбинација на модерна опрема, научно-поткрепени методи на тренирање и персонален пристап кон секој член. Веруваме дека фитнесот не е само физичка активност — тоа е животен стил.",
        about_p3: "Со повеќе од 2500 активни членови и тим од 15 сертифицирани професионалци, нудиме комплетно фитнес искуство кое надминува обична теретана.",
        stat_members: "Активни членови",
        stat_years: "Години искуство",
        stat_trainers: "Сертифицирани тренери",
        stat_classes: "Групни часови неделно",
        // Programs
        programs_tag: "ПРОГРАМИ",
        programs_title: 'Најди <span class="text-accent">својот</span> стил',
        programs_subtitle: "Разновидни програми дизајнирани за секоја цел и ниво",
        program_more: "Повеќе →",
        program1_title: "Strength Training",
        program1_desc: "Гради мускулна маса и сила со нашите модерни тегови и машини. Погодно за сите нивоа.",
        program2_title: "HIIT",
        program2_desc: "Интензивни интервални тренинзи за максимално согорување калории и подобрување на кондицијата.",
        program3_title: "Functional Training",
        program3_desc: "Вежби кои го подобруваат секојдневното движење, рамнотежата и флексибилноста.",
        program4_title: "Personal Training",
        program4_desc: "Индивидуални сесии со нашите најдобри тренери, целосно прилагодени на твоите цели.",
        // Trainers
        trainers_tag: "ТРЕНЕРИ",
        trainers_title: 'Експерти кои те <span class="text-accent">водат</span>',
        trainers_subtitle: "Нашите сертифицирани професионалци се тука да те водат кон успех",
        trainer1_role: "Head Coach",
        trainer1_spec: "Специјализиран за Strength & Conditioning",
        trainer2_role: "HIIT & Functional Coach",
        trainer2_spec: "Специјализирана за кардио и функционален тренинг",
        trainer3_role: "Coach",
        trainer3_spec: "Специјализиран за Bodybuilding & Nutrition",
        trainer4_role: "Yoga & Flexibility Coach",
        trainer4_spec: "Специјализирана за мобилност и релаксација",
        // Pricing
        pricing_tag: "ЧЛЕНСТВО",
        pricing_title: 'Избери <span class="text-accent">свој</span> план',
        pricing_subtitle: "Флексибилни планови прилагодени на твоите потреби",
        pricing_period: "/месечно",
        pricing_badge: "Најпопуларно",
        pricing_cta: "Избери план",
        pricing_basic_name: "Basic",
        pricing_basic_f1: "Пристап кон теретана",
        pricing_basic_f2: "Основни групни часови",
        pricing_basic_f3: "Сауна",
        pricing_basic_f4: "Personal Training",
        pricing_basic_f5: "Нутриционистички план",
        pricing_basic_f6: "Масажа",
        pricing_premium_name: "Premium",
        pricing_premium_f1: "Пристап кон теретана",
        pricing_premium_f2: "Сите групни часови",
        pricing_premium_f3: "Сауна & парна бања",
        pricing_premium_f4: "2 Personal Training сесии",
        pricing_premium_f5: "Нутриционистички план",
        pricing_premium_f6: "Масажа",
        pricing_elite_name: "Elite",
        pricing_elite_f1: "Пристап кон теретана",
        pricing_elite_f2: "Сите групни часови",
        pricing_elite_f3: "Сауна & парна бања",
        pricing_elite_f4: "Неограничени PT сесии",
        pricing_elite_f5: "Персонален нутриционист",
        pricing_elite_f6: "Неделна масажа",
        // Blog
        blog_tag: "БЛОГ",
        blog_title: 'Најнови <span class="text-accent">статии</span>',
        blog_read_more: "Прочитај повеќе →",
        blog_cat_nutrition: "Нутриција",
        blog_cat_motivation: "Мотивација",
        blog_cat_health: "Здравје",
        blog_cat_training: "Тренинг",
        blog1_title: "Комплетен водич за исхрана при тренирање",
        blog1_desc: "Дознај која е најдобрата исхрана за постигнување на твоите фитнес цели. Од макронутриенти до тајминг на оброци...",
        blog2_title: "5 начини да останеш мотивиран",
        blog3_title: "Значењето на опоравувањето по тренинг",
        blog4_title: "HIIT vs. Classic: што е подобро?",
        // Contact
        contact_tag: "КОНТАКТ",
        contact_title: 'Стапи во <span class="text-accent">контакт</span>',
        contact_name: "Име и презиме",
        contact_email: "Email адреса",
        contact_phone: "Телефон",
        contact_message: "Порака",
        contact_submit: "Испрати порака",
        contact_success: "Вашата порака е успешно испратена! Ќе ви одговориме најбрзо што можеме.",
        contact_info_address: "Адреса",
        contact_info_phone: "Телефон",
        contact_info_email: "Email",
        contact_info_hours: "Работно време",
        contact_hours_detail: "Пон - Пет: 06:00 - 23:00<br>Саб - Нед: 08:00 - 22:00",
        // Dashboard
        dash_no_plan: "Немате активен план",
        dash_browse: "Прелистај планови",
        dash_current: "Тековен",
        dash_activate: "Активирај",
        dash_deactivate: "Деактивирај",
        dash_switch: "Промени план",
        dash_switch_confirm: "Веќе имате активен план. Дали сакате да го смените?",
        pricing_switch_confirm: "Веќе имате активен план ({oldPlan}). Дали сакате да го смените за {newPlan}?",
        dash_deactivate_confirm: "Дали сте сигурни дека сакате да го деактивирате планот?",
        dash_plan_activated: "Планот е активиран!",
        dash_plan_deactivated: "Планот е деактивиран!",
        dash_plan_switched: "Планот е сменет!",
        confirm_cancel: "Откажи",
        confirm_ok: "Потврди",
        // Footer
        footer_desc: "Најсилниот фитнес центар во Скопје. Изгради ја својата најсилна верзија со нас.",
        footer_quick_links: "Брзи линкови",
        footer_newsletter: "Newsletter",
        footer_newsletter_desc: "Пријави се за совети за тренирање и ексклузивни понуди.",
        footer_rights: "Сите права задржани.",
        // Cookie
        cookie_text: "Овој сајт користи колачиња за да ви обезбеди најдобро искуство. Со продолжување на користењето, се согласувате со нашата употреба на колачиња.",
        cookie_accept: "Прифати",
        cookie_decline: "Одбиј",
        // Form
        form_error_name: "Внесете го вашето име",
        form_error_email: "Внесете валидна email адреса",
        form_error_message: "Внесете порака"
    },
    en: {
        // Nav
        nav_home: "Home",
        nav_about: "About",
        nav_programs: "Programs",
        nav_trainers: "Trainers",
        nav_pricing: "Membership",
        nav_blog: "Blog",
        nav_contact: "Contact",
        nav_cta: "Join Now",
        // Hero
        hero_badge: "The strongest fitness center in Skopje",
        hero_title: 'BUILD YOUR<br><span class="text-accent">STRONGEST</span> VERSION',
        hero_desc: "Fierce Fitness is more than a gym — it's where champions are made. With modern equipment, certified trainers, and an atmosphere that pushes you to give your all, every workout is a step toward your best self.",
        hero_cta1: "Join Now",
        hero_cta2: "View Membership",
        // About
        about_tag: "ABOUT US",
        about_title: 'Our <span class="text-accent">story</span>',
        about_badge: "Years of experience",
        about_p1: "Fierce Fitness was founded in 2016 with one mission — to create a space where every person, regardless of their fitness level, can reach their maximum potential. We started as a small gym, and today we are one of the largest fitness centers in the country.",
        about_p2: "Our philosophy is simple: a combination of modern equipment, scientifically-backed training methods, and a personal approach to every member. We believe fitness is not just physical activity — it's a lifestyle.",
        about_p3: "With over 2,500 active members and a team of 15 certified professionals, we offer a complete fitness experience that goes beyond a regular gym.",
        stat_members: "Active members",
        stat_years: "Years of experience",
        stat_trainers: "Certified trainers",
        stat_classes: "Group classes weekly",
        // Programs
        programs_tag: "PROGRAMS",
        programs_title: 'Find your <span class="text-accent">style</span>',
        programs_subtitle: "Diverse programs designed for every goal and level",
        program_more: "Learn more →",
        program1_title: "Strength Training",
        program1_desc: "Build muscle mass and strength with our modern weights and machines. Suitable for all levels.",
        program2_title: "HIIT",
        program2_desc: "High-intensity interval training for maximum calorie burning and improved conditioning.",
        program3_title: "Functional Training",
        program3_desc: "Exercises that improve everyday movement, balance, and flexibility.",
        program4_title: "Personal Training",
        program4_desc: "Individual sessions with our top trainers, fully tailored to your goals.",
        // Trainers
        trainers_tag: "TRAINERS",
        trainers_title: 'Experts who <span class="text-accent">guide you</span>',
        trainers_subtitle: "Our certified professionals are here to lead you to success",
        trainer1_role: "Head Coach",
        trainer1_spec: "Specialized in Strength & Conditioning",
        trainer2_role: "HIIT & Functional Coach",
        trainer2_spec: "Specialized in cardio and functional training",
        trainer3_role: "Coach",
        trainer3_spec: "Specialized in Bodybuilding & Nutrition",
        trainer4_role: "Yoga & Flexibility Coach",
        trainer4_spec: "Specialized in mobility and relaxation",
        // Pricing
        pricing_tag: "MEMBERSHIP",
        pricing_title: 'Choose your <span class="text-accent">plan</span>',
        pricing_subtitle: "Flexible plans tailored to your needs",
        pricing_period: "/month",
        pricing_badge: "Most Popular",
        pricing_cta: "Choose Plan",
        pricing_basic_name: "Basic",
        pricing_basic_f1: "Gym access",
        pricing_basic_f2: "Basic group classes",
        pricing_basic_f3: "Sauna",
        pricing_basic_f4: "Personal Training",
        pricing_basic_f5: "Nutrition plan",
        pricing_basic_f6: "Massage",
        pricing_premium_name: "Premium",
        pricing_premium_f1: "Gym access",
        pricing_premium_f2: "All group classes",
        pricing_premium_f3: "Sauna & steam room",
        pricing_premium_f4: "2 PT sessions",
        pricing_premium_f5: "Nutrition plan",
        pricing_premium_f6: "Massage",
        pricing_elite_name: "Elite",
        pricing_elite_f1: "Gym access",
        pricing_elite_f2: "All group classes",
        pricing_elite_f3: "Sauna & steam room",
        pricing_elite_f4: "Unlimited PT sessions",
        pricing_elite_f5: "Personal nutritionist",
        pricing_elite_f6: "Weekly massage",
        // Blog
        blog_tag: "BLOG",
        blog_title: 'Latest <span class="text-accent">articles</span>',
        blog_read_more: "Read more →",
        blog_cat_nutrition: "Nutrition",
        blog_cat_motivation: "Motivation",
        blog_cat_health: "Health",
        blog_cat_training: "Training",
        blog1_title: "Complete nutrition guide for training",
        blog1_desc: "Discover the best nutrition for achieving your fitness goals. From macronutrients to meal timing...",
        blog2_title: "5 ways to stay motivated",
        blog3_title: "The importance of recovery after training",
        blog4_title: "HIIT vs. Classic: which is better?",
        // Contact
        contact_tag: "CONTACT",
        contact_title: 'Get in <span class="text-accent">touch</span>',
        contact_name: "Full name",
        contact_email: "Email address",
        contact_phone: "Phone",
        contact_message: "Message",
        contact_submit: "Send message",
        contact_success: "Your message has been sent successfully! We'll get back to you as soon as possible.",
        contact_info_address: "Address",
        contact_info_phone: "Phone",
        contact_info_email: "Email",
        contact_info_hours: "Working hours",
        contact_hours_detail: "Mon - Fri: 06:00 - 23:00<br>Sat - Sun: 08:00 - 22:00",
        // Dashboard
        dash_no_plan: "You have no active plan",
        dash_browse: "Browse plans",
        dash_current: "Current",
        dash_activate: "Activate",
        dash_deactivate: "Deactivate",
        dash_switch: "Switch plan",
        dash_switch_confirm: "You already have an active plan. Do you want to switch?",
        pricing_switch_confirm: "You already have an active plan ({oldPlan}). Do you want to switch to {newPlan}?",
        dash_deactivate_confirm: "Are you sure you want to deactivate your plan?",
        dash_plan_activated: "Plan activated!",
        dash_plan_deactivated: "Plan deactivated!",
        dash_plan_switched: "Plan switched!",
        confirm_cancel: "Cancel",
        confirm_ok: "Confirm",
        // Footer
        footer_desc: "The strongest fitness center in Skopje. Build your strongest version with us.",
        footer_quick_links: "Quick Links",
        footer_newsletter: "Newsletter",
        footer_newsletter_desc: "Sign up for training tips and exclusive offers.",
        footer_rights: "All rights reserved.",
        // Cookie
        cookie_text: "This site uses cookies to provide you with the best experience. By continuing to use it, you agree to our use of cookies.",
        cookie_accept: "Accept",
        cookie_decline: "Decline",
        // Form
        form_error_name: "Please enter your name",
        form_error_email: "Please enter a valid email address",
        form_error_message: "Please enter a message"
    }
};

// --- State ---
let currentLang = localStorage.getItem('fierce-lang') || 'mk';
let cookieAccepted = localStorage.getItem('fierce-cookies');
let currentTheme = localStorage.getItem('fierce-theme') || 'dark';

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
    const safeInit = (fn) => { try { fn(); } catch(e) { console.error(fn.name, e); } };
    safeInit(initLoader);
    safeInit(initCursor);
    safeInit(initCookieBanner);
    safeInit(initNavbar);
    safeInit(initHamburger);
    safeInit(initLanguage);
    safeInit(initSmoothScroll);
    safeInit(initScrollAnimations);
    safeInit(initCounterAnimation);
    safeInit(initMagneticButtons);
    safeInit(initRippleEffect);
    safeInit(initHeroSpotlight);
    safeInit(initProgramsSlider);
    safeInit(initContactForm);
    safeInit(initNewsletterForm);
    safeInit(initAuthModal);
    safeInit(initPricingButtons);
    safeInit(initThemeToggle);
    safeInit(initTranslateDropdown);
    safeInit(initFAQ);
    safeInit(loadBlogPosts);
    applyTranslations(currentLang);
    applyTheme(currentTheme);
    refreshAuthUI();
});

// --- Loading Screen ---
function initLoader() {
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 900);
    });
    // Fallback
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
    }, 2500);
}

// --- Custom Cursor ---
function initCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX - 4 + 'px';
        cursor.style.top = mouseY - 4 + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }

    animateFollower();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .program-card, .trainer-card, .blog-card, .pricing-card');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('hover'));
        el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });
}

// --- Cookie Banner ---
function initCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('cookieAccept');
    const declineBtn = document.getElementById('cookieDecline');

    if (cookieAccepted) {
        banner.style.display = 'none';
        return;
    }

    setTimeout(() => banner.classList.add('show'), 1200);

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('fierce-cookies', 'accepted');
        banner.classList.remove('show');
        setTimeout(() => banner.style.display = 'none', 500);
    });

    declineBtn.addEventListener('click', () => {
        localStorage.setItem('fierce-cookies', 'declined');
        banner.classList.remove('show');
        setTimeout(() => banner.style.display = 'none', 500);
    });
}

// --- Navbar ---
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Background change
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// --- Hamburger Menu ---
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// --- Language Toggle ---
function initLanguage() {
    const toggle = document.getElementById('langToggle');
    const label = document.getElementById('langLabel');
    if (!toggle || !label) return;

    // Set initial state
    if (currentLang === 'en') {
        toggle.classList.add('en');
        label.textContent = 'EN';
    }

    toggle.addEventListener('click', () => {
        document.body.classList.add('lang-switching');

        setTimeout(() => {
            currentLang = currentLang === 'mk' ? 'en' : 'mk';
            localStorage.setItem('fierce-lang', currentLang);
            label.textContent = currentLang.toUpperCase();

            if (currentLang === 'en') {
                toggle.classList.add('en');
            } else {
                toggle.classList.remove('en');
            }

            applyTranslations(currentLang);

            setTimeout(() => {
                document.body.classList.remove('lang-switching');
            }, 100);
        }, 300);
    });
}

function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });
}

// --- Smooth Scroll ---
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// --- Scroll Animations (Intersection Observer) ---
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger delay for siblings
                const parent = entry.target.parentElement;
                const siblings = Array.from(parent.children).filter(child => child.classList.contains('animate-in'));
                const siblingIndex = siblings.indexOf(entry.target);
                const delay = siblingIndex * 100;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
}

// --- Theme Toggle ---
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        toggle.classList.add('switching');
        setTimeout(() => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('fierce-theme', currentTheme);
            applyTheme(currentTheme);
            setTimeout(() => toggle.classList.remove('switching'), 200);
        }, 150);
    });
}

function applyTheme(theme) {
    const icon = document.getElementById('themeIcon');
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    } else {
        document.body.classList.remove('light-mode');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
}

// --- Translate Dropdown ---
function initTranslateDropdown() {
    const btn = document.getElementById('translateBtn');
    const dropdown = document.getElementById('translateDropdown');
    const wrapper = document.getElementById('translateWrapper');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (wrapper && !wrapper.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });

    const options = dropdown.querySelectorAll('.translate-option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');

            // Update active state
            options.forEach(o => o.classList.remove('active'));
            option.classList.add('active');

            // If MK or EN, use our custom translation system
            if (lang === 'mk' || lang === 'en') {
                // Reset Google Translate if active
                resetGoogleTranslate();
                // Switch our custom toggle
                if (currentLang !== lang) {
                    document.getElementById('langToggle').click();
                }
            } else {
                // For other languages, use Google Translate
                // First reset our custom MK/EN if needed
                if (currentLang !== 'mk') {
                    currentLang = 'mk';
                    localStorage.setItem('fierce-lang', 'mk');
                    const toggle = document.getElementById('langToggle');
                    const label = document.getElementById('langLabel');
                    toggle.classList.remove('en');
                    label.textContent = 'MK';
                    applyTranslations('mk');
                }
                triggerGoogleTranslate(lang);
            }

            dropdown.classList.remove('open');
        });
    });
}

function triggerGoogleTranslate(lang) {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change'));
    }
}

function resetGoogleTranslate() {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = '';
        select.dispatchEvent(new Event('change'));
    }
    // Remove Google Translate wrapper if present
    const googWrapper = document.querySelector('.goog-te-spinner-pos, .skiptranslate');
    if (googWrapper) googWrapper.style.display = 'none';
}

// --- Parallax Hero (REMOVED — static image per preference) ---

// --- Counter Animation ---
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(eased * target);
                        counter.textContent = current.toLocaleString();

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target.toLocaleString();
                        }
                    }

                    requestAnimationFrame(updateCounter);
                });
            }
        });
    }, {threshold: 0.3});

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) observer.observe(statsSection);
}

// --- Magnetic Buttons ---
function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const buttons = document.querySelectorAll('.magnetic-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// --- Ripple Effect ---
function initRippleEffect() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// --- Hero Spotlight ---
function initHeroSpotlight() {
    const spotlight = document.getElementById('heroSpotlight');
    const hero = document.querySelector('.hero');
    if (!spotlight || !hero) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        spotlight.style.background = `radial-gradient(circle 400px at ${x}% ${y}%, rgba(255, 84, 0, 0.07) 0%, transparent 70%)`;
    });

    hero.addEventListener('mouseleave', () => {
        spotlight.style.background = 'radial-gradient(circle 400px at 50% 50%, rgba(255, 84, 0, 0.04) 0%, transparent 70%)';
    });
}

// --- Programs Slider ---
function initProgramsSlider() {
    const track = document.getElementById('programsTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = track.querySelectorAll('.program-card');
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();

    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 4;
    }

    const totalSlides = Math.ceil(cards.length / cardsPerView);

    // Create dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const numDots = Math.ceil(cards.length / cardsPerView);
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function goToSlide(index) {
        const numSlides = Math.ceil(cards.length / cardsPerView);
        currentIndex = Math.max(0, Math.min(index, numSlides - 1));
        const cardWidth = cards[0].offsetWidth + 24; // gap
        const offset = currentIndex * cardsPerView * cardWidth;
        track.style.transform = `translateX(-${offset}px)`;
        updateDots();
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    createDots();

    window.addEventListener('resize', () => {
        cardsPerView = getCardsPerView();
        createDots();
        goToSlide(0);
    });
}

// --- Contact Form Validation ---
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector("button[type=submit]");
        const orig = btn.textContent;
        btn.disabled = true;
        btn.textContent = "Се испраќа...";

        try {
            await api("/contact/", {
                method: "POST",
                body: JSON.stringify({
                    name: document.getElementById("formName").value,
                    email: document.getElementById("formEmail").value,
                    subject: "Contact Form",
                    message: document.getElementById("formMessage").value
                })
            });
            showToast("Пораката е испратена!");
            form.reset();
        } catch (err) {
            showToast(err.message || "Грешка при испраќање", true);
        } finally {
            btn.disabled = false;
            btn.textContent = orig;
        }
    });

    // Remove error on input
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.closest('.form-group').classList.remove('error');
        });
    });
}

// --- Newsletter Form ---
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        const submitBtn = form.querySelector('button');
        if (!input.value.trim()) return;

        try {
            await api("/newsletter/", {
                method: "POST",
                body: JSON.stringify({ email: input.value })
            });
            showToast("Се попиште за newsletter!");
            input.value = '';
            const successIcon = document.getElementById('newsletterSuccess');
            if (successIcon) {
                successIcon.classList.add('show');
                submitBtn.style.opacity = '0';
                setTimeout(() => {
                    successIcon.classList.remove('show');
                    submitBtn.style.opacity = '1';
                }, 2500);
            }
        } catch (err) {
            showToast(err.message || "Грешка", true);
        }
    });
}

// --- FAQ Accordion ---
function initFAQ() {
    document.querySelectorAll(".faq-question").forEach(btn => {
        btn.addEventListener("click", () => {
            const item = btn.closest(".faq-item");
            const isActive = item.classList.contains("active");
            document.querySelectorAll(".faq-item.active").forEach(i => i.classList.remove("active"));
            if (!isActive) item.classList.add("active");
        });
    });

    const stickyCta = document.getElementById("stickyMobileCta");
    if (stickyCta) {
        const pricingSection = document.getElementById("pricing");
        if (pricingSection) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        stickyCta.style.opacity = "0";
                        stickyCta.style.pointerEvents = "none";
                    } else {
                        stickyCta.style.opacity = "1";
                        stickyCta.style.pointerEvents = "auto";
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(pricingSection);
        }
    }
}

// --- Auth Modal ---
function initAuthModal() {
    const modal = document.getElementById("authModal");
    const userBtn = document.getElementById("userBtn");
    const closeBtn = document.getElementById("authModalClose");
    const overlay = document.getElementById("authModalOverlay");
    const logoutBtn = document.getElementById("logoutBtn");
    const tabs = document.querySelectorAll(".auth-tab");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    function openModal() { modal.classList.add("show"); refreshAuthUI(); }
    function closeModal() { modal.classList.remove("show"); }

    userBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const isLogin = tab.dataset.tab === "login";
            loginForm.style.display = isLogin ? "block" : "none";
            registerForm.style.display = isLogin ? "none" : "block";
        });
    });

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const errEl = document.getElementById("loginError");
        errEl.textContent = "";
        try {
            const body = new URLSearchParams();
            body.append("username", document.getElementById("loginEmail").value);
            body.append("password", document.getElementById("loginPassword").value);
            let res;
            try {
                res = await fetch(`${API_BASE}/auth/login`, {
                    method: "POST",
                    body
                });
            } catch (e) {
                throw new Error("Серверот не е достапен. Проверете дали backend е вклучен.");
            }
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || `HTTP ${res.status}`);
            }
            const data = await res.json();
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            showToast(`Добредојде, ${data.user.first_name}!`);
            closeModal();
            refreshAuthUI();
            if (window._pendingPlanId) {
                const pid = window._pendingPlanId;
                window._pendingPlanId = null;
                await handlePricingClick(pid);
            }
        } catch (err) {
            errEl.textContent = err.message || "Грешка при најава";
        }
    });

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const errEl = document.getElementById("registerError");
        errEl.textContent = "";
        try {
            const data = await api("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    email: document.getElementById("regEmail").value,
                    password: document.getElementById("regPassword").value,
                    first_name: document.getElementById("regFirstName").value,
                    last_name: document.getElementById("regLastName").value
                })
            });
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            showToast(`Добредојде, ${data.user.first_name}!`);
            closeModal();
            refreshAuthUI();
            if (window._pendingPlanId) {
                const pid = window._pendingPlanId;
                window._pendingPlanId = null;
                await handlePricingClick(pid);
            }
        } catch (err) {
            errEl.textContent = err.message || "Грешка при регистрација";
        }
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        showToast("Одјавен");
        refreshAuthUI();
        closeModal();
    });

    const deactivateBtn = document.getElementById("deactivatePlanBtn");
    if (deactivateBtn) {
        deactivateBtn.addEventListener("click", async () => {
            const msg = translations[currentLang]?.dash_deactivate_confirm || "Дали сте сигурни дека сакате да го деактивирате планот?";
            if (!await showConfirmModal(msg)) return;
            try {
                await api("/memberships/deactivate", { method: "POST" });
                showToast(translations[currentLang]?.dash_plan_deactivated || "Планот е деактивиран!");
                loadDashboard();
            } catch (err) {
                showToast(err.message || "Грешка", true);
            }
        });
    }

    const browseBtn = document.getElementById("dashBrowsePlans");
    if (browseBtn) {
        browseBtn.addEventListener("click", () => {
            closeModal();
        });
    }
}

function refreshAuthUI() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const loggedOut = document.getElementById("authLoggedOut");
    const loggedIn = document.getElementById("authLoggedIn");
    const userBtn = document.getElementById("userBtn");
    const userBtnLabel = document.getElementById("userBtnLabel");

    if (token && user) {
        loggedOut.style.display = "none";
        loggedIn.style.display = "block";
        document.getElementById("authUserName").textContent = `${user.first_name} ${user.last_name}`;
        document.getElementById("authUserRole").textContent = user.role;
        userBtn.classList.add("logged-in");
        if (userBtnLabel) userBtnLabel.textContent = user.first_name;

        loadDashboard();
    } else {
        loggedOut.style.display = "block";
        loggedIn.style.display = "none";
        userBtn.classList.remove("logged-in");
        if (userBtnLabel) userBtnLabel.textContent = "Најава";
        clearPricingActiveStates();
    }
}

function clearPricingActiveStates() {
    document.querySelectorAll(".pricing-card").forEach(c => c.classList.remove("is-active"));
}

async function loadDashboard() {
    const noPlan = document.getElementById("dashboardNoPlan");
    const activePlan = document.getElementById("dashboardActivePlan");
    const history = document.getElementById("dashboardHistory");

    try {
        const list = await api("/memberships/my");
        const active = list.find(m => m.status === "ACTIVE");

        clearPricingActiveStates();

        if (active) {
            noPlan.style.display = "none";
            activePlan.style.display = "block";

            document.getElementById("planCardName").textContent = active.plan_name;
            document.getElementById("planCardPrice").textContent = `${active.plan_price} ден/месечно`;
            document.getElementById("planCardDate").textContent = `Активиран: ${new Date(active.start_date).toLocaleDateString("mk-MK")}`;

            const badge = document.getElementById("planStatusBadge");
            badge.textContent = active.status;
            badge.className = `plan-status-badge ${active.status.toLowerCase()}`;

            const features = active.plan_features ? active.plan_features.split(",").map(f => `<div>✓ ${escapeHtml(f.trim())}</div>`).join("") : "";
            document.getElementById("planCardFeatures").innerHTML = features;

            const card = document.querySelector(`[data-plan-id-card="${active.plan_id}"]`);
            if (card) card.classList.add("is-active");

            document.querySelectorAll(".btn-pricing").forEach(btn => {
                if (btn.dataset.planId == active.plan_id) {
                    btn.textContent = translations[currentLang]?.dash_current || "Тековен";
                    btn.classList.add("btn-current");
                    btn.disabled = true;
                } else {
                    btn.textContent = translations[currentLang]?.dash_switch || "Промени план";
                    btn.classList.remove("btn-current");
                    btn.disabled = false;
                }
            });

            if (history) {
                history.innerHTML = list.map(m => `
                    <div class="dashboard-history-item">
                        <span class="history-plan-name">${escapeHtml(m.plan_name)}</span>
                        <span>${new Date(m.start_date).toLocaleDateString("mk-MK")}</span>
                        <span class="history-status ${escapeHtml(m.status.toLowerCase())}">${escapeHtml(m.status)}</span>
                    </div>
                `).join("");
            }
        } else {
            noPlan.style.display = "block";
            activePlan.style.display = "none";

            document.querySelectorAll(".btn-pricing").forEach(btn => {
                btn.textContent = translations[currentLang]?.pricing_cta || "Избери план";
                btn.classList.remove("btn-current");
                btn.disabled = false;
            });

            if (history && list.length) {
                history.innerHTML = list.map(m => `
                    <div class="dashboard-history-item">
                        <span class="history-plan-name">${escapeHtml(m.plan_name)}</span>
                        <span>${new Date(m.start_date).toLocaleDateString("mk-MK")}</span>
                        <span class="history-status ${escapeHtml(m.status.toLowerCase())}">${escapeHtml(m.status)}</span>
                    </div>
                `).join("");
            } else if (history) {
                history.innerHTML = "";
            }
        }
    } catch (err) {
        noPlan.style.display = "block";
        activePlan.style.display = "none";
    }
}

// --- Pricing Buttons ---
async function handlePricingClick(planId) {
    try {
        let active = null;
        try {
            active = await api("/memberships/active");
        } catch (_) { /* no active plan */ }

        const planCard = document.querySelector(`[data-plan-id-card="${planId}"]`);
        const newPlanName = planCard ? planCard.querySelector(".pricing-name")?.textContent : `#${planId}`;

        if (active && active.plan_id && active.plan_id != planId) {
            const oldPlanName = active.plan_name || `#${active.plan_id}`;
            const msg = (translations[currentLang]?.pricing_switch_confirm || "Веќе имате активен план ({oldPlan}). Дали сакате да го смените за {newPlan}?")
                .replace("{oldPlan}", oldPlanName)
                .replace("{newPlan}", newPlanName);
            if (!await showConfirmModal(msg)) return;
            await api(`/memberships/switch?plan_id=${planId}`, { method: "POST" });
            showToast(translations[currentLang]?.dash_plan_switched || "Планот е сменет!");
        } else {
            await api(`/memberships/subscribe?plan_id=${planId}`, { method: "POST" });
            showToast(translations[currentLang]?.dash_plan_activated || "Планот е активиран!");
        }
        refreshAuthUI();
    } catch (err) {
        showToast(err.message || "Грешка", true);
    }
}

function initPricingButtons() {
    console.log("[FF] initPricingButtons called, buttons found:", document.querySelectorAll(".btn-pricing").length);
    document.querySelectorAll(".btn-pricing").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (btn.disabled) return;
            console.log("[FF] pricing clicked, planId:", btn.dataset.planId);
            const token = localStorage.getItem("token");
            if (!token) {
                window._pendingPlanId = btn.dataset.planId;
                console.log("[FF] no token, opening modal");
                document.getElementById("authModal").classList.add("show");
                document.querySelector('[data-tab="login"]').click();
                return;
            }
            const planId = btn.dataset.planId;
            if (!planId) return;
            await handlePricingClick(planId);
        });
    });
}

// --- Fallback: delegated click handler (works even if Google Translate modifies DOM) ---
document.addEventListener("click", function(e) {
    // Pricing buttons
    const btn = e.target.closest(".btn-pricing");
    if (btn && !btn.disabled) {
        e.preventDefault();
        e.stopPropagation();
        const token = localStorage.getItem("token");
        if (!token) {
            window._pendingPlanId = btn.dataset.planId;
            const modal = document.getElementById("authModal");
            if (modal) {
                modal.classList.add("show");
                const loginTab = document.querySelector('[data-tab="login"]');
                if (loginTab) loginTab.click();
            }
            return;
        }
        const planId = btn.dataset.planId;
        if (!planId) return;
        handlePricingClick(planId);
        return;
    }

    // User button
    if (e.target.closest("#userBtn")) {
        const modal = document.getElementById("authModal");
        if (modal) {
            modal.classList.add("show");
            refreshAuthUI();
        }
        return;
    }

    // Close modal
    if (e.target.closest("#authModalClose") || e.target.id === "authModalOverlay") {
        const modal = document.getElementById("authModal");
        if (modal) modal.classList.remove("show");
        return;
    }
}, true);

// --- Dynamic Trainers ---
const FALLBACK_TRAINERS = [
    { first_name: "Андреј", last_name: "Димовски", specialty: "Head Coach", bio: "Специјализиран за Strength & Conditioning", image_url: "images/trainer1.jpg", instagram_url: null, facebook_url: null },
    { first_name: "Марија", last_name: "Јаневска", specialty: "HIIT & Functional Coach", bio: "Специјализирана за кардио и функционален тренинг", image_url: "images/trainer2.jpg", instagram_url: null, facebook_url: null },
    { first_name: "Никола", last_name: "Стојанов", specialty: "Coach", bio: "Специјализиран за Bodybuilding & Nutrition", image_url: "images/trainer3.jpg", instagram_url: null, facebook_url: null },
    { first_name: "Ивана", last_name: "Костова", specialty: "Yoga & Flexibility Coach", bio: "Специјализирана за мобилност и релаксација", image_url: "images/trainer4.jpg", instagram_url: null, facebook_url: null },
];

function renderTrainerCard(trainer, index) {
    const name = escapeHtml(`${trainer.first_name} ${trainer.last_name}`);
    const img = trainer.image_url || `images/trainer${(index % 4) + 1}.jpg`;
    const instagram = trainer.instagram_url ? `<a href="${escapeHtml(trainer.instagram_url)}" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram"><i class="fab fa-instagram"></i></a>` : "";
    const facebook = trainer.facebook_url ? `<a href="${escapeHtml(trainer.facebook_url)}" target="_blank" rel="noopener" aria-label="Facebook" title="Facebook"><i class="fab fa-facebook-f"></i></a>` : "";
    const featured = index === 0 ? " trainer-card--featured" : "";
    return `
        <div class="trainer-card${featured} animate-in visible">
            <div class="trainer-image">
                <img src="${escapeHtml(img)}" alt="${name}">
                <div class="trainer-socials">${instagram}${facebook}</div>
            </div>
            <div class="trainer-info">
                <h3>${name}</h3>
                <span class="trainer-role">${escapeHtml(trainer.specialty)}</span>
                <p class="trainer-spec">${escapeHtml(trainer.bio)}</p>
            </div>
        </div>
    `;
}

async function loadTrainers() {
    const grid = document.getElementById("trainersGrid");
    if (!grid) return;

    let trainers = [];
    try {
        trainers = await api("/trainers/?limit=20");
    } catch (e) {
        console.warn("Failed to load trainers from API, keeping static content:", e);
        return;
    }

    if (!trainers || trainers.length === 0) return;

    grid.innerHTML = trainers.map((t, i) => renderTrainerCard(t, i)).join("");
}

// --- Dynamic Blog Posts ---
const FALLBACK_BLOGS = [
    { title: "Комплетен водич за исхрана при тренирање", content: "Дознај која е најдобрата исхрана за постигнување на твоите фитнес цели. Од макронутриенти до тајминг на оброци...", category: "Нутриција", created_at: "2026-05-15T00:00:00", author_name: "Андреј Димовски", image: "images/blog-nutrition.jpg" },
    { title: "5 начини да останеш мотивиран", content: "", category: "Мотивација", created_at: "2026-05-10T00:00:00", author_name: "", image: "images/blog-motivation.jpg" },
    { title: "Значењето на опоравувањето по тренинг", content: "", category: "Здравје", created_at: "2026-05-05T00:00:00", author_name: "", image: "images/blog-health.jpg" },
    { title: "HIIT vs. Classic: што е подобро?", content: "", category: "Тренинг", created_at: "2026-05-01T00:00:00", author_name: "", image: "images/blog-training.jpg" },
];

const BLOG_IMAGES = ["images/blog-nutrition.jpg", "images/blog-motivation.jpg", "images/blog-health.jpg", "images/blog-training.jpg"];

function renderBlogCard(blog, index, isFeatured) {
    const date = new Date(blog.created_at).toLocaleDateString("mk-MK", { day: "numeric", month: "long", year: "numeric" });
    const img = blog.image || BLOG_IMAGES[index % BLOG_IMAGES.length];
    const featuredClass = isFeatured ? " blog-featured" : "";
    const titleTag = isFeatured ? "h3" : "h4";
    const meta = blog.author_name
        ? `<span><i class="fas fa-calendar"></i> ${escapeHtml(date)}</span><span><i class="fas fa-user"></i> ${escapeHtml(blog.author_name)}</span>`
        : `<span><i class="fas fa-calendar"></i> ${escapeHtml(date)}</span>`;
    return `
        <article class="blog-card${featuredClass} animate-in visible">
            <div class="blog-image">
                <img src="${escapeHtml(img)}" alt="${escapeHtml(blog.title)}">
                <div class="blog-overlay">
                    <span class="blog-read-more" data-i18n="blog_read_more">Прочитај повеќе →</span>
                </div>
                <span class="blog-category">${escapeHtml(blog.category)}</span>
            </div>
            <div class="blog-content">
                <div class="blog-meta">${meta}</div>
                <${titleTag}>${escapeHtml(blog.title)}</${titleTag}>
                ${blog.content ? `<p>${escapeHtml(blog.content.substring(0, 150))}${blog.content.length > 150 ? "..." : ""}</p>` : ""}
            </div>
        </article>
    `;
}

async function loadBlogPosts() {
    const grid = document.getElementById("blogGrid");
    if (!grid) return;

    let blogs = [];
    try {
        blogs = await api("/blog/?limit=10");
    } catch (e) {
        console.warn("Failed to load blog posts from API, keeping static content:", e);
        return;
    }

    if (!blogs || blogs.length === 0) return;

    grid.innerHTML = blogs.map((b, i) => renderBlogCard(b, i, i === 0)).join("");
}
