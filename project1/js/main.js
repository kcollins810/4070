var States = {
	NO_CHANGE: 0,
	MENU: 1,
	GAME: 2,
}

var Game = Class.extend({

	//constructor
	init: function() {
		this.canvas = new Canvas(window.innerWidth, window.innerHeight); //span over full browser
		this.input = new InputHandeler({
			left:     37,
			up:       38,
			right:    39,
			down:     40,
			spacebar: 32,
			enter:    13
		});

		this.canvas.ctx.strokeStyle = 'white';
		//state vars
		this.currentState = null;
		this.stateVars = {
			score: 0
		}
		this.nextState = States.MENU;
	},

	//run the game
	run: function() {
		var self = this;

		this.canvas.animate(function() {
			//change states
			if (self.nextState !== States.NO_CHANGE) {
				switch(self.nextState) {
					case States.MENU:
						self.currentState = new MenuState(self);
						break;
					case States.GAME:
						self.currentState = new GameState(self);
						break;
				}
				self.nextState = States.NO_CHANGE;
			}

			//update state
			self.currentState.handleInputs(self.input);
			self.currentState.update();
			self.currentState.render(self.canvas.ctx);
		});
	}
});