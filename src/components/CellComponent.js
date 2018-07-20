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
        const {type, terrain, fogClassName} = this.props;
        const cellClasses = classNames(
            'cell', 
            terrain !== 'wall' ? 'passable' : 'impassable',
            fogClassName,
            {
                player: type === 'player', 
                end: type === 'end', 
                mountain: terrain === Cell.Terrain.MOUNTAIN && type === 'normal',
            }
        );

        return (
            <div className={cellClasses} onClick={this.handleCellClick} />
        )
    }
}