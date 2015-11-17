var player,
	platform,
	blocks,
	map,
	sprite,
	layer,
	collisionMap,
	movement,
	collisionLayerIndex;
	
var animationComplete = true;
var boundX = window.innerWidth;

var gameWidth = 800;
var gameHeight = 580;

var Direction = {
	LEFT : 0,
	RIGHT : 1,
	UP : 2,
	DOWN : 3
};

var DirectionInfos = {};
/*DirectionInfos[Direction.LEFT]  = {-1, 0};
DirectionInfos[Direction.RIGHT] = {1, 0};
DirectionInfos[Direction.UP]    = {0, -1};
DirectoinInfos[Direction.DOWN]  = {0, 1};*/

var preload = function () {
	game.load.tilemap('map', './assets/map.json?v=' + (new Date()).getTime(), null, Phaser.Tilemap.TILED_JSON);
	game.load.image('Retro_Tileset_RGB', 'assets/Retro_Tileset_RGB.png', 32, 32);
 	game.load.spritesheet('red', 'assets/red.png', 32, 32);
};

function onAnimationComplete(sprite, animation){
	console.log("animation completed !");
	window.animationComplete = true;
}

var create = function () {
	game.physics.startSystem(Phaser.Physics.P2JS);
	map = game.add.tilemap('map');
	map.addTilesetImage('Retro_Tileset_RGB');

	collide = map.createLayer('collisions');
	collide.resizeWorld();

	layer = map.createLayer('calque');
	layer.resizeWorld();

	//danger = map.createLayer('danger');
	//danger.resizeWorld();
	
	sprite = game.add.sprite(22*32 , 22*32, 'red');
	

	var down = sprite.animations.add('down', [0, 1], 8, false);
	down.onComplete.add(onAnimationComplete, this);
	
	var left = sprite.animations.add('left', [2, 3], 8, false);
	left.onComplete.add(onAnimationComplete, this);
	
	var right = sprite.animations.add('right', [4, 5], 8, false);
	right.onComplete.add(onAnimationComplete, this);
	
	var up = sprite.animations.add('up', [6, 7], 8, false);
	up.onComplete.add(onAnimationComplete, this);

	game.camera.follow(sprite);
	game.world.setBounds(-gameWidth/2, -gameHeight/2, 3000, 3000);
	
	collisionLayerIndex = map.getLayerIndex('collisions');
};

var moving;

var inBound = function(x, y){
	return (((x >= 0) && (x <= game.world.width)) 
    && ((y >= 0) && (y <= game.world.height)));
}

/*var inBound = function(direction){
	
}*/

var playerCollideWith = function(direction){
	switch(direction){
		case Direction.LEFT:
			return map.getTileLeft(collisionLayerIndex, sprite.x/32, sprite.y/32).index != -1;
		case Direction.RIGHT:
			return map.getTileRight(collisionLayerIndex, sprite.x/32, sprite.y/32).index != -1;
		case Direction.UP:
			return map.getTileAbove(collisionLayerIndex, sprite.x/32, sprite.y/32).index != -1;
		case Direction.DOWN:
			return map.getTileBelow(collisionLayerIndex, sprite.x/32, sprite.y/32).index != -1;
		default:
		// Do something more meaningful instead of returning undefined ?
			return;
	}
}

var moveSpriteBy = function(x, y) {
	var finalPositionX = sprite.x + x*32;
	var finalPositionY = sprite.y + y*32;
	if(inBound(finalPositionX, finalPositionY)){
		game.add.tween(sprite).to({x: finalPositionX, y: finalPositionY}, 180, Phaser.Easing.Linear.None, true).onComplete.addOnce(
		function(){
			window.moving = false;
		}, this);
		window.moving = true;
	}
}
var update = function () {
	console.log(moving);
	if(window.moving){
		return;
	}

	if(!animationComplete){
		console.log("please wait");
	}
	if(animationComplete){
		console.log(moving);
		if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){

			if(!playerCollideWith(Direction.LEFT)){
				animationComplete = false;
				moveSpriteBy(-1, 0);
				sprite.animations.play('left', 8, false);
			}
			else{
				sprite.animations.play('left', 4, false);
				// Do something, like play the "bump" sound
			}
		}
		else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
			if(!playerCollideWith(Direction.RIGHT)){
				animationComplete = false;
				moveSpriteBy(1, 0);
				sprite.animations.play('right', 8, false);
			}
			else{
				sprite.animations.play('right', 4, false);
				// Do something, like play the "bump" sound
			}
		}

		else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
			if(!playerCollideWith(Direction.UP)){
				animationComplete = false;
				moveSpriteBy(0, -1);
				sprite.animations.play('up', 8, false);
			}
			else{
				sprite.animations.play('up', 4, false);
				// Do something, like play the "bump" sound
			}
		}
		else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
			if(!playerCollideWith(Direction.DOWN)){
				animationComplete = false;
				moveSpriteBy(0, 1);
				sprite.animations.play('down', 8, false);
			}
			else{
				sprite.animations.play('down', 4, false);
				// Do something, like play the "bump" sound
			}
		}
	}
};

var render = function () {

    //game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(sprite, 32, 500);

}

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});
