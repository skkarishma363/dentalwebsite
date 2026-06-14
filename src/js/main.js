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

      // Clear error borders
      form.querySelectorAll('.form-input').forEach(input => {
        input.style.borderColor = '';
      });

      // Simple Validation
      let isValid = true;
      const inputs = form.querySelectorAll('.form-input[required], input[required], select[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#f43f5e'; // Highlight red
        }
      });

      // Simple phone validation if present
      const phoneInput = form.querySelector('input[type="tel"]');
      if (phoneInput && phoneInput.value.trim()) {
        const cleanPhone = phoneInput.value.trim().replace(/[-\s()+]/g, '');
        if (cleanPhone.length < 8 || cleanPhone.length > 15 || isNaN(cleanPhone)) {
          isValid = false;
          phoneInput.style.borderColor = '#f43f5e';
          alert('Please enter a valid phone number.');
          return;
        }
      }

      // Simple email validation if present
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          isValid = false;
          emailInput.style.borderColor = '#f43f5e';
          alert('Please enter a valid email address.');
          return;
        }
      }

      if (!isValid) return;

      // Submit Animation/Loading State
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
      }

      // Dynamically extract values or supply fallbacks
      const nameInput = form.querySelector('#cName, #blogName, #exitName, #docPatName, #tModalName') || form.querySelector('input[placeholder*="Name"], input[type="text"]');
      const nameVal = nameInput ? nameInput.value.trim() : 'Anonymous';
      
      const phoneVal = phoneInput ? phoneInput.value.trim() : 'N/A';
      
      const emailVal = emailInput ? emailInput.value.trim() : 'N/A';
      
      const dateInput = form.querySelector('#tModalDate') || form.querySelector('input[type="date"]');
      const dateVal = dateInput ? dateInput.value : 'N/A';
      
      const timeVal = 'Callback Requested'; // All non-hero forms request a callback

      // Service resolution
      let serviceVal = 'General Consultation';
      const treatmentSelect = form.querySelector('#exitTreatment, #tModalTreatment') || form.querySelector('select');
      if (treatmentSelect) {
        if (treatmentSelect.selectedIndex >= 0) {
          serviceVal = treatmentSelect.options[treatmentSelect.selectedIndex].text;
        }
      } else if (formId === 'doctorForm') {
        const docName = document.querySelector('.doctor-title')?.textContent.trim() || 'Doctor';
        serviceVal = `Doctor Consultation (${docName})`;
      } else if (formId === 'contactForm') {
        serviceVal = 'Contact Inquiry';
      }

      // Notes resolution
      let notesVal = '';
      const messageTextarea = form.querySelector('#cMsg, #tModalMessage') || form.querySelector('textarea');
      if (messageTextarea) {
        notesVal = messageTextarea.value.trim();
      } else if (formId === 'exitPopupForm') {
        notesVal = 'Exit intent / mobile engagement popup submission.';
      } else if (formId === 'doctorForm') {
        const docName = document.querySelector('.doctor-title')?.textContent.trim() || 'Doctor';
        notesVal = `Callback request for specialist: ${docName}`;
      } else {
        notesVal = `Submitted via form: ${formId}`;
      }

      if (APPOINTMENT_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
        alert('Booking system is in demo mode. Please configure the Google Apps Script Web App URL.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
        return;
      }

      const formData = new URLSearchParams();
      formData.append('name', nameVal);
      formData.append('phone', phoneVal);
      formData.append('email', emailVal);
      formData.append('date', dateVal);
      formData.append('time', timeVal);
      formData.append('service', serviceVal);
      formData.append('notes', notesVal);

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
          // Success
          form.style.display = 'none';
          const successBlock = document.getElementById(successBlockId);
          if (successBlock) {
            successBlock.style.display = 'block';
          }
          
          form.reset();

          // Save backup submission to localStorage
          try {
            const submission = {
              name: nameVal,
              phone: phoneVal,
              email: emailVal,
              date: dateVal,
              time: timeVal,
              service: serviceVal,
              notes: notesVal,
              timestamp: new Date().toISOString()
            };
            const existing = JSON.parse(localStorage.getItem('apex_appointments') || '[]');
            existing.push(submission);
            localStorage.setItem('apex_appointments', JSON.stringify(existing));
          } catch (err) {
            console.error('Error saving local storage backup:', err);
          }

          // Custom post-success actions (e.g. exit popup close)
          if (formId === 'exitPopupForm') {
            localStorage.setItem('apex_popup_closed_time', Date.now().toString());
            setTimeout(() => {
              const closeBtn = document.getElementById('exitPopupCloseBtn');
              if (closeBtn) closeBtn.click();
            }, 3000);
          } else if (formId === 'tModalForm') {
            setTimeout(() => {
              const closeBtn = document.getElementById('tModalCloseBtn');
              if (closeBtn) closeBtn.click();
            }, 2500);
          }
        } else {
          alert(data.message || 'There was an error submitting your request. Please try again.');
        }
      })
      .catch(err => {
        console.error('Form submission error:', err);
        alert('A network error occurred. Please check your internet connection and try again.');
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      });
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

    // SEGMENTED TOGGLE SWITCH LOGIC
    const toggleContainer = document.getElementById('bookingToggleContainer');
    const btnConsultation = document.getElementById('btnModeConsultation');
    const btnTreatment = document.getElementById('btnModeTreatment');
    const treatmentWrapper = document.getElementById('treatmentCollapseWrapper');
    const treatmentSelect = form.querySelector('#bTreatment');
    
    let activeMode = 'Consultation'; // Default mode

    // Initialize default value for Consultation mode
    if (treatmentSelect) {
      treatmentSelect.value = 'General Consultation';
    }

    const setBookingMode = (mode) => {
      activeMode = mode;
      
      if (mode === 'Consultation') {
        if (btnConsultation) btnConsultation.classList.add('active');
        if (btnTreatment) btnTreatment.classList.remove('active');
        if (toggleContainer) toggleContainer.classList.remove('treatment-active');
        
        if (treatmentWrapper) {
          treatmentWrapper.classList.add('collapsed');
        }
        
        if (treatmentSelect) {
          treatmentSelect.value = 'General Consultation';
          treatmentSelect.style.borderColor = '';
        }
      } else {
        if (btnConsultation) btnConsultation.classList.remove('active');
        if (btnTreatment) btnTreatment.classList.add('active');
        if (toggleContainer) toggleContainer.classList.add('treatment-active');
        
        if (treatmentWrapper) {
          treatmentWrapper.style.display = 'block';
          treatmentWrapper.offsetHeight; // force reflow
          treatmentWrapper.classList.remove('collapsed');
        }
        
        if (treatmentSelect) {
          treatmentSelect.value = '';
          treatmentSelect.style.borderColor = '';
        }
      }
    };

    if (treatmentWrapper) {
      treatmentWrapper.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'max-height') {
          if (treatmentWrapper.classList.contains('collapsed')) {
            treatmentWrapper.style.display = 'none';
          }
        }
      });
    }

    if (btnConsultation) {
      btnConsultation.addEventListener('click', () => setBookingMode('Consultation'));
    }
    if (btnTreatment) {
      btnTreatment.addEventListener('click', () => setBookingMode('Selected Treatment'));
    }

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
      formData.append('bookingMode', activeMode);

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
          setBookingMode('Consultation');
          
          try {
            const submission = {
              name: fullName,
              phone: phone,
              email: email,
              date: dateVal,
              time: timeVal,
              service: serviceVal,
              notes: msgVal,
              bookingMode: activeMode,
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
  setupFormHandler('tModalForm', 'tModalSuccess');
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
  // ==========================================================================
  // TESTIMONIALS & BLOGS RESPONSIVE CAROUSELS (MOBILE CAROUSELS)
  // ==========================================================================

  let activeTestimonialCarousel = null;
  let activeBlogCarousel = null;
  let desktopTestimonialInterval = null;

  // Reusable, touch-enabled infinite loop carousel initializer helper
  const initMobileCarousel = (containerSelector, trackSelector, cardSelector, autoPlayDelay = 5500) => {
    const container = document.querySelector(containerSelector);
    if (!container) return null;
    const track = container.querySelector(trackSelector);
    if (!track) return null;

    // Get original cards
    let cards = Array.from(track.querySelectorAll(cardSelector));
    if (cards.length === 0) return null;

    // Remove any existing clones
    track.querySelectorAll('.carousel-clone').forEach(el => el.remove());
    
    // Refresh cards list
    cards = Array.from(track.querySelectorAll(cardSelector));
    const cardCount = cards.length;

    // Clone first and last
    const firstClone = cards[0].cloneNode(true);
    firstClone.classList.add('carousel-clone');
    const lastClone = cards[cardCount - 1].cloneNode(true);
    lastClone.classList.add('carousel-clone');

    // Append and prepend clones
    track.appendChild(firstClone);
    track.insertBefore(lastClone, cards[0]);

    let currentIndex = 1; // Start at first real slide
    let isTransitioning = false;
    let autoPlayInterval = null;

    const setPosition = (index, transition = true) => {
      if (transition) {
        track.style.transition = 'transform 0.4s ease-in-out';
      } else {
        track.style.transition = 'none';
      }
      track.style.transform = `translateX(-${index * 100}%)`;
      currentIndex = index;
    };

    // Initial position
    setPosition(currentIndex, false);

    // Transition end wrapper wrap-around logic
    const handleTransitionEnd = () => {
      isTransitioning = false;
      if (currentIndex === 0) {
        // Jump to last real slide
        setPosition(cardCount, false);
      } else if (currentIndex === cardCount + 1) {
        // Jump to first real slide
        setPosition(1, false);
      }
      updateDots();
    };
    track.addEventListener('transitionend', handleTransitionEnd);

    const nextSlide = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      setPosition(currentIndex + 1);
    };

    const prevSlide = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      setPosition(currentIndex - 1);
    };

    // Autoplay logic
    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    };

    const stopAutoPlay = () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    };

    startAutoPlay();

    // Swipe Event Listeners
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;

    const handleTouchStart = (e) => {
      stopAutoPlay();
      startX = e.touches[0].clientX;
      isSwiping = true;
      track.style.transition = 'none';
    };

    const handleTouchMove = (e) => {
      if (!isSwiping) return;
      currentX = e.touches[0].clientX;
      const diffX = currentX - startX;
      
      const baseTranslate = -currentIndex * 100;
      const containerWidth = container.offsetWidth || 1;
      const dragTranslate = (diffX / containerWidth) * 100;
      
      track.style.transform = `translateX(${baseTranslate + dragTranslate}%)`;
    };

    const handleTouchEnd = () => {
      if (!isSwiping) return;
      isSwiping = false;
      const diffX = currentX - startX;
      const threshold = 50;
      
      if (Math.abs(diffX) > threshold) {
        if (diffX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      } else {
        setPosition(currentIndex);
      }
      startAutoPlay();
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Indicators / Dots
    const dotsWrapper = container.querySelector('.carousel-indicators, .blog-carousel-indicators');
    let dots = [];
    if (dotsWrapper) {
      dotsWrapper.innerHTML = '';
      for (let i = 0; i < cardCount; i++) {
        const dot = document.createElement('button');
        dot.classList.add('indicator-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dotsWrapper.appendChild(dot);
        dots.push(dot);

        dot.addEventListener('click', () => {
          stopAutoPlay();
          setPosition(i + 1);
          startAutoPlay();
        });
      }
    }

    const updateDots = () => {
      if (dots.length === 0) return;
      let activeIdx = currentIndex - 1;
      if (activeIdx < 0) activeIdx = cardCount - 1;
      if (activeIdx >= cardCount) activeIdx = 0;
      
      dots.forEach((dot, idx) => {
        if (idx === activeIdx) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    return {
      destroy: () => {
        stopAutoPlay();
        track.removeEventListener('transitionend', handleTransitionEnd);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
        track.querySelectorAll('.carousel-clone').forEach(el => el.remove());
        track.style.transform = '';
        track.style.transition = '';
        if (dotsWrapper) dotsWrapper.innerHTML = '';
      }
    };
  };

  // Desktop Testimonials Logic
  const setupDesktopTestimonials = () => {
    const track = document.getElementById('testimonialsTrack');
    const dotsContainer = document.getElementById('carouselIndicators');
    if (!track) return;
    
    // Clear any existing autoplay interval
    if (desktopTestimonialInterval) {
      clearInterval(desktopTestimonialInterval);
    }
    
    const slides = Array.from(track.children);
    let slideCount = slides.length;
    let index = 0;
    
    const getSlidesPerView = () => {
      const width = window.innerWidth;
      if (width > 1024) return 3;
      return 2;
    };

    let slidesPerView = getSlidesPerView();
    let maxIndex = Math.max(0, slideCount - slidesPerView);
    let dots = [];

    const createIndicators = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      dots = [];
      slidesPerView = getSlidesPerView();
      maxIndex = Math.max(0, slideCount - slidesPerView);

      const dotsToCreate = maxIndex + 1;
      if (dotsToCreate <= 1) return;

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
    };

    const goToIndex = (newIndex) => {
      index = Math.min(Math.max(0, newIndex), maxIndex);
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseInt(window.getComputedStyle(track).gap) || 24;
      const amountToMove = index * (slideWidth + gap);
      track.style.transform = `translateX(-${amountToMove}px)`;
      
      dots.forEach((dot, idx) => {
        if (idx === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    createIndicators();

    desktopTestimonialInterval = setInterval(() => {
      if (maxIndex > 0) {
        let nextIndex = index + 1;
        if (nextIndex > maxIndex) nextIndex = 0;
        goToIndex(nextIndex);
      }
    }, 5000);

    const container = track.closest('.testimonials-carousel-wrapper');
    if (container) {
      const onEnter = () => clearInterval(desktopTestimonialInterval);
      const onLeave = () => {
        clearInterval(desktopTestimonialInterval);
        desktopTestimonialInterval = setInterval(() => {
          if (maxIndex > 0) {
            let nextIndex = index + 1;
            if (nextIndex > maxIndex) nextIndex = 0;
            goToIndex(nextIndex);
          }
        }, 5000);
      };
      // Clean up past bindings
      if (container._onEnter) container.removeEventListener('mouseenter', container._onEnter);
      if (container._onLeave) container.removeEventListener('mouseleave', container._onLeave);
      
      container.addEventListener('mouseenter', onEnter);
      container.addEventListener('mouseleave', onLeave);
      container._onEnter = onEnter;
      container._onLeave = onLeave;
    }
  };

  // Main Carousels Manager
  const initCarouselsBasedOnViewport = () => {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      if (desktopTestimonialInterval) {
        clearInterval(desktopTestimonialInterval);
        desktopTestimonialInterval = null;
      }
      
      if (!activeTestimonialCarousel) {
        activeTestimonialCarousel = initMobileCarousel('.testimonials-carousel-wrapper', '#testimonialsTrack', '.testimonial-slide', 5500);
      }
      
      if (!activeBlogCarousel) {
        activeBlogCarousel = initMobileCarousel('.blogs-carousel-wrapper', '.blogs-grid', '.blog-card', 5500);
      }
    } else {
      if (activeTestimonialCarousel) {
        activeTestimonialCarousel.destroy();
        activeTestimonialCarousel = null;
      }
      if (activeBlogCarousel) {
        activeBlogCarousel.destroy();
        activeBlogCarousel = null;
      }
      setupDesktopTestimonials();
    }
  };

  // Run switcher
  initCarouselsBasedOnViewport();

  // Handle Resize with simple debounce
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initCarouselsBasedOnViewport();
    }, 250);
  });

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

  // ==========================================================================
  // TRUST STATISTICS BAR TOUCH PAUSE LOGIC
  // ==========================================================================
  const statsTrack = document.querySelector('.stats-bar-track');
  if (statsTrack) {
    statsTrack.addEventListener('touchstart', () => {
      statsTrack.classList.add('paused');
    }, { passive: true });

    statsTrack.addEventListener('touchend', () => {
      statsTrack.classList.remove('paused');
    }, { passive: true });

    statsTrack.addEventListener('touchcancel', () => {
      statsTrack.classList.remove('paused');
    }, { passive: true });
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

