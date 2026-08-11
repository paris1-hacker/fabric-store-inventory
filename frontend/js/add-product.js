document.addEventListener("DOMContentLoaded", () => {


const form = document.getElementById("addProductForm");
const categorySelect = document.getElementById("categoryId");
const supplierSelect = document.getElementById("supplierId");
const messageBox = document.getElementById("formMessage");
const saveButton = document.getElementById("saveProductButton");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if (menuToggle && sidebar) {

    menuToggle.addEventListener("click", () => {

        sidebar.classList.toggle("show");

    });

}
loadCategories();
loadSuppliers();

form.addEventListener("submit", handleSubmit);


async function loadCategories() {

    try {

        const response = await apiRequest("/categories");

        const categories = response.data || [];

        categorySelect.innerHTML = `
            <option value="">Select category</option>
        `;

        categories.forEach(category => {

            const option = document.createElement("option");

            option.value = category.id;
            option.textContent = category.name;

            categorySelect.appendChild(option);

        });

    } catch (error) {

        console.error("Failed to load categories:", error);

        showMessage(
            "Unable to load categories. Please refresh the page.",
            "danger"
        );

    }

}


async function loadSuppliers() {

    try {

        const response = await apiRequest("/suppliers");

        const suppliers = response.data || [];

        supplierSelect.innerHTML = `
            <option value="">Select supplier</option>
        `;

        suppliers.forEach(supplier => {

            const option = document.createElement("option");

            option.value = supplier.id;
            option.textContent = supplier.name;

            supplierSelect.appendChild(option);

        });

    } catch (error) {

        console.error("Failed to load suppliers:", error);

        showMessage(
            "Unable to load suppliers. Please refresh the page.",
            "danger"
        );

    }

}


async function handleSubmit(event) {

    event.preventDefault();

    clearMessage();

    form.classList.add("was-validated");

    if (!form.checkValidity()) {
        return;
    }


    const name =
        document.getElementById("productName").value.trim();

    const category_id =
        Number(categorySelect.value);

    const supplier_id =
        Number(supplierSelect.value);

    const material =
        document.getElementById("material").value.trim();

    const color =
        document.getElementById("color").value.trim();

    const pattern =
        document.getElementById("pattern").value.trim();

    const price_per_yard =
        Number(document.getElementById("pricePerYard").value);

    const description =
        document.getElementById("description").value.trim();


    const productData = {

        name: name,

        category_id: category_id,

        supplier_id: supplier_id,

        material: material || null,

        color: color || null,

        pattern: pattern || null,

        price_per_yard: price_per_yard,

        description: description || null

    };


    try {

        saveButton.disabled = true;

        saveButton.innerHTML = `
            <span
                class="spinner-border spinner-border-sm me-2"
                role="status"
            ></span>
            Saving...
        `;


        const response =
            await apiRequest(
                "/products",
                {
                    method: "POST",
                    body: JSON.stringify(productData)
                }
            );


        console.log("Product created:", response);


        showMessage(
            response.message || "Product created successfully.",
            "success"
        );


        form.reset();

        form.classList.remove("was-validated");


        setTimeout(() => {

            window.location.href = "products.html";

        }, 1200);


    } catch (error) {

        console.error("Failed to create product:", error);

        showMessage(
            error.message || "Failed to create product.",
            "danger"
        );

    } finally {

        saveButton.disabled = false;

        saveButton.innerHTML = `
            <i class="bi bi-check-lg me-2"></i>
            Save Product
        `;

    }

}


function showMessage(message, type) {

    messageBox.className =
        `alert alert-${type}`;

    messageBox.textContent = message;

    messageBox.classList.remove("d-none");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function clearMessage() {

    messageBox.className = "alert d-none";

    messageBox.textContent = "";

}


});
