// script.js
const slider = document.getElementById("slider");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Width of one slide + margin-right (space-x-8 = 2rem = 32px)
// We'll calculate dynamically based on first child width + margin
function getSlideWidth() {
  const slide = slider.querySelector("article");
  if (!slide) return 0;
  const style = window.getComputedStyle(slide);
  const width = slide.offsetWidth;
  const marginRight = parseInt(style.marginRight) || 0;
  return width + marginRight;
}

prevBtn.addEventListener("click", () => {
  slider.scrollBy({
    left: -getSlideWidth(),
    behavior: "smooth",
  });
});

nextBtn.addEventListener("click", () => {
  slider.scrollBy({
    left: getSlideWidth(),
    behavior: "smooth",
  });
});

// Home page Images -----------------------------------------------------------------

const testimonials = [
  {
    title: '"Fixongo Saved My Day!"',
    text: "Fixongo is nothing short of amazing! My phone suffered water damage, and I was worried it was beyond repair. However, the professional team at TechPro worked their magic and restored my device to its former glory. They were efficient, communicative, and provided top-notch service.”",
    author: "Amanda Welsh",
    imgAlt:
      "Smiling woman in gray jacket standing in front of an orange wall and window with building outside",
    imgSrc:
      "https://storage.googleapis.com/a1aa/image/31a8c3f8-9541-4a0a-466c-21f495a19951.jpg",
  },
  {
    title: '"Fixongo Fixed My Laptop!"',
    text: "“My laptop stopped working suddenly, and I thought I lost all my work. TechPro’s team was quick to diagnose and fix the issue. Their service was professional and friendly.”",
    author: "John Smith",
    imgAlt: "Man in blue shirt smiling with city background",
    imgSrc:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: '"Excellent Customer Service!"',
    text: "“I was impressed by how patient and helpful the Fixongo staff were. They explained everything clearly and made sure I was satisfied with the repair.”",
    author: "Emily Johnson",
    imgAlt: "Woman with glasses smiling in office environment",
    imgSrc:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: '"Quick and Reliable!"',
    text: "Fixongo repaired my phone faster than I expected. The quality of work was excellent, and the price was fair.”",
    author: "Michael Lee",
    imgAlt: "Happy young man with laptop in modern workspace",
    imgSrc:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
  },
];

let currentIndex = 0;
const titleEl = document.getElementById("testimonial-title");
const textEl = document.getElementById("testimonial-text");
const authorEl = document.getElementById("testimonial-author");
const imageEl = document.getElementById("testimonial-image");
const prevbtn = document.getElementById("btnPrevious");
const nextbtn = document.getElementById("btnNext");

// Animate fade out and fade in for text and image
function fadeOutIn(element, newContent, isImage = false, newAlt = "") {
  element.style.opacity = 0;
  setTimeout(() => {
    if (isImage) {
      element.src = newContent;
      element.alt = newAlt;
    } else {
      element.textContent = newContent;
    }
    element.style.opacity = 1;
  }, 300);
}

function updateTestimonial(index) {
  fadeOutIn(titleEl, testimonials[index].title);
  fadeOutIn(textEl, testimonials[index].text);
  fadeOutIn(authorEl, testimonials[index].author);
  fadeOutIn(
    imageEl,
    testimonials[index].imgSrc,
    true,
    testimonials[index].imgAlt
  );
}

prevbtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
  updateTestimonial(currentIndex);
});

nextbtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % testimonials.length;
  updateTestimonial(currentIndex);
});

// Initialize
updateTestimonial(currentIndex);

// QNAS -------------------------------------------------------------------------

const faqButtons = document.querySelectorAll(".faq-btn");

faqButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    // Close all
    faqButtons.forEach((b) => {
      b.setAttribute("aria-expanded", "false");
      b.querySelector("i").classList.remove("rotate-90");
      b.nextElementSibling.classList.add("hidden");
    });
    if (!expanded) {
      btn.setAttribute("aria-expanded", "true");
      btn.querySelector("i").classList.add("rotate-90");
      btn.nextElementSibling.classList.remove("hidden");
    }
  });
});

// ----------------------------- FAQS services page -----------------------------------------

function toggleAnswer(element) {
  const answer = element.querySelector("p");
  const plusSign = element.querySelector("span.text-2xl");
  if (answer.classList.contains("hidden")) {
    answer.classList.remove("hidden");
    plusSign.textContent = "−";
  } else {
    answer.classList.add("hidden");
    plusSign.textContent = "+";
  }
}

