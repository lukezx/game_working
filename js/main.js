/** @type {import("../typings/types/phaser")} */
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 } ,// Top down game, so no gravity
            debug: true
        }
    },
    scene: [Load, Menu, Options, Game],
    render: {
        pixelArt: true
    }
};

let game = new Phaser.Game(config);
