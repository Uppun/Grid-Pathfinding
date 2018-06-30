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

        if (stage === 'WALL') {
            GridActions.pass(position.x, position.y);
        }
    }

    render() {
        let cellClasses = this.props.status ? (this.props.type === 'player' ? 'cell passalbe player' : 'cell passable end') : 'cell impassable';

        return(
            <div className={cellClasses} onClick={this.handleClick}/>
        )
    }
}