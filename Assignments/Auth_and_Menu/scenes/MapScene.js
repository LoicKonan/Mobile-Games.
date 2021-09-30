class MapScene extends Phaser.Scene {
    constructor() {
        super("MapScene");
        // Handle signals between scenes
        this.signals = SignalManager.get();
        // Name of the level, defined in config
        this.name = "";
        // Path as defined in the config
        this.path = [];
        // Game Objects
        // Object representing the path in game
        this.pathObj = null;
        // Button to start the round
        this.roundBtn = null;
        // Finish line
        this.finish = null;
        // Health bar
        this.healthBar = null;
        // Gameplay variables
        // Round counter
        this.round = 1;
        // How many enemies have been spawned this round
        this.rndSpawns = 0;
        // Health for the player
        this.maxHealth = 15;
        this.health = this.maxHealth;
        // Timers
        // Timer to control enemy spawn
        this.spawner = null;
    }

    init(data) {
        // Read data from config
        this.name = data.name;
        this.path = data.path;
    }

    create() {
        // Create a path object which starts with a single point (the first one)
        this.pathObj = new Phaser.Curves.Path(this.path[0].x, this.path[0].y);
        // For every point after the first (1 to length)
        for (let i = 1; i < this.path.length; i++) {
            // Create a line on the path connecting to the given point
            this.pathObj.lineTo(this.path[i].x, this.path[i].y);
        }
        // Add button for tower menu
        this.createMenuButtons();
        // Draw path (for testing)
        this.drawPath();
        // Button to start the round
        this.roundBtn = this.add.circle(410, 760, 25, 0x00FF00);
        this.roundBtn.setInteractive();
        this.roundBtn.on('pointerdown', () => {
            this.startRound();
        });
        // Create a object at the end of the track
        const lastPoint = this.path[this.path.length-1];
        this.finish = this.add.circle(lastPoint.x, lastPoint.y, 10, 0xFF0000);
        this.finish = this.physics.add.existing(this.finish);
        // Create a health bar
        this.healthBar = this.add.rectangle(225, 25, 400, 15, 0x00FF00, 0.6);
    }

    update(){
        this.healthBar.setScale(this.health / this.maxHealth, 1);
        if(this.health < 1){
            this.die();
        }
    }

    createMenuButtons() {
        // Create a button to open tower menu
        let towerBtn = this.add.rectangle(400, 50, 40, 40, 0x0000FF);
        towerBtn.setInteractive();
        towerBtn.on('pointerdown', () => {
            // Disable this button
            towerBtn.setAlpha(0);
            // Launch the menu
            this.scene.launch("TowerScene");
        });
        // Listen for when the tower menu closes
        this.signals.on('tower-menu-closed', (data) => {
            console.log(data);
            towerBtn.setAlpha(1);
        });
    }

    die(){
        clearInterval(this.spawner);
        this.health = this.maxHealth;
        this.scene.start('TitleScene');
    }

    drawPath() {
        // Create a graphics object for drawing lines or shapes
        let graphics = this.add.graphics();
        // Defines the styling of the graphics object (color, etc)
        graphics.lineStyle(3, 0x00FF00, 0.5);
        // Tell the path to draw itself using the graphics object
        this.pathObj.draw(graphics);
    }

    startRound() {
        const length = this.pathObj.getLength();
        const speedS = 600;
        const speedMS = speedS / 1000;
        this.spawner = setInterval(() => {
            // Keep spawning
            if (this.rndSpawns < this.round * 10) {
                // Create the path follower
                let sqr = this.add.follower(this.pathObj, this.path[0].x, this.path[0].y, 'square');
                // Add the follower to the physics system
                sqr = this.physics.add.existing(sqr);
                // Scale them down
                sqr.setScale(0.5);
                // Begin following the path
                sqr.startFollow({
                    duration: length / speedMS,
                    rotateToPath: true
                });
                // Increase the counter for number of enemies spawned
                this.rndSpawns++;
                // Create a collider between the follower and the end of the path
                this.physics.add.overlap(sqr, this.finish, ()=>{
                    console.log("Enemy made it to the end!");
                    sqr.destroy();
                    this.health--;
                });
            }
            // Round is over
            else {
                this.rndSpawns = 0;
                this.round++;
                clearInterval(this.spawner);
            }
        }, 1000);
    }
}