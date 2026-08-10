document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

    requireAuthentication();

    loadCurrentUser();

    setupLogout();

    loadDashboard();

});
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("show");
    });
}


/*
|--------------------------------------------------------------------------
| LOAD ENTIRE DASHBOARD
|--------------------------------------------------------------------------
*/

async function loadDashboard() {

    await Promise.all([
        loadSummary(),
        loadLowStock(),
        loadRecentMovements()
    ]);

}


/*
|--------------------------------------------------------------------------
| SUMMARY
|--------------------------------------------------------------------------
*/
async function loadSummary() {

    try {

        const response =
            await apiGet("/dashboard/summary");

        console.log(
            "Dashboard summary:",
            response
        );


        if (!response.success) {

            throw new Error(
                response.message ||
                "Failed to load dashboard summary."
            );

        }


        const data =
            response.data;


        /*
        |--------------------------------------------------------------------------
        | UPDATE SUMMARY CARDS
        |--------------------------------------------------------------------------
        */

        const totalProducts =
            document.getElementById(
                "totalProducts"
            );


        const totalStock =
            document.getElementById(
                "totalStock"
            );


        const lowStockProducts =
            document.getElementById(
                "lowStockProducts"
            );


        const outOfStockProducts =
            document.getElementById(
                "outOfStockProducts"
            );


        if (totalProducts) {

            totalProducts.textContent =
                Number(
                    data.total_products
                ).toLocaleString();

        }


        if (totalStock) {

            totalStock.textContent =
                Number(
                    data.total_stock
                ).toLocaleString(
                    undefined,
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                );

        }


        if (lowStockProducts) {

            lowStockProducts.textContent =
                Number(
                    data.low_stock_products
                ).toLocaleString();

        }


        if (outOfStockProducts) {

            outOfStockProducts.textContent =
                Number(
                    data.out_of_stock_products
                ).toLocaleString();

        }


    } catch (error) {

        console.error(
            "Failed to load dashboard summary:",
            error
        );

    }

}

