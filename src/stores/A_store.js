import {ReduceStore} from 'flux/utils';
import Dispatcher from '../Dispatcher';
import ActionTypes from '../actions/ActionTypes';
import Grid from '../Grid';
import Cell from '../Cell';
import Astar from '../Astar';
import mapGenerator from '../mapGenerator';
import Dstarlite from '../Dstarlite';

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
    const changedCells = revealedGrid.copyCells(visibleCells);

    for (const cell of visibleCells) {
        seenCells.add(cell);
    }

    return {visibleCells, changedCells};
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
                } else if (cell.terrain === Cell.Terrain.MOUNTAIN) {
                    cell.terrain = Cell.Terrain.NORMAL;
                } else {
                    cell.terrain = Cell.Terrain.WALL;
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
                    dsl: null,
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

                let visibleCells = updateCellSets(seenCells, player, pathGrid, revealedGrid);

                return {
                    ...state, 
                    pathGrid, 
                    revealedGrid,
                    stage: 'SELECT_ALGORITHM', 
                    visibleCells, 
                    seenCells
                };
            }

            case ActionTypes.STEP_FOG: {
                const {revealedGrid, end, seenCells, player} = state;
                let {pathGrid} = state;
                let path = pathfind(player, end, pathGrid);
                let nextLocation = path.shift();
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

            case ActionTypes.DSTARLITE: {
                const {player, end, pathGrid} = state;
                const dsl = new Dstarlite(pathGrid.getCell(player.x, player.y), pathGrid.getCell(end.x, end.y), Cell.heuristic);
                dsl.beginPathfinding();

                return {...state, dsl, stage: 'DSTAR_STEP'};
            }

            case ActionTypes.DSTAR_STEP: {
                const {dsl, seenCells, revealedGrid, end} = state;
                let {pathGrid} = state;
                const nextLocation = dsl.nextStep();
                let stage;
                let visibleCells;

                if (nextLocation.x !== end.x || nextLocation.y !== end.y) {
                    stage = 'DSTAR_STEP';

                    visibleCells = updateCellSets(seenCells, nextLocation, pathGrid, revealedGrid);
                    if (visibleCells.changedCells.size >= 1) {
                        dsl.updateCost(visibleCells.changedCells);
                    }
                } else {
                    stage = 'RESET';
                    pathGrid = revealedGrid;
                }

                return {
                    ...state,
                    stage,
                    player: {x: nextLocation.x, y: nextLocation.y},
                    pathGrid,
                    visibleCells,
                    seenCells,
                    dsl,
                }
            }

            default: {
                return state;
            }
        }
    }
}

export default new A_store();