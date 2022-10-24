const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
}

const offset = {
  x: -20 * 48 + canvas.width / 2 - 24,
  y: -20 * 48 + canvas.height / 2,
};

const boundaries = [];
collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const bgImage = new Image();
bgImage.src = "./assets/Pellet_Town.png";

const fgImage = new Image();
fgImage.src = "./assets/Pellet_Town_ForeGround.png";

const playerImageDown = new Image();
playerImageDown.src = "./assets/playerDown.png";
const playerImageUp = new Image();
playerImageUp.src = "./assets/playerUp.png";
const playerImageLeft = new Image();
playerImageLeft.src = "./assets/playerLeft.png";
const playerImageRight = new Image();
playerImageRight.src = "./assets/playerRight.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerImageDown,
  frames: {
    max: 4,
  },
  sprites: {
    up: playerImageUp,
    down: playerImageDown,
    left: playerImageLeft,
    right: playerImageRight,
  },
});

const background = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: bgImage,
});

const foreground = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: fgImage,
});

const keys = {
  KeyW: {
    pressed: false,
  },
  KeyS: {
    pressed: false,
  },
  KeyA: {
    pressed: false,
  },
  KeyD: {
    pressed: false,
  },
};

const testBoundary = new Boundary({
  position: {
    x: 400,
    y: 400,
  },
});

const testSpawn = new Boundary({
  position: {
    x: 20 * Boundary.width + offset.x,
    y: 20 * Boundary.height + offset.y,
  },
});

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height - 25 &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

const movables = [background, foreground, ...boundaries];
function gameLoop() {
  requestAnimationFrame(gameLoop);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  // testBoundary.draw();
  // testSpawn.draw();
  player.draw();
  foreground.draw();

  let moving = true;
  player.moving = false;
  if (keys.KeyW.pressed && lastKey === "KeyW") {
    player.moving = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
    }
  } else if (keys.KeyS.pressed && lastKey === "KeyS") {
    player.moving = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
    }
  } else if (keys.KeyA.pressed && lastKey === "KeyA") {
    player.moving = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
    }
  } else if (keys.KeyD.pressed && lastKey === "KeyD") {
    player.moving = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
    }
  }
}
gameLoop();

let lastKey = "";
addEventListener("keydown", (e) => {
  switch (e.code) {
    case "KeyW":
      lastKey = "KeyW";
      keys.KeyW.pressed = true;
      break;
    case "KeyS":
      lastKey = "KeyS";
      keys.KeyS.pressed = true;
      break;
    case "KeyA":
      lastKey = "KeyA";
      keys.KeyA.pressed = true;
      break;
    case "KeyD":
      lastKey = "KeyD";
      keys.KeyD.pressed = true;
      break;
  }
});

addEventListener("keyup", (e) => {
  switch (e.code) {
    case "KeyW":
      keys.KeyW.pressed = false;
      break;
    case "KeyS":
      keys.KeyS.pressed = false;
      break;
    case "KeyA":
      keys.KeyA.pressed = false;
      break;
    case "KeyD":
      keys.KeyD.pressed = false;
      break;
  }
});

addEventListener("resize", () => {
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;

  offset.x = -20 * 48 + canvas.width / 2 + 24;
  offset.y = -20 * 48 + canvas.height / 2;

  // console.log(offset);

  // background.position.x = offset.x;
  // background.position.y = offset.y;
  // player.position.x = canvas.width / 2;
  // player.position.y = canvas.height / 2 - 68 / 2;
  // // movables.forEach((movable) => {
  // //   movable.position.x = player.position.x + offset.x;
  // //   movable.position.y = player.position.y + offset.y;
  // });
});
