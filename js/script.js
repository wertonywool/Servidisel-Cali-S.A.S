document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const currentYearSpan = document.getElementById('current-year');

    // Set current year in footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Toggle Nav
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');

            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Burger Animation
            burger.classList.toggle('toggle');
        });
    }

    // Close nav when a link is clicked (for mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(link => {
                    link.style.animation = ''; // Reset animation
                });
            }
        });
    });

    // Appointment Form Submission (New Design)
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
            const email = document.getElementById('email').value;
            const brand = document.getElementById('brand').value;
            const model = document.getElementById('model').value;
            const year = document.getElementById('year').value;
            const vehicleType = document.getElementById('vehicle-type').value;
            const serviceRequired = document.getElementById('service-required').value;
            const preferredDate = document.getElementById('preferred-date').value;
            const preferredTime = document.getElementById('preferred-time').value;
            const problemDescription = document.getElementById('problem-description').value;

            if (!fullName || !phoneNumber || !brand || !model || !vehicleType || !serviceRequired || !preferredDate) {
                formMessage.textContent = 'Por favor, completa todos los campos obligatorios (*).';
                formMessage.classList.remove('success');
                formMessage.classList.add('error');
                formMessage.style.display = 'block';
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
                if (response.ok) {
                    formMessage.textContent = '¡Gracias! Tu solicitud de cita ha sido enviada. Nos pondremos en contacto contigo pronto.';
                    formMessage.classList.remove('error');
                    formMessage.classList.add('success');
                    appointmentForm.reset(); // Clear the form
                    urgencyButtons.forEach(btn => btn.classList.remove('active'));
                    urgencyButtons[0].classList.add('active'); // Reset to Normal
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
            })
            .catch(error => {
                formMessage.textContent = '¡Oops! Hubo un problema de conexión al enviar tu solicitud.';
                formMessage.classList.remove('success');
                formMessage.classList.add('error');
            })
            .finally(() => {
                formMessage.style.display = 'block';
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            });
        });
    }

    // Lightbox functionality for Gallery
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

        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }

    // Interactive Services Tabs
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

    // Gallery Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItemsAll = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Deactivate all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Activate the clicked button
                button.classList.add('active');

                const filter = button.dataset.filter;

                galleryItemsAll.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
});
