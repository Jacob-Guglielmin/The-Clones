var 
saveVar = {},
loadVar = {},
compressed = "",
decompressed = ""

/**
 * Compresses the current save and saves it to localStorage or the export text box
 * 
 * @param saveType how to save the game
 */
function save(saveType) {
    saveVar = {
        resources: window["resources"],
        buildings: window["buildings"],
        workers: window["workers"],
        map: window["map"],
        coords: window["coords"],
        zone: window["zone"],
        eventCoords: window["eventCoords"],
        armyStats: window["armyStats"],
        enemyStats: window["enemyStats"],
        revealed: window["revealed"]
    }

    decompressed = JSON.stringify(saveVar);
    compressed = LZString.compressToBase64(decompressed);

    if (saveType == "localStorage") {
        try {
            localStorage.setItem("clonesSave", compressed);
        } catch (e) {}
    } else if (saveType == "export") {
        document.getElementById("exportBox").value = compressed;
        setTimeout(() => {
            document.getElementById("exportBox").focus();
            document.getElementById("exportBox").select();
        }, 0);
    }
}

/**
 * Loads a save from localStorage or the import text box
 * 
 * @param loadType what to load the game from
 */
function load(loadType) {
    if (loadType == "localStorage") {
        try {
            compressed = localStorage.getItem("clonesSave");
        } catch (e) {}
    } else if (loadType == "import") {
        compressed = document.getElementById("importBox").value;
    }
    try {
        decompressed = LZString.decompressFromBase64(compressed);
        loadVar = JSON.parse(decompressed);
    } catch (e) {}
    if (loadVar) {
        if (loadVar.resources) {
            if (loadVar.resources.food) {window.resources.food = loadVar.resources.food;}
            if (loadVar.resources.wood) {window.resources.wood = loadVar.resources.wood;}
            if (loadVar.resources.metal) {window.resources.metal = loadVar.resources.metal;}
            if (loadVar.resources.insight) {window.resources.insight = loadVar.resources.insight;}
        }
        if (loadVar.buildings) {
            if (loadVar.buildings.hut) {window.buildings.hut = loadVar.buildings.hut;}
        }
        if (loadVar.workers) {
            window.workers = loadVar.workers;
            if (loadVar.workers.farmer) {window.workers.farmer = loadVar.workers.farmer;}
            if (loadVar.workers.lumberjack) {window.workers.lumberjack = loadVar.workers.lumberjack;}
            if (loadVar.workers.miner) {window.workers.miner = loadVar.workers.miner;}
        }
        if (loadVar.map && loadVar.map.length) {window.map = loadVar.map;}
        if (loadVar.coords) {window.coords = loadVar.coords;}
        if (loadVar.zone) {window.zone = loadVar.zone;}
        if (loadVar.eventCoords) {window.eventCoords = loadVar.eventCoords;}
        if (loadVar.armyStats) {window.armyStats = loadVar.armyStats;}
        if (loadVar.enemyStats) {window.enemyStats = loadVar.enemyStats;}
        
        if (loadVar.revealed) {
            if (loadVar.revealed.wood == 1) {
                document.getElementById("story").innerHTML = "";
                storyDisplayed = "";
                document.getElementById("woodContainer").classList.remove("hidden");
                if (loadVar.revealed.buildings == 1) {
                    document.getElementById("purchaseContainer").classList.remove("hidden");
                    if (loadVar.revealed.workers == 1) {
                        document.getElementById("workersContainer").classList.remove("hidden");
                        if (loadVar.revealed.jobs == 1) {
                            document.getElementById("jobsButton").classList.remove("hidden");
                            document.getElementById("foodNetContainer").classList.remove("hidden");
                            if (loadVar.revealed.lumberjack == 1) {
                                document.getElementById("lumberjackButton").classList.remove("hidden");
                                document.getElementById("woodNetContainer").classList.remove("hidden");
                                if (loadVar.revealed.conquest == 1) {
                                    document.getElementById("homeButton").classList.remove("hidden");
                                    document.getElementById("conquestButton").classList.remove("hidden");
                                    if (loadVar.revealed.upgrades == 1) {
                                        document.getElementById("upgradesButton").classList.remove("hidden");
                                        if (loadVar.revealed.insight == 1) {
                                            document.getElementById("philosophyButton").classList.add("hidden");
                                            document.getElementById("insightContainer").classList.remove("hidden");
                                            document.getElementById("philosopherButton").classList.remove("hidden");
                                            if (loadVar.revealed.metal == 1) {
                                                document.getElementById("miningButton").classList.add("hidden");
                                                document.getElementById("metalContainer").classList.remove("hidden");
                                                document.getElementById("minerButton").classList.remove("hidden");
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            window["revealed"] = loadVar.revealed;
        }
    }
    drawMap();
    updateResourceValues();
    updateBuildingValues();
    updateWorkerValues();
}