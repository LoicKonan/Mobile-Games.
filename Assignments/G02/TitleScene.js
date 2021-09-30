class TitleScene extends Phaser.Scene 
{
    constructor() 
    {
        super("TitleScene");
        this.scoresText = null;
        this.username = "";
    }

    preload()
    {
        // Loading the exit music.
        this.load.audio('intro', './assets/intro.mp3');
        this.load.audio('Backsound', './assets/Backsound.wav');

         //load background
         this.load.image("parallax-back", "./assets/0.png");
         this.load.image("parallax-front", "./assets/1.png");
         this.load.image("parallax-middle", "./assets/2.png");
         this.load.image("parallax-lights", "./assets/3.png");
         this.load.image("parallax-lights2", "./assets/4.png");
         this.load.image("parallax-lights3", "./assets/5.png");
         this.load.image("parallax-lights4", "./assets/6.png");
        }

    create() 
    {
        // Introduction music.
        let introMusic = this.sound.add('intro', {volume: 0.2});
        introMusic.play(
            {
                loop: true
            })
       
        this.backgroundLayers = [];
        
        //setup background stuff
        this.backgroundLayers[0] = this.add.tileSprite(0, 0, 272, 160, "parallax-back");
        this.backgroundLayers[0].setDepth(10);
        this.backgroundLayers[0].setOrigin(0);
        this.backgroundLayers[0].setScale(6);

        this.backgroundLayers[1] = this.add.tileSprite(0, 0, 0, 0, "parallax-lights2");
        this.backgroundLayers[1].setDepth(9);
        this.backgroundLayers[1].setOrigin(0);
        this.backgroundLayers[1].setScale(6);

        //setup background stuff
        this.backgroundLayers[2] = this.add.tileSprite(0, 0, 272, 160, "parallax-lights4");
        this.backgroundLayers[2].setDepth(-10);
        this.backgroundLayers[2].setOrigin(0);
        this.backgroundLayers[2].setScale(6);

        //setup background stuff
        this.backgroundLayers[3] = this.add.tileSprite(0, 0, 272, 160, "parallax-middle");
        this.backgroundLayers[3].setDepth(-10);
        this.backgroundLayers[3].setOrigin(0);
        this.backgroundLayers[3].setScale(6);

        // Create an input element for username
        this.nameInput = this.add.dom(225, 500, 'input');
        this.nameInput.setScale(2);
        this.element = this.nameInput.node;

        let name = this.add.text(105, 445, "Enter your Name:",
        {
            fontFamily: 'Courier New',
            fontSize : '25px',
            fontWeight : 'bold',
            color: 'white'
        })

        // The Title settings.
        let text = this.add.text(225, 330, "SPACE KILLERS", 
        {
            fontFamily: 'Zen',
            fill : '#ec008c',
            stroke : "blue",
            fontSize : '40px',
            fontWeight : 'bold',
            strokeThickness : 6,
            color: 'green'
        }).setOrigin(0.5);


        // The Title settings.
        let score = this.add.rectangle(225, 660, 180, 60, 0x2600F9, 0.3);
        score.setInteractive();
        score.on('pointerdown', () => 
        {
            introMusic.stop();
            this.sound.play('Backsound', 
            {
                volume: 0.1
            });
            this.scene.start('ScoreScene');
        });
        let Score = this.add.text(225, 660, "< Scores >", 
        {
            fontFamily: 'Trebuchet MS',
            fill : '#ec008c',
            stroke : "blue",
            fontSize : '30px',
            fontWeight : 'bold',
            strokeThickness : 6,
            color: 'green'
        }).setOrigin(0.5);
        text.setInteractive();
        this.tweens.add
        (
            {
            targets: [Score],
            duration: 1000,
            alpha: 0,
            yoyo: true,
            repeat: -1
            }
        );

        // The Credits settings.
        let Kool = this.add.rectangle(225, 740, 180, 60, 0x2600F9, 0.3);
        Kool.setInteractive();
        Kool.on('pointerdown', () => 
        {
            introMusic.stop();
            this.sound.play('Backsound', 
            {
                volume: 0.1
            });
            this.scene.start('CreditScene');
        });
        let Credits = this.add.text(225, 740, "< Credits >", 
        {
            fontFamily: 'Trebuchet MS',
            fill : '#ec008c',
            stroke : "blue",
            fontSize : '30px',
            fontWeight : 'bold',
            strokeThickness : 6,
            color: 'green'
        }).setOrigin(0.5);
        text.setInteractive();
        this.tweens.add
        (
            {
            targets: [Credits],
            duration: 1000,
            alpha: 0,
            yoyo: true,
            repeat: -1
            }
        );

        // Making the Play square Box.
        let PLAY = this.add.rectangle(225, 580, 180, 60, 0x2600F9, 0.3);
        PLAY.setInteractive();
        PLAY.on('pointerdown', () => 
        {
            introMusic.stop();
            this.sound.play('Backsound', 
            {
                volume: 0.1
            });
            this.scene.start('MainScene', 
            {
                username: this.username
            });
        });

        let NEW = this.add.text(225, 580, "< PLAY >", 
        {
            fontFamily: 'Trebuchet MS',
            fill : '#ec008c',
            stroke : "blue",
            fontSize : '30px',
            fontWeight : 'bold',
            strokeThickness : 6,
            color: 'green'

        }).setOrigin(0.5);
        text.setInteractive();
        this.tweens.add
        (
            {
            targets: [NEW],
            duration: 1000,
            alpha: 0,
            yoyo: true,
            repeat: -1
            }
        );
    }

    update()
    {
        this.username = this.element.value;
    
        //move paralax background
        let generalSpeed = .2;
        this.backgroundLayers[0].tilePositionX += generalSpeed;
        this.backgroundLayers[1].tilePositionX += generalSpeed * 2;
        this.backgroundLayers[3].tilePositionX += generalSpeed * 2;
    }
}