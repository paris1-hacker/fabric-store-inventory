document.addEventListener("DOMContentLoaded", () => {

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        handleLogin
    );

    setupPasswordToggle();

    return;
}

protectPage();

loadUserInformation();

setupLogout();

});

async function handleLogin(event) {

event.preventDefault();

const email =
    document.getElementById("email")
        .value
        .trim();

const password =
    document.getElementById("password")
        .value;

const errorBox =
    document.getElementById("loginError");

const button =
    document.getElementById("loginButton");

const buttonText =
    document.getElementById("loginButtonText");

const spinner =
    document.getElementById("loginSpinner");

errorBox.classList.add("d-none");

errorBox.textContent = "";

button.disabled = true;

buttonText.textContent =
    "Signing in...";

spinner.classList.remove("d-none");

try {

    const response =
        await apiPost(
            "/auth/login",
            {
                email,
                password
            }
        );

    console.log(
        "Login response:",
        response
    );

    const token =
        response.data.token;

    const user =
        response.data.user;

    if (!token) {

        throw new Error(
            "Login succeeded but no authentication token was returned."
        );

    }

    localStorage.setItem(
        "token",
        token
    );

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    console.log(
        "Authentication successful."
    );

    window.location.href =
        "dashboard.html";

} catch (error) {

    console.error(
        "Login failed:",
        error
    );

    errorBox.textContent =
        error.message ||
        "Invalid email or password.";

    errorBox.classList.remove(
        "d-none"
    );

} finally {

    button.disabled = false;

    buttonText.textContent =
        "Sign in";

    spinner.classList.add(
        "d-none"
    );

}

}

function protectPage() {

const token =
    localStorage.getItem("token");

const currentPage =
    window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

if (
    currentPage === "login.html" ||
    currentPage === "signup.html" ||
    currentPage === ""
) {
    return;
}

if (!token) {

    window.location.href =
        "login.html";

    return;
}


const userData =
    localStorage.getItem("user");

if (!userData) {

    localStorage.removeItem("token");

    window.location.href =
        "login.html";

    return;
}


let user;

try {

    user =
        JSON.parse(userData);

} catch (error) {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
        "login.html";

    return;
}


if (
    currentPage === "add-product.html" &&
    user.role !== "ADMIN"
) {

    alert(
        "You do not have permission to access this page."
    );

    window.location.href =
        "products.html";

    return;
}

}

function loadUserInformation() {

const userData =
    localStorage.getItem("user");

if (!userData) {
    return;
}

let user;

try {

    user =
        JSON.parse(userData);

} catch (error) {

    return;
}


const userName =
    document.getElementById("userName");

const userRole =
    document.getElementById("userRole");

const userAvatar =
    document.getElementById("userAvatar");


if (userName) {

    userName.textContent =
        user.name || "User";

}


if (userRole) {

    if (user.role === "ADMIN") {

        userRole.textContent =
            "Administrator";

    } else {

        userRole.textContent =
            "Staff";

    }

}


if (userAvatar) {

    const name =
        user.name || "U";

    userAvatar.textContent =
        name.charAt(0).toUpperCase();

}

}

function setupLogout() {

const logoutButton =
    document.getElementById("logoutButton");

if (!logoutButton) {
    return;
}

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

function setupPasswordToggle() {

const button =
    document.getElementById(
        "togglePassword"
    );

const password =
    document.getElementById(
        "password"
    );

if (!button || !password) {
    return;
}

button.addEventListener(
    "click",
    () => {

        if (
            password.type ===
            "password"
        ) {

            password.type =
                "text";

            button.innerHTML =
                '<i class="bi bi-eye-slash"></i>';

        } else {

            password.type =
                "password";

            button.innerHTML =
                '<i class="bi bi-eye"></i>';

        }

    }
);

}