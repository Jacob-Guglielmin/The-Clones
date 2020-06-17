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
        version: window.version,
        trackers: window.trackers,
        resources: window.resources,
        purchases: window.purchases,
        clones: window.clones,
        revealed: window.revealed,
        actionText: document.getElementById("actionButton").innerHTML,
    }

    decompressed = JSON.stringify(saveVar);
    compressed = LZString.compressToBase64(decompressed);

    if (saveType == "localStorage") {
        //DEVONLY Enable localStorage
        /* try {
            localStorage.setItem("clonesSave", compressed);
        } catch (e) {} */
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

    if (loadVar.version) {

        if (loadVar.version == window.version) {
            continueLoad = true;
        } else {
            continueLoad = confirm("Warning: Your save string was created in an earlier version. Loading this save string may have undesirable results. Are you sure you want to proceed?");
        }

        if (continueLoad) {

            //Cancel writing the start of the story
            if (window.startTask) {
                clearTimeout(window.startTask);
                console.log("Loading save - cancelling timeout");
            }

            //Text changes
            document.getElementById("actionButton").innerHTML = loadVar.actionText;
            if (loadVar.actionText.charCodeAt(0) == 8207 /* 8207 is a blank character */ || loadVar.actionText == "Sleeping") {
                document.getElementById("actionButton").disabled = true;
            }
            window.storyDisplayed = "";
            document.getElementById("story").innerHTML = storyDisplayed;
            document.getElementById("actionContainer").classList.remove("hidden");
            if (loadVar.actionText != "Sleeping") {
                document.getElementById("actionProgressBar").style.width = (Math.floor(loadVar.trackers.actions.counter/loadVar.trackers.actions.required*100))+"%";
            } else {
                document.getElementById("actionProgressBar").style.width = (Math.floor(loadVar.trackers.wait.counter/(loadVar.trackers.wait.time*10)*100)) + "%";
            }
            document.getElementById("cloningProgressBar").style.width = (Math.floor(loadVar.trackers.cloning.counter/loadVar.trackers.cloning.required*100))+"%";

            //Write variables
            window.trackers = loadVar.trackers;
            window.resources = loadVar.resources;
            window.purchases = loadVar.purchases;
            window.clones = loadVar.clones;
            window.revealed = loadVar.revealed;

            //Story-based unlocks
            if (loadVar.revealed.metal) {

                document.getElementById("metalContainer").classList.remove("hidden");
                document.getElementById("purchaseContainer").classList.remove("hidden");

                if (loadVar.revealed.hideGenerator) {

                    document.getElementById("generatorButton").classList.add("hidden");

                    if (loadVar.revealed.spear) {

                        document.getElementById("spearButton").classList.remove("hidden");

                        if (loadVar.revealed.hideSpear) {

                            document.getElementById("spearButton").classList.add("hidden");

                            if (loadVar.revealed.science) {

                                document.getElementById("clonesContainer").classList.remove("hidden");
                                document.getElementById("scienceContainer").classList.remove("hidden");

                                if (loadVar.revealed.cloning) {

                                    document.getElementById("cloningContainer").classList.remove("hidden");
                                    document.getElementById("powerContainer").classList.remove("hidden");
                                    document.getElementById("actionTable").classList.add("hidden");

                                    if (loadVar.revealed.upgrades) {

                                        document.getElementById("upgradesButton").classList.remove("hidden");

                                        if (loadVar.revealed.explosive) {

                                            document.getElementById("escapeButton").classList.add("hidden");
                                            document.getElementById("explosiveButton").classList.remove("hidden");

                                            if (loadVar.revealed.food) {

                                                document.getElementById("explosiveButton").classList.add("hidden");
                                                document.getElementById("foodContainer").classList.remove("hidden");
                                                document.getElementById("farmerButton").classList.remove("hidden");
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            //Other unlocks
            if (loadVar.revealed.metalStorage) {
                document.getElementById("metalMaxContainer").classList.remove("hidden");
                document.getElementById("crateButton").classList.remove("hidden");
            }
        }
    }
}