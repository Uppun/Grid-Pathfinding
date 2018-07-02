export default function mapGenerator(start, goal, grid) {
    const holeCoverage = Math.random() * .35 + .15;
    let holeCount = 0;
    while (holeCount < 2) {
        const holeY = Math.floor(Math.random() * grid.height);
        const holeX = Math.floor(Math.random() * grid.width);
        const holeRadius = Math.floor(Math.random() * 5 + 1);

        if (pythagoreanComparison(start.x, holeX, start.y, holeY, holeRadius) || 
            pythagoreanComparison(goal.x, holeX, goal.y, holeY, holeRadius)) {
            continue;
        }

        const holeCells = new Set();
        const borderCells = new Set();

        for (let y = holeY - holeRadius - 1; y <= holeY + holeRadius + 1; y++) {
                for (let x = holeX - holeRadius - 1; x <= holeX + holeRadius + 1; x++) {
                    const cell = grid.getCell(x, y);
                    if (cell) {
                        borderCells.add(cell);
                    }
                }
            }

        for (let y = holeY - holeRadius; y <= holeY + holeRadius; y++) {
            for (let x = holeX - holeRadius; x <= holeX + holeRadius; x++) {
                const cell = grid.getCell(x, y);
                if (cell) {
                    holeCells.add(grid.grid[y][x]);
                    borderCells.delete(grid.grid[y][x]);
                }
            }
        }
        
        let isHoleSafe = true;
        console.log("Hole centered at " + holeX + ", " + holeY);
        console.log(borderCells)

        for (const entry of borderCells) {
            if (!entry.passable && pythagoreanComparison(entry.x, holeX, entry.y, holeY, holeRadius + 1)) {
                console.log("This is: " + grid.grid[entry.y][entry.x] + " and it is " + grid.grid[entry.y][entry.x].passable + " and it is at " + entry.x + " " + entry.y);
                isHoleSafe = false;
                break;
            }
        }

        if (!isHoleSafe) {
            continue;
        }


        for (let entry of holeCells) {
            if(pythagoreanComparison(entry.x, holeX, entry.y, holeY, holeRadius)) {
                grid.getCell(entry.x, entry.y).passable = false;
            }
        }

        holeCount++;
    }

    return grid;
}

function shouldIContinue(grid, holeCoverage) {
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

function pythagoreanComparison(xp, xc, yp, yc, r) {
    return (xp - xc) * (xp - xc) + (yp - yc) * (yp - yc) <= r * r;
}