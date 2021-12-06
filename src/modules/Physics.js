import {Vector} from "./Vector.js";
import {Body, bodyArray} from "./Body.js";
export {gravitationalConstant, newPlayBackSpeed, playBackSpeed};

let gravitationalConstant = document.getElementById('menu-gravitational-constant').value;
let previousGravitationalConstant = gravitationalConstant;
let mergeOnCollision = document.getElementById('menu-toggle-merge').checked;
let useBorder = document.getElementById('menu-toggle-border').checked;
let useHalfSpeed = document.getElementById('menu-toggle-half-speed').checked;
let newPlayBackSpeed = document.getElementById('menu-playback-speed').value;
let playBackSpeed = newPlayBackSpeed;
let ratio = newPlayBackSpeed / playBackSpeed;

document.getElementById('menu-gravitational-constant').addEventListener('change', function () {
    gravitationalConstant = document.getElementById('menu-gravitational-constant').value;

});

document.getElementById('menu-toggle-merge').addEventListener('change', function () {
    mergeOnCollision = document.getElementById('menu-toggle-merge').checked;

});

document.getElementById('menu-toggle-border').addEventListener('change', function () {
    useBorder = document.getElementById('menu-toggle-border').checked;
})

document.getElementById('menu-toggle-half-speed').addEventListener('change', function() {
    useHalfSpeed = document.getElementById('menu-toggle-half-speed').checked;
    if (useHalfSpeed) {
        bodyArray.forEach((body) => {
            body.velocity = body.velocity.scaledBy(0.5);
        });
        gravitationalConstant /= 4;
    } else {
        bodyArray.forEach((body) => {
            body.velocity = body.velocity.scaledBy(2);
        });
        gravitationalConstant *= 4;
    }
});

document.getElementById('menu-playback-speed').addEventListener('change', function() {
    playBackAdjustment();
});

document.getElementById('menu-')


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

export function playBackAdjustment() {
    newPlayBackSpeed = document.getElementById('menu-playback-speed').value;
    if (newPlayBackSpeed) {
        ratio = newPlayBackSpeed / playBackSpeed;
        bodyArray.forEach((body) => {
            body.velocity = body.velocity.scaledBy(ratio);
        });
        gravitationalConstant *= ratio ** 2;
        playBackSpeed = newPlayBackSpeed;
    }
    playBackSpeed = newPlayBackSpeed;
}

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
    const mergeArray = [];
    const indexArray = [];
    mergeArray.push(body1);
    mergeArray.push(body2);
    const mergeBody = new Body();
    mergeBody.mass = body1.mass + body2.mass;
    mergeBody.radius = mergeBody.mass/10;
    mergeBody.position = body1.position.scaledBy(body1.mass).additionFrom(body2.position.scaledBy(body2.mass)).scaledBy(1/mergeBody.mass);
    mergeBody.velocity = body1.velocity.scaledBy(body1.mass).additionFrom(body2.velocity.scaledBy(body2.mass)).scaledBy(1/mergeBody.mass);
    mergeArray.push(mergeBody);
    mergeArray.forEach((body) => {
        indexArray.push(bodyArray.indexOf(body));
    })
    bodyArray.splice(bodyArray.indexOf(body1),1);
    body1.present = false;
    bodyArray.splice(bodyArray.indexOf(body2),1);
    body2.present = false;
    mergeArray.forEach((body) => {
        indexArray.push(bodyArray.indexOf(body));
    })
}

export function do_physics(dt) {
    for (let i = 0; i < bodyArray.length; i++) {
        let body1 = bodyArray[i];
        for (let j = 0; j < i; j++) {
            let body2 = bodyArray[j];
            if (collisionQuery(body1, body2) && body1.present === true && body2.present === true){
                if (mergeOnCollision){
                    mergeResolution(body1,body2);
                } else {
                    Body.penetrationResolution(body1, body2);
                    Body.elasticResolution(body1, body2);
                }
            }
        }
        if(useBorder){
            const action1 = borderQuery(body1) ? Body.borderResolution(body1) : 'unknown';
        }
    }
    if (newPlayBackSpeed) {
        bodyArray.forEach((body) => {
            body.position = body.position.additionFrom(body.velocity.scaledBy(0.5 * dt));
        })
        bodyArray.forEach((body) => {
            body.acceleration = renderGravityField(body.position);
        })
        bodyArray.forEach((body) => {
            body.velocity = body.velocity.additionFrom(body.acceleration.scaledBy(dt));
        })
    }

    /*
    bodyArray.forEach((body1) => {
        body1.position = body1.position.additionFrom(body1.velocity.scaledBy(0.5 * dt));
        bodyArray.forEach((body2) => {

            const action1 = body1 !== body2 && collisionQuery(body1, body2) ? Body.penetrationResolution(body1, body2) : 'unknown';
            const action2 = body1 !== body2 && collisionQuery(body1, body2) ? Body.elasticResolution(body1, body2) : 'unknown';
        })
        const action1 = borderQuery(body1) ? Body.borderResolution(body1) : 'unknown';
    })
    */
}

export function resetPlayBack() {
    document.getElementById("menu-playback-speed").value = 1;
    gravitationalConstant = 0.5;
    newPlayBackSpeed = document.getElementById('menu-playback-speed').value;
    playBackSpeed = newPlayBackSpeed;
    ratio = newPlayBackSpeed / playBackSpeed;
};

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

export function testMass() {
    let mouse = new Vector(e.x, e.y);

    const mouseBody = new Body();
    mouseBody.position = mouse;
}

/*
window.addEventListener('keydown', function (e) {
    playBackAdjustment()
});

document.getElementById('radio-menu-reset').addEventListener('click', function () {
    playBackAdjustment();
});
*/