let date = document.getElementById("date"),  //get date
    calendarList = document.querySelector(".calendar-list"),
    monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

window.onload = function () {
    date.value = getToday();
    createCalendarQuery(date.value);
}
// date change handle
date.addEventListener("change", () => {
    createCalendarQuery(date.value);
})
// calendar content list
function createCalendarQuery(date) {
    let taskList = JSON.parse(localStorage.getItem("taskList")),
        newArr = [];
    taskList.forEach((item, index) => {
        let { id, name, data } = item;
        if (data.length > 0) {
            data.forEach((dataItem, dataIndex) => {
                if (isToday(dataItem.startDate, date)) {
                    dataItem["pid"] = id;
                    dataItem["name"] = name;
                    newArr.push(dataItem);
                }
            })
        }
    })
    // Date sort
    newArr.sort((a, b) => { return b.time > a.time ? -1 : 1 });
    var arrayTwo = Object.values(newArr.reduce((res, item) => {
        res[item.time] ? res[item.time].push(item) : res[item.time] = [item];
        return res;
    }, {}));
    calendarList.innerHTML = "";
    arrayTwo.forEach((item, index) => {
        let calendarTime = document.createElement("p");
        calendarTime.classList.add("calendar-time");
        calendarTime.innerHTML = item[0].time;
        calendarList.appendChild(calendarTime);
        let calendarTask = document.createElement("div");
        calendarTask.classList.add("calendar-task");
        calendarTask.classList.add("d-flex");
        calendarTask.classList.add("d-flex-aic");
        item.forEach((itemData, itemIndex) => {
            let { name, title, description, startDate } = itemData;
            let _item = document.createElement("div");
            _item.classList.add("item");
            _item.classList.add(name.replace(/\s*/g, ""));
            let itemHead = document.createElement("div");
            itemHead.classList.add("item-head");
            itemHead.classList.add("d-flex");
            itemHead.classList.add("d-flex-aic");
            let _img = document.createElement("img");
            _img.src = "images/success.png";
            let span1 = document.createElement("span");
            span1.innerHTML = title;
            itemHead.appendChild(_img);
            itemHead.appendChild(span1);
            let itemDesc = document.createElement("div");
            itemDesc.classList.add("item-desc");
            let span2 = document.createElement("span");
            span2.innerHTML = description;
            itemDesc.appendChild(span2);
            let span3 = document.createElement("span");
            span3.classList.add("item-status");
            span3.classList.add("item-status");
            span3.innerHTML = `${name} ${monthText(startDate)} ${startDate.split("-")[2]}`;
            _item.appendChild(itemHead);
            _item.appendChild(itemDesc);
            _item.appendChild(span3);
            calendarTask.appendChild(_item);
        })
        calendarList.appendChild(calendarTask);
    })
}
// Get English month
function monthText(val) {
    var tempDate = new Date(val)
    return monthArr[tempDate.getMonth()];
}

// Judge whether it is today
function isToday(val, date) {
    return new Date(date).setHours(0, 0, 0, 0) == new Date(val).setHours(0, 0, 0, 0)
}
// Obtained on
function getToday() {
    var tempDate = new Date();
    var year = tempDate.getFullYear();
    var month = tempDate.getMonth() + 1;
    var day = tempDate.getDate();
    month < 10 ? month = "0" + month : month;
    day < 10 ? month = "0" + day : day;
    return `${year}-${month}-${day}`
}