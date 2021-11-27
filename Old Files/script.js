console.log("Let's a go!");

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const windowWidth = canvas.width;
const windowHeight = canvas.height;

const bodyArray = [];

const generateValue = (limit) =>  Math.floor(Math.random()*limit);

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
    
    scaledBy(scale) {
        return new Vector(this.xComp * scale, this.yComp * scale);
    }
    
    static dotProduct(vector1, vector2) {
        return vector1.xComp * vector2.xComp + vector1.yComp * vector2.yComp;
    }

    static crossProduct(vector1, vector2) {
        return vector1.xComp * vector2.yComp - vector1.yComp * vector2.xComp;
    }
}

class Body{
    constructor() {
        this.mass = generateValue(200) + 200;
        this.radius = this.mass/10;
        this.position = new Vector(generateValue(1080), generateValue(720));
        this.velocity = new Vector(generateValue(20) - 10,generateValue(20) - 10);
        this.acceleration = new Vector(0,0);
        bodyArray.push(this);
    }

    drawBody() {
        ctx.beginPath();
        ctx.arc(this.position.xComp, this.position.yComp, this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fill();
    }
    
    accelerate() {
        this.velocity = this.velocity.additionFrom(this.acceleration);
        this.position = this.position.additionFrom(this.velocity);
    }
}

const render = () => {
    ctx.clearRect(0, 0, windowWidth, windowHeight);
    bodyArray.forEach((body) => {
        body.accelerate();
        body.drawBody();
    })




    requestAnimationFrame(render);
}

requestAnimationFrame(render);

const Body1 = new Body()
const Body2 = new Body()
const Body3 = new Body()