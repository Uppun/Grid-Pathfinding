import React, {Component} from 'react';
import classNames from 'classnames';
import Cell from '../Cell';
import '../main.css';


export default class CellComponent extends Component {
    
    handleCellClick = () => {
        const {handleClick, x, y} = this.props;
        handleClick(x, y);
    }

    render() {
        const {passable, type, terrain, fogVisibility} = this.props;
        const cellClasses = classNames(
            'cell', passable ? 'passable' : 'impassable', 
            {player: type === 'player', end: type === 'end'}, 
            {mountain: terrain === Cell.Terrain.MOUNTAIN && type === Cell.Terrain.NORMAL && passable},
            {seen: fogVisibility === Cell.fogVisibilityLevels.SEEN, unknown: fogVisibility === Cell.fogVisibilityLevels.UNKNOWN}
        );

        return (
            <div className={cellClasses} onClick={this.handleCellClick} />
        )
    }
}