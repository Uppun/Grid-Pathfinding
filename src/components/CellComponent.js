import React, {Component} from 'react';
import GridActions from '../actions/GridActions';

import '../main.css';


export default class Cell extends Component {
    
    handleClick = () => {
        const {stage, position} = this.props;
        if (stage === 'STARTP') {
            GridActions.start(position.x, position.y);
        }

        if (stage === 'ENDP') {
            GridActions.end(position.x, position.y);
        }

        if (stage === 'PASS') {
            GridActions.pass(position.x, position.y);
        }
    }

    render() {
        let cellClasses = this.props.status ? 'cell passalbe' : 'cell impassable';
        
        switch(this.props.type) {
            case 'player': {
                cellClasses += ' player';
                break;
            }

            case 'end': {
                cellClasses += ' end';
                break;
            }

            default: {
                break;
            }
        }

        return(
            <div className={cellClasses} onClick={this.handleClick}/>
        )
    }
}