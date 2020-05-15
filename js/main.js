/**
 * Idle Game
 * 
 * on metal unlock move purchasecontainer to top = 7.5vh
 * 
 * 
 * Jacob Guglielmin
 */

//Declare variables
var resources, buildings, workers, revealed, visible

/**
 * Resets all variables. **THIS IS A HARD RESET**
 */
function resetVariables() {
    //Initialize Variables

    //Resources
    resources = {
        food: {
            name:"food",
            total:0,
            dTotal:0,
            net:0,
            maximum:200,
            clicks:0,
            increment:1
        },
        wood: {
            name:"wood",
            total:0,
            dTotal:0,
            net:0,
            maximum:200,
            clicks:0,
            increment:1
        },
        metal: {
            name:"metal",
            total:0,
            dTotal:0,
            net:0,
            clicks:0,
            maximum:200,
            increment:1
        },
        insight: {
            name:"insight",
            total:0,
            dTotal:0,
            net:0,
        }
    },

    //Buildings
    buildings = {
        hut: {
            owned:0,
            requires: {
                food:5,
                wood:15
            },
            gives: {
                maxPopulation:3
            },
            tooltip: {
                info:"Provides living space for ",
                info2: " workers"
            }
        }
    }

    //Workers
    workers = {
        total:0,
        unemployed:0,
        max:0,
        farmer: {
            total:0,
            requires: {
                food:10
            },
            tooltip: {
                info:"Train one of your workers how to farm. Shouldn't be too hard, right? Each farmer harvests ",
                info2:" food per second."
            },
            benefit: 0.7
        },
        lumberjack: {
            total:0,
            requires: {
                food:10,
                wood:10
            },
            tooltip: {
                info:"Teach a worker to cut down the trees that are nearby. Each lumberjack cuts down ",
                info2:" logs per second."
            },
            benefit: 0.5
        },
        miner: {
            total:0,
            requires: {
                food:10,
                metal:10
            },
            tooltip: {
                info:"Find a worker strong enough to mine. Each miner can bring back ",
                info2:" metal per second."
            },
            benefit: 0.2
        },
        philosopher: {
            total:0,
            requires: {
                food:20
            },
            tooltip: {
                info:"With some education, you can have a worker generate some insight. Each philosopher generates ",
                info2:" insight per second."
            },
            benefit: 0.2
        }
    },

    upgrades = {
        philosophy: {
            owned:0,
            requires:{
                food:50
            },
            tooltip: {
                info:"You stumbled upon this ancient tablet outlining how workers could generate insight. Seems that insight could be used for all sorts of things..."
            }
        },
        mining: {
            owned:0,
            requires:{
                food:50,
                insight:10
            },
            tooltip: {
                info:"Using some of your insight, you could probably come up with a way to extract metal from the boulders nearby."
            }
        }
    },

    revealed = {
        wood: 0,
        buildings: 0,
        workers: 0,
        jobs: 0,
        lumberjack: 0,
        conquest: 0,
        upgrades: 0,
        insight: 0,
        metal: 0
    },

    visible = {
        screenAccessing:0,
        purchaseTabAccessing:0,
        workerTabAccessing:0
    }

    resetConquest();
}
resetVariables();

//These variables dont need to be reset on game reset
var STORY = [
    /* 0 */"You awaken in a dark room. You aren't quite sure exactly who you are, or what you were doing.",
    /* 1 */"You start searching the room you are in for any hint as to what might have happened, but it's a difficult task with no lights.",
    /* 2 */"Everything in the room seems to be damaged in some way or another. Most of what you find looks very complex. You start to wonder what could have caused the damage. An explosion, maybe?",
    /* 3 */"In the center of the room, you find a large, cylindrical tube. It looks like it mostly survived whatever happened, but you can't really tell what it's for.",
    /* 4 */"It looks like there are some buttons on the side. You push one of them, and a screen starts up, flashes a little, and fades again. The power to wherever you are must be down.",
    /* 5 */"You found what looks like a big battery. It might have enough power left to turn on the lights for a while, if you could find out where to put it."
],
storyDisplayed = "",

