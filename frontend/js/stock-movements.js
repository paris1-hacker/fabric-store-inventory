const MOVEMENTS_API = "/api/inventory/movements";
let allMovements = [];
let filteredMovements = [];
let movementCurrentPage = 1;
let movementPerPage = 10;
/* |-------------------------------------------------------------------------- | PAGE INITIALIZATION |-------------------------------------------------------------------------- */ document.addEventListener(
  "DOMContentLoaded",
  () => {
    setupSidebar();
    loadUser();
    setupMovementEvents();
    setupMovementFilters();
    loadMovements();
  },
);
/* |-------------------------------------------------------------------------- | AUTHENTICATION TOKEN |-------------------------------------------------------------------------- */ function getToken() {
  return localStorage.getItem("token");
}
/* |-------------------------------------------------------------------------- | API REQUEST |-------------------------------------------------------------------------- */ async function movementRequest(
  url,
  options = {},
) {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    throw new Error("Authentication required");
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  let result;
  try {
    result = await response.json();
  } catch (error) {
    throw new Error("Invalid response from server");
  }
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
    throw new Error("Session expired");
  }
  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }
  return result;
}
/* |-------------------------------------------------------------------------- | LOAD USER INFORMATION |-------------------------------------------------------------------------- */ function loadUser() {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    return;
  }
  try {
    const user = JSON.parse(storedUser);
    const name = user.name || "User";
    const role = user.role || "STAFF";
    const avatar = name.charAt(0).toUpperCase();
    const userName = document.getElementById("userName");
    const userRole = document.getElementById("userRole");
    const userAvatar = document.getElementById("userAvatar");
    if (userName) {
      userName.textContent = name;
    }
    if (userRole) {
      userRole.textContent = role;
    }
    if (userAvatar) {
      userAvatar.textContent = avatar;
    }
  } catch (error) {
    console.error("Failed to load user:", error);
  }
}
/* |-------------------------------------------------------------------------- | SIDEBAR |-------------------------------------------------------------------------- */ function setupSidebar() {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show");
    });
  }
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "login.html";
    });
  }
}
/* |-------------------------------------------------------------------------- | MOVEMENT EVENTS |-------------------------------------------------------------------------- */ function setupMovementEvents() {
  const refreshButton = document.getElementById("refreshMovements");
  if (refreshButton) {
    refreshButton.addEventListener("click", () => {
      loadMovements();
    });
  }
}
/* |-------------------------------------------------------------------------- | MOVEMENT FILTER EVENTS |-------------------------------------------------------------------------- */ function setupMovementFilters() {
  const searchInput = document.getElementById("movementSearch");
  const typeFilter = document.getElementById("movementTypeFilter");
  const dateFilter = document.getElementById("movementDateFilter");
  const resetButton = document.getElementById("resetMovementFilters");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      movementCurrentPage = 1;
      applyMovementFilters();
    });
  }
  if (typeFilter) {
    typeFilter.addEventListener("change", () => {
      movementCurrentPage = 1;
      applyMovementFilters();
    });
  }
  if (dateFilter) {
    dateFilter.addEventListener("change", () => {
      movementCurrentPage = 1;
      applyMovementFilters();
    });
  }
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = "";
      }
      if (typeFilter) {
        typeFilter.value = "";
      }
      if (dateFilter) {
        dateFilter.value = "";
      }
      movementCurrentPage = 1;
      applyMovementFilters();
    });
  }
}
/* |-------------------------------------------------------------------------- | LOAD MOVEMENTS |-------------------------------------------------------------------------- */ async function loadMovements() {
  showLoading();
  hideError();
  try {
    const result = await movementRequest(MOVEMENTS_API);
    console.log("Stock movements:", result);
    allMovements = Array.isArray(result.data) ? result.data : [];
    filteredMovements = [...allMovements];
    movementCurrentPage = 1;
    updateSummary(allMovements);
    renderMovements();
  } catch (error) {
    console.error("Failed to load stock movements:", error);
    showError(error.message);
  }
}
/* |-------------------------------------------------------------------------- | APPLY MOVEMENT FILTERS |-------------------------------------------------------------------------- */ function applyMovementFilters() {
  const searchInput = document.getElementById("movementSearch");
  const typeFilter = document.getElementById("movementTypeFilter");
  const dateFilter = document.getElementById("movementDateFilter");
  const search = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const type = typeFilter ? typeFilter.value : "";
  const date = dateFilter ? dateFilter.value : "";
  filteredMovements = allMovements.filter((movement) => {
    const productName = String(
      movement.product_name || movement.name || "",
    ).toLowerCase();
    const userName = String(
      movement.user_name || movement.user || "",
    ).toLowerCase();
    const movementType = String(movement.movement_type || "").toUpperCase();
    const movementDate =
      movement.created_at || movement.createdAt || movement.date || "";
    let formattedDate = "";
    if (movementDate) {
      const parsedDate = new Date(movementDate);
      if (!Number.isNaN(parsedDate.getTime())) {
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");
        formattedDate = year + "-" + month + "-" + day;
      }
    }
    const matchesSearch =
      !search || productName.includes(search) || userName.includes(search);
    const matchesType = !type || movementType === type;
    const matchesDate = !date || formattedDate === date;
    return matchesSearch && matchesType && matchesDate;
  });
  renderMovements();
}
/* |-------------------------------------------------------------------------- | UPDATE SUMMARY |-------------------------------------------------------------------------- */ function updateSummary(
  movements,
) {
  const stockIn = movements.filter(
    (movement) => String(movement.movement_type).toUpperCase() === "IN",
  ).length;
  const stockOut = movements.filter(
    (movement) => String(movement.movement_type).toUpperCase() === "OUT",
  ).length;
  const total = movements.length;
  const stockInElement = document.getElementById("stockInCount");
  const stockOutElement = document.getElementById("stockOutCount");
  const totalElement = document.getElementById("totalMovementCount");
  if (stockInElement) {
    stockInElement.textContent = stockIn;
  }
  if (stockOutElement) {
    stockOutElement.textContent = stockOut;
  }
  if (totalElement) {
    totalElement.textContent = total;
  }
}
/* |-------------------------------------------------------------------------- | RENDER MOVEMENTS |-------------------------------------------------------------------------- */ function renderMovements() {
  const tableBody = document.getElementById("movementsTableBody");
  const tableWrapper = document.getElementById("movementsTableWrapper");
  const emptyState = document.getElementById("movementsEmpty");
  if (!tableBody) {
    return;
  }
  tableBody.innerHTML = "";
  if (!filteredMovements || filteredMovements.length === 0) {
    if (tableWrapper) {
      tableWrapper.classList.add("d-none");
    }
    if (emptyState) {
      emptyState.classList.remove("d-none");
    }
    renderMovementPagination();
    hideLoading();
    return;
  }
  if (emptyState) {
    emptyState.classList.add("d-none");
  }
  if (tableWrapper) {
    tableWrapper.classList.remove("d-none");
  }
  const startIndex = (movementCurrentPage - 1) * movementPerPage;
  const endIndex = startIndex + movementPerPage;
  const pageMovements = filteredMovements.slice(startIndex, endIndex);
  pageMovements.forEach((movement) => {
    const row = document.createElement("tr");
    const type = String(movement.movement_type || "").toUpperCase();
    const quantity = Number(movement.quantity || 0);
    const previousQuantity = Number(movement.previous_quantity || 0);
    const newQuantity = Number(movement.new_quantity || 0);
    const typeBadge =
      type === "IN"
        ? ` <span class="badge bg-success-subtle text-success"> <i class="bi bi-arrow-down-circle me-1"></i> Stock In </span> `
        : ` <span class="badge bg-danger-subtle text-danger"> <i class="bi bi-arrow-up-circle me-1"></i> Stock Out </span> `;
    const productName =
      movement.product_name || movement.name || "Unknown Product";
    const userName = movement.user_name || movement.user || "Unknown User";
    const reference = movement.reference || "-";
    const date = formatDate(
      movement.created_at || movement.createdAt || movement.date,
    );
    row.innerHTML = ` <td> <div class="d-flex align-items-center"> <div class="stat-icon products-icon me-3" style=" width:40px; height:40px; min-width:40px; " > <i class="bi bi-box-seam"></i> </div> <div> <strong> ${escapeHtml(productName)} </strong> </div> </div> </td> <td> ${typeBadge} </td> <td> <strong> ${formatNumber(quantity)} </strong> <span class="text-muted"> yards </span> </td> <td> ${formatNumber(previousQuantity)} </td> <td> <strong> ${formatNumber(newQuantity)} </strong> </td> <td> ${escapeHtml(userName)} </td> <td> <span class="text-muted"> ${escapeHtml(reference)} </span> </td> <td> <span class="text-muted"> ${date} </span> </td> `;
    tableBody.appendChild(row);
  });
  renderMovementPagination();
  hideLoading();
}
/* |-------------------------------------------------------------------------- | PAGINATION |-------------------------------------------------------------------------- */ function renderMovementPagination() {
  const container = document.getElementById("movementsPagination");
  if (!container) {
    return;
  }
  container.innerHTML = "";
  const totalPages = Math.ceil(filteredMovements.length / movementPerPage);
  if (totalPages <= 1) {
    return;
  }
  const nav = document.createElement("nav");
  const list = document.createElement("ul");
  list.className = "pagination justify-content-end mb-0";
  const previous = document.createElement("li");
  previous.className =
    "page-item " + (movementCurrentPage <= 1 ? "disabled" : "");
  previous.innerHTML = ` <button class="page-link" type="button" > <i class="bi bi-chevron-left"></i> </button> `;
  previous.querySelector("button").addEventListener("click", () => {
    if (movementCurrentPage > 1) {
      movementCurrentPage--;
      renderMovements();
    }
  });
  list.appendChild(previous);
  for (let page = 1; page <= totalPages; page++) {
    const item = document.createElement("li");
    item.className =
      "page-item " + (page === movementCurrentPage ? "active" : "");
    item.innerHTML = ` <button class="page-link" type="button" > ${page} </button> `;
    item.querySelector("button").addEventListener("click", () => {
      movementCurrentPage = page;
      renderMovements();
    });
    list.appendChild(item);
  }
  const next = document.createElement("li");
  next.className =
    "page-item " + (movementCurrentPage >= totalPages ? "disabled" : "");
  next.innerHTML = ` <button class="page-link" type="button" > <i class="bi bi-chevron-right"></i> </button> `;
  next.querySelector("button").addEventListener("click", () => {
    if (movementCurrentPage < totalPages) {
      movementCurrentPage++;
      renderMovements();
    }
  });
  list.appendChild(next);
  nav.appendChild(list);
  container.appendChild(nav);
}
/* |-------------------------------------------------------------------------- | FORMAT DATE |-------------------------------------------------------------------------- */ function formatDate(
  dateValue,
) {
  if (!dateValue) {
    return "-";
  }
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }
  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
