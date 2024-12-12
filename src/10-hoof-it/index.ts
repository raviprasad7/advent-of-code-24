import * as fs from 'fs';

const input = fs.readFileSync('input.txt', 'utf8');
const inputArray = input.split('\n').map((line) => line.split('').map(Number));
const trailHeads: [number, number][] = [];
const directions: [number, number][] = [
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
  [-1, 0] // up
];
const isOutOfBounds = (x: number, y: number): boolean => x < 0 || y < 0 || x >= inputArray.length || y >= inputArray[0].length;

for (let i = 0; i < inputArray.length; i++) {
  for (let j = 0; j < inputArray[i].length; j++) {
    if (inputArray[i][j] === 0) {
      trailHeads.push([i, j]);
    }
  }
}

function solveForPartOne() {
  const helper = (x: number, y: number, trailEnds: Set<string>) => {
    if (inputArray[x][y] === 9) {
      trailEnds.add(`${x}-${y}`);
      return;
    }
    const currentHeight = inputArray[x][y];
    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (!isOutOfBounds(newX, newY) && inputArray[newX][newY] === currentHeight + 1) {
        helper(newX, newY, trailEnds);
      }
    }
  };

  let totalScore = 0;

  for (const [x, y] of trailHeads) {
    const trailEnds = new Set<string>();
    helper(x, y, trailEnds);
    totalScore += trailEnds.size;
  }
  return totalScore;
}

function solveForPartTwo() {
  const helper = (x: number, y: number, path: number) => {
    if (inputArray[x][y] === 9) {
      return path + 1;
    }

    const currentHeight = inputArray[x][y];

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (!isOutOfBounds(newX, newY) && inputArray[newX][newY] === currentHeight + 1) {
        path = helper(newX, newY, path);
      }
    }

    return path;
  };

  let totalScore = 0;

  for (const [x, y] of trailHeads) {
    totalScore += helper(x, y, 0);
  }
  return totalScore;
}

console.log(solveForPartOne());
console.log(solveForPartTwo());
