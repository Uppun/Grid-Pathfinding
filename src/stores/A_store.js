import {ReduceStore} from 'flux/utils';
import Dispatcher from '../Dispatcher';
import ActionTypes from '../actions/ActionTypes';
import Grid from '../Grid';
import Astar from '../Astar';
import mapGenerator from '../mapGenerator';

const SIZE = 50; 

class PathfindStore extends ReduceStore {
    constructor() {
        super(Dispatcher);
    }

    getInitialState() {
        const pathGrid = new Grid();
        return {pathGrid, stage: 'STARTP', player: {x: -1, y: -1}, end: {x: -2, y: -2}};
    }

    reduce(state, action) {
        switch(action.type) {
            case ActionTypes.STARTP: {
                return {...state, player: {x: action.x, y: action.y}, stage: 'ENDP'};
            }

            case ActionTypes.ENDP: {
                return {...state, end: {x: action.x, y: action.y}, stage: 'PASS'};
            }

            case ActionTypes.PASS: {
                let pathGrid = new Grid();
                const {grid} = state.pathGrid;
                for (let y = 0; y < SIZE; y++) {
                    for (let x = 0; x < SIZE; x++) {
                        if (action.x === x && action.y === y) {
                            pathGrid.grid[y][x].passable = !grid[y][x].passable;
                        }
                        else {
                            pathGrid.grid[y][x].passable = grid[y][x].passable;
                        }
                    }
                }

                return {...state, pathGrid};
            }

            case ActionTypes.GENERATE: {
                const {player, end} = state;
                let pathGrid = new Grid();
                
                pathGrid = mapGenerator(player, end, pathGrid);

                return {...state, pathGrid};
            }
            
            case ActionTypes.PATHFIND: {
                const {pathGrid, player, end} = state;
                const path = Astar(pathGrid.grid[player.y][player.x], pathGrid.grid[end.y][end.x]);
                
                return {...state, path, stage: 'STEP'};
            }

            case ActionTypes.RESET: {
                let pathGrid = new Grid();

                return {pathGrid, player: {x: -1, y: -1}, end: {x: -2, y: -2}, stage: 'STARTP', path: ''};
            }

            case ActionTypes.STEP: {
                const path = [...state.path];
                const nextLocation = path.shift();

                let stage;
                if (path.length > 0) {
                    stage = "STEP";
                }
                else {
                    stage = "RESET";
                }
                return {...state, stage, path, player: {x: nextLocation.x, y: nextLocation.y}};
            }

            default: {
                return state;
            }
        }
    }
}

export default new PathfindStore();