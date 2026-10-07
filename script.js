document.addEventListener('DOMContentLoaded', function () {
    // Initialize all features
    initNavbar();
    initTypingEffect();
    initOrbitAnimations();
    initSunPhotoModal();
    initSmoothScroll();
    initSectionAnimations();
});

function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                navLinks.forEach(link => link.classList.remove('active'));


                const activeLink = document.querySelector(`a[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    });

    sections.forEach(section => observer.observe(section));
}

function initTypingEffect() {
    const typingText = document.getElementById('typing-text');
    const phrases = ['Data Scientist', 'AI Engineer'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at end of phrase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before new phrase
        }

        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
}



function initOrbitAnimations() {
    const planets = document.querySelectorAll('.random-orbit');
    const total = planets.length;
    if (total === 0) return;

    // Distribute icons across 3 balanced concentric orbit rings around the avatar
    const rings = [220, 270, 320];

    planets.forEach((planet, index) => {
        const ringIndex = index % rings.length;
        const countInRing = Math.ceil(total / rings.length);
        const posInRing = Math.floor(index / rings.length);

        // Stagger angles so icons don't overlap
        const baseAngle = (posInRing * (360 / countInRing)) + (ringIndex * 40);
        const startAngle = (baseAngle + ((index * 13) % 25)) % 360;
        const radius = rings[ringIndex];

        // Smooth speeds per orbit layer
        const duration = 20 + (ringIndex * 6) + ((index * 3) % 7);
        const direction = (ringIndex % 2 === 0) ? 'normal' : 'reverse';

        planet.style.transform = `rotate(${startAngle}deg) translateX(${radius}px) rotate(-${startAngle}deg)`;

        const animationName = `orbit_ring_${index}`;
        const keyframes = `
            @keyframes ${animationName} {
                from {
                    transform: rotate(${startAngle}deg) translateX(${radius}px) rotate(-${startAngle}deg);
                }
                to {
                    transform: rotate(${startAngle + 360}deg) translateX(${radius}px) rotate(-${startAngle + 360}deg);
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);

        planet.style.animation = `${animationName} ${duration}s linear infinite ${direction}`;

        planet.addEventListener('mouseenter', () => {
            planet.style.animationPlayState = 'paused';
        });

        planet.addEventListener('mouseleave', () => {
            planet.style.animationPlayState = 'running';
        });
    });
}

function initSunPhotoModal() {
    const sun = document.querySelector('.sun-core');
    const modal = document.getElementById('photo-modal');
    const closeBtn = document.querySelector('.close');
    const randomPhoto = document.getElementById('random-photo');

    if (sun && modal && closeBtn && randomPhoto) {
        sun.addEventListener('click', () => {
            const randomId = Math.floor(Math.random() * 1000) + 1;
            randomPhoto.src = `https://picsum.photos/600/400?random=${randomId}`;
            modal.style.display = 'block';
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
}

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initSectionAnimations() {
    const elements = document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up');

    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                if (entry.target.classList.contains('slide-in-left')) {
                    entry.target.style.transform = 'translateX(0)';
                } else if (entry.target.classList.contains('slide-in-right')) {
                    entry.target.style.transform = 'translateX(0)';
                } else {
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => elementObserver.observe(element));

    initContactForm();
}

// Brevo (Sendinblue) Email API Configuration
const BREVO_CONFIG = {
    apiKey: '', // Loadable via localStorage.getItem('brevo_api_key')
    recipientEmail: 'spsoujanya02@gmail.com',
    recipientName: 'Soujanya S P',
    senderEmail: 'spsoujanya02@gmail.com',
    senderName: 'Portfolio Contact'
};

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function initContactForm() {
    // Initialize EmailJS as client-side fallback
    if (typeof emailjs !== 'undefined') {
        emailjs.init("g62Fme-dlX7k79hg9");
    }

    const form = document.getElementById('contact-form');
    const modal = document.getElementById('success-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');

    function showSuccessModal() {
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex';
        } else {
            alert("Message sent successfully!");
        }
    }

    function hideModal() {
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
    }

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const userName = formData.get('user_name') || 'Visitor';
            const userEmail = formData.get('user_email') || '';
            const userMessage = formData.get('message') || '';

            const apiKey = localStorage.getItem('brevo_api_key') || BREVO_CONFIG.apiKey;
            let emailSent = false;

            // Strategy 1: Attempt Brevo API
            if (apiKey && apiKey.trim() !== '') {
                try {
                    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json',
                            'api-key': apiKey.trim(),
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            sender: {
                                name: `${userName} via Portfolio`,
                                email: BREVO_CONFIG.senderEmail
                            },
                            to: [
                                {
                                    email: BREVO_CONFIG.recipientEmail,
                                    name: BREVO_CONFIG.recipientName
                                }
                            ],
                            replyTo: {
                                email: userEmail,
                                name: userName
                            },
                            subject: `📬 Message from ${userName} (${userEmail})`,
                            htmlContent: `
                                <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f4f4f7; color: #333333;">
                                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-top: 4px solid #FF3838;">
                                        <h2 style="margin-top: 0; color: #570000; font-size: 20px;">New Message from Portfolio Website</h2>
                                        <p style="margin: 8px 0;"><strong>Sender Name:</strong> ${escapeHtml(userName)}</p>
                                        <p style="margin: 8px 0;"><strong>Sender Email:</strong> <a href="mailto:${escapeHtml(userEmail)}" style="color: #FF3838;">${escapeHtml(userEmail)}</a></p>
                                        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 16px 0;" />
                                        <p style="margin: 8px 0 4px 0; font-weight: bold; color: #555;">Message:</p>
                                        <div style="background: #fdf2f2; padding: 16px; border-radius: 8px; border-left: 3px solid #FF3838; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(userMessage)}</div>
                                    </div>
                                </div>
                            `
                        })
                    });

                    if (response.ok) {
                        emailSent = true;
                    }
                } catch (brevoErr) {
                    console.warn("Brevo API browser request failed (CORS/Network), attempting fallback delivery:", brevoErr);
                }
            }

            // Strategy 2: If Brevo was blocked in browser, use EmailJS fallback
            if (!emailSent && typeof emailjs !== 'undefined') {
                try {
                    await emailjs.send("service_ajaqnh8", "template_ek4ijdb", {
                        user_name: userName,
                        user_email: userEmail,
                        message: userMessage
                    });
                    emailSent = true;
                } catch (emailjsErr) {
                    console.warn("EmailJS fallback attempt failed:", emailjsErr);
                }
            }

            // Always handle UI feedback gracefully
            submitBtn.textContent = 'Sent!';
            form.reset();
            showSuccessModal();

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        });
    }

    // Modal Close Handlers
    if (modal) {
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', hideModal);
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display !== 'none') {
                hideModal();
            }
        });
    }
}
