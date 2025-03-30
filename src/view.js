/**
 * Frontend Script for Genex Slider
 */
import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.genex-slider-container');

    sliders.forEach((slider) => {
        const slidesContainer = slider.querySelector('.genex-slides');
        const slides = slider.querySelectorAll('.genex-slide');
        const prevButton = slider.querySelector('.genex-slider-prev');
        const nextButton = slider.querySelector('.genex-slider-next');
        const dotsContainer = slider.querySelector('.genex-slider-dots');
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.genex-slider-dot') : null;
        const transitionEffect = slider.dataset.transitionEffect || 'fade';
        // const arrowStyle = slider.dataset.arrowStyle || 'default'; // For future styling
        const autoplayEnabled = slider.dataset.autoplay === 'true';
        const autoplayDuration = (parseFloat(slider.dataset.autoplayDuration) || 5) * 1000; // In milliseconds

        if (!slidesContainer || slides.length <= 1) {
            // No slides or only one slide, hide nav if it exists
            if (prevButton) prevButton.style.display = 'none';
            if (nextButton) nextButton.style.display = 'none';
            // If only one slide, ensure it's visible (especially for fade)
            if (slides.length === 1) {
                gsap.set(slides[0], { opacity: 1, visibility: 'visible' });
            }
            return; // No need for slider logic
        }

        let currentSlideIndex = 0;
        const totalSlides = slides.length;
        let autoplayInterval = null; // Variable to hold the interval ID

        // --- Initialization based on effect ---
        function initializeSlider() {
            // Reset position and visibility for all slides first
            gsap.set(slides, {
                opacity: 0,
                visibility: 'hidden',
                xPercent: 0,
                yPercent: 0,
                position: 'absolute', // Default to absolute now
                top: 0,
                left: 0
            });
            // Reset container position and display
            gsap.set(slidesContainer, { xPercent: 0, yPercent: 0, display: 'block' }); // Always block

            // Setup based on effect
            if (transitionEffect === 'slide-horizontal') {
                // Make all slides visible, but position them offscreen initially
                gsap.set(slides, { 
                    visibility: 'visible', 
                    opacity: 1, 
                    xPercent: (i) => (i === currentSlideIndex ? 0 : 100) // Set initial offset for non-active slides
                });
            } else { // Fade or Blur
                // Only the first one visible
                gsap.set(slides[currentSlideIndex], { opacity: 1, visibility: 'visible' });
            }

            // Start autoplay if enabled
            if (autoplayEnabled) {
                startAutoplay();
            }
        }

        // --- Navigation Logic ---
        function goToSlide(index, isAutoplay = false) {
            if (index === currentSlideIndex) return;

            const outgoingSlide = slides[currentSlideIndex];
            const incomingSlide = slides[index];
            // Correct direction calculation needs care if wrapping
            let tempDirection = index - currentSlideIndex;
            if (Math.abs(tempDirection) > totalSlides / 2) {
                // We wrapped around, reverse direction
                tempDirection = tempDirection > 0 ? tempDirection - totalSlides : tempDirection + totalSlides;
            }
            const direction = Math.sign(tempDirection || (index > currentSlideIndex ? 1 : -1));

            // Handle wrapping for index itself
            const wrappedIndex = (index + totalSlides) % totalSlides;
            if (wrappedIndex === currentSlideIndex) return; // Already handled index check, but safe

            console.log(`Transition: ${transitionEffect}, From ${currentSlideIndex} to ${wrappedIndex}, Direction: ${direction}`);

            switch (transitionEffect) {
                case 'slide-horizontal':
                    // Set initial position of incoming slide (either left or right)
                    gsap.set(incomingSlide, { xPercent: direction * 100 });

                    // Animate outgoing slide out
                    gsap.to(outgoingSlide, {
                        xPercent: -direction * 100,
                        duration: 0.7,
                        ease: 'power2.inOut'
                    });
                    // Animate incoming slide in
                    gsap.to(incomingSlide, {
                        xPercent: 0,
                        duration: 0.7,
                        ease: 'power2.inOut'
                    });
                    break;

                case 'blur':
                    const blurAmount = '8px'; // Adjust blur intensity here
                    // Make incoming slide visible and positioned correctly
                    gsap.set(incomingSlide, { 
                        visibility: 'visible', 
                        opacity: 0, // Start transparent
                        filter: 'blur(0px)' // Ensure incoming isn't blurred
                    }); 
                    // Animate outgoing slide: blur and fade out
                    gsap.to(outgoingSlide, { 
                        filter: `blur(${blurAmount})`,
                        opacity: 0, 
                        duration: 0.6, // Slightly longer duration often looks better with blur
                        ease: 'power1.inOut',
                        onComplete: () => {
                            // Reset outgoing slide state after animation
                            gsap.set(outgoingSlide, { visibility: 'hidden', filter: 'blur(0px)' });
                        }
                     });
                    // Animate incoming slide: fade in
                    gsap.to(incomingSlide, { 
                        opacity: 1, 
                        duration: 0.6, 
                        ease: 'power1.inOut' 
                    });
                    break;

                case 'fade':
                default:
                    gsap.set(incomingSlide, { visibility: 'visible' });
                    gsap.to(outgoingSlide, { opacity: 0, duration: 0.5, ease: 'power1.inOut' });
                    gsap.to(incomingSlide, { opacity: 1, duration: 0.5, ease: 'power1.inOut' });
                    // Hide outgoing after transition
                    gsap.set(outgoingSlide, { visibility: 'hidden', delay: 0.5 });
                    break;
            }

            currentSlideIndex = wrappedIndex; // Use the wrapped index
            updateNavState();

            // Restart autoplay if it was interrupted by manual navigation
            if (autoplayEnabled && !isAutoplay) {
                restartAutoplay();
            }
        }

        function updateNavState() {
            // Optional: Add logic to disable prev/next if not looping
            // Example (if not looping):
            // prevButton.disabled = currentSlideIndex === 0;
            // nextButton.disabled = currentSlideIndex === totalSlides - 1;

            // Update active dot
            if (dots) {
                dots.forEach((dot, i) => {
                    dot.classList.toggle('is-active', i === currentSlideIndex);
                });
            }
        }

        // --- Autoplay Functions ---
        function startAutoplay() {
            if (autoplayInterval) clearInterval(autoplayInterval); // Clear existing interval just in case
            autoplayInterval = setInterval(() => {
                goToSlide((currentSlideIndex + 1) % totalSlides, true); // Pass true for isAutoplay
            }, autoplayDuration);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }

        function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        // --- Event Listeners ---
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (autoplayEnabled) stopAutoplay(); // Stop autoplay on manual interaction
                goToSlide((currentSlideIndex + 1) % totalSlides);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (autoplayEnabled) stopAutoplay(); // Stop autoplay on manual interaction
                goToSlide((currentSlideIndex - 1 + totalSlides) % totalSlides);
            });
        }

        // Dot Listeners
        if (dots) {
            dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    const indexToGo = parseInt(e.target.dataset.slideIndex, 10);
                    if (indexToGo !== currentSlideIndex) {
                        if (autoplayEnabled) stopAutoplay(); // Stop autoplay on manual interaction
                        goToSlide(indexToGo);
                    }
                });
            });
        }

        // Optional: Pause autoplay on hover
        slider.addEventListener('mouseenter', () => {
            if (autoplayEnabled) stopAutoplay();
        });
        slider.addEventListener('mouseleave', () => {
            if (autoplayEnabled && !autoplayInterval) startAutoplay(); // Restart only if it was running
        });

        // --- Initialize ---
        initializeSlider();
        updateNavState();
    }); // end forEach slider
}); 