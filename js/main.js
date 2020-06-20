/**
 * The Clones 
 * 
 * Jacob Guglielmin
 */

var version = 0.2;

//Declare variables
var trackers, resources, purchases, clones, revealed;

/**
 * Resets all variables. **THIS IS A HARD RESET**
 */
function resetVariables() {
    //Initialize Variables
    trackers = {
        actions: {
            counter: 0,
            //DEVONLY Set to 10
            required: 5,
            actioning: 0,
            canAction: true
        },
        wait: {
            time: 0,
            counter: 0,
            waiting: false
        },
        cloning: {
            required: 15,
            counter: 0,
            canClone: true
        }
    },
    resources = {
        power: {
            total: 0,
            dTotal: 0,
            net: 0,
            max: 100,
            increment: 1
        },
        food: {
            total: 0,
            dTotal: 0,
            net: 0,
            max: 100,
            increment: 1
        },
        metal: {
            total: 0,
            dTotal: 0,
            net: 0,
            max: 100,
            increment: 1
        },
        science: {
            total: 0,
            dTotal: 0,
            net: 0,
            increment: 1
        }
    },
    purchases = {
        //Story-based purchases
        generator: {
            owned: 0,
            benefitType: "story",
            requires: {
                metal: 50
            }
        },
        spear: {
            owned: 0,
            benefitType: "story",
            requires: {
                metal: 20
            }
        },
        escape: {
            owned: 0,
            benefitType: "story",
            requires: {
                science: 150
            }
        },
        explosive: {
            owned: 0,
            benefitType: "story",
            requires: {
                metal: 50,
                science: 100
            }
        },

        //Storages
        crate: {
            owned: 0,
            benefit: 50,
            benefitType: "storage metal",
            requires: {
                metal: 25
            }
        },
        shed: {
            owned: 0,
            benefit: 50,
            benefitType: "storage food",
            requires: {
                food: 25
            }
        }
    },
    clones = {
        total: 0,
        unemployed: 0,
        powerRequirement: 1,
        farmer: {
            total: 0,
            benefit: 1,
            requires: {
                food: 20
            }
        },
        researcher: {
            total: 0,
            benefit: 0.2,
            requires: {
                science: 10
            }
        }
    },
    revealed = {
        //Story-based
        metal: false,
        hideGenerator: false,
        spear: false,
        hideSpear: false,
        science: false,
        cloning: false,
        upgrades: false,
        explosive: false,
        food: false,

        //Other
        metalStorage: false
    };
}
resetVariables();

