import {ReduceStore} from 'flux/utils';
import Dispatcher from '../Dispatcher';
import ActionTypes from '../actions/ActionTypes';
import Grid from '../Grid';
import Cell from '../Cell';
import Astar from '../Astar';
import mapGenerator from '../mapGenerator';

const SIZE = 50; 

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
                if (cell.terrain === 'wall') {
                    cell.terrain = 'normal';
                } else {
                    cell.terrain = 'wall';
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
                const start = pathGrid.getCell(player.x, player.y);
                const goal = pathGrid.getCell(end.x, end.y);

                const path = Astar(start, goal, Cell.heuristic);
                path.shift();
                
                return {...state, path, stage: 'STEP'};
            }

            case ActionTypes.RESET: {
                return {pathGrid: new Grid(SIZE, SIZE), 
                        player: {x: -1, y: -1},
                        end: {x: -2, y: -2}, 
                        stage: 'STARTP', 
                        path: null, 
                        visibleCells: null, 
                        seenCells: null};
            }

            case ActionTypes.STEP: {
                const [nextLocation, ...path] = state.path;

                const stage = path.length > 0 ? 'STEP' : 'RESET';
                return {...state, 
                        stage, 
                        path, 
                        player: {x: nextLocation.x, y: nextLocation.y}};
            }

            case ActionTypes.GENERATE_FOG: {
                const {player, end} = state;
                const {x, y} = player;
                const revealedGrid = mapGenerator(player, end, new Grid(SIZE, SIZE));
                const pathGrid = new Grid(SIZE, SIZE);

                const visibleCells = pathGrid.getVisible(x, y);
                revealedGrid.copyCells(visibleCells);
                const seenCells = pathGrid.getVisible(x, y);

                const start = pathGrid.getCell(x, y);
                const goal = pathGrid.getCell(end.x, end.y);
                const path = Astar(start, goal, Cell.heuristic);
                path.shift();

                return {...state, 
                        pathGrid, 
                        revealedGrid,
                        path, 
                        stage: 'STEP_FOG', 
                        visibleCells, 
                        seenCells};
            }

            case ActionTypes.STEP_FOG: {
                let [nextLocation, ...path] = state.path;
                const {revealedGrid, end, seenCells} = state;
                let {pathGrid} = state;
                let stage;
                let visibleCells;

                if (path.length > 0) {
                    stage = 'STEP_FOG';
                    visibleCells = pathGrid.getVisible(nextLocation.x, nextLocation.y);
                    revealedGrid.copyCells(visibleCells);

                    for (const cell of visibleCells) {
                        seenCells.add(cell);
                    }

                    const start = pathGrid.getCell(nextLocation.x, nextLocation.y);
                    const goal = pathGrid.getCell(end.x, end.y);
                    path = Astar(start, goal, Cell.heuristic);
                    path.shift();
                } else {
                    stage = 'RESET';
                    pathGrid = revealedGrid;
                }

                return {...state, 
                        stage, 
                        path, 
                        player: {x: nextLocation.x, y: nextLocation.y}, 
                        pathGrid, 
                        visibleCells, 
                        seenCells}
            }

            default: {
                return state;
            }
        }
    }
}

export default new A_store();