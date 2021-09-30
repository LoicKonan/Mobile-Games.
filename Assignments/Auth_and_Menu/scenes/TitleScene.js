class TitleScene extends Phaser.Scene {
    constructor() {
        super("TitleScene");
        this.fire = FireManager.get();
        this.googleBtn = null;
        this.soBtn = null;
        this.database = firebase.firestore();
        this.userTable = this.database.collection('users');
    }

    preload() {
        this.load.image('google', './assets/google.png');
    }

    create() {
        // Create start game button
        let startBtn = this.add.rectangle(225, 400, 350, 100, 0x0000FF);
        startBtn.setInteractive();
        // Listener to continue to level select
        startBtn.on('pointerdown', () => {
            this.scene.start("MapScene", game_levels[0]);
        });
        // Create some prompt text
        let text = this.add.text(225, 400, "Tap to play", {
            fontSize: '36px',
            fontFamily: 'Courier New',
            color: 'white'
        });
        text.setOrigin(0.5);
        this.tweens.add({
            targets: [text],
            duration: 1000,
            alpha: 0,
            yoyo: true,
            repeat: -1
        });
        // Create the google button
        this.googleBtn = this.add.image(225, 600, 'google')
            .setScale(1.5)
            .setInteractive()
            .setAlpha(0)
            .on('pointerdown', () => {
                try {
                    this.login();
                }
                catch (e) {
                    console.log(`Failed to sign in: ${e}`);
                }
            });
        // Create a sign out button
        this.soBtn = this.add.rectangle(225, 600, 260, 75, 0x0000FF);
        this.soBtn.setInteractive().setAlpha(0);
        this.soBtn.on('pointerdown', () => {
            this.logout();
        });
    }

    update() {
        if (this.fire.user() != null) {
            this.googleBtn.setAlpha(0);
            this.soBtn.setAlpha(1);
        }
        else {
            this.googleBtn.setAlpha(1);
            this.soBtn.setAlpha(0);
        }
    }

    async login() {
        let user = await this.fire.signInWithGoogle();
        if (user != null) {
            this.userTable.doc(user.uid).set({
                lastLogin: new Date().getTime() / 1000
            });
        }
        console.log(await this.fire.user());
    }

    async logout() {
        await this.fire.signOut();
        console.log(await this.fire.user());
    }
}