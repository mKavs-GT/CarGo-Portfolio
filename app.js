document.addEventListener('DOMContentLoaded', () => {
    // 1. Color circles handling for the hero product card
    const colorCircles = document.querySelectorAll('.color-circle');
    const cardImgContainer = document.querySelector('.card-img-container');
    let currentImg = document.getElementById('product-card-img');

    colorCircles.forEach(circle => {
        circle.addEventListener('click', () => {
            // Update active state on the circles
            colorCircles.forEach(c => c.classList.remove('active'));
            circle.classList.add('active');

            const newImageSrc = circle.getAttribute('data-color');
            if (currentImg && currentImg.getAttribute('src') !== newImageSrc && cardImgContainer) {
                // Create new image for a smooth blend transition
                const newImg = document.createElement('img');
                newImg.src = newImageSrc;
                newImg.alt = 'Car Color';
                newImg.className = 'product-card-img';
                newImg.style.opacity = '0';
                newImg.style.position = 'absolute';
                newImg.style.transition = 'opacity 0.4s ease-in-out';
                
                cardImgContainer.appendChild(newImg);
                
                // Force reflow
                void newImg.offsetHeight;
                
                // Fade in the new image over the old one
                newImg.style.opacity = '1';
                
                const oldImg = currentImg;
                currentImg = newImg;
                
                // Remove old image after transition completes
                setTimeout(() => {
                    if (oldImg && oldImg.parentNode) {
                        oldImg.parentNode.removeChild(oldImg);
                    }
                }, 450);
            }
        });
    });

    // 2. Brand badges toggle
    const brandBadges = document.querySelectorAll('#brand-filters .brand-badge');
    brandBadges.forEach(badge => {
        badge.addEventListener('click', () => {
            brandBadges.forEach(b => b.classList.remove('active'));
            badge.classList.add('active');
        });
    });

    // 3. Service buttons auto-selection in booking form
    const serviceButtons = document.querySelectorAll('[data-service]');
    const serviceSelect = document.getElementById('service-select');
    serviceButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const serviceType = btn.getAttribute('data-service');
            if (serviceSelect && serviceType) {
                serviceSelect.value = serviceType;
            }
        });
    });

    // 4. Rent car buttons auto-selection in rental form
    const rentButtons = document.querySelectorAll('[data-rent]');
    const rentSelect = document.getElementById('rent-select');
    rentButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const rentType = btn.getAttribute('data-rent');
            if (rentSelect && rentType) {
                rentSelect.value = rentType;
            }
        });
    });

    // 5. Parts category filter tabs
    const partsTabs = document.querySelectorAll('#parts-tabs a');
    const productCards = document.querySelectorAll('.d3-product-card');

    partsTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            partsTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const selectedTab = tab.getAttribute('data-tab');
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (selectedTab === 'all' || selectedTab === category) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.3s ease';
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 6. Booking forms submission handlers with live feedback
    const today = new Date().toISOString().split('T')[0];
    const serviceDateInput = document.getElementById('service-date');
    const rentStartDateInput = document.getElementById('rent-start-date');
    const rentEndDateInput = document.getElementById('rent-end-date');

    if (serviceDateInput) serviceDateInput.setAttribute('min', today);
    if (rentStartDateInput) {
        rentStartDateInput.setAttribute('min', today);
        rentStartDateInput.addEventListener('change', () => {
            if (rentEndDateInput) {
                rentEndDateInput.setAttribute('min', rentStartDateInput.value || today);
                if (rentEndDateInput.value && rentEndDateInput.value < rentStartDateInput.value) {
                    rentEndDateInput.value = rentStartDateInput.value;
                }
            }
        });
    }
    if (rentEndDateInput) rentEndDateInput.setAttribute('min', today);

    // --- CARGO DIALOG MODAL & TOAST SYSTEM ---
    const modalOverlay = document.getElementById('cargo-modal-overlay');
    const modalClose = document.getElementById('cargo-modal-close');
    const modalBtn = document.getElementById('cargo-modal-btn');
    const modalTitle = document.getElementById('cargo-modal-title');
    const modalDesc = document.getElementById('cargo-modal-desc');
    const modalBadge = document.getElementById('cargo-modal-badge');
    const modalDetails = document.getElementById('cargo-modal-details');
    const modalIcon = document.getElementById('cargo-modal-icon');
    const toast = document.getElementById('cargo-toast');
    const toastMsg = document.getElementById('cargo-toast-msg');

    function showCargoDialog(opts) {
        if (!modalOverlay) return;
        if (modalBadge) modalBadge.textContent = opts.badge || 'REQUEST ACCEPTED';
        if (modalTitle) modalTitle.textContent = opts.title || 'Accepted!';
        if (modalDesc) modalDesc.textContent = opts.message || 'Your submission has been accepted.';
        if (modalIcon) modalIcon.textContent = opts.icon || '✓';
        
        if (modalDetails && opts.details) {
            modalDetails.innerHTML = opts.details.map(d => `
                <div class="cargo-detail-row">
                    <span class="cargo-detail-label">${d.label}</span>
                    <span class="cargo-detail-val ${d.highlight ? 'highlight' : ''}">${d.value}</span>
                </div>
            `).join('');
            modalDetails.style.display = 'flex';
        } else if (modalDetails) {
            modalDetails.style.display = 'none';
        }

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCargoDialog() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (modalClose) modalClose.addEventListener('click', closeCargoDialog);
    if (modalBtn) modalBtn.addEventListener('click', closeCargoDialog);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeCargoDialog();
        });
    }

    let toastTimer;
    function showCargoToast(msg) {
        if (!toast) return;
        if (toastMsg) toastMsg.textContent = msg;
        toast.classList.add('active');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('active');
        }, 3500);
    }

    // 6. Booking forms submission handlers with live feedback & rich accepted dialog
    const serviceForm = document.getElementById('service-form');
    if (serviceForm) {
        serviceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = serviceForm.querySelector('.booking-submit');
            const originalText = submitBtn.innerText;
            const name = document.getElementById('service-name')?.value || 'Valued Client';
            const phone = document.getElementById('service-phone')?.value || 'On File';
            const serviceSelect = document.getElementById('service-select');
            const serviceName = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex]?.text : 'General Service';
            const date = document.getElementById('service-date')?.value || new Date().toISOString().split('T')[0];

            submitBtn.disabled = true;
            submitBtn.innerText = 'Connecting to Dispatch...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
                serviceForm.reset();

                const refId = 'CG-SRV-' + Math.floor(100000 + Math.random() * 900000);
                showCargoDialog({
                    badge: 'SERVICE BOOKING ACCEPTED',
                    title: 'Appointment Confirmed!',
                    message: 'Your service request has been processed and accepted by CarGo Certified Master Technicians.',
                    details: [
                        { label: 'Booking Ref', value: refId, highlight: true },
                        { label: 'Service', value: serviceName },
                        { label: 'Client', value: name },
                        { label: 'Contact', value: phone },
                        { label: 'Scheduled Date', value: date },
                        { label: 'Status', value: 'Confirmed & Logged', highlight: true }
                    ]
                });
            }, 600);
        });
    }

    const rentForm = document.getElementById('rent-form');
    if (rentForm) {
        rentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = rentForm.querySelector('.booking-submit');
            const originalText = submitBtn.innerText;
            const name = document.getElementById('rent-name')?.value || 'Valued Client';
            const phone = document.getElementById('rent-phone')?.value || 'On File';
            const rentSelect = document.getElementById('rent-select');
            const carType = rentSelect ? rentSelect.options[rentSelect.selectedIndex]?.text : 'Executive Fleet';
            const startDate = document.getElementById('rent-start-date')?.value || today;
            const endDate = document.getElementById('rent-end-date')?.value || today;

            submitBtn.disabled = true;
            submitBtn.innerText = 'Checking Fleet Availability...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
                rentForm.reset();

                const refId = 'CG-RENT-' + Math.floor(100000 + Math.random() * 900000);
                showCargoDialog({
                    badge: 'FLEET RESERVATION ACCEPTED',
                    title: 'Vehicle Reserved!',
                    message: 'Your vehicle reservation has been accepted into the CarGo active fleet schedule. Key handover ready on arrival.',
                    details: [
                        { label: 'Reservation Ref', value: refId, highlight: true },
                        { label: 'Category', value: carType },
                        { label: 'Renter', value: name },
                        { label: 'Contact', value: phone },
                        { label: 'Rental Period', value: `${startDate} to ${endDate}` },
                        { label: 'Status', value: 'Pre-Inspected & Staged', highlight: true }
                    ]
                });
            }, 600);
        });
    }

    // Part Order Buttons & Discount Links
    document.querySelectorAll('.cargo-part-btn, [data-part-name]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const partName = btn.getAttribute('data-part-name') || 'High-Performance Component';
            const partPrice = btn.getAttribute('data-part-price') || 'Calculated at checkout';
            const orderId = 'CG-PRT-' + Math.floor(100000 + Math.random() * 900000);

            showCargoDialog({
                badge: 'PART ORDER ACCEPTED',
                title: 'Order Confirmed!',
                message: 'Your performance component order has been routed to CarGo Munich Central Warehouse for express fulfillment.',
                details: [
                    { label: 'Order ID', value: orderId, highlight: true },
                    { label: 'Component', value: partName },
                    { label: 'Amount', value: partPrice },
                    { label: 'Dispatch Hub', value: 'Munich Trackside Logistics' },
                    { label: 'Delivery', value: 'Express Air Freight (2-3 Business Days)' },
                    { label: 'Status', value: 'Accepted & Packing', highlight: true }
                ]
            });
        });
    });

    // Social Media Button Handlers
    document.querySelectorAll('.social-btn, .social-icons a').forEach(socialLink => {
        socialLink.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = socialLink.getAttribute('title') || 'Social Media';
            showCargoToast(`Opening official CarGo ${platform} channel...`);
            setTimeout(() => {
                showCargoToast(`Connected to CarGo ${platform} community!`);
            }, 1200);
        });
    });

    // Back to top button
    const backToTop = document.querySelector('.footer-back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 7. Active Nav Link update on scroll
    const navLinks = document.querySelectorAll('.buylix-navbar .nav-links a');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // 7b. Mobile Navigation Drawer Toggle & Interaction
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const navLinksContainer = document.getElementById('nav-links');
    const mobileNavLinks = document.querySelectorAll('.buylix-navbar .nav-links a');

    function openMobileMenu() {
        if (!navLinksContainer) return;
        navLinksContainer.classList.add('mobile-active');
        if (mobileNavOverlay) mobileNavOverlay.classList.add('mobile-active');
        if (mobileNavToggle) {
            mobileNavToggle.classList.add('open');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (!navLinksContainer) return;
        navLinksContainer.classList.remove('mobile-active');
        if (mobileNavOverlay) mobileNavOverlay.classList.remove('mobile-active');
        if (mobileNavToggle) {
            mobileNavToggle.classList.remove('open');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
    }

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinksContainer && navLinksContainer.classList.contains('mobile-active');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMobileMenu();
        });
    }

    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileMenu);
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                closeMobileMenu();
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinksContainer && navLinksContainer.classList.contains('mobile-active')) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && navLinksContainer && navLinksContainer.classList.contains('mobile-active')) {
            closeMobileMenu();
        }
    });

    // 8. Viewport-Aware Lazy Loading & Playback Control
    const lazyVideos = document.querySelectorAll('video.lazy-video');
    const allVideos = document.querySelectorAll('video');

    if ('IntersectionObserver' in window) {
        // Observer 1: Lazy load sources when video is within 300px of viewport
        const videoLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    const sources = video.querySelectorAll('source[data-src]');
                    
                    sources.forEach(source => {
                        source.src = source.getAttribute('data-src');
                        source.removeAttribute('data-src');
                    });

                    if (video.hasAttribute('data-src')) {
                        video.src = video.getAttribute('data-src');
                        video.removeAttribute('data-src');
                    }

                    video.load();
                    video.dataset.loaded = 'true';
                    observer.unobserve(video);
                }
            });
        }, {
            root: null,
            rootMargin: '300px 0px',
            threshold: 0
        });

        lazyVideos.forEach(video => {
            videoLoadObserver.observe(video);
        });

        // Observer 2: Viewport Playback Controller (pause when outside viewport, play when visible)
        const videoPlaybackObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                const isAutoplay = video.hasAttribute('autoplay');

                if (entry.isIntersecting) {
                    if (isAutoplay && (video.dataset.loaded === 'true' || !video.classList.contains('lazy-video'))) {
                        const playPromise = video.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(() => {});
                        }
                    }
                } else {
                    if (!video.paused) {
                        video.pause();
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '50px 0px',
            threshold: 0.05
        });

        allVideos.forEach(video => {
            videoPlaybackObserver.observe(video);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyVideos.forEach(video => {
            const sources = video.querySelectorAll('source[data-src]');
            sources.forEach(source => {
                source.src = source.getAttribute('data-src');
                source.removeAttribute('data-src');
            });
            if (video.hasAttribute('data-src')) {
                video.src = video.getAttribute('data-src');
                video.removeAttribute('data-src');
            }
            video.load();
            if (video.hasAttribute('autoplay')) {
                video.play().catch(() => {});
            }
        });
    }
});
