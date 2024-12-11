import * as fs from 'fs';

const input = fs.readFileSync('input.txt', 'utf8');
const inputArray = input.split('\n').map((line) => line.split(''));

enum Direction {
  Right = '>',
  Left = '<',
  Up = '^',
  Down = 'v',
}

type GuardPosition = {
  position: [number, number];
  direction: Direction;
};

let guardPosition: GuardPosition | null = null;

const isBoundary = (x: number, y: number): boolean =>
  x === 0 ||
  x === inputArray.length - 1 ||
  y === 0 ||
  y === inputArray[0].length - 1;
const getNextPosition = (
  [x, y]: [number, number],
  direction: Direction
): [number, number] => {
  if (direction === Direction.Right) {
    return [x, y + 1];
  } else if (direction === Direction.Left) {
    return [x, y - 1];
  } else if (direction === Direction.Up) {
    return [x - 1, y];
  }
  return [x + 1, y];
};
const solutionPath: [number, number][] = [];

function traverse(findLoop = false): boolean {
  let distinctPositions = 0;
  const visitedMap = Array.from({ length: inputArray.length }, () =>
    Array.from({ length: inputArray[0].length }, () => ({
      flag: false,
      directions: [] as Direction[],
    }))
  );

  for (let i = 0; i < inputArray.length; i++) {
    for (let j = 0; j < inputArray[i].length; j++) {
      if (Object.values(Direction).includes(inputArray[i][j] as Direction)) {
        guardPosition = {
          position: [i, j],
          direction: inputArray[i][j] as Direction,
        };
        visitedMap[i][j].flag = true;
        visitedMap[i][j].directions.push(guardPosition!.direction);
        !findLoop && solutionPath.push([i, j]);
        break;
      }
    }
  }

  while (!isBoundary(guardPosition!.position[0], guardPosition!.position[1])) {
    const currentPosition = guardPosition!.position;
    const currectDirection = guardPosition!.direction;
    let nextPosition = getNextPosition(currentPosition, currectDirection);
    const isNextPositionBlocker =
      inputArray[nextPosition[0]][nextPosition[1]] === '#';

    if (currectDirection === Direction.Up && isNextPositionBlocker) {
      guardPosition!.direction = Direction.Right;
    } else if (currectDirection === Direction.Right && isNextPositionBlocker) {
      guardPosition!.direction = Direction.Down;
    } else if (currectDirection === Direction.Down && isNextPositionBlocker) {
      guardPosition!.direction = Direction.Left;
    } else if (currectDirection === Direction.Left && isNextPositionBlocker) {
      guardPosition!.direction = Direction.Up;
    }
    nextPosition = getNextPosition(currentPosition, guardPosition!.direction);
    if (findLoop) {
      if (
        visitedMap[nextPosition[0]][nextPosition[1]].flag &&
        visitedMap[nextPosition[0]][nextPosition[1]].directions.includes(
          guardPosition!.direction
        )
      ) {
        return true;
      }
    }
    guardPosition!.position = nextPosition;
    visitedMap[guardPosition!.position[0]][guardPosition!.position[1]].flag =
      true;
    visitedMap[guardPosition!.position[0]][
      guardPosition!.position[1]
    ].directions.push(guardPosition!.direction);
    !findLoop && solutionPath.push(guardPosition!.position);
  }
  for (let i = 0; i < visitedMap.length; i++) {
    for (let j = 0; j < visitedMap[i].length; j++) {
      visitedMap[i][j].flag && distinctPositions++;
    }
  }

  if (!findLoop) {
    console.log(distinctPositions);
  }
  return false;
}

traverse(false);

// Part 2
let count = 0;
const seen = new Map<number, Set<number>>();
for (let [x, y] of solutionPath) {
  if (inputArray[x][y] === '.' && !seen.get(x)?.has(y)) {
    if (!seen.get(x)) {
      seen.set(x, new Set());
    }
    seen.get(x)!.add(y);
    inputArray[x][y] = '#';
    if (traverse(true)) {
      count++;
    }
    inputArray[x][y] = '.';
  }
}

console.log(count);
