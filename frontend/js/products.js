                                                                        

const PRODUCTS_API =
"http://localhost:5000/api/products";

const CATEGORIES_API =
"http://localhost:5000/api/categories";

let currentPage = 1;

const productsPerPage = 10;

 /*                                                                         |
| -------------------------------------------------------------------------- |
| PAGE INITIALIZATION                                                        |
| -------------------------------------------------------------------------- |
| */                                                                         

document.addEventListener(
"DOMContentLoaded",
() => {


    setupSidebar();

    loadUser();

    setupProductEvents();

    loadCategories();

    loadProducts();

}


);

 /*                                                                         |
| -------------------------------------------------------------------------- |
| AUTHENTICATION TOKEN                                                       |
| -------------------------------------------------------------------------- |
| */                                                                         

function getToken() {


return localStorage.getItem("token");


}

/*                                                                         |
| -------------------------------------------------------------------------- |
| API REQUEST HELPER                                                         |
| -------------------------------------------------------------------------- |
| */                                                                         

async function productRequest(
url,
options = {}
) {


const token = getToken();


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
        `Bearer ${token}`

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

 /*                                                                         |
| -------------------------------------------------------------------------- |
| LOAD USER INFORMATION                                                      |
| -------------------------------------------------------------------------- |
| */                                                                         

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

/*                                                                         |
| -------------------------------------------------------------------------- |
| SIDEBAR                                                                    |
| -------------------------------------------------------------------------- |
| */                                                                         

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

/*                                                                         |
| -------------------------------------------------------------------------- |
| PRODUCT EVENTS                                                             |
| -------------------------------------------------------------------------- |
| */                                                                         

function setupProductEvents() {


/*
| Search
*/

const searchInput =
    document.getElementById(
        "productSearch"
    );


if (searchInput) {

    let searchTimeout;


    searchInput.addEventListener(
        "input",
        () => {

            clearTimeout(
                searchTimeout
            );


            searchTimeout =
                setTimeout(
                    () => {

                        currentPage = 1;

                        loadProducts();

                    },
                    400
                );

        }
    );

}


/*
| Category filter
*/

const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        () => {

            currentPage = 1;

            loadProducts();

        }
    );

}


/*
| Stock filter
*/

const stockFilter =
    document.getElementById(
        "stockFilter"
    );


if (stockFilter) {

    stockFilter.addEventListener(
        "change",
        () => {

            currentPage = 1;

            loadProducts();

        }
    );

}


/*
| Reset filters
*/

const resetButton =
    document.getElementById(
        "resetFilters"
    );


if (resetButton) {

    resetButton.addEventListener(
        "click",
        () => {

            if (searchInput) {

                searchInput.value =
                    "";

            }


            if (categoryFilter) {

                categoryFilter.value =
                    "";

            }


            if (stockFilter) {

                stockFilter.value =
                    "";

            }


            currentPage = 1;

            loadProducts();

        }
    );

}


/*
| Add product
*/

const addProductButton =
    document.getElementById(
        "addProductButton"
    );


if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "add-product.html";

        }
    );

}


}

 /*                                                                         |
| -------------------------------------------------------------------------- |
| LOAD CATEGORIES                                                            |
| -------------------------------------------------------------------------- |
| */                                                                         

async function loadCategories() {


const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );


if (!categoryFilter) {

    return;

}


try {

    const result =
        await productRequest(
            CATEGORIES_API
        );


    const categories =
        Array.isArray(result.data)
            ? result.data
            : [];


    categoryFilter.innerHTML = `

        <option value="">
            All Categories
        </option>

    `;


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category.id;


            option.textContent =
                category.name;


            categoryFilter.appendChild(
                option
            );

        }
    );


} catch (error) {

    console.error(
        "Failed to load categories:",
        error
    );

}


}

 /*                                                                         |
| -------------------------------------------------------------------------- |
| LOAD PRODUCTS                                                              |
| -------------------------------------------------------------------------- |
| */                                                                         

