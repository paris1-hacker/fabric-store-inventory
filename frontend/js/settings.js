const SETTINGS_API =
"/api/settings";

// ========================================
// PAGE INITIALIZATION
// ========================================

document.addEventListener(
"DOMContentLoaded",
() => {

    setupSidebar();

    loadUser();

    setupSettingsEvents();

    loadSettings();

}

);

// ========================================
// AUTHENTICATION
// ========================================

function getToken() {

return localStorage.getItem("token");

}

async function settingsRequest(
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

// ========================================
// LOAD USER FROM LOCAL STORAGE
// ========================================

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


    updateUserDisplay(user);


} catch (error) {

    console.error(
        "Failed to load user:",
        error
    );

}

}

// ========================================
// UPDATE USER DISPLAY
// ========================================

function updateUserDisplay(user) {

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

}

// ========================================
// SIDEBAR
// ========================================

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

// ========================================
// SETTINGS EVENTS
// ========================================

function setupSettingsEvents() {

const profileForm =
    document.getElementById(
        "profileForm"
    );


if (profileForm) {

    profileForm.addEventListener(
        "submit",
        handleProfileUpdate
    );

}


const passwordForm =
    document.getElementById(
        "passwordForm"
    );


if (passwordForm) {

    passwordForm.addEventListener(
        "submit",
        handlePasswordChange
    );

}


const storeForm =
    document.getElementById(
        "storeForm"
    );


if (storeForm) {

    storeForm.addEventListener(
        "submit",
        handleStoreUpdate
    );

}

}

// ========================================
// LOAD SETTINGS
// ========================================

async function loadSettings() {

showPageLoading();

hideAllMessages();


try {

    const result =
        await settingsRequest(
            SETTINGS_API
        );


    console.log(
        "Settings:",
        result
    );


    if (
        !result.success ||
        !result.data
    ) {

        throw new Error(
            "Unable to load settings"
        );

    }


    const profile =
        result.data.profile;


    const system =
        result.data.system;


    populateProfile(
        profile
    );


    populateSystemSettings(
        system
    );


    // Keep localStorage user information
    // synchronized with the database

    if (profile) {

        localStorage.setItem(
            "user",
            JSON.stringify(
                profile
            )
        );


        updateUserDisplay(
            profile
        );

    }


} catch (error) {

    console.error(
        "Failed to load settings:",
        error
    );


    showError(
        error.message
    );

} finally {

    hidePageLoading();

}

}

// ========================================
// POPULATE PROFILE
// ========================================

function populateProfile(
profile
) {

if (!profile) {

    return;

}


const nameInput =
    document.getElementById(
        "profileName"
    );


const emailInput =
    document.getElementById(
        "profileEmail"
    );


const roleInput =
    document.getElementById(
        "profileRole"
    );


const createdInput =
    document.getElementById(
        "profileCreatedAt"
    );


if (nameInput) {

    nameInput.value =
        profile.name || "";

}


if (emailInput) {

    emailInput.value =
        profile.email || "";

}


if (roleInput) {

    roleInput.value =
        profile.role || "";

}


if (createdInput) {

    createdInput.value =
        formatDate(
            profile.created_at
        );

}

}

// ========================================
// POPULATE SYSTEM SETTINGS
// ========================================

function populateSystemSettings(
settings
) {

if (!settings) {

    return;

}


const storeNameInput =
    document.getElementById(
        "storeName"
    );


if (storeNameInput) {

    storeNameInput.value =
        settings.store_name || "";

}


const updatedAt =
    document.getElementById(
        "settingsUpdatedAt"
    );


if (updatedAt) {

    updatedAt.textContent =
        settings.updated_at
            ? formatDate(
                settings.updated_at
            )
            : "-";

}

}

// ========================================
// UPDATE PROFILE
// ========================================

async function handleProfileUpdate(
event
) {

event.preventDefault();


hideAllMessages();


const nameInput =
    document.getElementById(
        "profileName"
    );


const emailInput =
    document.getElementById(
        "profileEmail"
    );


const name =
    nameInput
        ? nameInput.value.trim()
        : "";


const email =
    emailInput
        ? emailInput.value.trim()
        : "";


if (!name) {

    showError(
        "Name is required"
    );

    return;

}


if (!email) {

    showError(
        "Email is required"
    );

    return;

}


const submitButton =
    event.submitter;


setButtonLoading(
    submitButton,
    true,
    "Saving..."
);


try {

    const result =
        await settingsRequest(
            SETTINGS_API +
            "/profile",
            {
                method: "PUT",

                body: JSON.stringify({

                    name,
                    email

                })

            }
        );


    console.log(
        "Profile updated:",
        result
    );


    if (result.data) {

        localStorage.setItem(
            "user",
            JSON.stringify(
                result.data
            )
        );


        updateUserDisplay(
            result.data
        );


        populateProfile(
            result.data
        );

    }


    showSuccess(
        result.message ||
        "Profile updated successfully"
    );


} catch (error) {

    console.error(
        "Profile update failed:",
        error
    );


    showError(
        error.message
    );

} finally {

    setButtonLoading(
        submitButton,
        false,
        "Save Changes"
    );

}

}

// ========================================
// CHANGE PASSWORD
// ========================================

