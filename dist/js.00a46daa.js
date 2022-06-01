// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/index.js":[function(require,module,exports) {
// get page dom
var todayTime = document.querySelector(".todayTime"),
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
}; // add task 


addTask.addEventListener("click", function () {
  resetForm();
  taskModalTitleStatus = "add";
  taskModalTitle.innerHTML = "New Task";
  save.innerHTML = "Save";
  modal.style.display = "block";
}); // close task 

close.addEventListener("click", function () {
  modal.style.display = "none";
}); // cancel task 

cancel.addEventListener("click", function () {
  modal.style.display = "none";
}); // save / edit task

save.addEventListener("click", function () {
  var taskList = JSON.parse(localStorage.getItem("taskList")),
      sessionValue = session.value,
      titleValue = title.value,
      timeValue = time.value,
      startDateValue = startDate.value,
      dueDateValue = dueDate.value,
      descriptionValue = description.value,
      gradeValue = grade.value;

  if (titleValue == "") {
    // rule title
    alert("title must be enter");
    return;
  }

  if (startDateValue == "") {
    // rule startDate
    alert("start date must be enter");
    return;
  }

  if (dueDateValue == "") {
    // rule dueDate
    alert("due date must be enter");
    return;
  }

  if (checkDate(startDateValue, dueDateValue)) {
    // rule startDate / dueDate
    alert("due date Cannot exceed start date");
    return;
  }

  if (taskList.length > 0) {
    if (taskModalTitleStatus == "add") {
      var index = taskList.findIndex(function (item) {
        return item.id == sessionValue;
      });
      var _id = taskList[index].data.length;
      var obj = {
        "id": _id == 0 ? 0 : _id,
        "title": titleValue,
        "time": timeValue,
        "startDate": startDateValue,
        "dueDate": dueDateValue,
        "description": descriptionValue,
        "grade": gradeValue
      };
      taskList[index].data.push(obj);
    } else {
      var dataIdVal = document.getElementById("session-id").value,
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
        var _id2 = taskList[session.value].data.length;
        var _obj = {
          "id": _id2 == 0 ? 0 : _id2,
          "title": titleValue,
          "time": timeValue,
          "startDate": startDateValue,
          "dueDate": dueDateValue,
          "description": descriptionValue,
          "grade": gradeValue
        };
        taskList[session.value].data.push(_obj);
      }
    }

    localStorage.setItem("taskList", JSON.stringify(taskList));
    modal.style.display = "none";
    taskBoardQuery();
  }
}); // today task list info

function tableBodyQuery() {
  var taskList = JSON.parse(localStorage.getItem("taskList"));
  tableBody.innerHTML = "";

  if (taskList.length > 0) {
    taskList.forEach(function (item, index) {
      var data = item.data,
          name = item.name;

      if (data.length > 0) {
        data.forEach(function (dataItem, dataIndex) {
          var title = dataItem.title,
              startDate = dataItem.startDate;

          if (isToday(startDate)) {
            var tableRows = document.createElement("div");
            tableRows.classList.add("table-row");
            tableRows.classList.add("d-flex");
            tableRows.classList.add("d-flex-aic");
            tableRows.classList.add("d-flex-jcsb");
            var tableIcon = document.createElement("div");
            tableIcon.classList.add("table-icon");
            tableIcon.classList.add("d-flex");
            tableIcon.classList.add("d-flex-aic");

            var _img = document.createElement("img");

            _img.src = "images/success.png";
            var span1 = document.createElement("span");
            span1.innerHTML = title;
            tableIcon.appendChild(_img);
            tableIcon.appendChild(span1);
            var tableStatus = document.createElement("div");
            tableStatus.classList.add("table-status");
            var span2 = document.createElement("span");
            span2.classList.add("status");
            span2.classList.add("text-c");
            span2.classList.add(name.replace(/\s*/g, ""));
            span2.innerHTML = name;
            tableStatus.appendChild(span2);
            var tableDate = document.createElement("div");
            tableDate.classList.add("table-date");
            var span3 = document.createElement("span");
            span3.classList.add("date");
            span3.classList.add("text-c");
            span3.innerHTML = "".concat(monthText(startDate), " ").concat(startDate.split("-")[2]);
            tableDate.appendChild(span3);
            tableRows.appendChild(tableIcon);
            tableRows.appendChild(tableStatus);
            tableRows.appendChild(tableDate);
            tableBody.appendChild(tableRows);
          }
        });
      }
    });
  }
} // task Board list info


