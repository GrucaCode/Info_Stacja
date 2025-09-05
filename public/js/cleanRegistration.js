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
    updateSubmitState();
  });
}

["input", "change"].forEach(evt =>
  registerForm?.addEventListener(evt, updateSubmitState)
);
updateSubmitState();