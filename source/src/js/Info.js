'use strict';

export function getSquare(sprites) {
    return sprites.reduce((sum, sprite) => {
        return sum + sprite.squarePixels;
    }, 0).toFixed(2);
}

export function getQuantity(sprites) {
         return sprites.length;
    }