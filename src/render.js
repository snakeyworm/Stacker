
// Main render script

// TODO Add finishing touches(e.g. Sound, Win/Loss message with a linear gradient )

let StackerGrid = require( "./StackerGrid" )

// Constants

// Game

const SPEED_START = 500;
const SPEED_FACTOR = 0.6;
const WINDOW_LIMIT_1 = 4;
const WINDOW_LIMIT_2 = 7;

// Grid

const ROWS = 10;
const COLUMNS = 7;
const GRID_X = window.innerWidth / 2 - StackerGrid.calculateWidth( COLUMNS )/2;
const GRID_Y = 25;

// Colors

const GREY = "#101010";
const BLUE = "#0000ee";

// DOM

let canvas = document.createElement( "canvas" );
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.querySelector( "body" ).appendChild( canvas );

let ctx = canvas.getContext( "2d" );

let textGradient = ctx.createLinearGradient(  window.innerWidth/2 - 100, 0, window.innerWidth/2 + 100, 0 );
textGradient.addColorStop( 0, "green" );
textGradient.addColorStop( 0.4, "magenta" );
textGradient.addColorStop( 0.7, "magenta" );
textGradient.addColorStop( 1, "blue" );

// Game state

let grid = new StackerGrid( GRID_X, GRID_Y, ROWS, COLUMNS, GREY, ctx );
let lastRow = [];
let currentRow = ROWS - 1;
let windowStart = 0;
let windowLength = 3;
let animationDirection = 1;
let speed = 1; // TODO Implement soon
let gameOverMsg = null;

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

// Handle game over event
function gameOver() {

    // Stop rendering
    currentRow = null
    clearTimeout( animationDelay );

    // Display message

    ctx.font = "60px Arial";
    ctx.fillStyle = textGradient;
    ctx.textAlign = "center";
    ctx.fillText( gameOverMsg, window.innerWidth / 2, window.innerHeight / 3 );

    gameOverMsg = null;

}

// Move up one row
function spaceKey() {

    let window = [ windowStart, windowStart + windowLength - 1 ];
    let intersection = intersectRange( window, lastRow );

    // Check if window is in range
    if ( lastRow === [] || intersection ) {
        // Match made

        if ( currentRow <= 0 ) {
            gameOverMsg = "Winner!";
            return
        }

        // Render intersection
        windowStart = intersection[0];
        windowLength = intersection[1] - intersection[0] + 1;

        // Remove non-intersecting block
        grid.setRow( currentRow, GREY );
        renderRow( currentRow );

        if ( currentRow === WINDOW_LIMIT_2 && windowLength > 2 )
            windowLength = 2;

        if ( currentRow === WINDOW_LIMIT_1 )
            windowLength = 1;


        // Move to next row
        currentRow--;
        lastRow = intersection;
        speed += SPEED_FACTOR;

    } else {
        // Player lost
        gameOverMsg = "Game Over!";
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

   animationDelay = setTimeout( clearWindow, SPEED_START/speed );

}

function clearWindow() {
    grid.setRow( currentRow, GREY );
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

    if ( currentRow !== null && !gameOverMsg )
        renderRow( currentRow );

    if ( gameOverMsg )
        gameOver();
    
    window.requestAnimationFrame( render );

}

render();
