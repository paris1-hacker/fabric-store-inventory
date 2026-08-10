const PRODUCTS_API =
"/api/products";

const INVENTORY_API =
"/api/inventory";

let selectedProductStock = 0;

document.addEventListener(
"DOMContentLoaded",
() => {

    setupSidebar();

    loadUser();

    checkAuthentication();

    loadProducts();

    setupStockOutForm();

}

);

/*
AUTHENTICATION
--------------------------------------------------------------------------
*/

function getToken() {

return localStorage.getItem("token");

}

function checkAuthentication() {

const token =
    getToken();

if (!token) {

    window.location.href =
        "login.html";

}

}

/*
API REQUEST
--------------------------------------------------------------------------
*/

async function stockOutRequest(
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


const response =
    await fetch(
        url,
        {
            ...options,

            headers: {

                "Content-Type":
                    "application/json",

                "Authorization":
                    "Bearer " + token,

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

/*
LOAD USER
--------------------------------------------------------------------------
*/

function loadUser() {

const storedUser =
    localStorage.getItem("user");


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

/*
SIDEBAR
--------------------------------------------------------------------------
*/

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

/*
LOAD PRODUCTS
--------------------------------------------------------------------------
*/

async function loadProducts() {

const productSelect =
    document.getElementById(
        "product"
    );


const loadingText =
    document.getElementById(
        "productLoading"
    );


if (!productSelect) {

    return;

}


try {

    const result =
        await stockOutRequest(
            PRODUCTS_API +
            "?limit=1000"
        );


    const products =
        Array.isArray(result.data)
            ? result.data
            : [];


    productSelect.innerHTML =
        '<option value="">Select a product</option>';


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
                product.stock_quantity ??
                product.quantity ??
                0;


            productSelect.appendChild(
                option
            );

        }
    );


    if (loadingText) {

        loadingText.textContent =
            products.length +
            " products available";

    }


} catch (error) {

    console.error(
        "Failed to load products:",
        error
    );


    if (loadingText) {

        loadingText.textContent =
            "Unable to load products.";

    }


    showError(
        error.message
    );

}

}

/*
PRODUCT SELECTION
--------------------------------------------------------------------------
*/

function setupStockOutForm() {

const productSelect =
    document.getElementById(
        "product"
    );


const quantityInput =
    document.getElementById(
        "quantity"
    );


if (productSelect) {

    productSelect.addEventListener(
        "change",
        async () => {

            await loadSelectedProductStock();

        }
    );

}


if (quantityInput) {

    quantityInput.addEventListener(
        "input",
        validateQuantity
    );

}


const form =
    document.getElementById(
        "stockOutForm"
    );


if (form) {

    form.addEventListener(
        "submit",
        handleStockOut
    );

}

}

/*
LOAD CURRENT STOCK
--------------------------------------------------------------------------
*/

async function loadSelectedProductStock() {

const productSelect =
    document.getElementById(
        "product"
    );


const stockInfo =
    document.getElementById(
        "stockInfo"
    );


const availableStock =
    document.getElementById(
        "availableStock"
    );


const productId =
    productSelect.value;


if (!productId) {

    selectedProductStock = 0;


    if (stockInfo) {

        stockInfo.classList.add(
            "d-none"
        );

    }


    return;

}


try {

    const result =
        await stockOutRequest(
            INVENTORY_API +
            "/product/" +
            productId
        );


    const inventory =
        result.data;


    selectedProductStock =
        Number(
            inventory.quantity || 0
        );


} catch (error) {

    console.error(
        "Failed to load product inventory:",
        error
    );


    const selectedOption =
        productSelect.options[
            productSelect.selectedIndex
        ];


    selectedProductStock =
        Number(
            selectedOption.dataset.stock ||
            0
        );

}


if (availableStock) {

    availableStock.textContent =
        formatNumber(
            selectedProductStock
        );

}


if (stockInfo) {

    stockInfo.classList.remove(
        "d-none"
    );

}


validateQuantity();

}

/*
VALIDATE QUANTITY
--------------------------------------------------------------------------
*/

function validateQuantity() {

const quantityInput =
    document.getElementById(
        "quantity"
    );


const quantityHelp =
    document.getElementById(
        "quantityHelp"
    );


if (!quantityInput) {

    return false;

}


const quantity =
    Number(
        quantityInput.value
    );


quantityInput.classList.remove(
    "is-invalid"
);


if (
    quantity <= 0
) {

    if (quantityHelp) {

        quantityHelp.textContent =
            "Enter an amount greater than zero.";

    }


    return false;

}


if (
    quantity >
    selectedProductStock
) {

    quantityInput.classList.add(
        "is-invalid"
    );


    if (quantityHelp) {

        quantityHelp.textContent =
            "Insufficient stock. Only " +
            formatNumber(
                selectedProductStock
            ) +
            " yards are available.";

    }


    return false;

}


if (quantityHelp) {

    quantityHelp.textContent =
        "Stock available: " +
        formatNumber(
            selectedProductStock
        ) +
        " yards.";

}


return true;

}

/*
STOCK OUT
--------------------------------------------------------------------------
*/

async function handleStockOut(
event
) {

event.preventDefault();


hideMessages();


const productId =
    document.getElementById(
        "product"
    ).value;


const quantity =
    Number(
        document.getElementById(
            "quantity"
        ).value
    );


const reference =
    document.getElementById(
        "reference"
    ).value.trim();


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

    return;

}


if (
    quantity >
    selectedProductStock
) {

    showError(
        "Insufficient stock. Only " +
        formatNumber(
            selectedProductStock
        ) +
        " yards are available."
    );

    return;

}


setLoading(
    true
);


try {

    const result =
        await stockOutRequest(
            INVENTORY_API +
            "/stock-out",
            {
                method: "POST",

                body: JSON.stringify(
                    {
                        product_id:
                            Number(
                                productId
                            ),

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
        "Stock out response:",
        result
    );


    showSuccess(
        result.message ||
        "Stock removed successfully."
    );


    document
        .getElementById(
            "stockOutForm"
        )
        .reset();


    selectedProductStock =
        0;


    const stockInfo =
        document.getElementById(
            "stockInfo"
        );


    if (stockInfo) {

        stockInfo.classList.add(
            "d-none"
        );

    }


    setTimeout(
        () => {

            window.location.href =
                "inventory.html";

        },
        1200
    );


} catch (error) {

    console.error(
        "Stock out failed:",
        error
    );


    showError(
        error.message ||
        "Failed to remove stock."
    );

} finally {

    setLoading(
        false
    );

}

}

/*
LOADING STATE
--------------------------------------------------------------------------
*/

function setLoading(
loading
) {

const button =
    document.getElementById(
        "stockOutButton"
    );


const buttonText =
    document.getElementById(
        "stockOutButtonText"
    );


const spinner =
    document.getElementById(
        "stockOutSpinner"
    );


if (button) {

    button.disabled =
        loading;

}


if (buttonText) {

    buttonText.classList.toggle(
        "d-none",
        loading
    );

}


if (spinner) {

    spinner.classList.toggle(
        "d-none",
        !loading
    );

}

}

/*
MESSAGES
--------------------------------------------------------------------------
*/

function showError(
message
) {

const errorBox =
    document.getElementById(
        "stockOutError"
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
        "stockOutSuccess"
    );


if (!successBox) {

    return;

}


successBox.textContent =
    message ||
    "Stock removed successfully.";


successBox.classList.remove(
    "d-none"
);

}

function hideMessages() {

const errorBox =
    document.getElementById(
        "stockOutError"
    );


const successBox =
    document.getElementById(
        "stockOutSuccess"
    );


if (errorBox) {

    errorBox.classList.add(
        "d-none"
    );

}


if (successBox) {

    successBox.classList.add(
        "d-none"
    );

}

}

/*
NUMBER FORMAT
--------------------------------------------------------------------------
*/

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