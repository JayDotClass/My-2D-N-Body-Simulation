import { Vector } from '../src/modules/Vector.js'
import { Body, bodyArray } from '../src/modules/Body.js'
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function (){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

window.addEventListener("contextmenu", function (e) {
    let mouse = new Vector(e.x, e.y);

    const mouseBody = new Body();
    mouseBody.position = mouse;
});

const borderQuery = (body) => body.radius >= body.position.xComp
    || body.radius >= body.position.yComp
    || body.radius >= canvas.width - body.position.xComp
    || body.radius >= canvas.height - body.position.yComp;
const collisionQuery = (body1, body2) => (body1.radius + body2.radius) >= body1.position.displacementFrom(body2.position);


const render = () => {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    bodyBuilder();
    bodyArray.forEach((body1) => {
        body1.drawBody();
        body1.accelerate();
        body1.colour = 'white';
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
render();