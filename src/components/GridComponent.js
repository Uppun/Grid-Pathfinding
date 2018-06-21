import React, {Component} from 'react';
import A_store from '../stores/A_store';
import {Container} from 'flux/utils';
import Cell from './CellComponent';
import GridActions from '../actions/GridActions';

import '../main.css';

class PathfinderGrid extends Component {
    static getStores() {
        return [A_store];
    }

    static calculateState(prevState) {
        return A_store.getState();
    }

    handleClick = () => {
        const {stage} = this.state;

        switch (stage) {
            case 'PASS': {
                GridActions.pathfind();
                break;
            }

            case 'STEP': {
                GridActions.step();
                break;
            }

            case 'RESET': {
                GridActions.reset();
                break;
            }

            default: {
                break;
            }
        }
    }

    handleGenerateClick = () => {
        GridActions.generate();
    }

    render() {
        const {player, pathGrid, end, stage} = this.state;

        const canGenerate = stage === 'PASS';
        const stageButtonVisibility = stage === 'PASS' || stage === 'STEP' || stage === 'RESET';

        let stageLabel = '';

        switch (stage) {
            case 'PASS': {
                stageLabel = 'Pathfind';
                break;
            }

            case 'STEP': {
                stageLabel = 'Next Step';
                break;
            }

            case 'RESET': {
                stageLabel = 'Reset';
                break;
            }

            default: {
                break;
            }
        }

        return(
            <div>
                <div className='Grid'>
                    {pathGrid.grid.map((row, rowIndex) =>
                        <div className='gridRow' key={rowIndex}>
                            {row.map((cell, columnIndex) => {
                                if (player.y === rowIndex && player.x === columnIndex) {
                                    return (<Cell status={cell.passable} key={columnIndex} type={'player'} stage={stage} position={{x: cell.x, y: cell.y}} />);
                                }

                                if (end.y === rowIndex && end.x === columnIndex) {
                                    return (<Cell status={cell.passable} key={columnIndex} type={'end'} stage={stage} position={{x: cell.x, y: cell.y}} />);
                                }
                            
                                return (<Cell status={cell.passable} key={columnIndex} type={'normal'} stage={stage} position={{x: cell.x, y: cell.y}} />);
                            })}
                        </div>)}
                </div>
                <button onClick={this.handleClick} style={{visibility: stageButtonVisibility ? 'visible' : 'hidden'}}>{stageLabel}</button>
                <button onClick={this.handleGenerateClick} style={{visibility: canGenerate ? 'visible' : 'hidden'}}>Generate</button>
            </div>
        )
    }
}

export default Container.create(PathfinderGrid);