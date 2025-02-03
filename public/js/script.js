(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Swiper
  const swiper = new Swiper('.swiper-container', {
      // Optional parameters
      direction: 'horizontal',
      loop: true,
      effect: 'fade',
      speed: 1000,
      autoplay: {
          delay: 5000,
      },

      // If we need pagination
      pagination: {
          el: '.swiper-pagination',
          clickable: true,
      },

      // Navigation arrows
      navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      },
  });

  // Lazy loading for images
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
          }
      });
  });

  images.forEach(img => {
      imageObserver.observe(img);
  });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
if (window.scrollY > 50) {
  navbar.classList.add('navbar-scrolled');
} else {
  navbar.classList.remove('navbar-scrolled');
}
});

// Add hover effect for dropdown
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
dropdown.addEventListener('mouseenter', () => {
  dropdown.querySelector('.dropdown-menu').classList.add('show');
});
dropdown.addEventListener('mouseleave', () => {
  dropdown.querySelector('.dropdown-menu').classList.remove('show');
});
});

document.addEventListener("DOMContentLoaded", () => {
// Initialize Swiper
const swiper = new Swiper(".swiper-container", {
  direction: "horizontal",
  loop: true,
  effect: "fade",
  speed: 1000,
  autoplay: {
    delay: 5000,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
})

// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
})

// Navbar scroll effect
const navbar = document.querySelector(".navbar")
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("navbar-scrolled")
  } else {
    navbar.classList.remove("navbar-scrolled")
  }
})
})
document.addEventListener("DOMContentLoaded", () => {
  // Animate elements on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".fade-in-up")
    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const windowHeight = window.innerHeight
      if (elementTop < windowHeight - 50) {
        element.classList.add("animated")
      }
    })
  }

  window.addEventListener("scroll", animateOnScroll)
  animateOnScroll() // Initial check on page load

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      })
    })
  })
})



document.addEventListener("DOMContentLoaded", () => {
  // Form validation
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener(
      "submit",
      (event) => {
        if (!contactForm.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
        contactForm.classList.add("was-validated")
      },
      false,
    )
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      })
    })
  })

  // Animate elements on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".fade-in-up")
    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const windowHeight = window.innerHeight
      if (elementTop < windowHeight - 50) {
        element.classList.add("animated")
      }
    })
  }

  window.addEventListener("scroll", animateOnScroll)
  animateOnScroll() // Initial check on page load
})

