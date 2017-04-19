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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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
			type: "normal",
			neighbors: {}
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

	this.removeNode = function (nodeName) {
		delete this.nodes[nodeName];
		for (var node in this.nodes) {
			delete this.nodes[node].neighbors[nodeName];
		}
	};

	this.removeEdge = function (node1Name, node2Name) {
		delete this.nodes[node1Name].neighbors[node2Name];
		delete this.nodes[node2Name].neighbors[node1Name];
	};

	this.removeEdges = function (edges) {
		for (var i = 0; i < edges.length; i++) {
			this.removeEdge(edges[i].begin, edges[i].end);
		}
	};

	this.getConnectedComponents = function () {
		var components = [];
		var checkedNodes = [];

		for (var key in this.nodes) {
			if (checkedNodes[key]) continue;

			checkedNodes[key] = true;

			var component = new AdjacencyList();

			component.addNode(key);
			addNeighbors.call(this, key, component, checkedNodes);
			components.push(component);
		}

		function addNeighbors(nodeName, component, checkedNodes) {
			for (var key in this.nodes[nodeName].neighbors) {
				component.addNode(key);
				component.addEdge(nodeName, key);

				if (!checkedNodes[key]) {
					checkedNodes[key] = true;
					addNeighbors.call(this, key, component, checkedNodes);
				}
			}
		}

		return components;
	};

	this.print = function (textGroup) {
		while (textGroup.lastChild) {
			textGroup.removeChild(textGroup.lastChild);
		}

		var count = 0;

		var tspan = createTSpan("Списки смежности:", 50, (count + 1) * 50);
		textGroup.appendChild(tspan);
		count++;

		for (var key1 in this.nodes) {
			var currText = key1 + ": ";
			for (var key2 in this.nodes[key1].neighbors) {
				currText += key2 + ", ";
			}
			tspan = createTSpan(currText, 50, (count + 1) * 50);
			textGroup.appendChild(tspan);

			count++;
		}

		function createTSpan(text, x, y) {
			var tspan = document.createElementNS("http://www.w3.org/2000/svg", "text");
			tspan.setAttribute("x", x);
			tspan.setAttribute("y", y);
			tspan.textContent = text;
			return tspan;
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
		tspan = createTSpan(bridges[i].begin + " -> " + bridges[i].end + "; ", 50, (count + 1) * 50);
		textGroup.appendChild(tspan);
	}
}

function calculateDepthSearchAndFindBridges(nodes) {
	var number = 1;

	var num = {};
	var top = {};
	//edges we walk in depth search
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
					begin: currNode,
					end: key
				});
				searchNode(currNode, key);
				top[currNode] = Math.min(top[currNode], top[key]);
			} else {
				if (parentNode != key) top[currNode] = Math.min(top[currNode], num[key]);
			}
		}
	}

	return bypassEdges.filter(function (edge) {
		return top[edge.end] == num[edge.end];
	});
}