//These variables dont need to be reset on game reset
var STORY = [
    /* 0 */"You awaken in a dark room. You aren't quite sure exactly who you are, or what you were doing.",
    /* 1 */"You start searching the room you are in for any hint as to what might have happened, but it's a difficult task with no lights.",
    /* 2 */"Everything in the room seems to be damaged in some way or another. Most of what you find looks very complex. You start to wonder what could have caused the damage. An explosion, maybe? Whatever happened, the door is blocked with a lot of debris. You aren't going to be able to get it out of the way.",
    /* 3 */"In the center of the room, you find a large, cylindrical machine. It looks like it mostly survived whatever happened, but you can't really tell what it's for.",
    /* 4 */"It looks like there are some buttons on the side of the machine. You push one of them, and a screen starts up, flashes a little, and fades again. The power to wherever you are must be down.",
    /* 5 */"You found what looks like a big battery. It might have enough power left to turn on the lights for a while, if you could find out where to put it.",
    /* 6 */"There is a slot near the machine that looks like it might hold the battery.",
    /* 7 */"The battery fits perfectly inside the slot. A button on the machine starts to glow. When you push it, the lights in the room come on. Now that you can actually see, maybe you can look for a clue as to where you are.",
    /* 8 */"No luck. Looks like most of the stuff in the room was completely destroyed by whatever happened in here. However, it looks like there is some sort of door on the front of the machine.",
    /* 9 */"You press a couple buttons on the panel. Eventually, the door hisses and pops open a little bit. Inside, there appears to be what looks like space for a person. You're really tired after whatever happened to you, and the inside of the machine looks really comfortable. You step inside, and take a nap.",
    /* 10 */"You wake up. The door has closed since you fell asleep. You push on the door, and it opens with a hiss.",
    /* 11 */"You heard something in a corner of the room. You go over to look, and find a machine that seems to be activated.",
    /* 12 */"There is some sort of chamber behind the machine in the corner, but you can't find any way to get it open. It seems like you're going to be in here for a while, so you'll need some food, and your battery won't supply power for much longer. Maybe the machines that are broken could still be of use?",
    /* 13 */"Taking apart a machine, you have gotten a bunch of metal fragments. You seem to be able to remember some things about mechanics, so you might be able to build a simple generator out of some of your parts.",
    /* 14 */"Well, your generator isn't very efficient, but it'll do for now. Your battery is still charged, so you don't bother with it yet. That machine in the corner seems to have turned off. Maybe you'll be able to see inside the chamber now.",
    /* 15 */"You pull on the door, but it still won't open. You try pushing some buttons on the machine, and one of them opens the door. When you look inside, you see what looks like yourself in the chamber. Frightened, you close the door and block it with some debris. It doesn't seem like a good idea to open that door again unless you have a way to defend yourself.",
    /* 16 */"Satisfied that you'll be protected now, you push away the debris and open the door again. You pull... yourself? An alien? Whatever it is, out of the chamber. It looks like it is sleeping for now, but you aren't sure how long it'll stay that way. In the meantime, you should hook up your generator to the power system.",
    /* 17 */"Whatever came from the chamber just woke up. It stands up, looks around, and sees you. It looks frightened. You tell it your name, and it hesitantly replies that it thought that was its name too. At least that clears up one thing. However it happened, there is now two of you stuck in this room. In other news, the generator system seems like it works.",
    /* 18 */"Talking to the Clone, you find out that it doesn't have all your memories. After explaining your situation to it, it says that it would happily help you. You both agree that the priority should be research into what exactly the machine in the middle of the room does.",
    /* 19 */"After being busy examining wire pathways with you, the Clone tells you that the machine in the middle of the room seems to be connected in a lot of ways to the machine the Clone came out of. They suggest that maybe when you got into the tube, it may have activated the machines that created the Clone. Getting in again would give you a better idea of whether that is the case.",
    /* 20 */"You step into the machine again and close the door. After waiting a few minutes, you hear a whirring sound from the roof. It continues for about 30 seconds, and then it stops again. You step out of the machine, and the Clone examines the machine it came out of. It seems to have been activated again. Looks like there'll be three of you in a while. As long as you still have power, you should be able to make as many Clones as you need.",
    /* 21 */"With this many Clones, you are going to run out of food by the end of the day. You all decide that if you're going to make it out of here, you'll need to spend most of your time looking for a way out.",
    /* 22 */"You've been looking at some of the machines in the room, and one of the Clones thinks that you could make a small explosive that you could detonate next to the door to dislodge it.",
    /* 23 */"With your explosive armed, you all hide behind machines and detonate it. After everything has settled, you go over to the door and open it up. You look at where you are, but all that is outside of the room is forests and mountains. Looking at the outside of the building, you see that there should be more to the building, but the whole planet is absent of buildings and technology, except for your little room. It doesn't look like you're just going to be able to ask someone where you are. Before you do anything else, you're going to need some food."
],
HINTS = [
    /* 0 */"After getting a bunch of scrap metal, you realize that you don't have a lot of space to put it. If you built a storage crate, you could keep some more.",
    /* 1 */"I guess food won't be too much of an issue now, but food storage, maybe. You could build a shed outside to store a lot more."
],
TOOLTIPS = {
    
    //Story-based purchases
    generator: {
        info: "A simple hand crank generator. It doesn't look like much, but it provides some power."
    },
    spear: {
        info: "Well, you can't really call it a spear. More like a pointy club, really, but it'll do."
    },
    escape: {
        info: "Come up with something that could open the door with nothing but what you find in the room."
    },
    explosive: {
        info: "A small explosive device made from chemicals you were able to find in some machines. It shouldn't do much damage to anything it isn't next to."
    },

    //Storages
    crate: {
        info: "Keeps some scrap metal better organized, allowing you to store ",
        info2: " more metal."
    },
    shed: {
        info: "Keeps some extra food out of the rain, allowing you to keep ",
        info2: " more food."
    },

    //Clones
    farmer: {
        info: "Farmers will make sure that all the crops that get planted are tended to, resulting in each farmer producing ",
        info2: " food per second."
    },
    researcher: {
        info: "Researchers will spend their time thinking, and will produce ",
        info2: " science every second. Occasionally, a researcher may think of something new you could build."
    }
},

