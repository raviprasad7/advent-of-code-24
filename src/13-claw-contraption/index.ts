import * as fs from 'fs';

const input = fs.readFileSync(
  './src/13-claw-contraption/input.txt',
  'utf8'
);
const inputArray = input.split('\n\n');

const MAX_POSSIBLE_TIMES = 100;
const TOKEN_A_COST = 3;
const TOKEN_B_COST = 1;
const MEASUREMENT_PRECISION = 10000000000000;

function solveForPartOne(inputArray: string[]) {
  const clawMachines = inputArray.map((machineConfig) => {
    const regexPattern = new RegExp(
      /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/
    );
    const matches = machineConfig.match(regexPattern);
    if (!matches) {
      throw new Error('Invalid input');
    }

    return {
      buttonA: { x: parseInt(matches[1]), y: parseInt(matches[2]) },
      buttonB: { x: parseInt(matches[3]), y: parseInt(matches[4]) },
      prize: { x: parseInt(matches[5]), y: parseInt(matches[6]) },
    };
  });
  let tokens = 0;

  // (i * X1) + (j * X2) = X
  // (i * Y1) + (j * Y2) = Y
  for (const { buttonA, buttonB, prize } of clawMachines) {
    let minTokensUsed = Infinity;
    for (let i = 1; i < MAX_POSSIBLE_TIMES; i++) {
      for (let j = MAX_POSSIBLE_TIMES; j > 0; j--) {
        if (
          i * buttonA.x + j * buttonB.x === prize.x &&
          i * buttonA.y + j * buttonB.y === prize.y
        ) {
          minTokensUsed = Math.min(
            minTokensUsed,
            i * TOKEN_A_COST + j * TOKEN_B_COST
          );
          break;
        }
      }
    }
    if (minTokensUsed !== Infinity) {
      tokens += minTokensUsed;
    }
  }

  return tokens;
}

function solveForPartTwo(inputArray: string[]) {
  const clawMachines = inputArray.map((machineConfig) => {
    const regexPattern = new RegExp(
      /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/
    );
    const matches = machineConfig.match(regexPattern);
    if (!matches) {
      throw new Error('Invalid input');
    }

    return {
      buttonA: { x: parseInt(matches[1]), y: parseInt(matches[2]) },
      buttonB: { x: parseInt(matches[3]), y: parseInt(matches[4]) },
      prize: {
        x: parseInt(matches[5]) + MEASUREMENT_PRECISION,
        y: parseInt(matches[6]) + MEASUREMENT_PRECISION,
      },
    };
  });
  let tokens = 0;

  // (i * X1) + (j * X2) = X
  // (i * Y1) + (j * Y2) = Y
  for (const { buttonA, buttonB, prize } of clawMachines) {
    const aPressed =
      (prize.x * (buttonB.x - buttonB.y) -
        buttonB.x * (prize.x - prize.y)) /
      (buttonA.x * (buttonB.x - buttonB.y) +
        buttonB.x * (buttonA.y - buttonA.x));
    const bPressed = (prize.x - buttonA.x * aPressed) / buttonB.x;
    if (aPressed === Math.floor(aPressed) && bPressed === Math.floor(bPressed)) {
      const tokensUsed = aPressed * TOKEN_A_COST + bPressed * TOKEN_B_COST;
      tokens += tokensUsed;
    }
  }

  return tokens;
}

console.log(solveForPartOne(inputArray));
console.log(solveForPartTwo(inputArray));

