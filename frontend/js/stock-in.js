const PRODUCTS_API =
    "/api/products";

const INVENTORY_API =
    "/api/inventory";


let selectedProduct = null;


document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupSidebar();

        loadUser();

        setupStockInForm();

        loadProducts();

    }
);


function getToken() {

    return localStorage.getItem(
        "token"
    );

}


async function stockRequest(
    url,
    options = {}
) {

    const token =
        getToken();


    if (!token) {

        window.location.href =
            "login.html";

        throw new Error(
            "Authentication required"
        );

    }


    const headers = {

        "Content-Type":
            "application/json",

        "Authorization":
            "Bearer " + token

    };


    const response =
        await fetch(
            url,
            {
                ...options,

                headers: {
                    ...headers,
                    ...(options.headers || {})
                }

            }
        );


    let result;


    try {

        result =
            await response.json();

    } catch (error) {

        throw new Error(
            "Invalid response from server"
        );

    }


    if (
        response.status === 401
    ) {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        window.location.href =
            "login.html";

        throw new Error(
            "Session expired"
        );

    }


    if (!response.ok) {

        throw new Error(
            result.message ||
            "Request failed"
        );

    }


    return result;

}


function loadUser() {

    const storedUser =
        localStorage.getItem(
            "user"
        );


    if (!storedUser) {

        return;

    }


    try {

        const user =
            JSON.parse(
                storedUser
            );


        const name =
            user.name ||
            "User";


        const role =
            user.role ||
            "STAFF";


        const avatar =
            name
                .charAt(0)
                .toUpperCase();


        const userName =
            document.getElementById(
                "userName"
            );


        const userRole =
            document.getElementById(
                "userRole"
            );


        const userAvatar =
            document.getElementById(
                "userAvatar"
            );


        if (userName) {

            userName.textContent =
                name;

        }


        if (userRole) {

            userRole.textContent =
                role;

        }


        if (userAvatar) {

            userAvatar.textContent =
                avatar;

        }


    } catch (error) {

        console.error(
            "Failed to load user:",
            error
        );

    }

}


function setupSidebar() {

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (
        menuToggle &&
        sidebar
    ) {

        menuToggle.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "show"
                );

            }
        );

    }


    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                window.location.href =
                    "login.html";

            }
        );

    }

}