/* |-------------------------------------------------------------------------- | FORMAT NUMBER |-------------------------------------------------------------------------- */ function formatNumber(
  value,
) {
  const number = Number(value);
  if (Number.isNaN(number)) {
    return "0";
  }
  return number.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
/* |-------------------------------------------------------------------------- | ESCAPE HTML |-------------------------------------------------------------------------- */ function escapeHtml(
  value,
) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
/* |-------------------------------------------------------------------------- | SHOW LOADING |-------------------------------------------------------------------------- */ function showLoading() {
  const loading = document.getElementById("movementsLoading");
  const table = document.getElementById("movementsTableWrapper");
  const empty = document.getElementById("movementsEmpty");
  if (loading) {
    loading.classList.remove("d-none");
  }
  if (table) {
    table.classList.add("d-none");
  }
  if (empty) {
    empty.classList.add("d-none");
  }
}
/* |-------------------------------------------------------------------------- | HIDE LOADING |-------------------------------------------------------------------------- */ function hideLoading() {
  const loading = document.getElementById("movementsLoading");
  if (loading) {
    loading.classList.add("d-none");
  }
}
/* |-------------------------------------------------------------------------- | SHOW ERROR |-------------------------------------------------------------------------- */ function showError(
  message,
) {
  hideLoading();
  const errorBox = document.getElementById("movementsError");
  if (!errorBox) {
    return;
  }
  errorBox.textContent = message || "Unable to load stock movements.";
  errorBox.classList.remove("d-none");
}
/* |-------------------------------------------------------------------------- | HIDE ERROR |-------------------------------------------------------------------------- */ function hideError() {
  const errorBox = document.getElementById("movementsError");
  if (errorBox) {
    errorBox.classList.add("d-none");
  }
}
