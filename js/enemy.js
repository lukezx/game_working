class Enemy extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture, frame, word) {
        super(scene, x, y, texture);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.world.enableBody(this);
        this.setScale(3);
        this.word = word;
    }
}