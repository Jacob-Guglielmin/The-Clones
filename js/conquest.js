//Declare Variables
var map,coords,eventCoords,string,armyStats,enemyStats;

/**
 * Resets all conquest variables. **THIS IS A HARD RESET**
 */
function resetConquest() {
    //Initialize Variables

    //Map
    map = [],
    coords = [1, 1],
    eventCoords = [],
    zone = 0,

    //Map rendering
    string = "",

    //Army
    armyStats = {
        armySize: 1,
        ready: true,
        health: 5,
        maxHealth: 5,
        attack: 3,
        block: 0
    },

    //Enemy
    enemyStats = {
        fast: false,
        health: 10,
        maxHealth: 10,
        attack: 3
    }
}

var
KNOWLEDGE = "<span class='knowledge'>+</span>"
GRASS = "<span class='grass'>.</span>",
FIELD = "<span class='field'>;</span>",
PATH = "<span class='path'>#</span>",
ARMY = "<span class='army'>@</span>",

armyBar = document.getElementById("armyHealthBar"),
enemyBar = document.getElementById("enemyHealthBar"),

landmarks = {
    zone1: ["10, 1", KNOWLEDGE, "upgradesButton", "10, 5", KNOWLEDGE, "miningButton"]
}

/**
 * Does an attack for both sides, updates everything necessary
 */
function processBattleTick() {
    if (enemyStats.health == 0 && armyStats.ready) {
        newEnemy();
        updateHealthBars();
    }
    if (armyStats.ready) {
        if (enemyStats.fast) {
            if (armyStats.health - (enemyStats.attack - armyStats.block) >= 0) {
                armyStats.health -= (enemyStats.attack - armyStats.block);
            } else {
                armyStats.health = 0;
            }
            if (armyStats.health > 0) {
                if (enemyStats.health - armyStats.attack >= 0) {
                    enemyStats.health -= armyStats.attack;
                } else {
                    enemyStats.health = 0;
                }
            } else {
                armyStats.ready = false;
            }
        } else {
            if (enemyStats.health - armyStats.health >= 0) {
                enemyStats.health -= armyStats.attack;
            } else {
                enemyStats.health = 0;
            }
            if (enemyStats.health > 0) {
                if (armyStats.health - (enemyStats.attack - armyStats.block) >= 0) {
                    armyStats.health -= (enemyStats.attack - armyStats.block);
                } else {
                    armyStats.health = 0;
                }
            }
            if (armyStats.health <= 0) {
                armyStats.ready = false;
            }
        }
        if (enemyStats.health <= 0) {
            updateMap();
        }
    } else {
        if (window.workers.max == window.workers.unemployed && window.workers.max != 0 && window.revealed.conquest == 1) {
            console.log("resetting army");
            window.workers.unemployed -= armyStats.armySize;
            window.workers.total -= armyStats.armySize;
            armyStats.health = armyStats.maxHealth;
            armyStats.ready = true;
        }
    }
    updateHealthBars();
}

function newEnemy() {
    enemyStats.fast = true;
    enemyStats.attack = 3;
    enemyStats.maxHealth = 10;
    enemyStats.health = enemyStats.maxHealth;
}

/**
 * Updates the size of the inner health bars
 */
function updateHealthBars() {
    //Army
    armyBar.style = "width: " + (armyStats.health / armyStats.maxHealth * 100) + "%"

    //Enemy
    enemyBar.style = "width: " + (enemyStats.health / enemyStats.maxHealth * 100) + "%"
}

/**
 * Updates the map array to show the location of the army
 */
