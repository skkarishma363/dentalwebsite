document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // SMILE TRANSFORMATION GALLERY - COMPARISON SLIDER
  // ==========================================================================
  
  const setupComparisonSliders = () => {
    const wrappers = document.querySelectorAll('.transformation-slider-wrapper');
    
    wrappers.forEach(wrapper => {
      const beforeImgContainer = wrapper.querySelector('.transformation-before');
      const handle = wrapper.querySelector('.transformation-handle');
      const labelBefore = wrapper.querySelector('.label-before');
      const labelAfter = wrapper.querySelector('.label-after');
      
      if (!beforeImgContainer || !handle) return;
      
      let isDragging = false;
      
      const updateSlider = (pct) => {
        pct = Math.max(0, Math.min(100, pct));
        beforeImgContainer.style.clipPath = `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`;
        handle.style.left = `${pct}%`;
        
        // Tag visibility updates in real time based on position
        if (pct < 15) {
          if (labelBefore) {
            labelBefore.style.opacity = '0';
            labelBefore.style.visibility = 'hidden';
          }
          if (labelAfter) {
            labelAfter.style.opacity = '1';
            labelAfter.style.visibility = 'visible';
          }
        } else if (pct > 85) {
          if (labelBefore) {
            labelBefore.style.opacity = '1';
            labelBefore.style.visibility = 'visible';
          }
          if (labelAfter) {
            labelAfter.style.opacity = '0';
            labelAfter.style.visibility = 'hidden';
          }
        } else {
          if (labelBefore) {
            labelBefore.style.opacity = '1';
            labelBefore.style.visibility = 'visible';
          }
          if (labelAfter) {
            labelAfter.style.opacity = '1';
            labelAfter.style.visibility = 'visible';
          }
        }
      };
      
      const startDrag = (e) => {
        isDragging = true;
        wrapper.classList.add('dragging');
      };
      
      const stopDrag = () => {
        isDragging = false;
        wrapper.classList.remove('dragging');
      };
      
      const dragHandler = (e) => {
        if (!isDragging) return;
        
        const rect = wrapper.getBoundingClientRect();
        let clientX = 0;
        
        if (e.touches && e.touches.length > 0) {
          clientX = e.touches[0].clientX;
        } else {
          clientX = e.clientX;
        }
        
        const x = clientX - rect.left;
        const pct = (x / rect.width) * 100;
        
        updateSlider(pct);
      };
      
      // Bind mouse events
      handle.addEventListener('mousedown', startDrag);
      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('mousemove', dragHandler);
      
      // Bind touch events with passive: false to prevent scrolling conflicts
      handle.addEventListener('touchstart', (e) => {
        startDrag(e);
        e.stopPropagation(); // Prevent swiping the carousel when dragging handle
      }, { passive: false });
      
      window.addEventListener('touchend', stopDrag);
      
      window.addEventListener('touchmove', (e) => {
        if (isDragging) {
          if (e.cancelable) e.preventDefault(); // Stop window scrolling while dragging
          dragHandler(e);
        }
      }, { passive: false });
      
      // Allow clicking on slider to jump to position (disabled on mobile to avoid swipe conflict)
      wrapper.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) return;
        if (e.target === handle || handle.contains(e.target)) return;
        
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = (x / rect.width) * 100;
        
        beforeImgContainer.style.transition = 'clip-path 0.3s ease-out';
        handle.style.transition = 'left 0.3s ease-out';
        updateSlider(pct);
        
        setTimeout(() => {
          beforeImgContainer.style.transition = '';
          handle.style.transition = '';
        }, 300);
      });
      
      // Prevent drag image defaults
      wrapper.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
      });
      
      // Set initial state (50%)
      updateSlider(50);
    });
  };

  // ==========================================================================
  // SMILE TRANSFORMATION GALLERY - CAROUSEL SLIDER
  // ==========================================================================
  
  const setupCarousel = () => {
    const container = document.querySelector('.transformations-carousel-container');
    if (!container) return;
    
    const track = container.querySelector('.transformations-track');
    const prevBtn = container.querySelector('.nav-btn-prev');
    const nextBtn = container.querySelector('.nav-btn-next');
    const indicatorsContainer = document.querySelector('.transformations-indicators');
    const wrapper = container.querySelector('.transformations-track-wrapper');
    
    if (!track) return;
    
    const cards = Array.from(track.children);
    const cardCount = cards.length;
    let index = 0;
    let slidesPerView = getSlidesPerView();
    let maxIndex = Math.max(0, cardCount - slidesPerView);
    let dots = [];
    
    function getSlidesPerView() {
      const width = window.innerWidth;
      if (width > 1024) return 3;
      if (width > 768) return 2;
      return 1;
    }
    
    function updateControls() {
      slidesPerView = getSlidesPerView();
      maxIndex = Math.max(0, cardCount - slidesPerView);
      const limit = window.innerWidth <= 768 ? cardCount - 1 : maxIndex;
      
      // Arrows remain visible on mobile and update active states
      if (prevBtn) {
        prevBtn.style.display = limit > 0 ? 'flex' : 'none';
        prevBtn.disabled = index === 0;
      }
      if (nextBtn) {
        nextBtn.style.display = limit > 0 ? 'flex' : 'none';
        nextBtn.disabled = index >= limit;
      }
      
      updateIndicators();
    }
    
    function createIndicators() {
      if (!indicatorsContainer) return;
      indicatorsContainer.innerHTML = '';
      dots = [];
      slidesPerView = getSlidesPerView();
      maxIndex = Math.max(0, cardCount - slidesPerView);
      
      const dotsToCreate = window.innerWidth <= 768 ? cardCount : maxIndex + 1;
      if (dotsToCreate <= 1) return;
      
      for (let i = 0; i < dotsToCreate; i++) {
        const dot = document.createElement('button');
        dot.classList.add('transformation-dot');
        if (i === index) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to case ${i + 1}`);
        indicatorsContainer.appendChild(dot);
        dots.push(dot);
        
        dot.addEventListener('click', () => {
          goToIndex(i);
        });
      }
    }
    
    function updateIndicators() {
      dots.forEach((dot, idx) => {
        if (idx === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
    
    function goToIndex(newIndex) {
      slidesPerView = getSlidesPerView();
      maxIndex = Math.max(0, cardCount - slidesPerView);
      const limit = window.innerWidth <= 768 ? cardCount - 1 : maxIndex;
      
      index = Math.min(Math.max(0, newIndex), limit);
      
      if (window.innerWidth <= 768) {
        // On mobile, scroll wrapper smoothly to center the snap-card
        const cardWidth = cards[0].getBoundingClientRect().width;
        wrapper.scrollTo({
          left: index * cardWidth,
          behavior: 'smooth'
        });
      } else {
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = parseInt(window.getComputedStyle(track).gap) || 24;
        const amountToMove = index * (cardWidth + gap);
        track.style.transform = `translateX(-${amountToMove}px)`;
      }
      
      updateControls();
    }
    
    // Bind Arrow Clicks
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToIndex(index - 1);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToIndex(index + 1);
      });
    }
    
    // Listen to mobile scroll snap change to sync controls/indicators in real time
    if (wrapper) {
      wrapper.addEventListener('scroll', () => {
        if (window.innerWidth <= 768) {
          const cardWidth = cards[0].getBoundingClientRect().width;
          const scrollLeft = wrapper.scrollLeft;
          const newIndex = Math.round(scrollLeft / cardWidth);
          if (newIndex !== index && newIndex >= 0 && newIndex < cardCount) {
            index = newIndex;
            updateControls();
          }
        }
      });
    }
    
    // Resize Listener
    window.addEventListener('resize', () => {
      createIndicators();
      goToIndex(index);
    });
    
    // Initialize
    createIndicators();
    updateControls();
  };

  // ==========================================================================
  // LAZY LOADING IMAGES
  // ==========================================================================
  
  const setupLazyLoading = () => {
    const lazyImages = document.querySelectorAll('.lazy-load');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = entry.target;
            
            // Set up load listener before changing sources
            image.onload = () => {
              image.classList.add('loaded');
              const wrapper = image.closest('.transformation-image');
              if (wrapper) {
                wrapper.classList.remove('skeleton');
              }
            };
            
            // Check in case image was already cached
            if (image.complete && image.naturalWidth > 0) {
              image.classList.add('loaded');
              const wrapper = image.closest('.transformation-image');
              if (wrapper) {
                wrapper.classList.remove('skeleton');
              }
            }
            
            if (image.dataset.srcset) {
              image.srcset = image.dataset.srcset;
            }
            if (image.dataset.src) {
              image.src = image.dataset.src;
            }
            
            imageObserver.unobserve(image);
          }
        });
      }, {
        rootMargin: '200px 0px', // Pre-load slightly before coming in view
        threshold: 0.01
      });
      
      lazyImages.forEach(image => imageObserver.observe(image));
    } else {
      // Fallback
      lazyImages.forEach(image => {
        image.onload = () => {
          image.classList.add('loaded');
          const wrapper = image.closest('.transformation-image');
          if (wrapper) {
            wrapper.classList.remove('skeleton');
          }
        };
        if (image.dataset.srcset) {
          image.srcset = image.dataset.srcset;
        }
        if (image.dataset.src) {
          image.src = image.dataset.src;
        }
      });
    }
  };

  // Trigger setup
  setupComparisonSliders();
  setupCarousel();
  setupLazyLoading();
});
