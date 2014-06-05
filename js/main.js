window.addEventListener("DOMContentLoaded", init, false); 

var character = new Array();
var currChar;
var currMap;
var turn = 1;
function init() {
	var mapNo = 3 + Math.floor(Math.random() * 4);
	currMap = LoadMap("0" + mapNo.toString());
	currMap.drawMap(0, 0);
	character[0] = new GameCharacter(0, 0, 4, 1, currMap);
	character[1] = new GameCharacter(9, 14, 4, 2, currMap);
	for (var i = 0; i < character.length; i++) {
		character[i].initActionPointsMap(currMap);
		character[i].getActionPointsMap(currMap);
		character[i].drawCurrPos();
	}
    var canvas = document.getElementById("canvas");
    canvas.addEventListener("mousedown", getPositionClick, false);
    canvas.addEventListener("mousemove", getPositionMove, false);
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
	
	var i;
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
		updateStatus();
		if (currChar.currAP <= 0 || currChar.actionPointsMap[rowMove][colMove] < 0) {
			currChar.move(currChar.row, currChar.col);
			currChar = null;
			for (i = 0; i < character.length; i++) {
				loadAndDrawImage(character[i].imagePath, character[i].col * 50 + 10, character[i].row * 50 + 10);
			}
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
	//window.alert(toRefresh + " " + character[0].currAP.toString() + " " + character[1].currAP.toString() + " " + turn);
	if (toRefresh) {
		for (i = 0; i < character.length; i++) {
			character[i].currAP = 4;
			character[i].initActionPointsMap(currMap);
			character[i].getActionPointsMap(currMap);
		}
		turn++;
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
	var i;
	var mouseChar;
	for (i = 0; i < character.length; i++) {
		if (character[i].row === row && character[i].col === col) {
			mouseChar = character[i];
		}
	}
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	context.clearRect(0, 610, canvas.width, 200);
	context.font = '18pt Calibri';
	context.fillStyle = 'black';
	context.fillText("Mouseover coordinates:", 0, 630);
	context.fillText(x + " " + y, 0, 660);
	if (mouseChar != null) {
		context.fillText("Mouseover element: Character", 0, 710);
		context.fillText("AP: " + mouseChar.currAP + ", ID: " + mouseChar.id.toString(), 0, 740);
	}
}

function updateStatus() {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	context.clearRect(0, 510, canvas.width, 100);
	context.font = '18pt Calibri';
	context.fillStyle = 'black';
	context.fillText("Current selection:", 0, 530);
	context.fillText("AP: " + currChar.currAP + ", Turn: " + turn + ", ID: " + currChar.id.toString(), 0, 560);
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

function GameCharacter (row, col, maxAP, id, map) {
	this.row = row;
	this.col = col;
	this.currAP = maxAP;
	this.id = id;
	this.imagePath = "images/char" + id.toString() + ".png";
	this.actionPointsMap = new Array();
	for (var i = 0; i < map.map.length; i++) {
		this.actionPointsMap[i] = new Array();
	}
	
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
					if (i === this.row && j === this.col) {
						loadAndDrawImage("images/chargreen" + id.toString() + ".png", j * 50 + 10, i * 50 + 10)
					}
				}
			}
		}
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
						if (i === row && j === col) {
							loadAndDrawImage(this.imagePath, j * 50 + 10, i * 50 + 10)
						}
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

function ControlPoint (row, col) {
	this.row = row;
	this.col = col;
}