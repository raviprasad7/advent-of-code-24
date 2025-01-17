import * as fs from 'fs';

// Types
type Robot = {
    px: number;
    py: number;
    vx: number;
    vy: number;
}

type RobotPart2 = {
    position: {
        x: number;
        y: number;
    };
    velocity: {
        x: number;
        y: number;
    };
}

// Constants
const input = fs.readFileSync('./src/14-restroom-redoubt/input.txt', 'utf8');
const width = 101;
const height = 103;
const targetSeconds = 100;
const middleRow = Math.floor(height / 2);
const middleCol = Math.floor(width / 2);

// Input parsing for Part 1
const robots = input.split('\n').map((line) => {
    const [p, v] = line.split(' ');
    const [py, px] = p.slice(2).split(',').map(Number);
    const [vy, vx] = v.slice(2).split(',').map(Number);
    return { px, py, vx, vy };
});

// Helper functions
function initializeGrid(height: number, width: number): number[][] {
    return Array.from({ length: height }, () => 
        Array.from({ length: width }, () => 0)
    );
}

function updateRobotPositions(grid: number[][], robots: Robot[], targetSeconds: number): void {
    for (let i = 1; i <= targetSeconds; i++) {
        for (const robot of robots) {
            grid[robot.px][robot.py]--;
            robot.px = (robot.px + robot.vx + height) % height;
            robot.py = (robot.py + robot.vy + width) % width;
            grid[robot.px][robot.py]++;
        }
    }
}

function calculateQuadrantSums(grid: number[][]): number[] {
    const sums = [0, 0, 0, 0];
    
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (i < middleRow && j < middleCol) sums[0] += grid[i][j];
            else if (i < middleRow && j > middleCol) sums[1] += grid[i][j];
            else if (i > middleRow && j < middleCol) sums[2] += grid[i][j];
            else if (i > middleRow && j > middleCol) sums[3] += grid[i][j];
        }
    }
    return sums;
}

// Part 1 solution
function solveForPartOne(): number {
    const grid = initializeGrid(height, width);
    
    // Initialize robot positions
    for (const robot of robots) {
        grid[robot.px][robot.py]++;
    }
    
    updateRobotPositions(grid, robots, targetSeconds);
    const quadrantSums = calculateQuadrantSums(grid);
    
    return quadrantSums.reduce((acc, curr) => acc * curr, 1);
}

// Part 2 solution
function solveForPartTwo(): number {
    const robots = parseRobotsForPartTwo();
    let step = 0;

    while (true) {
        step++;
        moveRobots(robots);
        const positions = getRobotPositions(robots);
        
        if (hasSolidGroup(positions)) {
            return step;
        }
    }
}

function parseRobotsForPartTwo(): RobotPart2[] {
    return input.trim().split('\n').map(line => {
        const [position, velocity] = line.split(' ');
        const [px, py] = position.split('=')[1].split(',').map(num => parseInt(num));
        const [vx, vy] = velocity.split('=')[1].split(',').map(num => parseInt(num));
        return { 
            position: { x: px, y: py }, 
            velocity: { x: vx, y: vy } 
        };
    });
}

function moveRobots(robots: RobotPart2[]): void {
    for (const robot of robots) {
        robot.position.x = (robot.position.x + robot.velocity.x + width) % width;
        robot.position.y = (robot.position.y + robot.velocity.y + height) % height;
    }
}

function getRobotPositions(robots: RobotPart2[]): Set<string> {
    return new Set(robots.map(robot => `${robot.position.x},${robot.position.y}`));
}

function hasSolidGroup(positions: Set<string>): boolean {
    for (const position of positions) {
        const [x, y] = position.split(',').map(num => parseInt(num));
        
        let hasGroup = true;
        for (let j = -2; j <= 2 && hasGroup; j++) {
            for (let k = -2; k <= 2; k++) {
                if (!positions.has(`${x + k},${y + j}`)) {
                    hasGroup = false;
                    break;
                }
            }
        }
        
        if (hasGroup) return true;
    }
    return false;
}

// Execute solutions
console.log(solveForPartOne());
console.log(solveForPartTwo());
