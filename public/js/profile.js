document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login-section");
  const registerSection = document.getElementById("register-section");
  const userSection = document.getElementById("user-section");
  const userNameSpans = document.querySelectorAll(".user-name");

  const toggleToLoginBtn = document.getElementById("show-login");
  const toggleToRegisterBtn = document.getElementById("show-register");

  const seePassBtn = document.querySelector(".see-pass-btn");
  const passwordInput = document.getElementById("login-password");
  const visibilityIcon = document.getElementById("eye-opened-icon");
  const seePassText = document.querySelector(".data-see-pass-text");

  const loginEmail = document.querySelector("#login-form input[name='email']");
  const loginPassword = document.querySelector("#login-form input[name='password']");
  const loginBtn = document.querySelector(".data-login-submit-btn");
  const loginFrame = document.querySelector(".data-submit-frame");

  const firstNameEl = document.getElementById("user-firstName");
  const lastNameEl = document.getElementById("user-lastName");
  const emailEl = document.getElementById("user-email");

  const registerFirstName = document.querySelector("#register-form input[name='firstName']");
  const registerLastName = document.querySelector("#register-form input[name='lastName']");
  const registerEmail = document.querySelector("#register-form input[name='email']");
  const registerPassword = document.querySelector("#register-form input[name='password']");
  const registerBtn = document.querySelector(".data-register-submit-btn");
  const registerFrame = document.querySelector(".register-submit-btn__frame");

  const params = new URLSearchParams(window.location.search);
  const view = params.get("view")

  if (view === "login") {
    loginSection.style.display = "block";
    registerSection.style.display = "none";
  }   else if (view === "register") {
    loginSection.style.display = "none";
    registerSection.style.display = "block";
  }
  else {
    // Domyślna sytuacja – jeśli użytkownik nie jest zalogowany
    // loginSection.style.display = "block";
    // registerSection.style.display = "none";
    userSection.style.display = "none";
    if (view === "register") {
      loginSection.style.display = "none";
      registerSection.style.display = "block";
    } else {
      loginSection.style.display = "block";
      registerSection.style.display = "none";
    }
  }
  
  
  // 🧠 Przełączanie widoku
  if (toggleToLoginBtn) {
    toggleToLoginBtn.addEventListener("click", () => {
      registerSection.style.display = "none";
      loginSection.style.display = "block";
    });
  }

  if (toggleToRegisterBtn) {
    toggleToRegisterBtn.addEventListener("click", () => {
      loginSection.style.display = "none";
      registerSection.style.display = "block";
    });
  }

  // 🔍 Sprawdzenie logowania
  fetch('/api/me')
    .then(res => res.json())
    .then(data => {
      if (data.loggedIn) {
        loginSection.style.display = "none";
        registerSection.style.display = "none";
        userSection.style.display = "block";
        userNameSpans.forEach(span => span.textContent = data.user.firstName);

        if (firstNameEl && lastNameEl && emailEl) {
          firstNameEl.textContent = data.user.firstName;
          lastNameEl.textContent = data.user.lastName;
          emailEl.textContent = data.user.email;
        }
      } else {
        loginSection.style.display = "block";
        registerSection.style.display = "none";
        userSection.style.display = "none";
      }
    });

  // 🔐 Logowanie
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email.value,
        password: form.password.value
      })
    });

    const data = await res.json();
    if (data.success) {
      window.location.reload();
    } else {
      document.getElementById("login-message").textContent = data.message || "Błąd logowania";
    }
  });

  // 🔴 Wylogowanie
  // const logoutBtn = document.getElementById("logout-btn");
  // if (logoutBtn) {
  //   logoutBtn.addEventListener("click", async () => {
  //     await fetch("/api/logout", { method: "POST" });
  //     location.reload();
  //   });
  // }
  const logoutBtn = document.getElementById("logout-btn");
  const logoutBtnProfile = document.querySelector(".data-logout-btn");

  function handleLogout() {
    fetch("/api/logout", { method: "POST" })
      .then(() => location.reload());
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
  if (logoutBtnProfile) {
    logoutBtnProfile.addEventListener("click", handleLogout);
  }

  // 📝 Rejestracja
  document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        password: form.password.value
      })
    });

    const data = await res.json();

    if (data.success) {
      document.getElementById("register-message").textContent = "Zarejestrowano pomyślnie!";
      form.reset();
      window.location.reload();
    } else {
      document.getElementById("register-message").textContent = data.message || "Błąd rejestracji";
    }
  });



  if (seePassBtn && passwordInput && visibilityIcon) {
    seePassBtn.addEventListener("click", (e) => {
      e.preventDefault(); // zapobiega wysłaniu formularza

      const isVisible = passwordInput.type === "text";
      passwordInput.type = isVisible ? "password" : "text";
      visibilityIcon.textContent = isVisible ? "visibility" : "visibility_off";
      seePassText.textContent = isVisible ? "Zobacz hasło" : "Ukryj hasło";
    });
  }

  function validateLoginInputs() {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.value.trim());
    const passwordValid = loginPassword.value.trim().length > 0;

    if (emailValid && passwordValid) {
      loginBtn.classList.add("active");
      loginBtn.removeAttribute("disabled");
      loginFrame.classList.add("frame-active");
    } else {
      loginBtn.classList.remove("active");
      loginFrame.classList.remove("frame-active");
      
    }
  }

  function validateRegisterInputs() {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail.value.trim());
    const passwordValid = registerPassword.value.trim().length > 0;
    const firstNameValid = registerFirstName.value.trim().length > 0;
    const lastNameValid = registerLastName.value.trim().length > 0;

    if (emailValid && passwordValid && firstNameValid && lastNameValid) {
      registerBtn.classList.add("active");
      registerBtn.removeAttribute("disabled");
      registerFrame.classList.add("frame-active");
    } else {
      registerBtn.classList.remove("active");
      // registerBtn.setAttribute("disabled", true);
      registerFrame.classList.remove("frame-active");
    }
  } 


  //Nasłuchiwanie zmian w inputach
  loginEmail.addEventListener("input", validateLoginInputs);
  loginPassword.addEventListener("input", validateLoginInputs);


  registerFirstName.addEventListener("input", validateRegisterInputs);
  registerLastName.addEventListener("input", validateRegisterInputs);
  registerEmail.addEventListener("input", validateRegisterInputs);
  registerPassword.addEventListener("input", validateRegisterInputs);

});

