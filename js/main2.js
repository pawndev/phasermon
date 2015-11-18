var player,
	platform,
	blocks,
	map,
	sprite,
	layer,
	collisionMap,
	movement,
	musicTown,
	musicBattle,
	townEnabled,
	itemArray = [],
	it,
	allItem,
	ball;

var preload = function () {
	game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('Retro_Tileset_RBG', 'assets/Retro_Tileset_RBG.png', 16, 16);
 	game.load.spritesheet('red', 'assets/red.png', 32, 32);
 	game.load.audio('town', 'assets/town.mp3');
 	game.load.audio('battle', 'assets/battle.mp3');
 	game.load.spritesheet('item', 'assets/ball.png');
};

var create = function () {
	musicTown = game.add.audio('town');
	musicTown.loop = true;
	musicTown.play();
	townEnabled = true;

	musicBattle = game.add.audio('battle');
	musicBattle.loop = true;

	game.physics.startSystem(Phaser.Physics.ARCADE);

	map = game.add.tilemap('map');
	map.addTilesetImage('Retro_Tileset_RBG');

	collide = map.createLayer('collision');
	collide.resizeWorld();

	layer = map.createLayer('calque');
	layer.resizeWorld();

	danger = map.createLayer('danger');
	danger.resizeWorld();

	// allItem = game.add.group();
	// allItem.enableBody = true;

	// it = allItem.create(33*16, 25*16 + 16, 'item');
	ball = game.add.sprite(33*16, 25*16 + 32, 'item');

	sprite = game.add.sprite(33*16, 25*16, 'red');

	// it.custom = {
	// 	name: "pokeball"
	// };
	// it.height = 12;
	// it.width = 12;

	game.physics.enable([sprite, ball], Phaser.Physics.ARCADE);
	ball.body.velocity.x = 0;
	ball.name = "pokeball";
	//game.physics.enable(sprite);
	//game.physics.arcade.enable(ball);

	var down = sprite.animations.add('down', [0, 1], 8, true);
	var left = sprite.animations.add('left', [2, 3], 8, true);
	var right = sprite.animations.add('right', [4, 5], 8, true);
	var up = sprite.animations.add('up', [6, 7], 8, true);

	sprite.height = 16;
	sprite.width = 16;

	game.camera.follow(sprite);
	//game.world.scale.setTo(game.world.scale.x + 1 , game.world.scale.y + 1);
};

var moving;

var moveSpriteBy = function(x, y) {
	game.add.tween(sprite).to({x: sprite.x + x * 16, y: sprite.y + y * 16}, 100, Phaser.Easing.Linear.None, true).onComplete.addOnce(
	function () {
		window.moving = false;
	}, this);
	window.moving = true;
};

var update = function () {
	game.physics.arcade.collide(ball, sprite, function (obj1, obj2) {
	 	console.log('obj1: ', obj1);
		console.log('obj2: ', obj2);
	}, null, this);
	//game.physics.arcade.collide(sprite, ball);

	if(window.moving)
	{
		return;
	}

	if (map.getTileBelow(1, sprite.x/16, sprite.y/16).index == -1) {
		if (!townEnabled) {
			townEnabled = true;
			musicTown.play();
			musicBattle.stop();
		}
	} else {
		if (townEnabled) {
			musicTown.stop();
			musicBattle.play();
			townEnabled = false;
		}
	}

	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
		//console.log(window.moving)
		//console.log(map.getTileLeft(2, sprite.x/16, sprite.y/16));
		if(map.getTileLeft(2, sprite.x/16, sprite.y/16).index == -1)
		{
			moveSpriteBy(-1, 0);
		}
		else
		{
			// Do something, like play the "bump" sound
		}
		/*game.add.tween(sprite).to({x: sprite.x - 16, y: sprite.y}, 100, Phaser.Easing.Linear.None, true).onComplete.addOnce(
			function(){
				window.moving = false;
			}, this);*/
		//sprite.x -= 16;
		//movement.start();
		//console.log(window.moving);
		//Phaser.Math.snapTo(sprite.world, 2);
        sprite.animations.play('left', 8, false)
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
		if(map.getTileRight(2, sprite.x / 16, sprite.y / 16).index == -1)
		{
			moveSpriteBy(1, 0);
		}
		else
		{
			// Do something, like play the "bump" sound
		}
		sprite.animations.play('right', 8, false);
    }

    else if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
		if(map.getTileAbove(2, sprite.x / 16, sprite.y / 16).index == -1)
		{
			moveSpriteBy(0, -1);
		}
		else
		{
			// Do something, like play the "bump" sound
		}
        sprite.animations.play('up', 8, false)
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
		if(map.getTileBelow(2, sprite.x / 16, sprite.y / 16).index == -1)
		{
			moveSpriteBy(0, 1);
		}
		else
		{
			// Do something, like play the "bump" sound
		}
        sprite.animations.play('down', 8, false)
    }//map.getLayerIndex('collision'));*/
	//console.log(sprite.x, " ", sprite.y);
	/*movement.onComplete.add(function(){
		window.moving = false;
		//game.tween.remove(tween)
	}, this);*/
	/*if(!moving)
	{
		game.tween.remove(movement);
	}*/
		//movement.start();
};

var render = function () {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(sprite, 32, 500);

}

var game = new Phaser.Game(800, 580, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});
