/** testInit.js **/

window.addEventListener("DOMContentLoaded", init, false); 
function init() {
    var canvas = document.getElementById("canvas");
    canvas.addEventListener("mousedown", getPosition, false);
}
