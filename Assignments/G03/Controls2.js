class Controls2 extends Phaser.Scene 
{
    constructor() 
    {
        super("Controls2");
        this.signals2 = SignalManager.get();
        this.joystick2 = null;

        // Time related stuff
        this.timeLimit = 90000;
        this.startTime = null;
        this.timeText = null;

        // Score counter
        this.score = 0;
        this.scoreText = null;
    }

    // No Assets are loaded because we created them
    preload() { }

    create() 
    {
        // Joystick to control the character
        this.joystick2 = new VirtualJoystick(this, 75, GAME_HEIGHT - 75, 50);

        // Time stuff
        this.startTime = new Date().getTime();


        // Changing the Color of the Timer.
        this.timeText = this.add.text(0, 0, "30.00",
            {
                fontFamily: 'Trebuchet MS',
                fill: '#6FEE3F',
                stroke: "blue",
                fontSize: '30px',
                strokeThickness: 6
            });

        // Game over listener
        this.signals2.on('game-over', () => 
        {
            this.gameOver();
        });

        // Create a button
        let button = this.add.circle(GAME_WIDTH - 75, GAME_HEIGHT - 75, 45, 0xFF0000, 0.4);
        button.setInteractive();
        button.on('pointerdown', () => 
        {
            this.signals2.emit('jump');
            button.setFillStyle(0xFF0000, 0.4);
            button.setScale(0.9);
        });
        button.on('pointerup', () => 
        {
            button.setFillStyle(0xFF0000, 0.4);
            button.setScale(1);
        });

        button.on('pointerout', () => 
        {
            button.setFillStyle(0xFF0000, 0.4);
            button.setScale(1);
        });
    }

    update() 
    {
        // Send the joystick data to the game every update
        this.signals2.emit('joystick2', this.joystick2);

        // Get the time that has passed
        let elapsed = new Date().getTime() - this.startTime;
        
        let remaining = (this.timeLimit - elapsed) / 1000;
        if (remaining > 0) 
        {
            // Update the time text
            this.timeText.setText(remaining.toFixed(2));
        } 
        else 
        {
            // Update the time text
            this.timeText.setText('0.00');

            // Signal when time has run out
            this.signals2.emit('game-over');
        }
    }

    gameOver() 
    {
        this.signals2.off('game-over');
        this.scene.stop();
        this.scene.restart();
    }
}