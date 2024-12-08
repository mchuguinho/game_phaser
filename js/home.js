class Home extends Phaser.Scene {
  constructor() {
    super({ key: "Home" });
  }

  preload() {
    //carregar asset
    this.load.image("ceu", "assets/ceu.jpg");
  }

  create() {
    //adicionar background
    let bg = this.add.image(0, 0, "ceu").setOrigin(0, 0);
    bg.setDisplaySize(this.scale.width, this.scale.height);

    //adicionar texto do título
    this.add
      .text(this.scale.width / 2, 150, "Energizer", {
        fontSize: "50px",
        fontFamily: "Pixelify Sans",
        fill: "#000000",
        fontWeight: "bolder",
      })
      .setOrigin(0.5);

    //adicionar botão de jogar
    const playButtonBg = this.add
      .rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        220,
        40,
        0xff0000,
        0.8
      )
      .setOrigin(0.5);

    //adicionar texto do botão de jogar
    const playButton = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Começar a jogar", {
        fontSize: "24px",
        fill: "#FFFFFF",
        fontFamily: "Pixelify Sans",
      })
      .setOrigin(0.5)
      .setInteractive();

    //altera cor do botao e cursor ao fazer hover
    playButton.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
      playButtonBg.setFillStyle(0xff5555);
    });

    //quando tira hover volta ao cursor e cor de botao default
    playButton.on("pointerout", () => {
      this.input.setDefaultCursor("default");
      playButtonBg.setFillStyle(0xff0000);
    });

    //quando clica no botao inicia a cena de jogo
    playButton.on("pointerdown", () => {
      this.scene.start("WorldScene");
    });

    //adicionar botão de como jogar
    const howToButtonBg = this.add
      .rectangle(
        this.scale.width / 2,
        this.scale.height / 2 + 60,
        220,
        40,
        0xff0000,
        0.8
      )
      .setOrigin(0.5);

    //adicionar texto do botão de como jogar
    const howToButton = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 60, "Como jogar", {
        fontSize: "24px",
        fill: "#FFFFFF",
        fontFamily: "Pixelify Sans",
      })
      .setOrigin(0.5)
      .setInteractive();

    //altera cor do botao e cursor ao fazer hover
    howToButton.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
      howToButtonBg.setFillStyle(0xff5555);
    });

    //quando tira hover volta ao cursor e cor de botao default
    howToButton.on("pointerout", () => {
      this.input.setDefaultCursor("default");
      howToButtonBg.setFillStyle(0xff0000);
    });

    //quando clica no botão inicia a cena de como jogar
    howToButton.on("pointerdown", () => {
      this.scene.start("HowTo");
    });
  }
}
