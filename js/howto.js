class HowTo extends Phaser.Scene {
  constructor() {
    super({ key: "HowTo" });
  }

  preload() {
    //carregar assets
    this.load.image("ceu", "assets/ceu.jpg");
  }

  create() {
    //adicionar background
    let bg = this.add.image(0, 0, "ceu").setOrigin(0, 0);
    bg.setDisplaySize(this.scale.width, this.scale.height);

    //adicionar texto explicativo do jogo
    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 100, "Como jogar:", {
        fontSize: "40px",
        fontFamily: "Pixelify Sans",
        fill: "#000000",
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        "O objetivo do jogo é coletar as energias e armazená-las no baú.\nO jogador é movimentado através das setas do teclado! \nEvite os inimigos para não perder o jogo!",
        {
          fontSize: "20px",
          fontFamily: "Pixelify Sans",
          fill: "#000000",
          fontWeight: "bold",
          align: "center",
          wordWrap: { width: this.scale.width - 100 },
        }
      )
      .setOrigin(0.5);

    //adicionar botão para voltar ao menu principal
    let button = this.add
      .rectangle(
        this.scale.width / 2,
        this.scale.height - 100,
        200,
        50,
        0xff0000
      )
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("Home");
      });

    //adicionar texto ao botao
    this.add
      .text(this.scale.width / 2, this.scale.height - 100, "Voltar", {
        fontSize: "24px",
        fontFamily: "Pixelify Sans",
        fill: "#FFFFFF",
      })
      .setOrigin(0.5);

    button.on("pointerover", () => button.setFillStyle(0xff5555));
    button.on("pointerout", () => button.setFillStyle(0xff0000));
  }
}