function updateMap() {
    if (eventCoords.includes(((coords[0] + 2) / 3) + ", " + ((coords[1] + 2) / 3))) {
        document.getElementById(eventCoords[(eventCoords.indexOf(((coords[0] + 2) / 3) + ", " + ((coords[1] + 2) / 3))) + 1]).classList.remove("hidden");
        if (eventCoords[(eventCoords.indexOf(((coords[0] + 2) / 3) + ", " + ((coords[1] + 2) / 3))) + 1] == "upgradesButton") {
            window.revealed.upgrades = 1;
        }
    }
    if (coords[0] == 28 && coords[1] == 1) {
        coords = [1, 1];
        generateMap();
    } else {
        map[coords[0]][coords[1]] = PATH;
        if (((coords[0] + 2) / 3) % 2 != 0) {
            if (coords[1] != 1 || coords[0] == 1) {
                map[coords[0]][coords[1]-1] = PATH;
            } else {
                map[coords[0]-1][coords[1]] = PATH;
            }
            if (coords[1] == 28) {
                map[coords[0]+1][coords[1]] = PATH;
                map[coords[0]+2][coords[1]] = PATH;
                coords[0] += 3;
            } else {
                map[coords[0]][coords[1]+1] = PATH;
                map[coords[0]][coords[1]+2] = PATH;
                coords[1] += 3;
            }
        } else {
            if (coords[1] != 28) {
                map[coords[0]][coords[1]+1] = PATH;
            } else {
                map[coords[0]-1][coords[1]] = PATH;
            }
            if (coords[1] == 1) {
                map[coords[0]+1][coords[1]] = PATH;
                map[coords[0]+2][coords[1]] = PATH;
                coords[0] += 3;
            } else {
                map[coords[0]][coords[1]-1] = PATH;
                map[coords[0]][coords[1]-2] = PATH;
                coords[1] -= 3;
            }
        }
        map[coords[0]][coords[1]] = ARMY;
    }
    drawMap();
}

/**
 * Generates the map
 */
function generateMap() {
    zone++;
    eventCoords = [];
    map = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
    if (Math.random() > 0.5) {
        map[0][0] = GRASS;
    } else {
        map[0][0] = FIELD;
    }
    for (let i = 1; i <= 29; i++) {
        if (Math.random() > 0.3) {
            map[0][i] = map[0][i-1];
        } else {
            if (map[0][i-1] == GRASS) {
                map[0][i] = FIELD;
            } else {
                map[0][i] = GRASS;
            }
        }
    }
    for (let i = 1; i <= 29; i++) {
        if (Math.random() > 0.3) {
            map[i][0] = map[i-1][0];
        } else {
            if (map[i-1][0] == GRASS) {
                map[i][0] = FIELD;
            } else {
                map[i][0] = GRASS;
            }
        }
        for (let o = 1; o <= 29; o++) {
            if (map[i-1][o] == map[i][o-1]) {
                if (Math.random() > 0.1) {
                    map[i][o] = map[i][o-1];
                } else {
                    if (map[i][o-1] == GRASS) {
                        map[i][o] = FIELD;
                    } else {
                        map[i][o] = GRASS;
                    }
                }
            } else {
                if (Math.random() > 0.5) {
                    map[i][o] = GRASS;
                } else {
                    map[i][o] = FIELD;
                }
            }
        }
    }
    emptyMap = map;
    map[1][0] = PATH;
    map[1][1] = ARMY;
    
    if (landmarks.hasOwnProperty("zone" + zone)) {
        for (let i = 0; i < landmarks["zone" + zone].length / 3; i++) {
            let x = parseInt(landmarks["zone" + zone][i * 3].substring(0, landmarks["zone" + zone][i * 3].indexOf(",")))
            let y = parseInt(landmarks["zone" + zone][i * 3].substring(landmarks["zone" + zone][i * 3].indexOf(",") + 2, landmarks["zone" + zone][i * 3].length))
            placeLandmark(landmarks["zone" + zone][i * 3 + 1], x, y, landmarks["zone" + zone][i * 3 + 2]);
        }
    }
}

/**
 * Changes a map cell to a certain landmark
 * 
 * @param type the landmark to place
 * @param x the x-coordinate of the cell to put it in
 * @param y the y-coordinate of the cell to put it in
 * @param benefit what the player will gain
 */
function placeLandmark(type, x, y, benefit) {
    for (let i = 1; i <= 3; i++) {
        for (let o = 1; o <= 3; o++) {
            map[y * 3 - i][x * 3 - o] = type;
        }
    }
    eventCoords.push(x + ", " + y);
    eventCoords.push(benefit);
    drawMap();
}

/**
 * Puts the map on the screen
 */
function drawMap() {
    string = "";
    for (i in map) {
        for (const o in map[i]) {
            string += map[i][o];
        }
        string += "<br>";
    }
    string = string.substring(0, string.length - 4);
    document.getElementById("mapText").innerHTML = string;
}