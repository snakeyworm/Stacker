(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

// Audio utility file

// Get <audio> and <source> DOM
function getAudioDom( id ) {

    return {
        audio: document.getElementById( id ),
        src: document.getElementById( id + "Src" ),
    };

}

let music = getAudioDom( "music" );
let effect = getAudioDom( "effect" );

// Load specified audio file
function loadAudio( audio, src) {

    audio.src.src = src;    
    audio.audio.load();

}

module.exports = {
    loadAudio,
    music,
    effect,
};

},{}],2:[function(require,module,exports){

// Canvas Utilites

// Class for rectangles
class Rect {

    constructor( x, y, width, height, fillStyle, ctx ) {
       this.x = x;
       this.y = y;
       this.width = width;
       this.height = height; 
       this.ctx = ctx
       this.fillStyle = fillStyle
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

module.exports = { Rect };

},{}],3:[function(require,module,exports){

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

},{"./CanvasUtils":2}],4:[function(require,module,exports){

// Main render script

let StackerGrid = require( "./StackerGrid" );
let Audio = require( "./Audio" );

// Constants

// Game

const SPEED_START = 500;
const SPEED_FACTOR = 0.6;
const WINDOW_LIMIT_1 = 4;
const WINDOW_LIMIT_2 = 7;
const SPACE_COOLDOWN = 500;

// Grid

const ROWS = 10;
const COLUMNS = 7;
const GRID_X = window.innerWidth / 2 - StackerGrid.calculateWidth( COLUMNS )/2;
const GRID_Y = 25;

// Colors

const BLACK = "#101010";
const BLUE = "#0000ee";

// SOUND

const MUSIC = "http://localhost:8080/audio/stacker_music.mp3";
const WINDOW_MATCH = "http://localhost:8080/audio/window_match.mp3";
const WIN = "http://localhost:8080/audio/win.mp3";
const GAME_OVER = "http://localhost:8080/audio/game_over.mp3"

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

Audio.loadAudio( Audio.music, MUSIC );

// Game state

let grid = new StackerGrid( GRID_X, GRID_Y, ROWS, COLUMNS, BLACK, ctx );
let lastRow = [];
let currentRow = ROWS - 1;
let windowStart = 0;
let windowLength = 3;
let animationDirection = 1;
let speed = 1;
let gameOverMsg = null;
let gameRunning = true;
let lastEvent = { timeStamp: 0 };

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
    gameRunning = false;
    clearTimeout( animationDelay );

    Audio.music.audio.pause();

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

        // Player has won
        if ( currentRow <= 0 ) {

            // Play win sound
            Audio.loadAudio( Audio.effect, WIN );
            Audio.effect.audio.play();

            gameOverMsg = "Winner!";
            return

        }

        // Play success sound
        Audio.loadAudio( Audio.effect, WINDOW_MATCH );
        Audio.effect.audio.play();


        // Render intersection
        windowStart = intersection[0];
        windowLength = intersection[1] - intersection[0] + 1;

        // Remove non-intersecting block
        grid.setRow( currentRow, BLACK );
        renderRow( currentRow );

        // Remove block if user has past easy rows
        if ( currentRow === WINDOW_LIMIT_2 && windowLength > 2 )
            windowLength = 2;
        else if ( currentRow === WINDOW_LIMIT_1 )
            windowLength = 1;

        windowStart = [ 0, COLUMNS - windowLength ][Math.floor( Math.random() * 2 )];


        // Move to next row
        currentRow--;
        lastRow = intersection;
        speed += SPEED_FACTOR;

    } else {
        // Player lost

        Audio.loadAudio( Audio.effect, GAME_OVER )
        Audio.effect.audio.play();

        gameOverMsg = "Game Over!";
    }

}

// Event Listener
window.addEventListener( "keydown", ( event ) => {
    // Allow event if game is running and COOLDOWN has passed
    if ( 
        event.code === "Space" &&
        event.timeStamp - lastEvent.timeStamp > SPACE_COOLDOWN &&
        gameRunning ) {
        spaceKey();
        lastEvent = event;
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
    grid.setRow( currentRow, BLACK );
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

// Start music


function render() {

    if ( Audio.music.audio.paused && gameRunning )
        Audio.music.audio.play();

    if ( gameRunning )
        renderRow( currentRow );

    if ( gameOverMsg )
        gameOver();
    
    window.requestAnimationFrame( render );

}

render();

},{"./Audio":1,"./StackerGrid":3}]},{},[4]);
