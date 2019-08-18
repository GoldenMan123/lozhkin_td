"use strict";


/* Constants */

const ASPECT_RATIO = 16 / 9;
const CELL_SIZE = 1 / 9;
const CELL_SIZE_2 = CELL_SIZE / 2;
const PATH = [
    [-1, 1],
    [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1],
    [8, 1], [9, 1], [10, 1], [10, 2], [10, 3], [10, 4], [9, 4], [8, 4],
    [7, 4], [6, 4], [5, 4], [4, 4], [3, 4], [2, 4], [1, 4], [1, 5],
    [1, 6], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7],
    [8, 7], [9, 7], [10, 7], [11, 7],
    [12, 7]
];
const DEFAULT_RADIUS = 1.5 * CELL_SIZE;

const TOWER_SHOP = [
    {
        "type": "lozhkin",
        "title": "Великий кибернетик",
        "description": "Получает асимптотические оценки",
        "price": 100
    },
    {
        "type": "lozhkin",
        "title": "Зам. декана по науке",
        "description": "Тщательно планирует время",
        "price": 500
    },
    {
        "type": "lozhkin",
        "title": "Зам. декана по финансам",
        "description": "Помогает увеличивать гранты",
        "price": 500
    },
    {
        "type": "lozhkin",
        "title": "Светило кибернетики",
        "description": "Ярким светом вдохновляет",
        "price": 1000
    }
];


/* Globals */

var game = null;
var mouseX = 0;
var mouseY = 0;
var prevTimestamp = 0;

var budget = 300;
var towers = new Set();
var enemies = new Set();
var missiles = new Set();


/* Utils */

function clamp(x, min_value, max_value) {
    return Math.min(Math.max(x, min_value), max_value);
}

function drawElement(x, y, width, height, rotation, type) {
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
        "top": globalY,
        "transform": "rotate(" + rotation + "deg)"
    });

    $(game).append(element);
}

function drawText(x, y, width, height, text, color) {
    var globalWidth = width * $(game).height();
    var globalHeight = height * $(game).height();
    var globalX = x / ASPECT_RATIO * $(game).width() + $(game).offset().left - globalWidth / 2;
    var globalY = y * $(game).height() + $(game).offset().top - globalHeight / 2;

    var element = $("<div/>", {
        "class": "gameElement textElement"
    }).css({
        "width": globalWidth,
        "height": globalHeight,
        "left": globalX,
        "top": globalY,
        "font-size": globalHeight,
        "color": color
    }).text(text);

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
        this.reload = 1.0;
        this.reloadSpeed = 1.0;
        this.radius = DEFAULT_RADIUS;
    }

    update(elapsedTime) {
        this.reload -= elapsedTime * this.reloadSpeed;
        if (this.reload <= 0) {
            this.reload = 0;
            var towerX = this.cellX * CELL_SIZE + CELL_SIZE_2;
            var towerY = this.cellY * CELL_SIZE + CELL_SIZE_2;
            for (let enemy of enemies) {
                var dist = Math.sqrt((enemy.X - towerX) ** 2 + (enemy.Y - towerY) ** 2);
console.log(dist);
                if (dist > this.radius) {
                    continue;
                }
                missiles.add(new Missile(towerX, towerY, 1.0, enemy));
                this.reload = 1.0;
                break;
            }
        }
    }

    getRotation() {
        var rotation = 0;
        if (this.reload < 0.25) {
            rotation = 40 * this.reload;
        } else if (this.reload < 0.75) {
            rotation = 40 * (0.5 - this.reload);
        } else {
            rotation = 40 * (this.reload - 1.0);
        }
        return rotation;
    }
};

class Enemy {
    constructor(speed) {
        this.X = PATH[0][0] * CELL_SIZE + CELL_SIZE_2;
        this.Y = PATH[0][1] * CELL_SIZE + CELL_SIZE_2;
        this.nextPathCell = 1;
        this.elapsedTime = 0;
        this.speed = speed;
        this.alive = true;
    }

    movePart() {
        if (!this.alive || this.nextPathCell >= PATH.length) {
            this.alive = false;
            enemies.delete(this);
            enemies.add(new Enemy(0.1));
            return false;
        }

        var destX = PATH[this.nextPathCell][0] * CELL_SIZE + CELL_SIZE_2;
        var destY = PATH[this.nextPathCell][1] * CELL_SIZE + CELL_SIZE_2;
        var distance = Math.sqrt((destX - this.X) ** 2 + (destY - this.Y) ** 2);

        if (distance > this.elapsedTime * this.speed) {
            var speedX = (destX - this.X) / distance * this.speed;
            var speedY = (destY - this.Y) / distance * this.speed;
            this.X += speedX * this.elapsedTime;
            this.Y += speedY * this.elapsedTime;
            this.elapsedTime = 0;
            return false;
        } else {
            this.X = destX;
            this.Y = destY;
            this.nextPathCell += 1;
            this.elapsedTime -= distance;
            return true;
        }
    }

