import {ReduceStore} from 'flux/utils';
import Dispatcher from '../Dispatcher';
import ActionTypes from '../actions/ActionTypes';
import Grid from '../Grid';
import Astar from '../Astar';
import mapGenerator from '../mapGenerator';
import heuristic from '../heuristic';

const SIZE = 50; 

class A_Store extends ReduceStore {
    constructor() {
        super(Dispatcher);
    }

    getInitialState() {
        const pathGrid = new Grid(SIZE, SIZE);
        return {pathGrid, 
                stage: 'STARTP', 
                player: {x: -1, y: -1}, end: {x: -2, y: -2}};
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
                const pathGrid = new Grid(SIZE, SIZE);
                const {grid} = state.pathGrid;
                const {x, y} = action;

                for (let i = 0; i < SIZE; i++) {
                    for (let j = 0; j < SIZE; j++) {
                        pathGrid.grid[i][j].passable = grid[i][j].passable;
                    }
                }

                pathGrid.grid[y][x].passable = !grid[y][x].passable;

                return {...state, pathGrid};
            }

            case ActionTypes.GENERATE: {
                const {player, end} = state;
                const pathGrid = mapGenerator(player, end, new Grid(SIZE, SIZE));
                console.log(pathGrid);
                return {...state, pathGrid};
            }
            
            case ActionTypes.PATHFIND: {
                const {pathGrid, player, end} = state;
                const path = Astar(pathGrid.grid[player.y][player.x], pathGrid.grid[end.y][end.x], heuristic);
                path.shift();
                
                return {...state, path, stage: 'STEP'};
            }

            case ActionTypes.RESET: {
                const pathGrid = new Grid(SIZE, SIZE);

                return {pathGrid, player: {x: -1, y: -1}, end: {x: -2, y: -2}, stage: 'STARTP', path: ''};
            }

            case ActionTypes.STEP: {
                const path = [...state.path];
                const nextLocation = path.shift();

                const stage = path.length > 0 ? "STEP" : "RESET";
                return {...state, stage, path, player: {x: nextLocation.x, y: nextLocation.y}};
            }

            default: {
                return state;
            }
        }
    }
}

export default new A_Store();