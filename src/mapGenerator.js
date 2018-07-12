import Cell from './Cell';

export default function mapGenerator(start, goal, grid) {
    const holeCoverage = Math.random() * .35 + .15;
    const mountainCoverage = Math.random() * .1 + .3;
    
    while (shouldContinue(grid, mountainCoverage, calculateMountains)) {
        const mountY = Math.floor(Math.random() * grid.height);
        const mountX = Math.floor(Math.random() * grid.width);
        const mountRadius = Math.floor(Math.random() * 5 + 2);

        const mountainCells = new Set();

        for (let y = mountY - mountRadius - 1; y <= mountY + mountRadius +1; y++) {
            for (let x = mountX - mountRadius - 1; x <= mountX + mountRadius +1; x++) {
                const cell = grid.getCell(x, y);
                if (!cell || !pointInCircle(x, y, mountX, mountY, mountRadius)) {
                    continue;
                }

                mountainCells.add(cell);
            }
        }

        for (const cell of mountainCells) {
            cell.terrain = Cell.Terrain.MOUNTAIN;
        }
    }

    while (shouldContinue(grid, holeCoverage, calculateWalls)) {
        const holeY = Math.floor(Math.random() * grid.height);
        const holeX = Math.floor(Math.random() * grid.width);
        const holeRadius = Math.floor(Math.random() * 5 + 1);

        if (pointInCircle(start.x, start.y, holeX, holeY, holeRadius) || 
            pointInCircle(goal.x, goal.y, holeX, holeY, holeRadius)) {
            continue;
        }

        const touchesRight = holeX + holeRadius >= grid.width - 1;
        const touchesLeft = holeX - holeRadius <= 0;
        const touchesBottom = holeY + holeRadius >= grid.height - 1;
        const touchesTop = holeY - holeRadius <= 0;

        if ((touchesRight && touchesBottom) || (touchesRight && touchesTop) || (touchesLeft && touchesBottom) || (touchesLeft && touchesTop)) {
                continue;
            }

        const holeCells = new Set();
        const borderCells = new Set();

        for (let y = holeY - holeRadius - 1; y <= holeY + holeRadius + 1; y++) {
            for (let x = holeX - holeRadius - 1; x <= holeX + holeRadius + 1; x++) {
                const cell = grid.getCell(x, y);
                if (!cell || !pointInCircle(x, y, holeX, holeY, holeRadius + 1)) {
                    continue;
                }

                if (pointInCircle(x, y, holeX, holeY, holeRadius)) {
                    holeCells.add(cell);
                } else {
                    borderCells.add(cell);
                }
            }
        }

        const isHoleSafe = Array.from(borderCells).every(cell => cell.passable);
        if (!isHoleSafe) {
            continue;
        }

        for (const cell of holeCells) {
            cell.passable = false;
        }
    }

    return grid;
}

function calculateWalls(grid) {
    let totalWalls = 0;

    for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
            if (!grid.grid[y][x].passable) {
                totalWalls++;
            }
        }
    }

    return totalWalls;
}

function calculateMountains(grid) {
    let totalMountains = 0;

    for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
            if (grid.grid[y][x].terrain === Cell.Terrain.MOUNTAIN) {
                totalMountains++;
            }
        }
    }

    return totalMountains;
}

function shouldContinue(grid, coverage, calculationFunc) {
    const coveredCells = calculationFunc(grid);
    const totalCells = grid.height * grid.width;

    return coveredCells / totalCells < coverage;
}

function pointInCircle(xp, yp, xc, yc, r) {
    return (xp - xc) * (xp - xc) + (yp - yc) * (yp - yc) <= r * r;
}