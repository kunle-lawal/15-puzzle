import React, {useState, useEffect} from 'react';
import classnames from 'classnames'

export default function Puzzle(props) {
    const [tiles, setTiles] = useState([]);
    const [wonGame, setWonGame] = useState(false);
    const [shiftDirection, setShiftDirection] = useState({index: [0,0], direction: ''});
    const [x, setX] = useState([]);
    
    useEffect(() => {
        //On first render this function will convert the puzzle data into a 2 dimensional array. 
        let matrixArray = arrayToMatrix(props.puzzleData, 4);
        setTiles(matrixArray);
    }, []);

    let arrayToMatrix = (array, maxElements) => {
        // This function turns the array into a 2 dimensional array.
        let newArray = [];
        let j = -1;
        for(let i = 0; i < array.length; i++) {
            if(i % maxElements === 0) {
                j++;
                newArray[j] = [];
            }
            newArray[j].push(array[i]);
        }
        return newArray;
    }

    let shiftTile = (outerIndex, innerIndex) => {
        let newTileMatrix = JSON.parse(JSON.stringify(tiles)); //Clone tile array so we don't mutate it
        let tileRow = newTileMatrix[outerIndex];
        let tile = newTileMatrix[outerIndex][innerIndex];
        let direction = '';
        let timeout;

        let moveTile = () => {
            //Animate the tile movement.
            setShiftDirection({index: [outerIndex, innerIndex], direction});
            clearTimeout(timeout);
            timeout = window.setTimeout(() => {
                setShiftDirection({index: [outerIndex, innerIndex], direction: ''});
                setTiles([...newTileMatrix]);
            }, 250);
        }

        //If the index before the current one is greater then 0
        if(innerIndex - 1 >= 0) {
            //if the value after the current tile value is 0
            if(newTileMatrix[outerIndex][innerIndex - 1] === 0) {
                //If empty tile is on out left
                newTileMatrix[outerIndex][innerIndex - 1] = tile;
                newTileMatrix[outerIndex][innerIndex] = 0;
                direction = 'left'
                moveTile()
            }
        }

        // if the index after this one is less then the tiles row length
        if(innerIndex + 1 < tileRow.length) {
            // if the value before the current tile value is 0
            if(newTileMatrix[outerIndex][innerIndex + 1] === 0) {
                //If empty tile is on out right
                newTileMatrix[outerIndex][innerIndex + 1] = tile;
                newTileMatrix[outerIndex][innerIndex] = 0;
                direction = 'right'
                moveTile()
            }
        }

        //if the outer tile row index before the current one is greater then 0
        if(outerIndex - 1 >= 0) {
            //if the value in the previous "tile row" index is equal to 0
            if(newTileMatrix[outerIndex - 1][innerIndex] === 0) {
                //If empty tile is above 
                newTileMatrix[outerIndex - 1][innerIndex] = tile;
                newTileMatrix[outerIndex][innerIndex] = 0;
                direction = 'top'
                moveTile()
            }
        }

        // if the outer tile row index after the current one is not grater then the entire tile index.
        if(outerIndex + 1 < newTileMatrix.length) {
            //if the value in the next "tile row" index is equal to 0
            if(newTileMatrix[outerIndex + 1][innerIndex] === 0) {
                //If empty tile is below
                newTileMatrix[outerIndex + 1][innerIndex] = tile;
                newTileMatrix[outerIndex][innerIndex] = 0;
                direction = 'below'
                moveTile()
            }
        }

        let answer = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
        //loop through answer
        for(let i = 0, j = 0, k = 0; i < answer.length; i++) {
            // if the current answer does not equal the current tile Matrix return game has not ended.
            if(answer[i] !== newTileMatrix[j][k]){return null}
            k++;
            if(k % 4 === 0) {j++; k=0;}
        }
        setWonGame(true);
    }

    return (
        <>
            <div className='board'>
                {tiles.map((tileRow, outerIndex) => {
                    return (
                        tileRow.map((tile, innerIndex) => {
                            return (
                                <div key={innerIndex} 
                                className={
                                    classnames(
                                        "tile", 
                                        {empty:tile === 0}, 
                                        {[shiftDirection.direction]:shiftDirection.index[0] === outerIndex && shiftDirection.index[1] === innerIndex}
                                    )
                                } 
                                onClick={shiftDirection.direction === '' ? () => shiftTile(outerIndex, innerIndex) : null}>{tile}</div>
                            )
                        })
                    )
                })}
            </div>

            {
                wonGame ? 
                <div className="gameWon">
                    <h1>You Won!</h1>
                </div> : null
            }
        </>
    )
}
