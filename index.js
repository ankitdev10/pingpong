const innerWidth = window.innerWidth;
const innerHeight = window.innerHeight;

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let score1 = 0;
let score2 = 0;
let gameOver = false;

class Paddle {
  constructor({ position }) {
    this.position = position;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 10;
    this.height = 100;
  }

  draw() {
    c.fillStyle = "white";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    if (
      this.position.y + this.velocity.y > 0 &&
      this.position.y + this.height + this.velocity.y < innerHeight
    ) {
      this.position.y += this.velocity.y;
    }
  }
}

class Ball {
  constructor({ position }) {
    this.position = position;
    const directions = {
      x: Math.random() - 0.5 >= 0 ? -2 : 2,
      y: Math.random() - 0.5 >= 0 ? -2 : 2,
    };
    this.velocity = {
      x: directions.x,
      y: directions.y,
    };
    this.width = 10;
    this.height = 10;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    if (gameOver) return; // Stop updating if the game is over

    this.draw();
    const rightSide = this.position.x + this.width + this.velocity.x;
    const leftSide = this.position.x + this.velocity.x;
    const bottomSide = this.position.y + this.height;
    const topSide = this.position.y;

    if (
      leftSide <= paddle1.position.x + paddle1.width &&
      bottomSide >= paddle1.position.y &&
      topSide <= paddle1.position.y + paddle1.height
    ) {
      this.velocity.x = -this.velocity.x;
    }

    if (
      rightSide >= paddle2.position.x &&
      bottomSide >= paddle2.position.y &&
      topSide <= paddle2.position.y + paddle2.height
    ) {
      this.velocity.x = -this.velocity.x;
    }

    if (
      this.position.y + this.height + this.velocity.y >= canvas.height ||
      this.position.y + this.velocity.y <= 0
    ) {
      this.velocity.y = -this.velocity.y;
    }

    if (this.position.x + this.width + this.velocity.x > innerWidth) {
      score1++;
      if (score1 >= 5) {
        gameOver = true;
        showWinner("Player 2");
      } else {
        resetBall();
      }
    } else if (this.position.x + this.velocity.x < 0) {
      score2++;
      if (score2 >= 5) {
        gameOver = true;
        showWinner("Player 1");
      } else {
        resetBall();
      }
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

function resetBall() {
  ball.position = {
    x: innerWidth / 2,
    y: innerHeight / 2,
  };
  ball.velocity = {
    x: Math.random() - 0.5 >= 0 ? -2 : 2,
    y: Math.random() - 0.5 >= 0 ? -2 : 2,
  };
}

function drawScores() {
  c.fillStyle = "white";
  c.font = "30px Arial";
  c.fillText(`Player 1: ${score1}`, 50, 50);
  c.fillText(`Player 2: ${score2}`, innerWidth - 200, 50);
}

function showWinner(winner) {
  c.fillStyle = "white";
  c.font = "50px Arial";
  c.fillText(`${winner} won the game!`, innerWidth / 2 - 200, innerHeight / 2);

  setTimeout(() => {
    resetGame();
  }, 3000);
}

function resetGame() {
  score1 = 0;
  score2 = 0;
  gameOver = false;
  resetBall();
}

const paddle1 = new Paddle({
  position: {
    x: 10,
    y: 100,
  },
});

const paddle2 = new Paddle({
  position: {
    x: innerWidth - 20,
    y: 100,
  },
});

paddle1.draw();
paddle2.draw();

const ball = new Ball({
  position: {
    x: innerWidth / 2,
    y: innerHeight / 2,
  },
});

function animate() {
  requestAnimationFrame(animate);
  if (!gameOver) {
    c.fillStyle = "black";
    c.fillRect(0, 0, innerWidth, innerHeight);
    paddle1.update();
    paddle2.update();
    ball.update();
    drawScores();
  }
}
animate();

addEventListener("keydown", (e) => {
  const speed = 3;
  switch (e.key) {
    case "s":
      paddle1.velocity.y = speed;
      break;
    case "w":
      paddle1.velocity.y = -speed;
      break;
    case "ArrowUp":
      paddle2.velocity.y = -speed;
      break;
    case "ArrowDown":
      paddle2.velocity.y = speed;
      break;
  }
});
