class SoundToggle
{
    constructor(scene)
    {
        this.scene = scene;
    }

    addSoundToggle()
    {
        let soundScale = 0.5;

        this.scene.sound_playing = this.scene.add.image(0,0,"sound_playing").setDepth(100);
        this.scene.sound_playing.setVisible(!settings.mute);
        this.scene.sound_playing.setScale(soundScale);
        this.scene.sound_playing.setOrigin(0,1);
        this.scene.sound_playing.setPosition(0, this.scene.game.renderer.height);
        this.scene.sound_playing.setInteractive();
        
        this.scene.sound_mute = this.scene.add.image(0,0,"sound_mute").setDepth(100);
        this.scene.sound_mute.setVisible(settings.mute);
        this.scene.sound_mute.setScale(soundScale);
        this.scene.sound_mute.setOrigin(0,1);
        this.scene.sound_mute.setPosition(0, this.scene.game.renderer.height);
        this.scene.sound_mute.setInteractive();

        this.scene.sound_playing.on("pointerup", () => {
            this.scene.sound.mute = true;
            settings.mute = true;
            this.scene.sound_playing.setVisible(false);
            this.scene.sound_mute.setVisible(true);
        });
        
        this.scene.sound_mute.on("pointerup", () => {
            this.scene.sound.mute = false;
            settings.mute = false;
            this.scene.sound_playing.setVisible(true);
            this.scene.sound_mute.setVisible(false);
        });
    }
}