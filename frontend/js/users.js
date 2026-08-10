const USERS_API =
    "/api/users";

let allUsers = [];

let filteredUsers = [];



document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupSidebar();

        loadUser();

        setupUserEvents();

        loadUsers();

    }
);



// AUTHENTICATION

function getToken() {

    return localStorage.getItem(
        "token"
    );

}



async function userRequest(
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


    if (
        response.status === 403
    ) {

        throw new Error(
            result.message ||
            "You do not have permission to manage users."
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



// LOAD CURRENT USER

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



// SIDEBAR

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



// USER EVENTS

function setupUserEvents() {

    const addUserButton =
        document.getElementById(
            "addUserButton"
        );


    if (addUserButton) {

        addUserButton.addEventListener(
            "click",
            () => {

                openUserModal();

            }
        );

    }


    const refreshButton =
        document.getElementById(
            "refreshUsers"
        );


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            () => {

                loadUsers();

            }
        );

    }

}



// LOAD USERS

async function loadUsers() {

    showLoading();

    hideError();


    try {

        const result =
            await userRequest(
                USERS_API
            );


        console.log(
            "Users:",
            result
        );


        allUsers =
            Array.isArray(
                result.data
            )
                ? result.data
                : [];


        filteredUsers =
            [...allUsers];


        updateUserCount(
            filteredUsers.length
        );


        renderUsers(
            filteredUsers
        );


    } catch (error) {

        console.error(
            "Failed to load users:",
            error
        );


        showError(
            error.message
        );

    }

}



// RENDER USERS

function renderUsers(
    users
) {

    const tableBody =
        document.getElementById(
            "usersTableBody"
        );


    const tableWrapper =
        document.getElementById(
            "usersTableWrapper"
        );


    const emptyState =
        document.getElementById(
            "usersEmpty"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML =
        "";


    if (
        !users ||
        users.length === 0
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


    users.forEach(
        user => {

            const row =
                document.createElement(
                    "tr"
                );


            const name =
                user.name ||
                "Unknown User";


            const email =
                user.email ||
                "-";


            const role =
                String(
                    user.role ||
                    "STAFF"
                ).toUpperCase();


            const avatar =
                name
                    .charAt(0)
                    .toUpperCase();


            const createdAt =
                formatDate(
                    user.created_at
                );


            const roleBadge =
                role === "ADMIN"

                    ? `
                        <span class="badge bg-primary-subtle text-primary">
                            <i class="bi bi-shield-check me-1"></i>
                            Admin
                        </span>
                    `

                    : `
                        <span class="badge bg-secondary-subtle text-secondary">
                            <i class="bi bi-person me-1"></i>
                            Staff
                        </span>
                    `;


            row.innerHTML = `

                <td>

                    <div class="d-flex align-items-center">

                        <div
                            class="avatar me-3"
                            style="
                                width:40px;
                                height:40px;
                                min-width:40px;
                            "
                        >

                            ${escapeHtml(
                                avatar
                            )}

                        </div>


                        <div>

                            <strong>
                                ${escapeHtml(
                                    name
                                )}
                            </strong>

                        </div>

                    </div>

                </td>


                <td>

                    ${escapeHtml(
                        email
                    )}

                </td>


                <td>

                    ${roleBadge}

                </td>


                <td>

                    <span class="text-muted">

                        ${createdAt}

                    </span>

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
                                    onclick="editUser(${user.id})"
                                >

                                    <i class="bi bi-pencil me-2"></i>

                                    Edit

                                </button>

                            </li>


                            <li>

                                <button
                                    class="dropdown-item text-danger"
                                    type="button"
                                    onclick="deleteUser(${user.id})"
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



// USER COUNT

function updateUserCount(
    count
) {

    const countElement =
        document.getElementById(
            "usersCount"
        );


    if (!countElement) {

        return;

    }


    countElement.textContent =
        `${count} ${
            count === 1
                ? "user"
                : "users"
        }`;

}



// OPEN USER MODAL

function openUserModal(
    user = null
) {

    const existingModal =
        document.getElementById(
            "userModal"
        );


    if (existingModal) {

        existingModal.remove();

    }


    const isEdit =
        Boolean(user);


    const modalHtml = `

        <div
            class="modal fade"
            id="userModal"
            tabindex="-1"
            aria-hidden="true"
        >

            <div class="modal-dialog modal-dialog-centered">

                <div class="modal-content">

                    <div class="modal-header">

                        <div>

                            <h5 class="modal-title">

                                ${
                                    isEdit
                                        ? "Edit User"
                                        : "Add User"
                                }

                            </h5>

                            <small class="text-muted">

                                ${
                                    isEdit
                                        ? "Update this user account."
                                        : "Create a new system user."
                                }

                            </small>

                        </div>


                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>

                    </div>


                    <div class="modal-body">

                        <div
                            id="userFormError"
                            class="alert alert-danger d-none"
                        ></div>


                        <form id="userForm">

                            <div class="mb-3">

                                <label
                                    for="userNameInput"
                                    class="form-label"
                                >
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    id="userNameInput"
                                    class="form-control"
                                    placeholder="Enter full name"
                                    value="${
                                        isEdit
                                            ? escapeAttribute(
                                                user.name
                                            )
                                            : ""
                                    }"
                                    required
                                >

                            </div>


                            <div class="mb-3">

                                <label
                                    for="userEmailInput"
                                    class="form-label"
                                >
                                    Email
                                </label>

                                <input
                                    type="email"
                                    id="userEmailInput"
                                    class="form-control"
                                    placeholder="Enter email address"
                                    value="${
                                        isEdit
                                            ? escapeAttribute(
                                                user.email
                                            )
                                            : ""
                                    }"
                                    required
                                >

                            </div>


                            <div class="mb-3">

                                <label
                                    for="userRoleInput"
                                    class="form-label"
                                >
                                    Role
                                </label>

                                <select
                                    id="userRoleInput"
                                    class="form-select"
                                >

                                    <option
                                        value="STAFF"
                                        ${
                                            !isEdit ||
                                            user.role === "STAFF"
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        Staff
                                    </option>

                                    <option
                                        value="ADMIN"
                                        ${
                                            isEdit &&
                                            user.role === "ADMIN"
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        Admin
                                    </option>

                                </select>

                            </div>


                            <div class="mb-3">

                                <label
                                    for="userPasswordInput"
                                    class="form-label"
                                >

                                    Password

                                    ${
                                        isEdit
                                            ? '<span class="text-muted">(leave blank to keep current password)</span>'
                                            : ""
                                    }

                                </label>


                                <input
                                    type="password"
                                    id="userPasswordInput"
                                    class="form-control"
                                    placeholder="${
                                        isEdit
                                            ? "Leave blank to keep password"
                                            : "Enter password"
                                    }"
                                    ${
                                        !isEdit
                                            ? "required"
                                            : ""
                                    }
                                >

                            </div>


                            <div class="d-flex justify-content-end gap-2">

                                <button
                                    type="button"
                                    class="btn btn-light border"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    class="btn btn-primary"
                                    id="saveUserButton"
                                >

                                    ${
                                        isEdit
                                            ? "Update User"
                                            : "Create User"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>

    `;


    document.body.insertAdjacentHTML(
        "beforeend",
        modalHtml
    );


    const modalElement =
        document.getElementById(
            "userModal"
        );


    const modal =
        new bootstrap.Modal(
            modalElement
        );


    const form =
        document.getElementById(
            "userForm"
        );


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            await saveUser(
                isEdit
                    ? user.id
                    : null
            );

        }
    );


    modalElement.addEventListener(
        "hidden.bs.modal",
        () => {

            modalElement.remove();

        }
    );


    modal.show();

}



// SAVE USER

async function saveUser(
    userId
) {

    const nameInput =
        document.getElementById(
            "userNameInput"
        );


    const emailInput =
        document.getElementById(
            "userEmailInput"
        );


    const roleInput =
        document.getElementById(
            "userRoleInput"
        );


    const passwordInput =
        document.getElementById(
            "userPasswordInput"
        );


    const errorBox =
        document.getElementById(
            "userFormError"
        );


    const saveButton =
        document.getElementById(
            "saveUserButton"
        );


    const name =
        nameInput.value.trim();


    const email =
        emailInput.value.trim();


    const role =
        roleInput.value;


    const password =
        passwordInput.value;


    if (!name) {

        showFormError(
            "Name is required."
        );

        return;

    }


    if (!email) {

        showFormError(
            "Email is required."
        );

        return;

    }


    if (
        !userId &&
        !password
    ) {

        showFormError(
            "Password is required."
        );

        return;

    }


    if (
        password &&
        password.length < 6
    ) {

        showFormError(
            "Password must be at least 6 characters."
        );

        return;

    }


    saveButton.disabled =
        true;


    saveButton.textContent =
        userId
            ? "Updating..."
            : "Creating...";


    errorBox.classList.add(
        "d-none"
    );


    try {

        const payload = {

            name,
            email,
            role

        };


        if (password) {

            payload.password =
                password;

        }


        let result;


        if (userId) {

            result =
                await userRequest(
                    `${USERS_API}/${userId}`,
                    {
                        method: "PUT",

                        body:
                            JSON.stringify(
                                payload
                            )
                    }
                );

        } else {

            payload.password =
                password;


            result =
                await userRequest(
                    USERS_API,
                    {
                        method: "POST",

                        body:
                            JSON.stringify(
                                payload
                            )
                    }
                );

        }


        alert(
            result.message ||
            (
                userId
                    ? "User updated successfully"
                    : "User created successfully"
            )
        );


        const modalElement =
            document.getElementById(
                "userModal"
            );


        const modal =
            bootstrap.Modal.getInstance(
                modalElement
            );


        if (modal) {

            modal.hide();

        }


        await loadUsers();


    } catch (error) {

        console.error(
            "Failed to save user:",
            error
        );


        showFormError(
            error.message ||
            "Unable to save user."
        );


        saveButton.disabled =
            false;


        saveButton.textContent =
            userId
                ? "Update User"
                : "Create User";

    }

}



// EDIT USER

function editUser(
    id
) {

    const user =
        allUsers.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!user) {

        alert(
            "User information could not be found."
        );

        return;

    }


    openUserModal(
        user
    );

}



// DELETE USER

async function deleteUser(
    id
) {

    const user =
        allUsers.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!user) {

        alert(
            "User information could not be found."
        );

        return;

    }


    const confirmed =
        confirm(
            `Are you sure you want to delete ${user.name}?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const result =
            await userRequest(
                `${USERS_API}/${id}`,
                {
                    method: "DELETE"
                }
            );


        alert(
            result.message ||
            "User deleted successfully"
        );


        await loadUsers();


    } catch (error) {

        console.error(
            "Failed to delete user:",
            error
        );


        alert(
            error.message ||
            "Failed to delete user."
        );

    }

}



// FORM ERROR

function showFormError(
    message
) {

    const errorBox =
        document.getElementById(
            "userFormError"
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



// FORMAT DATE

function formatDate(
    dateValue
) {

    if (!dateValue) {

        return "-";

    }


    const date =
        new Date(
            dateValue
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(
            dateValue
        );

    }


    return date.toLocaleDateString(
        "en-NG",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}



// ESCAPE HTML

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



// ESCAPE ATTRIBUTE

function escapeAttribute(
    value
) {

    return escapeHtml(
        value
    );

}



// LOADING

function showLoading() {

    const loading =
        document.getElementById(
            "usersLoading"
        );


    const table =
        document.getElementById(
            "usersTableWrapper"
        );


    const empty =
        document.getElementById(
            "usersEmpty"
        );


    if (loading) {

        loading.classList.remove(
            "d-none"
        );

    }


    if (table) {

        table.classList.add(
            "d-none"
        );

    }


    if (empty) {

        empty.classList.add(
            "d-none"
        );

    }

}



// HIDE LOADING

function hideLoading() {

    const loading =
        document.getElementById(
            "usersLoading"
        );


    if (loading) {

        loading.classList.add(
            "d-none"
        );

    }

}



// ERROR

function showError(
    message
) {

    hideLoading();


    const errorBox =
        document.getElementById(
            "usersError"
        );


    if (!errorBox) {

        return;

    }


    errorBox.textContent =
        message ||
        "Unable to load users.";


    errorBox.classList.remove(
        "d-none"
    );

}



// HIDE ERROR

function hideError() {

    const errorBox =
        document.getElementById(
            "usersError"
        );


    if (errorBox) {

        errorBox.classList.add(
            "d-none"
        );

    }

}