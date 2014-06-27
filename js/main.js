window.addEventListener("DOMContentLoaded", init, false); 

var teams = new Array();
for (var i = 0; i < 2; i++) {
	teams[i] = new Array();
}
var character;
var cPoints = new Array();
var teamToMove = -1;
var currChar;
var currMap;
var mouseRow = -1;
var mouseCol = -1;
var turn = 1;
function init() {
	var mapNo = 3 + Math.floor(Math.random() * 4);
	currMap = LoadMap("0" + mapNo.toString());
	currMap.drawMap(0, 0);
	teams[0][0] = new GameCharacter(0, 0, 1, currMap);
	teams[0][1] = new GameCharacter(9, 14, 2, currMap);
	teams[1][0] = new GameCharacter(9, 0, 6, currMap);
	teams[1][1] = new GameCharacter(0, 14, 7, currMap);
	for (var i = 0; i < teams.length; i++) {
		for (var j = 0; j < teams[i].length; j++) {
			teams[i][j].initActionPointsMap(currMap);
			teams[i][j].getActionPointsMap(currMap);
			teams[i][j].drawCurrPos();
		}
	}
	cPoints[0] = new ControlPoint(5, 5);
	for (var i = 0; i < cPoints.length; i++) {
		cPoints[i].resetRangeMap();
		cPoints[i].setRangeMap();
		cPoints[i].drawCurrPos();
	}
    var canvas = document.getElementById("canvas");
    canvas.addEventListener("mousedown", getPositionClick, false);
    canvas.addEventListener("mousemove", getPositionMove, false);
	loadAndDrawImage("images/endturn.png", 400, 550);
	updateTurn();
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
	
	if (x >= 400 && x <= 485 && y >= 550 && y <= 580) {
		if (currChar != null) {
			currChar.move(currChar.row, currChar.col);
			currChar = null;
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
		for (i = 0; i < cPoints.length; i++) {
			cPoints[i].drawCurrPos();
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
				for (i = 0; i < cPoints.length; i++) {
					cPoints[i].drawCurrPos();
				}
				context.clearRect(0, 510, 350, 80);
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
}

function mouseOverPrint(row, col) {
	mouseRow = row;
	mouseCol = col;
	var i;
	var j;
	var k = 0;
	var mouseChar = new Array();
	var mousePoint;
	for (i = 0; i < teams.length; i++) {
		for (j = 0; j < teams[i].length; j++) {
			if (teams[i][j].row === row && teams[i][j].col === col) {
				mouseChar[k++] = teams[i][j];
			}
		}
	}
	for (i = 0; i < cPoints.length; i++) {
		if (cPoints[i].row === row && cPoints[i].col === col) {
			mousePoint = cPoints[i];
		}
	}
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	context.clearRect(0, 590, 350, 180);
	context.font = '10pt Calibri';
	context.fillStyle = 'black';
	for(i = 0; i < mouseChar.length; i++) {
		loadAndDrawImage(mouseChar[i].imagePath, i * 50, 610)
		context.fillText("AP: " + mouseChar[i].currAP, i * 50, 655);
		context.fillText("Lvl: " + mouseChar[i].level, i * 50, 670);
	}
	if (mousePoint != null) {
		loadAndDrawImage(mousePoint.imagePath, 10, 690);
		for (i = 0; i < mousePoint.keys.length; i++) {
			context.fillText("Slot " + (i + 1), 70 + i * 50, 690);
			context.fillText("Lvl: " + mousePoint.keys[i].level, 70 + i * 50, 705);
			context.fillText("HP: " + mousePoint.keys[i].health, 70 + i * 50, 720);
		}
	}
}

function updateStatus() {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	context.clearRect(0, 510, 350, 80);
	context.font = '12pt Calibri';
	context.fillStyle = 'black';
	loadAndDrawImage(currChar.imagePath, 0, 520);
	context.fillText("AP: " + currChar.currAP, 40, 530);
	context.fillText("Lvl: " + currChar.level, 40, 550);
	context.fillText("Exp: " + currChar.exp + "/" + currChar.nextExp, 100, 530);
}

function updateTurn() {
	teamToMove++;
	if (teamToMove >= teams.length) {
		teamToMove = 0;
		turn++;
	}
	character = teams[teamToMove];
	for (var i = 0; i < character.length; i++) {
		character[i].currAP += (4 + Math.ceil(character[i].level / 5));
		if (character[i].currAP > (5 + Math.ceil(character[i].level / 3))) {
			character[i].currAP = 5 + (Math.ceil(character[i].level / 3));
		}
		character[i].initActionPointsMap(currMap);
		character[i].getActionPointsMap(currMap);
	}
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
	context.fillText(teamColour + " to move", 500, 520);
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
	this.exp = 0;
	this.nextExp = 10;
	this.imagePath = "images/char" + id.toString() + ".png";
	this.actionPointsMap = new Array();
	for (var i = 0; i < map.map.length; i++) {
		this.actionPointsMap[i] = new Array();
	}
	
	this.gainExp = function(addedExp) {
		this.exp += addedExp;
		while (this.exp >= this.nextExp) {
			this.exp -= this.nextExp;
			this.level++;
			this.nextExp = level * 10;
		}
	};
	
	this.toMove = function(map) {
		this.initActionPointsMap(map);
		this.getActionPointsMap(map);
		var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d");
		for (var i = 0; i < map.map.length; i++) {
			for (var j = 0; j < map.map[0].length; j++) {
				if (this.actionPointsMap[i][j] >= 0) {
					var tileNo = map.map[i][j] + 16;
					var tileStr = tileNo.toString();
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
					loadAndDrawImage("images/chargreen" + teams[i][j].id.toString() + ".png", teams[i][j].col * 50 + 10, teams[i][j].row * 50 + 10);
				}
			}
		}	
		setTimeout(function() {
			for (i = 0; i < cPoints.length; i++) {
				loadAndDrawImage(cPoints[i].imagePath, cPoints[i].col * 50 + 10, cPoints[i].row * 50 + 10);
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
						/*if (i === row && j === col) {
							loadAndDrawImage(this.imagePath, j * 50 + 10, i * 50 + 10)
						}*/
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
		loadAndDrawImage(this.imagePath, (this.col * 50) + 10, (this.row * 50) + 10);
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

function ControlPoint(row, col) {
	this.row = row;
	this.col = col;
	this.owner = -1;
	this.keys = new Array();
	this.imagePath = "images/cpoint" + this.owner.toString() + ".png";
	for (var i = 0; i < 5; i++) {
		this.keys[i] = new Key(0);
	}
	this.rangeMap = new Array();
	for (var i = 0; i < currMap.map.length; i++) {
		this.rangeMap[i] = new Array();
	}
	
	this.resetRangeMap = function() {
		for (var i = 0; i < currMap.map.length; i++) {
			for (var j = 0; j < currMap.map[i].length; j++) {
				this.rangeMap[i][j] = false;
			}
		}
	};
	
	this.setRangeMap = function() {
		for (var i = 0; i < this.rangeMap.length; i++) {
			for (var j = 0; j < this.rangeMap[i].length; j++) {
				if (Math.abs(i - this.row) <= 1 && Math.abs(j - this.col) <= 1) {
					this.rangeMap[i][j] = true;
				}
			}
		}
	};
		
	this.drawCurrPos = function() {
		loadAndDrawImage(this.imagePath, (this.col * 50) + 10, (this.row * 50) + 10);
	};
	
	this.addKey = function(index, team, level) {
		if (this.owner == -1) {
			this.owner = team;
			this.imagePath = "images/cpoint" + this.owner.toString() + ".png";
		}
		this.keys[index] = new Key(level);
	};
	
	this.hitKey = function(index) {
		this.keys[index].health--;
		if (this.keys[index].health <= 0) {
			this.keys[index] = new Key(0);
		};
		var isOwned = false;
		for (var i = 0; i < keys.length; i++) {
			if (keys[i].level > 0) {
				isOwned = true;
			}
		}
		if (!isOwned) {
			owner = -1;
			this.imagePath = "images/cpoint" + this.owner.toString() + ".png";
		}
	};
}

function Key(level) {
	this.level = level;
	this.health = 3 + level;
	if (level == 0) {
		this.health = 0;
	};
}