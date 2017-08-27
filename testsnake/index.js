var KEYCODES = {
	UP: '38',
	LEFT: '37',
	DOWN: '40',
	RIGHT: '39'
}

var VALID_KEYS = [38,37,40,39]

function drawSnake(snake, context){
	snake.cubes.forEach((cube, key) => {
		if(key == 0){
			context.fillStyle = 'rgb(0, 200, 0)'
		} else {
			context.fillStyle = 'rgb(200, 200, 0)'
		}
		context.fillRect(cube.x, cube.y, snake.size, snake.size)	
	})	
}


function drawEgg(egg, size, context) {
	context.fillStyle = 'rgb(0,0,200)'
	context.fillRect(egg.pos.x, egg.pos.y, size, size)	
}

function getNewEgg(){
	var temp = Math.floor(Math.random() * 1000)
	var x = (temp)%450 - ((temp)%450)%10
	temp = Math.floor(Math.random() * 1000)
	var y = (temp)%450 - ((temp)%450)%10

	return {
		pos: {
			x: x,
			y: y
		}
	}
}

var createGame = (canvas, context, eggs, snake) => {
	var stopLoop = false
	
	function start(time){
		if (stopLoop){
			// set to false so start can be called again after stop
			stopLoop = false 
			return null
		}
		else {
			context.save()
			context.clearRect(0, 0, canvas.width, canvas.height)
			eggs.forEach((egg) => {
				drawEgg(egg, snake.size, context)
			})
			
			if (isEggEaten(eggs, snake)){
				snake.cubes.push({
					x: snake.cubes[snake.cubes.length - 1].px,
					y: snake.cubes[snake.cubes.length - 1].py,
				})
				eggs.pop();
				eggs.push(getNewEgg())
				
			}

			// if (snakeAteSelf(snake)){

			// }

			drawSnake(snake, context)
			
			context.restore()
			window.requestAnimationFrame(start)		
		}
		
	}

	function stop(){
		stopLoop = true
	}

	return {
		start: start,
		stop: stop
	}
	

}

function isEggEaten(eggs, snake){
	var detected = false
	eggs.forEach((egg) => {
		if (snake.cubes[0].x == egg.pos.x && 
			snake.cubes[0].y == egg.pos.y){
			detected = true
		}
	})
	
	return detected
}

function startSnakeMovement(snake, canvas){
	snake.cubes[0].px = snake.cubes[0].x
	snake.cubes[0].py = snake.cubes[0].y
	snake.cubes[0].x += snake.vector.i * snake.size
	snake.cubes[0].y += snake.vector.j * snake.size
	if (snake.cubes[0].x > canvas.width) snake.cubes[0].x = 0;
	if (snake.cubes[0].x < 0) snake.cubes[0].x = canvas.width;
	if (snake.cubes[0].y > canvas.height) snake.cubes[0].y = 0;
	if (snake.cubes[0].y < 0 ) snake.cubes[0].y = canvas.height;

	for (var itr = 0; itr < snake.cubes.length; itr++){
		if (itr != 0) {
			snake.cubes[itr].px = snake.cubes[itr].x
			snake.cubes[itr].py = snake.cubes[itr].y
			snake.cubes[itr].x = snake.cubes[itr - 1].px
			snake.cubes[itr].y = snake.cubes[itr - 1].py
		}	
	}
}


window.onload = function () {
	var canvas = document.querySelector('.mah-canvas')
	var context = canvas.getContext('2d')

	var GAMESTART = false
	
	var snake = {
		cubes: [
			{x: 100, y: 0, px: 90, py: 0},
			{x: 90, y: 0, px: 80, py: 0},
			{x: 80, y: 0, px: 70, py: 0},
			{x: 70, y: 0, px: 60, py: 0},
			{x: 60, y: 0, px: 50, py: 0},
			{x: 50, y: 0, px: 40, py: 0},
			{x: 40, y: 0, px: 30, py: 0},
			{x: 30, y: 0, px: 20, py: 0},
			{x: 20, y: 0, px: 10, py: 0},
			{x: 10, y: 0, px: 0, py: 0},
			{x: 0, y:0, px: 0, py: 0}
		],

		speed: 60,

		vector: {
			i: 0,
			j: 0
		},

		size: 10

	}

	var eggs = [{
		pos: {
			x: 70,
			y: 50
		}
	}]


	
	window.Game = createGame(canvas, context, eggs, snake)
	window.Game.start();
	
	document.addEventListener('keydown', (e) => {
		if(e.keyCode == KEYCODES.UP) snake.vector.i = 0, snake.vector.j = -1
		
		if(e.keyCode == KEYCODES.LEFT) snake.vector.i = -1, snake.vector.j = 0

		if(e.keyCode == KEYCODES.DOWN) snake.vector.i = 0, snake.vector.j = 1

		if(e.keyCode == KEYCODES.RIGHT) snake.vector.i = 1, snake.vector.j = 0

		if (VALID_KEYS.includes(e.keyCode)){
			GAMESTART = true
		}
	})

	var snakeControlLoop = setInterval(() => {
		if (GAMESTART) {
			startSnakeMovement(snake, canvas);
		}
	}, snake.speed)
	
	

}

