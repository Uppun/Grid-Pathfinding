import React, {Component} from 'react';
import A_store from '../stores/A_store';
import GridActions from '../actions/GridActions';
import {Container} from 'flux/utils';
import '../main.css';

const STAGE_LABELS = {
    WALL: 'Pathfind',
    STEP: 'Next Step',
    RESET: 'Reset',
    SELECT_ALGORITHM: 'A* Pathfind',
    STEP_FOG: 'Next Step',
    DSTAR_STEP: 'Next Step',
  };

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
        return (
            <div className='buttonContentHolder'>
                <div className='buttonBarPad' />
                <div className='buttonBar'>
                    {stageLabel ? <button className="button" onClick={this.handleClick}>{stageLabel}</button> : null}
                    {stage === 'SELECT_ALGORITHM' ? <button className="button" onClick={this.handleDstarClick}>D*lite Pathfind</button> : null}
                    {canGenerate ? <button className="button" onClick={this.handleGenerateClick}>Generate</button> : null}
                    {canGenerate ? <button className="button" onClick={this.handleGenerateFogClick}>Generate Fog Map</button> : null}
                </div>
                <div className='buttonBarPad' />
            </div>
        )
    }
}
export default Container.create(StageButtons);