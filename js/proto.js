// This file contains function headers and variables (if part of a class) for ease of reading

var character = [];
var currChar;
var currMap;
var turn;

function init() {}
function loadAndDrawImage(url, x, y) {}
function getPositionClick(event) {}
function getPositionMove(event) {}
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

function GameCharacter (row, col, maxAP, id, map) {
	this.row = row;
	this.col = col;
	this.currAP = maxAP;
	this.id = id;
	this.imagePath = "images/char" + id.toString() + ".png";
	this.actionPointsMap = [[]];
	this.toMove = function(map) {};
	this.move = function(row, col) {}:
	this.initActionPointsMap = function(map) {};
	this.drawCurrPos = function() {};
	this.getActionPointsMap = function(map) {};
	this.actionPointsMapRecur = function(row, col, actionPoints, actionPointsMap, map) {};
}