class Winner extends Phaser.Scene {
  constructor() {
    super({ key: "Winner" });
  }

  preload() {
    //carregar assets
    this.load.image("ceu", "assets/ceu.jpg");
    this.load.audio("vitoria", "assets/winning.wav");
  }

  init(data) {
    //trazer score final e nº de vidas que sobraram para esta cena
    this.score = data.score;
    this.vidas = data.nvidas;
    this.tempo = data.tempo;
  }

  create() {
    //tocar a musica de vitoria
    this.sound.play("vitoria", { volume: 0.1 });

    //adicionar background
    let bg = this.add.image(0, 0, "ceu").setOrigin(0, 0);
    bg.setDisplaySize(this.scale.width, this.scale.height);

    //adicionar texto de vitória
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 160,
        "Parabéns, armazenaste a energia toda!!",
        {
          fontSize: "30px",
          fontFamily: "tudo",
          fill: "#000000",
          fontWeight: "bold",
        }
      )
      .setOrigin(0.5);

      this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 80,
        "Jogaste durante " + this.tempo + " segundos!",
        {
          fontSize: "30px",
          fontFamily: "tudo",
          fill: "#000000",
          fontWeight: "bold",
        }
      )
      .setOrigin(0.5);

    //adicionar texto com o score e as vidas restantes
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        "Coletaste " +
          this.score +
          " energias e sobraram " +
          this.vidas +
          " vida(s)!",
        {
          fontSize: "30px",
          fontFamily: "tudo",
          fill: "#000000",
          fontWeight: "bold",
        }
      )
      .setOrigin(0.5);

    //criar um botao para voltar ao menu principal
    const goBackBg = this.add
      .rectangle(
        this.scale.width / 2, //posicao em x
        this.scale.height / 2 + 80, //posicao em y
        300, //largura do botao
        40, //altura do botao
        0xff0000, // cor do botao
        0.8 //opacidade do botao
      )
      .setOrigin(0.5);

    //texto do botao de voltar ao menu principal
    let goBack = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 80,
        "Voltar ao menu principal",
        {
          fontSize: "24px",
          fill: "#FFFFFF",
          fontFamily: "tudo",
        }
      )
      .setOrigin(0.5)
      .setInteractive();

    //altera cor do botao e cursor ao fazer hover
    goBack.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
      goBackBg.setFillStyle(0xff5555);
    });

    //quando tira hover volta ao cursor e cor de botao default
    goBack.on("pointerout", () => {
      this.input.setDefaultCursor("default");
      goBackBg.setFillStyle(0xff0000);
    });

    //retornar ao home ao clicar
    goBack.on("pointerdown", () => {
      this.scene.start("Home");
    });
  }
}
