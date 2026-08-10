const INVENTORY_API =
    "/api/inventory";

let currentPage = 1;

const inventoryPerPage = 10;


document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupSidebar();

        loadUser();

        setupInventoryEvents();

        loadInventory();

    }
);


function getToken() {

    return localStorage.getItem("token");

}


async function inventoryRequest(
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


function setupInventoryEvents() {

    const searchInput =
        document.getElementById(
            "inventorySearch"
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

                            loadInventory();

                        },
                        400
                    );

            }
        );

    }


    const statusFilter =
        document.getElementById(
            "inventoryStatus"
        );


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            () => {

                currentPage = 1;

                loadInventory();

            }
        );

    }


    const resetButton =
        document.getElementById(
            "resetInventoryFilters"
        );


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            () => {

                if (searchInput) {

                    searchInput.value =
                        "";

                }


                if (statusFilter) {

                    statusFilter.value =
                        "";

                }


                currentPage = 1;

                loadInventory();

            }
        );

    }


    const stockInButton =
        document.getElementById(
            "stockInButton"
        );


    if (stockInButton) {

        stockInButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "stock-in.html";

            }
        );

    }


    const stockOutButton =
        document.getElementById(
            "stockOutButton"
        );


    if (stockOutButton) {

        stockOutButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "stock-out.html";

            }
        );

    }

}


