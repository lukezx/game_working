class Enemy extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture, frame, word) {
        super(scene, x, y, texture, frame);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        this.word = word;
    }
}