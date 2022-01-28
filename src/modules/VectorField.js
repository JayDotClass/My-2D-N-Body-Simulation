import { Vector } from './Vector.js'
import { renderGravityField } from './Physics.js'
import {bodyArray} from "./Body.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let densityX = document.getElementById('menu-vector-field-density-x').value;
let densityY = document.getElementById('menu-vector-field-density-y').value;
let mouse = new Vector(0,0);
let scaler = 1;
let thicker = 1;

document.getElementById('menu-vector-field-density-x').addEventListener('change', function () {
    densityX = document.getElementById('menu-vector-field-density-x').value;
})

document.getElementById('menu-vector-field-density-y').addEventListener('change', function () {
    densityY = document.getElementById('menu-vector-field-density-y').value;
})

document.getElementById('menu-test-vector-scale').addEventListener('change', function () {
    scaler = document.getElementById('menu-test-vector-scale').value;
})

document.getElementById('menu-test-vector-thickness').addEventListener('change', function () {
    thicker = document.getElementById('menu-test-vector-thickness').value;
})

canvas.addEventListener('mousemove', function (e) {
    mouse = new Vector(e.x, e.y);
})

export const gravitationalIndicator = (initialXY, fieldOn) => {
    let finalXY = initialXY.additionFrom(renderGravityField(initialXY).scaledBy(10000));
    let distance  = finalXY.displacementVectorFrom(initialXY);

    let vectorHeightLimit = Math.min(canvas.width / (2.1 * densityX), canvas.height / (2.1 * densityY));
    if (!fieldOn) {
        vectorHeightLimit = Math.min(canvas.width / (2.1 * 10), canvas.height / (2.1 * 10))* scaler ;
        ctx.lineWidth = thicker;
    }
    let vhl = vectorHeightLimit;
    let strength = distance.length();
    let strengthIndicator = 250 - (250 / (1 + (2.71) ** (2 - (0.018 * strength))));
    let lengthIndicator = 0.8*vhl + (0.2*vhl / (1 + (2.71) ** (5 - (0.1 * strength))));

    let arrowLength = lengthIndicator;
    let direction = distance.normalised();
    let perpendicular = new Vector(-direction.yComp, direction.xComp);

    finalXY = initialXY.additionFrom(direction.scaledBy(arrowLength));
    let rightSide = finalXY.subtractedBy(direction.scaledBy(arrowLength/10));
    rightSide = rightSide.additionFrom(perpendicular.scaledBy(arrowLength/20));
    let leftSide = finalXY.subtractedBy(direction.scaledBy(arrowLength/10));
    leftSide = leftSide.subtractedBy(perpendicular.scaledBy(arrowLength/20));

    let saturation = 100;
    let lightness = 50;

    ctx.beginPath();
    ctx.moveTo(finalXY.xComp, finalXY.yComp);
    ctx.lineTo(rightSide.xComp, rightSide.yComp);
    ctx.moveTo(finalXY.xComp, finalXY.yComp);
    ctx.lineTo(leftSide.xComp, leftSide.yComp);
    ctx.moveTo(initialXY.xComp, initialXY.yComp);
    ctx.lineTo(finalXY.xComp, finalXY.yComp);
    ctx.strokeStyle = `hsl( ${strengthIndicator}, ${saturation}%, ${lightness}%)`;
    ctx.stroke();
    ctx.lineWidth = 1;
}

export const renderVectorField = () => {
    for (let i = 0 ; i <= densityY ; i++) {
        for (let j = 0; j <= densityX ; j++) {
            gravitationalIndicator(new Vector(canvas.width/densityX * j, canvas.width/densityY * i), true);
        }
    }
}


/*
const gravitationalForce = (position, body) => {
    const gravitationalDistance = current.displacementFrom(body.position);
    const displacementX = current.xComp - body.position.xComp;
    const displacementY = current.yComp - body.position.yComp;
    const gravitationalX = (gravitationalConstant * body.mass * displacementX) / gravitationalDistance**3;
    const gravitationalY = (gravitationalConstant * body.mass * displacementY) / gravitationalDistance**3;
    const gravitationalForce = new Vector (gravitationalX, gravitationalY);
    const gravitationalMagnitude = gravitationalForce.length();
    const gravitationalLimit = gravitationalForce.normalised().scaledBy(gravitationalMagnitude);
}
*/

export const renderForceLinks = () => {
    for (let i = 0; i < bodyArray.length; i++) {
        for (let j = 0; j < i; j++) {
            let body1 = bodyArray[i];
            let body2 = bodyArray[j];

            let finalXY = body1.position.additionFrom(renderGravityField(body1.position).scaledBy(10000));
            let distance  = finalXY.displacementVectorFrom(body1.position);

            let strength = distance.length();
            let strengthIndicator = 250 - (250 / (1 + (2.71) ** (2 - (0.018 * strength))));

            let saturation = 100;
            let lightness = 50;

            if (strengthIndicator < 10){
                ctx.beginPath();
                ctx.moveTo(body1.position.xComp, body1.position.yComp);
                ctx.lineTo(body2.position.xComp, body2.position.yComp);
                ctx.strokeStyle = `hsl( ${strengthIndicator}, ${saturation}%, ${lightness}%)`;
                ctx.stroke();
            }

        }
    }
}

export const renderTestMass = () => gravitationalIndicator(mouse,false);