async function loadInventory() {

    showLoading();

    hideError();


    try {

        const params =
            new URLSearchParams();


        const searchInput =
            document.getElementById(
                "inventorySearch"
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


        const statusFilter =
            document.getElementById(
                "inventoryStatus"
            );


        if (
            statusFilter &&
            statusFilter.value
        ) {

            params.set(
                "status",
                statusFilter.value
            );

        }


        params.set(
            "page",
            currentPage
        );


        params.set(
            "limit",
            inventoryPerPage
        );


        let url =
            INVENTORY_API;


        const query =
            params.toString();


        if (query) {

            url =
                INVENTORY_API +
                "?" +
                query;

        }


        const result =
            await inventoryRequest(
                url
            );


        console.log(
            "Inventory:",
            result
        );


        const inventory =
            Array.isArray(result.data)
                ? result.data
                : [];


        renderInventory(
            inventory
        );


        renderPagination(
            result.pagination
        );


        updateInventoryCount(
            result.pagination,
            inventory.length
        );


        updateInventoryStats(
            inventory,
            result.pagination
        );


    } catch (error) {

        console.error(
            "Failed to load inventory:",
            error
        );


        showError(
            error.message
        );

    }

}


function renderInventory(
    inventory
) {

    const tableBody =
        document.getElementById(
            "inventoryTableBody"
        );


    const tableWrapper =
        document.getElementById(
            "inventoryTableWrapper"
        );


    const emptyState =
        document.getElementById(
            "inventoryEmpty"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML =
        "";


    if (
        !inventory ||
        inventory.length === 0
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


    inventory.forEach(
        item => {

            const row =
                document.createElement(
                    "tr"
                );


            const quantity =
                Number(
                    item.quantity ??
                    item.stock_quantity ??
                    0
                );


            const status =
                getInventoryStatus(
                    quantity
                );


            const productName =
                item.product_name ||
                item.name ||
                "Unknown Product";


            const categoryName =
                item.category_name ||
                item.category ||
                "-";


            const supplierName =
                item.supplier_name ||
                item.supplier ||
                "-";


            const productId =
                item.product_id ||
                item.id;


            row.innerHTML =
                '<td>' +

                    '<div class="d-flex align-items-center">' +

                        '<div ' +
                            'class="stat-icon products-icon me-3" ' +
                            'style="width:42px;height:42px;min-width:42px;"' +
                        '>' +

                            '<i class="bi bi-box-seam"></i>' +

                        '</div>' +

                        '<div>' +

                            '<strong>' +
                                escapeHtml(
                                    productName
                                ) +
                            '</strong>' +

                            '<div class="small text-muted">' +
                                'Inventory #' +
                                escapeHtml(
                                    String(
                                        productId || "-"
                                    )
                                ) +
                            '</div>' +

                        '</div>' +

                    '</div>' +

                '</td>' +


                '<td>' +
                    escapeHtml(
                        categoryName
                    ) +
                '</td>' +


                '<td>' +
                    escapeHtml(
                        supplierName
                    ) +
                '</td>' +


                '<td>' +

                    '<strong>' +
                        formatNumber(
                            quantity
                        ) +
                    '</strong> ' +

                    '<span class="text-muted">' +
                        'yards' +
                    '</span>' +

                '</td>' +


                '<td>' +
                    status.badge +
                '</td>' +


                '<td class="text-end">' +

                    '<button ' +
                        'class="btn btn-sm btn-light border" ' +
                        'type="button" ' +
                        'onclick="viewInventoryProduct(' +
                            productId +
                        ')"' +
                    '>' +

                        '<i class="bi bi-eye me-1"></i>' +
                        'View' +

                    '</button>' +

                '</td>';


            tableBody.appendChild(
                row
            );

        }
    );


    hideLoading();

}


function getInventoryStatus(
    quantity
) {

    if (
        quantity <= 0
    ) {

        return {

            text: "Out of Stock",

            badge:
                '<span class="badge bg-danger-subtle text-danger">' +
                    'Out of Stock' +
                '</span>'

        };

    }


    if (
        quantity <= 10
    ) {

        return {

            text: "Low Stock",

            badge:
                '<span class="badge bg-warning-subtle text-warning-emphasis">' +
                    'Low Stock' +
                '</span>'

        };

    }


    return {

        text: "In Stock",

        badge:
            '<span class="badge bg-success-subtle text-success">' +
                'In Stock' +
            '</span>'

    };

}


function renderPagination(
    pagination
) {

    const container =
        document.getElementById(
            "inventoryPagination"
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
        "pagination mb-0";


    const previous =
        document.createElement(
            "li"
        );


    previous.className =
        "page-item";


    if (
        current <= 1
    ) {

        previous.classList.add(
            "disabled"
        );

    }


    previous.innerHTML =
        '<button class="page-link" type="button">' +
            '<i class="bi bi-chevron-left"></i>' +
        '</button>';


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

                    loadInventory();

                }

            }
        );


    list.appendChild(
        previous
    );


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

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
            "page-item";


        if (
            page === current
        ) {

            item.classList.add(
                "active"
            );

        }


        item.innerHTML =
            '<button class="page-link" type="button">' +
                page +
            '</button>';


        item
            .querySelector("button")
            .addEventListener(
                "click",
                () => {

                    currentPage =
                        page;

                    loadInventory();

                }
            );


        list.appendChild(
            item
        );

    }


    const next =
        document.createElement(
            "li"
        );


    next.className =
        "page-item";


    if (
        current >= totalPages
    ) {

        next.classList.add(
            "disabled"
        );

    }


    next.innerHTML =
        '<button class="page-link" type="button">' +
            '<i class="bi bi-chevron-right"></i>' +
        '</button>';


    next
        .querySelector("button")
        .addEventListener(
            "click",
            () => {

                if (
                    current < totalPages
                ) {

                    currentPage =
                        current + 1;

                    loadInventory();

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


function updateInventoryCount(
    pagination,
    currentCount
) {

    const countElement =
        document.getElementById(
            "inventoryCount"
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
        total +
        " " +
        (
            total === 1
                ? "product"
                : "products"
        );

}


function updateInventoryStats(
    inventory,
    pagination
) {

    const totalProducts =
        document.getElementById(
            "totalInventoryProducts"
        );


    const totalStock =
        document.getElementById(
            "totalInventoryStock"
        );


    const lowStock =
        document.getElementById(
            "inventoryLowStock"
        );


    let stockTotal = 0;

    let lowStockTotal = 0;


    inventory.forEach(
        item => {

            const quantity =
                Number(
                    item.quantity ??
                    item.stock_quantity ??
                    0
                );


            stockTotal +=
                quantity;


            if (
                quantity > 0 &&
                quantity <= 10
            ) {

                lowStockTotal++;

            }

        }
    );


    if (totalProducts) {

        totalProducts.textContent =
            pagination?.total ??
            inventory.length;

    }


    if (totalStock) {

        totalStock.textContent =
            formatNumber(
                stockTotal
            );

    }


    if (lowStock) {

        lowStock.textContent =
            lowStockTotal;

    }

}


function viewInventoryProduct(
    productId
) {

    if (!productId) {

        return;

    }


    window.location.href =
        "view-product.html?id=" +
        productId;

}


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


function showLoading() {

    const loading =
        document.getElementById(
            "inventoryLoading"
        );


    if (loading) {

        loading.classList.remove(
            "d-none"
        );

    }


    const table =
        document.getElementById(
            "inventoryTableWrapper"
        );


    if (table) {

        table.classList.add(
            "d-none"
        );

    }


    const empty =
        document.getElementById(
            "inventoryEmpty"
        );


    if (empty) {

        empty.classList.add(
            "d-none"
        );

    }

}


function hideLoading() {

    const loading =
        document.getElementById(
            "inventoryLoading"
        );


    if (loading) {

        loading.classList.add(
            "d-none"
        );

    }

}


function showError(
message
) {

    hideLoading();


    const errorBox =
        document.getElementById(
            "inventoryError"
        );


    if (!errorBox) {

        return;

    }


    errorBox.textContent =
        message ||
        "Unable to load inventory.";


    errorBox.classList.remove(
        "d-none"
    );

}


function hideError() {

    const errorBox =
        document.getElementById(
            "inventoryError"
        );


    if (errorBox) {

        errorBox.classList.add(
            "d-none"
        );

    }

}