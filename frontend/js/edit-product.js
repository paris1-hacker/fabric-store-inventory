document.addEventListener("DOMContentLoaded", () => {

const form =
    document.getElementById("editProductForm");

const categorySelect =
    document.getElementById("categoryId");

const supplierSelect =
    document.getElementById("supplierId");

const messageBox =
    document.getElementById("formMessage");

const updateButton =
    document.getElementById(
        "updateProductButton"
    );


const params =
    new URLSearchParams(
        window.location.search
    );

const productId =
    params.get("id");


if (!productId) {

    showMessage(
        "Product ID was not provided.",
        "danger"
    );

    form.style.display = "none";

    return;
}


loadPageData();


form.addEventListener(
    "submit",
    handleSubmit
);


async function loadPageData() {

    try {

        await Promise.all([
            loadCategories(),
            loadSuppliers()
        ]);


        await loadProduct();


    } catch (error) {

        console.error(
            "Failed to load edit page:",
            error
        );

        showMessage(
            error.message ||
            "Failed to load product information.",
            "danger"
        );

    }

}


async function loadCategories() {

    const response =
        await apiRequest(
            "/categories"
        );


    const categories =
        response.data || [];


    categorySelect.innerHTML = `
        <option value="">
            Select category
        </option>
    `;


    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value =
            category.id;

        option.textContent =
            category.name;

        categorySelect.appendChild(
            option
        );

    });

}


async function loadSuppliers() {

    const response =
        await apiRequest(
            "/suppliers"
        );


    const suppliers =
        response.data || [];


    supplierSelect.innerHTML = `
        <option value="">
            Select supplier
        </option>
    `;


    suppliers.forEach(supplier => {

        const option =
            document.createElement("option");

        option.value =
            supplier.id;

        option.textContent =
            supplier.name;

        supplierSelect.appendChild(
            option
        );

    });

}


async function loadProduct() {

    const response =
        await apiRequest(
            "/products/" + productId
        );


    console.log(
        "Product being edited:",
        response
    );


    const product =
        response.data;


    if (!product) {

        throw new Error(
            "Product not found."
        );

    }


    document.getElementById(
        "productName"
    ).value =
        product.name || "";


    categorySelect.value =
        product.category_id || "";


    supplierSelect.value =
        product.supplier_id || "";


    document.getElementById(
        "material"
    ).value =
        product.material || "";


    document.getElementById(
        "color"
    ).value =
        product.color || "";


    document.getElementById(
        "pattern"
    ).value =
        product.pattern || "";


    document.getElementById(
        "pricePerYard"
    ).value =
        product.price_per_yard || "";


    document.getElementById(
        "description"
    ).value =
        product.description || "";

}


async function handleSubmit(event) {

    event.preventDefault();

    clearMessage();

    form.classList.add(
        "was-validated"
    );


    if (!form.checkValidity()) {
        return;
    }


    const productData = {

        name:
            document.getElementById(
                "productName"
            ).value.trim(),

        category_id:
            Number(
                categorySelect.value
            ),

        supplier_id:
            Number(
                supplierSelect.value
            ),

        material:
            document.getElementById(
                "material"
            ).value.trim() || null,

        color:
            document.getElementById(
                "color"
            ).value.trim() || null,

        pattern:
            document.getElementById(
                "pattern"
            ).value.trim() || null,

        price_per_yard:
            Number(
                document.getElementById(
                    "pricePerYard"
                ).value
            ),

        description:
            document.getElementById(
                "description"
            ).value.trim() || null

    };


    try {

        updateButton.disabled = true;


        updateButton.innerHTML = `
            <span
                class="spinner-border spinner-border-sm me-2"
                role="status"
            ></span>
            Updating...
        `;


        const response =
            await apiRequest(
                "/products/" + productId,
                {
                    method: "PUT",
                    body:
                        JSON.stringify(
                            productData
                        )
                }
            );


        console.log(
            "Product updated:",
            response
        );


        showMessage(
            response.message ||
            "Product updated successfully.",
            "success"
        );


        setTimeout(() => {

            window.location.href =
                "view-product.html?id=" +
                productId;

        }, 1000);


    } catch (error) {

        console.error(
            "Failed to update product:",
            error
        );


        showMessage(
            error.message ||
            "Failed to update product.",
            "danger"
        );

    } finally {

        updateButton.disabled = false;


        updateButton.innerHTML = `
            <i class="bi bi-check-lg me-2"></i>
            Update Product
        `;

    }

}


function showMessage(
    message,
    type
) {

    messageBox.className =
        "alert alert-" + type;

    messageBox.textContent =
        message;

    messageBox.classList.remove(
        "d-none"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function clearMessage() {

    messageBox.className =
        "alert d-none";

    messageBox.textContent =
        "";

}

});