// services page FAQS code
function toggleFaq(id) {
  const answer = document.getElementById(id);
  const btn = document.getElementById(id + "-btn");
  const icon = document.getElementById(id + "-icon");
  const isOpen = answer.classList.contains("open");

  if (isOpen) {
    answer.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    icon.textContent = "+";
  } else {
    answer.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
    icon.textContent = "−";
  }
}

// Scrolling sticky Buttons on page

const scrollBtn = document.getElementById("scrollToTopBtn");

// Show the button when scrolled down 100px
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    scrollBtn.classList.remove("hidden");
  } else {
    scrollBtn.classList.add("hidden");
  }
});

// Scroll to top when clicked
scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// contactus page Form area selection dropdown

(function () {
  const cities = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Other",
  ];

  const input = document.getElementById("city-input");
  const optionsList = document.getElementById("options-list");
  let filteredCities = cities.slice();
  let currentFocus = -1;

  function renderOptions(items) {
    optionsList.innerHTML = "";
    if (items.length === 0) {
      const noItem = document.createElement("li");
      noItem.textContent = "No matches found";
      noItem.className = "option-item";
      noItem.style.cursor = "default";
      optionsList.appendChild(noItem);
      return;
    }
    items.forEach((city, index) => {
      const option = document.createElement("li");
      option.textContent = city;
      option.className = "option-item";
      option.setAttribute("role", "option");
      option.addEventListener("mousedown", function (e) {
        e.preventDefault();
        selectOption(city);
      });
      optionsList.appendChild(option);
    });
  }

  function selectOption(city) {
    input.value = city;
    hideOptions();
    input.focus();
  }

  function showOptions() {
    optionsList.classList.remove("hidden");
  }
  function hideOptions() {
    optionsList.classList.add("hidden");
    currentFocus = -1;
    removeActive();
  }

  function removeActive() {
    const items = optionsList.querySelectorAll(".option-item");
    items.forEach((item) => item.classList.remove("active"));
  }

  function addActive(index) {
    const items = optionsList.querySelectorAll(".option-item");
    if (!items.length) return false;
    removeActive();
    if (index >= items.length) currentFocus = 0;
    if (index < 0) currentFocus = items.length - 1;
    items[currentFocus].classList.add("active");
    items[currentFocus].scrollIntoView({ block: "nearest" });
  }

  input.addEventListener("input", function () {
    console.log("Hello");
    const val = this.value.trim().toLowerCase();
    filteredCities = cities.filter((city) => city.toLowerCase().includes(val));
    renderOptions(filteredCities);
    showOptions();
  });

  input.addEventListener("focus", function () {
    filteredCities = cities.slice();
    renderOptions(filteredCities);
    showOptions();
  });

  input.addEventListener("blur", function () {
    // Delay hiding to allow click on options
    setTimeout(() => hideOptions(), 150);
  });

  input.addEventListener("keydown", function (e) {
    const items = optionsList.querySelectorAll(".option-item");
    if (e.key === "ArrowDown") {
      currentFocus++;
      addActive(currentFocus);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      currentFocus--;
      addActive(currentFocus);
      e.preventDefault();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentFocus > -1 && items[currentFocus]) {
        selectOption(items[currentFocus].textContent);
      }
    } else if (e.key === "Escape") {
      hideOptions();
    }
  });

  // Initialize
  renderOptions(cities);
})();

// Contact Form after Submission

const form = document.getElementById("quoteForm");
const message = document.getElementById("formMessage");

form.addEventListener("submit", async function (e) {
  e.preventDefault(); // prevent full page reload

  const formData = new FormData(form);

  try {
    const res = await fetch("/submit-form", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      message.textContent = "Email sent successfully!";
      message.classList.remove("hidden");
      message.classList.remove("text-red-400");
      message.classList.add("text-green-400");

      setTimeout(() => {
        window.location.href = "/"; // redirect after 1.5s
      }, 1500);
    } else {
      throw new Error(data.error || "Failed to send email.");
    }
  } catch (err) {
    message.textContent = err.message;
    message.classList.remove("hidden");
    message.classList.remove("text-green-400");
    message.classList.add("text-red-400");
  }
});

setTimeout(() => {
  const msg = document.querySelector(".flash-message");
  if (msg) {
    msg.style.transition = "opacity 0.5s";
    msg.style.opacity = 0;
    setTimeout(() => msg.remove(), 500);
  }
}, 3000);
