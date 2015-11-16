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
	game.physics.startSystem(Phaser.Physics.ARCADE);
	map = game.add.tilemap('map');
	map.addTilesetImage('Retro_Tileset_RBG');
	layer = map.createLayer('calque');
	layer.resizeWorld();

	sprite = game.add.sprite(500, 500, 'red');
	sprite.scale.setTo(sprite.scale.x / 2, sprite.scale.y / 2);

	game.camera.follow(sprite);
	game.world.scale.setTo(game.world.scale.x, game.world.scale.y);
};

var update = function () {

};

var render = function () {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(sprite, 32, 500);

}

var game = new Phaser.Game(800, 580, Phaser.AUTO, '', {preload: preload, create: create, update: update, render: render});