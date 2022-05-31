// get page dom
let question = document.getElementById("question"),
    answer = document.getElementById("answer"),
    create = document.querySelector(".create"),
    deleted = document.querySelector(".delete"),
    save = document.querySelector(".save"),
    close = document.querySelector(".close"),
    flashcardsForm = document.querySelector(".flashcards-form"),
    flashcardsList = document.querySelector(".flashcards-list");

window.onload = function () {
    createFlashcards();
}
// Flashcards content
function createFlashcards() {
    let flashcardsInfo = JSON.parse(localStorage.getItem("flashcardsInfo"));
    flashcardsList.innerHTML = "";
    if (flashcardsInfo && flashcardsInfo.length > 0) {
        flashcardsInfo.forEach((v, i) => {
            let { question, answer } = v;
            let flashcardsItem = document.createElement("div");
            flashcardsItem.classList.add("flashcards-item");
            let flashcardsItemHead = document.createElement("div");
            flashcardsItemHead.classList.add("flashcards-item-head");
            let _p1 = document.createElement("p");
            _p1.innerHTML = `Question: ${question}`;
            let _p2 = document.createElement("p");
            _p2.innerHTML = `Answer: ${answer}`;
            flashcardsItem.appendChild(flashcardsItemHead);
            flashcardsItem.appendChild(_p1);
            flashcardsItem.appendChild(_p2);
            flashcardsList.appendChild(flashcardsItem);
        })
        showAnswer();
    }
}

// click item answer show
function showAnswer() {
    let flashcardsItem = document.querySelectorAll(".flashcards-item");
    flashcardsItem.forEach((v, i) => {
        v.onclick = function () {
            if (v.classList == "flashcards-item") {
                v.classList.add("active");
            } else {
                v.classList.remove("active");
            }
        }
    })
}

// create item
create.addEventListener("click", () => {
    flashcardsForm.style.display = "block";
})

// save Flashcards info
save.addEventListener("click", () => {
    let questionVal = question.value,
        answerVal = answer.value,
        flashcardsInfo = JSON.parse(localStorage.getItem("flashcardsInfo"));
    if (questionVal.length == "") {  // rule question
        alert("Question must be enter");
        return false;
    }
    if (answerVal.length == "") {  // rule answer
        alert("Answer must be enter");
        return false;
    }

    let obj = {
        "id": flashcardsInfo == null ? 0 : flashcardsInfo.length,
        "question": questionVal,
        "answer": answerVal
    }
    flashcardsInfo ? flashcardsInfo.push(obj) : flashcardsInfo = [obj];
    localStorage.setItem("flashcardsInfo", JSON.stringify(flashcardsInfo));
    createFlashcards();
    // reset question answer infomation
    question.value = "";
    answer.value = "";
})

// delete Flashcards content
deleted.addEventListener("click", () => {
    let flashcardsInfo = JSON.parse(localStorage.getItem("flashcardsInfo"));
    if (flashcardsInfo) {
        let val = confirm("Delete all questions and answers?");
        if (val) {
            localStorage.removeItem("flashcardsInfo");
            createFlashcards();
        }
    }
})

// close Flashcards form
close.addEventListener("click", () => {
    flashcardsForm.style.display = "none";
})