async function loadProducts() {


showLoading();

hideError();


try {

    const params =
        new URLSearchParams();


    /*
    | Search
    */

    const searchInput =
        document.getElementById(
            "productSearch"
        );


    if (
        searchInput &&
        searchInput.value.trim()
    ) {

        params.set(
            "search",
            searchInput.value.trim()
        );

    }


    /*
    | Category
    */

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    if (
        categoryFilter &&
        categoryFilter.value
    ) {

        params.set(
            "category_id",
            categoryFilter.value
        );

    }


    /*
    | Stock
    */

    const stockFilter =
        document.getElementById(
            "stockFilter"
        );


    if (
        stockFilter &&
        stockFilter.value ===
            "low_stock"
    ) {

        params.set(
            "low_stock",
            "true"
        );

    }


    if (
        stockFilter &&
        stockFilter.value ===
            "out_of_stock"
    ) {

        params.set(
            "out_of_stock",
            "true"
        );

    }


    /*
    | Pagination
    */

    params.set(
        "page",
        currentPage
    );


    params.set(
        "limit",
        productsPerPage
    );


    const url =
        `${PRODUCTS_API}?${params.toString()}`;


    const result =
        await productRequest(
            url
        );


    console.log(
        "Products:",
        result
    );


    const products =
        Array.isArray(result.data)
            ? result.data
            : [];


    renderProducts(
        products
    );


    renderPagination(
        result.pagination
    );


    updateProductCount(
        result.pagination,
        products.length
    );


} catch (error) {

    console.error(
        "Failed to load products:",
        error
    );


    showError(
        error.message
    );

}


}

 /*                                                                         |
| -------------------------------------------------------------------------- |
| RENDER PRODUCTS                                                            |
| -------------------------------------------------------------------------- |
| */                                                                         

function renderProducts(
products
) {


const tableBody =
    document.getElementById(
        "productsTableBody"
    );


const emptyState =
    document.getElementById(
        "productsEmpty"
    );


const tableWrapper =
    document.getElementById(
        "productsTableWrapper"
    );


if (!tableBody) {

    return;

}


tableBody.innerHTML =
    "";


if (
    !products ||
    products.length === 0
) {

    if (tableWrapper) {

        tableWrapper.classList.add(
            "d-none"
        );

    }


    if (emptyState) {

        emptyState.classList.remove(
            "d-none"
        );

    }


    hideLoading();

    return;

}


if (tableWrapper) {

    tableWrapper.classList.remove(
        "d-none"
    );

}


if (emptyState) {

    emptyState.classList.add(
        "d-none"
    );

}


products.forEach(
    product => {

        const row =
            document.createElement(
                "tr"
            );


        const stock =
            Number(
                product.stock_quantity ??
                product.quantity ??
                0
            );


        const price =
            Number(
                product.price_per_yard ??
                0
            );


        const status =
            getStockStatus(
                stock
            );


        row.innerHTML = `

            <td>

                <div class="d-flex align-items-center">

                    <div
                        class="stat-icon products-icon me-3"
                        style="
                            width:42px;
                            height:42px;
                            min-width:42px;
                        "
                    >

                        <i class="bi bi-box-seam"></i>

                    </div>


                    <div>

                        <strong>
                            ${escapeHtml(
                                product.name ||
                                "Unnamed Product"
                            )}
                        </strong>


                        <div class="small text-muted">

                            ${
                                escapeHtml(
                                    product.material ||
                                    product.color ||
                                    "Fabric"
                                )
                            }

                        </div>

                    </div>

                </div>

            </td>


            <td>

                ${escapeHtml(
                    product.category_name ||
                    product.category ||
                    "-"
                )}

            </td>


            <td>

                ${escapeHtml(
                    product.supplier_name ||
                    product.supplier ||
                    "-"
                )}

            </td>


            <td>

                ₦${formatNumber(
                    price
                )}

            </td>


            <td>

                <strong>
                    ${formatNumber(
                        stock
                    )}
                </strong>

                <span class="text-muted">
                    yards
                </span>

            </td>


            <td>

                ${status.badge}

            </td>


            <td class="text-end">

                <div class="dropdown">

                    <button
                        class="btn btn-sm btn-light border"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >

                        <i class="bi bi-three-dots-vertical"></i>

                    </button>


                    <ul class="dropdown-menu dropdown-menu-end">

                        <li>

                            <button
                                class="dropdown-item"
                                type="button"
                                onclick="viewProduct(${product.id})"
                            >

                                <i class="bi bi-eye me-2"></i>

                                View

                            </button>

                        </li>


                        <li>

                            <button
                                class="dropdown-item"
                                type="button"
                                onclick="editProduct(${product.id})"
                            >

                                <i class="bi bi-pencil me-2"></i>

                                Edit

                            </button>

                        </li>


                        <li>
                            <hr class="dropdown-divider">
                        </li>


                        <li>

                            <button
                                class="dropdown-item text-danger"
                                type="button"
                                onclick="deleteProduct(${product.id})"
                            >

                                <i class="bi bi-trash me-2"></i>

                                Delete

                            </button>

                        </li>

                    </ul>

                </div>

            </td>

        `;


        tableBody.appendChild(
            row
        );

    }
);


hideLoading();


}

 /*                                                                         |
| -------------------------------------------------------------------------- |
| STOCK STATUS                                                               |
| -------------------------------------------------------------------------- |
| */                                                                         

