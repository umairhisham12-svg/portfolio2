(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("main section[id]");
  const toTopButton = document.querySelector(".to-top");
  const form = document.getElementById("contact-form");
  const successMessage = document.getElementById("form-success");
  const headerHeight = 72;

  function setMenu(open) {
    navLinks.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  navToggle.addEventListener("click", function () {
    setMenu(!navLinks.classList.contains("open"));
  });

  navItems.forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setMenu(false);
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const id = link.getAttribute("href");
      if (!id || id === "#") {
        return;
      }

      const target = document.querySelector(id);
      if (!target) {
        return;
      }

      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({
        top: top,
        behavior: "smooth",
      });
    });
  });

  function updateActiveNav() {
    let current = "home";

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - headerHeight - 80;
      if (window.pageYOffset >= sectionTop) {
        current = section.id;
      }
    });

    navItems.forEach(function (link) {
      const isActive = link.getAttribute("href") === "#" + current;
      link.classList.toggle("active", isActive);
    });
  }

  function updateToTopButton() {
    toTopButton.classList.toggle("visible", window.pageYOffset > 400);
  }

  toTopButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", function () {
    updateActiveNav();
    updateToTopButton();
  });

  updateActiveNav();
  updateToTopButton();

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("visible");
    });
  }

  function showError(id, message) {
    const error = document.getElementById(id + "-error");
    const field = document.getElementById(id);
    error.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    successMessage.hidden = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    let isValid = true;

    if (name.length < 2) {
      showError("name", "Please enter your name.");
      isValid = false;
    } else {
      showError("name", "");
    }

    if (!isValidEmail(email)) {
      showError("email", "Please enter a valid email address.");
      isValid = false;
    } else {
      showError("email", "");
    }

    if (message.length < 10) {
      showError("message", "Please write a message of at least 10 characters.");
      isValid = false;
    } else {
      showError("message", "");
    }

    if (!isValid) {
      return;
    }

    form.reset();
    successMessage.hidden = false;
  });
})();
