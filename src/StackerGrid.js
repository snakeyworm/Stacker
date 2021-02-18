
// Class for representing game grid

const { Rect } = require( "./CanvasUtils" );

// Constants

const SQUARE_SIZE = 75;

// Dimensions

class StackerGrid {

    // Constants

    static get SQUARE_SIZE() {
        return SQUARE_SIZE;
    }

    static get SPACING() {
        return SPACING;
    }

    // Populate grid
    constructor( x, y, rows, columns, color, ctx ) {

        this.rows = rows;
        this.columns = columns;
        this.grid = [];

        for ( let i=0; i < rows; i++ ) {
            let row = []
            for ( let j=0; j < columns; j++ ) {
                row.push(
                    new Rect( 
                        x + j * SQUARE_SIZE,
                        y + i * SQUARE_SIZE,
                        SQUARE_SIZE,
                        SQUARE_SIZE,
                        color,
                        ctx
                    )
                )
            }
            this.grid.push( row );
        }

    }


    drawAll() {

        for ( let i=0; i < this.rows; i++ ) {
            this.drawRow( i );
        }

    }

    // Draw specified row
    drawRow( rowi ) {

        let row = this.grid[rowi];
        for ( let i=0; i < this.columns; i++ )
            row[i].fill();
        
    }
    
    // Change a specific slice of a row to a specified color
    setWindow( rowi, windowStart, len, color ) {
        
        let row = this.grid[rowi];

        for ( let i=windowStart; i < windowStart + len; i++ )
            row[i].setFillStyle( color );

    }

    // Set full row to one color
    setRow( rowi, color ) {
        this.setWindow( rowi, 0, this.columns, color );
    }

    // Utility methods

    static calculateWidth( columns ) {
        return columns * SQUARE_SIZE;
    }

    static calculateHeight( row ) {
        return rows * SQUARE_SIZE;
    }

}

module.exports = StackerGrid;
