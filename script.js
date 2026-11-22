

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // header shadow on scroll + active nav link
  
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // highlight the nav link for the section in view
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

  // mobile menu
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

  // clear old theme setting from earlier version
  if (localStorage.getItem('trinode-map-theme')) {
    localStorage.removeItem('trinode-map-theme');
  }
  document.body.removeAttribute('data-theme');

  // fade in sections on scroll
  
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

  // count up numbers
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
      // ease out
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

  // wireframe filter tabs
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

  // show resident screens first
  const defaultFilter = document.querySelector('.filter-btn.active');
  if (defaultFilter) {
    defaultFilter.click();
  }

  // wireframe popup
  const modalBackdrop = document.getElementById('wf-modal');
  const modalImage = document.getElementById('modal-wf-img');
  const modalTitle = document.getElementById('modal-wf-title');
  const modalBadge = document.getElementById('modal-wf-badge');
  const modalDesc = document.getElementById('modal-wf-desc');
  const modalNotes = document.getElementById('modal-wf-notes');
  const modalCloseBtn = document.querySelector('.modal-close-btn');

  const wireframeDetails = {
    'M1': {
      title: 'M1: Choose Role',
      badge: 'Resident / First Screen',
      image: 'assets/wireframes/m1-choose-role.png',
      desc: 'First screen when a phone connects to the trinode.lan hotspot. Shows that the phone is connected and asks the user to choose a role.',
      notes: 'We put the "Connected to base" banner at the top so people know straight away that their phone is on the camp Wi-Fi. Residents do not need an account so they can report quickly.'
    },
    'M2': {
      title: 'M2: New Help Request',
      badge: 'Resident & Volunteer Reporting',
      image: 'assets/wireframes/m2-new-request.png',
      desc: 'Form for asking for help: Medical, Water, Food, Shelter, Rescue or Other.',
      notes: 'Asks for urgency (Urgent, Moderate, Low), a landmark (e.g. behind Gampola temple, 2nd lane) and the number of people. Buttons are large so they are easy to tap.'
    },
    'M3': {
      title: 'M3: Form Errors',
      badge: 'Validation',
      image: 'assets/wireframes/m3-request-errors.png',
      desc: 'Shows which fields need fixing and tells the user "Your answers are kept, nothing has been lost".',
      notes: 'Input is saved in the browser, so if the connection drops the user does not have to type everything again.'
    },
    'M4': {
      title: 'M4: Request Saved',
      badge: 'Confirmation',
      image: 'assets/wireframes/m4-request-saved.png',
      desc: 'Confirms the request (e.g. LF-7F3A) is saved on the phone and will be sent when it is back in Wi-Fi range.',
      notes: 'Gives the user a reference ID and reminds them to keep the phone switched on.'
    },
    'M5': {
      title: 'M5: My Requests',
      badge: 'Tracking',
      image: 'assets/wireframes/m5-my-requests.png',
      desc: 'List of requests sent from this phone and the status of each one.',
      notes: 'Statuses: QUEUED (not sent yet), SENT (reached the base), DISPATCHED (team on the way) and RESOLVED.'
    },
    'M6': {
      title: 'M6: Request Progress',
      badge: 'Request Status',
      image: 'assets/wireframes/m6-request-progress.png',
      desc: 'Timeline for request LF-2C91: Queued → Sent → Acknowledged → Dispatched → Resolved.',
      notes: 'Shows which team (e.g. Team B) has been assigned so the person knows help is coming.'
    },
    'M7': {
      title: 'M7: Volunteer Tasks',
      badge: 'Volunteer',
      image: 'assets/wireframes/m7-volunteer-tasks.png',
      desc: 'Task list for volunteers with urgent tasks at the top and a "Mark as done" button.',
      notes: 'After marking done, it asks "Was everyone helped?" (Yes / Not fully). "Not fully" keeps the task open and lets the coordinator know.'
    },
    'M8': {
      title: 'M8: Safe Zones & Shelters',
      badge: 'Shelters',
      image: 'assets/wireframes/m8-safe-zones.png',
      desc: 'Shelters sorted by free space, with tags for power, drinking water and medical staff.',
      notes: 'Helps send families to shelters that still have space (e.g. Temple hall: 66 spaces) so one camp does not get overcrowded.'
    },
    'M9': {
      title: 'M9: Coordinator Triage',
      badge: 'Coordinator',
      image: 'assets/wireframes/m9-coordinator-triage.png',
      desc: 'Mobile version of the triage board: request counts, urgent filter, duplicate detection and assigning teams.',
      notes: 'A simpler card layout of the desktop dashboard, for coordinators who only have a phone with them.'
    },
    'S1': {
      title: 'Sinhala Wireframe 1: Language Screen',
      badge: 'Resident',
      image: 'assets/wireframes/sinhala wireframe 1.jpg',
      desc: 'Screen shown when connecting to the Trinode hotspot at the Gampola relief camp. The user picks a language (සිංහල, தமிழ், English) and is told how to open Trinode in the browser.',
      notes: 'The captive portal opens the browser automatically, so nothing has to be downloaded from an app store.'
    },
    'S2': {
      title: 'Sinhala Wireframe 2: Offline Home Screen Setup',
      badge: 'PWA Setup',
      image: 'assets/wireframes/sinhala wireframe 2.jpg',
      desc: 'Popup asking the user to add Trinode to their home screen. Shows the base they are connected to (Trinode.lan, Gampola relief camp) and the role options.',
      notes: 'Once it is on the home screen, requests are saved on the phone and sent when it is in range of a Trinode base.'
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

  // contact form
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

        // build email + whatsapp links
        const mailSubject = encodeURIComponent(`Trinode enquiry - ${agencyInput.value.trim()}`);
        const mailBody = encodeURIComponent(
          `Hi Trinode team,\n\n` +
          `I'd like to know more about Trinode.\n\n` +
          `• Organisation: ${agencyInput.value.trim()}\n` +
          `• Name: ${nameInput.value.trim()}\n` +
          `• Email / Phone: ${contactInput.value.trim()}\n` +
          `• Region: ${regionInput ? regionInput.value.trim() : 'N/A'}\n` +
          `• Area size: ${scaleInput ? scaleInput.value : 'District'}\n` +
          `• Message: ${notesInput ? notesInput.value.trim() : 'N/A'}\n\n` +
          `Thank you,\n${nameInput.value.trim()}`
        );

        const waText = encodeURIComponent(
          `*Trinode enquiry*\n` +
          `• Organisation: ${agencyInput.value.trim()}\n` +
          `• Contact: ${nameInput.value.trim()} (${contactInput.value.trim()})\n` +
          `• Region: ${regionInput ? regionInput.value.trim() : 'Sri Lanka'}\n` +
          `• Scale: ${scaleInput ? scaleInput.value : 'District'}`
        );

        if (successBanner) {
          successBanner.innerHTML = `
            <strong>Thanks, ${nameInput.value.trim()}!</strong><br>
            Choose how you want to send your message:<br><br>
            <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:8px;">
              <a href="mailto:atpcs08@gmail.com?subject=${mailSubject}&body=${mailBody}" class="btn btn--teal btn--sm" style="color:#FFFFFF; text-decoration:none;">
                Send by Email
              </a>
              <a href="https://wa.me/94770000000?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn btn--secondary-cream btn--sm" style="text-decoration:none;">
                Open in WhatsApp
              </a>
            </div>
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
      alert('Privacy Notice\n\nTrinode runs on a local network (Raspberry Pi) and does not use any cloud services. Requests stay on the local server and are not shared with third parties.');
    });
  }

  // custom cursor
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

    // smooth follow (lerp)
    function renderCursor() {
      currentX += (mouseX - currentX) * 0.16;
      currentY += (mouseY - currentY) * 0.16;
      cursorFollower.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // bigger rings when hovering clickable things
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

    // touch screens
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