/*
|--------------------------------------------------------------------------
| LOW STOCK
|--------------------------------------------------------------------------
*/
async function loadLowStock() {

    const container =
        document.getElementById("lowStockList");

    const counter =
        document.getElementById("lowStockCount");


    try {

        const response = await apiGet(
            "/dashboard/low-stock"
        );


        console.log(
            "Low stock:",
            response
        );


        /*
        |--------------------------------------------------------------------------
        | YOUR BACKEND RETURNS:
        |
        | {
        |     success: true,
        |     count: 0,
        |     data: []
        | }
        |--------------------------------------------------------------------------
        */

        const products =
            response.data || [];


        /*
        |--------------------------------------------------------------------------
        | UPDATE COUNT
        |--------------------------------------------------------------------------
        */

        counter.textContent =
            response.count ?? products.length;


        /*
        |--------------------------------------------------------------------------
        | NO LOW-STOCK PRODUCTS
        |--------------------------------------------------------------------------
        */

        if (products.length === 0) {

            container.innerHTML = `
                <div class="empty-state">

                    <i
                        class="bi bi-check-circle-fill
                        text-success fs-3 mb-2"
                    ></i>

                    <div>
                        All products have sufficient stock.
                    </div>

                    <small>
                        No products currently need attention.
                    </small>

                </div>
            `;

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | DISPLAY LOW-STOCK PRODUCTS
        |--------------------------------------------------------------------------
        */

        container.innerHTML =
            products.map(product => {

                return `
                    <div class="low-stock-item">

                        <div class="low-stock-info">

                            <span class="low-stock-name">

                                ${escapeHTML(
                                    product.name
                                )}

                            </span>

                            <span class="low-stock-category">

                                ${escapeHTML(
                                    product.category_name ||
                                    "Uncategorized"
                                )}

                            </span>

                        </div>


                        <span class="low-stock-quantity">

                            ${Number(
                                product.quantity || 0
                            ).toFixed(2)} yd

                        </span>

                    </div>
                `;

            }).join("");


    } catch (error) {

        console.error(
            "Failed to load low stock:",
            error
        );


        counter.textContent = "—";


        container.innerHTML = `
            <div class="empty-state text-danger">

                <i
                    class="bi bi-exclamation-circle fs-4 mb-2"
                ></i>

                <div>
                    Unable to load low-stock products.
                </div>

            </div>
        `;

    }

}

/*
|--------------------------------------------------------------------------
| RECENT MOVEMENTS
|--------------------------------------------------------------------------
*/

async function loadRecentMovements() {

    const container =
        document.getElementById("recentMovementsList");

    const counter =
        document.getElementById("recentMovementCount");


    try {

        const response =
            await apiGet(
                "/dashboard/recent-movements"
            );


        console.log(
            "Recent movements:",
            response
        );


        const movements =
            response.data || [];


        /*
        |--------------------------------------------------------------------------
        | UPDATE COUNT
        |--------------------------------------------------------------------------
        */

        if (counter) {

            counter.textContent =
                response.count ?? movements.length;

        }


        /*
        |--------------------------------------------------------------------------
        | EMPTY STATE
        |--------------------------------------------------------------------------
        */

        if (movements.length === 0) {

            container.innerHTML = `
                <div class="empty-state">

                    <i
                        class="bi bi-clock-history fs-3 mb-2"
                    ></i>

                    <div>
                        No recent stock movements.
                    </div>

                    <small>
                        Stock-in and stock-out activity
                        will appear here.
                    </small>

                </div>
            `;

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | DISPLAY MOVEMENTS
        |--------------------------------------------------------------------------
        */

        container.innerHTML =
            movements.map(movement => {

                const isStockIn =
                    movement.movement_type === "IN";


                const movementClass =
                    isStockIn
                        ? "text-success"
                        : "text-danger";


                const movementIcon =
                    isStockIn
                        ? "bi-arrow-down-circle-fill"
                        : "bi-arrow-up-circle-fill";


                const movementLabel =
                    isStockIn
                        ? "Stock In"
                        : "Stock Out";


                const quantity =
                    Number(
                        movement.quantity || 0
                    ).toFixed(2);


                const date =
                    formatMovementDate(
                        movement.created_at
                    );


                return `
                    <div class="movement-item">


                        <div class="movement-icon ${movementClass}">

                            <i
                                class="bi ${movementIcon}"
                            ></i>

                        </div>


                        <div class="movement-info">

                            <div class="movement-product">

                                ${escapeHTML(
                                    movement.product_name ||
                                    "Unknown product"
                                )}

                            </div>


                            <div class="movement-meta">

                                ${movementLabel}

                                ${movement.reference
                                    ? ` • ${escapeHTML(
                                        movement.reference
                                    )}`
                                    : ""
                                }

                                ${date
                                    ? ` • ${date}`
                                    : ""
                                }

                            </div>

                        </div>


                        <div class="movement-quantity ${movementClass}">

                            ${isStockIn ? "+" : "-"}${quantity} yd

                        </div>


                    </div>
                `;

            }).join("");


    } catch (error) {

        console.error(
            "Failed to load recent movements:",
            error
        );


        if (counter) {
            counter.textContent = "—";
        }


        container.innerHTML = `
            <div class="empty-state text-danger">

                <i
                    class="bi bi-exclamation-circle fs-4 mb-2"
                ></i>

                <div>
                    Unable to load recent movements.
                </div>

            </div>
        `;

    }

}

function formatMovementDate(dateValue) {

    if (!dateValue) {
        return "";
    }


    const date =
        new Date(dateValue);


    if (Number.isNaN(date.getTime())) {
        return "";
    }


    return date.toLocaleString(
        undefined,
        {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }


    const div =
        document.createElement("div");


    div.textContent =
        String(value);


    return div.innerHTML;

}

/*
|--------------------------------------------------------------------------
| FORMAT DATE
|--------------------------------------------------------------------------
*/

function formatDate(value) {

    if (!value) {
        return "—";
    }


    const date = new Date(value);


    if (Number.isNaN(date.getTime())) {
        return "—";
    }


    return date.toLocaleDateString(
        "en-NG",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/*
|--------------------------------------------------------------------------
| PREVENT HTML INJECTION
|--------------------------------------------------------------------------
*/

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/*
|--------------------------------------------------------------------------
| REQUIRE AUTHENTICATION
|--------------------------------------------------------------------------
*/

function requireAuthentication() {

    const token =
        localStorage.getItem("token");


    if (!token) {

        window.location.href =
            "login.html";

        return false;
    }


    return true;
}


/*
|--------------------------------------------------------------------------
| LOAD CURRENT USER
|--------------------------------------------------------------------------
*/

function loadCurrentUser() {

    const storedUser =
        localStorage.getItem("user");


    if (!storedUser) {
        return;
    }


    try {

        const user =
            JSON.parse(storedUser);


        const nameElement =
            document.getElementById("userName");


        const roleElement =
            document.getElementById("userRole");


        const avatarElement =
            document.getElementById("userAvatar");


        if (nameElement) {

            nameElement.textContent =
                user.name || "User";

        }


        if (roleElement) {

            roleElement.textContent =
                user.role || "STAFF";

        }


        if (
            avatarElement &&
            user.name
        ) {

            avatarElement.textContent =
                user.name
                    .charAt(0)
                    .toUpperCase();

        }


    } catch (error) {

        console.error(
            "Failed to load user:",
            error
        );

    }

}


/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        () => {

            /*
            | Remove authentication information
            */

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );


            /*
            | Return to login
            */

            window.location.href =
                "login.html";

        }
    );

}