attackCounter = 0,
autoSaveCounter = 0

/**
 * Initializes the game
 */
function init() {
    addStory(0);
    load("localStorage");
    setInterval(() => {
        tick();
    }, 100);
}


/**
 * Main game loop - gets run every tenth of a second
 */
function tick() {

    //Increment food from workers
    for (resource in resources) {
        if (resource == "insight" || resources[resource].dTotal + resources[resource].net/10 <= resources[resource].maximum) {
            resources[resource].dTotal += resources[resource].net/10;
        } else if (resources[resource].dTotal < resources[resource].maximum) {
            resources[resource].dTotal = resources[resource].maximum;
        }
        resources[resource].total = Math.floor(resources[resource].dTotal);
    }

    //Increment workers
    if (buildings.hut.owned >= 2 && workers.total < workers.max) {
        if (random(1, 30) == 1) {
            workers.total += 1;
            workers.unemployed += 1;
            if (workers.total == 10) {
                addStory(4);
                revealed.jobs = 1;
                document.getElementById("foodNetContainer").classList.remove("hidden");
                document.getElementById("jobsButton").classList.remove("hidden");
            }
        }
    }


    //Conquest
    attackCounter++;
    console.log(attackCounter);
    if (attackCounter >= 10) {
        attackCounter = 0;
        processBattleTick();
    }


    if (visible.screenAccessing == 0) {
        updateResourceValues();
        updateBuildingValues();
        updateWorkerValues();
    }
    
    updateTooltip();

    autoSaveCounter++;
    if (autoSaveCounter >= 600) {
        save("localStorage");
        autoSaveCounter = 0;
    }
}

/**
 * Returns a random number between min and max inclusive
 * 
 * @param min lower bound for number
 * @param max upper bound for number
 */
function random(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    );
}

/**
 * Increments a resource by the correct amount
 * 
 * @param resource resource to increment
 */
function increment(resource) {
    if (resources[resource].total + resources[resource].increment <= resources[resource].maximum) {
        resources[resource].dTotal += resources[resource].increment;
        resources[resource].total += resources[resource].increment;
        resources[resource].clicks += 1;
        updateResourceValues();
    } else if (resources[resource].total < resources[resource].maximum) {
        resources[resource].total = resources[resource].maximum;
        resources[resource].dTotal = resources[resource].maximum;
        resources[resource].clicks += 1;
        updateResourceValues();
    }
    if (resources[resource].name == "food") {
        if (resources[resource].clicks == 20) {
            addStory(1);
            revealed.wood = 1;
            document.getElementById("woodContainer").classList.remove("hidden");
        }
    } else if (resources[resource].name == "wood") {
        if (resources[resource].clicks == 20) {
            addStory(2);
            revealed.buildings = 1;
            document.getElementById("purchaseContainer").classList.remove("hidden");
        }
    }
}

/**
 * Creates a building and consumes the required resources
 * 
 * @param building the building to purchase
 * @param amount how many to purchase
 */
function build(building, amount) {
    let canBuild = true;

    for (const resource in buildings[building].requires) {
        if (buildings[building].requires[resource]*amount > resources[resource].total) {
            canBuild = false;
        }
    }

    if (canBuild) {

        for (const resource in buildings[building].requires) {
            resources[resource].dTotal -= buildings[building].requires[resource];
            resources[resource].total -= buildings[building].requires[resource];
            buildings[building].requires[resource] = Math.floor(buildings[building].requires[resource] * 1.2);
        }

        buildings[building].owned += amount;
        workers.max += buildings[building].gives.maxPopulation;
        updateBuildingValues();
        updateResourceValues();
        updateWorkerValues();
        updateTooltip();
        if (building == "hut" && buildings[building].owned == 2) {
            addStory(3);
            revealed.workers = 1;
            document.getElementById("workersContainer").classList.remove("hidden");
        } else if (building == "hut" && buildings[building].owned == 10) {
            addStory(6);
            revealed.conquest = 1;
            document.getElementById("homeButton").classList.remove("hidden");
            document.getElementById("conquestButton").classList.remove("hidden");
        }
    }
}

