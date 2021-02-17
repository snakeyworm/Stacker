(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

// Canvas Utilites

// Class for rectangles
class Rect {

    constructor( x, y, width, height, ctx ) {
       this.x = x;
       this.y = y;
       this.width = width;
       this.height = height; 
       this.ctx = ctx
       this.fillStyle = "#ff0000"
    }

    setFillStyle( color ) {
        this.fillStyle = color
    }

    fill() {
        this.ctx.fillStyle = this.fillStyle
        this.ctx.fillRect( this.x, this.y, this.width, this.height );
    }

    stroke() {
        this.ctx.strokeRect( this.x, this.y, this.width, this.height );
    }

    clear() {
        this.ctx.clearRect( this.x, this.y, this.width, this.height );
    }

}

module.exports = {
    Rect
}

},{}],2:[function(require,module,exports){

// Class for representing game grid

const { Rect } = require( "./CanvasUtils" );

// Constants

const SQUARE_SIZE = 75;
const SPACING = 10;

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
    constructor( x, y, rows, columns, ctx ) {

        this.rows = rows;
        this.columns = columns;
        this.grid = [];

        for ( let i=0; i < rows; i++ ) {
            let row = []
            for ( let j=0; j < columns; j++ ) {
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
        return columns * ( SQUARE_SIZE + SPACING );
    }

    static calculateHeight( row ) {
        return rows * ( SQUARE_SIZE + SPACING );
    }

}

module.exports = StackerGrid;

},{"./CanvasUtils":1}],3:[function(require,module,exports){

// Main render script

// TODO Implement stacker animation
// TODO Add game logic

let CanvasUtils = require( "./CanvasUtils" )
let StackerGrid = require( "./StackerGrid" )

// Constants

// Grid

const ROWS = 10;
const COLUMNS = 7;
const GRID_X = window.innerWidth / 2 - StackerGrid.calculateWidth( COLUMNS )/2;
const GRID_Y = 25;


// Colors

const RED = "#ff0000";
const BLUE = "#0000ff";

// DOM

let canvas = document.createElement( "canvas" );
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.querySelector( "body" ).appendChild( canvas );

let ctx = canvas.getContext( "2d" );

// Game state

let grid = new StackerGrid( GRID_X, GRID_Y, ROWS, COLUMNS, ctx );
let currentRow = ROWS - 1;
let windowStart =0;
let windowLength = 3;
let animationDirection = 1;
let speed = 1;

// Render function

// Initial draw
grid.drawAll();

// Event handlers

// Move up one row
function spaceKey() {
    if ( currentRow > 0 )
        currentRow--;
}

// Event Listener
window.addEventListener( "keydown", ( event ) => {
    if ( event.key = " " ) {
        spaceKey();
    }
} );

// Animations

// Animate window movement
function moveWindow() {

    // Check for need in a change of direction
    if ( windowStart + windowLength === COLUMNS ) {
        animationDirection = -1;
    } else if ( windowStart === 0 ) {
        animationDirection = 1;
    }

    // Move window
    windowStart += animationDirection;

    setTimeout( clearWindow, 1000 );

}

function clearWindow() {
    grid.setRow( currentRow, RED );
    moveWindow();
}

moveWindow();

function render() {

    grid.setWindow( currentRow, windowStart, windowLength, BLUE );
    
    // Update current row
    grid.drawRow( currentRow );

    window.requestAnimationFrame( render );

}

render();

},{"./CanvasUtils":1,"./StackerGrid":2}]},{},[3]);