//nodes text: ["a->b", "b->c", ""]
function findBridges(nodes, textGroup) {
	var bridges = calculateDepthSearchAndFindBridges(nodes);
	//printNodesAndBridgesText(nodes, bridges, textGroup);
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

var _adjacencyList = __webpack_require__(0);

var _adjacencyList2 = _interopRequireDefault(_adjacencyList);

var _findBridges = __webpack_require__(1);

var _planeWorker = __webpack_require__(6);

var _planeWorker2 = _interopRequireDefault(_planeWorker);

var _svgGraphDrawer = __webpack_require__(8);

var _svgGraphDrawer2 = _interopRequireDefault(_svgGraphDrawer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HammaAlgorithmWorker(svgField) {
	this.svgField = svgField;
	this.makePlanarity = function (graph) {
		var bridges = (0, _findBridges.findBridges)(graph.nodes);
		graph.removeEdges(bridges);
		var components = graph.getConnectedComponents();
		for (var i = 0; i < components.length; i++) {
			this.planarizeGraph(components[i]);
		}
	};

	//graph without bridges
	this.planarizeGraph = function (graph) {
		var loop = this.findLoop(graph);
		if (loop.path.length == 0) return;
		var planes = []; /*
                   planes.push(new Plane(loop.path, false));
                   planes.push(new Plane(loop.path, true)); //outer edge(plane)*/
		var planeWorker = new _planeWorker2.default();
		planeWorker.initializeFromLoop(loop.path);
		var svgGraphDrawer = new _svgGraphDrawer2.default();
		svgGraphDrawer.draw(planeWorker.nodes, planeWorker.edges, svgField);
		graph.removeEdges(loop.edges);

		this.findSegments(graph, loop);
		//get segments
	};

	//awful algorithm, works in n^n time
	this.findLoop = function (graph) {
		var maxLoopLength = 0;
		var pathResult = [];

		for (var key in graph.nodes) {
			var path = [];
			path.push(key);

			searchLoopInNeighbors(path.slice(), key, graph);
		}

		return transformPathResultToLoopAndEdges(pathResult);

		function searchLoopInNeighbors(path, nodeName, graph) {
			for (var key in graph.nodes[nodeName].neighbors) {
				//if node already was in our path we compare loop length with max loop length
				var loopLength = getLoopLength(path, key);
				if (loopLength > maxLoopLength) {
					maxLoopLength = loopLength;
					pathResult = path.slice();
				} else if (loopLength === 0) {
					var newPath = path.slice();
					newPath.push(key);
					searchLoopInNeighbors(newPath, key, graph);
				}
			}

			function getLoopLength(path, nodeName) {
				for (var i = 0; i < path.length; i++) {
					if (path[i] === nodeName) return path.length - i;
				}
				return 0;
			}
		}

		function transformPathResultToLoopAndEdges(pathResult) {
			var loop = [];

			for (var i = 0; i < pathResult.length - 1; i++) {
				loop.push({
					begin: pathResult[i],
					end: pathResult[i + 1]
				});
			}
			loop.push({
				begin: pathResult[0],
				end: pathResult[pathResult.length - 1]
			});

			return {
				path: pathResult,
				edges: loop
			};
		}
	};
	//find all segments that "touches" a loop
	this.findSegments = function (graph, loop) {};
}

exports.default = HammaAlgorithmWorker;

/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _springEmbedder = __webpack_require__(3);

var _adjacencyList = __webpack_require__(0);

var _adjacencyList2 = _interopRequireDefault(_adjacencyList);

var _findBridges = __webpack_require__(1);

var _hammaAlgorithm = __webpack_require__(2);

var _hammaAlgorithm2 = _interopRequireDefault(_hammaAlgorithm);

__webpack_require__(4);

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

	var initGraph = new _adjacencyList2.default();
	initGraph.initializeFromText(nodesText);

	var hammaAlgorithmWorker = new _hammaAlgorithm2.default(drawField);
	hammaAlgorithmWorker.makePlanarity(initGraph);
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _plane = __webpack_require__(7);

var _plane2 = _interopRequireDefault(_plane);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvasSize = {
	width: 800,
	height: 800
};

var nodeRadius = 15;

var canvasCorners = {
	topLeft: {
		x: nodeRadius,
		y: nodeRadius,
		type: "fictive"
	},
	topRight: {
		x: canvasSize.width - nodeRadius,
		y: nodeRadius,
		type: "fictive"
	},
	bottomLeft: {
		x: nodeRadius,
		y: canvasSize.height - nodeRadius,
		type: "fictive"
	},
	bottomRight: {
		x: canvasSize.width - nodeRadius,
		y: canvasSize.height - nodeRadius,
		type: "fictive"
	}
};

var center = {
	x: 400,
	y: 400
};

function PlaneWorker() {
	this.initializeFromLoop = function (loop) {
		this.nodes = {};
		this.edges = [];

		var radius = loop.length * 25;
		radius = Math.min(radius, 300);

		var angle = 2 * Math.PI / loop.length;

		for (var i = 0; i < loop.length; i++) {
			this.nodes[loop[i]] = {
				x: center.x + radius * Math.cos(i * angle),
				y: center.y + radius * Math.sin(i * angle),
				type: "normal"
			};
		}

		for (var i = 0; i < loop.length - 1; i++) {
			this.edges.push({
				begin: loop[i],
				end: loop[i + 1]
			});
		}

		this.edges.push({
			begin: loop[0],
			end: loop[loop.length - 1]
		});

		//понять, надо ли добавить фиктивные ребра

		this.nodes["topLeft"] = canvasCorners.topLeft;
		this.nodes["topRight"] = canvasCorners.topRight;
		this.nodes["bottomLeft"] = canvasCorners.bottomLeft;
		this.nodes["bottomRight"] = canvasCorners.bottomRight;
		this.nodes["touchPoint"] = {
			x: canvasSize.width - nodeRadius,
			y: this.nodes[loop[0]].y,
			type: "fictive"
		};

		this.planes = [];
		this.planes.push(new _plane2.default(loop.slice()));
		var outerLoop = loop.slice();
		outerLoop.push(loop[0]);
		outerLoop.push("touchPoint");
		outerLoop.push("topRight");
		outerLoop.push("topLeft");
		outerLoop.push("bottomLeft");
		outerLoop.push("bottomRight");
		outerLoop.push("touchPoint");
		this.planes.push(new _plane2.default(outerLoop)); //добавь тип грани(внутр внешн)
	};
}

exports.default = PlaneWorker;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
//this class works with coordinates in canvas
function Plane(loop) {
	this.loop = loop;
	//add chain to plane, divide it to two planes(edges)
	this.addChain = function () {};
}

exports.default = Plane;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
function SvgGraphDrawer() {
	this.draw = function (nodes, edges, svgField) {
		this.svgField = svgField;
		this.initializeField();
		this.drawNodes(nodes);
		this.drawEdges(nodes, edges);
	};
	this.initializeField = function () {
		this.svgField.innerHTML = "";

		this.nodesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.nodesGroup.setAttribute('id', 'nodes');

		this.edgesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.edgesGroup.setAttribute('id', 'edges');

		this.svgField.appendChild(this.edgesGroup);
		this.svgField.appendChild(this.nodesGroup);
	};

	this.drawNodes = function (nodes) {
		for (var key in nodes) {
			var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			circle.setAttribute('cx', nodes[key].x);
			circle.setAttribute('cy', nodes[key].y);
			circle.setAttribute('r', 15);
			if (nodes[key].type === "fictive") {
				circle.setAttribute('stroke-dasharray', "5");
			}
			circle.setAttribute('stroke', "black");
			circle.setAttribute('stroke-width', 2);
			circle.setAttribute('fill', "white");
			this.nodesGroup.appendChild(circle);

			var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			text.setAttribute('x', nodes[key].x - 2);
			text.setAttribute('y', nodes[key].y + 2);
			text.setAttribute('fill', "black");
			text.innerHTML = key;
			this.nodesGroup.appendChild(text);
		}
	};

	this.drawEdges = function (nodes, edges) {
		for (var i = 0; i < edges.length; i++) {
			var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			line.setAttribute('x1', nodes[edges[i].begin].x);
			line.setAttribute('y1', nodes[edges[i].begin].y);
			line.setAttribute('x2', nodes[edges[i].end].x);
			line.setAttribute('y2', nodes[edges[i].end].y);
			line.setAttribute('stroke', "black");
			line.setAttribute('stroke-width', 2);
			this.edgesGroup.appendChild(line);
		}
	};
}

exports.default = SvgGraphDrawer;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map