	/**
	 *
	 *  Project cubed^3
	 *
	 *  Info: A take on recreating the classic game "Snake"
	 *
	 *  Start Date: Wednesday, Sept. 24, 2014 @ 5:25PM +8GMT
	 *
	 *  Copyright (c) kearlsaint@gmail.com
	 *
	 *  File: game.js
	 *
	 *  Disclaimer Notes:
	 *      If you want the source code, please visit
	 *    my github at http://github.com/kearlsaint
	 *
	 *    Thank you!
	 *
	**/

	"use strict"; // ECMA Strict Mode


	var context, snake, dir,
			square1, square2, square3,
			square4, square5, square6,
			square7, square8, square9,
			foodImage, loop, loopId,
			gameStart, gameOver, food,
			make, score, changeSpeed,
			speed, saveImage;

	// no more document.getElementById :p
	context = Game.getContext("2d");



	make = function(color){
		return (function(canvas, ctx){
			canvas.width = canvas.height = 1
			ctx = canvas.getContext("2d");
			ctx.fillStyle = color;
			ctx.fillRect(0,0,1,1);
			return canvas;
		})(document.createElement("canvas"))
	};



	square1 = make("white");
	square2 = make("#777777");
	square3 = make("#999999");
	square4 = make("#bbbbbb");
	square5 = make("#cccccc");
	square6 = make("#dddddd");



	foodImage = make("#20ad58");



	loop = function(){

		// reset the whole canvas
		Game.width = Game.width;
		
		// fill the background
		Game.getContext("2d").fillStyle = "#ddd";
		Game.getContext("2d").fillRect(0, 0, 640, 480);
		
		// parse the snake
		for(var i=0, x, y, z; i<snake.length; i++){
			z = snake[i];
			x = z[0];
			y = z[1];
			z[2] = x;
			z[3] = y;
			// update
			if(i===0){
				// its the head
				// check where to move next
				switch(dir){
					case 0: z[1]--; break;
					case 1: z[0]--; break;
					case 2: z[1]++; break;
					default: z[0]++;
				}
				// check if it has gotten the food
				if(z[0]===food[0] && z[1]===food[1]){
					// generate a new food location
					food = [Math.round(Math.random()*15), Math.round(Math.random()*11)];
					// make the snake longer by using the last part's previous location
					snake.push([snake[snake.length-1][2], snake[snake.length-1][3]]);
					// increment the score by 1
					score += speed/10;
					score = Math.round(score*10)/10;
					// play a sound
					soundManager.play("eat");
				}
			}else{
				// find where its previous shit is
				var px, py, pz, df, nx = false;
				pz = snake[i-1];
				px = pz[2];
				py = pz[3];
				z[0] = px;
				z[1] = py;
			}
			// check if it is outside the boundaries
			if(z[0]<0||z[1]<0||z[0]>=16||z[1]>=12){
				// gameover
				gameOver();
			}else{
				// render the snake part
				// check how many are intersecting at this location
				var x = 0;
				for(var k=0; k<snake.length; k++){
					if(k!==i){
						if(snake[k][0]===snake[i][0] && snake[k][1]===snake[i][1]){
							x++;
						}
					}
				}
				switch(x){
					case 0: context.drawImage(square1, snake[i][0]*40, snake[i][1]*40, 40, 40); break;
					case 1: context.drawImage(square2, snake[i][0]*40, snake[i][1]*40, 40, 40); break;
					case 2: context.drawImage(square3, snake[i][0]*40, snake[i][1]*40, 40, 40); break;
					case 3: context.drawImage(square4, snake[i][0]*40, snake[i][1]*40, 40, 40); break;
					case 4: context.drawImage(square5, snake[i][0]*40, snake[i][1]*40, 40, 40); break;
					default: context.drawImage(square6, snake[i][0]*40, snake[i][1]*40, 40, 40); break;
				}
			}
		} // end of for-loop
		
		// render the food
		context.drawImage(foodImage, food[0]*40, food[1]*40, 40, 40);

	};



	gameOver = function(){
		
		// stop the game loop
		clearInterval(loopId);
		
		// display the dialogue or overlay or whatever
		GameOver.style.display = "block";
		
		// highscore bullshit
		var hs = $.jStorage.get("cubedHS");
		
		if(hs===null || hs < score){
			$.jStorage.set("cubedHS", score.toString());
			Score.innerHTML = "New highscore! <br> [ "+score.toString()+" ]";
		}else{
			
			Score.innerHTML = "Highscore: [ "+hs+" ]<br>Current score: [ "+score.toString()+" ]";
			
		}

	};
	
	
	// set the speed
	if($.jStorage.get("cubedSpeed")===null){
		$.jStorage.set("cubedSpeed","10");
		speed = 10;
	}else{
		speed = parseInt($.jStorage.get("cubedSpeed"));
	}
	Speed.value = speed;



	gameStart = function(){

		// stop any loop left
		clearInterval(loopId);

		// 0=top, 1=left, 2=bottom, 3=right
		dir = 3;

		// reset the score
		score = 0;
		
		// default snake location
		snake = [[3,0], [2,0], [1,0], [0,0]];
		
		// random food location
		food  = [Math.round(Math.random()*15), Math.round(Math.random()*11)];
		
		// start the loop
		loop();
		
		// loop interval
		// not using requestAnimationFrame here...
		loopId = setInterval(loop, 1000/(speed*1.5));
		
		// remove the gameover overlay
		GameOver.style.display = "none";

	};
	
	changeSpeed = function(e){
	
		// get the value
		var value = e.value;
		
		// save the speed
		$.jStorage.set("cubedSpeed", value.toString());

		// stop the current loop
		speed = parseInt(value);
	
	};



	// listen for wasd and arrow keys
	document.body.addEventListener("keydown", function(e){

		switch(e.keyCode){
		
			// go up
			case 38: case 87: dir = 0; break;
			// go left
			case 37: case 65: dir = 1; break;
			// go down
			case 40: case 83: dir = 2; break;
			// go right
			case 39: case 68: dir = 3; break;
			// reset
			case 32: gameStart(); break;
		}
		
	});
	
	
	// function used to save the image
	saveImage = function(){
		var img = new Image;
		img.src = 'data:image/png;base64,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';
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
		canvas.width = 640;
		canvas.height = 582.4;
		context.drawImage(Game, 0, 0, 640, 480);
		context.drawImage(img, 0, 480, 640, 102.4);
		window.open(canvas.toDataURL("image/png"));
	};

	
	
	soundManager.setup({
		url: "js/dependencies/swf",
		useFlashBlock: false,
		debugMode: false,
		bgColor: "#000000",
		wmode: "transparent",
		allowScriptAccess: "always",
		useFastPolling: true,
		flashVersion: 9,
		flashLoadTimeout: 5000,
		preferFlash: false,
		useHTMLAudio: true,
		ontimeout:function(){
			console.log("soundManager resources have timed out.");
		},
		onready:function(){
			var list = [
				"audio/eat.ogg"
			//	"audio/bgm1.ogg",
			//	"audio/bgm2.ogg",
			//	"audio/bgm3.ogg"
			];
			var name, path;
			for(var s=0; s<list.length; s++){
				path = list[s];
				name = path.replace(/\\/g, '/');
				name = path.substring(name.lastIndexOf('/')+1,name.lastIndexOf('.'));
				soundManager.createSound({
					id: name,
					url: path,
					autoLoad: true,
					autoPlay: false,
					multiShot: true,
					volume: 20
				});
			}
		}
	});
	
	
	// 107, 194, 143
	/*var bgmPlaying = false;
	var bgmPlayId  = 1;
	var bgmChecker = function(){
		if(bgmPlaying===false){
			switch(bgmPlayId){
				case 1:
					if(soundManager.play("bgm1", {loops:3})!==false){
						bgmPlaying = true;
						bgmPlayId = 2;
						clearInterval(bgmInterval);
						bgmInterval = setInterval(bgmChecker, 107*1000);
					}
				break;
				case 2:
					if(soundManager.play("bgm2")!==false){
						bgmPlaying = true;
						bgmPlayId = 3;
						clearInterval(bgmInterval);
						bgmInterval = setInterval(bgmChecker, 194*1000);
					}
				break;
				case 3:
					if(soundManager.play("bgm3")!==false){
						bgmPlaying = true;
						bgmPlayId = 1;
						clearInterval(bgmInterval);
						bgmInterval = setInterval(bgmChecker, 143*1000);
					}
				break;
			}
		}
	};
	var bgmInterval = setInterval(bgmChecker, 1000);*/
	
	
/* EOF */