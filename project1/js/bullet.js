var Bullet = Class.extend({

	maxX: null,
	maxY: null,

	//constructor
	init: function(x, y, angle) {
		this.x = x;
		this.y = y;
		this.shallRemove = false;
		this.vel = {
			x: 5*Math.cos(angle),
			y: 5*Math.sin(angle)
		}
	},

	//updater
	update: function() {
		this.prevx = this.x;
		this.prevy = this.y;
		//edge checker
		if (0 > this.x || this.x > this.maxX ||
			0 > this.y || this.y > this.maxY
		) {
			this.shallRemove = true;
		}
		this.x += this.vel.x;
		this.y += this.vel.y;
	},

	//draw bullet
	draw: function(ctx) {
		ctx.beginPath();
		ctx.moveTo(this.prevx, this.prevy);
		ctx.lineTo(this.x, this.y);
		ctx.stroke();
	}
});