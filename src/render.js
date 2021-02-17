
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
