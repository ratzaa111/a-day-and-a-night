// The Grid component allows an element to be located
//	on a grid of tiles
Crafty.c('Grid', {
	init: function() {
		this.attr({
			w: Game.mapGrid.tile.width,
			h: Game.mapGrid.tile.height
		})
	},

	// Locate this entity at the given position on the grid
	move: function(x, y) {
		if (x === undefined && y === undefined) {
			return { x: this.x / Game.mapGrid.tile.width, y: this.y / Game.mapGrid.tile.height }
		} else {
			this.attr({ x: x * Game.mapGrid.tile.width, y: y * Game.mapGrid.tile.height });
			return this;
		}
	},
	
	gridX: function() {
		return Math.floor(this.x / Game.mapGrid.tile.width);
	},
	
	gridY: function() {
		return Math.floor(this.y / Game.mapGrid.tile.height);
	}
});

// An "Actor" is an entity that is drawn in 2D on canvas
//	via our logical coordinate grid
Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas, Grid');
	},
});

// Handy movement helper that slides instead of dead stops when bumping against other solids
// Warning: depends on internal implementation details (_movement). 
// This may break when you update CraftyJS.
Crafty.c('MoveAndCollide', {
	init: function() {
		this.requires('Fourway, Collision')
	},
	
	stopOnSolids: function() {
		this.onHit('Solid', this.stopMovement);
		return this;
	},
	
	stopMovement: function() {
		if (this._movement) {
			this.x -= this._movement.x;
			if (this.hit('Solid') != false) {
				this.x += this._movement.x;
				this.y -= this._movement.y;
				if (this.hit('Solid') != false) {
					this.x -= this._movement.x;					
				}
			}
		} else {
			this._speed = 0;
		}
	}
});

Crafty.c('Interactive', {
	onInteract: function(func) {
		this.interactFunction = func;
	},
	
	interact: function() {
		this.interactFunction();
	}
});

Crafty.c('PositionalAudio', {

	// AudioID: from Crafty.audio.add
	PositionalAudio: function(audioId, radius, player) {		
		this.requires('Actor');
		
		this.audioId = audioId;
		this.radiusSquared = radius * radius;
		this.player = player;
		this.x = null;
		this.y = null;
		
		this.bind('EnterFrame', function() {
			if (this.audioId == null) {
				throw new Error("PositionalAudio created but init() was never called.");
			}
			
			if (this.obj != null && this.x != null && this.y != null) {
				// Avoid sqrt: a^2 + b^2 = c^2
				var dSquared = Math.pow(this.gridX() - this.player.gridX(), 2) + Math.pow(this.gridY() - this.player.gridY(), 2);
				// Map (0 .. d^2) to (1 .. 0)
				var volume = Math.max(0, this.radiusSquared - dSquared) / this.radiusSquared;
				this.setVolume(volume);
			} else {			
				for (var i = 0; i < Crafty.audio.channels.length; i++) {
					var c = Crafty.audio.channels[i];
					if (c.id == this.audioId) {					
						this.obj = c.obj;
						console.log("Found: " + this.obj + " for " + this.audioId);
					}
				}
			}			
		});
	},
	
	play: function() {
		Crafty.audio.play(this.audioId, -1);
	},
	
	setVolume: function(volume) {
		this.obj.volume = volume;
		console.log("volume=" + volume);
	}
});