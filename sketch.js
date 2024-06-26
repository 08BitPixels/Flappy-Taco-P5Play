// Screen Setup
const FPS = 60;

// Colours
const BG_COLOUR = '#202020';

// Game
let paused;
let ended;
let passed;
let collided;
let score;
let high_score;
localStorage.setItem('highscore', 0)

// Font
let font;

// Sounds
let music;
let player_jump;
let player_death;

// Text
let score_txt;
let score_count_txt;
let high_score_txt;
let high_score_count_txt;
let game_over_txt;
let press_mouse_txt;
let clicked;

// Player
let player;
let player_img;
let player_grav;
let player_jump_boost;
let player_scale;
let player_width;
let player_height;

// Forks
let forks;
let fork_scale;
let fork_img;
let fork_height;
let fork_width;
let fork_count;
let fork_offset_y;
let fork_offset_y_bounds;
let fork_gap;
let fork_speed;
let fork_hitboxes;

function preload() {

    // Images
    player_img = loadImage('images/player/taco0.png');
    fork_img = loadImage('images/fork/fork.png');

    // Font
    font = loadFont('fonts/pixel_font.otf');

    // Sounds
    music = loadSound('audio/music/raining-tacos.mp3');
    player_jump = loadSound('audio/sfx/jump.wav');
    player_death = loadSound('audio/sfx/death.mp3');
    
}

// GAME
function setup() {

    new Canvas();

    // Game
	paused = true;
	ended = false;
    passed = false;
    collided = false;
    score = 0;
    high_score = localStorage.getItem('highscore');

    // Player
    player_grav = 0.75;
    player_jump_boost = 12.5;
	player_scale = 0.3;
	player_width = 444 * player_scale;
	player_height = 280 * player_scale;
    
    player = new Sprite(500, canvas.hh);
    
    player.img = player_img;
    player.collider = 'none';
	player.addCollider(0, 0, 444, 280)
	player.collider = 'd';
    player.layer = 1;
    player.scale = player_scale;

    // Forks
    fork_count = 4;
    fork_speed = 5;
    fork_gap = 400;
    fork_scale = 2;
    fork_height = 351 * fork_scale;
    fork_width = 45 * fork_scale;
    fork_offset_y_bounds = [300, 600];
    
    forks = new Group();
    
    forks.vel.x = -fork_speed;
    forks.collider = 'k';
	forks.layer = 1;
	forks.img = fork_img;
    forks.scale = fork_scale;

    fork_hitboxes = new Group();

	fork_hitboxes.layer = 0;
	fork_hitboxes.color = color(BG_COLOUR);
	fork_hitboxes.stroke = color(BG_COLOUR);
    fork_hitboxes.collider = 'k';

    add_all_forks();

    // Text
    text = new Group();

    text.textSize = 40;
    text.textColor = color('#ffffff');
    text.collider = 's';
    text.color = color('#080808');
    text.stroke = color('#080808');

	press_mouse_txt = new text.Sprite(500, canvas.h / 3, 500, 100);
	press_mouse_txt.text = 'Click to begin';
	press_mouse_txt.textColor = color('#ffff00');
	clicked = false;

    add_scores_text();

    // Sounds
    music.setVolume(0.1);
    music.autoplay = true;
    music.loop();

}

function draw() {

	frameRate(FPS);
	textFont(font);
    background(color(BG_COLOUR));

    // Game
	update_game();

    // Player
	update_player();
    
    // Forks
	update_forks();
    
}

function add_scores_text() {

    score_txt = new text.Sprite(120, 50, 200, 60);
    score_txt.text = 'Score';

    score_count_txt = new text.Sprite(120, 105, 200, 60);
    score_count_txt.text = score;
	score_count_txt.textColor = color('#ffff00');

    high_score_txt = new text.Sprite(canvas.w - 190, 50, 340, 60);
    high_score_txt.text = 'Highscore';
    
    high_score_count_txt = new text.Sprite(canvas.w - 190, 110, 340, 60);
    high_score_count_txt.text = high_score;
	high_score_count_txt.textColor = color('#ffff00');
    
}

