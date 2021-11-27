export { Vector };

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Vector{
    constructor(x,y) {
        this.xComp = x;
        this.yComp = y;
    }

    additionFrom(vector) {
        return new Vector(this.xComp + vector.xComp, this.yComp + vector.yComp);
    }

    subtractedBy(vector) {
        return new Vector(this.xComp - vector.xComp, this.yComp - vector.yComp);
    }

    displacementFrom(vector) {
        return this.subtractedBy(vector).length();
    }

    displacementVectorFrom(vector) {
        return this.subtractedBy(vector);
    }

    scaledBy(scale) {
        return new Vector(this.xComp * scale, this.yComp * scale);
    }

    normalised() {
        return this.scaledBy(1/this.length());
    }

    static dotProduct(vector1, vector2) {
        return vector1.xComp * vector2.xComp + vector1.yComp * vector2.yComp;
    }

    static crossProduct(vector1, vector2) {
        return vector1.xComp * vector2.yComp - vector1.yComp * vector2.xComp;
    }

    lengthSq() {
        return Vector.dotProduct(this, this);
    }

    length() {
        return (this.xComp !== 0 || this.yComp !== 0 ?  Math.sqrt(this.lengthSq()) : 0);
    }

    drawVector(initialX, initialY, scale, colour){
        ctx.beginPath();
        ctx.moveTo(initialX,initialY);
        ctx.lineTo(initialX + this.xComp * scale, initialY + this.yComp * scale);
        ctx.strokeStyle = colour;
        ctx.stroke();
    }

    perpendicular() {
        return new Vector(-this.yComp, this.xComp)
    }
}