// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Preloader functionality to fade out the loader after the page loads
  window.addEventListener("load", () => {
    const preloader = document.querySelector(".preloader");
    if (preloader) {
      preloader.classList.add("hide");
    }
  });

  // Initialize AOS (Animate on Scroll) library for animations
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800, // Animation duration
      easing: "ease", // Animation easing
      once: true, // Animation occurs only once
      offset: 100, // Offset for triggering animations
      disable: "mobile", // Disable animations on mobile devices
    });
  } else {
    console.warn("AOS is not defined. Make sure AOS library is included in your project.");
  }

  // Mobile Navigation Toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  function closeMobileMenu() {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    document.body.style.overflow = "";
  }

  function openMobileMenu() {
    hamburger.classList.add("active");
    navLinks.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        closeMobileMenu();
        hamburger.focus();
      }
    });
  }

  // Close mobile menu when a navigation link is clicked
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks && navLinks.classList.contains("active")) {
        closeMobileMenu();
      }
    });
  });

  // Theme Toggle Functionality
  const body = document.querySelector("body");

  // Function to set the theme and icon
  function applyTheme(theme) {
    body.classList.remove("light-mode", "dark-mode");
    body.classList.add(theme);
    localStorage.setItem("theme", theme);

    const themeToggle = document.querySelector(".theme-toggle");
    if (themeToggle) {
      themeToggle.innerHTML = theme === "light-mode" ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }
  }

  // Function to initialize the theme toggle logic
  function toggleTheme() {
    const currentTheme = body.classList.contains("light-mode") ? "dark-mode" : "light-mode";
    applyTheme(currentTheme);
  }

  function initializeThemeToggle() {
    const themeToggle = document.querySelector(".theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme);
      themeToggle.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleTheme();
        }
      });
    }
  }

  // Load saved theme from localStorage or default to dark-mode
  const savedTheme = localStorage.getItem("theme") || "dark-mode";
  applyTheme(savedTheme);

  // Since the header is loaded dynamically, we need to initialize the toggle after it's loaded.
  // We can use a MutationObserver to wait for the .theme-toggle element to be added to the DOM.
  const observer = new MutationObserver((mutations, obs) => {
    const themeToggle = document.querySelector(".theme-toggle");
    if (themeToggle) {
      initializeThemeToggle();
      applyTheme(localStorage.getItem("theme") || "dark-mode"); // Re-apply theme to set icon correctly
      obs.disconnect(); // Stop observing once the element is found
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Sticky Header on Scroll (class-based)
  const header = document.querySelector("header");
  const scrollThreshold = 50;
  let scrollTicking = false;

  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        header.classList.toggle("scrolled", window.scrollY > scrollThreshold);
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  // Active nav link highlighting based on current page
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href") !== "#") {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        // Smooth scroll to the target element
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Typed Text Effect for Hero Section
  const typedTextElement = document.querySelector(".typed-text");

  if (typedTextElement) {
    const strings = ["Computer Science Student", "AI Enthusiast", "Problem Solver", "Python Developer"];

    let stringIndex = 0; // Index of the current string
    let charIndex = 0; // Index of the current character
    let isDeleting = false; // Flag for deleting characters
    let typingSpeed = 100; // Typing speed in milliseconds

    function type() {
      const currentString = strings[stringIndex];

      if (isDeleting) {
        // Remove characters
        typedTextElement.textContent = currentString.substring(0, charIndex--);
      } else {
        // Add characters
        typedTextElement.textContent = currentString.substring(0, charIndex++);
      }

      // Adjust typing speed based on the state
      if (!isDeleting && charIndex === currentString.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause before deleting
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % strings.length; // Move to the next string
        typingSpeed = 500; // Pause before typing the next string
      }

      setTimeout(type, typingSpeed);
    }

    // Start the typing effect
    setTimeout(type, 1000);
  }

  // Text Rotation for Hero Section
  const TxtRotate = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = Number.parseInt(period, 10) || 2000;
    this.txt = "";
    this.tick();
    this.isDeleting = false;
  };

  TxtRotate.prototype.tick = function () {
    const i = this.loopNum % this.toRotate.length;
    const fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

    let delta = 200 - Math.random() * 100;

    if (this.isDeleting) {
      delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === "") {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(() => {
      this.tick();
    }, delta);
  };

  window.onload = () => {
    const elements = document.getElementsByClassName("txt-rotate");
    for (let i = 0; i < elements.length; i++) {
      const toRotate = elements[i].getAttribute("data-rotate");
      const period = elements[i].getAttribute("data-period");
      if (toRotate) {
        new TxtRotate(elements[i], JSON.parse(toRotate), period);
      }
    }

    // INJECT CSS
    const css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid var(--primary-color) }";
    document.body.appendChild(css);
  };

  // Timeline Tabs with keyboard support
  const timelineTabs = document.querySelectorAll(".timeline-tab");
  const timelines = document.querySelectorAll(".timeline");

  function activateTimelineTab(tab) {
    timelineTabs.forEach((t) => t.classList.remove("active"));
    timelines.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const targetId = tab.getAttribute("data-target");
    document.getElementById(targetId).classList.add("active");
  }

  if (timelineTabs.length > 0) {
    timelineTabs.forEach((tab) => {
      tab.addEventListener("click", () => activateTimelineTab(tab));
      tab.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activateTimelineTab(tab);
        }
      });
    });
  }

  // Counter Animation for Stats
  const statNumbers = document.querySelectorAll(".stat-number");

  function animateCounter() {
    let allDone = true;
    statNumbers.forEach((stat) => {
      const target = Number.parseInt(stat.getAttribute("data-count"));
      const current = Number.parseInt(stat.textContent) || 0;
      if (current < target) {
        allDone = false;
        const step = Math.max(1, Math.ceil(target / 60));
        stat.textContent = Math.min(current + step, target);
      } else {
        stat.textContent = target;
      }
    });
    if (!allDone) {
      requestAnimationFrame(animateCounter);
    }
  }

  // Start counter animation when stats section is in view
  const statsSection = document.querySelector(".stats-section");

  if (statsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(statsSection);
  }

  // Back to Top Button Functionality
  const backToTopBtn = document.querySelector(".back-to-top");

  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("active"); // Show button
      } else {
        backToTopBtn.classList.remove("active"); // Hide button
      }
    });

    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Smooth scroll to top
      });
    });
  }

  // Project Filtering
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active class from all buttons
        filterBtns.forEach((b) => b.classList.remove("active"));

        // Add active class to clicked button
        btn.classList.add("active");

        const filterValue = btn.getAttribute("data-filter");

        projectCards.forEach((card) => {
          if (filterValue === "all") {
            card.style.display = "block";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 100);
          } else {
            const categories = card.getAttribute("data-category").split(" ");

            if (categories.includes(filterValue)) {
              card.style.display = "block";
              setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
              }, 100);
            } else {
              card.style.opacity = "0";
              card.style.transform = "translateY(20px)";
              setTimeout(() => {
                card.style.display = "none";
              }, 300);
            }
          }
        });
      });
    });
  }

  // Hover effects via CSS classes (cleaner than inline styles)
  const skillItems = document.querySelectorAll(".skill-item");
  skillItems.forEach((item) => {
    item.addEventListener("mouseenter", () => item.classList.add("hover"));
    item.addEventListener("mouseleave", () => item.classList.remove("hover"));
  });

  const certCards = document.querySelectorAll(".certification-card");
  certCards.forEach((card) => {
    card.addEventListener("mouseenter", () => card.classList.add("hover"));
    card.addEventListener("mouseleave", () => card.classList.remove("hover"));
  });

  // Form submission handling with inline validation
  const contactForm = document.getElementById("contactForm");

  function showFieldError(field, message) {
    const existing = field.parentElement.querySelector(".field-error");
    if (existing) existing.remove();
    field.style.borderColor = "var(--accent-red)";
    const error = document.createElement("span");
    error.className = "field-error";
    error.textContent = message;
    error.style.cssText = "color:var(--accent-red);font-size:0.85rem;margin-top:4px;display:block";
    field.parentElement.appendChild(error);
  }

  function clearFieldError(field) {
    field.style.borderColor = "";
    const existing = field.parentElement.querySelector(".field-error");
    if (existing) existing.remove();
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const subject = document.getElementById("subject");
      const message = document.getElementById("message");

      [name, email, subject, message].forEach(clearFieldError);

      let valid = true;
      if (!name.value.trim()) {
        showFieldError(name, "Name is required");
        valid = false;
      }
      if (!email.value.trim()) {
        showFieldError(email, "Email is required");
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showFieldError(email, "Enter a valid email");
        valid = false;
      }
      if (!subject.value.trim()) {
        showFieldError(subject, "Subject is required");
        valid = false;
      }
      if (!message.value.trim()) {
        showFieldError(message, "Message is required");
        valid = false;
      }

      if (!valid) return;

      const successMsg = document.createElement("div");
      successMsg.className = "form-success";
      successMsg.textContent = `Thank you, ${name.value.trim()}! I'll get back to you soon.`;
      successMsg.style.cssText = "color:var(--accent-green);padding:1rem 0;font-weight:500";
      contactForm.reset();
      contactForm.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 5000);
    });

    [document.getElementById("name"), document.getElementById("email"),
     document.getElementById("subject"), document.getElementById("message")]
      .forEach((field) => {
        if (field) {
          field.addEventListener("input", () => clearFieldError(field));
        }
      });
  }

  // Add typing effect to hero title if on home page
  const heroTitle = document.querySelector(".hero-content h1 span");
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = "";

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    };

    setTimeout(typeWriter, 1000);
  }

  // Add parallax effect to hero section (RAF-throttled for performance)
  const hero = document.querySelector(".hero");
  if (hero) {
    let parallaxTicking = false;
    window.addEventListener("scroll", () => {
      if (!parallaxTicking) {
        requestAnimationFrame(() => {
          hero.style.backgroundPosition = `center ${window.scrollY * 0.5}px`;
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    });
  }

  // Add scroll reveal animation
  const revealElements = document.querySelectorAll(".skill-item, .project-card, .certification-card, .timeline-item");

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < windowHeight - revealPoint) {
        element.classList.add("animate__animated", "animate__fadeInUp", "animate__delay-1s");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  // Fix for Font Awesome badminton icon (which doesn't exist in free version)
  // Replace with a similar icon
  document.querySelectorAll(".fa-badminton").forEach((icon) => {
    icon.classList.remove("fa-badminton");
    icon.classList.add("fa-table-tennis");
  });
});
