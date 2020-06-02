class SceneMainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMainMenu" });
    }

    preload() { //chargement bouton et son
        this.load.image("sprBtnPlay", "content/sprBtnPlay.png");
        this.load.image("sprBtnPlayHover", "content/sprBtnPlayHover.png");

        this.load.audio("sndBtn", "content/sndBtn.wav");
    }

    create() {
        // ajouter l'objet sfx qui contiendra le son du bouton
        this.sfx = {
            btn: this.sound.add("sndBtn"),
        };

        this.btnPlay = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.5,
            "sprBtnPlay"
        );

        //event pointer
        this.btnPlay.setInteractive();

        this.btnPlay.on("pointerover", function() {
            this.btnPlay.setTexture("sprBtnPlayHover"); 
            this.sfx.btn.play();
        }, this);

        this.btnPlay.on("pointerout", function() {
            this.setTexture("sprBtnPlay");
        });

        this.btnPlay.on("pointerdown", function() {
            this.sfx.btn.play();
        }, this);

        this.btnPlay.on("pointerup", function() {
            this.btnPlay.setTexture("sprBtnPlay");
            this.scene.start("SceneMain");
        }, this);

        this.title = this.add.text(this.game.config.width * 0.5, 128, "BRICK BREAK", {
            fontFamily: 'monospace',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        this.title.setOrigin(0.5);
    }
}