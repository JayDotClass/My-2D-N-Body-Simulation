import { Vector } from './modules/Vector.js'
import { Body, bodyArray } from './modules/Body.js'
import { bodyBuilder } from './modules/BodyBuilder.js'
import { do_physics, renderCentreOFMass } from './modules/Physics.js'
import {gravitationalIndicator, renderVectorField} from './modules/VectorField.js'

console.log("Let's a go!");

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


let presetChosen = -1;
let showTrails = document.getElementById('menu-toggle-trails').checked;
let showVectorField = document.getElementById('menu-toggle-vector-field').checked;
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

    bodyArray.forEach((body) => {
        body.updateHistory(trailLength);
        if (showTrails) {
            body.trailPath();
        } else {
            body.clearHistory();
        }
        body.drawBody();
        // body1.displayKinematics();
        // body1.displayProperties();
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
    requestAnimationFrame(render);
}

requestAnimationFrame(render);

let halfWidth = canvas.width/2;
let halfHeight = canvas.height/2;


document.getElementById('menu-reset-spacetime').addEventListener('click', function () {
    console.log("Spacetime reset");
    bodyArray.splice(0,bodyArray.length);
    for (let i = 0; i < 30; i++) {
        let newBody = new Body();
    }
})

document.getElementById('menu-preset-blank').addEventListener('click', function () {
    bodyArray.splice(0,bodyArray.length);
})

document.getElementById('menu-preset-random').addEventListener('click', function () {
    bodyArray.splice(0,bodyArray.length);
    for (let i = 0; i < 30; i++) {
        let newBody = new Body();
    }
})

document.getElementById('menu-preset-binary').addEventListener('click', function () {
    bodyArray.splice(0,bodyArray.length);
    const Binary1 = new Body();

    Binary1.mass = 100;
    Binary1.radius = 10;
    Binary1.position = new Vector(halfWidth-100,halfHeight);
    Binary1.velocity = new Vector(0, -1);

    const Binary2 = new Body();

    Binary2.mass = 100;
    Binary2.radius = 10;
    Binary2.position = new Vector(halfWidth+100, halfHeight);
    Binary2.velocity = new Vector(0, 1);
})

document.getElementById('menu-preset-five').addEventListener('click', function () {
    bodyArray.splice(0,bodyArray.length);

    const System1 = new Body();


    System1.mass = 1000;
    System1.radius = 100;
    System1.position = new Vector(halfWidth, halfHeight);
    System1.velocity = new Vector(0, 0);

    const System2 = new Body();


    System2.mass = 100;
    System2.radius = 10;
    System2.position = new Vector(halfWidth + 300, 360);
    System2.velocity = new Vector(0, 1.8);


    const System3 = new Body();

    System3.mass = 1;
    System3.radius = 3;
    System3.position = new Vector(halfWidth + 325, 360);
    System3.velocity = new Vector(0, 3.8);


    const System4 = new Body();


    System4.mass = 100;
    System4.radius = 10;
    System4.position = new Vector(halfWidth - 300, 360);
    System4.velocity = new Vector(0, -1.8);

    const System5 = new Body();

    System5.mass = 1;
    System5.radius = 3;
    System5.position = new Vector(halfWidth - 324, 360);
    System5.velocity = new Vector(0, -3.8);
})

document.getElementById('radio-menu-reset').addEventListener('click', function () {
    let presets = document.getElementsByName("presets");
    console.log("Spacetime reset");
    for(let i = 0; i < presets.length; i++) {
        if (presets[i].checked)
            presetChosen = presets[i].value;
    }
    renderPreset();
})

function renderPreset(){
    console.log("preset rendering...");
    console.log(presetChosen);
    switch(presetChosen) {
        case 'A':
            console.log("blank preset activated");
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
            const Binary1 = new Body();

            Binary1.mass = 100;
            Binary1.radius = 10;
            Binary1.position = new Vector(halfWidth-100,halfHeight);
            Binary1.velocity = new Vector(0, -1);

            const Binary2 = new Body();

            Binary2.mass = 100;
            Binary2.radius = 10;
            Binary2.position = new Vector(halfWidth+100, halfHeight);
            Binary2.velocity = new Vector(0, 1);
            presetChosen = -1;
            break;
        case 'D':
            bodyArray.splice(0,bodyArray.length);

            const System1 = new Body();


            System1.mass = 1000;
            System1.radius = 100;
            System1.position = new Vector(halfWidth, halfHeight);
            System1.velocity = new Vector(0, 0);

            const System2 = new Body();


            System2.mass = 100;
            System2.radius = 10;
            System2.position = new Vector(halfWidth + 300, 360);
            System2.velocity = new Vector(0, 1.8);


            const System3 = new Body();

            System3.mass = 1;
            System3.radius = 3;
            System3.position = new Vector(halfWidth + 325, 360);
            System3.velocity = new Vector(0, 3.8);


            const System4 = new Body();


            System4.mass = 100;
            System4.radius = 10;
            System4.position = new Vector(halfWidth - 300, 360);
            System4.velocity = new Vector(0, -1.8);

            const System5 = new Body();

            System5.mass = 1;
            System5.radius = 3;
            System5.position = new Vector(halfWidth - 324, 360);
            System5.velocity = new Vector(0, -3.8);

            presetChosen = -1;
            break;
        default:
            console.log("Choice Unrecognised");
    }
}

/*
const Body1 = new Body();


Body1.mass = 1000;
Body1.radius = 100;
Body1.position = new Vector(halfWidth, halfHeight);
Body1.velocity = new Vector(0, 0);
*/

for (let i = 0; i < 30; i++) {
    let newBody = new Body();
}


/*
const Body1 = new Body();

Body1.mass = 100;
Body1.radius = 10;
Body1.position = new Vector(halfWidth-100,halfHeight);
Body1.velocity = new Vector(1, 1);
*/



/*
const Body2 = new Body();


Body2.mass = 100;
Body2.radius = 10;
Body2.position = new Vector(halfWidth + 300, 360);
Body2.velocity = new Vector(0, 1.8);


const Body3 = new Body();

Body3.mass = 1;
Body3.radius = 3;
Body3.position = new Vector(halfWidth + 325, 360);
Body3.velocity = new Vector(0, 3.8);


const Body4 = new Body();


Body4.mass = 100;
Body4.radius = 10;
Body4.position = new Vector(halfWidth - 300, 360);
Body4.velocity = new Vector(0, -1.8);

const Body5 = new Body();

Body5.mass = 1;
Body5.radius = 3;
Body5.position = new Vector(halfWidth - 324, 360);
Body5.velocity = new Vector(0, -3.8);
*/






/*
const Body2 = new Body();

Body2.mass = 100;
Body2.radius = 10;
Body2.position = new Vector(halfWidth+100, halfHeight);
Body2.velocity = new Vector(0, 0);
*/






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