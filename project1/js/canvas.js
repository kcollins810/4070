var Canvas = Class.extend({

	//constructor
	init: function(width, height) {
		this.canvas = document.createElement("canvas");
		this.canvas.width = 600;
		this.canvas.height = 600;
		
		//context creator
		this.ctx = (function(ctx) {
			//ctx.width = ctx.canvas.width; //fullscreen
			ctx.width = ctx.canvas.width;
			//ctx.height = ctx.canvas.height; //fullscreen
			ctx.height = ctx.canvas.height;
			ctx.ACODE = "A".charCodeAt(0);
			ctx.ZCODE = "0".charCodeAt(0);
			ctx.SCODE = " ".charCodeAt(0);
			//draw polygon
			ctx.drawPolygon = function(p, x, y) {
				p = p.points;
				this.beginPath();
				this.moveTo(p[0] + x, p[1] + y);
				for (var i = 2, len = p.length; i < len; i += 2) {
					this.lineTo(p[i] + x, p[i + 1] + y);
				}
				this.stroke();
			};

			
			//Vector text function
			//***code from Max Wihlborg (MIT)***)
			/**
			 * Fancy text method using verticies from the point.js
			 * file
			 * @param  {string/number} text   what to draw
			 * @param  {number} s      scalefactor
			 * @param  {number} x      x position
			 * @param  {number} y      y position
			 * @param  {number} offset used when drawing from ltr
			 *
			 * NOTE: If x/y isn't numbers, is the text centered
			 */
			ctx.vectorText = function(text, s, x, y, offset) {
				// make sure that it's a string and transform to
				// uppercase
				text = text.toString().toUpperCase();
				var step = s*6; // stepsize, make sure to scale

				// add offset if specified
				if (typeof offset === "number") {
					x += step*(offset - text.length);
				}

				// center x/y if they aren't numbers
				if (typeof x !== "number") {
					x = Math.round((this.width - text.length*step)/2);
				}
				if (typeof y !== "number") {
					y = Math.round((this.height - step)/2);
				}

				x += 0.5; // add 0.5 for sharp graphics
				y += 0.5;

				// iterate thru all characters in text stirng (*)
				for (var i = 0, len = text.length; i < len; i++) {
					var ch = text.charCodeAt(i); // get charcode

					// if whitespace increase x with stepsize and
					// continue with (*)
					if (ch === this.SCODE) {
						x += step;
						continue;
					}

					var p;

					// the charcode are decremented by correct
					// constant for right index
					if (ch - this.ACODE >= 0) {
						p = Points.LETTERS[ch - this.ACODE];
					} else {
						p = Points.NUMBERS[ch - this.ZCODE];
					}

					// iterate thru all points and draw with stroke
					// style
					this.beginPath();
					this.moveTo(p[0]*s + x, p[1]*s + y);
					for (var j = 2, len2 = p.length; j < len2; j += 2) {
						this.lineTo(p[j]*s + x, p[j + 1]*s + y);
					}	
					this.stroke();

					// increase with stepsize after each character
					x += step;
				}
			};

			//clear canvas
			ctx.clearAll = function() {
				this.clearRect(0, 0, this.width, this.height);
			};

			return ctx;
		})(this.canvas.getContext("2d"));

		document.body.appendChild(this.canvas);
	},

	//animate and wrap frame
	animate: function(loop) {
		//get rAF version from browser
		var rAF = (function() {
			return window.requestAnimationFrame    ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||

				function(cb, el) {
					window.setTimeout(cb, 1000/60);
				}
		})();

		var self = this;
		var l = function() {
			loop();
			rAF(l, self.canvas);
		}
		rAF(l, this.canvas);
	}
});