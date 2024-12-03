import * as fs from 'fs';

const data = fs.readFileSync('./input.txt', 'utf8');
let operandOne: number | null = null;
let operandTwo: number | null = null;

// Part 1
let result = 0;
const regexPattern = /mul\((\d+),(\d+)\)/g;
const matches = Array.from(data.matchAll(regexPattern));

for (const match of matches) {
  operandOne = parseInt(match[1]);
  operandTwo = parseInt(match[2]);
  result += operandOne * operandTwo;
}

console.log(result);

// Part 2
result = 0;
const regexPatternWithCondition = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;
const matchesWithCondition = Array.from(
  data.matchAll(regexPatternWithCondition)
);
let halt = false;

for (const match of matchesWithCondition) {
  if (match[0] === 'do()') {
    halt = false;
  } else if (match[0] === "don't()") {
    halt = true;
  } else if (!halt) {
    operandOne = parseInt(match[1]);
    operandTwo = parseInt(match[2]);
    result += operandOne * operandTwo;
  }
}
console.log(result);
