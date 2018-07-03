import React, {Component} from 'react';
import A_store from '../stores/A_store';
import {Container} from 'flux/utils';
import Cell from './CellComponent';
import GridActions from '../actions/GridActions';
import '../main.css';

const STAGE_LABELS = {
    WALL: 'Pathfind',
    STEP: 'Next Step',
    RESET: 'Reset',
  };

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
            case 'WALL': {
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

    handleGenerateClick() {
        GridActions.generate();
    }

    handleCellClick = (x, y) => {
        const {stage} = this.state;
        
        switch (stage) {
            case 'STARTP': {
                GridActions.start(x, y);
                break;
            }

            case 'ENDP': {
                GridActions.end(x, y);
                break;
            }

            case 'WALL': {
                GridActions.pass(x, y);
                break;
            }

            default: {
                break;
            }
        }
    }

    render() {
        const {player, pathGrid, end, stage} = this.state;

        const canGenerate = stage === 'WALL';

        const stageLabel = STAGE_LABELS[stage];

        return(
            <div>
                <div className="grid">
                    {pathGrid.grid.map((row, rowIndex) =>
                        <div className="grid-row" key={rowIndex}>
                            {row.map((cell, columnIndex) => {
                                const type = player.y === rowIndex && player.x === columnIndex ? 'player' :
                                             end.y === rowIndex && end.x === columnIndex ? 'end' : 'normal';
                                return (<Cell passable={cell.passable} key={columnIndex} type={type} handleClick={this.handleCellClick} x={cell.x} y={cell.y} />);
                            })}
                        </div>)}
                </div>
                {stageLabel ? <button onClick={this.handleClick}>{stageLabel}</button> : null}
                {canGenerate ? <button onClick={this.handleGenerateClick}>Generate</button> : ''}
            </div>
        )
    }
}

export default Container.create(PathfinderGrid);