function getStockStatus(
stock
) {


if (
    stock <= 0
) {

    return {

        text: "Out of Stock",

        badge: `
            <span class="badge bg-danger-subtle text-danger">
                Out of Stock
            </span>
        `

    };

}


if (
    stock <= 10
) {

    return {

        text: "Low Stock",

        badge: `
            <span class="badge bg-warning-subtle text-warning-emphasis">
                Low Stock
            </span>
        `

    };

}


return {

    text: "In Stock",

    badge: `
        <span class="badge bg-success-subtle text-success">
            In Stock
        </span>
    `

};


}

 /*                                                                         |
| -------------------------------------------------------------------------- |
| PAGINATION                                                                 |
| -------------------------------------------------------------------------- |
| */                                                                         

function renderPagination(
pagination
) {


const container =
    document.getElementById(
        "productsPagination"
    );


if (!container) {

    return;

}


container.innerHTML =
    "";


if (!pagination) {

    return;

}


const current =
    Number(
        pagination.currentPage ??
        pagination.current_page ??
        currentPage
    );


const totalPages =
    Number(
        pagination.totalPages ??
        pagination.total_pages ??
        pagination.pages ??
        1
    );


if (
    totalPages <= 1
) {

    return;

}


const nav =
    document.createElement(
        "nav"
    );


const list =
    document.createElement(
        "ul"
    );


list.className =
    "pagination justify-content-end mb-0";


/*
| Previous
*/

const previous =
    document.createElement(
        "li"
    );


previous.className =
    `page-item ${
        current <= 1
            ? "disabled"
            : ""
    }`;


previous.innerHTML = `

    <button
        class="page-link"
        type="button"
    >

        <i class="bi bi-chevron-left"></i>

    </button>

`;


previous
    .querySelector("button")
    .addEventListener(
        "click",
        () => {

            if (
                current > 1
            ) {

                currentPage =
                    current - 1;

                loadProducts();

            }

        }
    );


list.appendChild(
    previous
);


/*
| Page numbers
*/

for (
    let page = 1;
    page <= totalPages;
    page++
) {

    /*
    | Keep pagination compact
    */

    if (
        totalPages > 7 &&
        page !== 1 &&
        page !== totalPages &&
        Math.abs(
            page - current
        ) > 2
    ) {

        continue;

    }


    const item =
        document.createElement(
            "li"
        );


    item.className =
        `page-item ${
            page === current
                ? "active"
                : ""
        }`;


    item.innerHTML = `

        <button
            class="page-link"
            type="button"
        >
            ${page}
        </button>

    `;


    item
        .querySelector("button")
        .addEventListener(
            "click",
            () => {

                currentPage =
                    page;

                loadProducts();

            }
        );


    list.appendChild(
        item
    );

}


/*
| Next
*/

const next =
    document.createElement(
        "li"
    );


next.className =
    `page-item ${
        current >= totalPages
            ? "disabled"
            : ""
    }`;


next.innerHTML = `

    <button
        class="page-link"
        type="button"
    >

        <i class="bi bi-chevron-right"></i>

    </button>

`;


next
    .querySelector("button")
    .addEventListener(
        "click",
        () => {

            if (
                current <
                totalPages
            ) {

                currentPage =
                    current + 1;

                loadProducts();

            }

        }
    );


list.appendChild(
    next
);


nav.appendChild(
    list
);


container.appendChild(
    nav
);


}

