// Screen Dimensions
const WIDTH = 1920;
const HEIGHT = 1080;

const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;

const BG_COLOUR = '#101010'

// Game
let paused;
let ended;
let passed;
let collided;
let score;
let high_score;

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
    
    player_img = loadImage('images/player/taco0.png');
    fork_img = loadImage('images/fork/fork.png');
    
}

// GAME
function setup() {

    new Canvas(WIDTH, HEIGHT);

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
    
    player = new Sprite(500, CENTER_Y);
    
    player.img = player_img;
    player.collider = 'none';
	player.addCollider(0, 0, 444, 280)
	player.collider = 'd';
    player.layer = 1;
    player.scale = player_scale;
	player.debug = true;

    // Forks
    fork_count = 4;
    fork_speed = 5;
    fork_gap = 400;
    fork_scale = 2;
    fork_height = 351 * fork_scale;
    fork_width = 69 * fork_scale;
    fork_offset_y_bounds = [300, 600];
    
    forks = new Group();
    
    forks.vel.x = -fork_speed;
    forks.collider = 'k';
	forks.layer = 1;

    fork_hitboxes = new Group();
	fork_hitboxes.layer = 1;
	fork_hitboxes.color = color(BG_COLOUR)
    fork_hitboxes.collider = 'k';
	fork_hitboxes.debug = true;

    add_all_forks()

    // Text
    text = new Group();

    text.textSize = 50;
    text.textColor = color('#ffffff');
    text.collider = 's';
    text.color = color('#080808');
    text.stroke = color('#080808');
    
    score_txt = new text.Sprite(100, 50, 160, 60);
    score_txt.text = 'Score';
    
    score_count_txt = new text.Sprite(100, 100, 160, 60);
    score_count_txt.text = score;

	press_mouse_txt = new text.Sprite(WIDTH / 2, HEIGHT / 2, 400, 100);
	press_mouse_txt.text = 'Click to begin';
	clicked = false;

    high_score_txt = new text.Sprite(WIDTH - 200, 50, 250, 70);
    high_score_txt.text = 'Highscore';
    
    high_score_count_txt = new text.Sprite(WIDTH - 200, 115, 250, 60);
    high_score_count_txt.text = high_score;

}

function draw() {

    background(color(BG_COLOUR));

    // Game
    update_score();
	input();
    score_count_txt.text = score;
    high_score_count_txt.text = high_score;
	if (paused) {world.timeScale = 0}
	if (!paused) {world.timeScale = 1}

    // Player
    if (!paused && !ended) {fall()}

    // Forks
    for (let i = 1; i < forks.length; i += 2) {

        let fork1 = forks[i - 1];
        let fork2 = forks[i];

        if (fork1.x <= 0 - fork_width / 2 || fork2.x <= 0 - fork_width / 2) {position_forks(WIDTH - fork_width / 2, fork1, fork2)}
        
    }
    // Fork Hitboxes
    for (let i = 0; i < forks.length; i++) {

		let hitbox = fork_hitboxes[i];
        hitbox.x = forks[i].x;
		hitbox.y = forks[i].y;

    }
}

function input() {

	if (!ended) {

		// Keypresses
		if (kb.presses('space')) {

			if (!paused) {paused = true}
			else if (paused) {paused = false}

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
		if (player.collided(fork_hitboxes)) {game_over()}
		check_out_of_bounds();

	}
	if (ended) {

		if (kb.presses('space')) {reset()}

	}

}

function update_score() {

    for (let i = 0; i < forks.length; i++) {

        let fork = forks[i];
        if (fork.x <= player.x && fork.passed == false && fork.orientation == 'up') {
            
            score++;
            fork.passed = true;
            
        }
        
    }

    if (score > high_score) {
        
        high_score = score;
        localStorage.setItem('highscore', high_score)
        
    }
     
}

function game_over() {

	game_over_txt = new text.Sprite(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT);
	game_over_txt.text = 'GAME OVER\n PRESS [SPACE] TO RESTART';
	player.remove();
	ended = true;

}

function reset() {

	ended = false;
	score = 0;
	game_over_txt.remove();
	forks.removeAll()
    fork_hitboxes.removeAll()
    add_all_forks()
    
	player = new Sprite(500, CENTER_Y);
    player.img = player_img;
    player.collider = 'none';
	player.addCollider(0, 0, 444, 280)
	player.collider = 'd';
    player.layer = 1;
    player.scale = 0.3;
	player.debug = true;

}

// PLAYER
function jump() {
    player.vel.y = -player_jump_boost;
}

function fall() {
    player.vel.y += player_grav;
}

function check_out_of_bounds() {
	if (player.y <= 0 + (player_height / 2) || player.y >= HEIGHT - (player_height / 2)) {game_over()}
}

// FORKS
function add_forks(x, img) {

    let fork1 = new forks.Sprite(0, 0);
    fork1.img = img;
    fork1.scale = fork_scale;
	fork1.collider = 'k';
    fork1.passed = false;
    fork1.orientation = 'up';

    let fork2 = new forks.Sprite(0, 0);
    fork2.img = img;
    fork2.scale = fork_scale;
	fork2.collider = 'k';
    fork2.rotation = 180;
    fork2.passed = false;
    fork2.orientation = 'down';

    position_forks(x, fork1, fork2);
    
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

function add_all_forks() {
    
    for (let i = 0; i < fork_count; i++) {

		add_forks(
			x = WIDTH / 2 + (WIDTH / fork_count) * i + fork_width / 2,
			img = fork_img
		);
	
	}

    for (let i = 0; i < forks.length; i++) {

		let hitbox = new fork_hitboxes.Sprite(0, 0, fork_width, fork_height);
		hitbox.color = fork_hitboxes.color;
		hitbox.collider = 'k';

    }
    
}