$(document).ready(function() {

    // Initialize Variables
    let counter = 0;
    let score = 0;
    let startTime;
    let intervalId;

    // Initialize Array with ship lengths
    let ships = [5, 4, 3, 3, 2];

    // Initialize map
    let map = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];


    // Start a timer-interval
    function startTimer() {
        startTime = new Date();
        intervalId = setInterval(updateTimer, 1000);
    };


    // End the timer-interval
    function endTimer() {
        clearInterval(intervalId);
    };


    // Calculate elapsed time and update timer
    function updateTimer() {
        let currentTime = new Date();
        let elapsedTime = Math.floor((currentTime - startTime) / 1000);
        $("#timeElapsed").text(elapsedTime + "s")
        return elapsedTime;
    };


    // Generate a 10x10 Grid of divs
    function generateGrid() {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                var id = getDivId(i, j);
                $(".container").append("<div id = '" + id + "' class = 'fill'></div>");
            }
        }
    };


    // Create unique Id's for each generated div
    function getDivId(x, y) {
        return "fill" + (x + y * 10 + 1);
    };
    
    
    // Generate a random coordinate for ship placement
    function generateCoordinate() {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        return {x: x, y: y};
    };

    
    // Update the map after a click-event occurs
    function updateMap(x, y) {
        if (map[x][y] === 0) { // When only water is hit
            map[x][y] = 1;
            score++;
            $("#" + getDivId(x, y)).css("transition", "0.5s");
            $("#" + getDivId(x, y)).css("background-color", "#219ebc");
        } else if (map[x][y] >= 2 && map [x][y] < 6) { // When a ship is hit
            map[x][y] = 6;
            counter++;
            score++;
            $("#" + getDivId(x, y)).css("transition", "0.5s");
            $("#" + getDivId(x, y)).css("background-color", "#fb8500");
        }
    };


    // Check if ship can be placed in specific directions
    function checkPlacement(x, y, shipLength, map) {
        let possibleDirections = [];

        // Check left
        if (x - shipLength + 1 > 0) {
            let fits = true;

            for (let i = 0; i < shipLength; i++) {
                if (map[x - i][y] >= 2) {
                    fits = false;
                    break;
                }
            }
            if (fits) {
                possibleDirections.push("left");
            }
        }

        // Check right
        if (x + shipLength < 10) {
            let fits = true;

            for (let i = 0; i < shipLength; i++) {
                if (map[x + i][y] >= 2) {
                    fits = false;
                    break;
                }
            }
            if (fits) {
                possibleDirections.push("right");
            }
        }

        // Check up
        if (y - shipLength + 1 > 0) {
            let fits = true;

            for (let i = 0; i < shipLength; i++) {
                if (map[x][y - i] >= 2) {
                    fits = false;
                    break;
                }
            }
            if (fits) {
                possibleDirections.push("up");
            }
        }

        // Check down
        if (y + shipLength < 10) {
            let fits = true;

            for (let i = 0; i < shipLength; i++) {
                if (map[x][y + i] >= 2) {
                    fits = false;
                    break;
                }
            }
            if (fits) {
                possibleDirections.push("down");
            }
        }

        return possibleDirections;
    };


    // Randomly place ships on the map
    function placeShips() {
        
        // Index for iterating through ships
        let index = 0;

        // While there are ships not yet placed
        while (index < ships.length) {
            let coordinate = generateCoordinate();
            let x = coordinate.x;
            let y = coordinate.y;

            let possibleDirections = checkPlacement(x, y, ships[index], map)

            if (possibleDirections.length > 0) { // If ship can be placed

                // Choose random direction
                let chosenDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];

                // Place ship in chosen direction
                switch (chosenDirection) {

                    case "left":
                        for (let i = 0; i < ships[index]; i++) {
                            map[x - i][y] = ships[index];
                        }
                        break;

                    case "right":
                        for (let i = 0; i < ships[index]; i++) {
                            map[x + i][y] = ships[index];
                        } 
                        break;

                    case "up":
                        for(let i = 0; i < ships[index]; i++) {
                            map[x][y - i] = ships[index];
                        }
                        break;
                    
                    case "down":
                        for(let i = 0; i < ships[index]; i++) {
                            map[x][y + i] = ships[index];
                        }
                        break;
                }
                
                // Increment Index to get to the next ship
                index++;
            }
        }
    };


    // Reset the gameboard when Play Again is pressed
    function resetGame() {
        
        // Clear the map
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                map[i][j] = 0;
            }
        }
    
        // Clear the container
        $(".container").empty();
    
        // Reset counter and score
        counter = 0;
        score = 0;
    
        // Reset timer
        endTimer();
        startTime = null;
        $("#timeElapsed").text("0s");
    
        // Clear displayed game statistics
        $("#shots").text("0");
        $("#hits").text("0");
        $("#accuracy").text("0%");
    
        // Hide popup window
        $("#popupContainer").hide();

        // Generate new grid and place ships
        generateGrid();
        placeShips();
    };
    
    
    // Generate grid and place ships
    generateGrid();
    placeShips();
    

    // Add functionality for buttons in the popup
    $("#playButton").click(function() {
        resetGame();
    });
    $("#closeButton").click(function() {
        $("#popupContainer").hide();
    });


    /* 
    Add EventListener to the map
    On click update map, score, hits, etc.
    */
    $(document).on("click", ".fill", function(){

        if (counter < 17) { // Not all ships are hit yet
            
            // Start timer after first click
            if (!startTime) {
                startTimer();
            }

            // Call updateMap() with coordinates of the click
            let id = $(this).attr("id");
            let x = (id.substring(4) - 1) % 10;
            let y = Math.floor((id.substring(4) - 1) / 10);
            updateMap(x, y);

            // Update game statistics
            $("#shots").text(score);
            $("#hits").text(counter);
            $("#accuracy").text(((counter / score) * 100).toFixed(1) + "%");
        }

        if (counter >= 17) { // When the last possible hit is achieved

            // Stop the timer
            endTimer();

            // Calculate elapsed time and update timer
            let elapsedTime = updateTimer();
            $("#timeElapsed").text(elapsedTime + "s");

            // Show popup and game statistics in popup
            $("#popupContainer").show();
            $("#statAccuracy").text(((counter / score) * 100).toFixed(1) + "%");
            $("#statTimeElapsed").text(elapsedTime + "s");
            $("#statShots").text(score);
        }
    });
})