/*                                                                         |
| -------------------------------------------------------------------------- |
| PRODUCT COUNT                                                              |
| -------------------------------------------------------------------------- |
| */                                                                         

function updateProductCount(
pagination,
currentCount
) {


const countElement =
    document.getElementById(
        "productsCount"
    );


if (!countElement) {

    return;

}


const total =
    Number(
        pagination?.total ??
        pagination?.totalItems ??
        pagination?.total_items ??
        currentCount
    );


countElement.textContent =
    `${total} ${
        total === 1
            ? "product"
            : "products"
    }`;


}

 /*                                                                         |
| -------------------------------------------------------------------------- |
| VIEW PRODUCT                                                               |
| -------------------------------------------------------------------------- |
| */                                                                         

function viewProduct(
id
) {


window.location.href =
    `view-product.html?id=${id}`;


}

/*                                                                         |
| -------------------------------------------------------------------------- |
| EDIT PRODUCT                                                               |
| -------------------------------------------------------------------------- |
| */                                                                         

function editProduct(
id
) {


window.location.href =
    `edit-product.html?id=${id}`;


}

 /*                                                                         |
| -------------------------------------------------------------------------- |
| DELETE PRODUCT                                                             |
| -------------------------------------------------------------------------- |
| */                                                                         

async function deleteProduct(
id
) {


const confirmed =
    confirm(
        "Are you sure you want to delete this product?"
    );


if (!confirmed) {

    return;

}


try {

    const result =
        await productRequest(
            `${PRODUCTS_API}/${id}`,
            {
                method: "DELETE"
            }
        );


    alert(
        result.message ||
        "Product deleted successfully"
    );


    loadProducts();


} catch (error) {

    console.error(
        "Failed to delete product:",
        error
    );


    alert(
        error.message ||
        "Failed to delete product"
    );

}


}

/*                                                                         |
| -------------------------------------------------------------------------- |
| HTML ESCAPE                                                                |
| -------------------------------------------------------------------------- |
| */                                                                         

function escapeHtml(
value
) {


if (
    value === null ||
    value === undefined
) {

    return "";

}


return String(value)
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );


}

 /*                                                                         |
| -------------------------------------------------------------------------- |
| NUMBER FORMAT                                                              |
| -------------------------------------------------------------------------- |
| */                                                                         

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

 /*                                                                         |
| -------------------------------------------------------------------------- |
| LOADING STATE                                                              |
| -------------------------------------------------------------------------- |
| */                                                                         

function showLoading() {


const loading =
    document.getElementById(
        "productsLoading"
    );


if (loading) {

    loading.classList.remove(
        "d-none"
    );

}


const table =
    document.getElementById(
        "productsTableWrapper"
    );


if (table) {

    table.classList.add(
        "d-none"
    );

}


const empty =
    document.getElementById(
        "productsEmpty"
    );


if (empty) {

    empty.classList.add(
        "d-none"
    );

}


}

 /*                                                                         |
| -------------------------------------------------------------------------- |
| HIDE LOADING                                                               |
| -------------------------------------------------------------------------- |
| */                                                                         

function hideLoading() {


const loading =
    document.getElementById(
        "productsLoading"
    );


if (loading) {

    loading.classList.add(
        "d-none"
    );

}


}

 /*                                                                         |
| -------------------------------------------------------------------------- |
| ERROR                                                                      |
| -------------------------------------------------------------------------- |
| */                                                                         

function showError(
message
) {


hideLoading();


const errorBox =
    document.getElementById(
        "productsError"
    );


if (!errorBox) {

    return;

}


errorBox.textContent =
    message ||
    "Unable to load products.";


errorBox.classList.remove(
    "d-none"
);


}

 /*                                                                         |
| -------------------------------------------------------------------------- |
| HIDE ERROR                                                                 |
| -------------------------------------------------------------------------- |
| */                                                                         

function hideError() {


const errorBox =
    document.getElementById(
        "productsError"
    );


if (errorBox) {

    errorBox.classList.add(
        "d-none"
    );

}


}