async function loadProducts() {

    const productSelect =
        document.getElementById(
            "productId"
        );


    if (!productSelect) {

        return;

    }


    try {

        productSelect.innerHTML =
            '<option value="">Loading products...</option>';


        const result =
            await stockRequest(
                PRODUCTS_API +
                "?page=1&limit=100"
            );


        const products =
            Array.isArray(
                result.data
            )
                ? result.data
                : [];


        productSelect.innerHTML =
            '<option value="">Select a product</option>';


        if (
            products.length === 0
        ) {

            productSelect.innerHTML =
                '<option value="">No products available</option>';

            return;

        }


        products.forEach(
            product => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    product.id;


                option.textContent =
                    product.name;


                option.dataset.stock =
                    getProductStock(
                        product
                    );


                productSelect.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(
            "Failed to load products:",
            error
        );


        productSelect.innerHTML =
            '<option value="">Unable to load products</option>';


        showError(
            error.message
        );

    }

}


function getProductStock(
    product
) {

    const stock =
        Number(
            product.quantity ??
            product.stock_quantity ??
            0
        );


    if (
        Number.isNaN(stock)
    ) {

        return 0;

    }


    return stock;

}


function setupStockInForm() {

    const form =
        document.getElementById(
            "stockInForm"
        );


    const productSelect =
        document.getElementById(
            "productId"
        );


    const quantityInput =
        document.getElementById(
            "quantity"
        );


    if (
        productSelect
    ) {

        productSelect.addEventListener(
            "change",
            () => {

                updateSelectedProduct();

            }
        );

    }


    if (
        quantityInput
    ) {

        quantityInput.addEventListener(
            "input",
            () => {

                updateStockPreview();

            }
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            handleStockIn
        );

    }

}


function updateSelectedProduct() {

    const productSelect =
        document.getElementById(
            "productId"
        );


    if (!productSelect) {

        return;

    }


    const selectedOption =
        productSelect.options[
            productSelect.selectedIndex
        ];


    if (
        !selectedOption ||
        !selectedOption.value
    ) {

        selectedProduct =
            null;

        hideStockInformation();

        return;

    }


    const productId =
        Number(
            selectedOption.value
        );


    const stock =
        Number(
            selectedOption.dataset.stock ||
            0
        );


    selectedProduct = {

        id: productId,

        name:
            selectedOption.textContent,

        stock: stock

    };


    const stockInformation =
        document.getElementById(
            "stockInformation"
        );


    const currentStock =
        document.getElementById(
            "currentStock"
        );


    if (stockInformation) {

        stockInformation.classList.remove(
            "d-none"
        );

    }


    if (currentStock) {

        currentStock.textContent =
            formatNumber(stock) +
            " yards";

    }


    updateStockPreview();

}


function updateStockPreview() {

    const quantityInput =
        document.getElementById(
            "quantity"
        );


    const quantityPreview =
        document.getElementById(
            "quantityPreview"
        );


    const newStockPreview =
        document.getElementById(
            "newStockPreview"
        );


    if (
        !selectedProduct
    ) {

        return;

    }


    const quantity =
        Number(
            quantityInput?.value ||
            0
        );


    const newStock =
        selectedProduct.stock +
        quantity;


    if (quantityPreview) {

        quantityPreview.textContent =
            formatNumber(quantity) +
            " yards";

    }


    if (newStockPreview) {

        newStockPreview.textContent =
            formatNumber(newStock) +
            " yards";

    }

}


function hideStockInformation() {

    const stockInformation =
        document.getElementById(
            "stockInformation"
        );


    if (stockInformation) {

        stockInformation.classList.add(
            "d-none"
        );

    }

}


async function handleStockIn(
    event
) {

    event.preventDefault();


    hideMessages();


    const productSelect =
        document.getElementById(
            "productId"
        );


    const quantityInput =
        document.getElementById(
            "quantity"
        );


    const referenceInput =
        document.getElementById(
            "reference"
        );


    const button =
        document.getElementById(
            "stockInButton"
        );


    const buttonText =
        document.getElementById(
            "stockInButtonText"
        );


    const spinner =
        document.getElementById(
            "stockInSpinner"
        );


    const icon =
        document.getElementById(
            "stockInIcon"
        );


    const productId =
        Number(
            productSelect.value
        );


    const quantity =
        Number(
            quantityInput.value
        );


    const reference =
        referenceInput.value.trim();


    if (!productId) {

        showError(
            "Please select a product."
        );

        return;

    }


    if (
        !quantity ||
        quantity <= 0
    ) {

        showError(
            "Quantity must be greater than zero."
        );

        quantityInput.focus();

        return;

    }


    button.disabled =
        true;


    buttonText.textContent =
        "Adding Stock...";


    spinner.classList.remove(
        "d-none"
    );


    icon.classList.add(
        "d-none"
    );


    try {

        const result =
            await stockRequest(
                INVENTORY_API +
                "/stock-in",
                {
                    method: "POST",

                    body: JSON.stringify(
                        {
                            product_id:
                                productId,

                            quantity:
                                quantity,

                            reference:
                                reference ||
                                null
                        }
                    )
                }
            );


        console.log(
            "Stock In response:",
            result
        );


        showSuccess(
            result.message ||
            "Stock added successfully."
        );


        const data =
            result.data || {};


        if (
            data.new_quantity !==
            undefined
        ) {

            selectedProduct.stock =
                Number(
                    data.new_quantity
                );


            const currentStock =
                document.getElementById(
                    "currentStock"
                );


            const quantityPreview =
                document.getElementById(
                    "quantityPreview"
                );


            const newStockPreview =
                document.getElementById(
                    "newStockPreview"
                );


            if (currentStock) {

                currentStock.textContent =
                    formatNumber(
                        data.new_quantity
                    ) +
                    " yards";

            }


            if (quantityPreview) {

                quantityPreview.textContent =
                    "0 yards";

            }


            if (newStockPreview) {

                newStockPreview.textContent =
                    formatNumber(
                        data.new_quantity
                    ) +
                    " yards";

            }

        }


        quantityInput.value =
            "";


        referenceInput.value =
            "";


        setTimeout(
            () => {

                window.location.href =
                    "inventory.html";

            },
            1200
        );


    } catch (error) {

        console.error(
            "Stock In failed:",
            error
        );


        showError(
            error.message ||
            "Failed to add stock."
        );

    } finally {

        button.disabled =
            false;


        buttonText.textContent =
            "Add Stock";


        spinner.classList.add(
            "d-none"
        );


        icon.classList.remove(
            "d-none"
        );

    }

}


function showError(
message
) {

    const errorBox =
        document.getElementById(
            "stockInError"
        );


    if (!errorBox) {

        return;

    }


    errorBox.textContent =
        message ||
        "Something went wrong.";


    errorBox.classList.remove(
        "d-none"
    );

}


function showSuccess(
message
) {

    const successBox =
        document.getElementById(
            "stockInSuccess"
        );


    if (!successBox) {

        return;

    }


    successBox.textContent =
        message ||
        "Stock added successfully.";


    successBox.classList.remove(
        "d-none"
    );

}


function hideMessages() {

    const errorBox =
        document.getElementById(
            "stockInError"
        );


    const successBox =
        document.getElementById(
            "stockInSuccess"
        );


    if (errorBox) {

        errorBox.classList.add(
            "d-none"
        );

        errorBox.textContent =
            "";

    }


    if (successBox) {

        successBox.classList.add(
            "d-none"
        );

        successBox.textContent =
            "";

    }

}


function formatNumber(
value
) {

    const number =
        Number(value);


    if (
        Number.isNaN(number)
    ) {

        return "0";

    }


    return number.toLocaleString(
        "en-NG",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    );

}