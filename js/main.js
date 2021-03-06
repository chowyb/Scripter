window.addEventListener("DOMContentLoaded", init, false); 

var teams;
var character;
var teamToMove;
var currChar;
var currMap;
var fruits;
var fruitsEaten;
var eatenArray;
var mouseRow;
var mouseCol;
var turn;
var inPlay;
var printInterval = setInterval(function() {console.log("debug interval")}, 60000);
function init() {
	teams = new Array();
	for (var i = 0; i < 2; i++) {
		teams[i] = new Array();
	}
	teamToMove = -1;
	fruits = new Array();
	fruitsEaten = 0;
	eatenArray = [0, 0];
	mouseRow = -1;
	mouseCol = -1;
	turn = 1;
	var mapNo = 1;
	inPlay = true;
	currMap = LoadMap("0" + mapNo.toString());
	currMap.drawMap(0, 0);
	teams[0][0] = new GameCharacter(0, 0, 1, currMap);
	teams[0][1] = new GameCharacter(9, 14, 2, currMap);
	teams[1][0] = new GameCharacter(9, 0, 6, currMap);
	teams[1][1] = new GameCharacter(0, 14, 7, currMap);
    var canvas = document.getElementById("canvas");
    canvas.addEventListener("mousedown", getPositionClick, false);
    canvas.addEventListener("mousemove", getPositionMove, false);
	canvas.setAttribute("tabindex", 0);
	canvas.addEventListener("keydown", getKeyDown, false);
	var context = canvas.getContext("2d");
	context.clearRect(400, 550, 85, 30);
	loadAndDrawImage("images/endturn.png", 400, 550);
	updateTurn();
	for (var i = 0; i < teams.length; i++) {
		for (var j = 0; j < teams[i].length; j++) {
			teams[i][j].drawCurrPos();
		}
	}
	for (var i = 0; i < fruits.length; i++) {
		fruits[i].drawCurrPos();
	}
}

function loadAndDrawImage(url, x, y)
{
    // Create an image object. This is not attached to the DOM and is not part of the page.
    var image = new Image();
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
 
    // When the image has loaded, draw it to the canvas
    image.onload = function() {
        context.drawImage(image, x, y);
    };
 
    // Now set the source of the image that we want to load
    image.src = url;
}

function getPositionClick(event) {
	var x = new Number();
	var y = new Number();
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	
	if (event.x != undefined && event.y != undefined) {
		x = event.x;
		y = event.y;
	}
	else { // Firefox method to get the position
		x = event.clientX + document.body.scrollLeft +
			document.documentElement.scrollLeft;
		y = event.clientY + document.body.scrollTop +
			document.documentElement.scrollTop;
	}

	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	
	if (inPlay) {
		//end turn button
		if (x >= 400 && x <= 485 && y >= 550 && y <= 580) {
			if (currChar != null) {
				currChar.move(currChar.row, currChar.col);
				currChar = null;
			}
			for (i = 0; i < teams.length; i++) {
				for (j = 0; j < teams[i].length; j++) {
					teams[i][j].drawCurrPos();
				}
			}
			for (var i = 0; i < fruits.length; i++) {
				fruits[i].drawCurrPos();
			}
			updateTurn();
			return;
		}
	
		var i;
		var j;
		if (currChar == null) {
			var row = Math.floor(y / 50);
			var col = Math.floor(x / 50);
			for (i = 0; i < character.length; i++) {
				if (character[i].row === row && character[i].col === col && character[i].currAP > 0) {
					currChar = character[i];
				}
			}
		}
		if (currChar != null) {
			var rowMove = Math.floor(y / 50);
			var colMove = Math.floor(x / 50);
			currChar.move(rowMove, colMove);
			mouseOverPrint(rowMove, colMove);
			for (i = 0; i < teams.length; i++) {
				for (j = 0; j < teams[i].length; j++) {
					teams[i][j].drawCurrPos();
				}
			}
			for (var i = 0; i < fruits.length; i++) {
				fruits[i].drawCurrPos();
			}
			updateStatus();
			if (currChar.currAP <= 0 || currChar.actionPointsMap[rowMove][colMove] < 0) {
				currChar.move(currChar.row, currChar.col);
				currChar = null;
				setTimeout(function() {
					for (i = 0; i < teams.length; i++) {
						for (j = 0; j < teams[i].length; j++) {
							teams[i][j].drawCurrPos();
						}
					}
					for (var i = 0; i < fruits.length; i++) {
						fruits[i].drawCurrPos();
					}
					context.clearRect(0, 585, 350, 120);
				}, 20);
			}
			else {
				currChar.toMove(currMap);
			}
		}
		var toRefresh = true;
		for (i = 0; i < character.length; i++) {
			if (character[i].currAP > 0) {
				toRefresh = false;
			}
		}
		if (toRefresh) {
			updateTurn();
		}
	}
	else {
		if (x >= 400 && x <= 485 && y >= 550 && y <= 580) {
			init();
		}
	}
}

