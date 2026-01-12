/**
 * Mundo Mascot Animation Module
 * Handles scroll-triggered animations, floating effects, and interactive behaviors
 */

interface MascotConfig {
  selector: string;
  floatAmplitude: number;
  floatSpeed: number;
  rotationAmplitude: number;
  mouseInfluence: number;
  entranceDelay: number;
}

interface Position {
  x: number;
  y: number;
}

class MundoMascot {
  private element: HTMLElement | null;
  private image: HTMLImageElement | null;
  private config: MascotConfig;
  private isVisible: boolean = false;
  private animationFrame: number | null = null;
  private startTime: number = 0;
  private mousePosition: Position = { x: 0, y: 0 };
  private elementCenter: Position = { x: 0, y: 0 };

  constructor(config: Partial<MascotConfig> = {}) {
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

    if (this.element) {
      this.init();
    }
  }

  private init(): void {
    this.setupIntersectionObserver();
    this.setupMouseTracking();
    this.setupScrollParallax();
    this.calculateElementCenter();

    // Recalculate on resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  /**
   * Intersection Observer for scroll-triggered entrance
   */
  private setupIntersectionObserver(): void {
    const options: IntersectionObserverInit = {
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
  private triggerEntrance(): void {
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
  private triggerExit(): void {
    if (!this.element) return;

    this.isVisible = false;
    this.element.classList.remove('visible');
    this.stopFloatingAnimation();
  }

  /**
   * Continuous floating animation using requestAnimationFrame
   */
  private startFloatingAnimation(): void {
    this.startTime = performance.now();
    this.animate();
  }

  private stopFloatingAnimation(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  private animate = (): void => {
    if (!this.isVisible || !this.element) return;

    const elapsed = performance.now() - this.startTime;

    // Calculate float offset using sine wave
    const floatY = Math.sin(elapsed * this.config.floatSpeed) * this.config.floatAmplitude;
    const floatX = Math.sin(elapsed * this.config.floatSpeed * 0.7) * (this.config.floatAmplitude * 0.3);

    // Calculate rotation
    const rotation = Math.sin(elapsed * this.config.floatSpeed * 0.8) * this.config.rotationAmplitude;

    // Calculate mouse influence
    const mouseOffsetX = (this.mousePosition.x - this.elementCenter.x) * this.config.mouseInfluence;
    const mouseOffsetY = (this.mousePosition.y - this.elementCenter.y) * this.config.mouseInfluence;

    // Apply transforms
    const translateX = floatX + mouseOffsetX;
    const translateY = floatY + mouseOffsetY;

    this.element.style.transform = `
      translateX(${translateX}px)
      translateY(${translateY}px)
      rotate(${rotation}deg)
      scale(1)
    `;

    // Dynamic shadow based on height
    const shadowDistance = 8 + Math.abs(floatY) * 0.5;
    const shadowBlur = 20 + Math.abs(floatY);
    const shadowOpacity = 0.25 - (Math.abs(floatY) / this.config.floatAmplitude) * 0.1;

    this.element.style.filter = `drop-shadow(0 ${shadowDistance}px ${shadowBlur}px rgba(0, 60, 120, ${shadowOpacity}))`;

    this.animationFrame = requestAnimationFrame(this.animate);
  };

  /**
   * Mouse tracking for subtle interactive movement
   */
  private setupMouseTracking(): void {
    document.addEventListener('mousemove', (e: MouseEvent) => {
      this.mousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    });
  }

  /**
   * Parallax effect on scroll
   */
  private setupScrollParallax(): void {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  private handleScroll(): void {
    if (!this.element || !this.isVisible) return;

    const scrollY = window.scrollY;
    const rect = this.element.getBoundingClientRect();
    const elementTop = rect.top + scrollY;

    // Calculate parallax offset relative to element position
    const parallaxOffset = (scrollY - elementTop + window.innerHeight) * 0.05;

    // This adds subtle depth to the floating animation
    // The main animation handles the rest
  }

  private calculateElementCenter(): void {
    if (!this.element) return;

    const rect = this.element.getBoundingClientRect();
    this.elementCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  private handleResize(): void {
    this.calculateElementCenter();
  }

  /**
   * Public method to trigger a wave animation
   */
  public wave(): void {
    if (!this.element) return;

    this.element.classList.add('waving');
    setTimeout(() => {
      this.element?.classList.remove('waving');
    }, 1000);
  }

  /**
   * Public method to trigger a bounce animation
   */
  public bounce(): void {
    if (!this.element) return;

    this.element.classList.add('bouncing');
    setTimeout(() => {
      this.element?.classList.remove('bouncing');
    }, 600);
  }

  /**
   * Cleanup method
   */
  public destroy(): void {
    this.stopFloatingAnimation();
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
}

/**
 * Initialize all scroll-animated characters
 */
class ScrollCharacterManager {
  private characters: NodeListOf<HTMLElement>;
  private observer: IntersectionObserver;

  constructor() {
    this.characters = document.querySelectorAll('.scroll-character:not(.mundo-mascot)');

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
      }
    );

    this.init();
  }

  private init(): void {
    this.characters.forEach(character => {
      this.observer.observe(character);
    });

    this.setupScrollDirection();
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }

  private setupScrollDirection(): void {
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
  // Initialize the main mascot
  const mascot = new MundoMascot({
    floatAmplitude: 12,
    floatSpeed: 0.0008,
    rotationAmplitude: 2.5,
    mouseInfluence: 0.015
  });

  // Initialize other scroll characters
  const characterManager = new ScrollCharacterManager();

  // Expose to window for debugging/interaction
  (window as any).mundoMascot = mascot;
});

export { MundoMascot, ScrollCharacterManager };
