// page dom
let date = document.getElementById("date"),
    saveButton = document.querySelector(".save"),
    deletedButton = document.querySelector(".deleted"),
    editButton = document.querySelector(".edit"),
    openButton = document.querySelector(".open"),
    linkseg = document.getElementById("linkseg"),
    addLinkButton = document.querySelector(".addLink"),
    cancelButton = document.querySelector(".cancel"),
    list = document.getElementById("list"),
    addList = document.getElementById("addList"),
    copyreadingList = [];

date.value = getToday();  // set date from tody
readingListQuery(date.value);

// Get current time
function getToday() {
    var tempDate = new Date();
    var year = tempDate.getFullYear();
    var month = tempDate.getMonth() + 1;
    var day = tempDate.getDate();
    month < 10 ? month = "0" + month : month;
    day < 10 ? day = "0" + day : day;
    return `${year}-${month}-${day}`
}
// Determine whether it is the same day
function isSameDay(startTime, endTime) {
    const startTimeMs = new Date(startTime).setHours(0, 0, 0, 0);
    const endTimeMs = new Date(endTime).setHours(0, 0, 0, 0);
    return startTimeMs == endTimeMs ? true : false
}
// reading List info
function readingListQuery(date, openStatus, copyreadingList) {
    let readingListArr = JSON.parse(localStorage.getItem("readingList"));
    let _ul = document.createElement("ul");
    list.innerHTML = "";
    if (readingListArr != null) {
        copyreadingList && copyreadingList.length > 0 ? readingListArr = copyreadingList : readingListArr;
        readingListArr.forEach((item, index) => {
            let { id, links, time, ckeck } = item;
            console.log(date, time)
            if (isSameDay(date, time) && openStatus) window.open(links, "_blank");
            if (isSameDay(date, time)) {
                let _li = document.createElement("li");
                let _input = document.createElement("input");
                _input.setAttribute("type", "checkbox");
                _input.setAttribute("name", "link");
                _input.setAttribute("data-id", id);
                _li.appendChild(_input);
                if (copyreadingList && copyreadingList.length > 0) {
                    let _inputCheck = document.createElement("input");
                    _inputCheck.setAttribute("name", "editInput");
                    _inputCheck.setAttribute("type", "text");
                    _inputCheck.setAttribute("data-id", id);
                    _inputCheck.setAttribute("value", links);
                    _li.appendChild(_inputCheck);
                } else {
                    let _a = document.createElement("a");
                    _a.setAttribute("target", "_blank");
                    _a.setAttribute("href", links);
                    _a.innerHTML = links;
                    _li.appendChild(_a);
                }
                let _span = document.createElement("span");
                _span.innerHTML = "x";
                _span.classList.add("del-item");
                _li.appendChild(_span);
                _ul.appendChild(_li);
            }
        })
        list.appendChild(_ul);
        delLinksItem(readingListArr);
    }
}
// delete item info
function delLinksItem(readingListArr) {
    let delItem = document.querySelectorAll(".del-item");
    delItem.forEach((item, index) => {
        item.onclick = () => {
            readingListArr.splice(index, 1);
            localStorage.setItem("readingList", JSON.stringify(readingListArr));
            readingListQuery(date.value);
        }
    })
}
// change date 
date.addEventListener("change", () => {
    readingListQuery(date.value);
})
// add link 
addLinkButton.addEventListener("click", () => {
    let linksegValue = linkseg.value,
        readingList = localStorage.getItem("readingList"),
        obj = {}, readingListArr = [];
    if (linksegValue == "") {
        alert("Cannot be empty");
        return;
    }
    if (readingList == null) {
        obj = { "id": 0, "links": linksegValue, "ckeck": false, "time": getToday() };
        readingListArr.push(obj);
        localStorage.setItem("readingList", JSON.stringify(readingListArr));
    } else {
        let readingListArr = JSON.parse(readingList);
        obj = { "id": readingListArr.length, "links": linksegValue, "ckeck": false, "time": getToday() };
        readingListArr.push(obj);
        localStorage.setItem("readingList", JSON.stringify(readingListArr));
    }
    linkseg.value = "";
    readingListQuery(date.value);
})
// cancel form info
cancelButton.addEventListener("click", () => {
    linkseg.value = "";
})
// add form info
addList.addEventListener("click", () => {
    addList.style.display = "none";
    list.style.overflowY = "scroll";
})
// open link click btn 
openButton.addEventListener("click", () => {
    readingListQuery(date.value, true)
})
// save readig list 
saveButton.addEventListener("click", () => {
    if (copyreadingList && copyreadingList.length > 0) {
        let checkboxInput = document.querySelectorAll("input[name='editInput']")
        checkboxInput.forEach((item, index) => {
            let i = copyreadingList.findIndex(v => v.id == item.getAttribute("data-id"))
            copyreadingList[i].links = item.value;
        })
        localStorage.setItem("readingList", JSON.stringify(copyreadingList));
        copyreadingList = [];
        readingListQuery(date.value)
    }
})
// edit links info
editButton.addEventListener("click", () => {
    let readingListArr = JSON.parse(localStorage.getItem("readingList"));
    copyreadingList = readingListArr.length > 0 ? JSON.parse(JSON.stringify(readingListArr)) : [];
    readingListQuery(date.value, false, copyreadingList)
})
// delete links info
deletedButton.addEventListener("click", () => {
    let checkboxInput = document.querySelectorAll("input[type='checkbox']"),
        readingListArr = JSON.parse(localStorage.getItem("readingList"));
    checkboxInput.forEach((item, index) => {
        if (item.checked) {
            let index = readingListArr.findIndex(v => v.id == item.getAttribute("data-id"));
            readingListArr.splice(index, 1);
            localStorage.setItem("readingList", JSON.stringify(readingListArr));
        }
    })
    readingListQuery(date.value)
})