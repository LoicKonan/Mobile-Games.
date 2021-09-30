/** @type {Phaser.Types.Core.GameConfig} */
const config = {
    parent: 'game',
    width: 450,
    height: 800,
    scale: {
        mode: Phaser.Scale.ScaleModes.FIT
    },
    fps: {
        target: 30,
        min: 5
    },
    pixelArt: true,
    dom: {
        createContainer: true
    },
    input: {
        activePointers: 3
    },
    scene: [
        MainScene
    ]
}
new Phaser.Game(config);