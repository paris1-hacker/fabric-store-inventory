/* ========================================================= FABRIC STORE CATEGORY MANAGEMENT ========================================================= */ document.addEventListener(
  "DOMContentLoaded",
  () => {
    /* ===================================================== CONFIG ===================================================== */ const API_BASE_URL =
      window.API_BASE_URL || "/api";
    /* ===================================================== ELEMENTS ===================================================== */ const tableBody =
      document.getElementById("categoriesTableBody");
    const categoryCount = document.getElementById("categoryCount");
    const searchInput = document.getElementById("searchCategory");
    const addCategoryButton = document.getElementById("addCategoryButton");
    const categoryForm = document.getElementById("categoryForm");
    const categoryModalElement = document.getElementById("categoryModal");
    const deleteModalElement = document.getElementById("deleteCategoryModal");
    const categoryModal = new bootstrap.Modal(categoryModalElement);
    const deleteModal = new bootstrap.Modal(deleteModalElement);
    const categoryModalTitle = document.getElementById("categoryModalTitle");
    const categoryId = document.getElementById("categoryId");
    const categoryName = document.getElementById("categoryName");
    const categoryDescription = document.getElementById("categoryDescription");
    const saveCategoryButton = document.getElementById("saveCategoryButton");
    const deleteCategoryName = document.getElementById("deleteCategoryName");
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");
    const logoutButton = document.getElementById("logoutButton");
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const userName = document.getElementById("userName");
    const userRole = document.getElementById("userRole");
    const userAvatar = document.getElementById("userAvatar");
    /* ===================================================== STATE ===================================================== */ let categories =
      [];
    let categoryToDelete = null;
    /* ===================================================== TOKEN ===================================================== */ function getToken() {
      return (
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("token") ||
        ""
      );
    }
    /* ===================================================== API HEADERS ===================================================== */ function getHeaders() {
      const token = getToken();
      return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
    }
    /* ===================================================== LOAD CURRENT USER ===================================================== */ async function loadCurrentUser() {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          headers: getHeaders(),
        });
        if (!response.ok) {
          return;
        }
        const result = await response.json();
        if (!result.success || !result.data) {
          return;
        }
        const user = result.data;
        if (userName) {
          userName.textContent = user.name || "User";
        }
        if (userRole) {
          userRole.textContent =
            user.role === "ADMIN" ? "Administrator" : "Staff";
        }
        if (userAvatar) {
          userAvatar.textContent = (user.name || "U").charAt(0).toUpperCase();
        }
      } catch (error) {
        console.error("Failed to load current user:", error);
      }
    }
    /* ===================================================== LOAD CATEGORIES ===================================================== */ async function loadCategories() {
      try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/categories`, {
          method: "GET",
          headers: getHeaders(),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to load categories");
        }
        categories = result.data || [];
        renderCategories(categories);
      } catch (error) {
        console.error(error);
        showError(error.message || "Unable to load categories.");
      }
    }
    /* ===================================================== RENDER CATEGORIES ===================================================== */ function renderCategories(
      data,
    ) {
      tableBody.innerHTML = "";
      categoryCount.textContent = `${data.length} ${data.length === 1 ? "Category" : "Categories"}`;
      if (data.length === 0) {
        tableBody.innerHTML = ` <tr> <td colspan="5" class="text-center py-5" > <div class="empty-state"> <i class="bi bi-tags fs-1 text-muted" ></i> <h6 class="mt-3"> No categories found </h6> <p class="text-muted"> Create your first fabric category. </p> <button class="btn btn-primary btn-sm" id="emptyAddCategoryButton" > <i class="bi bi-plus-lg me-1"></i> Add Category </button> </div> </td> </tr> `;
        const emptyButton = document.getElementById("emptyAddCategoryButton");
        if (emptyButton) {
          emptyButton.addEventListener("click", openAddModal);
        }
        return;
      }
      data.forEach((category, index) => {
        const row = document.createElement("tr");
        const createdDate = formatDate(category.created_at);
        row.innerHTML = ` <td> ${index + 1} </td> <td> <div class="d-flex align-items-center" > <div class="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center me-3" style="width:40px;height:40px;" > <i class="bi bi-tags"></i> </div> <div> <strong> ${escapeHtml(category.name)} </strong> </div> </div> </td> <td> <span class="text-muted"> ${category.description ? escapeHtml(category.description) : "No description"} </span> </td> <td> <span class="text-muted"> ${createdDate} </span> </td> <td class="text-end"> <div class="btn-group" role="group" > <button type="button" class="btn btn-sm btn-light edit-category-btn" data-id="${category.id}" title="Edit category" > <i class="bi bi-pencil"></i> </button> <button type="button" class="btn btn-sm btn-light text-danger delete-category-btn" data-id="${category.id}" title="Delete category" > <i class="bi bi-trash"></i> </button> </div> </td> `;
        tableBody.appendChild(row);
      });
      attachActionButtons();
    }
    /* ===================================================== ATTACH EDIT / DELETE BUTTONS ===================================================== */ function attachActionButtons() {
      document.querySelectorAll(".edit-category-btn").forEach((button) => {
        button.addEventListener("click", () => {
          const id = button.dataset.id;
          openEditModal(id);
        });
      });
      document.querySelectorAll(".delete-category-btn").forEach((button) => {
        button.addEventListener("click", () => {
          const id = button.dataset.id;
          openDeleteModal(id);
        });
      });
    }
    /* ===================================================== OPEN ADD MODAL ===================================================== */ function openAddModal() {
      categoryForm.reset();
      categoryId.value = "";
      categoryModalTitle.textContent = "Add Category";
      saveCategoryButton.innerHTML = ` <i class="bi bi-check-lg me-1"></i> Save Category `;
      categoryModal.show();
      setTimeout(() => categoryName.focus(), 300);
    }
    addCategoryButton.addEventListener(
        "click",
        openAddModal
    );
    /* ===================================================== OPEN EDIT MODAL ===================================================== */ function openEditModal(
      id,
    ) {
      const category = categories.find(
        (item) => Number(item.id) === Number(id),
      );
      if (!category) {
        alert("Category information could not be found.");
        return;
      }
      categoryId.value = category.id;
      categoryName.value = category.name || "";
      categoryDescription.value = category.description || "";
      categoryModalTitle.textContent = "Edit Category";
      saveCategoryButton.innerHTML = ` <i class="bi bi-check-lg me-1"></i> Update Category `;
      categoryModal.show();
    }
    /* ===================================================== SAVE CATEGORY ===================================================== */ categoryForm.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();
        const id = categoryId.value.trim();
        const name = categoryName.value.trim();
        const description = categoryDescription.value.trim();
        if (!name) {
          alert("Category name is required.");
          categoryName.focus();
          return;
        }
        try {
          setButtonLoading(true);
          const method = id ? "PUT" : "POST";
          const url = id
            ? `${API_BASE_URL}/categories/${id}`
            : `${API_BASE_URL}/categories`;
          const response = await fetch(url, {
            method,
            headers: getHeaders(),
            body: JSON.stringify({ name, description: description || null }),
          });
          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.message || "Failed to save category.");
          }
          categoryModal.hide();
          alert(
            result.message ||
              (id
                ? "Category updated successfully."
                : "Category created successfully."),
          );
          await loadCategories();
        } catch (error) {
          console.error(error);
          alert(error.message || "Something went wrong.");
        } finally {
          setButtonLoading(false);
        }
      },
    );
    /* ===================================================== OPEN DELETE MODAL ===================================================== */ function openDeleteModal(
      id,
    ) {
      const category = categories.find(
        (item) => Number(item.id) === Number(id),
      );
      if (!category) {
        return;
      }
      categoryToDelete = category.id;
      deleteCategoryName.textContent = category.name;
      deleteModal.show();
    }
    /* ===================================================== DELETE CATEGORY ===================================================== */ confirmDeleteButton.addEventListener(
      "click",
      async () => {
        if (!categoryToDelete) {
          return;
        }
        try {
          confirmDeleteButton.disabled = true;
          confirmDeleteButton.innerHTML = ` <span class="spinner-border spinner-border-sm me-1" ></span> Deleting... `;
          const response = await fetch(
            `${API_BASE_URL}/categories/${categoryToDelete}`,
            { method: "DELETE", headers: getHeaders() },
          );
          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.message || "Unable to delete category.");
          }
          deleteModal.hide();
          alert(result.message || "Category deleted successfully.");
          categoryToDelete = null;
          await loadCategories();
        } catch (error) {
          console.error(error);
          alert(error.message || "Unable to delete category.");
        } finally {
          confirmDeleteButton.disabled = false;
          confirmDeleteButton.textContent = "Delete";
        }
      },
    );
    /* ===================================================== SEARCH ===================================================== */ searchInput.addEventListener(
      "input",
      () => {
        const search = searchInput.value.trim().toLowerCase();
        if (!search) {
          renderCategories(categories);
          return;
        }
        const filtered = categories.filter((category) => {
          const name = (category.name || "").toLowerCase();
          const description = (category.description || "").toLowerCase();
          return name.includes(search) || description.includes(search);
        });
        renderCategories(filtered);
      },
    );
    /* ===================================================== BUTTON LOADING ===================================================== */ function setButtonLoading(
      isLoading,
    ) {
      saveCategoryButton.disabled = isLoading;
      if (isLoading) {
        saveCategoryButton.innerHTML = ` <span class="spinner-border spinner-border-sm me-1" ></span> Saving... `;
      } else {
        const id = categoryId.value.trim();
        saveCategoryButton.innerHTML = ` <i class="bi bi-check-lg me-1"></i> ${id ? "Update Category" : "Save Category"} `;
      }
    }
    /* ===================================================== LOADING STATE ===================================================== */ function showLoading() {
      tableBody.innerHTML = ` <tr> <td colspan="5" class="text-center py-5" > <div class="spinner-border text-primary" ></div> <p class="text-muted mt-2 mb-0"> Loading categories... </p> </td> </tr> `;
    }
    /* ===================================================== ERROR STATE ===================================================== */ function showError(
      message,
    ) {
      tableBody.innerHTML = ` <tr> <td colspan="5" class="text-center py-5" > <i class="bi bi-exclamation-circle text-danger fs-2" ></i> <h6 class="mt-3"> Unable to load categories </h6> <p class="text-muted"> ${escapeHtml(message)} </p> <button class="btn btn-primary btn-sm" id="retryCategoriesButton" > <i class="bi bi-arrow-clockwise me-1"></i> Try Again </button> </td> </tr> `;
      const retryButton = document.getElementById("retryCategoriesButton");
      if (retryButton) {
        retryButton.addEventListener("click", loadCategories);
      }
    }
    /* ===================================================== FORMAT DATE ===================================================== */ function formatDate(
      dateString,
    ) {
      if (!dateString) {
        return "—";
      }
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) {
        return "—";
      }
      return date.toLocaleDateString("en-NG", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    /* ===================================================== ESCAPE HTML ===================================================== */ function escapeHtml(
      value,
    ) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    /* ===================================================== SIDEBAR MOBILE TOGGLE ===================================================== */ if (
      menuToggle &&
      sidebar
    ) {
      menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("show");
      });
    }
    /* ===================================================== LOGOUT ===================================================== */ if (
      logoutButton
    ) {
      logoutButton.addEventListener("click", () => {
        const confirmed = confirm("Are you sure you want to logout?");
        if (!confirmed) {
          return;
        }
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("token");
        window.location.href = "index.html";
      });
    }
    /* ===================================================== INITIALIZE ===================================================== */ loadCurrentUser();
    loadCategories();
  },
);
