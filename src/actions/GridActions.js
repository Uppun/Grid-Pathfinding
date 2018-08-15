import ActionTypes from './ActionTypes';
import Dispatcher from '../Dispatcher';

export default {
    start(x, y) {
        Dispatcher.dispatch({
            type: ActionTypes.STARTP,
            x,
            y,
        });
    },

    end(x, y) {
        Dispatcher.dispatch({
            type: ActionTypes.ENDP,
            x,
            y,
        });
    },

    pass(x, y) {
        Dispatcher.dispatch({
            type: ActionTypes.WALL,
            x,
            y,
        });
    },

    generate() {
        Dispatcher.dispatch({
            type: ActionTypes.GENERATE,
        });
    },

    pathfind() {
        Dispatcher.dispatch({
            type: ActionTypes.PATHFIND,
        });
    },

    reset() {
        Dispatcher.dispatch({
            type: ActionTypes.RESET,
        });
    },

    step() {
        Dispatcher.dispatch({
            type: ActionTypes.STEP,
        });
    },

    generateFog() {
        Dispatcher.dispatch({
            type: ActionTypes.GENERATE_FOG,
        });
    },

    stepFog() {
        Dispatcher.dispatch({
            type: ActionTypes.STEP_FOG,
        });
    },

    dstarlite() {
        Dispatcher.dispatch({
            type: ActionTypes.DSTARLITE,
        });
    }, 

    dstarStep() {
        Dispatcher.dispatch({
            type: ActionTypes.DSTAR_STEP,
        });
    },
}