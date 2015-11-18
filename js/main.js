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

function Pair(x, y){
	this.x = x;
	this.y = y;
}

var Direction = {
	LEFT : 0,
	RIGHT : 1,
	UP : 2,
	DOWN : 3
};

// NOTE : I don't use bit shifting for division/multiplication because the javascript optimizers on modern
// web browsers are clever enough to figure out that we got power of two, and perform optimization.


// Information about directions.
var DirectionInfos = {};
DirectionInfos[Phaser.Keyboard.LEFT]  = {offset:new Pair(-1, 0), name:'left',  animationFrames:[2, 3]};
DirectionInfos[Phaser.Keyboard.RIGHT] = {offset:new Pair(1, 0),  name:'right', animationFrames:[4, 5]};
DirectionInfos[Phaser.Keyboard.UP]    = {offset:new Pair(0, -1), name:'up',    animationFrames:[6, 7]};
DirectionInfos[Phaser.Keyboard.DOWN]  = {offset:new Pair(0, 1),  name:'down',  animationFrames:[0, 1]};

var moving;

// Simple function to check if the (x, y) coordinate is in world bound.
// The coordinate must be in world space.
var inBound = function(x, y){
	return (((x >= 0) && (x <= game.world.width)) 
		&& ((y >= 0) && (y <= game.world.height)));
}

// Move sprite by x in abciss, and y in ordinates. The coordinate (x, y) must be tile coordinate.
var moveSpriteBy = function(x, y) {
	var finalPositionX = sprite.x + x*32;
	var finalPositionY = sprite.y + y*32;
	if(inBound(finalPositionX, finalPositionY)){
		game.add.tween(sprite).to({x: finalPositionX, y: finalPositionY}, 125, Phaser.Easing.Linear.None, true).onComplete.addOnce(
		function(){
			window.moving = false;
		}, this);
		window.moving = true;
	}
}

// Move sprite in the diven direction (direction are expressed by phaser directional key keyCodes).
var moveSpriteIn = function(direction) {
	moveSpriteBy(DirectionInfos[direction].offset.x, DirectionInfos[direction].offset.y);
}

// Check if player collides with an adjacent tile in the grid.
var playerCollideWith = function(direction){
	var targetX = sprite.x/32 + DirectionInfos[direction].offset.x;
	var targetY = sprite.y/32 + DirectionInfos[direction].offset.y;
	return (!inBound(targetX, targetY)
			|| map.getTile(targetX, targetY, collisionLayerIndex, true).index != -1);
}

// Check if the keyCode passed is a directional key's keyCode.
var isDirectionalKey = function(keyCode){
	return ((keyCode == Phaser.Keyboard.LEFT)
		 || (keyCode == Phaser.Keyboard.RIGHT)
		 || (keyCode == Phaser.Keyboard.UP)
		 || (keyCode == Phaser.Keyboard.DOWN));
}

// Main function for movement processing.
var directionalKeyPressProcess = function(direction){
	if(isDirectionalKey(direction) && animationComplete){
		if(!playerCollideWith(direction)){
			animationComplete = false;
			moveSpriteIn(direction);
			sprite.animations.play(DirectionInfos[direction].name, 8, false);
		}
		else{
			// TODO : Play "bump" sound here.
			sprite.animations.play(DirectionInfos[direction].name, 4, false);
		}
	}
}

// Callback function used to know when an animation ends.
function onAnimationComplete(sprite, animation){
	window.animationComplete = true;
}

// Preload everything before we start.
var preload = function () {
	// Make the tilemap always reload instead of sitting in cache. Useful for testing and map making.
	game.load.tilemap('map', './assets/map.json?v=' + (new Date()).getTime(), null, Phaser.Tilemap.TILED_JSON);
	game.load.image('Retro_Tileset_RGB', 'assets/Retro_Tileset_RGB.png', 32, 32);
 	game.load.spritesheet('red', 'assets/red.png', 32, 32);
};

// On game creation.
var create = function () {
	map = game.add.tilemap('map');
	map.addTilesetImage('Retro_Tileset_RGB');

	collide = map.createLayer('collisions');
	collide.resizeWorld();

	layer = map.createLayer('calque');
	layer.resizeWorld();
	
	sprite = game.add.sprite(22*32 , 22*32, 'red');
	

	for(var direction in window.DirectionInfos){
		var info = DirectionInfos[direction];
		var dir = sprite.animations.add(info.name, info.animationFrames, 8, false);
		dir.onComplete.add(onAnimationComplete, this);
	}

	game.camera.follow(sprite);
	game.world.setBounds(-gameWidth/2, -gameHeight/2, 3000, 3000);
	
	collisionLayerIndex = map.getLayerIndex('collisions');
	console.log(collisionLayerIndex);
};

var update = function () {
	if(window.moving){
		return;
	}

	if(!animationComplete){
	}
	if(game.input.keyboard.lastKey != null && game.input.keyboard.isDown(game.input.keyboard.lastKey.keyCode)){
		directionalKeyPressProcess(game.input.keyboard.lastKey.keyCode);
	}
};

var render = function () {

    //game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(sprite, 32, 500);

}

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});
