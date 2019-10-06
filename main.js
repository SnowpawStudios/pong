let canvas /** @type {HTMLCanvasElement} */;
let canvasContext;
let divMain;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 5;
let ballSpeedY = 3;

let paddle1Y = 250;
let paddle1X = 20;
let paddle2Y = 250;
let paddle2X;

let p1Score = 0;
let p2Score = 0;
const winScore = 3;

let winScreen = false;

const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 20;


function calcMousePos(evt) {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = evt.clientX - rect.left - root.scrollLeft;
  let mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  }
}

function handleMouseClick(evt) {
  if (winScreen) {
    p1Score = 0;
    p2Score = 0;
    winScreen = false;
  }
}

window.onload = function () {
  canvas = this.document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");
  divMain = this.document.querySelector(".main");

  canvas.width = divMain.clientWidth;
  canvas.style.width = divMain.clientWidth;


  const framesPersecond = 60;
  setInterval(function () {
    drawEverything();
  }, 1000 / framesPersecond);

  canvas.addEventListener("mousedown", handleMouseClick);

  canvas.addEventListener("mousemove", function (evt) {
    let mousePos = calcMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  })
}
window.onresize = function () {

  canvas.width = divMain.clientWidth;
  canvas.style.width = divMain.clientWidth;
  console.log(divMain.clientWidth);

}

function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, "black");

  if (winScreen == false) {
    drawNet();
    ball();
    paddle();
    AIpaddle();
  }
  drawScore();
  if (winScreen) {
    canvasContext.fillStyle = "white";
    canvasContext.fillText(`Click to continue!`, canvas.width / 2 - 90, canvas.height / 2 + 20);
    if (p1Score >= winScore) {
      canvasContext.fillText(`Player 1 wins!`, canvas.width / 2 - 70, canvas.height / 2 - 20);
    } else if (p2Score >= winScore) {
      canvasContext.fillText(`Player 2 wins!`, canvas.width / 2 - 70, canvas.height / 2 - 20);
    }
  }
}

function ball() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  makeCircle(ballX, ballY, 10, "white");

  if (ballX > canvas.width || ballX < 0) {
    ballSpeedX = -ballSpeedX;
    ballReset();
  }
  //collision with paddle1
  if (ballX < 45) {
    if (ballY > paddle1Y - 10 && ballY < paddle1Y + PADDLE_HEIGHT + 10) {
      ballSpeedX = -ballSpeedX;
      let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.2;
      ballSpeedX *= 1.1;

    } else {
      p2Score += 1;
      ballReset();
    }
  }

  //collision with paddle2
  if (ballX > paddle2X) {
    if (ballY > paddle2Y - 10 && ballY < paddle2Y + PADDLE_HEIGHT + 10) {
      ballSpeedX = -ballSpeedX;
      ballSpeedX *= 1.1;
      let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.2;
    } else {
      p1Score += 1;
      ballReset();
    }
  }

  if (ballY >= canvas.height || ballY <= 0) {
    ballSpeedY = -ballSpeedY;
  }


}

function paddle() {
  paddle2X = canvas.width - 40
  colorRect(paddle1X, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");
  colorRect(paddle2X, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");

}

function AIpaddle() {
  let p2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (p2YCenter < ballY - 35) {
    paddle2Y += 6;
  }
  else if (p2YCenter > ballY + 35) {
    paddle2Y -= 6;
  }

}

function drawNet() {
  for (let y = 0; y < canvas.height; y += 60) {
    colorRect((canvas.width / 2) - 2, y + 10, 4, 40, "lightgrey");
  }
}


function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

function makeCircle(x, y, radius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function ballReset() {
  if (p1Score >= winScore || p2Score >= winScore) {
    winScreen = true;
  }
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 5;
  ballSpeedY = 3;

}

function drawScore() {
  canvasContext.font = "24px serif";
  canvasContext.fillText(`P1 score: ${p1Score}`, 20, 40);
  canvasContext.fillText(`P2 score: ${p2Score}`, canvas.width - 150, 40);
}






