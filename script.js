/* ============================================
   FIERCE FITNESS - Main JavaScript
   ============================================ */

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
    initLoader();
    initCursor();
    initCookieBanner();
    initNavbar();
    initHamburger();
    initLanguage();
    initSmoothScroll();
    initScrollAnimations();
    initCounterAnimation();
    initMagneticButtons();
    initRippleEffect();
    initHeroSpotlight();
    initProgramsSlider();
    initContactForm();
    initNewsletterForm();
    initThemeToggle();
    initTranslateDropdown();
    applyTranslations(currentLang);
    applyTheme(currentTheme);
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
    const successMsg = document.getElementById('formSuccess');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const name = document.getElementById('formName');
        const email = document.getElementById('formEmail');
        const message = document.getElementById('formMessage');

        // Reset errors
        [name, email, message].forEach(input => {
            input.closest('.form-group').classList.remove('error');
        });

        // Validate name
        if (!name.value.trim()) {
            name.closest('.form-group').classList.add('error');
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            email.closest('.form-group').classList.add('error');
            isValid = false;
        }

        // Validate message
        if (!message.value.trim()) {
            message.closest('.form-group').classList.add('error');
            isValid = false;
        }

        if (isValid) {
            form.style.display = 'none';
            successMsg.classList.add('show');
            form.reset();
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
    const successIcon = document.getElementById('newsletterSuccess');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        const submitBtn = form.querySelector('button');
        if (input.value.trim()) {
            input.value = '';
            // Show success checkmark
            if (successIcon) {
                successIcon.classList.add('show');
                submitBtn.style.opacity = '0';
                setTimeout(() => {
                    successIcon.classList.remove('show');
                    submitBtn.style.opacity = '1';
                }, 2500);
            }
        }
    });
}
