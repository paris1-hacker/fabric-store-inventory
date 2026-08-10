/* =========================================================
FABRIC STORE - SUPPLIER MANAGEMENT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   CONFIG
===================================================== */

const API_BASE_URL = window.API_BASE_URL || "/api";


/* =====================================================
   ELEMENTS
===================================================== */

const tableBody =
    document.getElementById("suppliersTableBody");

const supplierCount =
    document.getElementById("supplierCount");

const searchInput =
    document.getElementById("searchSupplier");

const addSupplierButton =
    document.getElementById("addSupplierButton");

const supplierForm =
    document.getElementById("supplierForm");

const supplierModalElement =
    document.getElementById("supplierModal");

const deleteModalElement =
    document.getElementById("deleteSupplierModal");

const supplierModalTitle =
    document.getElementById("supplierModalTitle");

const supplierId =
    document.getElementById("supplierId");

const supplierName =
    document.getElementById("supplierName");

const contactPerson =
    document.getElementById("contactPerson");

const supplierPhone =
    document.getElementById("supplierPhone");

const supplierEmail =
    document.getElementById("supplierEmail");

const supplierAddress =
    document.getElementById("supplierAddress");

const saveSupplierButton =
    document.getElementById("saveSupplierButton");

const deleteSupplierName =
    document.getElementById("deleteSupplierName");

const confirmDeleteButton =
    document.getElementById("confirmDeleteButton");

const logoutButton =
    document.getElementById("logoutButton");

const menuToggle =
    document.getElementById("menuToggle");

const sidebar =
    document.getElementById("sidebar");

const userName =
    document.getElementById("userName");

const userRole =
    document.getElementById("userRole");

const userAvatar =
    document.getElementById("userAvatar");


/* =====================================================
   BOOTSTRAP MODALS
===================================================== */

const supplierModal =
    new bootstrap.Modal(supplierModalElement);

const deleteModal =
    new bootstrap.Modal(deleteModalElement);


/* =====================================================
   STATE
===================================================== */

let suppliers = [];

let supplierToDelete = null;


/* =====================================================
   TOKEN
===================================================== */

function getToken() {

    return (
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("token") ||
        ""
    );

}


/* =====================================================
   API HEADERS
===================================================== */

function getHeaders() {

    const token = getToken();

    return {

        "Content-Type": "application/json",

        ...(token
            ? {
                Authorization: `Bearer ${token}`
            }
            : {})

    };

}


/* =====================================================
   LOAD CURRENT USER
===================================================== */

