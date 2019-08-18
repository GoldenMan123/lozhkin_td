"use strict";


/* Constants */

const ASPECT_RATIO = 16 / 9;
const CELL_SIZE = 1 / 9;
const CELL_SIZE_2 = CELL_SIZE / 2;
const PATH = [
    [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1],
    [8, 1], [9, 1], [10, 1], [11, 1], [12, 1], [13, 1], [14, 1], [14, 2],
    [14, 3], [14, 4], [13, 4], [12, 4], [11, 4], [10, 4], [9, 4], [8, 4],
    [7, 4], [6, 4], [5, 4], [4, 4], [3, 4], [2, 4], [1, 4], [1, 5],
    [1, 6], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [8, 7],
    [9, 7], [10, 7], [11, 7], [12, 7], [13, 7], [14, 7], [15, 7]
];


/* Globals */

var game = null;
var mouseX = 0;
var mouseY = 0;
var prevTimestamp = 0;

var towers = new Set();


/* Utils */

function clamp(x, min_value, max_value) {
    return Math.min(Math.max(x, min_value), max_value);
}

function drawElement(x, y, width, height, type) {
    var globalWidth = width * $(game).height();
    var globalHeight = height * $(game).height();
    var globalX = x / ASPECT_RATIO * $(game).width() + $(game).offset().left - globalWidth / 2;
    var globalY = y * $(game).height() + $(game).offset().top - globalHeight / 2;

    var element = $("<div/>", {
        "class": "gameElement " + type
    }).css({
        "width": globalWidth,
        "height": globalHeight,
        "left": globalX,
        "top": globalY
    });

    $(game).append(element);
}

function coordToCell(value) {
    return Math.floor(value / CELL_SIZE);
}


/* Window resize events */

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function resizeWindow() {
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newAspectRatio = newWidth / newHeight;

    if (newAspectRatio > ASPECT_RATIO) {
        newWidth = newHeight * ASPECT_RATIO;
        $(game).height(newHeight);
        $(game).width(newWidth);
    } else {
        newHeight = newWidth / ASPECT_RATIO;
        $(game).height(newHeight);
        $(game).width(newWidth);
    }
}


/* Mouse and touch events */

function mousedown(evt) {
    var cellX = coordToCell(mouseX);
    var cellY = coordToCell(mouseY);
    placeTower(cellX, cellY);
}

function mouseup(evt) {
}

function mousemove(evt) {
    mouseX = clamp((evt.pageX - $(game).offset().left) / $(game).width(), 0, 1) * ASPECT_RATIO;
    mouseY = clamp((evt.pageY - $(game).offset().top) / $(game).height(), 0, 1);
}

function touchstart(evt) {
    evt.preventDefault();
}

function touchend(evt) {
    evt.preventDefault();
}

function touchmove(evt) {
    evt.preventDefault();
}


/* Game Objects */

class Tower {
    constructor(cellX, cellY) {
        this.cellX = cellX;
        this.cellY = cellY;
    }
};


/* Game Logic */

function canPlaceTower(cellX, cellY) {
    for (let coord of PATH) {
        if (coord[0] == cellX && coord[1] == cellY) {
            return false;
        }
    }
    for (let tower of towers) {
        if (tower.cellX == cellX && tower.cellY == cellY) {
            return false;
        }
    }
    return true;
}

function placeTower(cellX, cellY) {
    if (canPlaceTower(cellX, cellY)) {
        towers.add(new Tower(cellX, cellY));
    }
}


/* Main Loop */

function updateState(elapsedTime) {
}

function drawScene() {
    $(game).empty();

    var cellX = coordToCell(mouseX);
    var cellY = coordToCell(mouseY);

    for (let item of towers) {
        drawElement(item.cellX * CELL_SIZE + CELL_SIZE_2,
                    item.cellY * CELL_SIZE + CELL_SIZE_2,
                    CELL_SIZE, CELL_SIZE,
                    "lozhkin");
    }

    if (canPlaceTower(cellX, cellY)) {
        drawElement(cellX * CELL_SIZE + CELL_SIZE_2, cellY * CELL_SIZE + CELL_SIZE_2, CELL_SIZE, CELL_SIZE, "lozhkin");
    } else {
        drawElement(cellX * CELL_SIZE + CELL_SIZE_2, cellY * CELL_SIZE + CELL_SIZE_2, CELL_SIZE, CELL_SIZE, "red_cross");
    }
}

function mainLoop(timestamp) {
    var elapsedTime = timestamp - prevTimestamp;
    prevTimestamp = timestamp;
    updateState(elapsedTime);
    drawScene();
    window.requestAnimationFrame(mainLoop);
}


/* Initialization */

function main() {
    game = document.getElementById("game");

    window.addEventListener("resize", resizeWindow);
    window.addEventListener("orientationchange", resizeWindow);
    document.addEventListener("fullscreenchange", resizeWindow);
    document.addEventListener("mozfullscreenchange", resizeWindow);
    document.addEventListener("webkitfullscreenchange", resizeWindow);
    document.addEventListener("msfullscreenchange", resizeWindow);
    resizeWindow();

    game.addEventListener("mousedown", mousedown);
    game.addEventListener("mouseup", mouseup);
    game.addEventListener("mousemove", mousemove);
    game.addEventListener("touchstart", touchstart);
    game.addEventListener("touchend", touchend);
    game.addEventListener("touchmove", touchmove);

    window.requestAnimationFrame(mainLoop);
}

$(main);