/**
 * Purchases an upgrade
 * 
 * @param upgrade the upgrade to buy
 */
function purchase(upgrade) {
    let canBuy = true;

    for (const resource in upgrades[upgrade].requires) {
        if (upgrades[upgrade].requires[resource] > resources[resource].total) {
            canBuy = false;
        }
    }

    if (canBuy) {
        for (const resource in upgrades[upgrade].requires) {
            resources[resource].dTotal -= upgrades[upgrade].requires[resource];
            resources[resource].total -= upgrades[upgrade].requires[resource];
            document.getElementById(upgrade + "Button").classList.add("hidden");
        }
        if (upgrade == "philosophy") {
            document.getElementById("insightContainer").classList.remove("hidden");
            document.getElementById("philosopherButton").classList.remove("hidden");
            revealed.insight = 1;
        }
        if (upgrade == "mining") {
            document.getElementById("metalContainer").classList.remove("hidden");
            document.getElementById("minerButton").classList.remove("hidden");
            revealed.metal = 1;
        }
    }
}

/**
 * Assigns workers a job
 * 
 * @param job the job to put workers into
 * @param amount the amount of workers to hire
 */
function hire(job, amount) {
    if (workers.unemployed >= amount) {
        let canHire = true;
    
        for (const resource in workers[job].requires) {
            if (workers[job].requires[resource]*amount > resources[resource].total) {
                canHire = false;
            }
        }

        if (canHire) {
            for (const resource in workers[job].requires) {
                resources[resource].dTotal -= workers[job].requires[resource];
                resources[resource].total -= workers[job].requires[resource];
            }
            workers.unemployed -= amount;
            workers[job].total += amount;
            if (job == "farmer" && workers[job].total == 5) {
                addStory(5);
                revealed.lumberjack = 1;
                document.getElementById("lumberjackButton").classList.remove("hidden");
                document.getElementById("woodNetContainer").classList.remove("hidden");
            }
            calculateNetResources();
            updateResourceValues();
            updateWorkerValues();
            tooltip(job);
        }
    }
}

/**
 * Updates the values of all of the resources in the HTML
 */
function updateResourceValues() {
    //Food
    document.getElementById("food").innerHTML = resources.food.total;
    document.getElementById("foodMax").innerHTML = resources.food.maximum;
    document.getElementById("foodNet").innerHTML = resources.food.net.toFixed(1);

    //Wood
    document.getElementById("wood").innerHTML = resources.wood.total;
    document.getElementById("woodMax").innerHTML = resources.wood.maximum;
    document.getElementById("woodNet").innerHTML = resources.wood.net.toFixed(1);
    
    //Metal
    document.getElementById("metal").innerHTML = resources.metal.total;
    document.getElementById("metalMax").innerHTML = resources.metal.maximum;
    document.getElementById("metalNet").innerHTML = resources.metal.net.toFixed(1);

    //Insight
    document.getElementById("insight").innerHTML = resources.insight.total;
    document.getElementById("insightNet").innerHTML = resources.insight.net.toFixed(1);
}

/**
 * Updates the values of all of the buildings in the HTML
 */
function updateBuildingValues() {

    //Huts
    document.getElementById("hutButton").innerHTML = "Build Hut<br>" + buildings.hut.owned;
    if (resources.wood.total < buildings.hut.requires.wood || resources.food.total < buildings.hut.requires.food) {
        document.getElementById("hutButton").classList.add("disabled");
    } else {
        document.getElementById("hutButton").classList.remove("disabled");
    }
}

/**
 * Updates the values for workers in the HTML
 */
