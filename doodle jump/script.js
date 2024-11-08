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

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
}

function update() {
requestAnimationFrame(update);
//clear canvas
context.clearRect(0, 0, board.width, board.height);
//doodler 
doodler.x += velocityX;
// drawing doodler again and again in loop
context.drawImage(doodler.img, doodler.x, doodler.y,doodler.width,doodler.height);
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