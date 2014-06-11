function worldMap() {
	var map = {
			
		tile: {
			width:  32,
			height: 32
		},
		
		background: 'world_grass',
		
		audio: 'outside',		
		perimeter: 'world_wall',
		
		objects: [
			{
				type: 'Door',
				sprite: 'default_sprite',
				initialize: function(me, player) {
					me.transitionsTo('masjid', 10, 16);
				},
				range: {
					start: { x: 18, y: 12 },
					end: { x: 20, y: 12 }
				}
			},
			{
				type: 'Npc',
				sprite: 'hijabi_aunty',
				x: 23, y: 15,
				messages: [
					[
						{ character: "woman", text: "Young man ..." },
						{ character: "woman", text: "Follow the footsteps of your forefather, Prophet Abraham." },
						{ character: "woman", text: "He submitted to the creator of everything, alone, and did not worship anything beside Him." }
					]
				]
			},
			{
				type: 'StandingNpc',
				sprite: 'kings_guard',
				range: {
					start: { x: 32, y: 47 },
					end: { x: 34, y: 47 }
				},				
				onTalk: function() {
					// Uber hack: back up instantly!
					var p = Crafty('Player');
					p.y -= 16;	
					p.animate("MovingUp");
					return ["The guards will recognize me. I must keep out of sight."];
				}
			}
		]
		
	};
	
	return map;
}
