var AsteroidSize = 4;

var GameState = State.extend({

	//constructor
	init: function(game) {
		this._super(game);
		this.canvasWidth = game.canvas.ctx.width;
		this.canvasHeight = game.canvas.ctx.height;

		//create ship
		this.ship = new Ship(Points.SHIP, Points.FLAMES, 2, 0, 0);
		this.ship.maxX = this.canvasWidth;
		this.ship.maxY = this.canvasHeight;

		//game vars
		this.lives = 3;
		this.gameOver = false;
		this.score = 0;
		this.lvl = 10;

		//create lifepolygons
		this.lifepolygon = new Polygon(Points.SHIP);
		this.lifepolygon.scale(1.5);
		this.lifepolygon.rotate(-Math.PI/2);

		//create asteroids
		this.generateLvl();
	},

	//level generator
	generateLvl: function() {
		//number of asteroids
		var num = Math.round(10*Math.atan(this.lvl/25)) + 3;

		//ship starting position
		this.ship.x = this.canvasWidth/2;
		this.ship.y = this.canvasHeight/2;

		//bullet array
		this.bullets = [];

		//create asteroids
		this.asteroids = [];
		for (var i = 0; i < num; i++) {
			//choose asteroid polygon and posiitons
			var n = Math.round(Math.random() * (Points.ASTEROIDS.length - 1));
			var x = 0, y = 0;
			if (Math.random() > 0.5) {
				x = Math.random() * this.canvasWidth;
			} else {
				y = Math.random() * this.canvasHeight;
			}
			
			var astr = new Asteroid(Points.ASTEROIDS[n], AsteroidSize, x, y);
			astr.maxX = this.canvasWidth;
			astr.maxY = this.canvasHeight;
			this.asteroids.push(astr);
		}
	},

	//input handler
	handleInputs: function(input) {
		// only update ship orientation and velocity if it's visible
		if (!this.ship.visible) {
			if (input.isPressed("spacebar")) {
				// change state if game over
				if (this.gameOver) {
					this.game.nextState = States.MENU;
					this.game.stateVars.score = this.score;
					return;
				}
				this.ship.visible = true;
			}
			return;
		}

		if (input.isDown("right")) {
			this.ship.rotate(0.06);
		}
		if (input.isDown("left")) {
			this.ship.rotate(-0.06);
		}
		if (input.isDown("up")) {
			this.ship.addVel();
		}

		if (input.isPressed("spacebar")) {
			this.bullets.push(this.ship.shoot());
		}
	},

	update: function() {
		for (var i = 0, len = this.asteroids.length; i < len; i++) {
			var a = this.asteroids[i];
			a.update();

			if (this.ship.collide(a)) {
				this.ship.x = this.canvasWidth/2;
				this.ship.y = this.canvasHeight/2;
				this.ship.vel = {
					x: 0,
					y: 0
				}
				this.lives--;
				if (this.lives <= 0) {
					this.gameOver = true;
				}
				this.ship.visible = false;
			}

			// check if bullets hits the current asteroid
			for (var j = 0, len2 = this.bullets.length; j < len2; j++) {
				var b = this.bullets[j];
				
				if (a.hasPoint(b.x, b.y)) {
					this.bullets.splice(j, 1);
					len2--;
					j--;

					// update score depending on asteroid size
					switch (a.size) {
						case AsteroidSize:
							this.score += 20;
							break;
						case AsteroidSize/2:
							this.score += 50;
							break;
						case AsteroidSize/4:
							this.score += 100;
							break;
					}

					// if asteroid splitted twice, then remove
					// else split in half
					if (a.size > AsteroidSize/4) {
						for (var k = 0; k < 2; k++) {
							var n = Math.round(Math.random() * (Points.ASTEROIDS.length - 1));

							var astr = new Asteroid(Points.ASTEROIDS[n], a.size/2, a.x, a.y);
							astr.maxX = this.canvasWidth;
							astr.maxY = this.canvasHeight;

							this.asteroids.push(astr);
							len++;
						}
					}
					this.asteroids.splice(i, 1);
					len--;
					i--;
				}
			}
		}

		// iterate thru and update all bullets
		for (var i = 0, len = this.bullets.length; i < len; i++) {
			var b = this.bullets[i];
			b.update();

			// remove bullet if removeflag is setted
			if (b.shallRemove) {
				this.bullets.splice(i, 1);
				len--;
				i--;
			}
		}
		// update ship
		this.ship.update();

		// check if lvl completed
		if (this.asteroids.length === 0) {
			this.lvl+=5;
			this.generateLvl();
		}
	},

	//renderer
	render: function(ctx) {
		ctx.clearAll();
		//draw score and extra lives
		ctx.vectorText(this.score, 3, 35, 15);
		ctx.vectorText("PRESS SPACEBAR TO SHOOT AND RESPAWN",2,173,10);
		for (var i = 0; i < this.lives; i++) {
			ctx.drawPolygon(this.lifepolygon, 40+15*i, 50);
		}
		//draw all asteroids and bullets
		for (var i = 0, len = this.asteroids.length; i < len; i++) {
			this.asteroids[i].draw(ctx);
		}
		for (var i = 0, len = this.bullets.length; i < len; i++) {
			this.bullets[i].draw(ctx);
		}
		//end screen
		if (this.gameOver) {
			ctx.vectorText("GAME OVER", 5, null, 250);
			ctx.vectorText("YOUR SCORE IS " + this.score, 4, null, null);
			ctx.vectorText("THANKS FOR PLAYING", 3, null, window.innerHeight/2 + 140);
			ctx.vectorText("PRESS SPACE TO RESTART", 3, null, window.innerHeight/2 + 200);
		}
		//draw ship
		this.ship.draw(ctx);
	}
});