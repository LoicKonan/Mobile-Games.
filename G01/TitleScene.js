class TitleScene extends Phaser.Scene
{
    constructor()
    {
        super("TitleScene");
    }

    preload()
    {
        // Loading the background images.
        this.load.image('nebula','./assets/nebula.png');

        // Loading the exit music.
        this.load.audio('Violins', './assets/Violins.wav');
    }

    create()
    {
        // Exit music.
        let exitMusic = this.sound.add('Violins', {volume: 0.3});
        exitMusic.play(
        {
            loop: false
        })

        let nebula = this.add.image(220, 250, 'nebula');
        nebula.setScale(.15);


        let text = this.add.text(225, 400, "Souls Crusher", 
        {
            fontSize: '45px'
        });
        text.setOrigin(0.5, 0.5);
        text.setInteractive();

        this.input.on('pointerdown', ()=>
        {
            this.scene.start('MainScene');
        });
    
        this.tweens.add
        (
            {
            targets: [text],
            duration: 500,
            alpha: 0,
            yoyo: true,
            repeat: -1
            }
        );
    }
}