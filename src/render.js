
// Main render script

// TODO Add game logic

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

    // Check if window is in range
    if ( lastRow === [] || intersection ) {
        // Match made

        // Render intersection
        windowStart = intersection[0];
        windowLength = intersection[1] - intersection[0] + 1;

        // Remove non-intersecting block
        grid.setRow( currentRow, RED );
        renderRow( currentRow );

        // Move to next row
        currentRow--;
        lastRow = window;

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

   animationDelay = setTimeout( clearWindow, 1000 );

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
