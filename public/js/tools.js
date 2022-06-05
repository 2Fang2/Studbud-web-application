// music list info
let musicList = [
    {
        "id": 0,
        "name": "No Time",
        "author": "Lastlings",
        "imgs": "images/home.png",
        "music": "music/1.mp3"
    },
    {
        "id": 1,
        "name": "Blinding Lights",
        "author": "The Weeknd",
        "imgs": "images/home.png",
        "music": "music/2.mp3"
    },
    {
        "id": 2,
        "name": "Music 3",
        "author": "Enrasta",
        "imgs": "images/home.png",
        "music": "music/3.mp3"
    }
]
// music list dom
let music = document.querySelector(".music"),
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
    toolsList = [
        { "id": 0, "value": 25, "time": "25:00" },
        { "id": 1, "value": 5, "time": "5:00" },
        { "id": 2, "value": 15, "time": "15:00" }
    ],
    changeTime = false,
    timeDown;

window.onload = function () {
    sePomInit();
    let musicListLocal = localStorage.getItem("musicList");
    if (musicListLocal == null) {
        localStorage.setItem("musicList", JSON.stringify(musicList))
    }
    createMusicQuery(musicList);
}
// set pom info
pomHead.forEach((v, i) => {
    v.onclick = function () {
        if (!changeTime) {
            pomHead.forEach((item, index) => item.classList.remove("active"));
            isToolsIndex = i;
            pomTime.innerHTML = toolsList[i].time;
            v.classList.add("active");
        } else {
            let isPom = confirm("A task is in progress and cannot be modified");
            if (isPom) {
                changeTime = false;
                clearInterval(timeDown);
                changeTime = false;
                pomHead.forEach((item, index) => item.classList.remove("active"));
                isToolsIndex = i;
                pomTime.innerHTML = toolsList[i].time;
                v.classList.add("active");
                sePomInit();
            }
        }
    }
})
// starStop pom
starStop.addEventListener("click", () => {
    let num = pomTime.innerHTML.split(":")[0] == Number(toolsList[isToolsIndex].value) ? Number(toolsList[isToolsIndex].value) * 60 : (Number(pomTime.innerHTML.split(":")[0]) * 60 + Number(pomTime.innerHTML.split(":")[1]));
    if (changeTime) {  //END
        changeTime = false;
        clearInterval(timeDown);
    } else {  //START
        changeTime = true;
        achieveTime(num);
    }
})
// edit pom
edit.addEventListener("click", () => {
    let pomodoroValue = pomodoro.value,
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
        toolsList = [
            { "id": 0, "value": pomodoroValue, "time": `${pomodoroValue}:00` },
            { "id": 1, "value": shortbreakValue, "time": `${shortbreakValue}:00` },
            { "id": 2, "value": longbreakValue, "time": `${longbreakValue}:00` }
        ];
        sePomInit();
    } else {
        alert("A task is in progress and cannot be modified");
        return;
    }
})
// reset pom
reset.addEventListener("click", () => {
    if (!changeTime) {
        changeTime = false;
        toolsList = [
            { "id": 0, "value": 25, "time": "25:00" },
            { "id": 1, "value": 5, "time": "5:00" },
            { "id": 2, "value": 15, "time": "15:00" }
        ];
        sePomInit();
    } else {
        let _resetPoms = confirm("There are tasks in progress. Reset?");
        if (_resetPoms) {
            clearInterval(timeDown);
            changeTime = false;
            toolsList = [
                { "id": 0, "value": 25, "time": "25:00" },
                { "id": 1, "value": 5, "time": "5:00" },
                { "id": 2, "value": 15, "time": "15:00" }
            ];
            sePomInit();
        }
    }
})
// set pom time
timeSet.addEventListener("click", (e) => {
    if (e.target.checked) {
        pomSet.style.display = "block";
    } else {
        pomSet.style.display = "none";
    }
})
// set pom init info
function sePomInit() {
    pomTime.innerHTML = toolsList[isToolsIndex].time;
    pomodoro.value = toolsList[0].value;
    shortbreak.value = toolsList[1].value;
    longbreak.value = toolsList[2].value;
}
// set pom achieve time
function achieveTime(countdownTime) {
    var time = countdownTime;
    if (time >= 0) {
        showTime(time);
        timeDown = setInterval(() => {
            --time;
            showTime(time);
            if (time == 0) {
                clearInterval(timeDown);
                changeTime = false;
            }
        }, 1000);
    } else {
        pomTime.innerHTML = `00:00`;
    }
}
// Time supplement 0
function showTime(t) {
    var m = Math.floor(t / 60 % 60);
    var s = Math.floor(t % 60);
    if (m < 10) m = "0" + m;
    if (s < 10) s = "0" + s;
    pomTime.innerHTML = `${m}:${s}`;
}
// music player info
function createMusicQuery(musicList) {
    musicListDom.innerHTML = "";
    musicList.forEach((item, index) => {
        let { name, author, imgs, music } = item;
        let musicItem = document.createElement("div");
        musicItem.classList.add("music-item");
        musicItem.classList.add("d-flex");
        musicItem.classList.add("d-flex-aic");
        musicItem.classList.add("d-flex-jcsb");
        let musicInfo1 = document.createElement("div");
        musicInfo1.classList.add("music-info1");
        musicInfo1.classList.add("d-flex");
        musicInfo1.classList.add("d-flex-aic");
        let musicImg = document.createElement("img");
        musicImg.classList.add("music-img");
        musicImg.src = imgs;
        let musicCon = document.createElement("div");
        musicCon.classList.add("music-con");
        let _p1 = document.createElement("p");
        _p1.innerHTML = name;
        let _p2 = document.createElement("p");
        _p2.innerHTML = author;
        musicCon.appendChild(_p1);
        musicCon.appendChild(_p2);
        musicInfo1.appendChild(musicImg);
        musicInfo1.appendChild(musicCon);
        let musicInfo2 = document.createElement("div");
        musicInfo2.classList.add("music-info2");
        musicInfo2.classList.add("d-flex");
        musicInfo2.classList.add("d-flex-aic");
        let play1 = document.createElement("img");
        play1.classList.add("play1");
        play1.src = "images/play.png";
        let play2 = document.createElement("img");
        play2.classList.add("play2");
        play2.src = "images/zanting.png";
        musicInfo2.appendChild(play1);
        musicInfo2.appendChild(play2);
        let _audio = document.createElement("audio");
        _audio.classList.add("audio");
        _audio.src = music;
        musicItem.appendChild(musicInfo1);
        musicItem.appendChild(musicInfo2);
        musicItem.appendChild(_audio);
        musicListDom.appendChild(musicItem);
    })
    playSong();
}
// music modal close
musicDel.addEventListener("click", () => {
    music.style.display = "none";
    musicBtn.style.display = "block";
})
// music modal show
musicBtn.addEventListener("click", () => {
    music.style.display = "block";
    musicBtn.style.display = "none";
})
// set music info modal 
function playSong() {
    let play1 = document.querySelectorAll(".play1"),
        play2 = document.querySelectorAll(".play2"),
        audio = document.querySelectorAll(".audio"),
        musicItem = document.querySelectorAll(".music-item");
    play1.forEach((item, index) => {
        item.onclick = function () {
            console.log(audio[index].paused)
            if (audio[index].paused) {
                audio[index].play();
                musicItem[index].classList.add("active");
                isPlay = true;
            } else {
                audio[index].pause();
                isPlay = false;
                musicItem[index].classList.remove("active");
            }
        }
    })
    play2.forEach((item, index) => {
        item.onclick = function () {
            console.log(audio[index].paused, isPlay)
            if (!audio[index].paused) {
                audio[index].pause();
                isPlay = false;
                musicItem[index].classList.remove("active");
            } else {
                audio[index].play();
                musicItem[index].classList.add("active");
            }
        }
    })
}
