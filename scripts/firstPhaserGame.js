
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('sky', '../assets/sky.png');
	game.load.image('ground', '../assets/platform.png');
	game.load.image('star', '../assets/star.png');
	game.load.spritesheet('dude', '../assets/dude.png', 32, 48);
}

var platforms;
var stars;

var score = 0;
var scoreText;

function create() {
	// Must start the physics system running. Add sprites/groups to it later.
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    // ---------------------------- Platforms Group -------------------------------
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  This turns physics on for the entire group. I.E. it now has a body property.
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;

	// ---------------------------- Stars Group -------------------------------
	stars = game.add.group();

	stars.enableBody = true;

	//  Create 12 stars and position them evenly with random bounce
    for (var i = 0; i < 12; i++) {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Once physics is enabled on a sprite, it gains the body property which is an ArcadePhysics.Body object.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true); // Use frames 0 to 4 at 10 frames per second
    player.animations.add('right', [5, 6, 7, 8], 10, true);  // Use frames 5 to 8 at 10 frames per second

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    // This creates the cursor keys left, up, right, down for controlling the player
    cursors = game.input.keyboard.createCursorKeys();
}
// Update function is called by game loop on every frame
function update() {
	//  Register collision. Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(platforms, stars);

    //  Checks to see if the player overlaps with any of the stars, if yes, collect the star
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    // Reset the players velocity EVERY frame.
    // If this is not set to 0, then the velocity will continue in his/her direction (without further input)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        // Play the 'left' animations. Frames [0,1,2,3] registered above.
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;  // have the player look at you if idle.
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
}


function collectStar(player, star) {
	star.kill();

	score += 10;
    scoreText.text = 'Score: ' + score;
}