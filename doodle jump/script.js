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

//physics
let velocityX = 0;
let velocityY = 0; //doodler jump speed
let initialVelocityY = -8; //starting velocity y
let gravity = 0.4;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;


let doodler = {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth, 
    height : doodlerHeight
} 

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
    placePlatforms(); 
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
}

function update() {
requestAnimationFrame(update);
//clear canvas
context.clearRect(0, 0, board.width, board.height);
//doodler 
doodler.x += velocityX;
if (doodler.x > boardWidth) {
    doodler.x = 0;
}
else if (doodler.x + doodler.width < 0) {
    doodler.x = boardWidth;
}

velocityY += gravity;
doodler.y += velocityY;
// drawing doodler again and again in loop
context.drawImage(doodler.img, doodler.x, doodler.y,doodler.width,doodler.height);

//platforms
for (let i = 0; i <platformArray.length; i++) {
    let platform = platformArray[i];
    if (detectCollision(doodler, platform) && velocityY >= 0) {
        velocityY = initialVelocityY; //jump
    }
    context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
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

function detectCollision(a,b) {
    return a.x < b.x + b.width  && //a's top left corner does not reah b's top right corner
           a.x + a.width > b.x  && //a's top right corner passes b's top left corner
           a.y < b.y + b.height && ////a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;//a's bottom left corner passes b's top left corner        
}