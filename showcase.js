import { CONFIG } from './config.js';

// Slideshow state
const slideshowState = {
    timer: null,
    currentIndex: 0,
    items: []
};

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Create and append a showcase item to the container
function createShowcaseItem(item, isActive = false) {
    const showcaseItem = document.createElement('div');
    showcaseItem.className = `showcase-item ${isActive ? 'active' : ''}`;
    
    showcaseItem.innerHTML = `
        <div class="iframe-container">
            <iframe src="${item.frameUrl}" frameborder="0" loading="lazy" allowfullscreen></iframe>
            <button class="fullscreen-button" title="Toggle fullscreen">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
            </button>
        </div>
        <div class="showcase-info">
            <h3 class="showcase-title">${item.title}</h3>
            <p class="showcase-description">${item.description}</p>
            <a href="${item.url}" target="_blank" class="visit-link">Visit Site</a>
        </div>
    `;
    
    // Add fullscreen functionality
    const fullscreenButton = showcaseItem.querySelector('.fullscreen-button');
    const iframe = showcaseItem.querySelector('iframe');
    
    fullscreenButton.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else if (iframe) {
            iframe.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        }
    });
    
    return showcaseItem;
}

// Initialize the slideshow
export function initSlideshow() {
    const showcaseGrid = document.getElementById('showcase-grid');
    if (!showcaseGrid) return;
    
    // Shuffle the showcase items
    slideshowState.items = shuffleArray(CONFIG.SHOWCASE_ITEMS);
    
    // Clear existing content
    showcaseGrid.innerHTML = '';
    
    // Add indicator container
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'slideshow-indicators';
    document.getElementById('showcase').appendChild(indicatorsContainer);
    
    // Create indicators
    slideshowState.items.forEach((_, index) => {
        const indicator = document.createElement('span');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    
    // Show first item
    if (slideshowState.items.length > 0) {
        const firstItem = createShowcaseItem(slideshowState.items[0], true);
        showcaseGrid.appendChild(firstItem);
        startSlideshow();
    }
    
    // Add control buttons
    const prevButton = document.createElement('button');
    prevButton.className = 'slideshow-control prev';
    prevButton.innerHTML = '&#10094;';
    prevButton.addEventListener('click', previousSlide);
    
    const nextButton = document.createElement('button');
    nextButton.className = 'slideshow-control next';
    nextButton.innerHTML = '&#10095;';
    nextButton.addEventListener('click', nextSlide);
    
    showcaseGrid.appendChild(prevButton);
    showcaseGrid.appendChild(nextButton);
}

// Start the slideshow timer
function startSlideshow() {
    stopSlideshow(); // Clear any existing timer
    slideshowState.timer = setInterval(nextSlide, CONFIG.ANIMATION_SPEED.slideshow);
}

// Stop the slideshow timer
function stopSlideshow() {
    if (slideshowState.timer) {
        clearInterval(slideshowState.timer);
        slideshowState.timer = null;
    }
}

// Go to the next slide
function nextSlide() {
    const nextIndex = (slideshowState.currentIndex + 1) % slideshowState.items.length;
    goToSlide(nextIndex);
}

// Go to the previous slide
function previousSlide() {
    const prevIndex = (slideshowState.currentIndex - 1 + slideshowState.items.length) % slideshowState.items.length;
    goToSlide(prevIndex);
}

// Go to a specific slide by index
function goToSlide(index) {
    const showcaseGrid = document.getElementById('showcase-grid');
    const currentItem = slideshowState.items[index];
    
    // Update indicators
    const indicators = document.querySelectorAll('.slideshow-indicators .indicator');
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
    
    // Create new slide
    const newSlide = createShowcaseItem(currentItem, true);
    
    // Apply transition effect
    const currentSlide = showcaseGrid.querySelector('.showcase-item');
    if (currentSlide) {
        currentSlide.style.opacity = '0';
        
        setTimeout(() => {
            // Remove old slide and add new one
            if (currentSlide.parentNode === showcaseGrid) {
                showcaseGrid.removeChild(currentSlide);
            }
            showcaseGrid.insertBefore(newSlide, showcaseGrid.firstChild);
            
            // Update state
            slideshowState.currentIndex = index;
            
            // Reset timer
            startSlideshow();
        }, 300); // Match the CSS transition duration
    } else {
        // If there's no current slide, just add the new one
        showcaseGrid.appendChild(newSlide);
        slideshowState.currentIndex = index;
        startSlideshow();
    }
}

// Pause slideshow when user hovers over it
export function setupSlideshowInteractions() {
    const showcaseGrid = document.getElementById('showcase-grid');
    
    showcaseGrid.addEventListener('mouseenter', stopSlideshow);
    showcaseGrid.addEventListener('mouseleave', startSlideshow);
}