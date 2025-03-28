// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Preloader
  window.addEventListener("load", () => {
    const preloader = document.querySelector(".preloader")
    preloader.classList.add("hide")
    setTimeout(() => {
      preloader.style.display = "none"
    }, 500)
  })

  // Initialize AOS animation library
  // Declare AOS if it's not already available globally
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease",
      once: true,
      offset: 100,
      disable: "mobile",
    })
  } else {
    console.warn("AOS is not defined. Make sure AOS library is included in your project.")
  }

  // Mobile Navigation Toggle
  const hamburger = document.querySelector(".hamburger")
  const navLinks = document.querySelector(".nav-links")

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navLinks.classList.toggle("active")
    })
  }

  // Close mobile menu when a nav link is clicked
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navLinks.classList.remove("active")
    })
  })

  // Theme Toggle
  const themeToggle = document.querySelector(".theme-toggle")
  const body = document.querySelector("body")

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("light-mode")

      if (body.classList.contains("light-mode")) {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
      } else {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
      }
    })
  }

  // Sticky Header
  const header = document.querySelector("header")
  const scrollThreshold = 50

  window.addEventListener("scroll", () => {
    if (window.scrollY > scrollThreshold) {
      header.style.padding = "10px 0"
      header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.3)"
    } else {
      header.style.padding = "15px 0"
      header.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.1)"
    }
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href") !== "#") {
        e.preventDefault()

        const targetId = this.getAttribute("href")
        const targetElement = document.querySelector(targetId)

        if (targetElement) {
          const headerHeight = document.querySelector("header").offsetHeight
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }
      }
    })
  })

  // Typed Text Effect
  const typedTextElement = document.querySelector(".typed-text")

  if (typedTextElement) {
    const strings = ["Computer Science Student", "AI Enthusiast", "Problem Solver", "Python Developer"]

    let stringIndex = 0
    let charIndex = 0
    let isDeleting = false
    let typingSpeed = 100

    function type() {
      const currentString = strings[stringIndex]

      if (isDeleting) {
        typedTextElement.textContent = currentString.substring(0, charIndex - 1)
        charIndex--
        typingSpeed = 50
      } else {
        typedTextElement.textContent = currentString.substring(0, charIndex + 1)
        charIndex++
        typingSpeed = 100
      }

      if (!isDeleting && charIndex === currentString.length) {
        isDeleting = true
        typingSpeed = 1000 // Pause at end of word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        stringIndex = (stringIndex + 1) % strings.length
        typingSpeed = 500 // Pause before typing next word
      }

      setTimeout(type, typingSpeed)
    }

    // Start the typing effect
    setTimeout(type, 1000)
  }

  // Text Rotation for Hero Section
  const TxtRotate = function (el, toRotate, period) {
    this.toRotate = toRotate
    this.el = el
    this.loopNum = 0
    this.period = Number.parseInt(period, 10) || 2000
    this.txt = ""
    this.tick()
    this.isDeleting = false
  }

  TxtRotate.prototype.tick = function () {
    const i = this.loopNum % this.toRotate.length
    const fullTxt = this.toRotate[i]

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1)
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1)
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>"

    let delta = 200 - Math.random() * 100

    if (this.isDeleting) {
      delta /= 2
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period
      this.isDeleting = true
    } else if (this.isDeleting && this.txt === "") {
      this.isDeleting = false
      this.loopNum++
      delta = 500
    }

    setTimeout(() => {
      this.tick()
    }, delta)
  }

  window.onload = () => {
    const elements = document.getElementsByClassName("txt-rotate")
    for (let i = 0; i < elements.length; i++) {
      const toRotate = elements[i].getAttribute("data-rotate")
      const period = elements[i].getAttribute("data-period")
      if (toRotate) {
        new TxtRotate(elements[i], JSON.parse(toRotate), period)
      }
    }

    // INJECT CSS
    const css = document.createElement("style")
    css.type = "text/css"
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid var(--primary-color) }"
    document.body.appendChild(css)
  }

  // Timeline Tabs
  const timelineTabs = document.querySelectorAll(".timeline-tab")
  const timelines = document.querySelectorAll(".timeline")

  if (timelineTabs.length > 0) {
    timelineTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Remove active class from all tabs and timelines
        timelineTabs.forEach((t) => t.classList.remove("active"))
        timelines.forEach((t) => t.classList.remove("active"))

        // Add active class to clicked tab and corresponding timeline
        tab.classList.add("active")
        const targetId = tab.getAttribute("data-target")
        document.getElementById(targetId).classList.add("active")
      })
    })
  }

  // Counter Animation for Stats
  const statNumbers = document.querySelectorAll(".stat-number")

  function animateCounter() {
    statNumbers.forEach((stat) => {
      const target = Number.parseInt(stat.getAttribute("data-count"))
      const count = Number.parseInt(stat.textContent)
      const increment = target / 100

      if (count < target) {
        stat.textContent = Math.ceil(count + increment)
        setTimeout(animateCounter, 20)
      } else {
        stat.textContent = target
      }
    })
  }

  // Start counter animation when stats section is in view
  const statsSection = document.querySelector(".stats-section")

  if (statsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter()
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.5,
      },
    )

    observer.observe(statsSection)
  }

  // Back to Top Button
  const backToTopBtn = document.querySelector(".back-to-top")

  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("active")
      } else {
        backToTopBtn.classList.remove("active")
      }
    })

    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Project Filtering
  const filterBtns = document.querySelectorAll(".filter-btn")
  const projectCards = document.querySelectorAll(".project-card")

  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active class from all buttons
        filterBtns.forEach((b) => b.classList.remove("active"))

        // Add active class to clicked button
        btn.classList.add("active")

        const filterValue = btn.getAttribute("data-filter")

        projectCards.forEach((card) => {
          if (filterValue === "all") {
            card.style.display = "block"
            setTimeout(() => {
              card.style.opacity = "1"
              card.style.transform = "translateY(0)"
            }, 100)
          } else {
            const categories = card.getAttribute("data-category").split(" ")

            if (categories.includes(filterValue)) {
              card.style.display = "block"
              setTimeout(() => {
                card.style.opacity = "1"
                card.style.transform = "translateY(0)"
              }, 100)
            } else {
              card.style.opacity = "0"
              card.style.transform = "translateY(20px)"
              setTimeout(() => {
                card.style.display = "none"
              }, 300)
            }
          }
        })
      })
    })
  }

  // Form submission handling
  const contactForm = document.getElementById("contactForm")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const subject = document.getElementById("subject").value
      const message = document.getElementById("message").value

      // Simple validation
      if (!name || !email || !subject || !message) {
        alert("Please fill in all fields")
        return
      }

      // In a real application, you would send this data to a server
      // For now, we'll just show a success message
      alert(`Thank you for your message, ${name}! I'll get back to you soon.`)
      contactForm.reset()
    })
  }

  // Add hover effect to skill items
  const skillItems = document.querySelectorAll(".skill-item")
  skillItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      item.style.borderLeftWidth = "8px"
    })

    item.addEventListener("mouseleave", () => {
      item.style.borderLeftWidth = "4px"
    })
  })

  // Add hover effect to certification cards
  const certCards = document.querySelectorAll(".certification-card")
  certCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.borderBottomWidth = "6px"
    })

    card.addEventListener("mouseleave", () => {
      card.style.borderBottomWidth = "3px"
    })
  })

  // Add typing effect to hero title if on home page
  const heroTitle = document.querySelector(".hero-content h1 span")
  if (heroTitle) {
    const text = heroTitle.textContent
    heroTitle.textContent = ""

    let i = 0
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i)
        i++
        setTimeout(typeWriter, 100)
      }
    }

    setTimeout(typeWriter, 1000)
  }

  // Add parallax effect to hero section
  const hero = document.querySelector(".hero")
  if (hero) {
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY
      hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`
    })
  }

  // Add scroll reveal animation
  const revealElements = document.querySelectorAll(".skill-item, .project-card, .certification-card, .timeline-item")

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight
    const revealPoint = 150

    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top

      if (elementTop < windowHeight - revealPoint) {
        element.classList.add("animate__animated", "animate__fadeInUp")
      }
    })
  }

  window.addEventListener("scroll", revealOnScroll)
  // Fix for Font Awesome badminton icon (which doesn't exist in free version)
  // Replace with a similar icon
  document.querySelectorAll(".fa-badminton").forEach((icon) => {
    icon.classList.remove("fa-badminton")
    icon.classList.add("fa-table-tennis")
  })
})

