"use strict";
//Initialize variables
var zone = 0,
row = 0,
cell = 0,
army = {
    health: 0,
    maxHealth: 10,
    attack: undefined,
    averageAttack: 3,
    minAttack: undefined,
    maxAttack: undefined,
    clones: 5
},
enemy = {
    health: 10,
    maxHealth: 10,
    attack: undefined,
    averageAttack: 2,
    minAttack: undefined,
    maxAttack: undefined,
    fast: false
},
fighting = false,
autoFight = false,
battleGrid = document.getElementById("battleGrid"),
armyHealthBar = document.getElementById("armyHealth"),
enemyHealthBar = document.getElementById("enemyHealth"),
ready = false;

/**
 * Sets up values on the screen
 */
function init() {
    populateGrid();
    calculateDamage(true);
    calculateDamage(false);
    ready = true;
}

/**
 * Updates the information in the battle screen
 */
function updateBattleValues() {
    document.getElementById("zoneNumber").innerHTML = "Zone " + zone;
}

/**
 * Processes the current attack for the army and the enemy
 */
function processBattleTick() {
    if (fighting) {
        if (army.health > 0) {
            enemy.attack = random(enemy.minAttack, enemy.maxAttack);
            army.attack = random(army.minAttack, army.maxAttack);
            if (enemy.fast) {
                army.health -= enemy.attack;
                if (army.health > 0) {
                    enemy.health -= army.attack;
                    if (enemy.health <= 0) {
                        nextCell();
                    }
                } else {
                    army.health = 0;
                    fighting = false;
                }
            } else {
                enemy.health -= army.attack;
                if (enemy.health > 0) {
                    army.health -= enemy.attack;
                    if (army.health <= 0) {
                        army.health = 0;
                        fighting = false;
                    }
                } else {
                    nextCell();
                }
            }
            if (autoFight && !fighting && window.clones.available >= army.clones) {
                window.clones.available -= army.clones;
                fighting = true;
            }
        } else {
            army.health = army.maxHealth;
        }

        armyHealthBar.style.width = ((army.health / army.maxHealth) * 100) + "%";
        enemyHealthBar.style.width = ((enemy.health / enemy.maxHealth) * 100) + "%";
    }
}

/**
 * Moves to the next cell, row or zone as required and creates an enemy
 */
function nextCell() {
    //Advance the location variables and update the map
    battleGrid.children[row].children[cell].classList.add("battleCellBeaten");

    giveRewards();
    
    if (cell < 9) {
        cell++;
    } else {
        if (row < 9) {
            row++;
            cell = 0;
        } else {
            zone++;
            row = 0;
            cell = 0;
            populateGrid();
            updateBattleValues();
        }
    }
    battleGrid.children[row].children[cell].classList.add("battleCellOn");

    //Create an enemy
    enemy.health = enemy.maxHealth;
    calculateDamage(false);
}

/**
 * Deletes and re-creates the battle table and all of its cells
 */
function populateGrid() {
    //Delete battle grid
    while (battleGrid.firstChild) {
        battleGrid.removeChild(battleGrid.lastChild);
    }

    let row = undefined,
    cell = undefined;

    //Create all of the cells
    for (let i = 0; i < 10; i++) {
        row = battleGrid.insertRow(i);
        for (let o = 0; o < 10; o++) {
            cell = row.insertCell(o);
            cell.classList.add("battleCell");
        }
    }

    //Insert icons
    addLocations();
}

/**
 * Adds all glyphicons and rewards to the correct cells in the grid
 */
function addLocations() {
    for (let i = 0; i < MAP_LOCATIONS[zone].length; i++) {
        let icon = document.createElement("span");
        console.log(MAP_LOCATIONS[zone][i][3]);
        if (MAP_LOCATIONS[zone][i][3].includes("glyphicon")) {
            icon.classList.add("glyphicon", MAP_LOCATIONS[zone][i][3]);
        } else {
            icon.classList.add("icomoon", MAP_LOCATIONS[zone][i][3]);
        }
        battleGrid.children[MAP_LOCATIONS[zone][i][1]].children[MAP_LOCATIONS[zone][i][2]].appendChild(icon);
    }
}

/**
 * Give the reward (if any) for the cell
 */
function giveRewards() {
    for (let i = 0; i < MAP_LOCATIONS[zone].length; i++) {
        if (MAP_LOCATIONS[zone][i][0].includes(row + ", " + cell)) {
            //Check if an upgrade should be made available
            if (window.purchases.hasOwnProperty(MAP_LOCATIONS[zone][i][4])) {
                window.purchases[MAP_LOCATIONS[zone][i][4]].available++;
                window.updatePurchaseValues();
                break;

            //Check if a resource should be given
            } else if (window.resources.hasOwnProperty(MAP_LOCATIONS[zone][i][4])) {
                window.resources[MAP_LOCATIONS[zone][i][4]].total += 10;
                break;
            }
        }
    }
}

/**
 * Calculates the range of damage values that can be dealt
 * 
 * @param {boolean} isArmy Whether the damage calculation is for the enemy or the army
 */
function calculateDamage(isArmy) {
    let defaultFluctuation = 0.2;
    
    if (isArmy) {
        //Calculate clone damage
        army.minAttack = Math.floor(army.averageAttack * (1 - defaultFluctuation));
        army.maxAttack = Math.ceil(army.averageAttack + (army.averageAttack * defaultFluctuation));
        
        document.getElementById("armyDamage").innerHTML = army.minAttack + "-" + army.maxAttack + " Damage";
    } else {
        //Calculate enemy damage
        enemy.minAttack = Math.floor(enemy.averageAttack * (1 - defaultFluctuation));
        enemy.maxAttack = Math.ceil(enemy.averageAttack + (enemy.averageAttack * defaultFluctuation));

        document.getElementById("enemyDamage").innerHTML = enemy.minAttack + "-" + enemy.maxAttack + " Damage";
    }
}

init();