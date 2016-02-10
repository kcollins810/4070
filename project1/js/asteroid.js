var Asteroid = Polygon.extend({

	maxX: null,
	maxY: null,

	//constructor
	init: function(p, s, x, y) {
		this._super(p);
		//position
		this.x = x;
		this.y = y;
		//set asteroid size
		this.size = s;
		this.scale(s);
		//set rotation angle
		this.rotAngle = 0.02*(Math.random()*2 - 1);
		//velocity
		var r = 2*Math.PI*Math.random();
		var v = Math.random() + 1;
		this.vel = {
			x: v*Math.cos(r),
			y: v*Math.sin(r)
		}
	},

	//polygon checker
	hasPoint: function(x, y) {
		return this._super(this.x, this.y, x, y);
	},

	//updates asteroid (rotates)
	update: function() {
		this.x += this.vel.x;
		this.y += this.vel.y;
		//check edges
		if (this.x > this.maxX) {
			this.x = 0;
		} else if (this.x < 0) {
			this.x = this.maxX;
		}
		if (this.y > this.maxY) {
			this.y = 0;
		}else if (this.y < 0) {
			this.y = this.maxY;
		}
		//rotate asteroid
		this.rotate(this.rotAngle);
	},

	//draw asteroid
	draw: function(ctx) {
		ctx.drawPolygon(this, this.x, this.y);
	}
});