storyDisplayed = "",

autoSaveCounter = 0,

startTask = null;

/**
 * Initializes the game
 */
function init() {
    addStory(0);
    startTask = setTimeout(() => {
        addStory(1);
        document.getElementById("actionContainer").classList.remove("hidden");
    }, 3000);
    load("localStorage");
    updateResourceValues();
    updatePurchaseValues();
    updateCloneValues();
    setInterval(() => {
        tick();
    }, 100);
}


/**
 * Main game loop - gets run every tenth of a second
 */
function tick() {

    //Increment resources from workers
    for (resource in resources) {
        if (!resources[resource].max || resources[resource].dTotal + resources[resource].net/10 <= resources[resource].max) {
            resources[resource].dTotal += resources[resource].net/10;
        } else if (resources[resource].dTotal < resources[resource].max) {
            resources[resource].dTotal = resources[resource].max;
        }
        resources[resource].total = Math.floor(resources[resource].dTotal);
        if (!revealed.cloningStory && resource == "science" && resources[resource].total >= 100) {
            reveal(5);
        }
    }

    //If we are waiting for something, wait for it
    if (trackers.wait.time != 0 && trackers.wait.waiting) {
        trackers.wait.counter++;
        document.getElementById("actionProgressBar").style.width = (Math.floor(trackers.wait.counter/(trackers.wait.time*10)*100)) + "%";
        if (trackers.wait.counter >= (trackers.wait.time*10)) {
            trackers.wait.time = 0;
            trackers.wait.counter = 0;
            trackers.wait.waiting = false;
            action(true);
        }
    }
    
    updateTooltip();
    updateResourceValues();
    updateCloneValues();
    updatePurchaseValues();

    autoSaveCounter++;
    if (autoSaveCounter >= 600) {
        save("localStorage");
        autoSaveCounter = 0;
    }
}

/**
 * Updates the total resources in the HTML
 */
function updateResourceValues() {
    for (resource in resources) {
        document.getElementById(resource + "Total").innerHTML = resources[resource].total;
        document.getElementById(resource + "Net").innerHTML = resources[resource].net;
        if (resources[resource].max) {
            document.getElementById(resource + "Max").innerHTML = resources[resource].max;
        }
    }
    if (clones.powerRequirement > resources.power.total) {
        document.getElementById("cloneButton").disabled = true;
    } else {
        document.getElementById("cloneButton").disabled = false;
    }
}

/**
 * Calculates the net total for all resources
 */
function calculateNetResources() {
    resources.food.net = Math.round((clones.farmer.total * clones.farmer.benefit) * 10) / 10;
    resources.science.net = Math.round((clones.researcher.total * clones.researcher.benefit) * 10) / 10;
}

/**
 * Updates the values of all of the purchases in the HTML
 */
function updatePurchaseValues() {

    //Iterate through all purchases
    for (item in purchases) {
        //Update button text
        document.getElementById(item + "Button").innerHTML = item.charAt(0).toUpperCase() + item.slice(1) + "<br>" + purchases[item].owned;
        
        //Iterate through required resources and check each one
        let enabled = true;
        for (resource in purchases[item].requires) {
            if (resources[resource].total < purchases[item].requires[resource]) {
                enabled = false;
            }
        }

        //Disable or enable button
        if (enabled) {
            document.getElementById(item + "Button").classList.remove("disabled");
        } else {
            document.getElementById(item + "Button").classList.add("disabled");
        }
    }

}

/**
 * Updates the values for clones in the HTML
 */
