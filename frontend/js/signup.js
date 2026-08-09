document.addEventListener("DOMContentLoaded", () => {

    const signupForm =
        document.getElementById("signupForm");


    signupForm.addEventListener(
        "submit",
        handleSignup
    );


    setupPasswordToggle();

});


/*
|--------------------------------------------------------------------------
| HANDLE SIGN UP
|--------------------------------------------------------------------------
*/

async function handleSignup(event) {

    // VERY IMPORTANT:
    // Prevent the browser from submitting the form as a GET request.
    event.preventDefault();


    const name =
        document.getElementById("name")
            .value
            .trim();


    const email =
        document.getElementById("signupEmail")
            .value
            .trim();


    const password =
        document.getElementById("signupPassword")
            .value;


    const role =
        document.getElementById("role")
            .value;


    const errorBox =
        document.getElementById("signupError");


    const successBox =
        document.getElementById("signupSuccess");


    const button =
        document.getElementById("signupButton");


    const buttonText =
        document.getElementById("signupButtonText");


    const spinner =
        document.getElementById("signupSpinner");


    // Clear previous messages

    errorBox.classList.add("d-none");
    successBox.classList.add("d-none");


    // Loading state

    button.disabled = true;

    buttonText.textContent =
        "Creating account...";

    spinner.classList.remove("d-none");


    try {

        /*
        |--------------------------------------------------------------------------
        | SEND DATA TO EXPRESS
        |--------------------------------------------------------------------------
        */

        const response =
            await apiPost(
                "/auth/register",
                {
                    name,
                    email,
                    password,
                    role
                }
            );


        console.log(
            "Registration successful:",
            response
        );


        /*
        |--------------------------------------------------------------------------
        | YOUR BACKEND RETURNS:
        |
        | response.data.user
        | response.data.token
        |--------------------------------------------------------------------------
        */

        const token =
            response.data.token;


        const user =
            response.data.user;


        // Save JWT

        localStorage.setItem(
            "token",
            token
        );


        // Save user

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        // Show success

        successBox.textContent =
            response.message ||
            "Account created successfully.";

        successBox.classList.remove(
            "d-none"
        );


        /*
        |--------------------------------------------------------------------------
        | REDIRECT TO DASHBOARD
        |--------------------------------------------------------------------------
        */

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 800);


    } catch (error) {

        console.error(
            "Registration failed:",
            error
        );


        errorBox.textContent =
            error.message ||
            "Unable to create account.";

        errorBox.classList.remove(
            "d-none"
        );


    } finally {

        button.disabled = false;

        buttonText.textContent =
            "Create account";

        spinner.classList.add(
            "d-none"
        );

    }

}


/*
|--------------------------------------------------------------------------
| PASSWORD SHOW / HIDE
|--------------------------------------------------------------------------
*/

function setupPasswordToggle() {

    const button =
        document.getElementById(
            "toggleSignupPassword"
        );


    const password =
        document.getElementById(
            "signupPassword"
        );


    button.addEventListener(
        "click",
        () => {

            if (password.type === "password") {

                password.type = "text";

                button.innerHTML =
                    '<i class="bi bi-eye-slash"></i>';

            } else {

                password.type = "password";

                button.innerHTML =
                    '<i class="bi bi-eye"></i>';

            }

        }
    );

}