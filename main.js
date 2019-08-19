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
const DEFAULT_RADIUS = 1.85 * CELL_SIZE;

const ENEMY_TYPES = [
    "enemy1",
    "enemy2",
    "enemy3",
    "enemy4",
    "enemy5",
    "enemy6"
];

const TOWER_SHOP = [
    {
        "type": "writer",
        "title": "Великий учёный",
        "description": "Получает асимптотические оценки",
        "price": 250
    },
    {
        "type": "science",
        "title": "Зам. декана по науке",
        "description": "Тщательно планирует время",
        "price": 500
    },
    {
        "type": "finance",
        "title": "Зам. декана по финансам",
        "description": "Помогает увеличивать гранты",
        "price": 500
    },
    {
        "type": "svetilo",
        "title": "Светило кибернетики",
        "description": "Ярким светом вдохновляет",
        "price": 1000
    }
];

const REPLIC_TIMEOUT = 10;
const REPLICS = [
    "Так сказать..",
    "Сумма тупиковых",
    "Квазиизоморфизм",
    "Пучок граней",
    "Универсальный многополюсник",
    "Квазиполное дерево",
    "АОВСТ",
    "Стандартное ДУМ",
    "Теорема Журавлёва",
    "ФАЛ голосования",
    "Лемма о протыкающих наборах",
    "Оценки типичных значений",
    "Разделительные КС",
    "КПСТ отсутствует!",
    "Асимптотически наилучший"
];


/* Globals */

var game = null;
var mouseX = 0;
var mouseY = 0;
var prevTimestamp = 0;
var gameOver = false;

var budget = 500;
var toBuild = null;
var towers = new Set();
var enemies = new Set();
var missiles = new Set();
var messages = new Set();
var replicTimeout = REPLIC_TIMEOUT;
var wave = 1;
var waveSpawned = 0;
var waveSpawnTimeout = 5.0;


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

function drawText(x, y, width, height, text, color, opacity) {
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
        "color": color,
        "opacity": opacity
    }).text(text);

    $(game).append(element);
}

function coordToCell(value) {
    return Math.floor(value / CELL_SIZE);
}

function randomElement(array) {
    array = Array.from(array);
    return array[Math.floor(Math.random() * array.length)];
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

    if (gameOver) {
        return;
    }

    if (toBuild == null && cellX >= 12) {
        var shopIndex = cellY - 1;
        if (shopIndex >= 0 && shopIndex < TOWER_SHOP.length && TOWER_SHOP[shopIndex].price <= budget) {
            toBuild = shopIndex;
        }
        return;
    }

    if (toBuild != null && cellX < 12) {
        placeTower(cellX, cellY);
        return;
    }

    if (toBuild != null && cellX >= 12 && cellY == 0) {
        toBuild = null;
        return;
    }
}

function mouseup(evt) {
}

function mousemove(evt) {
    if (gameOver) {
        return;
    }

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
    constructor(cellX, cellY, type) {
        this.cellX = cellX;
        this.cellY = cellY;
        this.type = type;
        this.radius = DEFAULT_RADIUS;
        if (this.type == "writer") {
            this.reload = 0.0;
            this.reloadSpeed = 1.0;
            this.strength = 1.0;
        } else if (this.type == "science") {
            this.strength = 2.0;
        } else if (this.type == "finance") {
            this.strength = 2.0;
        } else if (this.type == "svetilo") {
            this.strength = 2.0;
        }
    }

    update(elapsedTime) {
        if (this.type == "writer") {
            var towerX = this.cellX * CELL_SIZE + CELL_SIZE_2;
            var towerY = this.cellY * CELL_SIZE + CELL_SIZE_2;

            var reloadSpeed = this.reloadSpeed;
            for (let tower of towers) {
                if (tower.type != "svetilo") {
                    continue;
                }
                var anotherTowerX = tower.cellX * CELL_SIZE + CELL_SIZE_2;
                var anotherTowerY = tower.cellY * CELL_SIZE + CELL_SIZE_2;
                var distance = Math.sqrt((towerX - anotherTowerX) ** 2 + (towerY - anotherTowerY) ** 2);
                if (distance < tower.radius) {
                    reloadSpeed = Math.max(reloadSpeed, this.reloadSpeed * tower.strength);
                }
            }

            this.reload -= elapsedTime * reloadSpeed;
            if (this.reload <= 0) {
                this.reload = 0;
                for (let enemy of enemies) {
                    if (!enemy.alive) {
                        continue;
                    }
                    var dist = Math.sqrt((enemy.X - towerX) ** 2 + (enemy.Y - towerY) ** 2);
                    if (dist > this.radius) {
                        continue;
                    }
                    missiles.add(new Missile(towerX, towerY, 1.0, this.strength, enemy));
                    this.reload = 1.0;
                    break;
                }
            }
        }
    }

    getRotation() {
        var rotation = 0;
        if (this.type == "writer") {
            if (this.reload < 0.25) {
                rotation = 40 * this.reload;
            } else if (this.reload < 0.75) {
                rotation = 40 * (0.5 - this.reload);
            } else {
                rotation = 40 * (this.reload - 1.0);
            }
        }
        return rotation;
    }
};

