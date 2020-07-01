'use strict';

export function getInteger(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        rand = Math.round(rand);
        return rand
    }

export function getColor () {
        const letters = '0123456789ABCDEF';
        let color = '0x';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

export function getFigureType () {
        const figureTypes = ['3sides', '4sides', '5sides', '6sides', 'circle', 'ellipse', 'random1', 'random2', 'random3'];
        return figureTypes[Math.floor(Math.random() * figureTypes.length)];
    }