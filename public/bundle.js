/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
function AdjacencyList() {
	this.nodes = {};

	this.addNode = function (nodeName) {
		if (this.nodes[nodeName] == undefined) this.nodes[nodeName] = {
			isFictious: false,
			neighbors: []
		};
	};

	this.addEdge = function (node1Name, node2Name) {
		this.nodes[node1Name].neighbors[node2Name] = true;
		this.nodes[node2Name].neighbors[node1Name] = true;
	};

	this.initializeFromText = function (nodesText) {
		this.nodes = {};
		for (var i = 0; i < nodesText.length; i++) {
			if (nodesText[i] !== "") {
				var currNode = nodesText[i].split("->");
				this.addNode(currNode[0]);

				if (currNode[1]) {
					this.addNode(currNode[1]);
					this.addEdge(currNode[0], currNode[1]);
				}
			}
		}
	};

	this.removeEdge = function (node1Name, node2Name) {
		delete this.nodes[node1Name];
		delete this.nodes[node2Name];
		for (var node in this.nodes) {
			delete this.nodes[node].neighbors[node1Name];
			delete this.nodes[node].neighbors[node2Name];
		}
	};
}

exports.default = AdjacencyList;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
function createTSpan(text, x, y) {
	var tspan = document.createElementNS("http://www.w3.org/2000/svg", "text");
	tspan.setAttribute("x", x);
	tspan.setAttribute("y", y);
	tspan.textContent = text;
	return tspan;
}

//print adjacency list and bridges
function printNodesAndBridgesText(nodes, bridges, textGroup) {
	while (textGroup.lastChild) {
		textGroup.removeChild(textGroup.lastChild);
	}
	var count = 0;

	var tspan = createTSpan("Списки смежности:", 50, (count + 1) * 50);
	textGroup.appendChild(tspan);
	count++;

	for (var key1 in nodes) {
		var currText = key1 + ": ";
		for (var key2 in nodes[key1].neighbors) {
			currText += key2 + ", ";
		}
		tspan = createTSpan(currText, 50, (count + 1) * 50);
		textGroup.appendChild(tspan);

		count++;
	}

	tspan = createTSpan("Мосты:", 50, (count + 1) * 50);
	textGroup.appendChild(tspan);
	count++;

	for (var i = 0; i < bridges.length; i++, count++) {
		tspan = createTSpan(bridges[i].first + " -> " + bridges[i].second + "; ", 50, (count + 1) * 50);
		textGroup.appendChild(tspan);
	}
}

function calculateDepthSearchAndFindBridges(nodes) {
	var number = 1;

	var num = {};
	var top = {};
	var bypassEdges = [];

	for (var key in nodes) {
		num[key] = 0;
	}

	for (var key in nodes) {
		if (num[key] != 0) continue;

		searchNode(undefined, key);
	}

	function searchNode(parentNode, currNode) {
		num[currNode] = number;
		top[currNode] = number;
		number++;

		for (var key in nodes[currNode].neighbors) {
			if (num[key] == 0) {
				bypassEdges.push({
					first: currNode,
					second: key
				});
				searchNode(currNode, key);
				top[currNode] = Math.min(top[currNode], top[key]);
			} else {
				if (parentNode != key) top[currNode] = Math.min(top[currNode], num[key]);
			}
		}
	}

	return bypassEdges.filter(function (edge) {
		return top[edge.second] == num[edge.second];
	});
}

//nodes text: ["a->b", "b->c", ""]
function findBridges(nodes, textGroup) {
	var bridges = calculateDepthSearchAndFindBridges(nodes);
	printNodesAndBridgesText(nodes, bridges, textGroup);
	return bridges;
}

exports.findBridges = findBridges;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var nodes;
var edges;

//������������ ����� �������
var l = 200;
//����������� ��������� �������
var k1 = 2;
//����������� ���� ������������
var k2 = 200000;

var delta = 0.1;