class Enemy {
    constructor(shield, speed, reward) {
        this.type = randomElement(ENEMY_TYPES);
        this.X = PATH[0][0] * CELL_SIZE + CELL_SIZE_2;
        this.Y = PATH[0][1] * CELL_SIZE + CELL_SIZE_2;
        this.nextPathCell = 1;
        this.elapsedTime = 0;
        this.health = 1.0;
        this.shield = shield;
        this.speed = speed * 0.1;
        this.reward = reward;
        this.alive = true;
    }

    movePart() {
        if (!this.alive || this.nextPathCell >= PATH.length) {
            this.alive = false;
            enemies.delete(this);
            gameOver = true;
            return false;
        }

        var speed = this.speed;
        for (let tower of towers) {
            if (tower.type != "science") {
                continue;
            }
            var towerX = tower.cellX * CELL_SIZE + CELL_SIZE_2;
            var towerY = tower.cellY * CELL_SIZE + CELL_SIZE_2;
            var distance = Math.sqrt((towerX - this.X) ** 2 + (towerY - this.Y) ** 2);
            if (distance < tower.radius) {
                speed = Math.min(speed, this.speed / tower.strength);
            }
        }

        var destX = PATH[this.nextPathCell][0] * CELL_SIZE + CELL_SIZE_2;
        var destY = PATH[this.nextPathCell][1] * CELL_SIZE + CELL_SIZE_2;
        var distance = Math.sqrt((destX - this.X) ** 2 + (destY - this.Y) ** 2);

        if (distance > this.elapsedTime * speed) {
            var speedX = (destX - this.X) / distance * speed;
            var speedY = (destY - this.Y) / distance * speed;
            this.X += speedX * this.elapsedTime;
            this.Y += speedY * this.elapsedTime;
            this.elapsedTime = 0;
            return false;
        } else {
            this.X = destX;
            this.Y = destY;
            this.nextPathCell += 1;
            this.elapsedTime -= distance / speed;
            return true;
        }
    }

    move(elapsedTime) {
        this.elapsedTime = elapsedTime;
        while (this.movePart()) {}
    }

    damage(strength) {
        if (!this.alive) {
            return;
        }

        var shield = this.shield;
        for (let tower of towers) {
            if (tower.type != "science") {
                continue;
            }
            var towerX = tower.cellX * CELL_SIZE + CELL_SIZE_2;
            var towerY = tower.cellY * CELL_SIZE + CELL_SIZE_2;
            var distance = Math.sqrt((towerX - this.X) ** 2 + (towerY - this.Y) ** 2);
            if (distance < tower.radius) {
                shield = Math.min(shield, this.shield / tower.strength);
            }
        }

        this.health -= strength / shield;
        if (this.health < 1e-6) {
            this.health = 0;
            this.alive = false;

            var reward = this.reward;
            for (let tower of towers) {
                if (tower.type != "finance") {
                    continue;
                }
                var towerX = tower.cellX * CELL_SIZE + CELL_SIZE_2;
                var towerY = tower.cellY * CELL_SIZE + CELL_SIZE_2;
                var distance = Math.sqrt((towerX - this.X) ** 2 + (towerY - this.Y) ** 2);
                if (distance < tower.radius) {
                    reward = Math.max(reward, this.reward * tower.strength);
                }
            }
            budget += reward;
            messages.add(new Message(this.X, this.Y, "+ " + reward +" ₽", "green"));

            enemies.delete(this);
        }
    }
};

