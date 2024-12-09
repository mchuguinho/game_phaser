class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: "WorldScene" });
  }

  preload() {
    //carregar os assets
    this.load.image("tiles", "assets/background.jpg");
    this.load.tilemapTiledJSON("map", "assets/map.json", 32, 32);
    this.load.image("energia", "assets/energy.png");
    this.load.spritesheet("player", "assets/Full Sheet Boy.png", {
      frameWidth: 50,
      frameHeight: 50,
    });
    this.load.image("bau", "assets/treasure.png");
    this.load.audio("colecionado", "assets/collectedEnergy.wav");
    this.load.audio("autch", "assets/oof.wav");
    this.load.spritesheet("inimigo", "assets/inimigo.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.gameover = false;
    this.winner = false;

    //texto para mostrar as vidas no jogo
    this.vidasText = this.add
      .text(360, 16, "Vidas: " + this.vidas, {
        fontSize: "18px",
        fontFamily: "tudo",
        fill: "#ffffff",
        backgroundColor: "#ff0000",
        padding: { x: 10, y: 5 },
      })
      .setScrollFactor(0);

    //carregar o mapa
    var mapa = this.make.tilemap({ key: "map" });
    var tiles = mapa.addTilesetImage("background", "tiles");

    //criaçao da layer para o solo
    const solo = mapa.createLayer("solo", tiles, 0, 0);
    //colocar o jogador no jogo
    this.player = this.physics.add.sprite(400, 300, "player", 0);
    //criaçao da layer para o solo
    const obstaculos = mapa.createLayer("obstaculos", tiles, 0, 0);

    //definir colisões com os tiles
    obstaculos.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, obstaculos);

    //chamar função de movimentação do player
    this.criarAnimacoes();

    //adicionar o bau para armazenar energia coletada
    this.bau = this.physics.add.sprite(150, 353, "bau", 0);
    this.bau.setScale(0.65);

    //criar colisao do player com os limites do jogo
    this.player.setCollideWorldBounds(true);
    this.player.anims.play("parado");

    //método para usar as setas do teclado
    this.cursors = this.input.keyboard.createCursorKeys();

    //variaveis a altura e largura do mapa
    this.worldWidth = mapa.widthInPixels;
    this.worldHeight = mapa.heightInPixels;

    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
    //criação da camera
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
    //fazer a camera seguir o jogador
    this.cameras.main.startFollow(this.player);

    this.energias = this.physics.add.group();
    //invocação do metodo para adicionar energias no mapa
    this.adicionarEnergiasAleatorias(8);

    //adicionar overlap para coletar energia
    this.physics.add.overlap(
      this.player,
      this.energias,
      this.coletarEnergia,
      null,
      this
    );

    //adicionar overlap para armzenar energia no bau
    this.physics.add.overlap(
      this.player,
      this.bau,
      this.armazenarEnergia,
      null,
      this
    );

    //definir a pontuação inicial
    this.score = 0;
    this.scoreStored = 0;

    //criar textos para mostrar a pontuação
    this.scoreText = this.add
      .text(16, 16, "Energia coletada: 0", {
        fontSize: "18px",
        fontFamily: "tudo",
        fill: "#ffffff",
        backgroundColor: "#ff0000",
        padding: { x: 10, y: 5 },
      })
      .setScrollFactor(0);

    this.scoreStoredText = this.add
      .text(575, 16, "Energia armazenada: 0", {
        fontSize: "18px",
        fontFamily: "tudo",
        fill: "#ffffff",
        backgroundColor: "#ff0000",
        padding: { x: 10, y: 5 },
      })
      .setScrollFactor(0);

    //criaçao de variavel para as vidas e texto a mostrar quantas vidas tem
    this.vidas = 3;
    this.vidasText = this.add
      .text(360, 16, "Vidas: " + this.vidas, {
        fontSize: "18px",
        fontFamily: "tudo",
        fill: "#ffffff",
        backgroundColor: "#ff0000",
        padding: { x: 10, y: 5 },
      })
      .setScrollFactor(0);

    //invocaçao do metodo das animaçoes do inimigo
    this.criarAnimacoesInimigos();

    //criar inimigos
    this.inimigos = this.physics.add.group();
    for (let i = 0; i < 7; i++) {
      const x = Phaser.Math.Between(100, this.worldWidth - 50);
      const y = Phaser.Math.Between(100, this.worldHeight - 50);
      const inimigo = this.inimigos.create(x, y, "inimigo", 0).setScale(1);
      inimigo.setSize(48, 48);
      inimigo.setOffset(8, 8);
      inimigo.setCollideWorldBounds(true);
      inimigo.setBounce(1);
      inimigo.setVelocity(
        Phaser.Math.Between(-100, 100),
        Phaser.Math.Between(-100, 100)
      );
      inimigo.anims.play("enemy-idle");
    }

    //add colisoes
    this.physics.add.collider(this.inimigos, obstaculos);
    this.physics.add.collider(
      this.player,
      this.inimigos,
      this.atingidoPorInimigo,
      null,
      this
    );

    //alterar direção deles de segundo e meio em segundo e meio
    this.time.addEvent({
      delay: 1500,
      callback: this.moverInimigos,
      callbackScope: this,
      loop: true,
    });

    //criar um timer
    this.timerText = this.add
      .text(20, this.scale.height - 40, "Tempo: 00:00", {
        fontSize: "30px",
        fontFamily: "tudo",
        fill: "#fff",
      })
      .setScrollFactor(0);

    // Inicializa o contador de tempo
    this.startTime = 0;

    // Evento para atualizar o timer
    this.time.addEvent({
      delay: 1000, // Atualiza a cada segundo
      callback: () => {
        this.startTime++;
        const minutes = Math.floor(this.startTime / 60);
        const seconds = this.startTime % 60;
        const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
          seconds
        ).padStart(2, "0")}`;
        console.log("Timer atualizado:", formattedTime);
        this.timerText.setText(`Tempo: ${formattedTime}`);
      },
      callbackScope: this,
      loop: true,
    });

    //adicionar um zoom à camera
    this.cameras.main.setZoom(1);
  }

  update() {
    if (!this.gameover && !this.winner) {
      //comecar com o jogador parado
      this.player.setVelocity(0);

      if (!this.lastDirection) {
        this.lastDirection = "parado";
      }

      //criação da movimentação do player
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-260);
        this.player.anims.play("esquerda", true);
        this.lastDirection = "esquerda";
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(260);
        this.player.anims.play("direita", true);
        this.lastDirection = "direita";
      } else if (this.cursors.up.isDown) {
        this.player.setVelocityY(-260);
        this.player.anims.play("cima", true);
        this.lastDirection = "cima";
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(260);
        this.player.anims.play("baixo", true);
        this.lastDirection = "baixo";
      } else {
        this.player.anims.stop();
        switch (this.lastDirection) {
          case "esquerda":
            this.player.setFrame(8);
            break;
          case "direita":
            this.player.setFrame(4);
            break;
          case "cima":
            this.player.setFrame(16);
            break;
          case "baixo":
            this.player.setFrame(12);
            break;
          default:
            this.player.setFrame(0);
            break;
        }
      }
    } else if (this.gameover) {
      const tempo = this.startTime;
      this.scene.start("GameOver", {tempo: tempo});
    } else {
      const tempo = this.startTime;
      this.scene.start("Winner", {
        tempo: tempo,
        nvidas: this.vidas,
        score: this.scoreStored,
      });
    }
  }

  //animação spritesheet do player
  criarAnimacoes() {
    this.anims.create({
      key: "parado",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "direita",
      frames: this.anims.generateFrameNumbers("player", { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "esquerda",
      frames: this.anims.generateFrameNumbers("player", { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "baixo",
      frames: this.anims.generateFrameNumbers("player", { start: 12, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "cima",
      frames: this.anims.generateFrameNumbers("player", { start: 16, end: 19 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  //animaçao spritesheet inimigos
  criarAnimacoesInimigos() {
    this.anims.create({
      key: "enemy-idle",
      frames: this.anims.generateFrameNumbers("inimigo", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });
  }

  //método para gerar aleatoriamente energias no mapa
  adicionarEnergiasAleatorias(maxEnergias) {
    for (let i = 0; i < maxEnergias; i++) {
      const x = Phaser.Math.Between(100, this.worldWidth - 30);
      const y = Phaser.Math.Between(50, this.worldHeight - 30);
      const energia = this.energias.create(x, y, "energia");
      energia.setScale(0.25);
    }
  }

  //método para quando o player coleta energia
  coletarEnergia(player, energia) {
    this.sound.play("colecionado", { volume: 0.3 });
    energia.destroy();
    this.score++;
    this.scoreText.setText("Energia coletada: " + this.score);
  }

  //método para quando o player armazena energia no bau
  armazenarEnergia(player, bau) {
    this.scoreStored += this.score;
    this.score = 0;
    this.scoreStoredText.setText("Energia guardada: " + this.scoreStored);
    this.scoreText.setText("Energia coletada: " + this.score);
    if (this.scoreStored >= 8) {
      this.winner = true;
    }
  }

  //movimentação dos inimigos
  moverInimigos() {
    this.inimigos.children.iterate((inimigo) => {
      inimigo.setVelocity(
        Phaser.Math.Between(-100, 100),
        Phaser.Math.Between(-100, 100)
      );
    });
  }

  //método para quando o player é atingido por um inimigo
  atingidoPorInimigo(player, inimigo) {
    this.sound.play("autch", { volume: 0.3 });

    const afasta = new Phaser.Math.Vector2(
      player.x - inimigo.x,
      player.y - inimigo.y
    );
    afasta.normalize();

    player.setVelocity(afasta.x * 400, afasta.y * 400);

    this.vidas--;
    this.vidasText.setText("Vidas: " + this.vidas);
    if (this.vidas <= 0) {
      this.gameover = true;
    }
  }
}
