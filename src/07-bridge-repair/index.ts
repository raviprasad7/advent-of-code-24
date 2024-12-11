import fs from 'fs';

const input = fs.readFileSync('input.txt', 'utf8');

const inputArray: [number, number[]][] = input
  .split('\n')
  .map((line) => line.split(': '))
  .map((x) => [Number(x[0]), x[1].split(' ').map(Number)]);
const correctEquations = new Array<number>();

function findCorrectEquations(
  inputArray: [number, number[]][],
  operations: string[]
) {
  const recurse = (
    result: number,
    currentResult: number,
    rest: number[]
  ): boolean => {
    if (rest.length === 0) {
      return currentResult === result;
    }
    let isValid = false;
    for (const operation of operations) {
      if (operation === '+' && !isValid) {
        isValid ||= recurse(result, currentResult + rest[0], rest.slice(1));
      } else if (operation === '*' && !isValid) {
        isValid ||= recurse(result, currentResult * rest[0], rest.slice(1));
      } else if (operation === '||' && !isValid) {
        isValid ||= recurse(
          result,
          Number(String(currentResult) + String(rest[0])),
          rest.slice(1)
        );
      }
    }
    return isValid;
  };

  for (const [result, values] of inputArray) {
    let isValid = false;
    for (const operation of operations) {
      if (operation === '+' && !isValid) {
        isValid ||= recurse(result, values[0] + values[1], values.slice(2));
      } else if (operation === '*' && !isValid) {
        isValid ||= recurse(result, values[0] * values[1], values.slice(2));
      } else if (operation === '||' && !isValid) {
        isValid ||= recurse(
          result,
          Number(String(values[0]) + String(values[1])),
          values.slice(2)
        );
      }
    }
    if (isValid) {
      correctEquations.push(result);
    }
  }
}

// Part 1
findCorrectEquations(inputArray, ['+', '*']);
console.log(correctEquations.reduce((a, b) => a + b, 0));

// Part 2
correctEquations.length = 0;
findCorrectEquations(inputArray, ['+', '*', '||']);
console.log(correctEquations.reduce((a, b) => a + b, 0));
