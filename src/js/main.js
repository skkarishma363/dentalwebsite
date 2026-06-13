document.addEventListener('DOMContentLoaded', () => {
  // Configurable Google Apps Script Web App URL for appointments
  const APPOINTMENT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwZIQrMiWcyrkQiQOW5q-krBT8Vh2ihZxoyiqMXsm_SrcugJqVlDj8syEXcb5zvyr4r/exec';

  // ==========================================================================
  // HEADER SCROLL EFFECT
  // ==========================================================================
  const header = document.querySelector('.header');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initial check

  // ==========================================================================
  // MOBILE NAVIGATION DRAWER & ACCORDION DROPDOWN
  // ==========================================================================
  const hamburger = document.getElementById('hamburgerToggle');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Intercept dropdown clicks on mobile screens
        if (window.innerWidth <= 768 && link.classList.contains('dropdown-toggle')) {
          e.preventDefault();
          const parent = link.closest('.nav-item-dropdown');
          if (parent) {
            parent.classList.toggle('mobile-expanded');
          }
          return;
        }

        // Close hamburger menu for normal link clicks
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================================================
  // SMOOTH SCROLLING FOR ANCHOR LINKS
  // ==========================================================================
  const isHomepage = window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname.endsWith('/');

  document.querySelectorAll('a[href^="#"], a[href^="/index.html#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      const hash = href.includes('#') ? href.substring(href.indexOf('#')) : '';
      
      if (hash) {
        const target = document.querySelector(hash);
        if (target && isHomepage) {
          e.preventDefault();
          
          const headerHeight = document.querySelector('.header').offsetHeight || 80;
          const targetPosition = target.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
          }

          history.pushState(null, null, hash);
        }
      }
    });
  });

  // ==========================================================================
  // SCROLL SPY (ACTIVE SECTION HIGHLIGHTING)
  // ==========================================================================
  const spySections = [
    { id: 'why-choose-us', linkId: 'nav-about' },
    { id: 'treatments', linkId: 'nav-treatments' },
    { id: 'before-after', linkId: 'nav-before-after' },
    { id: 'doctors', linkId: 'nav-doctors' },
    { id: 'testimonials', linkId: 'nav-testimonials' }
  ];

  const handleScrollSpy = () => {
    if (isHomepage) {
      let activeLinkId = '';
      const headerHeight = document.querySelector('.header').offsetHeight || 80;
      const scrollPosition = window.scrollY + headerHeight + 120; // offset buffer
      
      for (const section of spySections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            activeLinkId = section.linkId;
          }
        }
      }

      // Safeguard: Check if scrolled to the very bottom
      if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
        activeLinkId = 'nav-testimonials';
      }

      spySections.forEach(sec => {
        const link = document.getElementById(sec.linkId);
        if (link) {
          if (sec.linkId === activeLinkId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      });
    } else {
      // Subpage routing highlighting
      const pathname = window.location.pathname;
      spySections.forEach(sec => {
        const link = document.getElementById(sec.linkId);
        if (link) link.classList.remove('active');
      });

      if (pathname.includes('/doctors/')) {
        const docLink = document.getElementById('nav-doctors');
        if (docLink) docLink.classList.add('active');
      } else if (pathname.includes('/treatments/')) {
        const treatLink = document.getElementById('nav-treatments');
        if (treatLink) treatLink.classList.add('active');
      }
    }
  };

  window.addEventListener('scroll', handleScrollSpy);
  handleScrollSpy(); // Initial trigger

  // ==========================================================================
  // APPOINTMENT & CONTACT FORMS HANDLER
  // ==========================================================================
  const setupFormHandler = (formId, successBlockId) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple Validation
      let isValid = true;
      const inputs = form.querySelectorAll('.form-input[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#f43f5e'; // Highlight red
        } else {
          input.style.borderColor = ''; // Reset
        }
      });

      // Simple phone validation if present
      const phoneInput = form.querySelector('input[type="tel"]');
      if (phoneInput && phoneInput.value.trim()) {
        const phoneRegex = /^[+]?[0-9]{8,15}$/;
        if (!phoneRegex.test(phoneInput.value.trim().replace(/[-\s]/g, ''))) {
          isValid = false;
          phoneInput.style.borderColor = '#f43f5e';
          alert('Please enter a valid phone number.');
        }
      }

      // Time slot validation if present
      const timeSlotInput = form.querySelector('#bTimeSlot');
      if (timeSlotInput && timeSlotInput.value) {
        const allowedSlots = [
          "9:30 AM", "09:30 AM",
          "10:30 AM",
          "11:30 AM",
          "12:30 PM",
          "5:00 PM", "05:00 PM",
          "6:00 PM", "06:00 PM",
          "7:00 PM", "07:00 PM",
          "8:00 PM", "08:00 PM"
        ];
        if (!allowedSlots.includes(timeSlotInput.value.trim())) {
          isValid = false;
          timeSlotInput.style.borderColor = '#f43f5e';
          alert('Please select a valid time slot from the available options.');
        }
      }

      if (!isValid) return;

      // Submit Animation/Simulation
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Booking appointment...';
      }

      setTimeout(() => {
        // Success
        form.style.display = 'none';
        const successBlock = document.getElementById(successBlockId);
        if (successBlock) {
          successBlock.style.display = 'block';
        }
        
        // Save appointment submissions separately if it's the heroBookingForm
        if (formId === 'heroBookingForm') {
          const submission = {
            firstName: form.querySelector('#bFirstName') ? form.querySelector('#bFirstName').value.trim() : '',
            lastName: form.querySelector('#bLastName') ? form.querySelector('#bLastName').value.trim() : '',
            phone: form.querySelector('#bPhone') ? form.querySelector('#bPhone').value.trim() : '',
            treatment: form.querySelector('#bTreatment') ? form.querySelector('#bTreatment').value : '',
            preferredDate: form.querySelector('#bDate') ? form.querySelector('#bDate').value : '',
            timeSlot: form.querySelector('#bTimeSlot') ? form.querySelector('#bTimeSlot').value : '',
            message: form.querySelector('#bMsg') ? form.querySelector('#bMsg').value.trim() : '',
            timestamp: new Date().toISOString()
          };

          try {
            const existing = JSON.parse(localStorage.getItem('apex_appointments') || '[]');
            existing.push(submission);
            localStorage.setItem('apex_appointments', JSON.stringify(existing));
            console.log('Saved appointment submission:', submission);
          } catch (err) {
            console.error('Error saving appointment submission:', err);
          }
        }

        // Reset form
        form.reset();
        

        
        // Restore button for potential reset/future visits
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }

        // Custom action for exit popup success: save state and close after 3 seconds
        if (formId === 'exitPopupForm') {
          localStorage.setItem('apex_popup_closed_time', Date.now().toString());
          setTimeout(() => {
            const exitPopup = document.getElementById('exitIntentPopup');
            if (exitPopup) {
              exitPopup.classList.remove('active');
            }
          }, 3000);
        }
      }, 1200);
    });

    // Clear error border on input
    form.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => {
        input.style.borderColor = '';
      });
    });
  };

  const setupHeroBookingForm = () => {
    const form = document.getElementById('heroBookingForm');
    if (!form) return;

    const dateInput = form.querySelector('#bDate');
    const timeSlotInput = form.querySelector('#bTimeSlot');
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
    const errorBanner = document.getElementById('bookingFormError');

    // Set dynamic date restriction to today's date
    if (dateInput) {
      const today = new Date();
      const year = today.getFullYear();
      const month = ('0' + (today.getMonth() + 1)).slice(-2);
      const day = ('0' + today.getDate()).slice(-2);
      const todayStr = `${year}-${month}-${day}`;
      dateInput.setAttribute('min', todayStr);
      
      // Default to today's date if empty
      if (!dateInput.value) {
        dateInput.value = todayStr;
      }
    }

    // Standard list of 1-hour slots
    const allSlots = {
      "Morning Session": ["9:30 AM", "10:30 AM", "11:30 AM", "12:30 PM"],
      "Evening Session": ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"]
    };

    // Helper to rebuild time slot options omitting booked ones
    const rebuildSlotsDropdown = (booked) => {
      if (!timeSlotInput) return;
      timeSlotInput.innerHTML = '';
      
      // Add default placeholder
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.disabled = true;
      placeholder.selected = true;
      placeholder.textContent = 'Select Available Time Slot';
      timeSlotInput.appendChild(placeholder);
      
      let totalAvailable = 0;
      
      for (const [session, slots] of Object.entries(allSlots)) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = session;
        
        let groupAvailable = 0;
        slots.forEach(slot => {
          if (!booked.includes(slot)) {
            const option = document.createElement('option');
            option.value = slot;
            option.textContent = slot;
            optgroup.appendChild(option);
            groupAvailable++;
            totalAvailable++;
          }
        });
        
        if (groupAvailable > 0) {
          timeSlotInput.appendChild(optgroup);
        }
      }
      
      if (totalAvailable === 0) {
        timeSlotInput.innerHTML = '<option value="" disabled selected>No slots available for this date</option>';
      }
    };

    // Fetch booked slots and filter dropdown on date change
    const handleDateChange = () => {
      const selectedDate = dateInput.value;
      if (!selectedDate || APPOINTMENT_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
        rebuildSlotsDropdown([]);
        return;
      }

      timeSlotInput.disabled = true;
      const originalPlaceholder = timeSlotInput.querySelector('option');
      if (originalPlaceholder) {
        originalPlaceholder.textContent = 'Loading available slots...';
      }

      fetch(`${APPOINTMENT_SCRIPT_URL}?date=${selectedDate}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            rebuildSlotsDropdown(data.bookedSlots || []);
          } else {
            console.error('Apps Script GET error:', data.message);
            rebuildSlotsDropdown([]);
          }
        })
        .catch(err => {
          console.error('Fetch slots error:', err);
          rebuildSlotsDropdown([]);
        })
        .finally(() => {
          timeSlotInput.disabled = false;
        });
    };

    if (dateInput) {
      dateInput.addEventListener('change', handleDateChange);
      handleDateChange();
    }

    // Helper to display error message
    const showSubmitError = (msg) => {
      if (errorBanner) {
        errorBanner.textContent = msg;
        errorBanner.style.display = 'block';
        errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert(msg);
      }
    };

    // Form Submit Handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (errorBanner) {
        errorBanner.style.display = 'none';
        errorBanner.textContent = '';
      }

      const firstNameInput = form.querySelector('#bFirstName');
      const lastNameInput = form.querySelector('#bLastName');
      const phoneInput = form.querySelector('#bPhone');
      const emailInput = form.querySelector('#bEmail');
      const treatmentInput = form.querySelector('#bTreatment');
      const msgInput = form.querySelector('#bMsg');

      let isValid = true;
      const requiredInputs = [firstNameInput, lastNameInput, phoneInput, emailInput, treatmentInput, dateInput, timeSlotInput];
      
      requiredInputs.forEach(input => {
        if (!input || !input.value.trim()) {
          isValid = false;
          if (input) input.style.borderColor = '#f43f5e';
        } else {
          if (input) input.style.borderColor = '';
        }
      });

      if (!isValid) {
        showSubmitError('Please fill in all required fields.');
        return;
      }

      // Validate Phone number
      const cleanPhone = phoneInput.value.trim().replace(/[-\s()+]/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 12 || isNaN(cleanPhone)) {
        isValid = false;
        phoneInput.style.borderColor = '#f43f5e';
        showSubmitError('Please enter a valid 10-digit mobile number.');
        return;
      }

      // Validate Email address
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        isValid = false;
        emailInput.style.borderColor = '#f43f5e';
        showSubmitError('Please enter a valid email address.');
        return;
      }

      const fullName = `${firstNameInput.value.trim()} ${lastNameInput.value.trim()}`;
      const phone = phoneInput.value.trim();
      const email = emailInput.value.trim();
      const dateVal = dateInput.value;
      const timeVal = timeSlotInput.value;
      const serviceVal = treatmentInput.options[treatmentInput.selectedIndex].text;
      const msgVal = msgInput ? msgInput.value.trim() : '';

      if (APPOINTMENT_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
        showSubmitError('Booking system is in demo mode. Please configure the Google Apps Script Web App URL.');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';

      const formData = new URLSearchParams();
      formData.append('name', fullName);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('date', dateVal);
      formData.append('time', timeVal);
      formData.append('service', serviceVal);
      formData.append('notes', msgVal);

      fetch(APPOINTMENT_SCRIPT_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          form.style.display = 'none';
          const successBlock = document.getElementById('bookingFormSuccess');
          if (successBlock) {
            successBlock.style.display = 'block';
          }
          form.reset();
          
          try {
            const submission = {
              name: fullName,
              phone: phone,
              email: email,
              date: dateVal,
              time: timeVal,
              service: serviceVal,
              notes: msgVal,
              timestamp: new Date().toISOString()
            };
            const existing = JSON.parse(localStorage.getItem('apex_appointments') || '[]');
            existing.push(submission);
            localStorage.setItem('apex_appointments', JSON.stringify(existing));
          } catch(err) {
            console.error('Error saving backup to localStorage:', err);
          }
        } else {
          showSubmitError(data.message || 'The selected slot was taken. Please select another slot.');
        }
      })
      .catch(err => {
        console.error('Booking submission error:', err);
        showSubmitError('A network error occurred. Please check your internet connection and try again.');
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnSpinner) btnSpinner.style.display = 'none';
      });
    });

    form.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => {
        input.style.borderColor = '';
      });
    });
  };

  // Bind to forms
  setupHeroBookingForm();
  setupFormHandler('contactForm', 'contactFormSuccess');
  setupFormHandler('exitPopupForm', 'exitFormSuccess');
  setupFormHandler('treatmentForm', 'treatmentFormSuccess');
  setupFormHandler('doctorForm', 'doctorFormSuccess');

  // ==========================================================================
  // EXIT INTENT & ENGAGEMENT POPUP SYSTEM
  // ==========================================================================
  const exitPopup = document.getElementById('exitIntentPopup');
  const closePopupBtn = document.getElementById('exitPopupCloseBtn');

  if (exitPopup) {
    const POPUP_CLOSED_KEY = 'apex_popup_closed_time';
    const SUPPRESS_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    const isSuppressed = () => {
      const closedTime = localStorage.getItem(POPUP_CLOSED_KEY);
      if (!closedTime) return false;
      return (Date.now() - parseInt(closedTime, 10)) < SUPPRESS_DURATION;
    };

    let popupShown = false;
    let timerId = null;

    const showPopup = () => {
      if (popupShown || isSuppressed()) return;

      popupShown = true;
      exitPopup.classList.add('active');

      // Clean up triggers since popup is now displayed
      cleanupTriggers();
    };

    const closePopup = () => {
      exitPopup.classList.remove('active');
      localStorage.setItem(POPUP_CLOSED_KEY, Date.now().toString());
      cleanupTriggers();
    };

    const cleanupTriggers = () => {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      document.removeEventListener('mouseleave', handleExitIntent);
      window.removeEventListener('scroll', handleScrollTrigger);
    };

    // Trigger 1: 20 Seconds Timer
    if (!isSuppressed()) {
      timerId = setTimeout(() => {
        showPopup();
      }, 20000); // 20 seconds
    }

    // Trigger 2: Exit Intent (Desktop mouseleave)
    function handleExitIntent(e) {
      // Check if mouse leaves top of viewport
      if (e.clientY < 20) {
        showPopup();
      }
    }
    if (!isSuppressed()) {
      document.addEventListener('mouseleave', handleExitIntent);
    }

    // Trigger 3: Scroll 60%
    function handleScrollTrigger() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const docHeight = scrollHeight - clientHeight;

      if (docHeight > 0 && (scrollTop / docHeight) >= 0.60) {
        showPopup();
      }
    }
    if (!isSuppressed()) {
      window.addEventListener('scroll', handleScrollTrigger);
    }

    // Close button click
    if (closePopupBtn) {
      closePopupBtn.addEventListener('click', closePopup);
    }

    // Close on overlay background click
    exitPopup.addEventListener('click', (e) => {
      if (e.target === exitPopup) {
        closePopup();
      }
    });
  }

  // ==========================================================================
  // TESTIMONIALS CAROUSEL
  // ==========================================================================
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('carouselIndicators');

  if (track) {
    const slides = Array.from(track.children);
    let slideCount = slides.length;
    let index = 0;
    let slidesPerView = getSlidesPerView();
    let maxIndex = Math.max(0, slideCount - slidesPerView);
    let dots = [];

    function getSlidesPerView() {
      const width = window.innerWidth;
      if (width > 1024) return 3;
      return 2; // Desktop is 3, Tablet and Mobile are 2
    }

    function createIndicators() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      dots = [];
      slidesPerView = getSlidesPerView();
      maxIndex = Math.max(0, slideCount - slidesPerView);

      // Create dots only for possible positions
      const dotsToCreate = maxIndex + 1;
      if (dotsToCreate <= 1) return; // No need for dots if all slides visible

      for (let i = 0; i < dotsToCreate; i++) {
        const dot = document.createElement('button');
        dot.classList.add('indicator-dot');
        if (i === index) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide position ${i + 1}`);
        dotsContainer.appendChild(dot);
        dots.push(dot);

        dot.addEventListener('click', () => {
          goToIndex(i);
        });
      }
    }

    function goToIndex(newIndex) {
      index = Math.min(Math.max(0, newIndex), maxIndex);
      
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseInt(window.getComputedStyle(track).gap) || 24;
      const amountToMove = index * (slideWidth + gap);
      
      track.style.transform = `translateX(-${amountToMove}px)`;
      
      // Update dots
      dots.forEach((dot, idx) => {
        if (idx === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // Initialize
    createIndicators();
    
    // Auto play every 5 seconds
    let autoPlayInterval = setInterval(() => {
      if (maxIndex > 0) {
        let nextIndex = index + 1;
        if (nextIndex > maxIndex) nextIndex = 0;
        goToIndex(nextIndex);
      }
    }, 5000);

    // Pause autoplay on hover/interaction
    const container = track.closest('.testimonials-carousel-wrapper');
    if (container) {
      container.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
      container.addEventListener('mouseleave', () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
          if (maxIndex > 0) {
            let nextIndex = index + 1;
            if (nextIndex > maxIndex) nextIndex = 0;
            goToIndex(nextIndex);
          }
        }, 5000);
      });
    }

    // Handle Window Resize
    window.addEventListener('resize', () => {
      slidesPerView = getSlidesPerView();
      const oldMax = maxIndex;
      maxIndex = Math.max(0, slideCount - slidesPerView);
      
      if (index > maxIndex) index = maxIndex;
      
      if (oldMax !== maxIndex) {
        createIndicators();
      }
      goToIndex(index);
    });
  }

  // ==========================================================================
  // LAZY LOADING IMAGES
  // ==========================================================================
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          // Trigger browser load
          imageObserver.unobserve(image);
        }
      });
    });
    lazyImages.forEach(image => imageObserver.observe(image));
  }

  // ==========================================================================
  // TECHNOLOGY CARD INTERACTIVE MODAL HANDLER
  // ==========================================================================
  const techModal = document.getElementById('techInfoModal');
  const techModalClose = document.getElementById('techModalCloseBtn');

  // Handle technology card clicks to open the modal
  document.addEventListener('click', (e) => {
    const techCard = e.target.closest('.tech-card');
    if (techCard) {
      e.preventDefault();
      
      const techModalImg = document.getElementById('techModalImg');
      const techModalTitle = document.getElementById('techModalTitle');
      const techModalDesc = document.getElementById('techModalDesc');
      
      if (techModal) {
        const img = techCard.querySelector('.tech-card-img').src;
        const title = techCard.querySelector('.tech-card-title').textContent;
        const desc = techCard.querySelector('.tech-card-desc').textContent;
        
        // Grab the benefits HTML to render inside the modal as well
        const benefitsContainer = techCard.querySelector('.tech-card-benefits');
        const benefitsHTML = benefitsContainer ? benefitsContainer.outerHTML : '';
        
        if (techModalImg) techModalImg.src = img;
        if (techModalTitle) techModalTitle.textContent = title;
        if (techModalDesc) {
          // Set both the description text and the key benefits lists
          techModalDesc.innerHTML = `
            <p style="margin-bottom: 1.5rem; line-height: 1.6; color: var(--color-text-main);">${desc}</p>
            ${benefitsHTML}
          `;
        }
        
        techModal.classList.add('active');
      }
    }
  });

  // Keep modal close handlers
  if (techModal) {
    if (techModalClose) {
      techModalClose.addEventListener('click', () => {
        techModal.classList.remove('active');
      });
    }

    techModal.addEventListener('click', (e) => {
      if (e.target === techModal) {
        techModal.classList.remove('active');
      }
    });
  }

  // ==========================================================================
  // TESTIMONIALS MODAL POPUP HANDLER
  // ==========================================================================
  const testimonialModal = document.getElementById('testimonialDetailModal');
  const testimonialModalClose = document.getElementById('testimonialModalCloseBtn');
  const modalAvatar = document.getElementById('modalReviewerAvatar');
  const modalName = document.getElementById('modalReviewerName');
  const modalDate = document.getElementById('modalReviewerDate');
  const modalStars = document.getElementById('modalReviewerStars');
  const modalFullText = document.getElementById('modalFullText');

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.read-more-trigger');
    if (trigger) {
      e.preventDefault();
      
      const fullText = trigger.getAttribute('data-full-text');
      const name = trigger.getAttribute('data-name');
      const date = trigger.getAttribute('data-date');
      const avatar = trigger.getAttribute('data-avatar');
      const colorClass = trigger.getAttribute('data-color-class');
      
      if (testimonialModal) {
        if (modalFullText) modalFullText.textContent = fullText;
        if (modalName) modalName.textContent = name;
        if (modalDate) modalDate.textContent = date;
        if (modalAvatar) {
          modalAvatar.textContent = avatar;
          modalAvatar.className = 'testimonial-avatar ' + colorClass;
        }
        if (modalStars) {
          modalStars.textContent = '★★★★★';
        }
        
        testimonialModal.classList.add('active');
        document.body.classList.add('modal-open');
      }
    }
  });

  function closeTestimonialModal() {
    if (testimonialModal) {
      testimonialModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  }

  if (testimonialModalClose) {
    testimonialModalClose.addEventListener('click', closeTestimonialModal);
  }

  if (testimonialModal) {
    testimonialModal.addEventListener('click', (e) => {
      if (e.target === testimonialModal) {
        closeTestimonialModal();
      }
    });
  }

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && testimonialModal && testimonialModal.classList.contains('active')) {
      closeTestimonialModal();
    }
  });

  // ==========================================================================
  // TIMELINE SCROLL ANIMATION (INTERSECTION OBSERVER)
  // ==========================================================================
  const timeline = document.querySelector('.journey-timeline');
  if (timeline && 'IntersectionObserver' in window) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timeline.classList.add('active');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2, // Trigger when 20% of the timeline is in view
      rootMargin: '0px 0px -50px 0px'
    });
    timelineObserver.observe(timeline);
  }

  // ==========================================================================
  // TREATMENT PROCEDURE VIDEO PLAYER & PLAYLIST
  // ==========================================================================
  const initializeProcedureVideo = () => {
    const videoCard = document.querySelector('.procedure-video-card');
    if (!videoCard) return;

    const video = videoCard.querySelector('#procedureVideo');
    const playBtn = videoCard.querySelector('#videoPlayOverlayBtn');
    const source = videoCard.querySelector('#videoSource');
    
    // Play overlay toggle
    if (video && playBtn) {
      playBtn.addEventListener('click', () => {
        playBtn.style.display = 'none';
        video.setAttribute('controls', 'true');
        video.play();
      });
      
      video.addEventListener('pause', () => {
        playBtn.style.display = 'flex';
        video.removeAttribute('controls');
      });
      
      video.addEventListener('ended', () => {
        playBtn.style.display = 'flex';
        video.removeAttribute('controls');
      });
    }

    // Playlist/Carousel Logic
    const videosData = videoCard.getAttribute('data-videos');
    if (!videosData) return;

    try {
      const videos = JSON.parse(videosData);
      if (videos.length <= 1) return; // Only show playlist bar if multiple videos

      // Create playlist control elements dynamically
      const playlistBar = document.createElement('div');
      playlistBar.className = 'video-playlist-bar';

      const prevBtn = document.createElement('button');
      prevBtn.className = 'playlist-nav-btn';
      prevBtn.id = 'playlistPrevBtn';
      prevBtn.innerHTML = '&larr; Prev';
      prevBtn.disabled = true;

      const infoSpan = document.createElement('span');
      infoSpan.className = 'playlist-info';
      infoSpan.id = 'playlistInfoText';

      const nextBtn = document.createElement('button');
      nextBtn.className = 'playlist-nav-btn';
      nextBtn.id = 'playlistNextBtn';
      nextBtn.innerHTML = 'Next &rarr;';

      playlistBar.appendChild(prevBtn);
      playlistBar.appendChild(infoSpan);
      playlistBar.appendChild(nextBtn);

      // Append playlist bar below video player wrapper
      const playerWrapper = videoCard.querySelector('.video-player-wrapper');
      if (playerWrapper) {
        playerWrapper.parentNode.insertBefore(playlistBar, playerWrapper.nextSibling);
      }

      let currentVideoIdx = 0;

      // Titles for parts (Braces/Aligners, Crowns/Bridges)
      const getPartTitle = (idx, path) => {
        const lowerPath = path.toLowerCase();
        if (lowerPath.includes('aligners')) return 'Clear Aligners Demo';
        if (lowerPath.includes('braces')) return 'Traditional Braces Demo';
        if (lowerPath.includes('crowns')) return 'Dental Crowns Procedure';
        if (lowerPath.includes('bridge')) return 'Dental Bridge Procedure';
        return `Procedure Part ${idx + 1}`;
      };

      const updateVideo = (idx) => {
        currentVideoIdx = idx;
        
        // Update navigation buttons status
        prevBtn.disabled = currentVideoIdx === 0;
        nextBtn.disabled = currentVideoIdx === videos.length - 1;
        
        // Update indicator text
        const titleText = getPartTitle(currentVideoIdx, videos[currentVideoIdx]);
        infoSpan.innerText = `${titleText} (Part ${currentVideoIdx + 1}/${videos.length})`;
        
        // Load new video source
        video.pause();
        playBtn.style.display = 'flex';
        video.removeAttribute('controls');
        source.setAttribute('src', videos[currentVideoIdx]);
        video.load();
      };

      // Set initial state title
      infoSpan.innerText = `${getPartTitle(0, videos[0])} (Part 1/${videos.length})`;

      prevBtn.addEventListener('click', () => {
        if (currentVideoIdx > 0) {
          updateVideo(currentVideoIdx - 1);
        }
      });

      nextBtn.addEventListener('click', () => {
        if (currentVideoIdx < videos.length - 1) {
          updateVideo(currentVideoIdx + 1);
        }
      });

    } catch (e) {
      console.error('Error parsing video playlist data:', e);
    }
  };

  initializeProcedureVideo();

  // ==========================================================================
  // TREATMENT DETAIL PAGE MODAL POPUP
  // ==========================================================================
  const bookingBtns = document.querySelectorAll('.btn-hero-booking');
  const tModal = document.getElementById('treatmentModal');
  const tModalClose = document.getElementById('tModalCloseBtn');
  const tModalCancel = document.getElementById('tModalCancelBtn');
  const tModalForm = document.getElementById('tModalForm');
  const tModalSuccess = document.getElementById('tModalSuccess');
  
  if (tModal) {
    // Open modal
    bookingBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Prevent default redirect behavior
        e.preventDefault();
        
        // Auto-select current treatment from data attribute
        const treatmentSelect = document.getElementById('tModalTreatment');
        if (treatmentSelect) {
          const currentTreatment = treatmentSelect.getAttribute('data-current-treatment');
          if (currentTreatment) {
            treatmentSelect.value = currentTreatment;
          }
        }
        
        // Dynamically set minimum date to today
        const dateInput = document.getElementById('tModalDate');
        if (dateInput) {
          const today = new Date().toISOString().split('T')[0];
          dateInput.setAttribute('min', today);
        }
        
        tModal.classList.add('active');
        document.body.classList.add('modal-open');
      });
    });

    // Close modal helper
    const closeTModal = () => {
      tModal.classList.remove('active');
      document.body.classList.remove('modal-open');
      
      // Reset form status after modal animations finish
      setTimeout(() => {
        if (tModalForm) {
          tModalForm.style.display = 'grid';
          tModalForm.reset();
        }
        if (tModalSuccess) {
          tModalSuccess.style.display = 'none';
        }
      }, 400);
    };

    // Close on Close (X) button click
    if (tModalClose) {
      tModalClose.addEventListener('click', closeTModal);
    }

    // Close on Cancel button click
    if (tModalCancel) {
      tModalCancel.addEventListener('click', closeTModal);
    }

    // Close on overlay background click
    tModal.addEventListener('click', (e) => {
      if (e.target === tModal) {
        closeTModal();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && tModal.classList.contains('active')) {
        closeTModal();
      }
    });

    // Form submit simulation
    if (tModalForm) {
      tModalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Custom simple validation
        let isValid = true;
        const requiredInputs = tModalForm.querySelectorAll('.form-input[required]');
        requiredInputs.forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#f43f5e';
          } else {
            input.style.borderColor = '';
          }
        });

        // Phone number validation
        const phoneInput = document.getElementById('tModalPhone');
        if (phoneInput && phoneInput.value.trim()) {
          const phoneRegex = /^[+]?[0-9]{8,15}$/;
          if (!phoneRegex.test(phoneInput.value.trim().replace(/[-\s]/g, ''))) {
            isValid = false;
            phoneInput.style.borderColor = '#f43f5e';
            alert('Please enter a valid phone number.');
          }
        }

        if (!isValid) return;

        // Submit animation/simulation
        const submitBtn = document.getElementById('tModalSubmitBtn');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Booking Consultation...';
        }

        // Save appointment lead to local storage
        const submission = {
          fullName: document.getElementById('tModalName') ? document.getElementById('tModalName').value.trim() : '',
          phone: document.getElementById('tModalPhone') ? document.getElementById('tModalPhone').value.trim() : '',
          treatment: document.getElementById('tModalTreatment') ? document.getElementById('tModalTreatment').value : '',
          preferredDate: document.getElementById('tModalDate') ? document.getElementById('tModalDate').value : '',
          message: document.getElementById('tModalMessage') ? document.getElementById('tModalMessage').value.trim() : '',
          timestamp: new Date().toISOString()
        };

        setTimeout(() => {
          try {
            const existing = JSON.parse(localStorage.getItem('apex_appointments') || '[]');
            existing.push(submission);
            localStorage.setItem('apex_appointments', JSON.stringify(existing));
            console.log('Saved treatment modal booking:', submission);
          } catch (err) {
            console.error('Error saving modal booking:', err);
          }

          // Show success state
          tModalForm.style.display = 'none';
          if (tModalSuccess) {
            tModalSuccess.style.display = 'block';
          }

          // Auto-close modal after 2.5 seconds
          setTimeout(() => {
            closeTModal();
          }, 2500);

          // Restore button
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
        }, 1200);
      });

      // Reset error borders on input
      tModalForm.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('input', () => {
          input.style.borderColor = '';
        });
      });
    }
  }

  // ==========================================================================
  // WHY CHOOSE APEX DENTAL - FEATURE SLIDER/CAROUSEL (INFINITE LOOP)
  // ==========================================================================
  const whySliderTrack = document.getElementById('whySliderTrack');
  if (whySliderTrack) {
    const whyOriginalSlides = Array.from(whySliderTrack.children);
    const whyOriginalCount = whyOriginalSlides.length;
    
    if (whyOriginalCount > 1) {
      const whyPrevBtn = document.getElementById('whyPrevBtn');
      const whyNextBtn = document.getElementById('whyNextBtn');
      const whyDotsContainer = document.getElementById('whySliderDots');
      const whySliderWrapper = document.getElementById('whySliderWrapper');

      // Create cloned slides for infinite circular loop
      const firstClone = whyOriginalSlides[0].cloneNode(true);
      const lastClone = whyOriginalSlides[whyOriginalCount - 1].cloneNode(true);
      
      firstClone.classList.add('why-slide-clone');
      lastClone.classList.add('why-slide-clone');
      
      whySliderTrack.insertBefore(lastClone, whySliderTrack.firstChild);
      whySliderTrack.appendChild(firstClone);

      const whyAllSlides = Array.from(whySliderTrack.children);
      let whyCurrentIndex = 1; // Start at first original slide
      let whyAutoplayTimer = null;
      let whyIsTransitioning = false;
      let whyIsHovered = false;

      // Create dots based on original slides count
      if (whyDotsContainer) {
        whyDotsContainer.innerHTML = '';
        for (let i = 0; i < whyOriginalCount; i++) {
          const dot = document.createElement('button');
          dot.className = `why-dot ${i === 0 ? 'active' : ''}`;
          dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
          whyDotsContainer.appendChild(dot);
          dot.addEventListener('click', () => {
            if (whyIsTransitioning) return;
            whyGoToSlide(i + 1);
          });
        }
      }

      const whyUpdateSlider = (animate = true) => {
        if (animate) {
          whyIsTransitioning = true;
          whySliderTrack.style.transition = 'transform 1000ms cubic-bezier(0.42, 0, 0.58, 1)';
        } else {
          whySliderTrack.style.transition = 'none';
          whySliderTrack.offsetHeight; // Force reflow
        }

        const translateAmount = whyCurrentIndex * 100;
        whySliderTrack.style.transform = `translate3d(-${translateAmount}%, 0, 0)`;

        // Active slide opacity class
        whyAllSlides.forEach((slide, idx) => {
          if (idx === whyCurrentIndex) {
            slide.classList.add('active');
          } else {
            slide.classList.remove('active');
          }
        });

        // Update dots active state based on active original index
        let activeOriginalIndex = whyCurrentIndex - 1;
        if (activeOriginalIndex < 0) {
          activeOriginalIndex = whyOriginalCount - 1;
        } else if (activeOriginalIndex >= whyOriginalCount) {
          activeOriginalIndex = 0;
        }

        if (whyDotsContainer) {
          const dots = whyDotsContainer.querySelectorAll('.why-dot');
          dots.forEach((dot, idx) => {
            if (idx === activeOriginalIndex) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          });
        }
      };

      const whyGoToSlide = (newIndex) => {
        whyCurrentIndex = newIndex;
        whyUpdateSlider(true);
        whyResetAutoplay();
      };

      const whyNextSlide = () => {
        if (whyIsTransitioning) return;
        whyCurrentIndex++;
        whyUpdateSlider(true);
      };

      const whyPrevSlide = () => {
        if (whyIsTransitioning) return;
        whyCurrentIndex--;
        whyUpdateSlider(true);
      };

      // Transition End Listener to perform seamless jumps
      whySliderTrack.addEventListener('transitionend', (e) => {
        if (e.target !== whySliderTrack) return; // Ignore bubbling events from children
        whyIsTransitioning = false;
        if (whyCurrentIndex === 0) {
          whyCurrentIndex = whyOriginalCount;
          whyUpdateSlider(false);
        } else if (whyCurrentIndex === whyOriginalCount + 1) {
          whyCurrentIndex = 1;
          whyUpdateSlider(false);
        }
      });

      // Bind navigation buttons
      if (whyPrevBtn) {
        whyPrevBtn.addEventListener('click', () => {
          if (whyIsTransitioning) return;
          whyPrevSlide();
          whyResetAutoplay();
        });
      }

      if (whyNextBtn) {
        whyNextBtn.addEventListener('click', () => {
          if (whyIsTransitioning) return;
          whyNextSlide();
          whyResetAutoplay();
        });
      }

      // Autoplay Mechanics (7 seconds interval)
      const whyStartAutoplay = () => {
        if (whyAutoplayTimer) return;
        whyAutoplayTimer = setInterval(whyNextSlide, 7000);
      };

      const whyStopAutoplay = () => {
        if (whyAutoplayTimer) {
          clearInterval(whyAutoplayTimer);
          whyAutoplayTimer = null;
        }
      };

      const whyResetAutoplay = () => {
        whyStopAutoplay();
        if (!whyIsHovered) {
          whyStartAutoplay();
        }
      };

      // Pause on Hover
      const sliderContainer = document.querySelector('.why-slider-container');
      if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
          whyIsHovered = true;
          whyStopAutoplay();
        });
        sliderContainer.addEventListener('mouseleave', () => {
          whyIsHovered = false;
          whyStartAutoplay();
        });
      }

      // Swipe Gestures for Mobile
      let touchStartX = 0;
      let touchEndX = 0;
      let isSwiping = false;

      if (whySliderWrapper) {
        whySliderWrapper.addEventListener('touchstart', (e) => {
          if (whyIsTransitioning) return;
          touchStartX = e.touches[0].clientX;
          isSwiping = true;
          whyStopAutoplay();
        }, { passive: true });

        whySliderWrapper.addEventListener('touchmove', (e) => {
          if (!isSwiping) return;
          touchEndX = e.touches[0].clientX;
        }, { passive: true });

        whySliderWrapper.addEventListener('touchend', () => {
          if (!isSwiping) return;
          isSwiping = false;
          
          const swipeDistance = touchStartX - touchEndX;
          const swipeThreshold = 55; // pixels

          if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
              // Swiped Left -> Next Slide
              whyNextSlide();
            } else {
              // Swiped Right -> Prev Slide
              whyPrevSlide();
            }
          }
          if (!whyIsHovered) {
            whyStartAutoplay();
          }
        });
      }

      // Initialize initial state without animation
      whyUpdateSlider(false);
      whyStartAutoplay();
    }
  }

  // ==========================================================================
  // FAQ ACCORDION LOGIC
  // ==========================================================================
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  if (faqQuestions.length > 0) {
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const item = question.parentElement;
        const answer = question.nextElementSibling;
        const isActive = item.classList.contains('active');
        
        // Close all other FAQs for clean accordion behavior
        document.querySelectorAll('.faq-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) {
              otherAnswer.style.maxHeight = null;
            }
          }
        });
        
        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }
  // ==========================================================================
  // RECENT BLOGS EXPAND/COLLAPSE LOGIC
  // ==========================================================================
  const readAllBtn = document.querySelector('#blog .btn-secondary');
  const blogsGrid = document.querySelector('#blog .blogs-grid');
  
  if (readAllBtn && blogsGrid) {
    readAllBtn.addEventListener('click', (e) => {
      if (window.innerWidth > 768) {
        e.preventDefault();
        blogsGrid.classList.toggle('expanded');
        if (blogsGrid.classList.contains('expanded')) {
          readAllBtn.innerHTML = 'Read Less Articles &uarr;';
        } else {
          readAllBtn.innerHTML = 'Read All Articles &rarr;';
        }
      }
    });
  }

});

// ==========================================================================
// PRELOADER PAGE FADE-OUT
// ==========================================================================
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
  }
});

// Safety fallback: if page assets take too long, force fadeout after 2 seconds
setTimeout(() => {
  const preloader = document.getElementById('preloader');
  if (preloader && !preloader.classList.contains('fade-out')) {
    preloader.classList.add('fade-out');
  }
}, 2000);

