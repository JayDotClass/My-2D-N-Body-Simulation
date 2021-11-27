import { Vector } from './Vector.js'
import { renderGravityField } from './Physics.js'

let densityX = document.getElementById('menu-vector-field-density-x').value;
let densityY = document.getElementById('menu-vector-field-density-y').value;

document.getElementById('menu-vector-field-density-x').addEventListener('change', function () {
    densityX = document.getElementById('menu-vector-field-density-x').value;
})

document.getElementById('menu-vector-field-density-y').addEventListener('change', function () {
    densityY = document.getElementById('menu-vector-field-density-y').value;
})

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export const gravitationalIndicator = (initialXY) => {
    let finalXY = initialXY.additionFrom(renderGravityField(initialXY).scaledBy(10000));
    let distance  = finalXY.displacementVectorFrom(initialXY);

    let vectorHeightLimit = Math.min(canvas.width/(2.1*densityX), canvas.height/(2.1*densityY));
    let vhl = vectorHeightLimit;
    let strength = distance.length();
    let strengthIndicator = 250 - (250 / (1 + (2.71) ** (5 - (0.1 * strength))));
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
    ctx.moveTo(initialXY.xComp, initialXY.yComp);
    ctx.lineTo(finalXY.xComp, finalXY.yComp);
    ctx.lineTo(rightSide.xComp, rightSide.yComp);
    ctx.moveTo(finalXY.xComp, finalXY.yComp);
    ctx.lineTo(leftSide.xComp, leftSide.yComp);
    ctx.strokeStyle = `hsl( ${strengthIndicator}, ${saturation}%, ${lightness}%)`;
    ctx.stroke();
}

export const renderVectorField = () => {
    for (let i = 0 ; i <= densityY ; i++) {
        for (let j = 0; j <= densityX ; j++) {
            gravitationalIndicator(new Vector(canvas.width/densityX * j, canvas.width/densityY * i));
        }
    }
}