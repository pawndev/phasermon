var player,
	platform,
	blocks,
	map,
	sprite,
	layer,
	collisionMap,
	movement,
	collisionLayerIndex,
	lastMoveDirection,
	lastCompletedMoveDirection,
	tileSetProperties,
	musicTown,
	musicBattle,
	townEnabled;

var collisionData;
	
var animationComplete = true;

// Bumping is badly named, as it serve to indicate if we are changing direction but not walking,
// and if we're actually bumping.
var bumping = false;

// Time we take to move by one tile.
var moveTime = 180;

var animationLength = 8;
var animationLengthBump = 4;

var gameWidth = 500;
var gameHeight = 280;

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

var currentAnimationIndex = 1;

// Information about directions.
var DirectionInfos = {};
DirectionInfos[Phaser.Keyboard.LEFT]  = {
	offset:new Pair(-1, 0),
	animations: {
		1:{
			name:'left1',  animationFrames:[4, 5]
		},
		2:{
			name:'left2', animationFrames:[6, 7]
		}
	}
};
DirectionInfos[Phaser.Keyboard.RIGHT] = {
	offset:new Pair(1, 0),
	animations: {
		1:{
			name:'right1', animationFrames:[8, 9]
		},
		2:{
			name:'right2', animationFrames:[10, 11]
		}
	}
};
DirectionInfos[Phaser.Keyboard.UP] = {
	offset:new Pair(0, -1), 
	animations: {
		1:{
			name:'up1', animationFrames:[12, 13]
		},
		2:{
			name:'up2', animationFrames:[14, 15]
		}
	}
};
DirectionInfos[Phaser.Keyboard.DOWN] = {
	offset:new Pair(0, 1),
	animations: {
		1:{
			name:'down1',  animationFrames:[0, 1]
		},
		2:{
			name:'down2', animationFrames:[2, 3]
		}
	}
};

var moving;
var last;

var getJSONP = function(url){
	var HttpReq = new XMLHttpRequest();
	HttpReq.open("GET", url, false);
	HttpReq.send(null);
	return HttpReq.responseText;
}

// Simple function to check if the (x, y) coordinate is in world bound.
// The coordinate must be in world space.
var inBound = function(x, y){
	return (((x >= 0) && (x <= game.world.width)) 
		&& ((y >= 0) && (y <= game.world.height)));
}

// Move sprite by x in abciss, and y in ordinates. The coordinate (x, y) must be tile coordinate.
var moveSpriteBy = function(x, y) {
	if(inBound(sprite.x + x*32, sprite.y + y*32)){
		game.add.tween(sprite).to({x: sprite.x + x*32, y: sprite.y + y*32}, moveTime, Phaser.Easing.Linear.None, true).onComplete.addOnce(
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
	// The first condition is only to be sure that we are not passing negative values to the getTile function.
	// However, going out of bound should never happen, should we leave it here ?

	return (!inBound(targetX, targetY)
			|| map.getTile(targetX, targetY, 0, true).properties.collides);
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
			if(lastCompletedMoveDirection == direction || game.input.keyboard.lastKey.duration >= 125){
				animationComplete = false;
				moveSpriteIn(direction);
				sprite.animations.play(DirectionInfos[direction].animations[currentAnimationIndex].name, animationLength, false);
			}
			else if(!bumping){
				bumping = true;
				sprite.animations.play(DirectionInfos[direction].animations[currentAnimationIndex].name, animationLength, false);
			}
			//animationComplete = false;
			//moveSpriteIn(direction);
			currentAnimationIndex = (currentAnimationIndex == 1 ? 2 : 1);
		}
		else if(!bumping){
			// TODO : Play "bump" sound here.
			bumping = true;
			sprite.animations.play(DirectionInfos[direction].animations[currentAnimationIndex].name, animationLengthBump, false);
			currentAnimationIndex = (currentAnimationIndex == 1 ? 2 : 1);
		}
		lastMoveDirection = direction;
	}
}

// Callback function used to know when an animation ends.
// Eventually can remove the lastMoveDirection variable, but will require a maybe more costly function.
// Thus, event if it's bad design I decide to keep it this way.
function onAnimationComplete(sprite, animation){
	window.animationComplete = true;
	bumping = false;
	lastCompletedMoveDirection = lastMoveDirection;
}

// Preload everything before we start.
// TODO : we should store mapData in memory, not just data
var data;
var preload = function () {
	// Make the tilemap always reload instead of sitting in cache. Useful for testing and map making.
	var mapData = getJSONP('./assets/map.json?v=' + (new Date()).getTime());
	game.load.tilemap('map', '', mapData, Phaser.Tilemap.TILED_JSON);
	game.load.image('Retro_Tileset_RGB', 'assets/Retro_Tileset_RGB.png', 32, 32);
 	game.load.spritesheet('red', 'assets/red.png?v=1', 32, 32);
	data = JSON.parse(mapData);
	data = data.tilesets[0].tileproperties;
	game.load.audio('town', 'assets/town.mp3');
 	game.load.audio('battle', 'assets/battle.mp3');
};

// On game creation.
var create = function () {

	musicTown = game.add.audio('town');
	musicTown.loop = true;
	musicTown.play();
	townEnabled = true;

	musicBattle = game.add.audio('battle');
	musicBattle.loop = true;

	map = game.add.tilemap('map');
	map.addTilesetImage('Retro_Tileset_RGB');
	
	map.tilesets[0].properties = data;
	tileSetProperties = map.tilesets[0].properties;
	console.log(map.tilesets);
	
	// The parseint is somewhat ugly here. Well ...
	for(var key in data){
		console.log((parseInt(key)+1).toString());
		map.setCollision((parseInt(key)+1).toString(), true)
	}

	//collide = map.createLayer('collisions');
	//collide.resizeWorld();

	layer = map.createLayer('calque');
	layer.resizeWorld();
	
	sprite = game.add.sprite(22*32 , 22*32, 'red');
	

	for(var direction in window.DirectionInfos){
		var info = DirectionInfos[direction];
		for(var anim in info.animations){
			console.log(info.animations[anim].animationFrames)
			var dir = sprite.animations.add(info.animations[anim].name, info.animations[anim].animationFrames, 8, true);
			dir.onComplete.add(onAnimationComplete, this);
		}
	}

	game.camera.follow(sprite);
	// TODO : Arbitrary values, need to change later !
	game.world.setBounds(-gameWidth/2, -gameHeight/2, 3000, 3000);
	
	collisionLayerIndex = map.getLayerIndex('collisions');
	console.log(collisionLayerIndex);
	sprite.frame = 1;
};

var inf;
var update = function () {
	if(window.moving){
		return;
	}
	//console.log(game.input.keyboard.lastKey);
	if(game.input.keyboard.lastKey != null 
	   && game.input.keyboard.isDown(game.input.keyboard.lastKey.keyCode)){
		directionalKeyPressProcess(game.input.keyboard.lastKey.keyCode);
	}
	console.log(map.getTileBelow(0, sprite.x / 32, sprite.y / 32).properties);
	if (map.getTile(sprite.x / 32, sprite.y / 32, 'calque', true).properties.danger === "true") {
		console.log('boulou1');
		if (townEnabled) {
			console.log('boulou2');
			musicTown.stop();
			musicBattle.play();
			townEnabled = false;
		}
	} else {
		if (!townEnabled) {
			townEnabled = true;
			musicTown.play();
			musicBattle.stop();
		}
	}
};

var render = function () {

    //game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(sprite, 32, 500);

}

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});
