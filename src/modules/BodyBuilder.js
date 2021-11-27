import {Vector} from "./Vector.js";
import {Body, bodyArray} from "./Body.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let builderState = 0;
let mouse = new Vector(0, 0);
let currentMouse = new Vector(0,0);
let currentPosition = new Vector(0, 0);
let currentRadius;
let currentVelocity = new Vector(0, 0);

window.addEventListener("click", function (e) {
    if (e.target.closest('#menu1') !== null
        || e.target.closest('#menu2') !== null
        || e.target.closest('#menu3') !== null)
        return;

    mouse = new Vector(e.x, e.y);
    currentMouse = mouse;
    const action0 = builderState === 0 ? currentPosition = mouse : 'unknown';
    builderState++;
});

export const bodyBuilder = () => {
    switch (builderState) {
        case 1:
            let tempRadius;
            window.addEventListener('mousemove', function (e) {
                currentMouse = new Vector(e.x, e.y);
            })
            let distance = currentPosition.displacementVectorFrom(currentMouse);
            tempRadius = distance.length();
            ctx.beginPath();
            ctx.arc(mouse.xComp, mouse.yComp, tempRadius, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            currentRadius = tempRadius;
            break;
        case 2:
            window.addEventListener('mousemove', function (e) {
                currentMouse = new Vector(e.x, e.y);
            })
            let tempVelocity = currentMouse.displacementVectorFrom(currentPosition).scaledBy(1/50);
            ctx.beginPath();
            ctx.arc(currentPosition.xComp, currentPosition.yComp, currentRadius, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.moveTo(currentPosition.xComp, currentPosition.yComp);
            ctx.lineTo(currentMouse.xComp, currentMouse.yComp);
            ctx.stroke();
            currentVelocity = tempVelocity;
            break;
        case 3:
            let newBody = new Body();
            newBody.position = currentPosition;
            newBody.velocity = currentVelocity.scaledBy(-1);
            newBody.radius = currentRadius;
            newBody.mass = newBody.radius*10;
            builderState = 0;
            break;
    }
}
