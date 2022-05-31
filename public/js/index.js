// get page dom
let todayTime = document.querySelector(".todayTime"),
	task = document.getElementById("task"),
	addTask = document.querySelector(".add-task"),
	modal = document.querySelector(".modal"),
	close = document.getElementById("close"),
	cancel = document.getElementById("cancel"),
	save = document.getElementById("save"),
	session = document.getElementById("session"),
	title = document.getElementById("title"),
	time = document.getElementById("time"),
	startDate = document.getElementById("startDate"),
	dueDate = document.getElementById("dueDate"),
	description = document.getElementById("description"),
	grade = document.getElementById("grade"),
	taskModalTitle = document.querySelector(".taskModalTitle"),
	taskModalTitleStatus = "add",
	tableBody = document.getElementById("tableBody"),
	monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

window.onload = function () {
	todayTime.innerHTML = getToday();
	taskLocalStorage();
	taskBoardQuery();
}
// add task 
addTask.addEventListener("click", () => {
	resetForm();
	taskModalTitleStatus = "add";
	taskModalTitle.innerHTML = "New Task";
	save.innerHTML = "Save";
	modal.style.display = "block";
})
// close task 
close.addEventListener("click", () => {
	modal.style.display = "none";
})
// cancel task 
cancel.addEventListener("click", () => {
	modal.style.display = "none";
})
// save / edit task
save.addEventListener("click", () => {
	let taskList = JSON.parse(localStorage.getItem("taskList")),
		sessionValue = session.value,
		titleValue = title.value,
		timeValue = time.value,
		startDateValue = startDate.value,
		dueDateValue = dueDate.value,
		descriptionValue = description.value,
		gradeValue = grade.value;
	if (titleValue == "") {  // rule title
		alert("title must be enter");
		return;
	}
	if (startDateValue == "") {  // rule startDate
		alert("start date must be enter");
		return;
	}
	if (dueDateValue == "") { // rule dueDate
		alert("due date must be enter");
		return;
	}
	if (checkDate(startDateValue, dueDateValue)) { // rule startDate / dueDate
		alert("due date Cannot exceed start date");
		return;
	}

	if (taskList.length > 0) {
		if (taskModalTitleStatus == "add") {
			let index = taskList.findIndex(item => item.id == sessionValue);
			let _id = taskList[index].data.length;
			let obj = {
				"id": _id == 0 ? 0 : _id,
				"title": titleValue,
				"time": timeValue,
				"startDate": startDateValue,
				"dueDate": dueDateValue,
				"description": descriptionValue,
				"grade": gradeValue
			}
			taskList[index].data.push(obj);
		} else {
			let dataIdVal = document.getElementById("session-id").value,
				dataAidVal = document.getElementById("task-id").value;
			if (session.value == taskList[dataIdVal].id) {
				taskList[dataIdVal].data[dataAidVal]["title"] = titleValue;
				taskList[dataIdVal].data[dataAidVal]["time"] = timeValue;
				taskList[dataIdVal].data[dataAidVal]["startDate"] = startDateValue;
				taskList[dataIdVal].data[dataAidVal]["dueDate"] = dueDateValue;
				taskList[dataIdVal].data[dataAidVal]["description"] = descriptionValue;
				taskList[dataIdVal].data[dataAidVal]["grade"] = gradeValue;
			} else {
				taskList[dataIdVal].data.splice(dataAidVal, 1);
				let _id = taskList[session.value].data.length;
				let obj = {
					"id": _id == 0 ? 0 : _id,
					"title": titleValue,
					"time": timeValue,
					"startDate": startDateValue,
					"dueDate": dueDateValue,
					"description": descriptionValue,
					"grade": gradeValue
				}
				taskList[session.value].data.push(obj);
			}
		}
		localStorage.setItem("taskList", JSON.stringify(taskList));
		modal.style.display = "none";
		taskBoardQuery();
	}
})
// today task list info
function tableBodyQuery() {
	let taskList = JSON.parse(localStorage.getItem("taskList"));
	tableBody.innerHTML = "";
	if (taskList.length > 0) {
		taskList.forEach((item, index) => {
			let { data, name } = item;
			if (data.length > 0) {
				data.forEach((dataItem, dataIndex) => {
					let { title, startDate } = dataItem;
					if (isToday(startDate)) {
						let tableRows = document.createElement("div");
						tableRows.classList.add("table-row");
						tableRows.classList.add("d-flex");
						tableRows.classList.add("d-flex-aic");
						tableRows.classList.add("d-flex-jcsb");
						let tableIcon = document.createElement("div");
						tableIcon.classList.add("table-icon");
						tableIcon.classList.add("d-flex");
						tableIcon.classList.add("d-flex-aic");
						let _img = document.createElement("img");
						_img.src = "images/success.png";
						let span1 = document.createElement("span");
						span1.innerHTML = title;
						tableIcon.appendChild(_img);
						tableIcon.appendChild(span1);
						let tableStatus = document.createElement("div");
						tableStatus.classList.add("table-status");
						let span2 = document.createElement("span");
						span2.classList.add("status");
						span2.classList.add("text-c");
						span2.classList.add(name.replace(/\s*/g, ""));
						span2.innerHTML = name;
						tableStatus.appendChild(span2);
						let tableDate = document.createElement("div");
						tableDate.classList.add("table-date");
						let span3 = document.createElement("span");
						span3.classList.add("date");
						span3.classList.add("text-c");
						span3.innerHTML = `${monthText(startDate)} ${startDate.split("-")[2]}`;
						tableDate.appendChild(span3);
						tableRows.appendChild(tableIcon);
						tableRows.appendChild(tableStatus);
						tableRows.appendChild(tableDate);
						tableBody.appendChild(tableRows);
					}
				})
			}
		})
	}
}
// task Board list info
function taskBoardQuery() {
	let taskList = JSON.parse(localStorage.getItem("taskList"));
	task.innerHTML = "";
	if (taskList.length > 0) {
		taskList.forEach((item, index) => {
			let { name, data } = item;
			let taskRow = document.createElement("div");
			taskRow.classList.add("task-row");
			let taskRowTitle = document.createElement("div");
			taskRowTitle.classList.add("task-row-title");
			taskRowTitle.innerHTML = name;
			taskRow.appendChild(taskRowTitle);
			let taskRowItem = document.createElement("div");
			taskRowItem.classList.add("task-row-item");
			let taskRowBox = document.createElement("div");
			taskRowBox.classList.add("task-row-box");
			if (data.length > 0) {
				data.forEach((dataItem, dataIndex) => {
					let { title, description, grade, startDate } = dataItem;
					let taskCell = document.createElement("div");
					taskCell.classList.add("task-cell");
					let cellDel = document.createElement("span");
					cellDel.classList.add("cell-del");
					cellDel.innerHTML = "x";
					cellDel.setAttribute("data-id", item.id);
					cellDel.setAttribute("data-aid", dataItem.id);
					let _item = document.createElement("div");
					_item.classList.add("item");
					_item.setAttribute("data-id", item.id);
					_item.setAttribute("data-aid", dataItem.id);
					let desc = document.createElement("div");
					desc.classList.add("desc");
					let _img = document.createElement("img");
					_img.src = "images/success.png";
					let text1 = document.createElement("span");
					text1.classList.add("text1");
					text1.innerHTML = title;
					let _p = document.createElement("p");
					_p.classList.add("text3");
					_p.innerHTML = description;
					desc.appendChild(_img);
					desc.appendChild(text1);
					desc.appendChild(_p);
					let text2 = document.createElement("span");
					text2.classList.add("text2");
					text2.classList.add(grade);
					text2.innerHTML = grade;
					let _div = document.createElement("div");
					_div.classList.add("all-date");
					_div.classList.add("d-flex");
					_div.classList.add("d-flex-aic");
					_div.classList.add("d-flex-jcsb");
					let date = document.createElement("span");
					date.classList.add("date");
					let days = startDate.split("-")[2];
					isToday(startDate) ? date.innerHTML = `Today: ${monthText(startDate)} ${days}` : date.innerHTML = `${name}: ${monthText(startDate)} ${days}`;
					_div.appendChild(date);
					if (grade == "High") {
						let icon = document.createElement("img");
						icon.src = "./images/icon.png";
						icon.classList.add("icon");
						_div.appendChild(icon);
					}
					_item.appendChild(desc);
					_item.appendChild(text2);
					_item.appendChild(_div);
					taskCell.appendChild(cellDel);
					taskCell.appendChild(_item);
					taskRowBox.appendChild(taskCell);
				})
				taskRowItem.appendChild(taskRowBox);
			}
			taskRow.appendChild(taskRowItem);
			task.appendChild(taskRow);
		})
		if (taskList.length == 4) {
			let addTaskRow = document.createElement("div");
			addTaskRow.classList.add("task-row");
			let addTaskRowTitle = document.createElement("span");
			addTaskRowTitle.classList.add("task-row-title");
			addTaskRowTitle.setAttribute("id", "addSession");
			addTaskRowTitle.innerHTML = "+ Add section";
			addTaskRow.appendChild(addTaskRowTitle);
			task.appendChild(addTaskRow);
			addTaskSession(taskList);
		}
	}
	tableBodyQuery();
	sessionOption();
	editTask();
	delTask();
}
// add Task Session info
function addTaskSession(taskList) {
	document.getElementById("addSession").addEventListener("click", () => {
		let taskSessionTitle = prompt("Place Enter session title");
		if (taskSessionTitle != null && taskSessionTitle != "") {
			let obj = { "id": 4, "name": taskSessionTitle, "data": [] }
			taskList.push(obj);
			localStorage.setItem("taskList", JSON.stringify(taskList));
			taskBoardQuery();
		}
	})
}
// edit task
function editTask() {
	let _items = document.querySelectorAll(".item"),
		taskList = JSON.parse(localStorage.getItem("taskList"));
	_items.forEach((item, index) => {
		item.onclick = function () {
			let dataId = item.getAttribute("data-id"),
				dataAid = item.getAttribute("data-aid");
			document.getElementById("session-id").value = dataId;
			document.getElementById("task-id").value = dataAid;
			taskModalTitleStatus = "edit";
			taskModalTitle.innerHTML = "Edit Task";
			resetForm();
			modal.style.display = "block";
			save.innerHTML = "Edit";
			let data = taskList[dataId].data[dataAid];
			session.value = taskList[dataId].id;
			console.log(data["title"])
			title.value = data["title"];
			time.value = data["time"];
			startDate.value = data["startDate"];
			dueDate.value = data["dueDate"];
			description.value = data["description"];
			grade.value = data["grade"];
		}
	})
}
// delete task 
function delTask() {
	let cellDel = document.querySelectorAll(".cell-del"),
		taskList = JSON.parse(localStorage.getItem("taskList"));
	cellDel.forEach((item, index) => {
		item.onclick = function () {
			let dataId = item.getAttribute("data-id"),
				dataAid = item.getAttribute("data-aid");
			let delStatus = confirm("Delete current data?");
			if (delStatus) {
				taskList[dataId].data.splice(dataAid, 1);
				localStorage.setItem("taskList", JSON.stringify(taskList));
				taskBoardQuery();
			}
		}
	})
}
// Initialize local default stored data
function taskLocalStorage() {
	let taskList = localStorage.getItem("taskList");
	if (taskList == null) {
		let arr = [{
			"id": 0,
			"name": "To do",
			"data": []
		},
		{
			"id": 1,
			"name": "Doing",
			"data": []
		},
		{
			"id": 2,
			"name": "Done",
			"data": []
		},
		{
			"id": 3,
			"name": "notDone",
			"data": []
		}
		]
		localStorage.setItem("taskList", JSON.stringify(arr))
	}
}
// modal session option
function sessionOption() {
	let taskList = JSON.parse(localStorage.getItem("taskList"));
	session.innerHTML = "";
	taskList.forEach((item, index) => {
		let { id, name } = item;
		let _opt = document.createElement("option");
		_opt.setAttribute("value", id);
		_opt.innerHTML = name;
		session.appendChild(_opt);
	})
}
// modal form reset
function resetForm() {
	sessionOption();
	title.value = "";
	time.value = "";
	startDate.value = "";
	dueDate.value = "";
	description.value = "";
	grade.value = "Low";
}
// modal form check date
function checkDate(startDate, endDate) {
	if (startDate.length > 0 && endDate.length > 0) {
		var startDateTemp = startDate.split("-");
		var endDateTemp = endDate.split("-");
		var allStartDate = new Date(startDateTemp[0], startDateTemp[1], startDateTemp[2]);
		var allEndDate = new Date(endDateTemp[0], endDateTemp[1], endDateTemp[2]);
		return allStartDate.getTime() > allEndDate.getTime() ? true : false;
	}
}
// Judge whether it is today
function isToday(val) {
	return new Date().setHours(0, 0, 0, 0) == new Date(val).setHours(0, 0, 0, 0)
}

// Get current time
function getToday() {
	var tempDate = new Date();
	var days = tempDate.getDay();
	var week, month, day;

	switch (days) {
		case 1:
			week = 'Monday';
			break;
		case 2:
			week = 'Tuesday';
			break;
		case 3:
			week = 'Wednesday';
			break;
		case 4:
			week = 'Thursday';
			break;
		case 5:
			week = 'Friday';
			break;
		case 6:
			week = 'Saturday';
			break;
		case 0:
			week = 'Sunday';
			break;
	}

	month = monthArr[tempDate.getMonth()];
	day = tempDate.getDate() < 0 ? `0${tempDate.getDate()}` : tempDate.getDate();
	return `${week} ${month} ${day}`;
}
// Get English month
function monthText(val) {
	var tempDate = new Date(val)
	return monthArr[tempDate.getMonth()];
}