function updateCloneValues() {

    document.getElementById("totalClones").innerHTML = clones.total;
    document.getElementById("unemployedClones").innerHTML = clones.unemployed;

    for (clone in clones) {
        if (clone != "total" && clone != "unemployed" && clone != "powerRequirement") {
            document.getElementById(clone + "Button").innerHTML = clone.charAt(0).toUpperCase() + clone.slice(1) + "<br>" + clones[clone].total;
            
            let isEnabled = true;
            for (resource in clones[clone].requires) {
                if (resources[resource].total < clones[clone].requires[resource]) {
                    isEnabled = false;
                }
            }
            if (isEnabled && clones.unemployed == 0) {
                isEnabled = false;
            }
            if (isEnabled) {
                document.getElementById(clone + "Button").classList.remove("disabled");
            } else {
                document.getElementById(clone + "Button").classList.add("disabled");
            }
        }
    }
}

/**
 * Adds to the resource total for whichever resource button is clicked
 * 
 * @param resource the resource to increment
 */
function incrementResource(resource) {
    if (!resources[resource].max || resources[resource].total < resources[resource].max) {
        if (!resources[resource].max || resources[resource].total + resources[resource].increment < resources[resource].max) {
            resources[resource].total += resources[resource].increment;
            resources[resource].dTotal += resources[resource].increment;
        } else {
            resources[resource].total = resources[resource].max;
            resources[resource].dTotal = resources[resource].max;
            if (!revealed.metalStorage && resource == "metal") {
                reveal(1);
            } else if (!revealed.foodStorage && resource == "food") {
                reveal(7);
            }
        }
        if (!revealed.cloning && resource == "science" && resources[resource].total >= 100) {
            reveal(5);
        }
        updateResourceValues();
        updatePurchaseValues();
        updateCloneValues();
    }
}

/**
 * Increments cloning and creates clones using power
 */
function makeClone() {
    if (trackers.cloning.canClone && resources.power.total >= clones.powerRequirement) {
        trackers.cloning.counter++;
        resources.power.total -= clones.powerRequirement;
        resources.power.dTotal -= clones.powerRequirement;
        updateResourceValues();
        document.getElementById("cloningProgressBar").style.width = (Math.floor(trackers.cloning.counter/trackers.cloning.required*100))+"%";
        if (trackers.cloning.counter >= trackers.cloning.required) {
            trackers.cloning.canClone = false;
            setTimeout(() => {
                trackers.cloning.counter = 0;
                document.getElementById("cloningProgressBar").style.width = (Math.floor(trackers.cloning.counter/trackers.cloning.required*100))+"%";
                clones.total++;
                clones.unemployed++;
                updateCloneValues();
                trackers.cloning.canClone = true;
                if (clones.total == 5) {
                    reveal(6);
                }
            }, 200);
        }
    }
}

/**
 * Increments the progress bar and handles events from actioning the room and objects
 * 
 * @param waitComplete whether this action call should complete a wait, if there is one in progress
 */
