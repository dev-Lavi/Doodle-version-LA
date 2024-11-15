
let board;
let boardWidth = 360;
let boardHeight = 575;
let context; 


//doodler

let doodlerWidth  = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2; //so here we are postioning the doodler in the centre.
let doodlerY = boardHeight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;


let doodler = {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth, 
    height : doodlerHeight
} 

//score section
let score = 0;
let maxScore = 0;
let gameOver = false;

//physics
let velocityX = 0;
let velocityY = 0; //doodler jump speed
let initialVelocityY = -7; //starting velocity y
let gravity = 0.4;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

//clouds
let cloudsActivated = false; // Initially, clouds are deactivated
let cloudArray = []; // Array to hold cloud objects
const cloudWidth = 375;
const cloudHeight = 185;
let cloudImg = new Image();
cloudImg.src = "cloud.png";

// Bird
let birdActivated = false; // Bird activation state
let birdLastActivatedAt = 2000; // Score threshold for bird activation
let birdWidth = 70;
let birdHeight = 70;
let birdImg = new Image();
birdImg.src = "bird.png"; // Replace with the path to your bird image

let bird = {
    img: birdImg,
    x: boardWidth, // Starts off-screen
    y: -birdHeight, // Starts above the canvas
    width: birdWidth,
    height: birdHeight,
    velocityX: -2 // Horizontal speed of bird
};

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // used for drawing on the board

    // draw doodler green background for position
    //context.fillStyle = "green";
    //context.fillRect(doodler.x, doodler.y, doodler.width,doodler.height);

    //load images
    doodlerRightImg = new Image();
    doodlerRightImg.src = "./doodler-right.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function() {
        context.drawImage(doodler.img, doodler.x, doodler.y,doodler.width,doodler.height);
    }

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "./doodler-left.png";

    platformImg = new Image();
    platformImg.src = "./platform.png";
    
    velocityY = initialVelocityY;

    cloudImg = new Image();
    cloudImg.src = "cloud.png"; // Path to the cloud image

    placePlatforms(); 
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
}
   

function update() {
requestAnimationFrame(update);
//clear canvas
if (gameOver) {
    return;
}


context.clearRect(0, 0, board.width, board.height);


    // Check if clouds should be activated
    if (score >= 3000 && !cloudsActivated) {
        cloudsActivated = true; // Activate clouds
        placeClouds(); // Initialize cloud positions
    }

    // Update and draw clouds if activated
    if (cloudsActivated) {
        updateClouds();
        cloudArray.forEach((cloud) => {
            context.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height);
        });
    }

//doodler 

doodler.x += velocityX;
velocityY += gravity;
doodler.y += velocityY;


if (doodler.x > boardWidth) {
    doodler.x = 0;
}


else if (doodler.x + doodler.width < 0) {
    doodler.x = boardWidth;
}


if (doodler.y > board.height) {
    gameOver = true;
}

    //bird
    // Activate the bird based on score
    if (score >= birdLastActivatedAt && !birdActivated) {
        birdActivated = true; // Activate the bird
        bird.x = boardWidth; // Start bird from the right edge
        bird.y = -birdHeight; // Start above the canvas
        console.log("Bird activated!");
    }
    
    // If the bird is active, update its movement and check for collisions
    if (birdActivated) {
        // Update bird position
        bird.x += bird.velocityX; // Move bird horizontally
    
        // Wrap bird horizontally
        if (bird.x + bird.width < 0) {
            bird.x = boardWidth; // Reset to the right
            bird.y = -birdHeight; // Reset above the canvas
        }
    
        // Move bird downward with the opposite velocity of the doodler
        if (velocityY < 0) {
            bird.y -= velocityY; // Move down when doodler goes up
        }
    
        // Remove bird when it reaches the bottom
        if (bird.y >= boardHeight) {
            birdActivated = false; // Deactivate bird
            birdLastActivatedAt += 2000; // Set the next activation threshold
        }
    
        // Draw bird
        context.drawImage(bird.img, bird.x, bird.y, bird.width, bird.height);
    
        // Check collision between doodler and bird
        if (detectCollision(doodler, bird)) {
            gameOver = true;
        }
    }

// drawing doodler again and again in loop

context.drawImage(doodler.img, doodler.x, doodler.y,doodler.width,doodler.height);

//platforms

for (let i = 0; i <platformArray.length; i++) {
    let platform = platformArray[i];
    
    
    if (velocityY < 0 && doodler.y < boardHeight*3/4) {
        platform.y -= initialVelocityY; //slide platform dowm
    }
   
   
    if (detectCollision(doodler, platform) && velocityY >= 0) { 
        velocityY = initialVelocityY; //jump
    }
    
    
    context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
}

//clear platforms and add new platform
while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
    platformArray.shift(); //removes the first element from the array
    newPlatform(); //replace with new platform on top
}


//score
updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 20);
    if (gameOver) {
        context.fillText("Game over: Press 'space' to Restart", boardWidth/7, boardHeight*7/8);
    }
}


function moveDoodler(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { //move right
        velocityX = 4;
        doodler.img = doodlerRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //move left
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }
    else if (e.code == "Space" && gameOver) {
        //reset
        doodler = {
            img : doodlerRightImg,
            x : doodlerX,
            y : doodlerY,
            width : doodlerWidth, 
            height : doodlerHeight
        }
        
        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        birdActivated = false;
        birdLastActivatedAt = 2000;

        placePlatforms();
        
        //reset clouds
        placeClouds();
        cloudsActivated = false;
    }
}






function placePlatforms() {
    platformArray = [];

    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0 or 1) * boardWidth*3/4
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight
        }
    
        platformArray.push(platform);
    }
}




function newPlatform() {
        let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0 or 1) * boardWidth*3/4
        let platform = {
            img : platformImg,
            x : randomX,
            y : -platformHeight,
            width : platformWidth,
            height : platformHeight
        }
    
        platformArray.push(platform);
}



function detectCollision(a,b) {
    return a.x < b.x + b.width  && //a's top left corner does not reah b's top right corner
           a.x + a.width > b.x  && //a's top right corner passes b's top left corner
           a.y < b.y + b.height && ////a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;//a's bottom left corner passes b's top left corner        
}



function updateScore() { 
    let points = Math.floor(50*Math.random()); //(0-1) *50 --> (0-50) a random number between 0 to 50
    if (velocityY < 0) { //moving up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}

function placeClouds() {
    cloudArray = []; // Clear any existing clouds

    for (let i = 0; i < 5; i++) { // Add 5 clouds
        let randomX = Math.floor(Math.random() * (boardWidth - cloudWidth));
        let randomY = Math.floor(Math.random() * -boardHeight); // Start above the canvas

        let cloud = {
            img: cloudImg,
            x: randomX,
            y: randomY,
            width: cloudWidth,
            height: cloudHeight
        };

        cloudArray.push(cloud);
    }
}

function updateClouds() {
    if (!cloudsActivated) return; // Skip if clouds are not yet activated

    cloudArray.forEach((cloud) => {
        // Move clouds with the opposite velocity of the doodler
        if (velocityY < 0){
        cloud.y += -velocityY;

        // Reset cloud to the top if it moves below the canvas
        if (cloud.y >= boardHeight) {
            cloud.y = -cloudHeight; // Reset cloud above the canvas
            cloud.x = Math.floor(Math.random() * (boardWidth - cloudWidth)); // Randomize horizontal position
        }
    }
    });
}



