// Screen Dimensions
const WIDTH = 1920;
const HEIGHT = 1080;

const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;

// Game
let paused;
let passed;
let collided;
let score;

// Text
let score_txt;

// Player
let player;
let player_img;
let player_grav;
let player_jump_boost;

// Forks
let forks;
let fork_scale_x;
let fork_scale_y;
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
	paused = false;
    passed = false;
    collided = false;
    score = 0;

    // Player
    player_grav = 0.75;
    player_jump_boost = 12.5;
    
    player = new Sprite(500, CENTER_Y);
    
    player.img = player_img;
    player.collider = 'k';
    player.layer = 1;
    player.scale = 0.3;

    // Forks
    fork_count = 4;
    fork_speed = 5;
    fork_gap = 400;
    fork_scale = 2;
    fork_height = 351 * fork_scale_y;
    fork_width = 69 * fork_scale_x;
    fork_offset_y_bounds = [400, 600];
    
    forks = new Group();
    
    forks.vel.x = -fork_speed;
    forks.collider = 'k';

    fork_hitboxes = new Group();
    fork_hitboxes.collider = 'k';
    fork_hitboxes.w = fork_width;
    fork_hitboxes.h = fork_height;
    fork_hitboxes.shapeColor.setAlpha(256)
    
    for (let i = 0; i < fork_count; i++) {

		add_forks(
			x = WIDTH + (WIDTH / fork_count) * i + fork_width / 2,
			img = fork_img
		)
        fork_hitboxes.add(new Sprite())
	
    }
    
    // Text
    text = new Group();
    text.textSize = 50;
    text.textColor = color('#ffffff');
    text.collider = 's';
    text.color = color('#080808');
    text.stroke = color('#080808');
    
    score_txt = new text.Sprite(100, 50, 160, 60);
    score_text.text = 'Score';
    
    score_count_txt = new text.Sprite(100, 100, 160, 60);
    score_count_txt.text = score;

}

function draw() {

    background(32);

    // Game
    update_score();
	input();

    // Player
    if (world.timeScale != 0) {fall()}

    // Forks
    for (let i = 1; i < forks.length; i += 2){

        let fork1 = forks[i - 1];
        let fork2 = forks[i];

        if (fork1.x <= 0 - fork_width / 2 || fork2.x <= 0 - fork_width / 2) {

			position_forks(WIDTH - fork_width / 2, fork1.id, fork1, fork2)

		}
        
    }
    // Fork Hitboxes
    for (let i = 0; i < forks.length; i++) {
        fork_hitboxes[i].moveTowards(forks[i], 1)
    }
}

function input() {

	if (kb.presses('space')) {

		if (!paused) {world.timeScale = 0; paused = true}
		else if (paused) {world.timeScale = 1; paused = false}

	}
	if (mouse.presses()) {jump()}
}

function update_score() {

    for (let i = 0; i < forks.length; i++) {

        let fork = forks[i];
        if (fork.x <= player.x && fork.passed == false && fork.orientation == 'up') {
            
            score++;
            score_count_txt.text = score;
            fork.passed = true;
            
        }
        
    }
    
}

// PLAYER
function jump() {
    player.vel.y = -player_jump_boost;
}

function fall() {
    player.vel.y += player_grav;
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
    fork2.rotation = 180
    fork2.passed = false
    fork2.orientation = 'down'

    position_forks(x, fork1, fork2)
    
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