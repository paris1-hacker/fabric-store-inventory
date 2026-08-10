
const API_URL = "/api";

const addCategoryForm =
    document.getElementById("addCategoryForm");

const saveCategoryButton =
    document.getElementById("saveCategoryButton");


// ===============================
// ADD CATEGORY
// ===============================

addCategoryForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name =
        document.getElementById("categoryName")
            .value
            .trim();

    const description =
        document.getElementById("categoryDescription")
            .value
            .trim();


    if (!name) {
        alert("Category name is required.");
        return;
    }


    try {

        saveCategoryButton.disabled = true;

        saveCategoryButton.innerHTML = `
            <span
                class="spinner-border spinner-border-sm me-2"
                role="status"
            ></span>
            Adding...
        `;


        const token =
            localStorage.getItem("token");


        const response =
            await fetch(`${API_URL}/categories`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    name,
                    description: description || null
                })

            });


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to create category"
            );

        }


        alert(
            result.message ||
            "Category created successfully"
        );


        // Close modal
        const modalElement =
            document.getElementById(
                "addCategoryModal"
            );

        const modal =
            bootstrap.Modal.getInstance(
                modalElement
            );

        if (modal) {
            modal.hide();
        }


        // Reset form
        addCategoryForm.reset();


        // Reload categories
        if (typeof loadCategories === "function") {
            loadCategories();
        }


    } catch (error) {

        console.error(
            "Create category error:",
            error
        );

        alert(error.message);

    } finally {

        saveCategoryButton.disabled = false;

        saveCategoryButton.innerHTML = `
            <i class="bi bi-plus-lg me-2"></i>
            Add Category
        `;

    }

});
