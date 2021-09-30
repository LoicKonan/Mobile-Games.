class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
        this.loadingBar = null;
        this.loadingTxt = null;
        this.percentage = 0;
        this.fileLoading = "";
    }

    preload() {
        // Create the loading bar
        this.loadingBar = this.add.rectangle(225, 400, 420, 60, 0xAAAAAA);
        this.loadingTxt = this.add.text(225,400, "0%", {
            fontSize: '24px',
            color: 'white',
            align: 'center'
        });
        this.loadingTxt.setOrigin(0.5);
        // Load a bunch of assets
        this.load.image('square', './assets/square.png');
        // for (let i = 0; i < 400; i++) {
        //     this.load.image(`square-${i}`, './assets/square.png');
        // }
        this.load.html('tower-menu', './assets/TowerMenu.html');
        // Loading events listeners
        this.load.on('progress', (percent) => {
            this.loadingBar.setScale(percent, 1);
            this.percentage = Math.floor(percent * 100);
            this.updateText();
        });
        this.load.on('fileprogress', (data) => {
            // this.fileLoading = data.src;
            this.fileLoading = data.key;
            this.updateText();
        });
        this.load.on('complete', (data) => {
            this.scene.start('TitleScene');
        });
    }

    updateText(){
        this.loadingTxt.setText(`${this.percentage}%\n${this.fileLoading}`);
    }

}