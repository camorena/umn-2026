/**
 * Mundo Mascot Animation Module
 * Handles scroll-triggered animations, floating effects, and interactive behaviors
 */

class MundoMascot {
  constructor(config = {}) {
    this.config = {
      selector: '.mundo-mascot',
      floatAmplitude: 15,
      floatSpeed: 0.001,
      rotationAmplitude: 3,
      mouseInfluence: 0.02,
      entranceDelay: 200,
      ...config
    };

    this.element = document.querySelector(this.config.selector);
    this.image = this.element?.querySelector('img') || null;
    this.isVisible = false;
    this.animationFrame = null;
    this.startTime = 0;
    this.mousePosition = { x: 0, y: 0 };
    this.elementCenter = { x: 0, y: 0 };

    if (this.element) {
      this.init();
    }
  }

  init() {
    this.setupIntersectionObserver();
    this.setupMouseTracking();
    this.setupHoverEffects();
    this.calculateElementCenter();

    // Recalculate on resize
    window.addEventListener('resize', () => this.handleResize());
  }

  /**
   * Intersection Observer for scroll-triggered entrance
   */
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isVisible) {
          this.triggerEntrance();
        } else if (!entry.isIntersecting && this.isVisible) {
          this.triggerExit();
        }
      });
    }, options);

    if (this.element) {
      observer.observe(this.element);
    }
  }

  /**
   * Elegant entrance animation
   */
  triggerEntrance() {
    if (!this.element) return;

    this.isVisible = true;
    this.element.classList.add('visible');

    // Start floating animation after entrance completes
    setTimeout(() => {
      this.startFloatingAnimation();
    }, this.config.entranceDelay + 800);
  }

  /**
   * Exit animation when scrolling away
   */
  triggerExit() {
    if (!this.element) return;

    this.isVisible = false;
    this.element.classList.remove('visible');
    this.stopFloatingAnimation();
  }

  /**
   * Continuous floating animation using requestAnimationFrame
   */
  startFloatingAnimation() {
    this.startTime = performance.now();
    this.animate();
  }

  stopFloatingAnimation() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  animate() {
    if (!this.isVisible || !this.element) return;

    const elapsed = performance.now() - this.startTime;

    // Calculate float offset using sine wave for smooth motion
    const floatY = Math.sin(elapsed * this.config.floatSpeed) * this.config.floatAmplitude;
    const floatX = Math.sin(elapsed * this.config.floatSpeed * 0.7) * (this.config.floatAmplitude * 0.3);

    // Calculate gentle rotation
    const rotation = Math.sin(elapsed * this.config.floatSpeed * 0.8) * this.config.rotationAmplitude;

    // Calculate mouse influence for interactivity
    const mouseOffsetX = (this.mousePosition.x - this.elementCenter.x) * this.config.mouseInfluence;
    const mouseOffsetY = (this.mousePosition.y - this.elementCenter.y) * this.config.mouseInfluence;

    // Clamp mouse influence
    const clampedMouseX = Math.max(-20, Math.min(20, mouseOffsetX));
    const clampedMouseY = Math.max(-15, Math.min(15, mouseOffsetY));

    // Apply transforms
    const translateX = floatX + clampedMouseX;
    const translateY = floatY + clampedMouseY;

    this.element.style.transform = `
      translateX(${translateX}px)
      translateY(${translateY}px)
      rotate(${rotation}deg)
      scale(1)
    `;

    // Dynamic shadow - moves with the mascot for realistic depth
    const shadowDistance = 8 + Math.abs(floatY) * 0.5;
    const shadowBlur = 20 + Math.abs(floatY);
    const shadowOpacity = 0.25 - (Math.abs(floatY) / this.config.floatAmplitude) * 0.1;

    this.element.style.filter = `drop-shadow(0 ${shadowDistance}px ${shadowBlur}px rgba(0, 60, 120, ${shadowOpacity.toFixed(2)}))`;

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  /**
   * Mouse tracking for subtle interactive movement
   */
  setupMouseTracking() {
    document.addEventListener('mousemove', (e) => {
      this.mousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    });
  }

  /**
   * Hover effects for playful interaction
   */
  setupHoverEffects() {
    if (!this.element) return;

    this.element.addEventListener('mouseenter', () => {
      this.element.classList.add('mascot-hover');
      this.bounce();
    });

    this.element.addEventListener('mouseleave', () => {
      this.element.classList.remove('mascot-hover');
    });

    // Click interaction
    this.element.addEventListener('click', () => {
      this.wave();
    });
  }

  calculateElementCenter() {
    if (!this.element) return;

    const rect = this.element.getBoundingClientRect();
    this.elementCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  handleResize() {
    this.calculateElementCenter();
  }

  /**
   * Trigger a wave animation
   */
  wave() {
    if (!this.element) return;

    this.element.classList.add('waving');
    setTimeout(() => {
      this.element?.classList.remove('waving');
    }, 1000);
  }

  /**
   * Trigger a bounce animation
   */
  bounce() {
    if (!this.element) return;

    this.element.classList.add('bouncing');
    setTimeout(() => {
      this.element?.classList.remove('bouncing');
    }, 600);
  }

  /**
   * Cleanup method
   */
  destroy() {
    this.stopFloatingAnimation();
  }
}

/**
 * Initialize all scroll-animated characters (bee, star, flower, etc.)
 */
class ScrollCharacterManager {
  constructor() {
    this.characters = document.querySelectorAll('.scroll-character:not(.mundo-mascot)');

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
      }
    );

    this.init();
  }

  init() {
    this.characters.forEach(character => {
      this.observer.observe(character);
    });

    this.setupScrollDirection();
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }

  setupScrollDirection() {
    let lastScrollTop = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const direction = scrollTop > lastScrollTop ? 'down' : 'up';

          document.body.classList.remove('scrolling-up', 'scrolling-down');
          document.body.classList.add(`scrolling-${direction}`);

          lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
          ticking = false;
        });
        ticking = true;
      }
    });
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the main mascot with custom settings
  const mascot = new MundoMascot({
    floatAmplitude: 12,
    floatSpeed: 0.0008,
    rotationAmplitude: 2.5,
    mouseInfluence: 0.012
  });

  // Initialize other scroll characters
  const characterManager = new ScrollCharacterManager();

  // Expose to window for debugging/interaction
  window.mundoMascot = mascot;
});
