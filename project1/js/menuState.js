var MenuState = State.extend({

	init: function(game) {
		this._super(game);
		this.canvasWidth = game.canvas.ctx.width;
		this.canvasHeight = game.canvas.ctx.height;
		//create and initiate background asteroids
		var num = Math.random()*5 + 5;
		this.asteroids = [];
		for (var i = 0; i < num; i++) {
			//set asteroid polygon
			var n = Math.round(Math.random() * (Points.ASTEROIDS.length - 1));
			//asteroid position
			var x = Math.random() * this.canvasWidth;
			var y = Math.random() * this.canvasHeight;
			//size of asteroid
			var s = [1, 2, 4][Math.round(Math.random() * 2)]
			//make asteroid
			var astr = new Asteroid(Points.ASTEROIDS[n], AsteroidSize/s, x, y);
			astr.maxX = this.canvasWidth;
			astr.maxY = this.canvasHeight;
			//add to array
			this.asteroids.push(astr);
		}
	},

	//spacebar key handler
	handleInputs: function(input) {
		if (input.isPressed("spacebar")) {
			this.game.nextState = States.GAME;
		}
	},

	update: function() {
		//update all asteroids
		for (var i = 0, len = this.asteroids.length; i < len; i++) {
			this.asteroids[i].update();
		}
	},

	render: function(ctx) {
		ctx.clearAll();
		//draw all asteroids
		for (var i = 0, len = this.asteroids.length; i < len; i++) {
			this.asteroids[i].draw(ctx);
		}
		// draw title text
		ctx.vectorText("DATASTEROIDS", 6, null, 180);
		ctx.vectorText("BY KYLER COLLINS", 3, null, 240);
		ctx.vectorText("PRESS SPACEBAR TO START", 2, null, 390);
	}
});