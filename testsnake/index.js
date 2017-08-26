window.onload = function () {
	console.log('holy ballz!')
	var canvas = document.querySelector('.mah-canvas')
	var context = canvas.getContext('2d')
	var GAMESTART = false
	var snakeCubeSize = 10
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
		]
	}

	var eggs = [{
		pos: {
			x: 70,
			y: 50
		}
	}]

	function drawSnake(snake){
		snake.cubes.forEach((cube, key) => {
			if(key == 0){
				context.fillStyle = 'rgb(0, 200, 0)'
			} else {
				context.fillStyle = 'rgb(200, 200, 0)'
			}
			context.fillRect(cube.x, cube.y, snakeCubeSize, snakeCubeSize)	
		})	
	}


	function drawEgg(egg) {
		context.fillStyle = 'rgb(0,0,200)'
		context.fillRect(egg.pos.x, egg.pos.y, snakeCubeSize, snakeCubeSize)	
	}

	function getEgg(){
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


	

	var i = 0, j = 0, snakeSpeed = 60
	var x = 0, y = 0
	var t = 0


	var gameDrawLoop = (time) => {
		context.save()
		context.clearRect(0, 0, canvas.width, canvas.height)
		eggs.forEach((egg) => {
			drawEgg(egg)
		})
		
		if (isCollision(eggs, snake)){
			console.log('collide')
			snake.cubes.push({
				x: snake.cubes[snake.cubes.length - 1].px,
				y: snake.cubes[snake.cubes.length - 1].py,
			})
			eggs.pop();
			eggs.push(getEgg())
			
		}

		drawSnake(snake)
		
		context.restore()
		window.requestAnimationFrame(gameDrawLoop)

	}

	Math.random()


	function isCollision(eggs, snake){
		var detected = false
		eggs.forEach((egg) => {
			if (snake.cubes[0].x == egg.pos.x && 
				snake.cubes[0].y == egg.pos.y){
				detected = true
			}
		})
		
		return detected
	}


	gameDrawLoop()

	var snakeControlLoop = setInterval(() => {
		if (GAMESTART) {

			snake.cubes[0].px = snake.cubes[0].x
			snake.cubes[0].py = snake.cubes[0].y
			snake.cubes[0].x += i*snakeCubeSize
			snake.cubes[0].y += j*snakeCubeSize
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
	}, snakeSpeed)	
	
	


	var KEYCODES = {
		UP: '38',
		LEFT: '37',
		DOWN: '40',
		RIGHT: '39'
	}

	var validKeys = [38,37,40,39]

	document.addEventListener('keydown', (e) => {
		if(e.keyCode == KEYCODES.UP) i = 0, j = -1
		
		if(e.keyCode == KEYCODES.LEFT) i = -1, j = 0

		if(e.keyCode == KEYCODES.DOWN) i = 0, j = 1

		if(e.keyCode == KEYCODES.RIGHT) i = 1, j = 0

		if (validKeys.includes(e.keyCode)){
			GAMESTART = true
		}
	})

}

