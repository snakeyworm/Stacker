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
const { Rect } = require( "./CanvasUtils" );

const SQUARE_SIZE = 75;
const HEIGHT = 10;
const ROW_LENGTH = 7;

class StackerGrid {

    constructor( x, y, ctx ) {
        this.grid = [];

        for ( let i=0; i < HEIGHT; i++ ) {
            let row = []
            for ( let j=0; j < ROW_LENGTH; j++ ) {
                row.push(
                    new Rect( 
                        x + j * SQUARE_SIZE + 5,
                        y + i * SQUARE_SIZE + 5,
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
            let row = this.grid[i];
            for ( let j=0; j < ROW_LENGTH; j++ ) {
                row[j].fill();
            }
        }

    }

}

module.exports = StackerGrid;

},{"./CanvasUtils":1}],3:[function(require,module,exports){

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

},{"./CanvasUtils":1,"./StackerGrid":2}]},{},[3]);
