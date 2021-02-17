
// Main render script

// TODO Implement stacker animation
// TODO Add game logic

let CanvasUtils = require( "./CanvasUtils" )
let StackerGrid = require( "./StackerGrid" )

console.log( "Hello World!" );

// DOM

let canvas = document.createElement( "canvas" );
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.querySelector( "body" ).appendChild( canvas );

let ctx = canvas.getContext( "2d" );

// Game data

let grid = new StackerGrid( 25, 25, ctx );
let currentRow = 0;
let windowLength = 3;
let speed = 1;

// Render function

function render() {

    grid.drawAll();

    window.requestAnimationFrame( render );

}

render();
