class ScoreScene extends Phaser.Scene 
{
    constructor() 
    {
        super("ScoreScene");
        this.Audio = null;

        // Firebase stuff
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
        this.database = firebase.firestore();
        this.scoreTable = this.database.collection('scores')
        .orderBy('score', 'desc')
        .limit(7);

        // HTML stuff
        this.nameInput = null;
        /** @type {HTMLInputElement} */
        this.element = null;
    }

    preload() 
    {
        // Background images.
        this.load.image('Nebula', './assets/Nebula.png');
        this.load.audio('out', './assets/out.ogg');
    }

    create() 
    {
        this.Audio = this.sound.add("out", 
        {
            volume: .05,
            loop: true
        });
        
        // play Music
        this.Audio.play();

        // Add background
        let background = this.add.image(225,225,'Nebula');
        background.setScale(.5);

        // The Title settings.
        let Score = this.add.rectangle(225, 190, 280, 60, 0x2600F9, 0.3);
        let Crazy = this.add.text(225, 190, "*** High Scores ***", 
        {
            fontFamily: 'Zen',
            fill : '#ec008c',
            stroke : "blue",
            fontSize : '50px',
            fontWeight : 'bold',
            strokeThickness : 6,
            color: 'green'

        }).setOrigin(0.5);
        
        // Text for the high score table
        this.scoresText = this.add.text(225, 440, "", 
        {
            align: 'right',
            fontFamily: 'Zen',
            fontSize : '35px',
            fontWeight : 'bold',
            strokeThickness : 1,
        }).setOrigin(.5);   

        // Run our database query to get scores
        this.getAllScores();

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

    }

    async getAllScores() 
    {
        let snap = await this.scoreTable.get();
        snap.forEach(
            (docSnap) => 
            {
                const data = docSnap.data();
                const { name, score } = data;
                let Menu = this.add.text(225, 270, "****************************",
                {
                    fontFamily: 'Zen',
                    fill : '#ec008c',
                    stroke : "blue",
                    fontSize : '30px',
                    fontWeight : 'bold',
                    strokeThickness : 6,
                    color: 'green'
                }).setOrigin(0.5);
                
                let scoreString = `${score}`.padStart(5, "0");
                this.scoresText.text += `${name}...  ${scoreString}\n`;
            
                let bottom = this.add.text(225, 590, "****************************",
                {
                    fontFamily: 'Zen',
                    fill : '#ec008c',
                    stroke : "blue",
                    fontSize : '30px',
                    fontWeight : 'bold',
                    strokeThickness : 6,
                    color: 'green'
                }).setOrigin(0.5);
                
            
            }
        );
    }

}