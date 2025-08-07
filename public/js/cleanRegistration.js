const cleanBtn = document.querySelector(".clean-btn");
const registerForm = document.getElementById("register-form");

if (cleanBtn && registerForm) {
  cleanBtn.addEventListener("click", (e) => {
    e.preventDefault(); // zapobiega domyślnej akcji przycisku

    // Reset formularza
    registerForm.reset();

    // Wyczyść ewentualny komunikat
    document.getElementById("register-message").textContent = "";

    // Zablokuj i odszarz przycisk rejestracji po czyszczeniu
    const registerBtn = registerForm.querySelector(".data-register-submit-btn");
    const registerFrame = registerForm.querySelector(".data-submit-frame");
    if (registerBtn && registerFrame) {
      registerBtn.setAttribute("disabled", "true");
      registerBtn.classList.remove("active");
      registerFrame.classList.remove("frame-active");
    }
  });
}