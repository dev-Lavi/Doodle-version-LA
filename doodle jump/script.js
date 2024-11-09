//board
let board;
let boardWidth = 360;  //width of canvas,or "game board"
let boardHeight = 575;
let contex;


//doodler or alien's character
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2; //starting X-coordinate of the doodler, placing it at the center of the canvas horizontally
let doodlerY = boardHeight*7/8 - doodlerHeight;  //initial Y-position of the doodler near the bottom of the canvas
let doodlerRightImg;
let doodlerLeftImg;


//physics
let velocityX = 0;


let doodler = {
    img : null,
    x : doodlerX,  //position of doodler at start from x-axis
    y : doodlerY,
    width : doodlerWidth,  //width of doodler
    height : doodlerHeight
} 

window.onload = function() {//this function will work after loading of entire webpage and canvas(board)
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // used for drawing on the board

       //load doodler image
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
    //clear canvas and prevent overlapping of image
    context.clearRect(0, 0, board.width, board.height);

    doodler.x += velocityX;

    //As doodler pass right side of board
    if(doodler.x > boardWidth)
        doodler.x = 0;  // set position of doodler to zero(telepot to left side of canvas)

    //when doodler passes left side of canvas
    else if(doodler.x + doodler.width < 0)
        doodler.x = boardWidth;   //telepot to end of canvas (right side)

    // drawing doodler again and again in loop
    context.drawImage(doodler.img, doodler.x, doodler.y,doodler.width,doodler.height);
    }
    
    function moveDoodler(e) {
        if (e.code == "ArrowRight" || e.code == "KeyD") { //move right
            velocityX = 2;
            doodler.img = doodlerRightImg;
        }
        else if (e.code == "ArrowLeft" || e.code == "KeyA") { //move left
            velocityX = -2;
            doodler.img = doodlerLeftImg;
        }
    }

