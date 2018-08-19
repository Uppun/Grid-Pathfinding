import React, {Component} from 'react';
import A_store from '../stores/A_store';
import GridActions from '../actions/GridActions';
import {Container} from 'flux/utils';
import '../main.css';

const STAGE_LABELS = {
    WALL: 'Pathfind',
    STEP: 'Next Step',
    RESET: 'Reset',
    RESET_FAIL: 'Reset',
    SELECT_ALGORITHM: 'A* Pathfind',
    STEP_FOG: 'Next Step',
    DSTAR_STEP: 'Next Step',
  };

  const STAGE_INFO = {
      STARTP: 'Click a cell to place starting position.',
      ENDP: 'Click a cell to place end goal.',
      WALL: 'Click a cell to place terrain (once for wall, twice for mountain).',
      RESET: 'Press reset to reset grid.',
      SELECT_ALGORITHM: 'Pathfind Map with A* or D*Lite.',
      STEP_FOG: 'Make next move',
      DSTAR_STEP: 'Make next move',
      STEP: 'Make next move',
      RESET_FAIL: 'Pathfinding failed, reset to try again',
  }

class StageButtons extends Component {
    static getStores() {
        return [A_store];
    }
    
    static calculateState(prevState) {
        return {stage: A_store.getState().stage};
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

            case 'RESET_FAIL': {
                GridActions.resetFail();
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

    render() {
        const {stage} = this.state;
        const canGenerate = stage === 'WALL';
        const stageLabel = STAGE_LABELS[stage];
        const stageMessage = STAGE_INFO[stage];
        return (
            <div className='tool-bar-wrapper'>
                <div className='buttonContentHolder'>
                    <div className='buttonBarPad'>{stageMessage}</div>
                    <div className='buttonBar'>
                        {stageLabel ? <button className="button" onClick={this.handleClick}>{stageLabel}</button> : null}
                        {stage === 'SELECT_ALGORITHM' ? <button className="button" onClick={this.handleDstarClick}>D*lite Pathfind</button> : null}
                        {canGenerate ? <button className="button" onClick={this.handleGenerateClick}>Generate</button> : null}
                        {canGenerate ? <button className="button" onClick={this.handleGenerateFogClick}>Generate Fog Map</button> : null}
                    </div>
                </div>
            </div>
        )
    }
}
export default Container.create(StageButtons);