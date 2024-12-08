var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  autoResize: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [Home, HowTo, WorldScene, GameOver, Winner],
};

var game = new Phaser.Game(config);
