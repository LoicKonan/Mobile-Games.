class BootScene extends Phaser.Scene 
{
    constructor() 
    {
        super("BootScene");
        this.loadingBar = null;
        this.loadingTxt = null;
        //this.percentage = 0;
        this.fileLoading = "";
    }

    preload() 
    {
        // Create the loading bar
        this.loadingBar = this.add.rectangle(225, 400, 420, 60, 0xAD0AF9);
        this.loadingTxt = this.add.text(225,460, " 0%", 
        {
            align: 'center',
            fontFamily: 'Trebuchet MS',
            fill : '#ec008c',
            stroke : "blue",
            fontSize : '30px',
            fontWeight : 'bold',
            strokeThickness : 6
        });
        this.loadingTxt.setOrigin(.5, 0.5);

        // Load a bunch of assets
        this.load.image('6', './assets/6.png');

        for (let i = 0; i < 100; i++) 
        {
            this.load.image(`Loading...${i}`, './assets/6.png');           
        }
        
        // Loading events listeners
        this.load.on('progress', (percent) => 
        {
            this.loadingBar.setScale(percent, 1);
            this.percentage = Math.floor(percent * 100);
            this.updateText();
        });
        
        this.load.on('fileprogress', (data) => 
        {
            // this.fileLoading = data.src;
            this.fileLoading = data.key;
            this.updateText();
        });
        
        this.load.on('complete', (data) => 
        {
            this.scene.start('TitleScene');
        });
    }

    updateText()
    {
        this.loadingTxt.setText(`${this.fileLoading} %`);
    }

}