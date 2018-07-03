export default function mapGenerator(start, goal, grid) {
    const holeCoverage = Math.random() * .35 + .15;
    while (shouldContinue(grid, holeCoverage)) {
        const holeY = Math.floor(Math.random() * grid.height);
        const holeX = Math.floor(Math.random() * grid.width);
        const holeRadius = Math.floor(Math.random() * 5 + 1);

        if (pointInCircle(start.x, start.y, holeX, holeY, holeRadius) || 
            pointInCircle(goal.x, goal.y, holeX, holeY, holeRadius)) {
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

function shouldContinue(grid, holeCoverage) {
    let totalWalls = 0;
    const totalCells = grid.height * grid.width;

    for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
            if (!grid.grid[y][x].passable) {
                totalWalls++;
            }
        }
    }

    return totalWalls / totalCells < holeCoverage;
}

function pointInCircle(xp, yp, xc, yc, r) {
    return (xp - xc) * (xp - xc) + (yp - yc) * (yp - yc) <= r * r;
}