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
})({"js/tools.js":[function(require,module,exports) {
// music list info
var musicList = [{
  "id": 0,
  "name": "Bloodstream",
  "author": "The Chainsmokers",
  "imgs": "images/home.png",
  "music": "music/1.mp3"
}, {
  "id": 1,
  "name": "Bloodstream1",
  "author": "The Chainsmokers1",
  "imgs": "images/home.png",
  "music": "music/2.mp3"
}, {
  "id": 2,
  "name": "Bloodstream2",
  "author": "The Chainsmokers2",
  "imgs": "images/home.png",
  "music": "music/3.mp3"
}]; // music list dom

var music = document.querySelector(".music"),
    musicListDom = document.querySelector(".music-list"),
    musicDel = document.querySelector(".music-del"),
    musicBtn = document.querySelector(".music-btn"),
    pomHead = document.querySelectorAll(".pom-head span"),
    pomTime = document.querySelector(".pom-time"),
    pomSet = document.querySelector(".pom-set"),
    timeSet = document.getElementById("timeSet"),
    pomodoro = document.getElementById("pomodoro"),
    shortbreak = document.getElementById("shortbreak"),
    longbreak = document.getElementById("longbreak"),
    starStop = document.querySelector(".star-stop"),
    reset = document.querySelector(".reset"),
    edit = document.querySelector(".edit"),
    count = 0,
    isPlay = false,
    reg = /^[1-9][0-9]*$/,
    isToolsIndex = 0,
    toolsList = [{
  "id": 0,
  "value": 25,
  "time": "25:00"
}, {
  "id": 1,
  "value": 5,
  "time": "5:00"
}, {
  "id": 2,
  "value": 15,
  "time": "15:00"
}],
    changeTime = false,
    timeDown;

window.onload = function () {
  sePomInit();
  var musicListLocal = localStorage.getItem("musicList");

  if (musicListLocal == null) {
    localStorage.setItem("musicList", JSON.stringify(musicList));
  }

  createMusicQuery(musicList);
}; // set pom info


pomHead.forEach(function (v, i) {
  v.onclick = function () {
    if (!changeTime) {
      pomHead.forEach(function (item, index) {
        return item.classList.remove("active");
      });
      isToolsIndex = i;
      pomTime.innerHTML = toolsList[i].time;
      v.classList.add("active");
    } else {
      var isPom = confirm("A task is in progress and cannot be modified");

      if (isPom) {
        changeTime = false;
        clearInterval(timeDown);
        changeTime = false;
        pomHead.forEach(function (item, index) {
          return item.classList.remove("active");
        });
        isToolsIndex = i;
        pomTime.innerHTML = toolsList[i].time;
        v.classList.add("active");
        sePomInit();
      }
    }
  };
}); // starStop pom

starStop.addEventListener("click", function () {
  var num = pomTime.innerHTML.split(":")[0] == Number(toolsList[isToolsIndex].value) ? Number(toolsList[isToolsIndex].value) * 60 : Number(pomTime.innerHTML.split(":")[0]) * 60 + Number(pomTime.innerHTML.split(":")[1]);

  if (changeTime) {
    //结束
    changeTime = false;
    clearInterval(timeDown);
  } else {
    //开始
    changeTime = true;
    achieveTime(num);
  }
}); // edit pom

edit.addEventListener("click", function () {
  var pomodoroValue = pomodoro.value,
      shortbreakValue = shortbreak.value,
      longbreakValue = longbreak.value;

  if (!reg.test(pomodoroValue)) {
    alert("Only positive integers can be entered");
    return;
  }

  if (!reg.test(shortbreakValue)) {
    alert("Only positive integers can be entered");
    return;
  }

  if (!reg.test(longbreakValue)) {
    alert("Only positive integers can be entered");
    return;
  }

  if (!changeTime) {
    toolsList = [{
      "id": 0,
      "value": pomodoroValue,
      "time": "".concat(pomodoroValue, ":00")
    }, {
      "id": 1,
      "value": shortbreakValue,
      "time": "".concat(shortbreakValue, ":00")
    }, {
      "id": 2,
      "value": longbreakValue,
      "time": "".concat(longbreakValue, ":00")
    }];
    sePomInit();
  } else {
    alert("A task is in progress and cannot be modified");
    return;
  }
}); // reset pom

reset.addEventListener("click", function () {
  if (!changeTime) {
    changeTime = false;
    toolsList = [{
      "id": 0,
      "value": 25,
      "time": "25:00"
    }, {
      "id": 1,
      "value": 5,
      "time": "5:00"
    }, {
      "id": 2,
      "value": 15,
      "time": "15:00"
    }];
    sePomInit();
  } else {
    var _resetPoms = confirm("There are tasks in progress. Reset?");

    if (_resetPoms) {
      clearInterval(timeDown);
      changeTime = false;
      toolsList = [{
        "id": 0,
        "value": 25,
        "time": "25:00"
      }, {
        "id": 1,
        "value": 5,
        "time": "5:00"
      }, {
        "id": 2,
        "value": 15,
        "time": "15:00"
      }];
      sePomInit();
    }
  }
}); // set pom time

timeSet.addEventListener("click", function (e) {
  if (e.target.checked) {
    pomSet.style.display = "block";
  } else {
    pomSet.style.display = "none";
  }
}); // set pom init info

function sePomInit() {
  pomTime.innerHTML = toolsList[isToolsIndex].time;
  pomodoro.value = toolsList[0].value;
  shortbreak.value = toolsList[1].value;
  longbreak.value = toolsList[2].value;
} // set pom achieve time


function achieveTime(countdownTime) {
  var time = countdownTime;

  if (time >= 0) {
    showTime(time);
    timeDown = setInterval(function () {
      --time;
      showTime(time);

      if (time == 0) {
        clearInterval(timeDown);
        changeTime = false;
      }
    }, 1000);
  } else {
    pomTime.innerHTML = "00:00";
  }
} // Time supplement 0


function showTime(t) {
  var m = Math.floor(t / 60 % 60);
  var s = Math.floor(t % 60);
  if (m < 10) m = "0" + m;
  if (s < 10) s = "0" + s;
  pomTime.innerHTML = "".concat(m, ":").concat(s);
} // music player info


function createMusicQuery(musicList) {
  musicListDom.innerHTML = "";
  musicList.forEach(function (item, index) {
    var name = item.name,
        author = item.author,
        imgs = item.imgs,
        music = item.music;
    var musicItem = document.createElement("div");
    musicItem.classList.add("music-item");
    musicItem.classList.add("d-flex");
    musicItem.classList.add("d-flex-aic");
    musicItem.classList.add("d-flex-jcsb");
    var musicInfo1 = document.createElement("div");
    musicInfo1.classList.add("music-info1");
    musicInfo1.classList.add("d-flex");
    musicInfo1.classList.add("d-flex-aic");
    var musicImg = document.createElement("img");
    musicImg.classList.add("music-img");
    musicImg.src = imgs;
    var musicCon = document.createElement("div");
    musicCon.classList.add("music-con");

    var _p1 = document.createElement("p");

    _p1.innerHTML = name;

    var _p2 = document.createElement("p");

    _p2.innerHTML = author;
    musicCon.appendChild(_p1);
    musicCon.appendChild(_p2);
    musicInfo1.appendChild(musicImg);
    musicInfo1.appendChild(musicCon);
    var musicInfo2 = document.createElement("div");
    musicInfo2.classList.add("music-info2");
    musicInfo2.classList.add("d-flex");
    musicInfo2.classList.add("d-flex-aic");
    var play1 = document.createElement("img");
    play1.classList.add("play1");
    play1.src = "images/play.png";
    var play2 = document.createElement("img");
    play2.classList.add("play2");
    play2.src = "images/zanting.png";
    musicInfo2.appendChild(play1);
    musicInfo2.appendChild(play2);

    var _audio = document.createElement("audio");

    _audio.classList.add("audio");

    _audio.src = music;
    musicItem.appendChild(musicInfo1);
    musicItem.appendChild(musicInfo2);
    musicItem.appendChild(_audio);
    musicListDom.appendChild(musicItem);
  });
  playSong();
} // music modal close


musicDel.addEventListener("click", function () {
  music.style.display = "none";
  musicBtn.style.display = "block";
}); // music modal show

musicBtn.addEventListener("click", function () {
  music.style.display = "block";
  musicBtn.style.display = "none";
}); // set music info modal 

function playSong() {
  var play1 = document.querySelectorAll(".play1"),
      play2 = document.querySelectorAll(".play2"),
      audio = document.querySelectorAll(".audio"),
      musicItem = document.querySelectorAll(".music-item");
  play1.forEach(function (item, index) {
    item.onclick = function () {
      console.log(audio[index].paused);

      if (audio[index].paused) {
        audio[index].play();
        musicItem[index].classList.add("active");
        isPlay = true;
      } else {
        audio[index].pause();
        isPlay = false;
        musicItem[index].classList.remove("active");
      }
    };
  });
  play2.forEach(function (item, index) {
    item.onclick = function () {
      console.log(audio[index].paused, isPlay);

      if (!audio[index].paused) {
        audio[index].pause();
        isPlay = false;
        musicItem[index].classList.remove("active");
      } else {
        audio[index].play();
        musicItem[index].classList.add("active");
      }
    };
  });
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
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/tools.js"], null)
//# sourceMappingURL=/tools.5380ba51.js.map