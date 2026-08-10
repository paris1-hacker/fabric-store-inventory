document.addEventListener("DOMContentLoaded", () => {
  initializePage();
});
/* ========================================= INITIALIZE PAGE ========================================= */ function initializePage() {
  updateCurrentYear();
  updateAuthenticationButtons();
  setupSmoothNavigation();
}
/* ========================================= CURRENT YEAR ========================================= */ function updateCurrentYear() {
  const yearElement = document.getElementById("currentYear");
  if (!yearElement) {
    return;
  }
  yearElement.textContent = new Date().getFullYear();
}
/* ========================================= CHECK AUTHENTICATION ========================================= */ function getToken() {
  return localStorage.getItem("token");
}
/* ========================================= UPDATE BUTTONS ========================================= */ function updateAuthenticationButtons() {
  const token = getToken();
  const navLoginButton = document.getElementById("navLoginButton");
  const heroPrimaryButton = document.getElementById("heroPrimaryButton");
  const heroPrimaryText = document.getElementById("heroPrimaryText");
  const heroPrimaryIcon = document.getElementById("heroPrimaryIcon");
  /* If the user is already logged in, take them directly to dashboard. */ if (
    token
  ) {
    if (navLoginButton) {
      navLoginButton.href = "dashboard.html";
      navLoginButton.innerHTML = ` <i class="bi bi-grid me-1"></i> Dashboard `;
    }
    if (heroPrimaryButton) {
      heroPrimaryButton.href = "dashboard.html";
    }
    if (heroPrimaryText) {
      heroPrimaryText.textContent = "Go to Dashboard";
    }
    if (heroPrimaryIcon) {
      heroPrimaryIcon.className = "bi bi-arrow-right ms-2";
    }
    return;
  }
  /* If the user is not logged in, send them to login page. */ if (
    navLoginButton
  ) {
    navLoginButton.href = "login.html";
  }
  if (heroPrimaryButton) {
    heroPrimaryButton.href = "login.html";
  }
  if (heroPrimaryText) {
    heroPrimaryText.textContent = "Login to Dashboard";
  }
}
/* ========================================= SMOOTH NAVIGATION ========================================= */ function setupSmoothNavigation() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") {
        return;
      }
      const target = document.querySelector(targetId);
      if (!target) {
        return;
      }
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      /* Close mobile navbar after selecting a section. */ const navbar =
        document.getElementById("mainNavbar");
      if (navbar && navbar.classList.contains("show")) {
        const bootstrapCollapse = bootstrap.Collapse.getInstance(navbar);
        if (bootstrapCollapse) {
          bootstrapCollapse.hide();
        }
      }
    });
  });
}
/* ========================================= LOGOUT HELPER ========================================= */ function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
