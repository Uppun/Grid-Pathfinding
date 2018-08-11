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
    SELECT_ALGORITHM: 'A* Pathfind',
    STEP_FOG: 'Next Step',
    DSTAR_STEP: 'Next Step',
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

            case 'STEP_FOG': {
                GridActions.stepFog();
                break;
            }

            case 'SELECT_ALGORITHM': {
                GridActions.stepFog();
                break;
            }

            case 'DSTAR_STEP': {
                GridActions.dstarStep();
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

    handleGenerateFogClick() {
        GridActions.generateFog();
    }

    handleDstarClick() {
        GridActions.dstarlite();
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
        const {player, pathGrid, end, stage, visibleCells, seenCells} = this.state;

        const canGenerate = stage === 'WALL';

        const stageLabel = STAGE_LABELS[stage];

        return(
            <div>
                <div className="grid">
                    {pathGrid.grid.map((row, rowIndex) =>
                        <div className="grid-row" key={rowIndex}>
                            {row.map((cell, columnIndex) => {
                                let type = 'normal';
                                if (player.y === rowIndex && player.x === columnIndex) {
                                  type = 'player';
                                } else if (end.y === rowIndex && end.x === columnIndex) {
                                  type = 'end';
                                }
                                let fogClassName;
                                if (visibleCells && !visibleCells.visibleCells.has(cell)) {
                                    if (seenCells && seenCells.has(cell)) {
                                        fogClassName = 'seen';
                                    } else {
                                        fogClassName = 'unknown';
                                    }
                                }
                                return (<Cell key={columnIndex} type={type} handleClick={this.handleCellClick} x={cell.x} y={cell.y} terrain={cell.terrain} fogClassName={fogClassName} />);
                            })}
                        </div>)}
                </div>
                {stageLabel ? <button onClick={this.handleClick}>{stageLabel}</button> : null}
                {stage === 'SELECT_ALGORITHM' ? <button onClick={this.handleDstarClick}>D*lite Pathfind</button> : null}
                {canGenerate ? <button onClick={this.handleGenerateClick}>Generate</button> : null}
                {canGenerate ? <button onClick={this.handleGenerateFogClick}>Generate Fog Map</button> : null}
            </div>
        )
    }
}

export default Container.create(PathfinderGrid);