//on va définir les entités du jeu avec des classes ES6
// class brick
class Brick extends Phaser.GameObjects.Sprite {
        constructor(scene, x, y, color) {
                // Maintenant on va remplir la class Brick
                super(scene, x, y, "sprBrick");
                this.scene = scene;
                this.scene.add.existing(this);// les instances de la classe brick seront automatiquement ajoutées a la pile d'affichage pour le rendu
                this.scene.physics.world.enableBody(this, 0); //On active le corps physic
                this.body.setImmovable(true);// ajout de bricks & immobilité des bricks

                this.setPointValue(1);
                this.setBreakable(true);
                this.color = color;
                /*j'ajoute le 0x devant la valeur quand je définis des nombres héxadécimaux*/
                this.setTint("0x" + rgbToHex(this.color.r, this.color.g, this.color.b));//on va définir la couleur de la brick après avoir converti la couleur RVB en HEX
        }

        setColor(color) {
                this.color = color;
                this.setTint("0x" + rgbToHex(this.color.r, this.color.g, this.color.b));
        }

        setBreakable(bool) {
                this.setData("isBreakable", bool);
        }

        setPointValue(amount) {
                this.setData("pointValue", amount);
        }

        setSoundIndex(index) {
                this.setData("soundIndex", index);
        }
}

// class mur
class Wall extends Phaser.GameObjects.Sprite {
        constructor(scene, x, y, key) {
                super(scene, x, y, key);
                this.scene = scene;
                this.scene.add.existing(this);
                this.scene.physics.world.enableBody(this, 0);
                this.body.setImmovable(true);
                this.setOrigin(0);
                this.setTint(0xbbbbbb);
        }
}

//class ball
class Ball extends Phaser.GameObjects.Sprite {
        constructor(scene, x, y) {
                super(scene, x, y, "sprBall");
                this.scene = scene;
                this.scene.add.existing(this);
                this.scene.physics.world.enableBody(this, 0);

                this.body.setBounce(1);

                this.setData("velocityMultiplier", 5);
        }
}
// class du joueur
class Player extends Phaser.GameObjects.Sprite {
        constructor(scene, x, y) {
                super(scene, x, y, "sprPaddle");
                this.scene = scene;
                this.scene.add.existing(this);
                this.scene.physics.world.enableBody(this, 0);
                this.body.setImmovable(true);

                this.setOrigin(0.5);

                this.setTint("0x" + rgbToHex(160, 160, 255));
        }
}
// On fait deux fonctions pour convcertir une couleur RVB au format HEX
function rgbComponentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
        return rgbComponentToHex(r) + rgbComponentToHex(g) + rgbComponentToHex(b);
}
