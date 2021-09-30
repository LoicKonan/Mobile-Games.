const config = 
{
    parent: 'game',
    width: 450,
    height: 800,
    scale: 
    {
        mode: Phaser.Scale.ScaleModes.FIT
    },
    fps: 
    {
        target: 30,
        min: 5
    },
    scene: 
    [
        TitleScene,
        MainScene
    ],
    pixelArt: true
}
new Phaser.Game(config);