function getPositionMove(event) {
    var x = new Number();
    var y = new Number();
    var canvas = document.getElementById("canvas");

    if (event.x != undefined && event.y != undefined) {
        x = event.x;
        y = event.y;
    }
    else { // Firefox method to get the position
        x = event.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
	
	var row = Math.floor(y / 50);
	var col = Math.floor(x / 50);
	if (row != mouseRow || col != mouseCol) {
		mouseOverPrint(row, col);
	}
	
	/*var context = canvas.getContext("2d");
	context.clearRect(800, 100, 100, 100);
	context.font = '10pt Calibri';
	context.fillStyle = 'black';
	context.fillText(x + ", " + y, 820, 120);*/
}

function getKeyDown(event) {
	var i;
	var j;
	var tempChar;
	var compCharID;
	var possibleMatch = false;
	if (inPlay) {
		if (event.keyCode == 81) {
			if (currChar != null) {
				compCharID = currChar.id;
			}
			else {
				compCharID = -1;
			}
			for (i = 0; i < character.length; i++) {
				if (character[i].currAP > 0) {
					possibleMatch = true;
					if (character[i].id > compCharID) {
						tempChar = character[i];
						break;
					}
				}
			}
			if (possibleMatch && tempChar == null) {
				for (i = 0; i < character.length; i++) {
					if (character[i].currAP > 0 && character[i].id != compCharID) {
						tempChar = character[i];
					}
				}
			}
			if (currChar != null && tempChar != null) {
				currChar.move(currChar.row, currChar.col);
				currChar = null;
				setTimeout(function() {
					for (i = 0; i < teams.length; i++) {
						for (j = 0; j < teams[i].length; j++) {
							teams[i][j].drawCurrPos();
						}
					}
					for (i = 0; i < fruits.length; i++) {
						fruits[i].drawCurrPos();
					}
					context.clearRect(0, 585, 350, 120);
				}, 20);
			}
			if (tempChar != null) {
				currChar = tempChar;
				updateStatus();
				setTimeout(function() {
					tempChar.toMove(currMap);
				}, 20);
			}
		}
		else if (event.keyCode == 69) {
			if (currChar != null) {
				currChar.move(currChar.row, currChar.col);
				currChar = null;
			}
			updateTurn();
			for (i = 0; i < teams.length; i++) {
				for (j = 0; j < teams[i].length; j++) {
					teams[i][j].drawCurrPos();
				}
			}
			for (var i = 0; i < fruits.length; i++) {
				fruits[i].drawCurrPos();
			}
		}
	}
}

function mouseOverPrint(row, col) {
	clearInterval(printInterval);
	mouseRow = row;
	mouseCol = col;
	var i;
	var j;
	var k = 0;
	var mouseChar = new Array();
	for (i = 0; i < teams.length; i++) {
		for (j = 0; j < teams[i].length; j++) {
			if (teams[i][j].row === row && teams[i][j].col === col) {
				mouseChar[k++] = teams[i][j];
			}
		}
	}
	var mouseFruit;
	for (i = 0; i < fruits.length; i++) {
		if (fruits[i].row == row && fruits[i].col == col) {
			mouseFruit = fruits[i];
			break;
		}
	}
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	context.clearRect(0, 585, 350, 200);
	context.font = '12pt Calibri';
	context.fillStyle = 'black';
	if (currChar != null) {
		if (currChar.actionPointsMap[row][col] >= 0) {
			context.fillText(currChar.actionPointsMap[row][col] + " AP left after moving", 0, 600);
		}
		else if (currChar.actionPointsMap[row][col] < 0) {
			context.fillText("Out of range", 0, 600);
		}
	}
	if (mouseFruit != null) {
		context.fillText("Fruit: " + mouseFruit.digestCost + " turns to digest", 0, 620);
	}
	for (i = 0; i < mouseChar.length; i++) {
		context.font = '10pt Calibri';
		loadAndDrawImage("images/char" + mouseChar[i].imagePath + ".png", 0 + Math.floor(i / 2) * 180, 620 + (i % 2) * 80)
		context.fillText("Action Points: " + mouseChar[i].currAP + "/" + (5 + mouseChar[i].level), 40 + Math.floor(i / 2) * 180, 630 + (i % 2) * 80);
		context.fillText("Current AP Regen: " + (4 + Math.ceil(mouseChar[i].level / 3) - mouseChar[i].digestion), 40 + Math.floor(i / 2) * 180, 645 + (i % 2) * 80);
		context.fillText("Level: " + mouseChar[i].level, 40 + Math.floor(i / 2) * 180, 660 + (i % 2) * 80);
		context.fillText("Digestion Penalty: " + mouseChar[i].digestion, 40 + Math.floor(i / 2) * 180, 675 + (i % 2) * 80);
	}
}

function updateStatus() {
	var i;
	var currFruitIndex = -1;
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	for (i = 0; i < fruits.length; i++) {
		if (fruits[i].row == currChar.row && fruits[i].col == currChar.col) {
			currFruitIndex = i;
		}
	}
	
	// eating fruit
	if (currFruitIndex != -1) {
		currChar.level++;
		currChar.digestion += fruits[currFruitIndex].digestCost;
		context.clearRect(5 + currChar.col * 50, 5 + currChar.row * 50, 40, 40);
		currChar.drawCurrPos();
		spawnFruit(currFruitIndex);
		fruitsEaten++;
		eatenArray[teamToMove]++;
	}
	context.clearRect(0, 510, 350, 80);
	context.font = '10pt Calibri';
	context.fillStyle = 'black';
	loadAndDrawImage("images/char" + currChar.imagePath + ".png", 0, 520);
	context.fillText("Action Points: " + currChar.currAP + "/" + (5 + currChar.level), 40, 530);
	context.fillText("Current AP Regen: " + (4 + Math.ceil(currChar.level / 3) - currChar.digestion), 40, 545);
	context.fillText("Level: " + currChar.level, 40, 560);
	context.fillText("Digestion Penalty: " + currChar.digestion, 40, 575);
	context.clearRect(400, 600, 350, 80);
	context.fillText("Fruits Eaten: ", 400, 610);
	context.fillText("Red:  " + eatenArray[0], 400, 625);
	context.fillText("Blue: " + eatenArray[1], 400, 640);
	if (eatenArray[0] >= 10) {
		window.alert("Red wins!");
		inPlay = false;
		context.clearRect(400, 550, 85, 30);
		loadAndDrawImage("images/restart.png", 400, 550);
	}
	else if (eatenArray[1] >= 10) {
		window.alert("Blue wins!");
		inPlay = false;
		context.clearRect(400, 550, 85, 30);
		loadAndDrawImage("images/restart.png", 400, 550);
	}
}

function updateTurn() {
	if (inPlay) {

		// turn transition
		teamToMove++;
		if (teamToMove >= teams.length) {
			teamToMove = 0;
			turn++;
		}
		character = teams[teamToMove];
	
		// updating of characters
		for (var i = 0; i < character.length; i++) {
			character[i].currAP += (4 + Math.ceil(character[i].level / 3) - character[i].digestion);
			if (character[i].currAP > (5 + character[i].level)) {
				character[i].currAP = 5 + character[i].level;
			}
			if (character[i].digestion > 0) {
				character[i].digestion--;
			}
			character[i].initActionPointsMap(currMap);
			character[i].getActionPointsMap(currMap);
		}
	
		// updating and spawning of fruits
		for (var i = 0; i < fruits.length; i++) {
			if (fruits[i].digestCost > 0) {
				fruits[i].digestCost--;
			}
		}
		if (fruits.length * 10 < turn) {
			spawnFruit(fruits.length);
		}
	
	
		// display
		var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d");
		context.clearRect(400, 505, 200, 40);
		context.font = '14pt Calibri';
		context.fillStyle = 'black';
		context.fillText("Turn: " + turn, 400, 520);
		var teamColour;
		switch (teamToMove) {
			case 0:
				teamColour = "Red";
				break;
			case 1:
				teamColour = "Blue";
				break;
		}
		for (var i = 0; i < teams.length; i++) {
			for (var j = 0; j < teams[i].length; j++) {
				context.clearRect(teams[i][j].col * 50 + 10, teams[i][j].row * 50 + 10, 30, 30);
				teams[i][j].drawCurrPos();
			}
		}
		context.fillText(teamColour + " to move", 500, 520);
	}
}

function tileUpdate(row, col) {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	context.clearRect(col * 50, row * 50, 50, 50);
	var tileNo = currMap.map[row][col];
	var tileStr = tileNo.toString();
	while (tileStr.length < 4) {
		tileStr = "0" + tileStr;
	}
	for (var i = 0; i < teams.length; i++) {
		if (i != teamToMove) {
			for (var j = 0; j < teams[i].length; j++) {
				if (teams[i][j].row == row && teams[i][j].col == col) {
					teams[i][j].drawCurrPosDim();
				}
			}
		}
	}
	for (var i = 0; i < teams[teamToMove].length; i++) {
		if (teams[i][j].row == row && teams[i][j].col == col) {
			if (teams[i][j].currAP <= 0) {
				teams[i][j].drawCurrPosDim();
			}
			else {
				teams[i][j].drawCurrPos();
			}
		}
	}
	for (var i = 0; i < fruits.length; i++) {
		if (fruits[i].row == row && fruits[i].col == col) {
			fruits[i].drawCurrPos();
		}
	}
}

function tileUpdateGreen(row, col) {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	context.clearRect(col * 50, row * 50, 50, 50);
	var tileNo = currMap.map[row][col];
	tileNo += 16;
	var tileStr = tileNo.toString();
	while (tileStr.length < 4) {
		tileStr = "0" + tileStr;
	}
	window.alert(tileStr);
	loadAndDrawImage(tileStr + ".png", col * 50, row * 50);
	for (var i = 0; i < teams.length; i++) {
		if (i != teamToMove) {
			for (var j = 0; j < teams[i].length; j++) {
				if (teams[i][j].row == row && teams[i][j].col == col) {
					teams[i][j].drawCurrPosGreenDim();
				}
			}
		}
	}
	for (var i = 0; i < teams[teamToMove].length; i++) {
		if (teams[i][j].row == row && teams[i][j].col == col) {
			if (teams[i][j].currAP <= 0) {
				teams[i][j].drawCurrPosGreenDim();
			}
			else {
				teams[i][j].drawCurrPosGreen();
			}
		}
	}
	for (var i = 0; i < fruits.length; i++) {
		if (fruits[i].row == row && fruits[i].col == col) {
			fruits[i].drawCurrPos();
		}
	}
}

function spawnFruit(index) {
	var row;
	var col;
	var loop = true;
	var cost = Math.floor(Math.random() * (8 + Math.floor(fruitsEaten / 10)));
	while (loop) {
		loop = false;
		row = Math.floor(Math.random() * currMap.map.length);
		col = Math.floor(Math.random() * currMap.map[0].length);
		for (var i = 0; i < teams.length; i++) {
			for (var j = 0; j < teams[i].length; j++) {
				if (teams[i][j].row == row && teams[i][j].col == col) {
					loop = true;
				}
			}
		}
		for (var i = 0; i < fruits.length; i++) {
			if (fruits[i].row == row && fruits[i].col == col) {
				loop = true;
			}
		}
	}
	fruits[index] = new Fruit(row, col, cost);
}

function HoriWall(rows, cols) {
	this.wallArr = new Array();
	for (var i = 0; i < rows - 1; i++) {
		this.wallArr[i] = new Array();
		for (var j = 0; j < cols; j++) {
			this.wallArr[i][j] = 0;
		}
	}
}

function VertWall(rows, cols) {
	this.wallArr = new Array();
	for (var i = 0; i < rows; i++) {
		this.wallArr[i] = new Array();
		for (var j = 0; j < cols - 1; j++) {
			this.wallArr[i][j] = 0;
		}
	}
}

function GameMap(rows, cols) {
	this.horiArr = new HoriWall(rows, cols);
	this.vertArr = new VertWall(rows, cols);
	
	this.map = new Array();
	for (var i = 0; i < rows; i++) {
		this.map[i] = new Array();
		for (var j = 0; j < cols; j++) {
			this.map[i][j] = 0;
		}
	}
	
	this.setHori = function(row, col, value) {
		this.horiArr.wallArr[row][col] = value;
		if (this.map[row][col] % 2 >= 1 && !value) {
			this.map[row][col] -= 1;
		}
		else if (this.map[row][col] % 2 < 1 && value) {
			this.map[row][col] += 1;
		}
		if (this.map[row + 1][col] % 16 >= 8 && !value) {
			this.map[row + 1][col] -= 8;
		}
		else if (this.map[row + 1][col] % 16 < 8 && value) {
			this.map[row + 1][col] += 8;
		}
	};
	
	this.setVert = function(row, col, value) {
		this.vertArr.wallArr[row][col] = value;
		if (this.map[row][col] % 4 >= 2 && !value) {
			this.map[row][col] -= 2;
		}
		else if (this.map[row][col] % 4 < 2 && value) {
			this.map[row][col] += 2;
		}
		if (this.map[row][col + 1] % 8 >= 4 && !value) {
			this.map[row][col + 1] -= 4;
		}
		else if (this.map[row][col + 1] % 8 < 4 && value) {
			this.map[row][col + 1] += 4;
		}
	};
		
	this.drawMap = function(x, y) {
		for (var i = 0; i < this.map.length; i++) {
			for (var j = 0; j < this.map[i].length; j++) {
				var imageNo = this.map[i][j].toString();
				while (imageNo.length < 4) {
					imageNo = "0" + imageNo;
				}
				var imagePath = "images/" + imageNo + ".png";
				loadAndDrawImage(imagePath, y + (j * 50), x + (i * 50));
			}
		}
	};
	
}

function LoadMap(mapNo) {
	while (mapNo.length < 2) {
		mapNo = "0" + mapNo;
	}
	var filePath = "maps/map" + mapNo + ".txt";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.overrideMimeType('text/plain');
	xmlhttp.open("GET", filePath, false);
	xmlhttp.send(null);
	var fileContent = xmlhttp.responseText;
	var fileArray = fileContent.split('\n');
	var fileLength = fileArray.length;
	
	// processing of input file
	var rows = parseInt(fileArray[0], 10);
	var cols = parseInt(fileArray[1], 10);
	
	var map = new GameMap(rows, cols);
	var j;
	
	for (var i = 3; i < 2 + rows; i++) {
		for (var j = 0; j < fileArray[i].length; j += 2) {
			map.setHori(i - 3, j / 2, parseInt(fileArray[i][j], 10));
		}
	}
	
	for (var i = 3 + rows; i < 3 + (rows * 2); i++) {
		for (var j = 0; j < fileArray[i].length; j += 2) {
			map.setVert(i - 3 - rows, j / 2, parseInt(fileArray[i][j], 10));
		}
	}
	
	return map;
}

function GameCharacter (row, col, id, map) {
	this.row = row;
	this.col = col;
	this.currAP = 0;
	this.id = id;
	this.level = 1;
	this.imagePath;
	this.actionPointsMap = new Array();
	for (var i = 0; i < map.map.length; i++) {
		this.actionPointsMap[i] = new Array();
	}
	this.digestion = 0;
	
	if (this.id < 5) {
		this.imagePath = "red";
	}
	else {
		this.imagePath = "blue";
	}
	
	this.toMove = function(map) {
		this.initActionPointsMap(map);
		this.getActionPointsMap(map);
		var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d");
		var tileNo;
		var tileStr;
		for (var i = 0; i < map.map.length; i++) {
			for (var j = 0; j < map.map[0].length; j++) {
				if (this.actionPointsMap[i][j] >= 0) {
					tileNo = map.map[i][j] + 16;
					tileStr = tileNo.toString();
					while (tileStr.length < 4) {
						tileStr = "0" + tileStr;
					}
					context.clearRect(j * 50, i * 50, 50, 50);
					loadAndDrawImage("images/" + tileStr + ".png", j * 50, i * 50);
				}
			}
		}
		for (var i = 0; i < teams.length; i++) {
			for (var j = 0; j < teams[i].length; j++) {
				if (this.actionPointsMap[teams[i][j].row][teams[i][j].col] >= 0) {
					teams[i][j].drawCurrPosGreen();
				}
			}
		}	
		setTimeout(function() {
			for (var i = 0; i < fruits.length; i++) {
				fruits[i].drawCurrPos();
			}
		}, 20);
	};
	
	this.move = function(row, col) {
		if (this.actionPointsMap[row][col] >= 0) {
			this.row = row;
			this.col = col;
			this.currAP = this.actionPointsMap[row][col];
			var canvas = document.getElementById("canvas");
			var context = canvas.getContext("2d");
			for (var i = 0; i < currMap.map.length; i++) {
				for (var j = 0; j < currMap.map[0].length; j++) {
					if (this.actionPointsMap[i][j] >= 0) {
						var tileNo = currMap.map[i][j];
						var tileStr = tileNo.toString();
						while (tileStr.length < 4) {
							tileStr = "0" + tileStr;
						}
						context.clearRect(j * 50, i * 50, 50, 50);
						loadAndDrawImage("images/" + tileStr + ".png", j * 50, i * 50);
					}
				}
			}
		}
	};
	
	this.initActionPointsMap = function(map) {
		for (var i = 0; i < map.map.length; i++) {
			for (var j = 0; j < map.map[0].length; j++) {
				this.actionPointsMap[i][j] = -1;
			}
		}
	};
		
	this.drawCurrPos = function() {
		if (this.currAP <= 0 || Math.floor(this.id / 5) != teamToMove) {
			loadAndDrawImage("images/char" + this.imagePath + "dim.png", (this.col * 50) + 10, (this.row * 50) + 10);
		}
		else {
			loadAndDrawImage("images/char" + this.imagePath + ".png", (this.col * 50) + 10, (this.row * 50) + 10);
		}
	};
	
	this.drawCurrPosDim = function() {
		loadAndDrawImage("images/char" + this.imagePath + "dim.png", (this.col * 50) + 10, (this.row * 50) + 10);
	};
	
	this.drawCurrPosGreen = function() {
		if (this.currAP <= 0 || Math.floor(this.id / 5) != teamToMove) {
			loadAndDrawImage("images/char" + this.imagePath + "greendim.png", (this.col * 50) + 10, (this.row * 50) + 10);
		}
		else {
			loadAndDrawImage("images/char" + this.imagePath + "green.png", (this.col * 50) + 10, (this.row * 50) + 10);
		}
	};
	
	this.drawCurrPosGreenDim = function() {
		loadAndDrawImage("images/char" + this.imagePath + "greendim.png", (this.col * 50) + 10, (this.row * 50) + 10);
	};
	
	this.getActionPointsMap = function(map) {
		this.actionPointsMapRecur(this.row, this.col, this.currAP, this.actionPointsMap, map);
	};
	
	this.actionPointsMapRecur = function(row, col, actionPoints, actionPointsMap, map) {
		var toContinue = true;
		if (actionPoints <= -1) {
			toContinue = false;
		}
		else if (row >= map.map.length || col >= map.map[0].length || row < 0 || col < 0) {
			toContinue = false;
		}
		else if (actionPoints <= actionPointsMap[row][col]) {
			toContinue = false;
		}
		if (toContinue) {
			actionPointsMap[row][col] = actionPoints;
		
			if (row > 0 && !map.horiArr.wallArr[row - 1][col]) {
				this.actionPointsMapRecur(row - 1, col, actionPoints - 1, actionPointsMap, map);
			}
			if (row < map.map.length - 1 && !map.horiArr.wallArr[row][col]) {
				this.actionPointsMapRecur(row + 1, col, actionPoints - 1, actionPointsMap, map);
			}
			if (col > 0 && !map.vertArr.wallArr[row][col - 1]) {
				this.actionPointsMapRecur(row, col - 1, actionPoints - 1, actionPointsMap, map);
			}
			if (col < map.map[0].length - 1 && !map.vertArr.wallArr[row][col]) {
				this.actionPointsMapRecur(row, col + 1, actionPoints - 1, actionPointsMap, map);
			}
		}
	};
}

function Fruit(row, col, digestCost) {
	this.row = row;
	this.col = col;
	this.digestCost = digestCost;
	this.imagePath = "images/cpoint-1.png";
	
	this.drawCurrPos = function() {
		if (this.digestCost == 0) {
			loadAndDrawImage("images/cpoint1.png", (this.col * 50) + 10, (this.row * 50) + 10);
		}
		else if (this.digestCost > 5) {
			loadAndDrawImage("images/cpoint0.png", (this.col * 50) + 10, (this.row * 50) + 10);
		}
		else {
			loadAndDrawImage(this.imagePath, (this.col * 50) + 10, (this.row * 50) + 10);
		}
	}
}