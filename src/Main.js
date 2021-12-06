import { Vector } from './modules/Vector.js'
import { Body, bodyArray } from './modules/Body.js'
import { bodyBuilder } from './modules/BodyBuilder.js'
import {do_physics, renderCentreOFMass, resetPlayBack, testMass} from './modules/Physics.js'
import {renderForceLinks, renderVectorField} from './modules/VectorField.js'

console.log("Let's a go!");



const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let presetChosen = -1;
let testMassOn = false;

window.addEventListener('resize', function (){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

window.addEventListener("contextmenu", function (e) {
    /*
    let mouse = new Vector(e.x, e.y);

    const mouseBody = new Body();
    mouseBody.position = mouse;
    */

    if (testMassOn) {
        testMassOn = false;
    } else {
        testMassOn = true;
    }
});

let showTrails = document.getElementById('menu-toggle-trails').checked;
let showVectorField = document.getElementById('menu-toggle-vector-field').checked;
let showForceLinks = document.getElementById('menu-toggle-force-link').checked;
let trailLength = document.getElementById('menu-trail-length').value;

document.getElementById('menu-trail-length').addEventListener('change', function () {
    trailLength = document.getElementById('menu-trail-length').value;

})

document.getElementById('menu-toggle-trails').addEventListener('change', function () {
    showTrails = document.getElementById('menu-toggle-trails').checked;

});

document.getElementById('menu-toggle-vector-field').addEventListener('change', function () {
    showVectorField = document.getElementById('menu-toggle-vector-field').checked;

})

document.getElementById('menu-toggle-force-link').addEventListener('change', function () {
    showForceLinks = document.getElementById('menu-toggle-force-link').checked;

})

window.addEventListener('keydown', function (e) {
    switch(e.key) {
        case 'Enter':
            choosePreset();
            renderPreset();
            break;
        case 'Q':
            document.getElementById('radio-preset-blank').checked = true;
            break;
        case 'W':
            document.getElementById('radio-preset-random').checked = true;
            break;
        case 'E':
            document.getElementById('radio-preset-binary').checked = true;
            break;
        case 'R':
            document.getElementById('radio-preset-five').checked = true;
            break;
        case 'T':
            document.getElementById('radio-preset-chaotic').checked = true;
            break;
        case 'Y':
            document.getElementById('radio-preset-3Body1').checked = true;
            break;
    }
})


const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = 'rgba(0,0,0,0.5)';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    bodyBuilder();

    for (let k = 0; k < 4; k++) {
        do_physics(1.0 / 4);
    }

    if (showVectorField) {
        renderVectorField();
    }

    if (showForceLinks) {
        renderForceLinks();
    }

    if (testMassOn) {
        testMass();
    }

    bodyArray.forEach((body) => {
        body.updateHistory(trailLength);
        if (showTrails) {
            body.trailPath();
        } else {
            body.clearHistory();
        }
        body.drawBody();
        // body.displayKinematics();
        // body.displayProperties();
    })
    renderCentreOFMass();
    /*
    let totalMass = 0;
    bodyArray.forEach((body) => {
        console.log(body.mass);
        totalMass += body.mass;
    })
    console.log(`Body count: ${bodyArray.length}`);
    console.log(`Total Mass is: ${totalMass}`);
    */
    const indexArray = [];
    bodyArray.forEach((body) => {
        indexArray.push(bodyArray.indexOf(body));
    });
    requestAnimationFrame(render);
}

requestAnimationFrame(render);

let halfWidth = canvas.width/2;
let halfHeight = canvas.height/2;

function choosePreset() {
    let presets = document.getElementsByName("presets");
    for(let i = 0; i < presets.length; i++) {
        if (presets[i].checked)
            presetChosen = presets[i].value;
    }
};

document.getElementById('radio-menu-reset').addEventListener('click', function () {
    choosePreset();
    renderPreset();
})

export function renderPreset(){
    switch(presetChosen) {
        case 'A':
            bodyArray.splice(0,bodyArray.length);
            presetChosen = -1;
            break;
        case 'B':
            bodyArray.splice(0,bodyArray.length);
            for (let i = 0; i < 30; i++) {
                let newBody = new Body();
            }
            presetChosen = -1;
            break;
        case 'C':
            bodyArray.splice(0,bodyArray.length);
            const binary1 = new Body();

            binary1.mass = 100;
            binary1.radius = 10;
            binary1.position = new Vector(halfWidth-50,halfHeight);
            binary1.velocity = new Vector(0, -0.5);

            const binary2 = new Body();

            binary2.mass = 100;
            binary2.radius = 10;
            binary2.position = new Vector(halfWidth+50, halfHeight);
            binary2.velocity = new Vector(0, 0.5);
            presetChosen = -1;
            break;
        case 'D':
            bodyArray.splice(0,bodyArray.length);

            const system1 = new Body();


            system1.mass = 1000;
            system1.radius = 100;
            system1.position = new Vector(halfWidth, halfHeight);
            system1.velocity = new Vector(0, 0);

            const system2 = new Body();


            system2.mass = 100;
            system2.radius = 10;
            system2.position = new Vector(halfWidth + 300, halfHeight);
            system2.velocity = new Vector(0, 1.8);


            const system3 = new Body();

            system3.mass = 1;
            system3.radius = 3;
            system3.position = new Vector(halfWidth + 325, halfHeight);
            system3.velocity = new Vector(0, 3.8);


            const system4 = new Body();


            system4.mass = 100;
            system4.radius = 10;
            system4.position = new Vector(halfWidth - 300, halfHeight);
            system4.velocity = new Vector(0, -1.8);

            const system5 = new Body();

            system5.mass = 1;
            system5.radius = 3;
            system5.position = new Vector(halfWidth - 324, halfHeight);
            system5.velocity = new Vector(0, -3.8);

            presetChosen = -1;
            break;
        case 'E':
            bodyArray.splice(0,bodyArray.length);

            const chaotic1 = new Body();


            chaotic1.mass = 100;
            chaotic1.radius = 10;
            chaotic1.position = new Vector(halfWidth + 100, halfHeight);
            chaotic1.velocity = new Vector(0, 1);

            const chaotic2 = new Body();


            chaotic2.mass = 100;
            chaotic2.radius = 10;
            chaotic2.position = new Vector(halfWidth - 100, halfHeight);
            chaotic2.velocity = new Vector(0, -1);


            const chaotic3 = new Body();

            chaotic3.mass = 100;
            chaotic3.radius = 10;
            chaotic3.position = new Vector(halfWidth, halfHeight - 100);
            chaotic3.velocity = new Vector(1, 0);


            const chaotic4 = new Body();


            chaotic4.mass = 100;
            chaotic4.radius = 10;
            chaotic4.position = new Vector(halfWidth, halfHeight + 100);
            chaotic4.velocity = new Vector(-1, 0);
            break;
        case 'F':
            bodyArray.splice(0,bodyArray.length);

            const threeBody1 = new Body();


            threeBody1.mass = 10000;
            threeBody1.radius = 10;
            threeBody1.position = new Vector(halfWidth + 200, halfHeight);
            threeBody1.velocity = new Vector(0, 0);

            const threeBody2 = new Body();


            threeBody2.mass = 10000;
            threeBody2.radius = 10;
            threeBody2.position = new Vector(halfWidth - 200, halfHeight);
            threeBody2.velocity = new Vector(0, 0);


            const threeBody3 = new Body();

            threeBody3.mass = 100;
            threeBody3.radius = 10;
            threeBody3.position = new Vector(halfWidth + 200, halfHeight - 100);
            threeBody3.velocity = new Vector(-1, 0);

        default:
            console.log("Choice Unrecognised");
    }
    resetPlayBack();
}