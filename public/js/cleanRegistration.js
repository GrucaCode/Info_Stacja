// const cleanBtn = document.querySelector(".clean-btn");
// const registerForm = document.getElementById("register-form");

// if (cleanBtn && registerForm) {
//   cleanBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     registerForm.reset();
//     document.getElementById("register-message").textContent = "";

//     const registerBtn = registerForm.querySelector(".data-register-submit-btn");
//     const registerFrame = registerForm.querySelector(".data-submit-frame");
    
//     if (registerBtn && registerFrame) {
//       registerBtn.setAttribute("disabled", "true");
//       registerBtn.classList.remove("active");
//       registerFrame.classList.remove("frame-active");
//     }
//   });
// }

const cleanBtn = document.querySelector(".clean-btn");
const registerForm = document.getElementById("register-form");
const registerBtn = registerForm?.querySelector(".data-register-submit-btn");
const registerFrame = registerForm?.querySelector(".data-submit-frame");

function updateSubmitState() {
  if (!registerForm || !registerBtn || !registerFrame) return;
  const { firstName, lastName, email, password } = registerForm;
  const ready = [firstName, lastName, email, password].every(i => i.value.trim());
  registerBtn.disabled = !ready;
  registerBtn.classList.toggle("active", ready);
  registerFrame.classList.toggle("frame-active", ready);
}

if (cleanBtn && registerForm) {
  cleanBtn.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.reset();
    document.getElementById("register-message").textContent = "";
    updateSubmitState(); // zostaw wyłączone po czyszczeniu
  });
}

// nasłuchuj wpisywania, żeby aktywować przycisk
["input", "change"].forEach(evt =>
  registerForm?.addEventListener(evt, updateSubmitState)
);
updateSubmitState();