/** @type {import("../typings/types/phaser")} */
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 } ,// Top down game, so no gravity
            debug: false
        }
    },
    scene: [Load, Menu, Options, Game, Game_Over],
    render: {
        pixelArt: true
    }
};

let settings = new Global_Settings();
let game = new Phaser.Game(config);
