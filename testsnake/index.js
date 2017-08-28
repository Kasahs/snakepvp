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

function getNewEgg(area){
	var temp = Math.floor(Math.random() * 1000)
	var x = (temp)%area - ((temp)%area)%10
	temp = Math.floor(Math.random() * 1000)
	var y = (temp)%area - ((temp)%area)%10

	return {
		pos: {
			x: x,
			y: y
		}
	}
}

var createGame = (canvas, context, eggs, snake) => {
	var gameOn = false
	var stopLoop = false
	
	function start(time){
		if (stopLoop){
			// set to false so start can be called again after stop
			stopLoop = false 
			return null
		}
		else {
			gameOn = true
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
				eggs.push(getNewEgg(canvas.width))
				
			}

			// if (snakeAteSelf(snake)){

			// }

			drawSnake(snake, context)
			
			context.restore()
			window.requestAnimationFrame(start)		
		}
		
	}

	function stop(){
		gameOn = false
		stopLoop = true
	}

	function isGameOn(){
		return gameOn
	}

	return {
		start: start,
		stop: stop,
		isOn: isGameOn
	}
	

}

function isEggEaten(eggs, snake){
	var detected = false
	var snakeHead = snake.cubes[0]
	eggs.forEach((egg) => {
		if (snakeHead.x == egg.pos.x && 
			snakeHead.y == egg.pos.y){
			detected = true
		}
	})
	
	return detected
}


function moveSnakeWhileAlive(snake, canvas){
	var snakeHead = snake.cubes[0]
	snakeHead.px = snakeHead.x
	snakeHead.py = snakeHead.y
	
	if (snakeHead.x > canvas.width - snake.size) {
		snakeHead.x = 0 
	} else if (snakeHead.x < 0) {
		snakeHead.x = canvas.width - snake.size
	} else if (snakeHead.y > canvas.height - snake.size) {
		snakeHead.y = 0
	} else if (snakeHead.y < 0) {
		snakeHead.y = canvas.height - snake.size
	} else {
		snakeHead.x += snake.vector.i * snake.size
		snakeHead.y += snake.vector.j * snake.size
	}

	for (var itr = 0; itr < snake.cubes.length; itr++){
		if (itr != 0) {
			snake.cubes[itr].px = snake.cubes[itr].x
			snake.cubes[itr].py = snake.cubes[itr].y
			snake.cubes[itr].x = snake.cubes[itr - 1].px
			snake.cubes[itr].y = snake.cubes[itr - 1].py
			if (snake.cubes[itr].x === snakeHead.x && 
				snake.cubes[itr].y === snakeHead.y) {
				return false	
			}
		}	
	}
	return true
}

function isImpossibleMove(keyCode, snake){
	if(keyCode == KEYCODES.UP && snake.vector.j === 1){
		return true
	}
	if(keyCode == KEYCODES.DOWN && snake.vector.j === -1){
		return true
	}
	if(keyCode == KEYCODES.LEFT && snake.vector.i === 1){
		return true
	}
	if(keyCode == KEYCODES.RIGHT && snake.vector.i === -1){
		return true
	}

	return false
}


window.onload = function () {
	var canvas = document.querySelector('.mah-canvas')
	var context = canvas.getContext('2d')

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

		speed: 120,

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

	document.addEventListener('keydown', (e) => {
		if(e.keyCode == KEYCODES.UP && !isImpossibleMove(e.keyCode, snake)) {
			snake.vector.i = 0, snake.vector.j = -1
		}
		
		if(e.keyCode == KEYCODES.LEFT && !isImpossibleMove(e.keyCode, snake)) {
			snake.vector.i = -1, snake.vector.j = 0
		}

		if(e.keyCode == KEYCODES.DOWN && !isImpossibleMove(e.keyCode, snake)) {
			snake.vector.i = 0, snake.vector.j = 1
		}
			

		if(e.keyCode == KEYCODES.RIGHT && !isImpossibleMove(e.keyCode, snake)) {
			snake.vector.i = 1, snake.vector.j = 0
		}

		if (VALID_KEYS.includes(e.keyCode) && !Game.isOn()){
			
			window.Game.start();
			
			var snakeControlLoop = setInterval(() => {
				var isSnakeAlive = moveSnakeWhileAlive(snake, canvas);
				if(!isSnakeAlive){
					window.Game.stop()
					window.clearInterval(snakeControlLoop)
				}
			}, snake.speed)
		}
	})

	
	
	

}

