const currentPage = document.body.dataset.page;

document.querySelectorAll(".nav-links a[data-page]").forEach(link => {
  if (link.dataset.page === currentPage) link.classList.add("active");
});

const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav-links");

if (toggle && nav) {
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const toast = document.querySelector(".toast");
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}

document.querySelectorAll("[data-vr-link]").forEach(link => {
  link.addEventListener("click", event => {
    const url = link.getAttribute("href");
    if (!url || url === "#") {
      event.preventDefault();
      showToast("VR链接尚未配置，后续替换 href 即可。");
    }
  });
});

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    const group = button.closest("[data-filter-group]");
    if (!group) return;
    group.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;
    document.querySelectorAll("[data-category]").forEach(item => {
      item.style.display = filter === "all" || item.dataset.category === filter ? "" : "none";
    });
  });
});


// 官方导览图和长图点击放大。
const zoomableImages = document.querySelectorAll(".zoomable");
if (zoomableImages.length) {
  const modal = document.createElement("div");
  modal.className = "image-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = '<button type="button" aria-label="关闭大图">×</button><img alt="">';
  document.body.appendChild(modal);

  const modalImage = modal.querySelector("img");
  const closeButton = modal.querySelector("button");

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modalImage.removeAttribute("src");
  }

  zoomableImages.forEach(image => {
    image.addEventListener("click", () => {
      modalImage.src = image.dataset.full || image.src;
      modalImage.alt = image.alt || "图片大图";
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    });
  });

  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
  });
}


// 园区动态 / 包公文化栏目切换。
const newsTabs = document.querySelectorAll("[data-news-tab]");
const newsPanels = document.querySelectorAll("[data-news-panel]");
const newsHeading = document.querySelector("[data-news-heading]");
const newsDescription = document.querySelector("[data-news-description]");

function activateNewsTab(tabName, updateHash = true) {
  if (!newsTabs.length || !newsPanels.length) return;

  newsTabs.forEach(tab => {
    const active = tab.dataset.newsTab === tabName;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  newsPanels.forEach(panel => {
    const active = panel.dataset.newsPanel === tabName;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });

  if (newsHeading && newsDescription) {
    if (tabName === "culture") {
      newsHeading.textContent = "包公文化";
      newsDescription.textContent = "从廉、仁、直、智四个主题读懂包公精神";
    } else {
      newsHeading.textContent = "园区动态";
      newsDescription.textContent = "记录节庆活动、文创上新和园区精彩时刻";
    }
  }

  if (updateHash) {
    history.replaceState(null, "", tabName === "culture" ? "#culture" : "#park");
  }
}

newsTabs.forEach(tab => {
  tab.addEventListener("click", () => activateNewsTab(tab.dataset.newsTab));
});

if (newsTabs.length) {
  const initialTab = window.location.hash === "#culture" ? "culture" : "park";
  activateNewsTab(initialTab, false);
}
