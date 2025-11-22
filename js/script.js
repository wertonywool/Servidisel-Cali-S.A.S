document.addEventListener('DOMContentLoaded', () => {
    // --- Footer Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Corrected Mobile Navigation Logic ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('nav'); // Select the <nav> tag
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            // Toggle a single class on the main <nav> element
            nav.classList.toggle('nav-active');

            // Animate links based on state
            if (nav.classList.contains('nav-active')) {
                navLinks.forEach((link, index) => {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                });
            } else { // Reset animation when closing
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    }

    // Close nav when a link is clicked (for mobile)
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav && nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    // Reset animation for all links
                    navLinks.forEach(linkItem => {
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

            // Send data to Formspree
            fetch('https://formspree.io/f/xpwbkovb', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (formMessage) {
                    if (response.ok) {
                        formMessage.textContent = '¡Gracias! Tu solicitud de cita ha sido enviada. Nos pondremos en contacto contigo pronto.';
                        formMessage.classList.remove('error');
                        formMessage.classList.add('success');
                        appointmentForm.reset(); // Clear the form
                        urgencyButtons.forEach(btn => btn.classList.remove('active'));
                        if(urgencyButtons.length > 0) urgencyButtons[0].classList.add('active'); // Reset to Normal
                        selectedUrgency = 'normal';
                    } else {
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                formMessage.textContent = data["errors"].map(error => error["message"]).join(", ");
                            } else {
                                formMessage.textContent = '¡Oops! Hubo un problema al enviar tu solicitud.';
                            }
                            formMessage.classList.remove('success');
                            formMessage.classList.add('error');
                        })
                    }
                }
            })
            .catch(error => {
                if (formMessage) {
                    formMessage.textContent = '¡Oops! Hubo un problema de conexión al enviar tu solicitud.';
                    formMessage.classList.remove('success');
                    formMessage.classList.add('error');
                }
            })
            .finally(() => {
                if (formMessage) {
                    formMessage.style.display = 'block';
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 6000);
                }
            });
        });
    }

    // --- Lightbox functionality for Gallery ---
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close-btn');

    if (galleryItems.length > 0 && lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                lightboxImg.src = item.src;
                lightboxCaption.innerHTML = item.alt;
            });
        });

        if(closeBtn) {
            closeBtn.addEventListener('click', () => {
                lightbox.style.display = 'none';
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
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

    // --- Gallery Filtering (New) ---
    const galleryFilterButtons = document.querySelectorAll('.filter-buttons .filter-btn');
    const galleryItemsAll = document.querySelectorAll('.gallery-item');
    const galleryContentSection = document.getElementById('gallery-content');

    // Function to update active filter and apply styles
    const updateGalleryFilter = (filter) => {
        // Remove active class from all buttons and pulsing animation
        galleryFilterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.classList.remove('pulsing');
        });

        // Remove all frame color classes from gallery items
        galleryItemsAll.forEach(item => {
            item.classList.remove('frame-trabajos', 'frame-taller', 'frame-personal');
        });

        // Remove all background classes from gallery content section
        galleryContentSection.classList.remove('gallery-content-bg-trabajos', 'gallery-content-bg-taller', 'gallery-content-bg-personal');

        // Apply active class to the selected button
        const activeButton = document.querySelector(`.filter-buttons .filter-btn[data-filter="${filter}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
            activeButton.classList.add('pulsing'); // Add pulsing animation
        }

        // Apply frame color and background based on filter
        galleryItemsAll.forEach(item => {
            // First, remove all existing frame classes from this item
            item.classList.remove('frame-trabajos', 'frame-taller', 'frame-personal');
            // Then, if the item is visible, apply the new frame class
            if (item.style.display !== 'none') {
                item.classList.add(`frame-${filter}`);
            }
        });
        galleryContentSection.classList.add(`gallery-content-bg-${filter}`);

        // Show/hide gallery items
        galleryItemsAll.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    };

    if (galleryFilterButtons.length > 0) {
        // Set initial filter to 'trabajos' (first category)
        updateGalleryFilter('trabajos');

        galleryFilterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                updateGalleryFilter(filter);
            });
        });
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
});
