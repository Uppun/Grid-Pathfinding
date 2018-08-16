import React, {Component} from 'react';
import classNames from 'classnames';
import Cell from '../Cell';
import A_store from '../stores/A_store';
import {Container} from 'flux/utils';
import '../main.css';


class CellComponent extends Component {
    static getStores() {
        return [A_store];
    }

    static calculateState(prevState) {
        return A_store.getState();
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {x, y} = this.props;
        const {pathGrid} = this.state;
        const {player, end, visibleCells} = nextState;
        const newGrid = nextState.pathGrid;
        const oldCell = pathGrid.getCell(x, y);
        const newCell = newGrid.getCell(x, y);

        if (oldCell.terrain !== newCell.terrain ||
            (player.x === x && player.y === y) ||
            (end.x === x && end.y === y) || visibleCells.has(newCell)) {
            return true;
        }
        return false;
    }
    
    handleCellClick = () => {
        const {handleClick, x, y} = this.props;
        handleClick(x, y);
    }

    render() {
        const {pathGrid, visibleCells, seenCells, player, end} = this.state;
        const {x, y} = this.props;
        const currentCell = pathGrid.getCell(x, y);
        const terrain = currentCell.terrain;
        
        let fogClassName;
        if (visibleCells && !visibleCells.has(currentCell)) {
            if (seenCells && seenCells.has(currentCell)) {
                fogClassName = 'seen';
            } else {
                fogClassName = 'unknown';
            }
        }

        let type = 'normal';
        if (currentCell.x === player.x && currentCell.y === player.y) {
            type = 'player';
        }
        if (currentCell.x === end.x && currentCell.y === end.y) {
            type = 'end';
        }

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

export default Container.create(CellComponent);