function action(waitComplete) {
    if (trackers.actions.canAction) {
        if (trackers.wait.time == 0 && !waitComplete) {
            trackers.actions.counter++;
        } else if (waitComplete) {
            trackers.actions.counter = 0;
        }
        document.getElementById("actionProgressBar").style.width = (Math.floor(trackers.actions.counter/trackers.actions.required*100))+"%";
        if ((trackers.actions.counter >= trackers.actions.required && trackers.wait.time == 0) || waitComplete) {
            trackers.actions.canAction = false;
            switch (trackers.actions.actioning) {
                case 0:
                    addStory(2);
                    trackers.actions.actioning = 1;
                    break;

                case 1:
                    addStory(3);
                    changeAction("Search the Machine");
                    trackers.actions.actioning = 2;
                    break;

                case 2:
                    addStory(4);
                    changeAction("Search the Room");
                    trackers.actions.actioning = 3;
                    break;

                case 3:
                    addStory(5);
                    trackers.actions.actioning = 4;
                    break;

                case 4:
                    addStory(6);
                    changeAction("Install the Battery");
                    trackers.actions.actioning = 5;
                    break;

                case 5:
                    addStory(7);
                    changeAction("Search the Room");
                    trackers.actions.actioning = 6;
                    break;
                
                case 6:
                    addStory(8);
                    changeAction("Open the Machine");
                    trackers.actions.actioning = 7;
                    break;

                case 7:
                    addStory(9);
                    changeAction("Sleeping");
                    document.getElementById("actionButton").disabled = true;
                    trackers.actions.actioning = 8;
                    trackers.wait.time = 10;
                    setTimeout(() => {
                        trackers.wait.waiting = true;
                    }, 200);
                    break;

                case 8:
                    if (waitComplete) {
                        addStory(10);
                        changeAction("Search the Room");
                        document.getElementById("actionButton").disabled = false;
                        trackers.actions.actioning = 9;
                    }
                    break;

                case 9:
                    addStory(11);
                    trackers.actions.actioning = 10;
                    break;

                case 10:
                    addStory(12);
                    changeAction("Look for parts");
                    trackers.actions.actioning = 11;
                    break;

                case 11:
                    addStory(13);
                    reveal(0);
                    resources.metal.dTotal = 15;
                    resources.metal.total = 15;
                    updateResourceValues();
                    changeAction("");
                    document.getElementById("actionButton").disabled = true;
                    trackers.actions.actioning = 12;
                    break;

                case 12:
                    addStory(15);
                    reveal(2);
                    changeAction("");
                    document.getElementById("actionButton").disabled = true;
                    trackers.actions.actioning = 13;
                    break;

                case 13:
                    addStory(17);
                    changeAction("Talk to the Clone");
                    trackers.actions.actioning = 14;
                    break;

                case 14:
                    addStory(18);
                    clones.total = 1;
                    clones.unemployed = 1;
                    updateCloneValues();
                    reveal(3);
                    changeAction("");
                    document.getElementById("actionButton").disabled = true;
                    trackers.actions.actioning = 15;
                    break;

                case 15:
                    setTimeout(() => {
                        addStory(20);
                        reveal(4);
                    }, 200);
                    trackers.actions.actioning = -1;

                default:
                    break;
            }

            if (trackers.wait.time == 0) {
                setTimeout(() => {
                    trackers.actions.counter = 0;
                    document.getElementById("actionProgressBar").style.width = (Math.floor(trackers.actions.counter/trackers.actions.required*100))+"%";
                    trackers.actions.canAction = true;
                }, 200);
            } else {
                trackers.actions.canAction = true;
            }
        }
    }
}

/**
 * Changes the text in the action button
 * 
 * @param actionText what to display in the button
 */
function changeAction(actionText) {
    if (actionText != "") {
        document.getElementById("actionButton").innerHTML = actionText;
    } else {
        document.getElementById("actionButton").innerHTML = "‏‏‎⠀";
    }
}

/**
 * Shows a new part of the UI
 * 
 * @param revealing what to reveal
 */