class Missile {
    constructor(x, y, speed, strength, enemy) {
        this.X = x;
        this.Y = y;
        this.enemy = enemy;
        this.speed = speed;
        this.strength = strength;
    }

    move(elapsedTime) {
        var distance = Math.sqrt((this.enemy.X - this.X) ** 2 + (this.enemy.Y - this.Y) ** 2);
        if (distance > elapsedTime * this.speed) {
            var speedX = (this.enemy.X - this.X) / distance * this.speed;
            var speedY = (this.enemy.Y - this.Y) / distance * this.speed;
            this.X += speedX * elapsedTime;
            this.Y += speedY * elapsedTime;
        } else {
            this.enemy.damage(this.strength);
            missiles.delete(this);
        }
    }
};

class Message {
    constructor(x, y, text, color) {
        this.X = x;
        this.Y = y;
        this.text = text;
        this.color = color;
        this.ttl = 0.0;
    }

    update(elapsedTime) {
        this.ttl += elapsedTime;
        if (this.ttl > 1.0) {
            messages.delete(this);
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
        towers.add(new Tower(cellX, cellY, TOWER_SHOP[toBuild].type));
        budget -= TOWER_SHOP[toBuild].price;
        toBuild = null;
    }
}

function updateReplic(elapsedTime) {
    if (towers.size == 0) {
        return;
    }

    replicTimeout -= elapsedTime;
    if (replicTimeout < 0) {
        replicTimeout = REPLIC_TIMEOUT;
        var tower = randomElement(towers);
        var replic = randomElement(REPLICS);
        var towerX = tower.cellX * CELL_SIZE + CELL_SIZE_2;
        var towerY = tower.cellY * CELL_SIZE + CELL_SIZE_2;
        messages.add(new Message(towerX, towerY, replic, "red"));
    }
}

function updateWave(elapsedTime) {
    waveSpawnTimeout -= elapsedTime;
    if (waveSpawnTimeout < 0) {
        waveSpawnTimeout = 0;
        if (waveSpawned < 9 + wave) {
            var speed = 1.5 + (wave < 10 ? (wave - 1) / 10 : 1) * Math.random();
            var reward = Math.max(0, 30 - (wave - 1));
            var shield = Math.floor(wave * 1.1 ** Math.floor(wave / 5));
            enemies.add(new Enemy(shield, speed, reward));
            waveSpawned += 1;
            waveSpawnTimeout = 1.0;
        } else if (enemies.size == 0) {
            wave += 1;
            waveSpawned = 0;
            waveSpawnTimeout = 5.0;
        }
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

    for (let message of messages) {
        message.update(elapsedTime);
    }

    updateReplic(elapsedTime);
    updateWave(elapsedTime);
}

function drawMenu(cellX, cellY) {
    if (toBuild != null && cellX < 12) {
        if (canPlaceTower(cellX, cellY)) {
            drawElement(cellX * CELL_SIZE + CELL_SIZE_2,
                        cellY * CELL_SIZE + CELL_SIZE_2,
                        2 * DEFAULT_RADIUS, 2 * DEFAULT_RADIUS, 0,
                        "circle");
            drawElement(cellX * CELL_SIZE + CELL_SIZE_2,
                        cellY * CELL_SIZE + CELL_SIZE_2,
                        CELL_SIZE, CELL_SIZE, 0,
                        TOWER_SHOP[toBuild].type);
        } else {
            drawElement(cellX * CELL_SIZE + CELL_SIZE_2,
                        cellY * CELL_SIZE + CELL_SIZE_2,
                        CELL_SIZE, CELL_SIZE, 0,
                        "red_cross");
        }
    }

    if (toBuild == null && cellX >= 12) {
        var shopIndex = cellY - 1;
        if (shopIndex >= 0 && shopIndex < TOWER_SHOP.length && TOWER_SHOP[shopIndex].price <= budget) {
            drawElement(14 * CELL_SIZE,
                        cellY * CELL_SIZE + CELL_SIZE_2,
                        4 * CELL_SIZE, CELL_SIZE, 0,
                        "menuSelector");
        }
    }

    if (toBuild != null && cellX >= 12 && cellY == 0) {
        drawElement(14 * CELL_SIZE,
                    cellY * CELL_SIZE + CELL_SIZE_2,
                    4 * CELL_SIZE, CELL_SIZE, 0,
                    "menuSelector");
    }

    if (toBuild == null) {
        drawText(13 * CELL_SIZE, CELL_SIZE_2 - 0.15 * CELL_SIZE,
                 2 * CELL_SIZE, 0.3 * CELL_SIZE,
                 "Бюджет", "white", 1.0);
        drawText(13 * CELL_SIZE, CELL_SIZE_2 + 0.15 * CELL_SIZE,
                 2 * CELL_SIZE, 0.2 * CELL_SIZE,
                 "Это то, что тратить", "white", 1.0);
        drawText(15 * CELL_SIZE, CELL_SIZE_2,
                 2 * CELL_SIZE, 0.3 * CELL_SIZE,
                 budget + " ₽", "white", 1.0);
    } else {
        drawText(14 * CELL_SIZE, CELL_SIZE_2,
                 2 * CELL_SIZE, 0.3 * CELL_SIZE,
                 "Отменить", "white", 1.0);
    }

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
                 item.title, color, 1.0);
        drawText(14 * CELL_SIZE + CELL_SIZE_2,
                 (1 + i) * CELL_SIZE + CELL_SIZE_2,
                 3 * CELL_SIZE, 0.2 * CELL_SIZE,
                 item.description, color, 1.0);
        drawText(14 * CELL_SIZE + CELL_SIZE_2,
                 (1 + i) * CELL_SIZE + CELL_SIZE_2 + 0.3 * CELL_SIZE,
                 3 * CELL_SIZE, 0.2 * CELL_SIZE,
                 "Цена: " + item.price + " ₽", color, 1.0);
    }

