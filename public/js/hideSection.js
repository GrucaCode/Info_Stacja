const dataDropUpBtn = document.querySelector(".data-drop-up");
const dataSec = document.querySelector(".data-data-sec");
const dataText = document.querySelector(".data-drop-up-text");
const dataIcon = document.querySelector(".data-drop-up-icon");

const toggleSection = (e) => {
    dataSec.classList.toggle('hide');
    if (dataSec.classList.contains('hide')) {
        dataSec.style.display ="none";
        dataText.textContent = "rozwiń sekcję";
        dataIcon.textContent = "arrow_drop_down";
    } else {
        dataSec.style.display ="block";
        dataText.textContent = "zwiń sekcję";
        dataIcon.textContent = "arrow_drop_up";
    }
}

dataDropUpBtn.addEventListener('click', toggleSection);
