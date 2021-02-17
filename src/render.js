
// Main render script

// TODO Implement window setting
// TODO Implement stacker animation
// TODO Add game logic

let CanvasUtils = require( "./CanvasUtils" )
let StackerGridModule = require( "./StackerGrid" )

StackerGrid = StackerGridModule.StackerGrid

// Colors

const RED = "#ff0000";
const BLUE = "#0000ff";

// DOM

let canvas = document.createElement( "canvas" );
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.querySelector( "body" ).appendChild( canvas );

let ctx = canvas.getContext( "2d" );

// Game data

console.log( StackerGridModule );

let grid = new StackerGrid( window.innerWidth / 2 - StackerGridModule.WIDTH/2, 25, ctx );
let currentRow = StackerGridModule.HEIGHT - 1;
let windowLength = 3;
let speed = 1;

// Render function

grid.drawAll();

function render() {

    // grid.setWindow( currentRow, 0, windowLength, BLUE );
    // grid.drawRow( currentRow );

    window.requestAnimationFrame( render );

}

render();
