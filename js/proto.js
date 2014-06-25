// This file contains function headers and variables (if part of a class) for ease of reading

var teams = [[]];
var character = teams[0];
var teamToMove;
var currChar;
var currMap;
var turn;

function init() {}
function loadAndDrawImage(url, x, y) {}
function getPositionClick(event) {}
function getPositionMove(event) {}
function mouseOverPrint(row, col) {}
function updateStatus() {}
function updateTurn() {}

function HoriWall(rows, cols) {
	this.wallArr = [[]];
}

function VertWall(rows, cols) {
	this.wallArr = [[]];
}

function GameMap(rows, cols) {
	this.horiArr = new HoriWall(rows, cols);
	this.vertArr = new VertWall(rows, cols);
	this.map = [[]];
	
	this.setHori = function(row, col, value) {};
	this.setVert = function(row, col, value) {};
	this.drawMap = function(x, y) {};
}

function LoadMap(mapNo) {}

function GameCharacter(row, col, maxAP, id, map) {
	this.row = row;
	this.col = col;
	this.currAP = maxAP;
	this.id = id;
	this.level = 1;
	this.exp = 0;
	this.nextExp = 10;
	this.imagePath = "images/char" + id.toString() + ".png";
	this.actionPointsMap = [[]];
	
	this.gainExp = function(addedExp) {};
	this.toMove = function(map) {};
	this.move = function(row, col) {}:
	this.initActionPointsMap = function(map) {};
	this.drawCurrPos = function() {};
	this.getActionPointsMap = function(map) {};
	this.actionPointsMapRecur = function(row, col, actionPoints, actionPointsMap, map) {};
}

function ControlPoint(row, col) {
	this.row = row;
	this.col = col;
	this.owner = -1;
	this.keys = new Array();
	this.rangeMap = new Array();
	
	this.resetRangeMap = function() {};
	this.setRangeMap = function() {};
	this.addKey = function(index) {};
	this.raiseKey = function(index, power) {};
	this.lowerKey = function(index) {};
	
}

function Key(level) {
	this.level = level;
	this.countdown;
	
	this.raise = function(power) {};
	this.delevel = function() {};
}