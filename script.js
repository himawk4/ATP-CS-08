

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* STICKY HEADER & SCROLL BEHAVIOR  */
  
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // ScrollSpy: highlight active link
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  /* MOBILE NAVIGATION MENU */
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !mobileMenu.contains(e.target) && mobileMenu.classList.contains('open')) {
        navToggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Ensure standard light topographic mesh background is active
  if (localStorage.getItem('trinode-map-theme')) {
    localStorage.removeItem('trinode-map-theme');
  }
  document.body.removeAttribute('data-theme');

  /* SCROLL REVEAL */
  
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  /*  ANIMATED COUNTERS FOR  */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  function countUp(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const isDecimal = el.getAttribute('data-decimal') === 'true';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = target * ease;

      el.textContent = isDecimal ? currentVal.toFixed(1) : Math.round(currentVal);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = isDecimal ? target.toFixed(1) : target;
      }
    }

    requestAnimationFrame(update);
  }

  const statsSection = document.querySelector('.proof-strip');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          statNumbers.forEach(stat => countUp(stat));
        }
      });
    }, { threshold: 0.25 });
    statsObserver.observe(statsSection);
  }

  const brandLinks = document.querySelectorAll('.brand-wrap');
  brandLinks.forEach(brand => {
    brand.addEventListener('click', (e) => {
      e.preventDefault();
      const firstSection = document.getElementById('hero') || document.querySelector('section');
      if (firstSection) {
        firstSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  /* WIREFRAME FILTER TABS */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const wfCards = document.querySelectorAll('.wf-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      wfCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (category === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // Trigger the default active filter on load
  const defaultFilter = document.querySelector('.filter-btn.active');
  if (defaultFilter) {
    defaultFilter.click();
  }

  /*  WIREFRAME MODAL INSPECTOR */
  const modalBackdrop = document.getElementById('wf-modal');
  const modalImage = document.getElementById('modal-wf-img');
  const modalTitle = document.getElementById('modal-wf-title');
  const modalBadge = document.getElementById('modal-wf-badge');
  const modalDesc = document.getElementById('modal-wf-desc');
  const modalNotes = document.getElementById('modal-wf-notes');
  const modalCloseBtn = document.querySelector('.modal-close-btn');

  const wireframeDetails = {
    'M1': {
      title: 'M1: Start — Choose Role Screen',
      badge: 'Resident / First Screen',
      image: 'assets/wireframes/m1-choose-role.png',
      desc: 'First screen loaded when any phone connects to trinode.lan hotspot. Provides immediate connection confirmation and zero-friction role selection.',
      notes: 'Connection First: The prominent "Connected to base" status banner tells distressed citizens immediately that their phone reached emergency camp Wi-Fi. Zero account registration required for residents to maximize reporting speed.'
    },
    'M2': {
      title: 'M2: New Help Request Form',
      badge: 'Resident & Volunteer Reporting',
      image: 'assets/wireframes/m2-new-request.png',
      desc: 'Intuitive triage intake for urgent needs: Medical, Water, Food, Shelter, Rescue, or Other.',
      notes: 'Form captures urgency (Urgent, Moderate, Low), precise landmarks (e.g., Behind Gampola temple, 2nd lane), and number of affected people with large, stress-tolerant tap targets.'
    },
    'M3': {
      title: 'M3: Offline Error & Validation State',
      badge: 'Resilience & Data Safety',
      image: 'assets/wireframes/m3-request-errors.png',
      desc: 'Displays clear non-blocking validation while assuring the user: "Your answers are kept — nothing has been lost".',
      notes: 'Critical UX safeguard: Even during complete network signal loss, the browser stores input locally so victims never lose typed triage details.'
    },
    'M4': {
      title: 'M4: Request Saved Offline Confirmation',
      badge: 'Store-and-Forward Confirmation',
      image: 'assets/wireframes/m4-request-saved.png',
      desc: 'Shows confirmation that the emergency ticket (e.g. LF-7F3A) is safely queued on phone storage and will sync automatically upon Wi-Fi proximity.',
      notes: 'Provides psychological reassurance in panic situations. Assigns local ticket reference ID and tells user to keep the phone powered.'
    },
    'M5': {
      title: 'M5: My Requests & Local Sync Queue',
      badge: 'Resident & Volunteer Tracking',
      image: 'assets/wireframes/m5-my-requests.png',
      desc: 'Real-time overview of all tickets submitted from this device, their sync queue status, and live field dispatch state.',
      notes: 'Status chips include QUEUED (waiting for relay), SENT (received by base camp node), DISPATCHED (rescue boat en route), and RESOLVED.'
    },
    'M6': {
      title: 'M6: Request Detail & Progress Stepper',
      badge: 'Full Lifecycle Journey',
      image: 'assets/wireframes/m6-request-progress.png',
      desc: 'End-to-end timeline for ticket LF-2C91: Queued on phone → Sent to base → Acknowledged by Coordinator → Dispatched → Resolved.',
      notes: 'Eliminates anxiety by giving civilians full transparency into which rescue team (e.g. Team B boat) has been assigned to their exact coordinates.'
    },
    'M7': {
      title: 'M7: Volunteer Task Management',
      badge: 'First Responder Workflow',
      image: 'assets/wireframes/m7-volunteer-tasks.png',
      desc: 'Task dispatch board for volunteer rescue teams, highlighting high-urgency rescue missions at the top with quick "Mark as done" verification.',
      notes: 'Features a confirmation sheet asking "Was everyone helped?" with Yes / Not fully options. "Not fully" keeps the task open and alerts the base coordinator.'
    },
    'M8': {
      title: 'M8: Safe Zones & Shelters Directory',
      badge: 'Civilian & Field Logistics',
      image: 'assets/wireframes/m8-safe-zones.png',
      desc: 'Real-time shelter capacity and essential amenity tracker (Power, Potable Water, Medical Staff) sorted by available space.',
      notes: 'Prevents overcrowded relief camps by guiding displaced families to shelters with capacity (e.g. Temple hall: 66 spaces available).'
    },
    'M9': {
      title: 'M9: Coordinator Triage Command Board',
      badge: 'Command & Incident Triage',
      image: 'assets/wireframes/m9-coordinator-triage.png',
      desc: 'Compact mobile triage console for incident commanders: Live ticket counts, urgent filtering, duplicate detection, and team dispatch.',
      notes: 'Transforms complex desktop dispatch boards into high-speed mobile cards for commanders working on battery power in muddy field tents.'
    },
    'S1': {
      title: 'Sinhala Wireframe 1: Captive Portal & Language Screen',
      badge: 'Civilians & Displaced Residents',
      image: 'assets/wireframes/sinhala wireframe 1.jpg',
      desc: 'Automatic captive portal splash screen displayed when connecting to the local Trinode hotspot in Gampola relief camp. Features multi-language selection (සිංහල, தமிழ், English) and guidance on opening Trinode in browser for offline persistence.',
      notes: 'Zero App Installation: The captive portal automatically triggers the native browser. Civilians choose their preferred language (Sinhala, Tamil, or English) without downloading anything from an app store.'
    },
    'S2': {
      title: 'Sinhala Wireframe 2: Offline Home Screen Setup',
      badge: 'Offline PWA & Local Base Connection',
      image: 'assets/wireframes/sinhala wireframe 2.jpg',
      desc: 'Modal prompt guiding users to add Trinode to their phone home screen. Confirms connection to the local base (Trinode.lan · Gampola relief camp) and role selection (I need help / I am a volunteer / Team or staff sign in).',
      notes: 'PWA Survivability: Once added to home screen, requests wait securely on the device and sync automatically as soon as the user is in range of any Trinode Wi-Fi base node.'
    }
  };

  const allClickableWfCards = document.querySelectorAll('.wf-card, .hero-phone-card');
  allClickableWfCards.forEach(card => {
    card.addEventListener('click', () => {
      const wfId = card.getAttribute('data-wfid');
      const data = wireframeDetails[wfId];
      if (data && modalBackdrop) {
        modalTitle.textContent = data.title;
        modalBadge.textContent = data.badge;
        modalImage.src = data.image;
        modalImage.alt = `Wireframe screen ${wfId}: ${data.title}`;
        modalDesc.textContent = data.desc;
        modalNotes.textContent = data.notes;
        modalBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  if (modalCloseBtn && modalBackdrop) {
    modalCloseBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
        closeModal();
      }
    });
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  /*  DEMO REQUEST FORM VALIDATION & ACTIONS */
  const demoForm = document.getElementById('demo-request-form');
  const successBanner = document.querySelector('.form-success-banner');

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById('form-name');
      const agencyInput = document.getElementById('form-agency');
      const contactInput = document.getElementById('form-contact');
      const regionInput = document.getElementById('form-region');
      const scaleInput = document.getElementById('form-scale');
      const notesInput = document.getElementById('form-notes');

      // Clear existing errors
      document.querySelectorAll('.form-control').forEach(ctrl => ctrl.classList.remove('is-invalid'));
      document.querySelectorAll('.form-error-msg').forEach(msg => msg.classList.remove('visible'));

      // Validate Name
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Please enter your full name.');
        isValid = false;
      }

      // Validate Agency
      if (!agencyInput.value.trim()) {
        showError(agencyInput, 'Please specify your organization or agency.');
        isValid = false;
      }

      // Validate Contact
      if (!contactInput.value.trim() || contactInput.value.trim().length < 5) {
        showError(contactInput, 'Please provide a valid email or WhatsApp phone number.');
        isValid = false;
      }

      if (isValid) {
        const agency = encodeURIComponent(agencyInput.value.trim());
        const name = encodeURIComponent(nameInput.value.trim());
        const contact = encodeURIComponent(contactInput.value.trim());
        const region = encodeURIComponent(regionInput ? regionInput.value.trim() : 'Sri Lanka');
        const scale = encodeURIComponent(scaleInput ? scaleInput.value : 'Community / District');
        const notes = encodeURIComponent(notesInput ? notesInput.value.trim() : 'Requesting Trinode offline mesh briefing and demonstration.');

        // Build pre-filled mailto & WhatsApp links
        const mailSubject = encodeURIComponent(`[Trinode Demo Request] ${agencyInput.value.trim()}`);
        const mailBody = encodeURIComponent(
          `Hello Trinode Disaster Response Team,\n\n` +
          `I would like to request an official demonstration and deployment briefing for Trinode.\n\n` +
          `• Organization / Agency: ${agencyInput.value.trim()}\n` +
          `• Contact Person: ${nameInput.value.trim()}\n` +
          `• Email / Phone: ${contactInput.value.trim()}\n` +
          `• Region: ${regionInput ? regionInput.value.trim() : 'N/A'}\n` +
          `• Deployment Scale: ${scaleInput ? scaleInput.value : 'District'}\n` +
          `• Operational Notes: ${notesInput ? notesInput.value.trim() : 'N/A'}\n\n` +
          `Thank you,\n${nameInput.value.trim()}`
        );

        const waText = encodeURIComponent(
          `*Trinode Emergency Coordination Demo Request*\n` +
          `• Agency: ${agencyInput.value.trim()}\n` +
          `• Contact: ${nameInput.value.trim()} (${contactInput.value.trim()})\n` +
          `• Region: ${regionInput ? regionInput.value.trim() : 'Sri Lanka'}\n` +
          `• Scale: ${scaleInput ? scaleInput.value : 'District'}`
        );

        if (successBanner) {
          successBanner.innerHTML = `
            <strong>✓ Demo Request Prepared!</strong><br>
            Thank you, ${nameInput.value.trim()} from ${agencyInput.value.trim()}. Your demonstration inquiry has been formatted.<br><br>
            <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:8px;">
              <a href="mailto:atpcs08@gmail.com?subject=${mailSubject}&body=${mailBody}" class="btn btn--teal btn--sm" style="color:#FFFFFF; text-decoration:none;">
                ✉ Send via Email
              </a>
              <a href="https://wa.me/94770000000?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn btn--secondary-cream btn--sm" style="text-decoration:none;">
                💬 Open in WhatsApp
              </a>
            </div>
            <p style="font-size:0.78rem; color:#94a3b8; margin-top:8px;"> </p>
          `;
          successBanner.classList.add('visible');
        }

        demoForm.reset();
      }
    });
  }

  function showError(inputEl, message) {
    inputEl.classList.add('is-invalid');
    const parent = inputEl.closest('.form-group');
    if (parent) {
      let errEl = parent.querySelector('.form-error-msg');
      if (errEl) {
        errEl.textContent = message;
        errEl.classList.add('visible');
      }
    }
  }

 
  const privacyBtn = document.getElementById('footer-privacy-btn');
  if (privacyBtn) {
    privacyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Trinode Privacy Notice:\n\nTrinode is designed exclusively for zero-cloud, offline emergency coordination. The platform operates on local Raspberry pi mesh networks, meaning no personal data, location traces, or messages are ever sent to commercial cloud servers or shared with third parties.');
    });
  }

  /* MOUSE CURSOR FOLLOW ANIMATION & SONAR RINGS  */
  const cursorFollower = document.getElementById('cursorFollower');
  if (cursorFollower) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        cursorFollower.style.opacity = '1';
      }
    });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      cursorFollower.style.opacity = '0';
    });

    // High performance lerp animation loop for liquid spring cursor movement
    function renderCursor() {
      currentX += (mouseX - currentX) * 0.16;
      currentY += (mouseY - currentY) * 0.16;
      cursorFollower.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Expand cursor rings on interactive targets 
    const interactiveSelector = [
      'a',
      'button',
      '.step-card-v2',
      '.step-badge-num',
      '.feature-card',
      '.role-card-v2',
      '.role-icon-box',
      '.phone-showcase-card',
      '.hero-phone-card',
      '.wf-card',
      '.glass-panel--interactive',
      '.filter-btn',
      '.btn',
      'input',
      'select',
      'textarea',
      '.team-card',
      '.feature-tag',
      '.role-tag-bottom',
      '.brand-wrap',
      '.brand-logo-icon',
      '[role="button"]'
    ].join(', ');

    document.addEventListener('mouseover', (e) => {
      if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
        cursorFollower.classList.add('is-hovering');
      } else {
        cursorFollower.classList.remove('is-hovering');
      }
    });

    // Touch support: show and expand cursor rings at touch position
    document.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        currentX = mouseX;
        currentY = mouseY;
        cursorFollower.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        cursorFollower.style.opacity = '1';
        isVisible = true;
        const target = document.elementFromPoint(mouseX, mouseY);
        if (target && target.closest && target.closest(interactiveSelector)) {
          cursorFollower.classList.add('is-hovering');
        } else {
          cursorFollower.classList.remove('is-hovering');
        }
      }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        cursorFollower.style.opacity = '1';
        isVisible = true;
        const target = document.elementFromPoint(mouseX, mouseY);
        if (target && target.closest && target.closest(interactiveSelector)) {
          cursorFollower.classList.add('is-hovering');
        } else {
          cursorFollower.classList.remove('is-hovering');
        }
      }
    }, { passive: true });

    document.addEventListener('touchend', () => {
      setTimeout(() => {
        cursorFollower.style.opacity = '0';
        cursorFollower.classList.remove('is-hovering');
        isVisible = false;
      }, 700);
    }, { passive: true });
  }
});
