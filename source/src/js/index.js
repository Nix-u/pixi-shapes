'use strict';

import * as PIXI from 'pixi.js'
import './../style.css'

import {getInteger, getColor, getFigureType} from "./Random"
import {getSquare, getQuantity} from "./Info"


let dispSquare = document.querySelector('.square');
let dispQuantity = document.querySelector('.quantity');

let speed = 1;
let quantityIncr = document.querySelector('.quantity-incr');
let quantityDecr = document.querySelector('.quantity-decr');
let quantityText = document.querySelector('.quantity-text');

let gravity = 5;
let gravityIncr = document.querySelector('.gravity-incr');
let gravityDecr = document.querySelector('.gravity-decr');
let gravityText = document.querySelector('.gravity-text');

let timer = 0;
let respTime;
let sprites = [];

const myCanvas = document.getElementById('myCanvas');
const renderer = new PIXI.Renderer({
    view: myCanvas,
    width: 800,
    height: 600,
});

const stage = new PIXI.Container();
const ticker = new PIXI.Ticker();
ticker.add(delta => animate(delta));
ticker.start();

const backGround = new PIXI.Graphics();
backGround.beginFill(0xbfd9d7);
backGround.drawRect(0, 0, renderer.width, renderer.height);
backGround.endFill();
backGround.interactive = true;
backGround.on('pointerdown', missClick);
stage.addChild(backGround);

function createSprite(clickedPos = false) {
    let graphic = new PIXI.Graphics();
    graphic.interactive = true;
    graphic.buttonMode = true;
    graphic.on('pointerdown', doPointerDown);
    graphic.beginFill(0xFFFFFF);
    graphic.tint = getColor();
    graphic.pivot.set(50, 50);

    if (clickedPos) {
        graphic.position.set(clickedPos.x, clickedPos.y);
    } else {
        graphic.position.set(getInteger(0, renderer.width), -50);
    }

    switch (getFigureType()) {
        case '3sides':
            const trianSide = 100;
            graphic.name = '3sides';
            graphic.drawPolygon([
                trianSide/2, 0,
                0, trianSide,
                trianSide, trianSide,
                trianSide/2, 0
            ]);
            graphic.squarePixels = (trianSide * Math.sqrt(Math.pow(trianSide,2) - (Math.pow(trianSide,2) / 4))) / 2;
            break;
        case '4sides':
            const rectWidth = 100;
            const rectHeight = 100;
            graphic.name = '4sides';
            graphic.drawRect(0, 0, rectWidth, rectHeight);
            graphic.squarePixels = rectWidth * rectHeight;
            break;
        case '5sides':
            const pentSide = 62;
            graphic.name = '5sides';
            graphic.drawPolygon([
                50, 0,
                0, 37,
                19, 96,
                81, 96,
                100, 37,
                50, 0
            ]);
            graphic.squarePixels = 1.72 * pentSide * pentSide;
        break;
        case '6sides':
            const hexSide = 50;
            graphic.name = '6sides';
            graphic.drawPolygon([
                50, 0,
                25, 0,
                0, 42,
                25, 87,
                75, 87,
                100, 42,
                75, 0,
                50, 0
            ]);
            graphic.squarePixels = (3 * Math.sqrt(3) / 2) * Math.pow(hexSide, 2);
            break;
        case 'circle':
            const radius = 50;
            graphic.name = 'circle';
            graphic.drawCircle(0, 0, radius);
            graphic.pivot.set(0, 0);
            graphic.squarePixels = Math.PI * Math.pow(radius, 2);
            break;
        case 'ellipse':
            const radius1 = 50;
            const radius2 = 25;
            graphic.name = 'ellipse';
            graphic.drawEllipse(0, 0, radius1, radius2);
            graphic.pivot.set(0, 0);
            graphic.squarePixels = Math.PI * radius1 * radius2;
            break;
        case 'random1':
            const arrowSideOne = 71;
            const arrowSideTwo = 50;
            graphic.name = 'random1';
            graphic.drawPolygon([
                50, 0,
                25, 0,
                25,50,
                0, 50,
                50, 100,
                100, 50,
                75, 50,
                75, 0,
                50, 0
            ]);
            graphic.squarePixels = ((arrowSideOne * Math.sqrt(Math.pow(arrowSideOne,2) - (Math.pow(arrowSideOne,2) / 4))) / 2) + Math.pow(arrowSideTwo, 2);
            break;
        case 'random2':
            const randomTwoSideOne = 71;
            const randomTwoSideTwo = 71;
            const randomTwoRadius = 20;
            graphic.name = 'random2';
            graphic.drawPolygon([
                0, 0,
                50, 50,
                0, 100,
                100, 100,
                50, 50,
                100, 0,
                0, 0
            ]);
            graphic.arc(50, 50, randomTwoRadius, 0, Math.PI*randomTwoRadius);
            graphic.squarePixels = ((randomTwoSideOne * Math.sqrt(Math.pow(randomTwoSideOne,2) - (Math.pow(randomTwoSideOne,2) / 4))) / 2) + ((randomTwoSideTwo * Math.sqrt(Math.pow(randomTwoSideTwo,2) - (Math.pow(randomTwoSideTwo,2) / 4))) / 2) + (Math.PI * Math.pow(randomTwoRadius, 2))/4;
            break;
        case 'random3':
            const randomThreeRadius = 50;
            const randomThreeSide = 50;
            graphic.name = 'random3';
            graphic.arc(50, 50, 50, Math.PI, 0);
            graphic.drawPolygon([
                25, 50,
                25, 100,
                75, 100,
                75, 50,
                25, 50
            ]);
            graphic.squarePixels = (Math.PI * Math.pow(randomThreeRadius, 2))/2 + Math.pow(randomThreeSide, 2);
            break;
    }

    graphic.endFill();
    stage.addChild(graphic);
    return graphic
}

function addSprites() {
    sprites.push(createSprite() );
}

function animate(delta){
    renderer.render(stage);
    timer += delta;
    respTime = 60 / speed;
    if (timer > respTime) {
        timer = 0;
        addSprites();
    }

    sprites.forEach((sprite, i) => {
        sprite.y += gravity;
        if (sprite.y > renderer.height + sprite.height) {
            sprites.splice(i, 1);
            stage.removeChild(sprite);
        }
    });

    dispSquare.innerHTML =  `Surface area occupied by shapes: ${getSquare(sprites)} px^2`;
    dispQuantity.innerHTML = `Number of current shapes: ${getQuantity(sprites)}`;
}

quantityIncr.onclick = function () {
    speed++;
    quantityText.innerHTML = `Number of shapes per sec: ${speed}`;
};
quantityDecr.onclick = function () {
    speed--;
    if (speed < 0) {
        speed = 0
    }
    quantityText.innerHTML = `Number of shapes per sec: ${speed}`;
};

gravityIncr.onclick = function () {
    gravity++;
    gravityText.innerHTML = `Gravity Value: ${gravity}`;
};
gravityDecr.onclick = function () {
    gravity--;
    if (gravity < 0) {
        gravity = 0
    }
    gravityText.innerHTML = `Gravity Value: ${gravity}`;
};

function doPointerDown(event) {
    const target = event.target;
    const targetIndex = sprites.indexOf(event.target);
    stage.removeChild(sprites[targetIndex]);
    sprites.splice(targetIndex, 1);

    sprites.forEach((sprite) => {
        if (sprite.name === target.name) {
            sprite.tint = getColor();
        }
    });
}

function missClick (event) {
    const clickedPos = event.data.global;
    sprites.push(createSprite(clickedPos) );
}