function clear(nodesGroup, edgesGroup) {
	nodesGroup.innerHTML = "";
	edgesGroup.innerHTML = "";
}
function getNodesAndEdges(nodesText) {
	nodes = {};
	edges = {};
	for (var i = 0; i < nodesText.length; i++) {
		if (nodesText[i] != "") {
			var currNode = nodesText[i].split("->");
			nodes[currNode[0]] = { name: currNode[0] };
			if (currNode[1]) {
				nodes[currNode[1]] = { name: currNode[1] };
				if (!edges[currNode[0]]) edges[currNode[0]] = {};
				edges[currNode[0]][currNode[1]] = true;

				//����� ���� �������� � ������������������ �������
				if (!edges[currNode[1]]) edges[currNode[1]] = {};
				edges[currNode[1]][currNode[0]] = true;
			}
		}
	}
}
function randomizeNodeCoordinates(height, width) {
	for (var key in nodes) {
		nodes[key].x = Math.floor(Math.random() * (width - 0 + 1)) + 0;
		nodes[key].y = Math.floor(Math.random() * (height - 0 + 1)) + 0;
	}
}
function drawGraph(nodesGroup, edgesGroup) {
	for (var key in nodes) {
		var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		circle.setAttribute('cx', nodes[key].x);
		circle.setAttribute('cy', nodes[key].y);
		circle.setAttribute('r', 15);
		circle.setAttribute('stroke', "black");
		circle.setAttribute('stroke-width', 2);
		circle.setAttribute('fill', "white");
		nodesGroup.appendChild(circle);

		var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		text.setAttribute('x', nodes[key].x - 2);
		text.setAttribute('y', nodes[key].y + 2);
		text.setAttribute('fill', "black");
		text.innerHTML = key;
		nodesGroup.appendChild(text);
	}

	for (var key1 in edges) {
		for (var key2 in edges[key1]) {
			var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			line.setAttribute('x1', nodes[key1].x);
			line.setAttribute('y1', nodes[key1].y);
			line.setAttribute('x2', nodes[key2].x);
			line.setAttribute('y2', nodes[key2].y);
			line.setAttribute('stroke', "black");
			line.setAttribute('stroke-width', 2);
			edgesGroup.appendChild(line);
		}
	}
}
function distance(node1, node2) {
	var x = nodes[node1].x - nodes[node2].x;
	var y = nodes[node1].y - nodes[node2].y;
	return Math.sqrt(x * x + y * y);
}
function calculatePowerXForEachNode() {
	for (var p in nodes) {
		var f = 0;
		for (var q in edges[p]) {
			if (edges[p][q] == undefined) continue;
			var d = distance(p, q);
			if (d == 0) continue;
			f += k1 * (d - l) * (nodes[q].x - nodes[p].x) / d;
		}
		var g = 0;
		for (var q in nodes) {
			//if(edges[p][q]!=undefined||q==p)continue;
			if (q == p) continue;
			var d = distance(p, q);
			if (d == 0) continue;
			g += k2 * (nodes[p].x - nodes[q].x) / (d * d) / d;
		}
		nodes[p].FX = f + g;
	}
}
function calculatePowerYForEachNode() {
	for (var p in nodes) {
		var f = 0;
		for (var q in edges[p]) {
			if (edges[p][q] == undefined) continue;
			var d = distance(p, q);
			if (d == 0) continue;
			f += k1 * (d - l) * (nodes[q].y - nodes[p].y) / d;
		}
		var g = 0;
		for (var q in nodes) {
			//if(edges[p][q]!=undefined||q==p)continue;
			if (q == p) continue;
			var d = distance(p, q);
			if (d == 0) continue;
			g += k2 * (nodes[p].y - nodes[q].y) / (d * d) / d;
		}
		nodes[p].FY = f + g;
	}
}
function addExtention() {
	for (var node in nodes) {
		nodes[node].x += delta * nodes[node].FX;
		nodes[node].y += delta * nodes[node].FY;
		//nodes[node].x=nodes[node].FX;
		//nodes[node].y=nodes[node].FY;
	}
}
function firstStep(nodesText, timerId, height, width, nodesGroup, edgesGroup) {
	if (timerId) clearInterval(timerId);
	clear(nodesGroup, edgesGroup);
	getNodesAndEdges(nodesText);
	randomizeNodeCoordinates(height, width);
	drawGraph(nodesGroup, edgesGroup);
}
function makeOneStabilization(nodesGroup, edgesGroup) {
	calculatePowerXForEachNode();
	calculatePowerYForEachNode();
	addExtention();
	clear(nodesGroup, edgesGroup);
	drawGraph(nodesGroup, edgesGroup);
}
function startStabilization(timerId, nodesGroup, edgesGroup) {
	if (timerId) clearInterval(timerId);
	timerId = setInterval(makeOneStabilization, 150, nodesGroup, edgesGroup);
	return timerId;
}
exports.firstStep = firstStep;
exports.makeOneStabilization = makeOneStabilization;
exports.startStabilization = startStabilization;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _springEmbedder = __webpack_require__(2);

var _adjacencyList = __webpack_require__(0);

var _adjacencyList2 = _interopRequireDefault(_adjacencyList);

var _findBridges = __webpack_require__(1);

__webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var height = 800;
var width = 1500;

var timerId;

var drawField = document.getElementById("drawField");
drawField.setAttribute('height', height + "px");
drawField.setAttribute('width', width + "px");

document.getElementById("nodes-input").value = '1->2;1->6;\n2->3;2->5;2->9;2->10;\n3->4;3->5;\n4->5;\n6->7;6->8;\n7->8;\n9->10;\n9->11;\n10->11;';

/*document.getElementById("nodes-input").value = `a->b; a->c; a->d; a->e; a->f; a->k;
a->l;
b->c; b->d; b->e; b->f; b->k; b->l;
c->d; c->e; c->f; c->k; c->l;
d->e; d->f; d->k; d->l;
e->f; e->k; e->l;
f->k;f->l;
k->l;`;*/

var nodesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
nodesGroup.setAttribute('id', 'nodes');

var edgesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
edgesGroup.setAttribute('id', 'edges');

var textGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

drawField.appendChild(edgesGroup);
drawField.appendChild(nodesGroup);
drawField.appendChild(textGroup);

var toDraw = document.getElementById("to-draw");
toDraw.addEventListener('click', function () {
	var nodesText = document.getElementById("nodes-input").value.replace(/ |\n/g, '').split(';');
	(0, _springEmbedder.firstStep)(nodesText, timerId, height, width, nodesGroup, edgesGroup);
});

var calculateOffset = document.getElementById("calculate-offset");
calculateOffset.addEventListener('click', function () {
	(0, _springEmbedder.makeOneStabilization)(nodesGroup, edgesGroup);
});

var startStab = document.getElementById("start-stabilization");
startStab.addEventListener('click', function () {
	timerId = (0, _springEmbedder.startStabilization)(timerId, nodesGroup, edgesGroup);
});

var planarityFirstStep = document.getElementById("find-bridges");

planarityFirstStep.addEventListener('click', function () {
	var nodesText = document.getElementById("nodes-input").value.replace(/ |\n/g, '').split(';');

	var adjacencyList = new _adjacencyList2.default();
	adjacencyList.initializeFromText(nodesText);

	var bridges = (0, _findBridges.findBridges)(adjacencyList.nodes, textGroup);

	adjacencyList.removeEdge("a", "b");
});

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map