function reveal(revealing) {
    switch (revealing) {
        case 0:
            document.getElementById("metalContainer").classList.remove("hidden");
            document.getElementById("purchaseContainer").classList.remove("hidden");
            revealed.metal = true;
            break;

        case 1:
            addStory(0, true);
            document.getElementById("metalMaxContainer").classList.remove("hidden");
            document.getElementById("crateButton").classList.remove("hidden");
            revealed.metalStorage = true;
            break;

        case 2:
            document.getElementById("spearButton").classList.remove("hidden");
            revealed.spear = true;
            break;

        case 3:
            document.getElementById("clonesContainer").classList.remove("hidden");
            document.getElementById("scienceContainer").classList.remove("hidden");
            revealed.science = true;
            break;

        case 4:
            document.getElementById("cloningContainer").classList.remove("hidden");
            document.getElementById("powerContainer").classList.remove("hidden");
            document.getElementById("actionTable").classList.add("hidden");
            revealed.cloning = true;
            break;

        case 5:
            addStory(19);
            changeAction("Activate the Machine");
            document.getElementById("actionButton").disabled = false;
            revealed.cloningStory = true;
            break;

        case 6:
            addStory(21);
            document.getElementById("upgradesButton").classList.remove("hidden");
            revealed.upgrades = true;
            break;

        case 7:
            addStory(1, true);
            document.getElementById("foodMaxContainer").classList.remove("hidden");
            document.getElementById("shedButton").classList.remove("hidden");
            revealed.foodStorage = true;
            break;
    
        default:
            break;
    }
    updateResourceValues();
    updatePurchaseValues();
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
 * Purchases an upgrade or building and consumes the required resources
 * 
 * @param item the thing to purchase
 * @param amount how many to purchase
 */
function purchase(item, amount) {

    amount = amount || 1;

    let canPurchase = true;

    for (const resource in purchases[item].requires) {
        if (purchases[item].requires[resource]*amount > resources[resource].total) {
            canPurchase = false;
        }
    }

    if (canPurchase) {

        for (const resource in purchases[item].requires) {
            resources[resource].total -= purchases[item].requires[resource];
            resources[resource].dTotal -= purchases[item].requires[resource];
            purchases[item].requires[resource] = Math.floor(purchases[item].requires[resource] * 1.2);
        }

        if (purchases[item].benefitType.includes("storage")) {
            if (purchases[item].benefitType.includes("metal")) {
                resources.metal.max += purchases[item].benefit;
            }
            if (purchases[item].benefitType.includes("food")) {
                resources.food.max += purchases[item].benefit;
            }
        }

        if (purchases[item].benefitType.includes("story")) {
            switch (item) {
                case "generator":
                    addStory(14);
                    changeAction("Open the Chamber");
                    document.getElementById("actionButton").disabled = false;
                    document.getElementById("generatorButton").classList.add("hidden");
                    revealed.hideGenerator = true;
                    break;

                case "spear":
                    addStory(16);
                    changeAction("Install the Generator");
                    document.getElementById("actionButton").disabled = false;
                    document.getElementById("spearButton").classList.add("hidden");
                    revealed.hideSpear = true;
                    break;

                case "escape":
                    addStory(22);
                    document.getElementById("escapeButton").classList.add("hidden");
                    document.getElementById("explosiveButton").classList.remove("hidden");
                    revealed.explosive = true;
                    break;

                case "explosive":
                    addStory(23);
                    document.getElementById("explosiveButton").classList.add("hidden");
                    document.getElementById("foodContainer").classList.remove("hidden");
                    document.getElementById("farmerButton").classList.remove("hidden");
                    revealed.food = true;
                    break;
            
                default:
                    break;
            }            
        }

        purchases[item].owned += amount;
        updatePurchaseValues();
        updateResourceValues();
        updateTooltip();
    }
}

/**
 * Assigns clones a job
 * 
 * @param job the job to put clones into
 * @param amount the amount of clones to hire
 */
function hire(job, amount) {
    if (clones.unemployed >= amount) {
        let canHire = true;
    
        for (const resource in clones[job].requires) {
            if (clones[job].requires[resource]*amount > resources[resource].total) {
                canHire = false;
            }
        }

        if (canHire) {
            for (const resource in clones[job].requires) {
                resources[resource].total -= clones[job].requires[resource];
                resources[resource].dTotal -= clones[job].requires[resource];
            }
            clones.unemployed -= amount;
            clones[job].total += amount;
            calculateNetResources();
            updateResourceValues();
            updateCloneValues();

        }
    }
}

/**
 * Toggles between tabs
 * 
 * @param tab the tab to switch to
 * @param container the container that is being switched
 */
function switchTabs(tab, container) {
    if (container == 0) {

    } else {
        if (tab == 0) {
            document.getElementById("upgrades").classList.add("hidden");
            document.getElementById("upgradesButton").classList.remove("currentTab");
            document.getElementById("buildings").classList.remove("hidden");
            document.getElementById("buildingsButton").classList.add("currentTab");
        } else {
            document.getElementById("buildings").classList.add("hidden");
            document.getElementById("buildingsButton").classList.remove("currentTab");
            document.getElementById("upgrades").classList.remove("hidden");
            document.getElementById("upgradesButton").classList.add("currentTab");
        }
    }
}

/**
 * Adds a chunk of the story to storyDisplayed and updates the story container
 * 
 * @param storyChunk the story to display
 * @param hint whether the chunk should be taken from hints - optional parameter, defaults to false
 */
function addStory(storyChunk, hint) {
    if (hint) {
        if (storyDisplayed != "") {
            storyDisplayed += "<br><br>";
        }
        storyDisplayed += HINTS[storyChunk];
    } else {
        if (storyChunk != 0 && storyDisplayed != "") {
            storyDisplayed += "<br><br>";
        }
        storyDisplayed += STORY[storyChunk];
    }
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

//Starts the game
init();