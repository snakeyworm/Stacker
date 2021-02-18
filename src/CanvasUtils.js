
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

module.exports = {
    Rect
}
