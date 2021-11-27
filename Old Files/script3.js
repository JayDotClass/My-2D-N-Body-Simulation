console.log("Let's a go!");

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const windowWidth = canvas.width;
const windowHeight = canvas.height;

const bodyArray = [];

const gravitationalConstant = 0.1;

const worldElasticity = 1;

let collisions = 0;

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

class Body{
    constructor() {
        this.colour = "red";
        this.mass = generateValue(50) + 10;
        this.radius = this.mass/10;
        this.position = new Vector(generateValue(1080), generateValue(720));
        this.velocity = new Vector(generateValue(10) - 5,generateValue(10) - 5).scaledBy(0.1);
        this.acceleration = new Vector(0,0);
        this.elasticity = worldElasticity;
        bodyArray.push(this);
    }

    drawBody() {
        ctx.beginPath();
        ctx.arc(this.position.xComp, this.position.yComp, this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.fillStyle = this.colour;
        ctx.fill();
    }

    accelerate() {
        this.velocity = this.velocity.additionFrom(this.acceleration);
        this.position = this.position.additionFrom(this.velocity);
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
        const resolutionValue = normalVelocity * Math.min(body1.elasticity, body2.elasticity);
        const resolutionVector = normalVelocity <= 0 ? unitNormalVector.scaledBy(2 * resolutionValue / totalMass) : unitNormalVector.scaledBy(0);
        body1.velocity = body1.velocity.additionFrom(resolutionVector.scaledBy(-body2.mass));
        body2.velocity = body2.velocity.additionFrom(resolutionVector.scaledBy(body1.mass));
        collisions += 1;
    }

    static borderResolution(body) {
        const action1 = body.radius >= body.position.xComp ? body.velocity.xComp = Math.abs(body.velocity.xComp) : 'unknown';
        const action2 = body.radius >= body.position.yComp ? body.velocity.yComp = Math.abs(body.velocity.yComp) : 'unknown';
        const action3 = body.radius >= windowWidth - body.position.xComp ? body.velocity.xComp = -Math.abs(body.velocity.xComp) : 'unknown';
        const action4 = body.radius >= windowHeight - body.position.yComp ? body.velocity.yComp = -Math.abs(body.velocity.yComp) : 'unknown';
        collisions++;
    }

    renderGravity() {
        let sumGravitationalForce = new Vector(0,0);
        bodyArray.forEach((body) => {
            const gravitationalDistance = this.position.displacementFrom(body.position);
            const displacementX = this.position.xComp - body.position.xComp;
            const displacementY = this.position.yComp - body.position.yComp;
            const gravitationalX = (gravitationalConstant * this.mass * body.mass * displacementX) / gravitationalDistance**3;
            const gravitationalY = (gravitationalConstant * this.mass * body.mass * displacementY) / gravitationalDistance**3;
            const gravitationalForce = new Vector (gravitationalX, gravitationalY);
            const gravitationalMagnitude = gravitationalForce.length();
            const gravitationalLimit = gravitationalForce.normalised().scaledBy(Math.min(gravitationalMagnitude, 2));
            sumGravitationalForce = this !== body && gravitationalConstant !== 0 ? sumGravitationalForce.additionFrom(gravitationalLimit.scaledBy(-1/this.mass)) : sumGravitationalForce;
        })
        return sumGravitationalForce;
    }

    displayProperties() {
        ctx.fillStyle = "black";
        ctx.fillText(`m: ${this.mass}`, this.position.xComp - 15, this.position.yComp);
    }

    displayKinematics() {
        this.acceleration.drawVector(this.position.xComp,this.position.yComp,this.radius*100, "black");
        this.velocity.drawVector(this.position.xComp,this.position.yComp,this.radius * 0.6, "blue");
    }
}

const borderQuery = (body) => body.radius >= body.position.xComp
    || body.radius >= body.position.yComp
    || body.radius >= windowWidth - body.position.xComp
    || body.radius >= windowHeight - body.position.yComp;
const collisionQuery = (body1, body2) => (body1.radius + body2.radius) >= body1.position.displacementFrom(body2.position);

const render = () => {
    ctx.clearRect(0, 0, windowWidth, windowHeight);
    ctx.font = '50px serif';
    bodyArray.forEach((body1) => {
        body1.acceleration = body1.renderGravity();
        body1.accelerate();
        body1.drawBody();
        body1.colour = 'red';
        // body1.displayKinematics();
        // body1.displayProperties();
        bodyArray.forEach((body2) => {
            const normalVector =  body1.position.displacementVectorFrom(body2.position);
            const closeDistance = (body1.radius + body2.radius + Math.max(body1.radius,body2.radius)) >= normalVector.length();
            const action0 = body1 !== body2 && closeDistance ? normalVector.drawVector(body2.position.xComp,body2.position.yComp, 1, "blue") : 'unknown';
            const action1 = body1 !== body2 && collisionQuery(body1, body2) ? Body.penetrationResolution(body1, body2) : 'unknown';
            const action2 = body1 !== body2 && collisionQuery(body1, body2) ? Body.elasticResolution(body1, body2) : 'unknown';
            const action3 = body1 !== body2 && collisionQuery(body1, body2) ? body1.colour = 'blue' : 'unknown';
        })
        const action1 = borderQuery(body1) ? Body.borderResolution(body1) : 'unknown';
    })




    requestAnimationFrame(render);
}

requestAnimationFrame(render);

const Body1 = new Body()

/*
Body1.mass = 100;
Body1.radius = 100;
Body1.position = new Vector(580, 360);
Body1.velocity = new Vector(1, 0);
*/



/*
Body1.mass = 10000;
Body1.position = new Vector(540, 360);
Body1.velocity = new Vector(0, 0);
*/

const Body2 = new Body();

/*
Body2.mass = 1;
Body2.radius = 10;
Body2.position = new Vector(700, 360);
Body2.velocity = new Vector(0, 0);
*/



/*
Body2.mass = 1;
Body2.position = new Vector(660, 360);
Body2.velocity = new Vector(0, 7);
 */


for (let i = 0; i < 30; i++) {
    let newBody = new Body();
}

/*
const Body3 = new Body();
const Body4 = new Body();
const Body5 = new Body();
const Body6 = new Body();
const Body7 = new Body();
const Body8 = new Body();
const Body9 = new Body();
const Body10 = new Body();
const Body11 = new Body();
const Body12 = new Body();
const Body13 = new Body();
const Body14 = new Body();
const Body15 = new Body();
const Body16 = new Body();
const Body17 = new Body();
const Body18 = new Body();
const Body19 = new Body();
*/

/*
Body1.mass = 10000;
Body1.radius = 100;
*/