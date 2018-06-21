export default function MapGenerator(start, goal, grid) {
    let digAHole = true;

    while (digAHole) {
        const holeY = Math.floor(Math.random() * grid.height);
        const holeX = Math.floor(Math.random() * grid.width);
        const holeRadius = Math.floor(Math.random() * 5 + 1);


        if (Math.pow((start.x - holeX), 2) + Math.pow((start.y - holeY), 2) <= Math.pow(holeRadius, 2) || 
            Math.pow((goal.x - holeX), 2) + Math.pow((goal.y - holeY), 2) <= Math.pow(holeRadius, 2) ||
            holeX + holeRadius + 1 >= grid.width || holeX - holeRadius - 1 <= 0 ||
            holeY + holeRadius + 1 >= grid.height || holeY - holeRadius - 1 <= 0) {
            digAHole = shouldIContinue(grid);
            continue;
        }

        const holeCells = new Set([]);
        const borderCells = new Set([]);

        for (let y = holeY - holeRadius - 1; y <= holeY + holeRadius + 1; y++) {
            for (let x = holeX - holeRadius - 1; x <= holeX + holeRadius + 1; x++) {
                borderCells.add(grid.grid[y][x]);
            }
        }

        for (let y = holeY - holeRadius; y <= holeY + holeRadius; y++) {
            for (let x = holeX - holeRadius; x <= holeX + holeRadius; x++) {
                holeCells.add(grid.grid[y][x]);
                borderCells.delete(grid.grid[y][x]);
            }
        }
        
        const borderIterator = borderCells.entries();
        let isHoleSafe = true;

        for (let entry of borderIterator) {
            if (!entry[0].passable) {
                isHoleSafe = false;
                break;
            }
        }

        if (!isHoleSafe) {
            digAHole = shouldIContinue(grid);
            continue;
        }

        const holeIterator = holeCells.entries();

        for (let entry of holeIterator) {
            if(Math.pow((entry[0].x - holeX), 2) + Math.pow((entry[0].y - holeY), 2) <= Math.pow(holeRadius, 2)) {
                grid.grid[entry[0].y][entry[0].x].passable = false;
            }
        }

        digAHole = shouldIContinue(grid);
    }
    return grid;
}

function shouldIContinue(grid) {
    let totalWalls = 0;
    const totalCells = grid.height * grid.width;
    const RNG_Selector = Math.random();

    for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
            if (!grid.grid[y][x].passable) {
                totalWalls++;
            }
        }
    }

    console.log(totalWalls);
    if (totalWalls === 0 || RNG_Selector > (totalWalls / (totalCells + 0.1))) {
        return true;
    }
    return false;


}