// page dom
let menu = document.querySelector(".menu"),
    containerMask = document.querySelector(".container-mask"),
    left = document.querySelector(".left");
// menu click info 
menu.addEventListener("click", () => {
    left.style.left = "0";
    containerMask.style.display = "block";
})
// mask click info 
containerMask.addEventListener("click", () => {
    left.style.left = "100%";
    containerMask.style.display = "none";
})
// View window changes 
window.onresize = function () {
    // View window changes more than 1200px
    if (window.innerWidth > 1200) {
        left.style.left = "0";
        if (containerMask.style.display == "block") {
            left.style.left = "0";
            containerMask.style.display = "none";
        }
    } else {
        if (containerMask.style.display == "" || containerMask.style.display == "none") {
            left.style.left = "-100%";
        }
    }
}