function taskBoardQuery() {
  var taskList = JSON.parse(localStorage.getItem("taskList"));
  task.innerHTML = "";

  if (taskList.length > 0) {
    taskList.forEach(function (item, index) {
      var name = item.name,
          data = item.data;
      var taskRow = document.createElement("div");
      taskRow.classList.add("task-row");
      var taskRowTitle = document.createElement("div");
      taskRowTitle.classList.add("task-row-title");
      taskRowTitle.innerHTML = name;
      taskRow.appendChild(taskRowTitle);
      var taskRowItem = document.createElement("div");
      taskRowItem.classList.add("task-row-item");
      var taskRowBox = document.createElement("div");
      taskRowBox.classList.add("task-row-box");

      if (data.length > 0) {
        data.forEach(function (dataItem, dataIndex) {
          var title = dataItem.title,
              description = dataItem.description,
              grade = dataItem.grade,
              startDate = dataItem.startDate;
          var taskCell = document.createElement("div");
          taskCell.classList.add("task-cell");
          var cellDel = document.createElement("span");
          cellDel.classList.add("cell-del");
          cellDel.innerHTML = "x";
          cellDel.setAttribute("data-id", item.id);
          cellDel.setAttribute("data-aid", dataItem.id);

          var _item = document.createElement("div");

          _item.classList.add("item");

          _item.setAttribute("data-id", item.id);

          _item.setAttribute("data-aid", dataItem.id);

          var desc = document.createElement("div");
          desc.classList.add("desc");

          var _img = document.createElement("img");

          _img.src = "images/success.png";
          var text1 = document.createElement("span");
          text1.classList.add("text1");
          text1.innerHTML = title;

          var _p = document.createElement("p");

          _p.classList.add("text3");

          _p.innerHTML = description;
          desc.appendChild(_img);
          desc.appendChild(text1);
          desc.appendChild(_p);
          var text2 = document.createElement("span");
          text2.classList.add("text2");
          text2.classList.add(grade);
          text2.innerHTML = grade;

          var _div = document.createElement("div");

          _div.classList.add("all-date");

          _div.classList.add("d-flex");

          _div.classList.add("d-flex-aic");

          _div.classList.add("d-flex-jcsb");

          var date = document.createElement("span");
          date.classList.add("date");
          var days = startDate.split("-")[2];
          isToday(startDate) ? date.innerHTML = "Today: ".concat(monthText(startDate), " ").concat(days) : date.innerHTML = "".concat(name, ": ").concat(monthText(startDate), " ").concat(days);

          _div.appendChild(date);

          if (grade == "High") {
            var icon = document.createElement("img");
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
        });
        taskRowItem.appendChild(taskRowBox);
      }

      taskRow.appendChild(taskRowItem);
      task.appendChild(taskRow);
    });

    if (taskList.length == 4) {
      var addTaskRow = document.createElement("div");
      addTaskRow.classList.add("task-row");
      var addTaskRowTitle = document.createElement("span");
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
} // add Task Session info


function addTaskSession(taskList) {
  document.getElementById("addSession").addEventListener("click", function () {
    var taskSessionTitle = prompt("Place Enter session title");

    if (taskSessionTitle != null && taskSessionTitle != "") {
      var obj = {
        "id": 4,
        "name": taskSessionTitle,
        "data": []
      };
      taskList.push(obj);
      localStorage.setItem("taskList", JSON.stringify(taskList));
      taskBoardQuery();
    }
  });
} // edit task


function editTask() {
  var _items = document.querySelectorAll(".item"),
      taskList = JSON.parse(localStorage.getItem("taskList"));

  _items.forEach(function (item, index) {
    item.onclick = function () {
      var dataId = item.getAttribute("data-id"),
          dataAid = item.getAttribute("data-aid");
      document.getElementById("session-id").value = dataId;
      document.getElementById("task-id").value = dataAid;
      taskModalTitleStatus = "edit";
      taskModalTitle.innerHTML = "Edit Task";
      resetForm();
      modal.style.display = "block";
      save.innerHTML = "Edit";
      var data = taskList[dataId].data[dataAid];
      session.value = taskList[dataId].id;
      console.log(data["title"]);
      title.value = data["title"];
      time.value = data["time"];
      startDate.value = data["startDate"];
      dueDate.value = data["dueDate"];
      description.value = data["description"];
      grade.value = data["grade"];
    };
  });
} // delete task 


function delTask() {
  var cellDel = document.querySelectorAll(".cell-del"),
      taskList = JSON.parse(localStorage.getItem("taskList"));
  cellDel.forEach(function (item, index) {
    item.onclick = function () {
      var dataId = item.getAttribute("data-id"),
          dataAid = item.getAttribute("data-aid");
      var delStatus = confirm("Delete current data?");

      if (delStatus) {
        taskList[dataId].data.splice(dataAid, 1);
        localStorage.setItem("taskList", JSON.stringify(taskList));
        taskBoardQuery();
      }
    };
  });
} // Initialize local default stored data


function taskLocalStorage() {
  var taskList = localStorage.getItem("taskList");

  if (taskList == null) {
    var arr = [{
      "id": 0,
      "name": "To do",
      "data": []
    }, {
      "id": 1,
      "name": "Doing",
      "data": []
    }, {
      "id": 2,
      "name": "Done",
      "data": []
    }, {
      "id": 3,
      "name": "notDone",
      "data": []
    }];
    localStorage.setItem("taskList", JSON.stringify(arr));
  }
} // modal session option


function sessionOption() {
  var taskList = JSON.parse(localStorage.getItem("taskList"));
  session.innerHTML = "";
  taskList.forEach(function (item, index) {
    var id = item.id,
        name = item.name;

    var _opt = document.createElement("option");

    _opt.setAttribute("value", id);

    _opt.innerHTML = name;
    session.appendChild(_opt);
  });
} // modal form reset


function resetForm() {
  sessionOption();
  title.value = "";
  time.value = "";
  startDate.value = "";
  dueDate.value = "";
  description.value = "";
  grade.value = "Low";
} // modal form check date


function checkDate(startDate, endDate) {
  if (startDate.length > 0 && endDate.length > 0) {
    var startDateTemp = startDate.split("-");
    var endDateTemp = endDate.split("-");
    var allStartDate = new Date(startDateTemp[0], startDateTemp[1], startDateTemp[2]);
    var allEndDate = new Date(endDateTemp[0], endDateTemp[1], endDateTemp[2]);
    return allStartDate.getTime() > allEndDate.getTime() ? true : false;
  }
} // Judge whether it is today


function isToday(val) {
  return new Date().setHours(0, 0, 0, 0) == new Date(val).setHours(0, 0, 0, 0);
} // Get current time


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
  day = tempDate.getDate() < 0 ? "0".concat(tempDate.getDate()) : tempDate.getDate();
  return "".concat(week, " ").concat(month, " ").concat(day);
} // Get English month


function monthText(val) {
  var tempDate = new Date(val);
  return monthArr[tempDate.getMonth()];
}
},{}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56184" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map