function updateWorkerValues() {
    //Population
    document.getElementById("totalPopulation").innerHTML = workers.total;
    document.getElementById("maxPopulation").innerHTML = workers.max;
    document.getElementById("unemployed").innerHTML = workers.unemployed;

    for (worker in workers) {
        if (worker != "total" && worker != "max" && worker != "unemployed") {
            document.getElementById(worker + "Button").innerHTML = worker.charAt(0).toUpperCase() + worker.slice(1) + "<br>" + workers[worker].total;
            
            let isEnabled = true;
            for (resource in workers[worker].requires) {
                if (resources[resource].total < workers[worker].requires[resource] || workers.unemployed == 0) {
                    isEnabled = false;
                }
            }
            if (isEnabled) {
                document.getElementById(worker + "Button").classList.remove("disabled");
            } else {
                document.getElementById(worker + "Button").classList.add("disabled");
            }
        }
    }
}

/**
 * Calculates the net total for all resources
 */
function calculateNetResources() {
    resources.food.net = workers.farmer.total * 0.7;
    resources.wood.net = workers.lumberjack.total * 0.5;
    resources.metal.net = workers.miner.total * 0.2;
    resources.insight.net = workers.philosopher.total * 0.2;
}

/**
 * Switches between the menu tabs
 * 
 * @param tab the tab to switch to
 * @param screen the screen that we are switching
 */
function switchTabs(tab, screen) {
    if (screen == 0) {
        if (tab != visible.purchaseTabAccessing) {
            if (tab == 0) {
                //Hide upgrades tab
                document.getElementById("upgradesButton").classList.remove("currentTab");
                document.getElementById("upgrades").classList.add("hidden");

                //Show buildings tab
                document.getElementById("buildingsButton").classList.add("currentTab");
                document.getElementById("buildings").classList.remove("hidden");
            } else {
                //Hide buildings tab
                document.getElementById("buildingsButton").classList.remove("currentTab");
                document.getElementById("buildings").classList.add("hidden");

                //Show upgrades tab
                document.getElementById("upgradesButton").classList.add("currentTab");
                document.getElementById("upgrades").classList.remove("hidden");
            }
            visible.purchaseTabAccessing = tab;
        }
    } else {
        if (tab != visible.workerTabAccessing) {
            if (tab == 0) {
                //Hide jobs tab
                document.getElementById("jobsButton").classList.remove("currentTab");
                document.getElementById("jobs").classList.add("hidden");

                //Show citizen tab
                document.getElementById("citizensButton").classList.add("currentTab");
                document.getElementById("citizens").classList.remove("hidden");
            } else if (tab == 1) {
                //Hide citizens tab
                document.getElementById("citizensButton").classList.remove("currentTab");
                document.getElementById("citizens").classList.add("hidden");

                //Show jobs tab
                document.getElementById("jobsButton").classList.add("currentTab");
                document.getElementById("jobs").classList.remove("hidden");
            }
            visible.workerTabAccessing = tab;
        }
    }
}

/**
 * Adds a chunk of the story to storyDisplayed and updates the story container
 * 
 * @param storyChunk the story to display
 */
function addStory(storyChunk) {
    if (storyChunk != 0 && storyDisplayed != "") {
        storyDisplayed += "<br><br>"
    }
    storyDisplayed += STORY[storyChunk];
    document.getElementById("story").innerHTML = storyDisplayed;
    updateScroll();
}

/**
 * Scrolls to the bottom of the story
 */
function updateScroll() {
	var storyContainer = document.getElementById('story');
	storyContainer.scrollTop = storyContainer.scrollHeight;
}

/**
 * Switches between the large tabs
 * 
 * @param screen the window to switch to
 */
function switchScreens(screen) {
    updateResourceValues();
    updateBuildingValues();
    updateWorkerValues();
    updateHealthBars();
    if (screen != visible.screenAccessing) {
        if (screen == 0) {
            visible.screenAccessing = screen;

            document.getElementById("conquest").classList.add("hidden");
            document.getElementById("home").classList.remove("hidden");

            document.getElementById("conquestButton").classList.remove("disabled");
            document.getElementById("homeButton").classList.add("disabled");
        } else {
            visible.screenAccessing = screen;

            document.getElementById("home").classList.add("hidden");
            document.getElementById("conquest").classList.remove("hidden");

            document.getElementById("homeButton").classList.remove("disabled");
            document.getElementById("conquestButton").classList.add("disabled");
        }
    }
}

//Starts the game
init();