import React, {Component} from 'react';
import classNames from 'classnames';

import '../main.css';


export default class Cell extends Component {
    
    handleCellClick = () => {
        const {handleClick, x, y} = this.props;
        handleClick(x, y);
    }

    render() {
        const {passable, type} = this.props; 
        const cellClasses = classNames('cell', passable ? 'passable' : 'impassable', {player: type === 'player', end: type === 'end'});

        return (
            <div className={cellClasses} onClick={this.handleCellClick} />
        )
    }
}