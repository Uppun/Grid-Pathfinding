import {ReduceStore} from 'flux/utils';
import Dispatcher from '../Dispatcher';
import ActionTypes from '../actions/ActionTypes';
import Grid from '../Grid';
import Cell from '../Cell';
import Astar from '../Astar';
import mapGenerator from '../mapGenerator';

const SIZE = 50; 

function pathfind(player, end, pathGrid) {
    const start = pathGrid.getCell(player.x, player.y);
    const goal = pathGrid.getCell(end.x, end.y);
    const path = Astar(start, goal, Cell.heuristic);
    path.shift();
    
    return path; 
}

function updateCellSets(seenCells, location, pathGrid, revealedGrid) {
    const visibleCells = pathGrid.getVisible(location.x, location.y);
    revealedGrid.copyCells(visibleCells);

    for (const cell of visibleCells) {
        seenCells.add(cell);
    }

    return visibleCells;
}


class A_store extends ReduceStore {
    constructor() {
        super(Dispatcher);
    }

    getInitialState() {
        return {
            pathGrid: new Grid(SIZE, SIZE),
            stage: 'STARTP',
            player: {x: -1, y: -1},
            end: {x: -2, y: -2},
        };
    }

    reduce(state, action) {
        switch (action.type) {
            case ActionTypes.STARTP: {
                return {...state, player: {x: action.x, y: action.y}, stage: 'ENDP'};
            }

            case ActionTypes.ENDP: {
                return {...state, end: {x: action.x, y: action.y}, stage: 'WALL'};
            }

            case ActionTypes.WALL: {
                const {x, y} = action;
                const pathGrid = state.pathGrid.clone();
                const cell = pathGrid.getCell(x, y);
                if (cell.terrain === Cell.Terrain.WALL) {
                    cell.terrain = Cell.Terrain.MOUNTAIN;
                } else {
                    if (cell.terrain === Cell.Terrain.MOUNTAIN) {
                        cell.terrain = Cell.Terrain.NORMAL;
                    } else {
                        cell.terrain = Cell.Terrain.WALL;
                    }
                }

                return {...state, pathGrid};
            }

            case ActionTypes.GENERATE: {
                const {player, end} = state;
                const pathGrid = mapGenerator(player, end, new Grid(SIZE, SIZE));
                return {...state, pathGrid};
            }
            
            case ActionTypes.PATHFIND: {
                const {pathGrid, player, end} = state;
                const path = pathfind(player, end, pathGrid);
                
                return {...state, path, stage: 'STEP'};
            }

            case ActionTypes.RESET: {
                return {
                    pathGrid: new Grid(SIZE, SIZE), 
                    player: {x: -1, y: -1},
                    end: {x: -2, y: -2}, 
                    stage: 'STARTP', 
                    path: null, 
                    visibleCells: null, 
                    seenCells: null,
                };
            }

            case ActionTypes.STEP: {
                const [nextLocation, ...path] = state.path;

                const stage = path.length > 0 ? 'STEP' : 'RESET';
                return {
                    ...state, 
                    stage, 
                    path, 
                    player: {x: nextLocation.x, y: nextLocation.y}
                };
            }

            case ActionTypes.GENERATE_FOG: {
                const {player, end} = state;
                const revealedGrid = mapGenerator(player, end, new Grid(SIZE, SIZE));
                const pathGrid = new Grid(SIZE, SIZE);
                const seenCells = new Set();

                const visibleCells = updateCellSets(seenCells, player, pathGrid, revealedGrid);

                const path = pathfind(player, end, pathGrid);

                return {
                    ...state, 
                    pathGrid, 
                    revealedGrid,
                    path, 
                    stage: 'STEP_FOG', 
                    visibleCells, 
                    seenCells
                };
            }

            case ActionTypes.STEP_FOG: {
                let [nextLocation, ...path] = state.path;
                const {revealedGrid, end, seenCells} = state;
                let {pathGrid} = state;
                let stage;
                let visibleCells;

                if (path.length > 0) {
                    stage = 'STEP_FOG';

                    visibleCells = updateCellSets(seenCells, nextLocation, pathGrid, revealedGrid);
                    path = pathfind(nextLocation, end, pathGrid);
                } else {
                    stage = 'RESET';
                    pathGrid = revealedGrid;
                }

                return {
                    ...state, 
                    stage, 
                    path, 
                    player: {x: nextLocation.x, y: nextLocation.y}, 
                    pathGrid, 
                    visibleCells, 
                    seenCells
                }
            }

            default: {
                return state;
            }
        }
    }
}

export default new A_store();