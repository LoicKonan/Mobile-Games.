/*****************************************************************************
*
*    Author:           Loic Konan
*    Email:            loickonan.lk@gmail.com
*    Label:            Game 2
*    Title:            Space Blaster
*    Course:           CMPS 4443
*    Semester:         Summer 2021
*    Description:
*
*
*       The goal of this game is to destroy 
*       as many alien ships as you can and move to the next levels.
*       
*       1 # Added New Player ship. 
*       2 # Added a more descriptive game Title.
*       3 # Added sound for the intro, while you enter your name. 
*       4 # Added New background picture to the intro of the game.
*       6 # Added a background Music while playing the game.
*       7 # Added a nice background picture.
*       8 # Added a new kool explosion.
*       9 # Added New Levels.
*      10 # Use different type of font to make the game.
*      11 # New explosion sound when you get kill
*      12 # Added a Menu for credits and High scores.
*      13 # Added Go back button to help the user to Navigates.
*      14 # Added sound when each button is press. 
#      15 # Added Multiple enemies and enemies speed. 
*      16 # Cool intro of Game screen. 
*
*
*    Files:
*         MainScene.js
*         Game.js
*         AI.js
*         Phaser.js
*         TitleScene.js
*         index.html
*         VirtualJoystick.js
*         firebaseConfig.js  
*
*    Usage:
*           - Click the left Mouse to Kill.
*           - Joystick to move
*
******************************************************************************/

class MainScene extends Phaser.Scene 
{
    constructor() 
    {
        super("MainScene");

        this.Audio = null;

        // Username the player entered
        this.username = "";

        // Variable to mark if the game is over
        this.gameOver = false;

        // Score counter
        this.score = 0;
        this.scoreText = null;

        // Firebase stuff�‍♂️
        this.database = firebase.firestore();
        this.scoreTable = this.database.collection('scores');

        // Player object
        this.player = null;

        this.playerLevel = 1;
        this.alive = true;

        // Progression Variables
        this.stage = 1;
        this.killCount = 0;
        this.goal = 20;

        this.lifeText = null;
        this.PlayerLEVEL = null;

        this.plySpd = 400;
        this.plyBullets = [];

        // Joystick object
        this.joystick = null;
        this.controlsEnabled = false;

        // Shooting variables
        this.shooting = false;          // Is the player shooting?

        this.lastShot = 0;              // Time of last shot (timestamp, ms)
        this.shotTimeout = 250;         // Time between shots (ms)
        
        // Enemy objects
        this.enemies = [];
        this.enemyBullets = [];

        // Timing of enemy spawns
        this.lastSpawned = 0;           // Time of last spawn (timestamp, ms)
        this.spawnTime = 2000;          // Time between spawns at start (ms)
        this.minSpawnTime = 2000;         // Smallest spawnTime can get

        // Colliders
        this.bulletEnemyCollider = null;
        this.bulletPlayerCollider = null;
        this.enemyPlayerCollider = null;
    }

    init(data) 
    {
        // Get the username from the title screen
        this.username = data.username;
        if (this.username == "") 
        {
            // No username was provided
            this.username = "N/A";
        }
    }

