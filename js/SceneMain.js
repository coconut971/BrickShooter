class SceneMain extends Phaser.Scene {
	constructor() {
		super({ key: "SceneMain" });
	}

	preload() {
        this.load.image("sprWall", "content/sprWall.png");
        this.load.image("sprCeiling", "content/sprCeiling.png");
        this.load.image("sprBrick", "content/sprBrick.png");
        this.load.image("sprPaddle", "content/sprPaddle.png");
        this.load.image("sprBall", "content/sprBall.png");
        
        this.load.audio("sndWallHit", "content/sndWallHit.wav");

        for (var i = 0; i < 4; i++) {
            this.load.audio("sndBrickHit" + i, "content/sndBrickHit"  + i + ".wav");
        }

	}

	addScore(amount) {
        this.score += amount;
        this.textScore.setText(this.score);        
	}

	createStage() {
        var wallLeft = new Wall(this, 0, 0, "sprWall");
        this.walls.add(wallLeft);
        
        var wallRight = new Wall(this, this.game.config.width - 32, 0, "sprWall");
        this.walls.add(wallRight);
        
        var wallCeiling = new Wall(this, 32, 0, "sprCeiling");
        this.walls.add(wallCeiling);        
	}

	addRowsToQueue(amount, isEmpty) {
        isEmpty = isEmpty | false;

        for (var i = 0; i < amount; i++) {
            if (isEmpty) {
                this.rowQueue.push({
                    isEmpty: true,
                    canRemove: false
                });
            }
            else {
                var pointValue = (i + 1) * 3;

                this.rowQueue.push({
                    pointValue: pointValue,
                    soundIndex: i,
                    canRemove: false
                });
            }
        }
	}

	generateRows(amount) {
        amount = amount | 1;

        for (var i = 0; i < amount; i++) {
            if (this.rowQueue.length > 0) {
                
                if (!this.rowQueue[0].isEmpty) {
                    for (var x = 0; x < (this.game.config.width / 32) - 2; x++) {
                        
                        var color = { r: 0, g: 0, b: 0 };

                        var freq = 0.35;

                        color.r = Math.round(Math.sin(freq * (this.amountRowsGenerated + i * 0.5) + 0) * 127 + 128);
                        color.g = Math.round(Math.sin(freq * (this.amountRowsGenerated + i * 0.5) + 2) * 127 + 128);
                        color.b = Math.round(Math.sin(freq * (this.amountRowsGenerated + i * 0.5) + 3) * 127 + 128);

                        var brick = new Brick(this, 32 + (x * 32), 0, color);
                        brick.x += brick.displayWidth * 0.5;
                        brick.y += brick.displayHeight * 0.5;
                        brick.setPointValue(this.rowQueue[0].pointValue);
                        brick.setSoundIndex(this.rowQueue[0].soundIndex);
                        this.bricks.add(brick);
                    }
                }
        
                this.rowQueue[0].canRemove = true;
                this.amountRowsGenerated++;
        
                this.rowQueue = this.rowQueue.filter(function(row) {
                    return !row.canRemove;
                });
        
                this.moveBricksDown(1);
            }
        }        
	}

	moveBricksDown(amount) {
        amount = amount | 1;

        for (var i = 0; i < amount; i++) {
            for (var j = 0; j < this.bricks.getChildren().length; j++) {
                var brick = this.bricks.getChildren()[j];

                if (brick.getData("isBreakable")) {
                    brick.y += brick.displayHeight;
                }
            }
        }
	}

	getLowestRowY() {
        var lowest = 0;

        for (var i =  0; i < this.bricks.getChildren().length; i++) {
            var brick = this.bricks.getChildren()[i];
            if (brick.y > lowest) {
                lowest = brick.y;
            }
        }
        
        return lowest;        
	}

	create() {
        this.sfx = {
            wallHit: this.sound.add("sndWallHit"),
            brickHit: [
                this.sound.add("sndBrickHit0"),
                this.sound.add("sndBrickHit1"),
                this.sound.add("sndBrickHit2"),
                this.sound.add("sndBrickHit3")
            ]
        };

        this.player = new Player(this, this.game.config.width * 0.5, this.game.config.height - 48);

        this.ball = new Ball(this, this.player.x, this.player.y - 32);
        this.ball.body.setVelocity(
            Phaser.Math.Between(-50, 50),
            300
        );

        this.bricks = this.add.group();
        this.walls = this.add.group();

        this.rowQueue = [];
        this.amountRowsGenerated = 0;
        this.amountBallHitPaddle = 0;

        this.createStage();

        this.score = 0;
        this.livesUsed = 0;

        this.textScore = this.add.text(
            64,
            this.game.config.height - 24,
            0,
            {
                fontFamily: "monospace",
                fontSize: 24,
                align: "left"
            }
        );
        this.textScore.setOrigin(0.5);
        
        this.textLivesUsed = this.add.text(
            this.game.config.width * 0.5,
            this.game.config.height - 24,
            0,
            {
                fontFamily: "monospace",
                fontSize: 24,
                align: "center"
            }
        );
        this.textLivesUsed.setOrigin(0.5);
        
        this.rowGeneratorTimer = this.time.addEvent({
            delay: 1,
            callback: function() {
                
                if (this.amountRowsGenerated == 0) {
                    this.addRowsToQueue(4, false);
                    this.addRowsToQueue(4, true);
                    this.addRowsToQueue(4, false);
        
                    this.generateRows(12);
        
                    this.rowGeneratorTimer.delay = 5000;
                }
                else {
                    if (this.amountRowsGenerated % 2 == 0) {
                        this.addRowsToQueue(4, true);
                    }
                    else {
                        this.addRowsToQueue(4, false);
                    }
        
                    this.generateRows(1);
                }
            },
            callbackScope: this,
            loop: true
        });
        

        this.physics.add.collider(this.ball, this.player, function(ball, player) {
            var dist = Phaser.Math.Distance.Between(player.x, 0, ball.x, 0) * 2;

            if (ball.x < player.x) {
                dist = -dist;
            }
            
            var velocityMultiplier = Math.abs(ball.body.velocity.y * 0.1);
            
            if (velocityMultiplier > 8) {
                velocityMultiplier = 8;
            }
            
            ball.body.velocity.x = dist * velocityMultiplier;
            
            this.amountBallHitPaddle++;
            
            if (this.amountBallHitPaddle == 8 ||
                this.amountBallHitPaddle == 16 ||
                this.amountBallHitPaddle == 48) {
            
                ball.setData("velocityMultiplier", ball.getData("velocityMultiplier") * 1.1);
                ball.body.velocity.x += Math.sign(ball.body.velocity.x) + 0.001;
                ball.body.velocity.y += Math.sign(ball.body.velocity.y) + 0.001;
            }
            
            this.sfx.brickHit[Phaser.Math.Between(0, this.sfx.brickHit.length - 1)].play();            
        }, null, this);

        this.physics.add.collider(this.ball, this.bricks, function(ball, brick) {
            if (brick.getData("isBreakable")) {
                if (brick) {
                    this.addScore(brick.getData("pointValue"));
        
                    if (brick.getData("soundIndex") !== undefined) {
                        if (this.sfx.brickHit[brick.getData("soundIndex")] !== undefined) {
                            this.sfx.brickHit[brick.getData("soundIndex")].play();
                        }
                    }
        
                    brick.destroy();
                }
            }
        }, null, this);
        
        this.physics.add.collider(this.ball, this.walls, function(ball, wall) {
            this.sfx.wallHit.play();
        }, null, this);
	}

	update() {
        this.player.x = this.input.activePointer.x;

        if (this.ball.y > this.game.config.height) {
            var respawnPosition = new Phaser.Math.Vector2(this.player.x, this.getLowestRowY() + 64);
        
            if (respawnPosition.y > this.player.y - 32) {
                respawnPosition.y = this.player.y - 32;
            }
        
            this.ball.x = respawnPosition.x;
            this.ball.y = respawnPosition.y;
        
            this.livesUsed++;
            this.textLivesUsed.setText(this.livesUsed);
        }
        
        for (var i = 0; i < this.bricks.getChildren().length; i++) {
            var brick = this.bricks.getChildren()[i];
        
            if (brick.y > this.player.y - 48) {
                if (brick) {
                    brick.destroy();
                }
            }
        }
        
	}
}
