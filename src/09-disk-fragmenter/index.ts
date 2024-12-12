import * as fs from 'fs';

const input = fs.readFileSync('input.txt', 'utf8');

let diskMap: string[] = [];
let fileId = 0;
let maxFreeBlockSize = 0;
const fileBlocksMap: { start: number, size: number }[] = [];
const freeBlocksMap: { start: number, size: number }[] = [];

for (let i = 0; i < input.length; i++) {
  const currentBlockSize = parseInt(input[i], 10);
  if (i % 2 === 0) {
    diskMap = diskMap.concat(Array(currentBlockSize).fill(String(fileId)));
    fileBlocksMap.push({ start: diskMap.length - currentBlockSize, size: currentBlockSize });
    fileId++;
  } else {
    diskMap = diskMap.concat(Array(currentBlockSize).fill('.'));
    if (currentBlockSize) {
      freeBlocksMap.push({ start: diskMap.length - currentBlockSize, size: currentBlockSize });
    }
    if (currentBlockSize > maxFreeBlockSize) {
      maxFreeBlockSize = currentBlockSize;
    }
  }
}

function solveForPartOne() {
  let diskMapCopy = diskMap.slice();
  let left = 0, right = diskMapCopy.length - 1;
  
  while (left <= right) {
    if (diskMapCopy[left] !== '.') {
      left++;
    } else if (diskMapCopy[right] === '.') {
      right--;
    } else {
      diskMapCopy[left] = diskMapCopy[right];
      diskMapCopy[right] = '.';
      left++;
      right--;
    }
  }
  
  let fileChecksum = 0;
  
  for (let i = 0; i < diskMapCopy.length; i++) {
    if (diskMapCopy[i] !== '.') {
      fileChecksum += +diskMapCopy[i] * i;
    }
  }
  
  return fileChecksum;
}

function solveForPartTwo() {
  let diskMapCopy = diskMap.slice();

  for (let i = fileBlocksMap.length - 1; i >= 0; i--) {
    const currentFileBlock = fileBlocksMap[i];
    if (currentFileBlock.size > maxFreeBlockSize) {
      continue;
    }
    let insertIndex = -1;
    for (let j = 0; j < freeBlocksMap.length; j++) {
      const currentFreeBlock = freeBlocksMap[j];
      if (currentFreeBlock.size >= currentFileBlock.size) {
        insertIndex = currentFreeBlock.start;
        currentFreeBlock.size -= currentFileBlock.size;
        currentFreeBlock.start += currentFileBlock.size;
        break;
      }
    }
    if (insertIndex > 0 && insertIndex < currentFileBlock.start) {
      for (let j = 0; j < currentFileBlock.size; j++) {
        diskMapCopy[insertIndex + j] = String(i);
        diskMapCopy[currentFileBlock.start + j] = '.';
      }
    }
  }
  
  let fileChecksum = 0;
  
  for (let i = 0; i < diskMapCopy.length; i++) {
    if (diskMapCopy[i] !== '.') {
      fileChecksum += parseInt(diskMapCopy[i], 10) * i;
    }
  }
  
  return fileChecksum;
}

console.log(solveForPartOne());
console.log(solveForPartTwo());