async function loadCurrentUser() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/auth/me`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );


        if (!response.ok) {
            return;
        }


        const result =
            await response.json();


        if (!result.success || !result.data) {
            return;
        }


        const user =
            result.data;


        if (userName) {

            userName.textContent =
                user.name || "User";

        }


        if (userRole) {

            userRole.textContent =
                user.role === "ADMIN"
                    ? "Administrator"
                    : "Staff";

        }


        if (userAvatar) {

            userAvatar.textContent =
                (user.name || "U")
                    .charAt(0)
                    .toUpperCase();

        }


    } catch (error) {

        console.error(
            "Failed to load current user:",
            error
        );

    }

}


/* =====================================================
   LOAD SUPPLIERS
===================================================== */

async function loadSuppliers() {

    try {

        showLoading();


        const response = await fetch(
            `${API_BASE_URL}/suppliers`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to load suppliers"
            );

        }


        suppliers =
            result.data || [];


        renderSuppliers(suppliers);


    } catch (error) {

        console.error(error);

        showError(
            error.message ||
            "Unable to load suppliers."
        );

    }

}


/* =====================================================
   RENDER SUPPLIERS
===================================================== */

function renderSuppliers(data) {

    tableBody.innerHTML = "";


    supplierCount.textContent =
        `${data.length} ${
            data.length === 1
                ? "Supplier"
                : "Suppliers"
        }`;


    /* Empty state */

    if (data.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="text-center py-5"
                >

                    <div class="empty-state">

                        <i
                            class="bi bi-truck fs-1 text-muted"
                        ></i>

                        <h6 class="mt-3">
                            No suppliers found
                        </h6>

                        <p class="text-muted">
                            Add your first supplier.
                        </p>

                        <button
                            class="btn btn-primary btn-sm"
                            id="emptyAddSupplierButton"
                        >

                            <i
                                class="bi bi-plus-lg me-1"
                            ></i>

                            Add Supplier

                        </button>

                    </div>

                </td>

            </tr>

        `;


        const emptyButton =
            document.getElementById(
                "emptyAddSupplierButton"
            );


        if (emptyButton) {

            emptyButton.addEventListener(
                "click",
                openAddModal
            );

        }


        return;

    }


    /* Render rows */

    data.forEach((supplier, index) => {

        const row =
            document.createElement("tr");


        const createdDate =
            formatDate(
                supplier.created_at
            );


        row.innerHTML = `

            <td>
                ${index + 1}
            </td>


            <td>

                <div
                    class="d-flex align-items-center"
                >

                    <div
                        class="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center me-3"
                        style="width:40px;height:40px;"
                    >

                        <i class="bi bi-truck"></i>

                    </div>


                    <div>

                        <strong>
                            ${escapeHtml(
                                supplier.name
                            )}
                        </strong>

                    </div>

                </div>

            </td>


            <td>

                ${
                    supplier.contact_person
                        ? escapeHtml(
                            supplier.contact_person
                        )
                        : '<span class="text-muted">—</span>'
                }

            </td>


            <td>

                ${
                    supplier.phone
                        ? escapeHtml(
                            supplier.phone
                        )
                        : '<span class="text-muted">—</span>'
                }

            </td>


            <td>

                ${
                    supplier.email
                        ? escapeHtml(
                            supplier.email
                        )
                        : '<span class="text-muted">—</span>'
                }

            </td>


            <td>

                ${
                    supplier.address
                        ? escapeHtml(
                            supplier.address
                        )
                        : '<span class="text-muted">—</span>'
                }

            </td>


            <td>

                <span class="text-muted">
                    ${createdDate}
                </span>

            </td>


            <td class="text-end">

                <div
                    class="btn-group"
                    role="group"
                >

                    <button
                        type="button"
                        class="btn btn-sm btn-light edit-supplier-btn"
                        data-id="${supplier.id}"
                        title="Edit supplier"
                    >

                        <i class="bi bi-pencil"></i>

                    </button>


                    <button
                        type="button"
                        class="btn btn-sm btn-light text-danger delete-supplier-btn"
                        data-id="${supplier.id}"
                        title="Delete supplier"
                    >

                        <i class="bi bi-trash"></i>

                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(row);

    });


    attachActionButtons();

}


/* =====================================================
   ACTION BUTTONS
===================================================== */

function attachActionButtons() {


    document
        .querySelectorAll(".edit-supplier-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.id;

                    openEditModal(id);

                }
            );

        });


    document
        .querySelectorAll(".delete-supplier-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.id;

                    openDeleteModal(id);

                }
            );

        });

}


/* =====================================================
   OPEN ADD MODAL
===================================================== */

function openAddModal() {

    supplierForm.reset();

    supplierId.value = "";


    supplierModalTitle.textContent =
        "Add Supplier";


    saveSupplierButton.innerHTML = `

        <i class="bi bi-check-lg me-1"></i>

        Save Supplier

    `;


    supplierModal.show();


    setTimeout(() => {

        supplierName.focus();

    }, 300);

}


/* =====================================================
   OPEN EDIT MODAL
===================================================== */

function openEditModal(id) {

    const supplier =
        suppliers.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!supplier) {

        alert(
            "Supplier information could not be found."
        );

        return;

    }


    supplierId.value =
        supplier.id;


    supplierName.value =
        supplier.name || "";


    contactPerson.value =
        supplier.contact_person || "";


    supplierPhone.value =
        supplier.phone || "";


    supplierEmail.value =
        supplier.email || "";


    supplierAddress.value =
        supplier.address || "";


    supplierModalTitle.textContent =
        "Edit Supplier";


    saveSupplierButton.innerHTML = `

        <i class="bi bi-check-lg me-1"></i>

        Update Supplier

    `;


    supplierModal.show();

}


/* =====================================================
   SAVE SUPPLIER
===================================================== */

supplierForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const id =
            supplierId.value.trim();


        const name =
            supplierName.value.trim();


        const contact_person =
            contactPerson.value.trim();


        const phone =
            supplierPhone.value.trim();


        const email =
            supplierEmail.value.trim();


        const address =
            supplierAddress.value.trim();


        if (!name) {

            alert(
                "Supplier name is required."
            );

            supplierName.focus();

            return;

        }


        try {

            setButtonLoading(true);


            const method =
                id ? "PUT" : "POST";


            const url =
                id
                    ? `${API_BASE_URL}/suppliers/${id}`
                    : `${API_BASE_URL}/suppliers`;


            const response =
                await fetch(
                    url,
                    {
                        method,
                        headers: getHeaders(),

                        body: JSON.stringify({

                            name,

                            contact_person:
                                contact_person || null,

                            phone:
                                phone || null,

                            email:
                                email || null,

                            address:
                                address || null

                        })

                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to save supplier."
                );

            }


            supplierModal.hide();


            alert(
                result.message ||
                (
                    id
                        ? "Supplier updated successfully."
                        : "Supplier created successfully."
                )
            );


            await loadSuppliers();


        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Something went wrong."
            );


        } finally {

            setButtonLoading(false);

        }

    }
);


/* =====================================================
   OPEN DELETE MODAL
===================================================== */

function openDeleteModal(id) {

    const supplier =
        suppliers.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!supplier) {
        return;
    }


    supplierToDelete =
        supplier.id;


    deleteSupplierName.textContent =
        supplier.name;


    deleteModal.show();

}


/* =====================================================
   DELETE SUPPLIER
===================================================== */

confirmDeleteButton.addEventListener(
    "click",
    async () => {

        if (!supplierToDelete) {
            return;
        }


        try {

            confirmDeleteButton.disabled =
                true;


            confirmDeleteButton.innerHTML = `

                <span
                    class="spinner-border spinner-border-sm me-1"
                ></span>

                Deleting...

            `;


            const response =
                await fetch(
                    `${API_BASE_URL}/suppliers/${supplierToDelete}`,
                    {
                        method: "DELETE",
                        headers: getHeaders()
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Unable to delete supplier."
                );

            }


            deleteModal.hide();


            alert(
                result.message ||
                "Supplier deleted successfully."
            );


            supplierToDelete =
                null;


            await loadSuppliers();


        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Unable to delete supplier."
            );


        } finally {

            confirmDeleteButton.disabled =
                false;

            confirmDeleteButton.textContent =
                "Delete";

        }

    }
);


/* =====================================================
   SEARCH
===================================================== */

searchInput.addEventListener(
    "input",
    () => {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();


        if (!search) {

            renderSuppliers(
                suppliers
            );

            return;

        }


        const filtered =
            suppliers.filter(
                supplier => {

                    const name =
                        (
                            supplier.name ||
                            ""
                        ).toLowerCase();


                    const contact =
                        (
                            supplier.contact_person ||
                            ""
                        ).toLowerCase();


                    const phone =
                        (
                            supplier.phone ||
                            ""
                        ).toLowerCase();


                    const email =
                        (
                            supplier.email ||
                            ""
                        ).toLowerCase();


                    const address =
                        (
                            supplier.address ||
                            ""
                        ).toLowerCase();


                    return (
                        name.includes(search) ||
                        contact.includes(search) ||
                        phone.includes(search) ||
                        email.includes(search) ||
                        address.includes(search)
                    );

                }
            );


        renderSuppliers(
            filtered
        );

    }
);


/* =====================================================
   BUTTON LOADING
===================================================== */

function setButtonLoading(
    isLoading
) {

    saveSupplierButton.disabled =
        isLoading;


    if (isLoading) {

        saveSupplierButton.innerHTML = `

            <span
                class="spinner-border spinner-border-sm me-1"
            ></span>

            Saving...

        `;

    } else {

        const id =
            supplierId.value.trim();


        saveSupplierButton.innerHTML = `

            <i class="bi bi-check-lg me-1"></i>

            ${
                id
                    ? "Update Supplier"
                    : "Save Supplier"
            }

        `;

    }

}


/* =====================================================
   LOADING STATE
===================================================== */

function showLoading() {

    tableBody.innerHTML = `

        <tr>

            <td
                colspan="8"
                class="text-center py-5"
            >

                <div
                    class="spinner-border text-primary"
                ></div>

                <p class="text-muted mt-2 mb-0">
                    Loading suppliers...
                </p>

            </td>

        </tr>

    `;

}


/* =====================================================
   ERROR STATE
===================================================== */

function showError(message) {

    tableBody.innerHTML = `

        <tr>

            <td
                colspan="8"
                class="text-center py-5"
            >

                <i
                    class="bi bi-exclamation-circle text-danger fs-2"
                ></i>


                <h6 class="mt-3">
                    Unable to load suppliers
                </h6>


                <p class="text-muted">
                    ${escapeHtml(message)}
                </p>


                <button
                    class="btn btn-primary btn-sm"
                    id="retrySuppliersButton"
                >

                    <i
                        class="bi bi-arrow-clockwise me-1"
                    ></i>

                    Try Again

                </button>

            </td>

        </tr>

    `;


    const retryButton =
        document.getElementById(
            "retrySuppliersButton"
        );


    if (retryButton) {

        retryButton.addEventListener(
            "click",
            loadSuppliers
        );

    }

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(dateString) {

    if (!dateString) {
        return "—";
    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

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


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

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


/* =====================================================
   SIDEBAR MOBILE TOGGLE
===================================================== */

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


/* =====================================================
   LOGOUT
===================================================== */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {
                return;
            }


            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "authToken"
            );

            sessionStorage.removeItem(
                "token"
            );


            window.location.href =
                "index.html";

        }
    );

}


/* =====================================================
   ADD SUPPLIER BUTTON
===================================================== */

if (addSupplierButton) {

    addSupplierButton.addEventListener(
        "click",
        openAddModal
    );

}


/* =====================================================
   INITIALIZE
===================================================== */

loadCurrentUser();

loadSuppliers();

});