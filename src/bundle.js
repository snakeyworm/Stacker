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

// TODO Add game logic

let StackerGrid = require( "./StackerGrid" )

// Constants

// Game
const SPEED_FACTOR = 600;

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
let lastRow = [];
let currentRow = ROWS - 1;
let windowStart = 0;
let windowLength = 3;
let animationDirection = 1;
let speed = 1; // TODO Implement soon
let gameOver = false;

// Animation state
let animationDelay = null;

// Utility functions

// Return intersection of two ranges
// Note this function will return the first range
// if the second is empty
function intersectRange( r1, r2 ) {

    let min = r1[0] < r2[0]  ? r1 : r2;
    let max = min === r1 ? r2 : r1;

    if ( min[1] < max[0] )
        return null

    return [ max[0], min[1] < max[1] ? min[1] : max[1] ];
    
}

function getIntersectionLength( r1, r2 ) { 
    if ( Math.max( r1[0], r2[0] ) <= Math.min( r2[1], r1[1] ) ) {
        return Math.min( r2[1], r1[1] ) - Math.max( r1[0], r2[0] );
    }
    console.error( "No intersection found" );
    return Number.NaN;
}

// Event handlers

// Move up one row
function spaceKey() {

    if ( currentRow <= 0 ) {
        clearTimeout( animationDelay );
        console.log( "Game Over!" ); // TODO Replace when done testing
        gameOver = true;
        return
    }

    let window = [ windowStart, windowStart + windowLength - 1 ];
    let intersection = intersectRange( window, lastRow );
    
    // To account for one block intersection case 
    // TODO Eventually find a way to handle this better

    // Check if window is in range
    if ( lastRow === [] || intersection ) {
        // Match made

        // Render intersection
        windowStart = intersection[0];
        windowLength = intersection[1] - intersection[0] + 1; // lastRow.length > 0 ? getIntersectionLength( window, lastRow ) + 1 : 3;

        // Remove non-intersecting block
        grid.setRow( currentRow, RED );
        renderRow( currentRow );

        // Move to next row
        currentRow--;
        lastRow = intersection


    } else {
        // Player lost
        console.log( "Game over!" );
        gameOver = true;
    }

    

}

// Event Listener
window.addEventListener( "keydown", ( event ) => {
    if ( event.code === "Space" ) {
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

   animationDelay = setTimeout( clearWindow, SPEED_FACTOR/speed );

}

function clearWindow() {
    grid.setRow( currentRow, RED );
    moveWindow();
}

moveWindow();

// Render functions

function renderRow( row ) {

    // Update current row

    grid.setWindow( row, windowStart, windowLength, BLUE );
    grid.drawRow( row );

}

// Initial draw
grid.drawAll();

function render() {

    // Cancel render if game over
    if ( gameOver )
        return;

    renderRow( currentRow );
    
    window.requestAnimationFrame( render );

}

render();

},{"./StackerGrid":2}]},{},[3]);