    preload() 
    {
        // Background images.
        this.load.image('background', './assets/background.png');
        this.load.image('blue', './assets/Blue.png');
        this.load.image('aqua', './assets/Aqua.png');
        this.load.image('4', './assets/4.png');
        this.load.image('god', './assets/god.png');

        // Audio.        
        this.load.audio('sound', './assets/Audio/sound.mp3');
        this.load.audio('Hit', './assets/Hit.wav');
        this.load.audio('cannon', './assets/cannon.mp3');
        this.load.audio('Backsound', './assets/Backsound.wav');

        // Spritesheets must also include width and height of frames when loading
        this.load.spritesheet('explosion', './assets/explosion-1.png', 
        {
            frameWidth: 32,
            frameHeight: 32
        });

        // Spritesheets must also include width and height of frames when loading
        this.load.spritesheet('explosion2', './assets/Explosion.png', 
        {
            frameWidth: 32,
            frameHeight: 32
        });

        // Load the spaceship
        this.load.image('player', './assets/ship1.png');

        // Load the lasers
        this.load.spritesheet('lasers', './assets/laser-bolts.png', 
        {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet('enemy-m', './assets/ship.png', 
        {
            frameWidth: 16,
            frameHeight: 24,
        });

        
        this.load.spritesheet('enemy1', './assets/enemy-medium.png', 
        {
            frameWidth: 32,
            frameHeight: 16,
        });

        this.load.spritesheet('enemy2', './assets/enemy-big.png', 
        {
            frameWidth: 32,
            frameHeight: 32,
        });

        this.load.spritesheet('enemy3', './assets/one.png', 
        {
            frameWidth: 150,
            frameHeight: 150,
        });

        this.load.image('enemy4', './assets/zero.png');

        this.load.image('enemy5', './assets/enemy5.png');
    }

    create() 
    {
        this.Audio = this.sound.add("sound", 
        {
            volume: .05,
            loop: true
        });
        
        // play Music
        this.Audio.play();

        this.backgroundLayers = [];
        // Setup background stuff

        // Back Parallax
        this.backgroundLayers[0] = this.add.tileSprite(0, 0, 272, 160, "aqua");
        this.backgroundLayers[0].setDepth(-1);
        this.backgroundLayers[0].setOrigin(0);
        this.backgroundLayers[0].setScale(.51);

        // Middle Parallax
        this.backgroundLayers[1] = this.add.tileSprite(0, 0, 0, 0, "blue");
        this.backgroundLayers[1].setDepth(-1);
        this.backgroundLayers[1].setOrigin(0);
        this.backgroundLayers[1].setScale(7);


        // Front Parallax
        this.backgroundLayers[2] = this.add.tileSprite(0, 0, 0, 0, "4");
        this.backgroundLayers[2].setDepth(.91);
        this.backgroundLayers[2].setOrigin(0);
        this.backgroundLayers[2].setScale(5);

        // Light Parallax
        this.backgroundLayers[3] = this.add.tileSprite(0, 0, 0, 0, "god");
        this.backgroundLayers[3].setDepth(-1);
        this.backgroundLayers[3].setOrigin(0);
        this.backgroundLayers[3].setScale(.5);
        this.backgroundLayers[3].setAlpha(.5)

        // Light Parallax
        this.backgroundLayers[4] = this.add.tileSprite(0, 0, 0, 0, "background");
        this.backgroundLayers[4].setDepth(-.1);
        this.backgroundLayers[4].setOrigin(0);
        this.backgroundLayers[4].setScale(.51);
        this.backgroundLayers[4].setAlpha(.35)

        // Create the text for keeping track of the Level
        this.PlayerLEVEL = this.add.text(40, 50, `Level: ${this.playerLevel}`, 
        {
            fontFamily: 'Trebuchet MS',
            fill : '#ec008c',
            stroke : "blue",
            fontSize : '30px',
            fontWeight : 'bold',
            strokeThickness : 6,
            color: 'green'
        }).setOrigin(0,0.5);

        // Create the text for keeping track of score
        this.scoreText = this.add.text(300, 50, `Kill: ${this.score}`, 
        {
            fontFamily: 'Trebuchet MS',
            fill : '#ec008c',
            stroke : "blue",
            fontSize : '30px',
            fontWeight : 'bold',
            strokeThickness : 6,
            color: 'green'
        }).setOrigin(0,0.5);

        // Create player object
        this.createPlayer();

        // A virtual joystick for moving the player
        this.joystick = new VirtualJoystick(this, 110, 690, 70);

        // Set up the shooting controls
        this.createShootingControls();

        // Enable control of the player ship
        this.controlsEnabled = true;
        
    }

    update() 
    {
        // Update the score text
        this.scoreText.setText(`Kills: ${this.score}`);
        this.PlayerLEVEL.setText(`Level: ${this.playerLevel}`);

        // Control the player
        this.handlePlayerControls();

        // Check for spawning enemies
        if (this.now() >= this.lastSpawned + this.spawnTime) 
        {
            this.spawnEnemy();
        }
        
        // Control the enemy ships
        for (let enemy of this.enemies) 
        {
            enemy.ai.update();
        }

        // Control the enemy ships
        for (let enemy1 of this.enemies) 
        {
            enemy1.ai.update();
        }

                
        // Control the enemy ships
        for (let enemy2 of this.enemies) 
        {
            enemy2.ai.update();
        }

         // Control the enemy ships
         for (let enemy3 of this.enemies) 
         {
             enemy3.ai.update();
         }
        
         // Control the enemy ships
        for (let enemy4 of this.enemies) 
        {
            enemy4.ai.update();
        }

         // Control the enemy ships
         for (let enemy5 of this.enemies) 
         {
             enemy5.ai.update();
         }

        // End the game if necessary
        if (this.gameOver) 
        {
            this.onGameOver();
        }
   
        let generalSpeed = 2;
        this.backgroundLayers[0].tilePositionY -= generalSpeed*1;
        this.backgroundLayers[1].tilePositionY -= generalSpeed * 1;
        this.backgroundLayers[2].tilePositionY -= generalSpeed/3;
        this.backgroundLayers[3].tilePositionY -= generalSpeed*1 ;
        this.backgroundLayers[4].tilePositionY -= generalSpeed*2;
    }

    createPlayer() 
    {
        this.player = this.physics.add.sprite(225, 700, 'player');
        this.player.setScale(1);
        
        // Create aniamtions for the player
        this.generatePlayerAnimations();
        
        // Collide the player with world bounds
        this.player.setCollideWorldBounds(true);
        
        // Start the player in idle
        // this.player.anims.play('idle');
    }

    createShootingControls() 
    {
        // Handle shooting on desktop using spacebar
        this.input.keyboard.on('keydown-SPACE', () => 
        {
            this.shooting = true;
            this.sound.play('Hit', 
            {
                volume: 0.1
            });
        });
        
        this.input.keyboard.on('keyup-SPACE', () => 
        {
            this.shooting = false;
        });

        // Create a button to shoot with on mobile
        let shootButton = this.add.circle(360, 690, 70, 0xFF0000, 0.4);
        shootButton.setInteractive();

        // When the player hits the button, start shooting
        shootButton.on('pointerdown', () => 
        {
            this.shooting = true;
            this.sound.play('Hit', 
            {
                volume: 0.1
            });
        });

        // If the player stops clicking, or moves the pointer out of the
        // button, stop shooting
        shootButton.on('pointerup', () => 
        {
            this.shooting = false;
        });
        shootButton.on('pointerout', () => 
        {
            this.shooting = false;
        });
    }

    createEnemy(x, y) 
    {
        let enemy = this.physics.add.sprite(x, y, 'enemy-m');
        enemy.setScale(2);

        // Idle animation
        enemy.anims.create
        (
        {
            key: 'idle',
            frames: this.anims.generateFrameNumbers('enemy-m', 
            {
                start: 0,
                end: 1
            }),
            frameRate: 8,
            repeat: -1
        });

        // Explosion animation
        enemy.anims.create
        (
            {
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion2', 
            {
                start: 0,
                end: 7
            }),
            frameRate: 8
            }
        );

        // At the end of explosion, die.
        enemy.on('animationcomplete-explode', () => 
        {
            enemy.destroy();
        });

        // Play idle by default
        enemy.anims.play('idle');

        // Attach an AI controller to this object
        enemy.ai = new EnemyM(this, enemy);

        // Add the bullet to the list of enemies
        this.enemies.push(enemy);
        this.setCollideBulletEnemy();

        // Rebuild the enemy and player collider
        this.setCollidePlayerEnemy();
    }


    createEnemy2(x, y) 
    {
        let enemy2 = this.physics.add.sprite(x, y, 'enemy2');
        enemy2.setScale(2);

        // Idle animation
        enemy2.anims.create
        (
        {
            key: 'idle',
            frames: this.anims.generateFrameNumbers('enemy2', 
            {
                start: 0,
                end: 1
            }),
            frameRate: 8,
            repeat: -1
        });

        // Explosion animation
        enemy2.anims.create
        (
            {
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', 
            {
                start: 0,
                end: 7
            }),
            frameRate: 8
            }
        );

        // At the end of explosion, die.
        enemy2.on('animationcomplete-explode', () => 
        {
            enemy2.destroy();
        });

        // Play idle by default
        enemy2.anims.play('idle');

        // Attach an AI controller to this object
        enemy2.ai = new EnemyM(this, enemy2);

        // Add the bullet to the list of enemies
        this.enemies.push(enemy2);
        this.setCollideBulletEnemy();

        // Rebuild the enemy and player collider
        this.setCollidePlayerEnemy();
    }

