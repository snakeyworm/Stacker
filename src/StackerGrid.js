const { Rect } = require( "./CanvasUtils" );

const SQUARE_SIZE = 75;
const HEIGHT = 10;
const ROW_LENGTH = 7;

class StackerGrid {

    constructor( x, y, ctx ) {
        this.grid = [];

        for ( let i=0; i < HEIGHT; i++ ) {
            let row = []
            for ( let j=0; j < ROW_LENGTH; j++ ) {
                row.push(
                    new Rect( 
                        x + j * SQUARE_SIZE + 5,
                        y + i * SQUARE_SIZE + 5,
                        SQUARE_SIZE,
                        SQUARE_SIZE,
                        ctx
                    )
                )
            }
            this.grid.push( row );
        }

    }


    drawAll() {

        for ( let i=0; i < HEIGHT; i++ ) {
            let row = this.grid[i];
            for ( let j=0; j < ROW_LENGTH; j++ ) {
                row[j].fill();
            }
        }

    }

}

module.exports = StackerGrid;
