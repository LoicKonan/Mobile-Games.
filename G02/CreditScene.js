class CreditScene extends Phaser.Scene 
{
    constructor() 
    {
        super("CreditScene");
        this.Audio = null;
    }

    preload() 
    {
        // Background images.
        this.load.image('Nebula', './assets/Nebula.png');
        this.load.audio('OUT', './assets/OUT.mp3');
        this.load.audio('Backsound', './assets/Backsound.wav');
    }

    create() 
    {
        this.Audio = this.sound.add("OUT", 
        {
            volume: .05,
            loop: true
        });
        
        // play Music
        this.Audio.play();


        // Add background
        let background = this.add.image(225,400,'Nebula');
        background.setScale(.5);

        // The Title settings.
        let text = this.add.text(225, 130, "SPACE KILLERS", 
        {
            fontFamily: 'Zen',
            fill : '#ec008c',
            stroke : "blue",
            fontSize : '40px',
            fontWeight : 'bold',
            strokeThickness : 6,
            color: 'green'
        }).setOrigin(0.5);
        text.setInteractive();
        this.tweens.add
        (
            {
            targets: [text],
            duration: 1000,
            alpha: 0,
            yoyo: true,
            repeat: -1
            }
        );

        // The Go Back to Menu Button.
        let menu = this.add.rectangle(225, 700, 180, 60, 0x2600F9, 0.3);
        menu.setInteractive();
        menu.on('pointerdown', () => 
        {
            this.Audio.stop();
            this.sound.play('Backsound', 
            {
                volume: 0.1
            });
            this.scene.start('TitleScene');
        });
        let Menu = this.add.text(225, 700, "< MENU >", 
        {
            fontFamily: 'Zen',
            fill : '#ec008c',
            stroke : "blue",
            fontSize : '30px',
            fontWeight : 'bold',
            strokeThickness : 6,
            color: 'green'
        }).setOrigin(0.5);

        let Move = this.add.text(225, 330, "Creator: Loic Konan",
        {
            fontSize : '30px',
            align: 'center',
            fontFamily: 'Zen',

        }).setOrigin(0.5);

        let Move2 = this.add.text(225, 380, "Prof: J Glebe",
        {
            fontSize : '30px',
            align: 'center',
            fontFamily: 'Zen',

        }).setOrigin(0.5);

        let Move4 = this.add.text(225, 420, "Game Tester: Poodle (Fatima)",
        {
            fontSize : '30px',
            align: 'center',
            fontFamily: 'Zen',

        }).setOrigin(0.5);

        let Move3 = this.add.text(225, 480, "Websites used: OpenGameArt & itch.io",
        {
            fontSize : '20px',
            align: 'center',
            fontFamily: 'Zen',

        }).setOrigin(0.5);

    }
}