    createEnemy1(x, y) 
    {
        let enemy1 = this.physics.add.sprite(x, y, 'enemy1');
        enemy1.setScale(2);

        // Idle animation
        enemy1.anims.create
        (
        {
            key: 'idle',
            frames: this.anims.generateFrameNumbers('enemy1', 
            {
                start: 0,
                end: 1
            }),
            frameRate: 8,
            repeat: -1
        });

        // Explosion animation
        enemy1.anims.create
        (
            {
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', 
            {
                start: 0,
                end: 7
            }),
            frameRate: 8
            }
        );

        // At the end of explosion, die.
        enemy1.on('animationcomplete-explode', () => 
        {
            enemy1.destroy();
        });

        // Play idle by default
        enemy1.anims.play('idle');

        // Attach an AI controller to this object
        enemy1.ai = new EnemyM(this, enemy1);

        // Add the bullet to the list of enemies
        this.enemies.push(enemy1);
        this.setCollideBulletEnemy();

        // Rebuild the enemy and player collider
        this.setCollidePlayerEnemy();
    }


    createEnemy3(x, y) 
    {
        let enemy3 = this.physics.add.sprite(x, y, 'enemy3');
        enemy3.setScale(1.8);

        // Idle animation
        enemy3.anims.create
        (
        {
            key: 'idle',
            frames: this.anims.generateFrameNumbers('enemy3', 
            {
                start: 0,
                end: 3
            }),
            frameRate: 8,
            repeat: -1
        });

        // Explosion animation
        enemy3.anims.create
        (
            {
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', 
            {
                start: 0,
                end: 7
            }),
            frameRate: 8
            }
        );

        // At the end of explosion, die.
        enemy3.on('animationcomplete-explode', () => 
        {
            enemy3.destroy();
        });

        // Play idle by default
        enemy3.anims.play('idle');

        // Attach an AI controller to this object
        enemy3.ai = new EnemyM(this, enemy3);

        // Add the bullet to the list of enemies
        this.enemies.push(enemy3);
        this.setCollideBulletEnemy();

        // Rebuild the enemy and player collider
        this.setCollidePlayerEnemy();
    }


    createEnemy4(x, y) 
    {
        let enemy4 = this.physics.add.sprite(x, y, 'enemy4');
        enemy4.setScale(.28);

        // Explosion animation
        enemy4.anims.create
        (
            {
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion2', 
            {
                start: 0,
                end: 7
            }),
            frameRate: 8
            }
        );

        // At the end of explosion, die.
        enemy4.on('animationcomplete-explode', () => 
        {
            enemy4.destroy();
        });

        // Play idle by default
        // enemy4.anims.play('idle');

        // Attach an AI controller to this object
        enemy4.ai = new EnemyM(this, enemy4);

        // Add the bullet to the list of enemies
        this.enemies.push(enemy4);
        this.setCollideBulletEnemy();

        // Rebuild the enemy and player collider
        this.setCollidePlayerEnemy();
    }

    createEnemy5(x, y) 
    {
        let enemy5 = this.physics.add.sprite(x, y, 'enemy5');
        enemy5.setScale(.1);

        // Explosion animation
        enemy5.anims.create
        (
            {
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion2', 
            {
                start: 0,
                end: 7
            }),
            frameRate: 8
            }
        );

        // At the end of explosion, die.
        enemy5.on('animationcomplete-explode', () => 
        {
            enemy5.destroy();
        });

        // Play idle by default
        // enemy5.anims.play('idle');

        // Attach an AI controller to this object
        enemy5.ai = new EnemyM(this, enemy5);

        // Add the bullet to the list of enemies
        this.enemies.push(enemy5);
        this.setCollideBulletEnemy();

        // Rebuild the enemy and player collider
        this.setCollidePlayerEnemy();
    }

    createEnemyBullet(x, y, flipped) 
    {
        // Creat the sprite object
        let bullet = this.physics.add.sprite(x, y, 'lasers');
        bullet.setScale(4);

        // Create the animation
        bullet.anims.create
        (
            {
            // Name of the animation
            key: 'bullet',

            // Generate all frame numbers between 0 and 7
            frames: this.anims.generateFrameNumbers('lasers', 
            {
                start: 2,
                end: 3
            }),

            // Animation should be slower than base game framerate
            frameRate: 8,
            repeat: -1
        });

        // Run the animation
        bullet.anims.play('bullet');

        // Set the velocity
        if (flipped) 
        {
            bullet.setVelocity(0, 600);
            bullet.setFlipY(true);
        } else 
        {
            bullet.setVelocity(0, -600);
        }
        bullet.setCollideWorldBounds(true);

        // Turning this on will allow you to listen to the 'worldbounds' event
        bullet.body.onWorldBounds = true;

        // 'worldbounds' event listener
        bullet.body.world.on('worldbounds', (body) => 
        {
            // Check if the body's game object is the sprite you are listening for
            if (body.gameObject === bullet) 
            {
                // Destroy the bullet
                bullet.destroy();
            }
        });

        // Add the bullet to the list of bullets
        this.enemyBullets.push(bullet);
        this.setCollideBulletPlayer();
    }

    createPlayerBullet(x, y, flipped) 
    {
        // Creat the sprite object
        let bullet = this.physics.add.sprite(x, y, 'lasers');
        bullet.setScale(4);

        // Create the animation
        bullet.anims.create
        (
            {
            // Name of the animation
            key: 'bullet',

            // Generate all frame numbers between 0 and 7
            frames: this.anims.generateFrameNumbers('lasers', 
            {
                start: 2,
                end: 3
            }),

            // Animation should be slower than base game framerate
            frameRate: 8,
            repeat: -1
        });

        // Run the animation
        bullet.anims.play('bullet');

        // Set the velocity
        if (flipped) 
        {
            bullet.setVelocity(0, 600);
            bullet.setFlipY(true);
        } 
        else 
        {
            bullet.setVelocity(0, -600);
        }
        bullet.setCollideWorldBounds(true);

        // Turning this on will allow you to listen to the 'worldbounds' event
        bullet.body.onWorldBounds = true;

        // 'worldbounds' event listener
        bullet.body.world.on('worldbounds', (body) => 
        {
            // Check if the body's game object is the sprite you are listening for
            if (body.gameObject === bullet) 
            {
                // Destroy the bullet
                bullet.destroy();
            }
        });

        // Add the bullet to the list of bullets
        this.plyBullets.push(bullet);
        this.setCollideBulletEnemy();
    }

    destroyPlayer() 
    {
        this.sound.play('cannon', 
        {
            volume: 0.2
        })
        // Blow up the player
        this.player.anims.play('explode');
        

        // Prevent multiple collision by removing player physics body
        this.player.body.destroy();

        // Disable the player from further controlling the ship
        this.controlsEnabled = false;
    }

    generatePlayerAnimations() 
    {
        // Explosion animation
        this.player.anims.create
        (
            {
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion2', 
            {
                start: 0,
                end: 1
            }),
            frameRate: 8
        });

        // After the player is done exploding, we should have a callback
        this.player.on('animationcomplete-explode', () => 
        {
            this.onPlayerExploded();
        });
    }

    handlePlayerControls() 
    {
        if (this.player && this.controlsEnabled) 
        {
            // Handle player movement
            this.player.setVelocity(this.joystick.joyX() * this.plySpd, 0);

            // If the player is holding the button, shoot
            if (this.shooting && this.now() > this.lastShot + this.shotTimeout) 
            {
                this.createPlayerBullet(this.player.x, this.player.y - 80);
                this.lastShot = this.now();
            }
        }
    }

    /**
     * @returns The current time as a ms timestamp
     */
    now() 
    {
        return new Date().getTime();
    }

    /**
     * Runs during update() if the "gameOver" flag has been set.
     * Resets the game.
     */
    onGameOver()
    {
        // Save the score
        this.saveScore();

        // Reset timers for enemy spawn
        this.lastSpawned = 0;
        this.spawnTime = 5000;

        // Destroy all the stuff
        this.player.destroy();
        for (let e of this.enemies) 
        {
            e.destroy();
        }
        for (let b of this.enemyBullets) 
        {
            b.destroy();
        }

        // Stop running updates on enemies
        this.enemies = [];

        // Reset the bullets
        this.enemyBullets = [];

        // Reset game over variable
        this.gameOver = false;

        // Reset score
        this.score = 0;
        
        this.Audio.stop();

        // Restart the game
        this.scene.start('TitleScene');
    }

    onPlayerExploded() 
    {
        // The game will reset immediately when the player is done exploding.
        // Change this if you want multiple lives...
        this.gameOver = true;
    }

    /**
     * Saves the player's score to the firestore database
     */
    async saveScore() 
    {
        let result = await this.scoreTable.add
        (
            {
            name: this.username,
            score: this.score
            }
        );

        if (result) console.log("Score saved successfully!");
        else console.log("Score failed to save!");
    }

    setCollideBulletEnemy() 
    {
        // Destroy any existing colliders
        if (this.bulletEnemyCollider != null) 
        {
            this.bulletEnemyCollider.destroy();
        }

        // Add collision with all existing bullets
        this.bulletEnemyCollider =
            this.physics.add.overlap(this.enemies, this.plyBullets,
                (en, bu) => 
                {
                    // Increase the player's score
                    this.score++;
                    if(this.score % 12 == 0)
                    {
                        // increase levels
                        this.playerLevel++;
                    }

                    // Destroy the bullet
                    bu.destroy();

                    // Make the enemy explode
                    en.anims.play('explode');

                    // Make the enemy "float" down
                    en.setVelocity(0, this.plySpd / 2);

                    // Remove the bullet from the list of bullets
                    this.plyBullets = this.plyBullets.filter((b) => 
                    {
                        return b !== bu;
                    });

                    // Remove the enemy from the list of enemies
                    this.enemies = this.enemies.filter((e) => 
                    {
                        return e !== en;
                    });
                });
    }

    setCollideBulletPlayer() 
    {
        // Destroy any existing colliders
        if (this.bulletPlayerCollider != null) 
        {
            this.bulletPlayerCollider.destroy();
        }

        // Add collision with player to all bullets
        this.bulletPlayerCollider =
            this.physics.add.overlap(this.enemyBullets, this.player,
                (bullet, player) => 
                {
                    // Destroy the bullet
                    bullet.destroy();

                    // Remove the bullet from the list of bullets
                    this.enemyBullets = this.enemyBullets.filter((b) => 
                    {
                        return b !== bullet;
                    });

                    // Start to destroy the player
                    this.destroyPlayer();
                }
            );
    }

    setCollidePlayerEnemy() 
    {
        // Destroy any existing collision handler
        if (this.enemyPlayerCollider != null) 
        {
            this.enemyPlayerCollider.destroy();
        }

        // Create a new collision handler
        this.enemyPlayerCollider =
            this.physics.add.overlap(this.enemies, this.player,
                (en, ply) => 
                {
                    // Explode and enemy
                    en.anims.play('explode');

                    // Set the enemy velocity to "float" down
                    en.setVelocity(0, this.plySpd / 2);

                    // Remove the enemy from the list of enemies
                    this.enemies = this.enemies.filter((e) => 
                    {
                        return e !== en;
                    });

                    // Destroy the player
                    this.destroyPlayer();
                }
            );
    }

    /**
     * Spawns an enemy at a random location and sets spawn timer.
     * Different from createEnemy(), which only creates an enemy.
     */
    spawnEnemy() 
    {
        // Pick a random x coordinate without set bounds
        const x = (Math.random() * 375) + 50;
        let key = Math.random() * 85;
    
        // Creates the  enemy position
        if (key < 10) 
        {
            this.createEnemy(x-2, 0, EnemyM, 'enemy-m');
        }

        else if (key > 10 && key < 20) 
        {
            this.createEnemy1(x-5, 50, EnemyM, 'enemy1');
        }

        else if (key > 20 && key < 35 ) 
        {
            this.createEnemy4(x, 2, EnemyM, 'enemy4');
        }

        else if (key > 35  && key < 50) 
        {
            this.createEnemy3(x-3, -8, EnemyM, 'enemy3');
        }

        else if (key > 55  && key < 70 )
        {
            this.createEnemy2(x-4, -20, EnemyM, 'enemy2');
       }

        else if (key > 73 && key < 80)
        {
            this.createEnemy5(x-5, -30, EnemyM, 'enemy5');
        }

        // Set the spawn timer and time between spawns
        this.lastSpawned = this.now();
        this.spawnTime *= .1;

        // Puts a hard limit on how small spawn time can get
        if (this.spawnTime < this.minSpawnTime) 
        {
            this.spawnTime = this.minSpawnTime;
        }
    }
}