async function handlePasswordChange(
event
) {

event.preventDefault();


hideAllMessages();


const currentPasswordInput =
    document.getElementById(
        "currentPassword"
    );


const newPasswordInput =
    document.getElementById(
        "newPassword"
    );


const confirmPasswordInput =
    document.getElementById(
        "confirmPassword"
    );


const currentPassword =
    currentPasswordInput
        ? currentPasswordInput.value
        : "";


const newPassword =
    newPasswordInput
        ? newPasswordInput.value
        : "";


const confirmPassword =
    confirmPasswordInput
        ? confirmPasswordInput.value
        : "";


if (!currentPassword) {

    showError(
        "Current password is required"
    );

    return;

}


if (!newPassword) {

    showError(
        "New password is required"
    );

    return;

}


if (newPassword.length < 6) {

    showError(
        "New password must be at least 6 characters"
    );

    return;

}


if (
    newPassword !==
    confirmPassword
) {

    showError(
        "New passwords do not match"
    );

    return;

}


const submitButton =
    event.submitter;


setButtonLoading(
    submitButton,
    true,
    "Changing..."
);


try {

    const result =
        await settingsRequest(
            SETTINGS_API +
            "/password",
            {
                method: "PUT",

                body: JSON.stringify({

                    current_password:
                        currentPassword,

                    new_password:
                        newPassword

                })

            }
        );


    console.log(
        "Password changed:",
        result
    );


    showSuccess(
        result.message ||
        "Password changed successfully"
    );


    // Clear password fields

    if (currentPasswordInput) {

        currentPasswordInput.value =
            "";

    }


    if (newPasswordInput) {

        newPasswordInput.value =
            "";

    }


    if (confirmPasswordInput) {

        confirmPasswordInput.value =
            "";

    }


} catch (error) {

    console.error(
        "Password change failed:",
        error
    );


    showError(
        error.message
    );

} finally {

    setButtonLoading(
        submitButton,
        false,
        "Change Password"
    );

}

}

// ========================================
// UPDATE STORE NAME
// ========================================

async function handleStoreUpdate(
event
) {

event.preventDefault();


hideAllMessages();


const storeNameInput =
    document.getElementById(
        "storeName"
    );


const storeName =
    storeNameInput
        ? storeNameInput.value.trim()
        : "";


if (!storeName) {

    showError(
        "Store name is required"
    );

    return;

}


if (storeName.length > 150) {

    showError(
        "Store name must not exceed 150 characters"
    );

    return;

}


const submitButton =
    event.submitter;


setButtonLoading(
    submitButton,
    true,
    "Saving..."
);


try {

    const result =
        await settingsRequest(
            SETTINGS_API +
            "/store",
            {
                method: "PUT",

                body: JSON.stringify({

                    store_name:
                        storeName

                })

            }
        );


    console.log(
        "Store settings updated:",
        result
    );


    if (result.data) {

        populateSystemSettings(
            result.data
        );

    }


    showSuccess(
        result.message ||
        "Store name updated successfully"
    );


} catch (error) {

    console.error(
        "Store name update failed:",
        error
    );


    showError(
        error.message
    );

} finally {

    setButtonLoading(
        submitButton,
        false,
        "Save Changes"
    );

}

}

// ========================================
// BUTTON LOADING STATE
// ========================================

function setButtonLoading(
button,
loading,
text
) {

if (!button) {

    return;

}


if (loading) {

    button.disabled = true;


    button.dataset.originalText =
        button.innerHTML;


    button.innerHTML = `

        <span
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
        ></span>

        ${text}

    `;

} else {

    button.disabled = false;


    button.innerHTML =
        button.dataset.originalText ||
        text;

}

}

// ========================================
// SUCCESS MESSAGE
// ========================================

function showSuccess(
message
) {

const successBox =
    document.getElementById(
        "settingsSuccess"
    );


if (!successBox) {

    console.log(
        "Success:",
        message
    );

    return;

}


successBox.textContent =
    message ||
    "Operation completed successfully";


successBox.classList.remove(
    "d-none"
);


// Automatically hide after 4 seconds

setTimeout(
    () => {

        successBox.classList.add(
            "d-none"
        );

    },
    4000
);

}

// ========================================
// ERROR MESSAGE
// ========================================

function showError(
message
) {

const errorBox =
    document.getElementById(
        "settingsError"
    );


if (!errorBox) {

    console.error(
        message
    );

    return;

}


errorBox.textContent =
    message ||
    "Something went wrong";


errorBox.classList.remove(
    "d-none"
);

}

// ========================================
// HIDE MESSAGES
// ========================================

function hideAllMessages() {

const successBox =
    document.getElementById(
        "settingsSuccess"
    );


const errorBox =
    document.getElementById(
        "settingsError"
    );


if (successBox) {

    successBox.classList.add(
        "d-none"
    );

}


if (errorBox) {

    errorBox.classList.add(
        "d-none"
    );

}

}

// ========================================
// PAGE LOADING
// ========================================

function showPageLoading() {

const loading =
    document.getElementById(
        "settingsLoading"
    );


if (loading) {

    loading.classList.remove(
        "d-none"
    );

}

}

function hidePageLoading() {

const loading =
    document.getElementById(
        "settingsLoading"
    );


if (loading) {

    loading.classList.add(
        "d-none"
    );

}

}

// ========================================
// DATE FORMATTER
// ========================================

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


return date.toLocaleString(
    "en-NG",
    {

        dateStyle:
            "medium",

        timeStyle:
            "short"

    }
);

}