    move(elapsedTime) {
        this.elapsedTime = elapsedTime;
        while (this.movePart()) {}
    }
};

class Missile {
    constructor(x, y, speed, enemy) {
        this.X = x;
        this.Y = y;
        this.enemy = enemy;
        this.speed = speed;
    }

    move(elapsedTime) {
        var distance = Math.sqrt((this.enemy.X - this.X) ** 2 + (this.enemy.Y - this.Y) ** 2);
        if (distance > elapsedTime * this.speed) {
            var speedX = (this.enemy.X - this.X) / distance * this.speed;
            var speedY = (this.enemy.Y - this.Y) / distance * this.speed;
            this.X += speedX * elapsedTime;
            this.Y += speedY * elapsedTime;
        } else {
            missiles.delete(this);
        }
    }
};


/* Game Logic */

function canPlaceTower(cellX, cellY) {
    if (cellX < 0 || cellX > 11 || cellY < 0 || cellY > 8) {
        return false;
    }
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
    for (let tower of towers) {
        tower.update(elapsedTime);
    }

    for (let missile of missiles) {
        missile.move(elapsedTime);
    }

    for (let enemy of enemies) {
        enemy.move(elapsedTime);
    }
}

function drawMenu() {
    drawText(13 * CELL_SIZE, CELL_SIZE_2 - 0.15 * CELL_SIZE,
             2 * CELL_SIZE, 0.3 * CELL_SIZE,
             "Бюджет", "white");
    drawText(13 * CELL_SIZE, CELL_SIZE_2 + 0.15 * CELL_SIZE,
             2 * CELL_SIZE, 0.2 * CELL_SIZE,
             "Это то, что тратить", "white");
     drawText(15 * CELL_SIZE, CELL_SIZE_2,
              2 * CELL_SIZE, 0.3 * CELL_SIZE,
              budget + " ₽", "white");

    for (var i = 0; i < TOWER_SHOP.length; ++i) {
        var item = TOWER_SHOP[i];
        var color = item.price > budget ? "red" : "white";
        drawElement(12 * CELL_SIZE + CELL_SIZE_2,
                    (1 + i) * CELL_SIZE + CELL_SIZE_2,
                    CELL_SIZE, CELL_SIZE, 0,
                    item.type);
        drawText(14 * CELL_SIZE + CELL_SIZE_2,
                 (1 + i) * CELL_SIZE + CELL_SIZE_2 - 0.3 * CELL_SIZE,
                 3 * CELL_SIZE, 0.25 * CELL_SIZE,
                 item.title, color);
        drawText(14 * CELL_SIZE + CELL_SIZE_2,
                 (1 + i) * CELL_SIZE + CELL_SIZE_2,
                 3 * CELL_SIZE, 0.2 * CELL_SIZE,
                 item.description, color);
        drawText(14 * CELL_SIZE + CELL_SIZE_2,
                 (1 + i) * CELL_SIZE + CELL_SIZE_2 + 0.3 * CELL_SIZE,
                 3 * CELL_SIZE, 0.2 * CELL_SIZE,
                 "Цена: " + item.price + " ₽", color);
    }
}

function drawScene() {
    $(game).empty();

    var cellX = coordToCell(mouseX);
    var cellY = coordToCell(mouseY);

    for (let tower of towers) {
        drawElement(tower.cellX * CELL_SIZE + CELL_SIZE_2,
                    tower.cellY * CELL_SIZE + CELL_SIZE_2,
                    CELL_SIZE, CELL_SIZE, tower.getRotation(),
                    "lozhkin");
    }

    for (let enemy of enemies) {
        drawElement(enemy.X, enemy.Y,
                    CELL_SIZE, CELL_SIZE, 0,
                    "spoon2");
    }

    for (let missile of missiles) {
        drawElement(missile.X, missile.Y,
                    CELL_SIZE_2, CELL_SIZE_2, 0,
                    "spoon1");
    }

    if (canPlaceTower(cellX, cellY)) {
        drawElement(cellX * CELL_SIZE + CELL_SIZE_2,
                    cellY * CELL_SIZE + CELL_SIZE_2,
                    2 * DEFAULT_RADIUS, 2 * DEFAULT_RADIUS, 0,
                    "circle");
        drawElement(cellX * CELL_SIZE + CELL_SIZE_2,
                    cellY * CELL_SIZE + CELL_SIZE_2,
                    CELL_SIZE, CELL_SIZE, 0,
                    "lozhkin");
    } else if (cellX < 12) {
        drawElement(cellX * CELL_SIZE + CELL_SIZE_2,
                    cellY * CELL_SIZE + CELL_SIZE_2,
                    CELL_SIZE, CELL_SIZE, 0,
                    "red_cross");
    }

    drawMenu();
}

function mainLoop(timestamp) {
    var elapsedTime = Math.min(100, (timestamp - prevTimestamp)) / 1000;
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

    enemies.add(new Enemy(0.1));
    window.requestAnimationFrame(mainLoop);
}

$(main);
