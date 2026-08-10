document.addEventListener("DOMContentLoaded", () => {

const productDetails =
    document.getElementById("productDetails");

const messageBox =
    document.getElementById("productMessage");

const editButton =
    document.getElementById("editProductButton");


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

    return;
}


editButton.href =
    "edit-product.html?id=" + productId;


loadProduct();


async function loadProduct() {

    try {

        const response =
            await apiRequest(
                "/products/" + productId
            );


        console.log(
            "Product details:",
            response
        );


        const product =
            response.data;


        if (!product) {

            throw new Error(
                "Product information was not returned."
            );

        }


        displayProduct(product);


    } catch (error) {

        console.error(
            "Failed to load product:",
            error
        );


        showMessage(
            error.message ||
            "Failed to load product.",
            "danger"
        );


        productDetails.innerHTML = "";

    }

}


function displayProduct(product) {

    const price =
        Number(product.price_per_yard || 0);


    productDetails.innerHTML = `

        <div class="row g-4">

            <div class="col-xl-8">

                <div class="dashboard-card h-100">

                    <div class="card-header-custom">

                        <div>

                            <h5>
                                Product Information
                            </h5>

                            <p>
                                Basic information about this fabric.
                            </p>

                        </div>

                    </div>


                    <div class="p-4">

                        <div class="mb-4">

                            <span class="text-muted small">
                                Product Name
                            </span>

                            <h3 class="mt-1 mb-0">
                                ${escapeHtml(product.name || "N/A")}
                            </h3>

                        </div>


                        <div class="row g-4">

                            <div class="col-md-6">

                                <span class="text-muted small">
                                    Category
                                </span>

                                <div class="fw-semibold mt-1">
                                    ${escapeHtml(
                                        product.category_name || "N/A"
                                    )}
                                </div>

                            </div>


                            <div class="col-md-6">

                                <span class="text-muted small">
                                    Supplier
                                </span>

                                <div class="fw-semibold mt-1">
                                    ${escapeHtml(
                                        product.supplier_name || "N/A"
                                    )}
                                </div>

                            </div>


                            <div class="col-md-6">

                                <span class="text-muted small">
                                    Material
                                </span>

                                <div class="fw-semibold mt-1">
                                    ${escapeHtml(
                                        product.material || "Not specified"
                                    )}
                                </div>

                            </div>


                            <div class="col-md-6">

                                <span class="text-muted small">
                                    Color
                                </span>

                                <div class="fw-semibold mt-1">
                                    ${escapeHtml(
                                        product.color || "Not specified"
                                    )}
                                </div>

                            </div>


                            <div class="col-md-6">

                                <span class="text-muted small">
                                    Pattern
                                </span>

                                <div class="fw-semibold mt-1">
                                    ${escapeHtml(
                                        product.pattern || "Not specified"
                                    )}
                                </div>

                            </div>


                            <div class="col-md-6">

                                <span class="text-muted small">
                                    Price Per Yard
                                </span>

                                <div class="fw-semibold mt-1">
                                    ₦${price.toLocaleString(
                                        "en-NG",
                                        {
                                            minimumFractionDigits: 2
                                        }
                                    )}
                                </div>

                            </div>

                        </div>


                        <hr class="my-4">


                        <div>

                            <span class="text-muted small">
                                Description
                            </span>

                            <p class="mt-2 mb-0">

                                ${escapeHtml(
                                    product.description ||
                                    "No description available."
                                )}

                            </p>

                        </div>

                    </div>

                </div>

            </div>


            <div class="col-xl-4">

                <div class="dashboard-card">

                    <div class="card-header-custom">

                        <div>

                            <h5>
                                Product Summary
                            </h5>

                            <p>
                                Inventory information
                            </p>

                        </div>

                    </div>


                    <div class="p-4">

                        <div class="text-center py-3">

                            <div class="stat-icon products-icon mx-auto mb-3">

                                <i class="bi bi-box-seam"></i>

                            </div>


                            <h4>
                                ${escapeHtml(
                                    product.name || "Product"
                                )}
                            </h4>

                        </div>


                        <div class="border-top pt-3">

                            <div class="d-flex justify-content-between mb-3">

                                <span class="text-muted">
                                    Product ID
                                </span>

                                <strong>
                                    #${product.id}
                                </strong>

                            </div>


                            <div class="d-flex justify-content-between mb-3">

                                <span class="text-muted">
                                    Price / Yard
                                </span>

                                <strong>
                                    ₦${price.toLocaleString(
                                        "en-NG",
                                        {
                                            minimumFractionDigits: 2
                                        }
                                    )}
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    `;

}


function showMessage(message, type) {

    messageBox.className =
        "alert alert-" + type;

    messageBox.textContent =
        message;

    messageBox.classList.remove(
        "d-none"
    );

}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

});