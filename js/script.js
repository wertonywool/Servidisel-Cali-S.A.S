document.addEventListener('DOMContentLoaded', () => {
    // --- Footer Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Corrected Mobile Navigation Logic ---
    const burger = document.querySelector('.burger');
    const mobileNavLinks = document.querySelector('.nav-links'); // Select the <ul> with class nav-links
    const navLinksItems = document.querySelectorAll('.nav-links li'); // Individual <li> items

    if (burger && mobileNavLinks) {
        burger.addEventListener('click', () => {
            // Toggle nav-active class on the mobileNavLinks (the <ul> element)
            mobileNavLinks.classList.toggle('nav-active');
            // Toggle 'toggle' class on the burger for its animation
            burger.classList.toggle('toggle');

            // Animate links based on state
            if (mobileNavLinks.classList.contains('nav-active')) {
                navLinksItems.forEach((link, index) => {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                });
            } else { // Reset animation when closing
                navLinksItems.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    }

    // Close nav when a link is clicked (for mobile)
    if (navLinksItems.length > 0) {
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNavLinks && mobileNavLinks.classList.contains('nav-active')) {
                    mobileNavLinks.classList.remove('nav-active');
                    burger.classList.remove('toggle'); // Also remove burger animation class
                    // Reset animation for all links
                    navLinksItems.forEach(linkItem => {
                        linkItem.style.animation = '';
                    });
                }
            });
        });
    }

    // --- Appointment Form Submission ---
    const appointmentForm = document.getElementById('appointment-form');
    const formMessage = document.querySelector('.form-message');
    const urgencyButtons = document.querySelectorAll('.urgency-btn');
    let selectedUrgency = 'normal'; // Default

    if (urgencyButtons.length > 0) {
        urgencyButtons.forEach(button => {
            button.addEventListener('click', () => {
                urgencyButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                selectedUrgency = button.dataset.urgency;
            });
        });
    }

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual form submission

            // Basic validation (can be expanded)
            const fullName = document.getElementById('full-name').value;
            const phoneNumber = document.getElementById('phone-number').value;
            const brand = document.getElementById('brand').value;
            const model = document.getElementById('model').value;
            const vehicleType = document.getElementById('vehicle-type').value;
            const serviceRequired = document.getElementById('service-required').value;
            const preferredDate = document.getElementById('preferred-date').value;

            if (!fullName || !phoneNumber || !brand || !model || !vehicleType || !serviceRequired || !preferredDate) {
                if(formMessage) {
                    formMessage.textContent = 'Por favor, completa todos los campos obligatorios (*).';
                    formMessage.classList.remove('success');
                    formMessage.classList.add('error');
                    formMessage.style.display = 'block';
                }
                return;
            }

            // Collect all form data
            const formData = new FormData(appointmentForm);
            formData.append('urgency', selectedUrgency); // Add selected urgency

            const feedbackOverlay = document.querySelector('.form-feedback-overlay');
            const loadingSpinner = document.querySelector('.loading-spinner');
            const successMessage = document.querySelector('.success-message');
            const errorMessage = document.querySelector('.error-message');
            const closeButtons = document.querySelectorAll('.close-feedback');

            // Show loading spinner
            feedbackOverlay.style.display = 'flex';
            loadingSpinner.style.display = 'block';
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';

            // Send data to Formspree
            fetch('https://formspree.io/f/xpwbkovb', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                loadingSpinner.style.display = 'none';
                if (response.ok) {
                    successMessage.style.display = 'block';
                    appointmentForm.reset();
                    urgencyButtons.forEach(btn => btn.classList.remove('active'));
                    if(urgencyButtons.length > 0) urgencyButtons[0].classList.add('active');
                    selectedUrgency = 'normal';
                } else {
                    errorMessage.style.display = 'block';
                }
            })
            .catch(error => {
                loadingSpinner.style.display = 'none';
                errorMessage.style.display = 'block';
            });

            closeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    feedbackOverlay.style.display = 'none';
                });
            });
        });
    }

    // --- Interactive Services Tabs ---
    const serviceTabs = document.querySelectorAll('.service-tab-card');
    const serviceContentPanels = document.querySelectorAll('.service-content-panel');

    if (serviceTabs.length > 0) {
        serviceTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Deactivate all tabs and panels
                serviceTabs.forEach(t => t.classList.remove('active'));
                serviceContentPanels.forEach(p => p.classList.remove('active'));

                // Activate the clicked tab
                tab.classList.add('active');

                // Activate the corresponding content panel
                const tabId = tab.dataset.tab;
                const correspondingPanel = document.getElementById(tabId);
                if (correspondingPanel) {
                    correspondingPanel.classList.add('active');
                }
            });
        });
    }

    // --- Gallery Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');
    const galleryContent = document.getElementById('gallery-content');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to the clicked button
                button.classList.add('active');

                const filter = button.dataset.filter;

                // Update background and text color based on filter
                galleryContent.classList.remove('gallery-content-bg-trabajos', 'gallery-content-bg-taller', 'gallery-content-bg-personal', 'gallery-content-bg-videos');
                galleryContent.classList.add(`gallery-content-bg-${filter}`);

                galleryItems.forEach(item => {
                    const itemCategory = item.dataset.category;
                    // Remove all frame classes
                    item.classList.remove('frame-trabajos', 'frame-taller', 'frame-personal', 'frame-videos');
                    // Add frame class based on current filter
                    item.classList.add(`frame-${filter}`);

                    if (filter === 'all' || itemCategory === filter) {
                        item.style.display = 'flex'; // Use flex for video items to center content
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Initial filter application (to show 'videos' by default as per current HTML)
        // Find the 'videos' button and simulate a click
        const initialFilterButton = document.querySelector('.filter-btn[data-filter="videos"]');
        if (initialFilterButton) {
            initialFilterButton.click();
        }
    }

    // --- Animation on Scroll (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animated');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.classList.contains('fade-in-up')) {
                    element.style.animation = 'fadeInUp 0.8s ease-out forwards';
                } else if (element.classList.contains('fade-in')) {
                    element.style.animation = 'fadeIn 0.8s ease-out forwards';
                }
                element.classList.remove('animated'); // Remove base class once animated
                observer.unobserve(element); // Stop observing once animated
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // --- Lightbox Functionality for Videos ---
    let lightbox = document.getElementById('lightbox');
    let lightboxVideo = document.getElementById('lightbox-video'); // Changed from lightboxImg
    let lightboxCaption = document.getElementById('lightbox-caption');
    let closeBtn = document.querySelector('.close-btn');
    const videoItems = document.querySelectorAll('.video-thumbnail-wrapper'); // Select video wrappers

    if (videoItems.length > 0) {
        videoItems.forEach(item => {
            item.addEventListener('click', function() {
                const videoId = this.dataset.videoId;
                const videoTitle = this.nextElementSibling ? this.nextElementSibling.textContent : ''; // Get title from sibling <p>

                lightboxVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`; // Autoplay and remove related videos
                lightboxCaption.innerHTML = videoTitle;
                lightbox.style.display = 'flex';
            });
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            lightbox.style.display = 'none';
            lightboxVideo.src = ''; // Stop video playback when closing
        });
    }

    // Close lightbox when clicking outside the video
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                lightboxVideo.src = ''; // Stop video playback when closing
            }
        });
    }

    // Close lightbox with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && lightbox && lightbox.style.display === 'flex') {
            lightbox.style.display = 'none';
            lightboxVideo.src = ''; // Stop video playback when closing
        }
    });

    // --- Initial active state for interactive services ---
    const firstServiceTab = document.querySelector('.service-tab-card');
    if (firstServiceTab) {
        firstServiceTab.classList.add('active');
        const firstPanelId = firstServiceTab.dataset.tab;
        const firstPanel = document.getElementById(firstPanelId);
        if (firstPanel) {
            firstPanel.classList.add('active');
        }
    }
});