    drawText(14 * CELL_SIZE,
             8 * CELL_SIZE + CELL_SIZE_2,
             4 * CELL_SIZE, 0.3 * CELL_SIZE,
             "Волна " + wave, "white", 1.0);
}

function drawGameOver() {
    drawElement(8 * CELL_SIZE, 4.5 * CELL_SIZE,
                16 * CELL_SIZE, 9 * CELL_SIZE,
                0, "gameOver");
    drawText(8 * CELL_SIZE, 4.5 * CELL_SIZE,
             16 * CELL_SIZE, 0.75 * CELL_SIZE,
             "ОЦЕНКА АСИМПТОТИЧЕСКИ НЕТОЧНА!", "black", 1.0);
}

function drawScene() {
    $(game).empty();

    var cellX = coordToCell(mouseX);
    var cellY = coordToCell(mouseY);

    for (let tower of towers) {
        drawElement(tower.cellX * CELL_SIZE + CELL_SIZE_2,
                    tower.cellY * CELL_SIZE + CELL_SIZE_2,
                    CELL_SIZE, CELL_SIZE, tower.getRotation(),
                    tower.type);
    }

    for (let enemy of enemies) {
        drawElement(enemy.X, enemy.Y,
                    CELL_SIZE, CELL_SIZE, 0,
                    enemy.type);
        drawElement(enemy.X, enemy.Y - 0.35 * CELL_SIZE,
                    0.8 * CELL_SIZE, 0.1 * CELL_SIZE, 0,
                    "healthBack");
        drawElement(enemy.X - (1 - enemy.health) * 0.8 * CELL_SIZE_2, enemy.Y - 0.35 * CELL_SIZE,
                    0.8 * enemy.health * CELL_SIZE, 0.1 * CELL_SIZE, 0,
                    "healthFront");
    }

    for (let missile of missiles) {
        drawElement(missile.X, missile.Y,
                    CELL_SIZE_2, CELL_SIZE_2, 0,
                    "spoon1");
    }

    drawMenu(cellX, cellY);

    for (let message of messages) {
        var opacity = message.ttl < 0.5 ? 1.0 : 2 * (1.0 - message.ttl);
        drawText(message.X, message.Y - message.ttl * 0.05,
                 1.0, 0.3 * CELL_SIZE,
                 message.text, message.color, opacity);
    }

    if (gameOver) {
        drawGameOver();
    }
}

function mainLoop(timestamp) {
    var elapsedTime = Math.min(100, (timestamp - prevTimestamp)) / 1000;
    prevTimestamp = timestamp;
    if (!gameOver) {
        updateState(elapsedTime);
    }
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
