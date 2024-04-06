document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const slideWidth = slides[0].offsetWidth; // Assuming all slides have equal width
    let currentIndex = 0;
  
    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    }
  
    function updateSlider() {
      const offset = (currentIndex * slideWidth) * -1;
  
      // Apply slide transitions based on index
      slider.style.transform = `translateX(${offset}px)`;
  
      // Animate text for current slide with fade-in
      const currentSlide = slides[currentIndex];
      const textElement = currentSlide.querySelector('.slide-text');
      textElement.style.opacity = 1;
      textElement.style.transform = 'translateY(0px)'; // Reset any previous animation
  
      setTimeout(() => {
        // Animate text for previous slide (if applicable) with fade-out
        if (currentIndex > 0) {
          const previousSlide = slides[currentIndex - 1];
          const previousText = previousSlide.querySelector('.slide-text');
          previousText.style.opacity = 0;
        }
      }, 200); // Adjust delay for text animation timing
    }
  
    setInterval(nextSlide, 5000); // Change slide every 3 seconds
  
    function replayAdvertisement() {
      currentIndex = 0;
      updateSlider(); // Transition without flip on replay
    }
  });
  