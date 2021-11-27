import {Vector} from "./Vector.js";
import {Body, bodyArray} from "./Body.js";

let gravitationalConstant = document.getElementById('menu-gravitational-constant').value;

document.getElementById('menu-gravitational-constant').addEventListener('change', function () {
    gravitationalConstant = document.getElementById('menu-gravitational-constant').value;
});


export const borderQuery = (body) => body.radius >= body.position.xComp
    || body.radius >= body.position.yComp
    || body.radius >= canvas.width - body.position.xComp
    || body.radius >= canvas.height - body.position.yComp;
export const collisionQuery = (body1, body2) => (body1.radius + body2.radius) >= body1.position.displacementFrom(body2.position);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/*
function accelerate() {
    this.velocity = this.velocity.additionFrom(this.acceleration);
    this.position = this.position.additionFrom(this.velocity);
}
*/

export function renderCentreOFMass() {
    let totalMass = 0;
    let centerOfMassVector = new Vector(0, 0);
    bodyArray.forEach((body) => {
        totalMass += body.mass;
        centerOfMassVector = centerOfMassVector.additionFrom(body.position.scaledBy(body.mass));
    })
    centerOfMassVector = centerOfMassVector.scaledBy(1/totalMass);
    ctx.beginPath();
    ctx.strokeStyle = '#FFF';
    ctx.fillStyle = '#FFF';
    ctx.strokeWidth = 100;
    ctx.arc(centerOfMassVector.xComp, centerOfMassVector.yComp, 10, 0, 2 * Math.PI);
    ctx.stroke();

}

function mergeResolution(body1, body2){
    bodyArray.splice(bodyArray.indexOf(body1),1);
    bodyArray.splice(bodyArray.indexOf(body2),1);
    let mergeBody = new Body();
    mergeBody.mass = body1.mass + body2.mass;
    mergeBody.radius = mergeBody.mass/10;
    mergeBody.position = body1.position.scaledBy(body1.mass).additionFrom(body2.position.scaledBy(body2.mass)).scaledBy(1/mergeBody.mass);
    mergeBody.velocity = body1.velocity.scaledBy(body1.mass).additionFrom(body2.velocity.scaledBy(body2.mass)).scaledBy(1/mergeBody.mass);
}

export function do_physics(dt) {
    bodyArray.forEach((body) => {
        body.position = body.position.additionFrom(body.velocity.scaledBy(0.5 * dt));
    })
    bodyArray.forEach((body) => {
        body.acceleration = renderGravityField(body.position);
    })
    bodyArray.forEach((body) => {
        body.velocity = body.velocity.additionFrom(body.acceleration.scaledBy(dt));
    })
    bodyArray.forEach((body1) => {
        // body1.position = body1.position.additionFrom(body1.velocity.scaledBy(0.5 * dt));
        bodyArray.forEach((body2) => {
            // const action0 = body1 !== body2 && collisionQuery(body1, body2) ? mergeResolution(body1, body2) : 'unknown';
            const action1 = body1 !== body2 && collisionQuery(body1, body2) ? Body.penetrationResolution(body1, body2) : 'unknown';
            const action2 = body1 !== body2 && collisionQuery(body1, body2) ? Body.elasticResolution(body1, body2) : 'unknown';
        })
        const action1 = borderQuery(body1) ? Body.borderResolution(body1) : 'unknown';
    })
}

export function renderGravityField(current) {
    let sumGravitationalForce = new Vector(0,0);
    bodyArray.forEach((body) => {
        const gravitationalDistance = current.displacementFrom(body.position);
        const displacementX = current.xComp - body.position.xComp;
        const displacementY = current.yComp - body.position.yComp;
        const gravitationalX = (gravitationalConstant * body.mass * displacementX) / gravitationalDistance**3;
        const gravitationalY = (gravitationalConstant * body.mass * displacementY) / gravitationalDistance**3;
        const gravitationalForce = new Vector (gravitationalX, gravitationalY);
        const gravitationalMagnitude = gravitationalForce.length();
        const gravitationalLimit = gravitationalForce.normalised().scaledBy(gravitationalMagnitude);
        sumGravitationalForce = current !== body.position && gravitationalConstant !== 0 ? sumGravitationalForce.additionFrom(gravitationalLimit.scaledBy(-1)) : sumGravitationalForce;
    })
    return sumGravitationalForce;
}
