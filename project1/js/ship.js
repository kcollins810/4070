var Ship = Polygon.extend({

	maxX: null,
	maxY: null,
	 
	//contructor
	init: function(p, pf, s, x, y) {
		this._super(p);
		//ship flame polygon
		this.flames = new Polygon(pf);
		this.flames.scale(s);
		//variables for when ship is boom
		this.drawFlames = false;
		this.visible = true;
		//ship position
		this.x = x;
		this.y = y;
		// scale the ship to the specified size
		this.scale(s);
		// facing direction
		this.angle = 0;
		// velocity
		this.vel = {
			x: 0,
			y: 0
		}
	},

	//asteroid collision
	collide: function(astr) {
		//ship is already destroyed
		if (!this.visible) {
			return false;
		}
		for (var i = 0, len = this.points.length - 2; i < len; i += 2) {
			var x = this.points[i] + this.x;
			var y = this.points[i+1] + this.y;

			if (astr.hasPoint(x, y)) {
				return true;
			}
		}
		return false;
	},

	//shoot bullets
	shoot: function() {
		var b = new Bullet(this.points[0] + this.x, this.points[1] + this.y, this.angle);
		b.maxX = this.maxX;
		b.maxY = this.maxY;
		return b;
	},

	//velocity increase
	addVel: function() {
		if (this.vel.x*this.vel.x + this.vel.y*this.vel.y < 20*20) {
			this.vel.x += 0.05*Math.cos(this.angle);
			this.vel.y += 0.05*Math.sin(this.angle);
		}
		this.drawFlames = true;
	},

	//rotate ship
	rotate: function(theta) {
		this._super(theta);
		this.flames.rotate(theta);
		this.angle += theta;
	},

	//velocity decrease
	update: function() {
		//update position
		this.x += this.vel.x;
		this.y += this.vel.y;
		this.vel.x *= 0.99;
		this.vel.y *= 0.99;
		//keep within bounds
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
	},

	//draw ship
	draw: function(ctx) {
		if (!this.visible) {
			return;
		}
		ctx.drawPolygon(this, this.x, this.y);
		if (this.drawFlames) {
			ctx.drawPolygon(this.flames, this.x, this.y);
			this.drawFlames = false;
		}
	}
});