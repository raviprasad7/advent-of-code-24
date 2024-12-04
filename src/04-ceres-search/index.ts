import fs from 'fs';

const input = fs.readFileSync('input.txt', 'utf8');
const inputArray = input.split('\n').map((line) => line.split(''));

enum Direction {
  ALL = 'ALL',
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  UP_RIGHT = 'UP_RIGHT',
  UP_LEFT = 'UP_LEFT',
  DOWN_RIGHT = 'DOWN_RIGHT',
  DOWN_LEFT = 'DOWN_LEFT',
}

function wordSearch(input: string[][]): number {
  let count = 0;
  const recurse = (
    x: number,
    y: number,
    word: string,
    direction: Direction
  ): number => {
    if (x < 0 || y < 0 || x >= input.length || y >= input[0].length) {
      return 0;
    }
    if (word.endsWith('A') && input[x][y] === 'S') {
      return 1;
    }
    if (
      (word === '' && input[x][y] === 'X') ||
      (word.endsWith('X') && input[x][y] === 'M') ||
      (word.endsWith('M') && input[x][y] === 'A')
    ) {
      if (direction === Direction.ALL) {
        return (
          recurse(x - 1, y, word + input[x][y], Direction.UP) +
          recurse(x + 1, y, word + input[x][y], Direction.DOWN) +
          recurse(x, y + 1, word + input[x][y], Direction.RIGHT) +
          recurse(x, y - 1, word + input[x][y], Direction.LEFT) +
          recurse(x - 1, y + 1, word + input[x][y], Direction.UP_RIGHT) +
          recurse(x + 1, y - 1, word + input[x][y], Direction.DOWN_LEFT) +
          recurse(x + 1, y + 1, word + input[x][y], Direction.DOWN_RIGHT) +
          recurse(x - 1, y - 1, word + input[x][y], Direction.UP_LEFT)
        );
      } else if (direction === Direction.UP) {
        return recurse(x - 1, y, word + input[x][y], Direction.UP);
      } else if (direction === Direction.DOWN) {
        return recurse(x + 1, y, word + input[x][y], Direction.DOWN);
      } else if (direction === Direction.RIGHT) {
        return recurse(x, y + 1, word + input[x][y], Direction.RIGHT);
      } else if (direction === Direction.LEFT) {
        return recurse(x, y - 1, word + input[x][y], Direction.LEFT);
      } else if (direction === Direction.UP_RIGHT) {
        return recurse(x - 1, y + 1, word + input[x][y], Direction.UP_RIGHT);
      } else if (direction === Direction.DOWN_LEFT) {
        return recurse(x + 1, y - 1, word + input[x][y], Direction.DOWN_LEFT);
      } else if (direction === Direction.DOWN_RIGHT) {
        return recurse(x + 1, y + 1, word + input[x][y], Direction.DOWN_RIGHT);
      } else if (direction === Direction.UP_LEFT) {
        return recurse(x - 1, y - 1, word + input[x][y], Direction.UP_LEFT);
      }
    }
    return 0;
  };
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      count += recurse(i, j, '', Direction.ALL);
    }
  }
  return count;
}

console.log(wordSearch(inputArray));

// Part 2
function wordSearch2(input: string[][]): number {
  let count = 0;
  const recurse = (
    x: number,
    y: number
  ): boolean => {
    if (x === 0 || y === 0 || x > input.length - 2 || y > input[0].length - 2) {
      return false;
    }
    const firstPart =
      (input[x - 1][y - 1] === 'M' && input[x + 1][y + 1] === 'S') ||
      (input[x - 1][y - 1] === 'S' && input[x + 1][y + 1] === 'M');
    const secondPart =
      (input[x - 1][y + 1] === 'M' && input[x + 1][y - 1] === 'S') ||
      (input[x - 1][y + 1] === 'S' && input[x + 1][y - 1] === 'M');
    return firstPart && secondPart;
  };
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === 'A' && recurse(i, j)) {
        count++;
      }
    }
  }
  return count;
}

console.log(wordSearch2(inputArray));