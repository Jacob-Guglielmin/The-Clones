/**
 * The Clones 
 * 
 * Jacob Guglielmin
 */

//Declare variables
var searchTracker

/**
 * Resets all variables. **THIS IS A HARD RESET**
 */
function resetVariables() {
    //Initialize Variables
    searchTracker = {
        counter:0,
        required:20,
        searching:0
    }
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
    setTimeout(() => {
        addStory(1);
        document.getElementById("searchTable").classList.remove("hidden");
    }, 3000);
}


/**
 * Main game loop - gets run every tenth of a second
 */
function tick() {
    
    updateTooltip();

    autoSaveCounter++;
    if (autoSaveCounter >= 600) {
        save("localStorage");
        autoSaveCounter = 0;
    }
}

function search() {
    if (searchTracker.counter < searchTracker.required) {
        searchTracker.counter++;
        document.getElementById("searchProgressBar").style.width = (Math.floor(searchTracker.counter/searchTracker.required*100))+"%";
    } else {

        switch (searchTracker.searching) {
            case 0:
                addStory(2);
                searchTracker.searching = 1;
                break;

            case 1:
                addStory(3);
                document.getElementById("searchButton").innerHTML = "Search the Machine";
                searchTracker.required = 30;
                searchTracker.searching = 2;

            case 2:
                addStory(4);
                document.getElementById("searchButton").innerHTML = "Search the Room";
                searchTracker.searching = 3;

            default:
                break;
        }

        searchTracker.counter = 0;
        document.getElementById("searchProgressBar").style.width = (Math.floor(searchTracker.counter/searchTracker.required*100))+"%";
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

//Starts the game
init();