function update_game() {

	input();
	if (!ended) {update_score()}
	score_count_txt.text = score;
	high_score_count_txt.text = high_score;

	if (paused) {world.timeScale = 0}
	if (!paused) {world.timeScale = 1}

}

function input() {

	if (!ended) {

		// Keypresses
		if (kb.presses('space')) {

			if (!paused) {paused = true}
			else if (paused && clicked) {paused = false}

		}

		if (mouse.presses()) {

			if (!clicked) {

				jump(); 
				clicked = true; 
				paused = false;
				press_mouse_txt.remove();

			}
			else {jump()}

		}

		// Collisions
		if (player.collides(fork_hitboxes)) {game_over()}
		check_out_of_bounds();

	}
	if (ended) {

		if (kb.presses('space')) {reset()}

	}

}

function update_score() {

    for (let i = 0; i < forks.length; i++) {

        let fork = forks[i];
        if (fork.x <= player.x && fork.passed == false && fork.rotation == 0) {
            
            score++;
            fork.passed = true;
            
        }
        
    }

    if (score > high_score) {
        
        high_score = score;
        localStorage.setItem('highscore', high_score);
        
    }
     
}

function game_over() {

    music.stop()

	game_over_txt = new text.Sprite(canvas.hw, canvas.hh, canvas.w, canvas.h + 500);
	game_over_txt.text = 'GAME OVER';
	game_over_txt.textColor = color('#ff4040');
	game_over_txt.color = color(BG_COLOUR);
	game_over_txt.textSize = 200;

	game_over_txt1 = new text.Sprite(canvas.hw, canvas.hh + 160, 800, 100);
	game_over_txt1.text = 'Press [SPACE] to restart';
	game_over_txt1.textColor = color('#ffffff');
	game_over_txt1.color = color(BG_COLOUR);
	game_over_txt1.stroke = color(BG_COLOUR);
	game_over_txt1.textSize = 50;

	add_scores_text()

	player.remove();
    player_death.play()
	ended = true;

}

function reset() {

	game_over_txt.remove();
	game_over_txt1.remove();
	forks.removeAll();
    fork_hitboxes.removeAll();
	setup();

}

// PLAYER
function update_player() {
	if (!paused && !ended) {fall()}
}

function jump() {
    
    player.vel.y = -player_jump_boost;
    player_jump.play()
    
}

function fall() {
    player.vel.y += player_grav;
}

function check_out_of_bounds() {
	if (player.y <= 0 + (player_height / 2) || player.y >= canvas.h - (player_height / 2)) {game_over()}
}

// FORKS
function update_forks() {

	// Fork Offscreen
	for (let i = 1; i < forks.length; i += 2) {

        let fork1 = forks[i - 1];
        let fork2 = forks[i];

        if (fork1.x <= 0 - fork_width / 2 || fork2.x <= 0 - fork_width / 2) {position_forks(canvas.w - fork_width / 2, fork1, fork2)}
        
    }

    // Fork Hitboxes
    for (let i = 0; i < forks.length; i++) {

		let hitbox = fork_hitboxes[i];
     	hitbox.x = forks[i].x;
		hitbox.y = forks[i].y;

    }
	
}

function add_forks(x) {

    let fork1 = new forks.Sprite(0, 0);
    let fork2 = new forks.Sprite(0, 0);
    fork2.rotation = 180;
    position_forks(x, fork1, fork2);
    
}

function add_all_forks() {
    
    for (let i = 0; i < fork_count; i++) {
		add_forks(x = canvas.w / 2 + (canvas.w / fork_count) * i + fork_width / 2);
	}

    for (let i = 0; i < forks.length; i++) {
		let hitbox = new fork_hitboxes.Sprite(0, 0, fork_width + 4, fork_height + 4);
    }
    
}

function position_forks(x, fork1, fork2) {

    fork_offset_y = random(fork_offset_y_bounds[0], fork_offset_y_bounds[1]);
		
	fork1.x = x;
    fork1.y = fork_offset_y + fork_height / 2 + fork_gap / 2;
	fork1.passed = false;

	fork2.x = x;
    fork2.y = fork_offset_y - fork_height / 2 - fork_gap / 2;
	fork2.passed = false;
    
}