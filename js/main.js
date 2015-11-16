var player,
	platform,
	blocks,
	map,
	sprite,
	layer;

var preload = function () {
	game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('Retro_Tileset_RBG', 'assets/Retro_Tileset_RBG.png', 16, 16);
 	game.load.spritesheet('red', 'assets/red.png', 32, 32);
};

var create = function () {
	game.physics.startSystem(Phaser.Physics.P2JS);
	map = game.add.tilemap('map');
	map.addTilesetImage('Retro_Tileset_RBG');
	

	collide = map.createLayer('collision');
	collide.enableBody = true;
	collide.debug = true;
	//game.physics.arcade.enable(collide, Phaser.Physics.ARCADE, true);
	collide.resizeWorld();
	console.log(collide);


	layer = map.createLayer('calque');
	layer.resizeWorld();

	danger = map.createLayer('danger');
	danger.resizeWorld();
	
	map.setCollision(2, true, "collision");
	map.setCollision(25, true, "collision");
	map.setCollision(17, true, "collision");
	map.setCollision(83, true, "collision");
	map.setCollision(84, true, "collision");
	map.setCollision(91, true, "collision");
	map.setCollision(92, true, "collision");
	map.setCollision(53, true, "collision");
	map.setCollision(599, true, "collision");
	map.setCollision(598, true, "collision");
	map.setCollision(673, true), "collision";
	map.setCollision(1610612738, true, "collision");
	map.setCollision(19, true, "collision");
	map.setCollisionBetween(180, 184,true, "collision");
	map.setCollisionBetween(190, 192,true, "collision");
	map.setCollisionBetween(197, 200,true, "collision");
	map.setCollisionBetween(200, 209,true, "collision");

	game.physics.p2.convertTilemap(map, "collision");
	sprite = game.add.sprite(364, 272, 'red');

	var down = sprite.animations.add('down', [0, 1], 8, true);
	var left = sprite.animations.add('left', [2, 3], 8, true);
	var right = sprite.animations.add('right', [4, 5], 8, true);
	var up = sprite.animations.add('up', [6, 7], 8, true);

	sprite.scale.setTo(sprite.scale.x / 2, sprite.scale.y / 2);

	game.camera.follow(sprite);

	// map.setCollisionBetween(1, 1000, true, collide);
	//game.physics.p2.enable(sprite);
	//sprite.body.fixedRotation = true;
	//sprite.body.clearShapes();  
	
	game.world.scale.setTo(game.world.scale.x + 1 , game.world.scale.y + 1);
};

var update = function () {
	//game.physics.arcade.collide(sprite, collide);
	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        //sprite.body.moveLeft(30);
        sprite.x += -1.1; 
        sprite.animations.play('left', 8, false)
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
    	sprite.x += 1.1;
        // sprite.body.moveRight(30);
        sprite.animations.play('right', 8, false)
    }

    else if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
    	sprite.y += -1.1;
        // sprite.body.moveUp(30);
        sprite.animations.play('up', 8, false)
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
    	sprite.y += 1.1;
        // sprite.body.moveDown(30);
        sprite.animations.play('down', 8, false)
    }
};

var render = function () {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(sprite, 32, 500);

}

var game = new Phaser.Game(800, 580, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});