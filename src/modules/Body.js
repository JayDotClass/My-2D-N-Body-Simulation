import {Vector} from "./Vector.js";
export {Body, bodyArray};

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const generateValue = (limit) =>  Math.floor(Math.random()*limit);
const colourArray = ['#8D80AD', '#99B2DD', '#64F58D', '#BC2732', '#C9A17E', '#56876D', '#247BA0' ];


let worldElasticity = document.getElementById('menu-world-elasticity').value;

document.getElementById('menu-world-elasticity').addEventListener('change', function (){
    worldElasticity = document.getElementById('menu-world-elasticity').value;
});


const bodyArray = [];

class Body{
    constructor() {
        this.colour = colourArray[generateValue(7)];
        this.mass = generateValue(100) + 50;
        this.radius = this.mass/10;
        this.position = new Vector(Math.random() * canvas.width, Math.random() * canvas.height);
        this.velocity = new Vector(generateValue(20) - 10,generateValue(20) - 10).scaledBy(0.1);
        this.acceleration = new Vector(0,0);
        this.elasticity = worldElasticity;
        this.history = [];
        this.present = true;
        bodyArray.push(this);


    }

    drawBody() {
        ctx.beginPath();
        ctx.arc(this.position.xComp, this.position.yComp, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.colour;
        ctx.fill();
    }


    static penetrationResolution(body1, body2) {
        const penetrationVector = body1.position.displacementVectorFrom(body2.position);
        const penetrationDepth = (body1.radius + body2.radius) - penetrationVector.length();
        // body1.acceleration = body1.acceleration.scaledBy(0);
        // body2.acceleration = body2.acceleration.scaledBy(0);
        body1.position = body1.position.additionFrom(penetrationVector.normalised().scaledBy(penetrationDepth / 2))
        body2.position = body2.position.additionFrom(penetrationVector.normalised().scaledBy(-penetrationDepth / 2))
    }

    static elasticResolution(body1, body2) {
        const totalMass = body1.mass + body2.mass;
        const normalVector =  body1.position.displacementVectorFrom(body2.position);
        const unitNormalVector =  normalVector.normalised();
        normalVector.drawVector(body2.position.xComp,body2.position.yComp, 1, "blue")
        const relativeVelocityVector = body1.velocity.subtractedBy(body2.velocity);
        const normalVelocity = Vector.dotProduct(relativeVelocityVector,unitNormalVector);
        const resolutionValue = normalVelocity * worldElasticity;
        const resolutionVector = normalVelocity <= 0 ? unitNormalVector.scaledBy(2 * resolutionValue / totalMass) : unitNormalVector.scaledBy(0);
        body1.velocity = body1.velocity.additionFrom(resolutionVector.scaledBy(-body2.mass));
        body2.velocity = body2.velocity.additionFrom(resolutionVector.scaledBy(body1.mass));
    }

    static borderResolution(body) {
        const action1 = body.radius >= body.position.xComp ? body.velocity.xComp = Math.abs(body.velocity.xComp) : 'unknown';
        const action2 = body.radius >= body.position.yComp ? body.velocity.yComp = Math.abs(body.velocity.yComp) : 'unknown';
        const action3 = body.radius >= canvas.width - body.position.xComp ? body.velocity.xComp = -Math.abs(body.velocity.xComp) : 'unknown';
        const action4 = body.radius >= canvas.height - body.position.yComp ? body.velocity.yComp = -Math.abs(body.velocity.yComp) : 'unknown';
    }

    displayProperties() {
        ctx.fillStyle = "black";
        ctx.fillText(`m: ${this.mass}`, this.position.xComp - 15, this.position.yComp);
    }

    displayKinematics() {
        this.acceleration.drawVector(this.position.xComp,this.position.yComp,this.radius*100, "black");
        this.velocity.drawVector(this.position.xComp,this.position.yComp,this.radius * 10, "blue");
    }

    updateHistory(limit){
        this.history.push(this.position);
        if (this.history.length > limit && limit !== 0) {
            this.history.splice(0,1);
        }
    }

    trailPath() {
        let beginning = this.history[0];
        let size = this.history.length;
        if (size > 2){
            ctx.beginPath();
            ctx.moveTo(beginning.xComp, beginning.yComp);
            for (let i = 1; i < size - 2; i++) {
                let xc = (this.history[i].xComp + this.history[i + 1].xComp) / 2;
                let yc = (this.history[i].yComp + this.history[i + 1].yComp) / 2;
                ctx.quadraticCurveTo(this.history[i].xComp, this.history[i].yComp,xc,yc);
            }
            // curve through the last two points
            ctx.quadraticCurveTo(
                this.history[size - 2].xComp,
                this.history[size - 2].yComp,
                this.history[size - 1].xComp,
                this.history[size - 1].yComp
            );
            ctx.strokeStyle = this.colour;
            ctx.stroke();
        }


    }

    highlight() {
        ctx.beginPath();
        ctx.strokeStyle = '#FFF';
        ctx.fillStyle = '#FFF';
        ctx.lineWidth = 3;
        ctx.arc(this.position.xComp, this.position.yComp, this.radius + 5, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.lineWidth = 1;
    }

    updateInformationBox(){
        const round2 = (num) => Math.round(num * 100) / 100;
        const round5 = (num) => Math.round(num * 100000) / 100000;
        document.getElementById("bodyNumber").innerHTML = `Body Number: ${bodyArray.indexOf(this)}`;
        document.getElementById("bodyMass").innerHTML = `Body Mass: ${round2(this.mass)}`;
        document.getElementById("bodySpeed").innerHTML = `Body Speed: ${round2(this.velocity.length())}`;
        document.getElementById("bodyPosition").innerHTML = `Body Position: (${round2(this.position.xComp)},${round2(this.position.yComp)})`;
        document.getElementById("bodyVelocity").innerHTML = `Body Velocity: (${round2(this.velocity.xComp)},${round2(this.velocity.yComp)})`;
        document.getElementById("bodyAcceleration").innerHTML = `Body Acceleration: (${round5(this.acceleration.xComp)},${round5(this.acceleration.yComp)})`;
    }

    clearHistory() {
        this.history = [];
    }
}