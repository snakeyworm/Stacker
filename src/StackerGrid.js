
// Class for representing game grid

const { Rect } = require( "./CanvasUtils" );

// Constants

const SQUARE_SIZE = 75;
const HEIGHT = 10;
const ROW_LENGTH = 7;
const SPACING = 10;

// Dimensions

class StackerGrid {

    static WIDTH = ROW_LENGTH * ( SQUARE_SIZE + SPACING );
    static HEIGHT = HEIGHT * ( SQUARE_SIZE + SPACING );

    // Populate grid
    constructor( x, y, ctx ) {
        this.grid = [];

        for ( let i=0; i < HEIGHT; i++ ) {
            let row = []
            for ( let j=0; j < ROW_LENGTH; j++ ) {
                row.push(
                    new Rect( 
                        x + j * SQUARE_SIZE + SPACING,
                        y + i * SQUARE_SIZE + SPACING,
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
            this.drawRow( i );
        }

    }

    // Draw specified row
    drawRow( rowi ) {

        let row = this.grid[rowi];
        for ( let i=0; i < ROW_LENGTH; i++ )
            row[i].fill();
        
    }
    
    // Change a specific slice of a row to a specified color
    setWindow( rowi, windowStart, len, color ) {
        
        let row = this.grid[rowi];

        for ( let i=windowStart; i < windowStart + len; i++ )
            row[i].setFillStyle( color );

    }

}

module.exports = { StackerGrid, ROW_LENGTH, HEIGHT } ;
