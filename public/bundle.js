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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
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

	this.removeEdgesWithRemovingAloneNodes = function (edges) {
		this.removeEdges(edges);
		for (var node in this.nodes) {
			if (Object.keys(this.nodes[node].neighbors).length === 0) {
				this.removeNode(node);
			}
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
	return calculateDepthSearchAndFindBridges(nodes);
}

exports.findBridges = findBridges;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _svgCatmullRomSpline = __webpack_require__(9);

var _svgCatmullRomSpline2 = _interopRequireDefault(_svgCatmullRomSpline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SvgGraphDrawer(svgField) {
	this.svgField = svgField;
	this.draw = function (nodes, edges) {
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
			if (nodes[key].type === "fictive") {
				circle.setAttribute('stroke-dasharray', "5");
			}
			circle.setAttribute('stroke', "black");
			circle.setAttribute('stroke-width', 2);

			if (nodes[key].type === "helpNode") {
				circle.setAttribute('fill', "black");
				circle.setAttribute('r', 5);
			} else {
				circle.setAttribute('fill', "white");
				circle.setAttribute('r', 15);
			}
			this.nodesGroup.appendChild(circle);

			if (nodes[key].type !== "helpNode") {
				var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
				text.setAttribute('x', nodes[key].x - 2);
				text.setAttribute('y', nodes[key].y + 2);
				text.setAttribute('fill', "black");
				text.innerHTML = key;
				this.nodesGroup.appendChild(text);
			}
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

	this.drawHelpLines = function (edges) {
		this.helpEdgesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
		this.svgField.insertBefore(this.helpEdgesGroup, this.svgField.children[0]);
		for (var i = 0; i < edges.length; i++) {
			var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			line.setAttribute('x1', edges[i].begin.x);
			line.setAttribute('y1', edges[i].begin.y);
			line.setAttribute('x2', edges[i].end.x);
			line.setAttribute('y2', edges[i].end.y);
			line.setAttribute('stroke-dasharray', "5");
			line.setAttribute('stroke', "black");
			line.setAttribute('stroke-width', 2);
			this.helpEdgesGroup.appendChild(line);
		}
	};
}

exports.default = SvgGraphDrawer;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _adjacencyList = __webpack_require__(0);

var _adjacencyList2 = _interopRequireDefault(_adjacencyList);

var _findBridges = __webpack_require__(1);

var _planeWorker = __webpack_require__(7);

var _planeWorker2 = _interopRequireDefault(_planeWorker);

var _svgGraphDrawer = __webpack_require__(2);

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
		if (loop.path.length == 0) return; //дать координаты или что-то еще, если одна вершина
		var planeWorker = new _planeWorker2.default();
		planeWorker.initializeFromLoop(loop.path);

		var svgGraphDrawer = new _svgGraphDrawer2.default(svgField);
		svgGraphDrawer.draw(planeWorker.nodes, planeWorker.edges);
		graph.removeEdges(loop.edges); //убрать также вершины ни с чем не соединенные //мб не надо

		var segments = this.findSegments(graph, planeWorker.addedNodes);;
		var badSegments = [];
		//while segments.length != 0
		var chain;

		while (segments.length != 0) {
			this.calculateGammaFromSegments(segments, planeWorker.planes);
			segments.sort(function (segment1, segment2) {
				return segment1.gammaCount > segment2.gammaCount ? 1 : -1;
			});

			//remove one of the contact nodes
			if (segments[0].gammaCount === 0) {
				badSegments.push(segments[0]);
				segments.splice(0, 1);
				continue;
			}

			chain = this.findChain(segments[0], segments[0].contactNodes[0], segments[0].contactNodes[1]);
			//сделать приоритет грани, чтобы outer грань выбиралась последней
			segments[0].planesIn.sort(function (plane1, plane2) {
				return plane1.isOuter === true ? 1 : -1;
			});
			planeWorker.addChain(chain, segments[0].planesIn[0]);

			this.removeChain(graph, chain);

			segments = this.findSegments(graph, planeWorker.addedNodes);

			svgGraphDrawer.draw(planeWorker.nodes, planeWorker.edges);
		}
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

	//find all segments that "touches" an added nodes
	this.findSegments = function (graph, addedNodes) {
		var visitedNodes = {};
		var segments = [];

		for (var key in graph.nodes) {
			if (visitedNodes[key]) continue;
			visitedNodes[key] = true;

			if (includes(addedNodes, key)) {
				checkContactNode(key, graph, segments, addedNodes);
				continue;
			}
			var segment = {
				contactNodes: [],
				graph: new _adjacencyList2.default()
			};
			segment.graph.addNode(key);
			searchSegment(segment, key, addedNodes, graph);
			segments.push(segment);
		}

		return segments;

		function includes(array, key) {
			for (var i = 0; i < array.length; i++) {
				if (array[i] === key) return true;
			}

			return false;
		}

		function checkContactNode(node, graph, segments, addedNodes) {
			for (var neighbor in graph.nodes[node].neighbors) {
				if (includes(addedNodes, neighbor) && !visitedNodes[neighbor]) {
					var segment = {
						contactNodes: [],
						graph: new _adjacencyList2.default()
					};
					segment.graph.addNode(node);
					segment.contactNodes.push(node);

					segment.graph.addNode(neighbor);
					segment.contactNodes.push(neighbor);

					segment.graph.addEdge(node, neighbor);
					segments.push(segment);
				}
			}
		}

		//node is not in the addedNodes
		function searchSegment(segment, node, addedNodes, graph) {
			visitedNodes[node] = true;
			for (var neighbor in graph.nodes[node].neighbors) {

				segment.graph.addNode(neighbor);
				segment.graph.addEdge(node, neighbor);

				if (includes(addedNodes, neighbor)) {
					segment.contactNodes.push(neighbor);
					continue;
				}

				if (!visitedNodes[neighbor]) {
					searchSegment(segment, neighbor, addedNodes, graph);
				}
			}
		}
	};

	this.calculateGammaFromSegments = function (segments, planes) {
		for (var i = 0; i < segments.length; i++) {
			segments[i].planesIn = [];
			var gammaCount = 0;
			for (var j = 0; j < planes.length; j++) {
				if (isSegmentIn(segments[i].contactNodes, planes[j].loop)) {
					gammaCount++;
					segments[i].planesIn.push(planes[j]);
				}
			}
			segments[i].gammaCount = gammaCount; //добавить сортировку граней (внутренняя - не внутренняя)
		}

		function isSegmentIn(contactNodes, loop) {
			for (var i = 0; i < contactNodes.length; i++) {
				var isNodeInLoop = false;
				for (var j = 0; j < loop.length; j++) {
					if (contactNodes[i] === loop[j]) {
						isNodeInLoop = true;
						break;
					}
				}
				if (!isNodeInLoop) {
					return false;
				}
			}
			return true;
		}
	};

	//Find path from start to end in segment
	this.findChain = function (segment, start, end) {
		var path = [];
		path.push(start);

		var visitedNodes = {};
		if (end === undefined) {
			return deepSearch(segment, undefined, start, start, path);
		}
		return deepSearch(segment, undefined, start, end, path);

		function deepSearch(segment, prev, current, end, path) {
			for (var key in segment.graph.nodes[current].neighbors) {
				if (key === prev) continue;
				if (visitedNodes[key]) continue;
				if (key === end) {
					path.push(end);
					return path;
				}

				visitedNodes[key] = true;
				var newPath = path.slice();
				newPath.push(key);
				var res = deepSearch(segment, current, key, end, newPath);
				if (res != []) {
					return res;
				}
			}
			return [];
		}
	};

	this.removeChain = function (graph, chain) {
		var chainToDelete = [];
		for (var i = 0; i < chain.length - 1; i++) {
			chainToDelete.push({
				begin: chain[i],
				end: chain[i + 1]
			});
		}

		chainToDelete.push({
			begin: chain[0],
			end: chain[chain.length - 1]
		});

		graph.removeEdgesWithRemovingAloneNodes(chainToDelete);
	};
}

exports.default = HammaAlgorithmWorker;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var nodes;
var edges;

//������������ ����� �������
var l = 100;
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
		if (nodes[node].x < 15) nodes[node].x = 15;
		if (nodes[node].y < 15) nodes[node].y = 15;
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
	/*if(timerId)
 	clearInterval(timerId);*/
	timerId = setInterval(makeOneStabilization, 150, nodesGroup, edgesGroup);
	return timerId;
}
exports.firstStep = firstStep;
exports.makeOneStabilization = makeOneStabilization;
exports.startStabilization = startStabilization;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _springEmbedder = __webpack_require__(4);

var _adjacencyList = __webpack_require__(0);

var _adjacencyList2 = _interopRequireDefault(_adjacencyList);

var _findBridges = __webpack_require__(1);

var _hammaAlgorithm = __webpack_require__(3);

var _hammaAlgorithm2 = _interopRequireDefault(_hammaAlgorithm);

__webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var height = 800;
var width = 1500;

var timerId;

var drawField = document.getElementById("drawField");
drawField.setAttribute('height', height + "px");
drawField.setAttribute('width', width + "px");
/*1->2;2->3;3->4;4->5;5->6;6->7;7->8; 11->12;12->13;13->14;
14->15;15->16;16->17;17->18; 21->22;22->23;23->24;24->25;25->26;26->27;27->28;
 1->11;2->12;3->13;4->14;5->15;6->16;7->17;8->18; 21->11;22->12;23->13;24->14;25->15;26->16;27->17;28->18;
 24->24a;25->25a;24a->25a;23->24a; 2a->2;2b->2;2c->2; 8a->8;8b->8;8c->8; 26a->26;27a->27;28a->28;26a->27a;27a->28a;
 27a->28;27a->27b;27b->27c;27c->27h;27f->27c;27h->27f;*/
/*document.getElementById("nodes-input").value = `1->2;1->6;
2->3;2->5;2->9;2->10;
3->4;3->5;
4->5;
6->7;6->8;
7->8;
9->10;
9->11;
10->11;`;
*/
/*document.getElementById("nodes-input").value = `a->b; a->c; a->d; a->e; a->f; a->k;
a->l;
b->c; b->d; b->e; b->f; b->k; b->l;
c->d; c->e; c->f; c->k; c->l;
d->e; d->f; d->k; d->l;
e->f; e->k; e->l;
f->k;f->l;
k->l;`;*/
/*1->2;1->3;1->4;1->4;1->5;
2->3;2->4;2->5;
3->4;3->5;
4->5;*/
document.getElementById("nodes-input").value = '1->2;1->3;1->4;1->4;1->5;\n2->3;2->4;2->5;\n3->4;3->5;\n4->5;';
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _plane = __webpack_require__(8);

var _plane2 = _interopRequireDefault(_plane);

var _svgGraphDrawer = __webpack_require__(2);

var _svgGraphDrawer2 = _interopRequireDefault(_svgGraphDrawer);

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

var uniqueHelpPointId = 1;

function PlaneWorker() {
	//добавить хранилище контактных вершин
	this.initializeFromLoop = function (loop) {
		this.nodes = {};
		this.edges = [];
		this.addedNodes = loop.slice();

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
		this.planes.push(new _plane2.default(loop, false));

		var outerLoop = loop.slice();
		outerLoop.push(loop[0]);
		outerLoop.push("touchPoint");
		outerLoop.push("topRight");
		outerLoop.push("topLeft");
		outerLoop.push("bottomLeft");
		outerLoop.push("bottomRight");
		outerLoop.push("touchPoint");
		this.planes.push(new _plane2.default(outerLoop, true)); //добавь тип грани(внутр внешн)
	};

	this.addChain = function (chain, plane) {
		var triangles = findTriangles(plane, this.nodes);

		var path = findPathFromTriangles(chain, triangles, plane.loop, this.nodes);

		path = putChainToPath(path, chain);

		addPathToGraph(path, this.nodes, this.edges);

		//var newPlanes = plane.addChain(chain);
		var helpPlaneInfo = {};
		if (plane.isOuter) {
			helpPlaneInfo = isPlaneLoopBroken(plane.loop, path, this.nodes);
		}
		var newPlanes = plane.addChain(path.map(function (pathItem) {
			return pathItem.name;
		}), helpPlaneInfo);

		this.planes = this.planes.filter(function (item) {
			if (item.id === plane.id) {
				return false;
			}
			return true;
		});

		this.planes.push(newPlanes[0]);
		this.planes.push(newPlanes[1]);

		function findTriangles(plane, nodes) {
			var triangles = [];
			var edges = getEdgesFromLoop(plane.loop, nodes);
			var newEdges = [];
			var loop = plane.loop.slice();
			for (var i = 0; loop.length > 3; i++) {
				var startName = loop[i % loop.length];
				var middle = loop[(i + 1) % loop.length];
				var endName = loop[(i + 2) % loop.length];
				if (isCrosingWithPolygonEdges(nodes[startName], nodes[endName], edges)) {
					continue;
				}
				if (isCrosingWithPolygonEdges(nodes[startName], nodes[endName], newEdges)) {
					continue;
				}
				if (!isNodeInsidePoligone({
					x: (nodes[startName].x + nodes[endName].x) / 2,
					y: (nodes[startName].y + nodes[endName].y) / 2
				}, plane, nodes)) {
					continue;
				}

				triangles.push([startName, middle, endName]);
				newEdges.push({
					begin: {
						x: nodes[startName].x,
						y: nodes[startName].y
					},
					end: {
						x: nodes[endName].x,
						y: nodes[endName].y
					}
				});
				loop.splice((i + 1) % loop.length, 1);
			}
			triangles.push([loop[0], loop[1], loop[2]]);

			var svgField = document.getElementById("drawField");
			var svgGraphDrawer = new _svgGraphDrawer2.default(svgField);
			svgGraphDrawer.drawHelpLines(newEdges);
			return triangles;

			function getEdgesFromLoop(loop, nodes) {
				var edges = [];
				for (var i = 0; i < plane.loop.length - 1; i++) {
					edges.push({
						begin: {
							x: nodes[loop[i]].x,
							y: nodes[loop[i]].y
						},
						end: {
							x: nodes[loop[i + 1]].x,
							y: nodes[loop[i + 1]].y
						}
					});
				}

				edges.push({
					begin: {
						x: nodes[loop[0]].x,
						y: nodes[loop[0]].y
					},
					end: {
						x: nodes[loop[loop.length - 1]].x,
						y: nodes[loop[loop.length - 1]].y
					}
				});
				return edges;
			}

			function isCrosingWithPolygonEdges(start, end, edges) {
				for (var i = 0; i < edges.length; i++) {
					if (areCrossing(start, end, edges[i].begin, edges[i].end)) return true;
				}
				return false;
			}

			function areCrossing(p1, p2, p3, p4) {
				var v1 = vectorMult(p4.x - p3.x, p4.y - p3.y, p1.x - p3.x, p1.y - p3.y);
				var v2 = vectorMult(p4.x - p3.x, p4.y - p3.y, p2.x - p3.x, p2.y - p3.y);
				var v3 = vectorMult(p2.x - p1.x, p2.y - p1.y, p3.x - p1.x, p3.y - p1.y);
				var v4 = vectorMult(p2.x - p1.x, p2.y - p1.y, p4.x - p1.x, p4.y - p1.y);
				if (v1 == 0 && v2 == 0 && v3 == 0 && v4 == 0) {
					var l1 = Math.sqrt(sqr(p1.x - p2.x) + sqr(p1.y - p2.y));
					var l2 = Math.sqrt(sqr(p3.x - p4.x) + sqr(p3.y - p4.y));
					return sqr(p1.x + p2.x - (p3.x + p4.x)) + sqr(p1.y + p2.y - (p3.y + p4.y)) <= sqr(l1 + l2);
				}
				if (v1 * v2 < 0 && v3 * v4 < 0) {
					return true;
				}
				return false;

				function vectorMult(ax, ay, bx, by) {
					return ax * by - bx * ay;
				}

				function sqr(x) {
					return x * x;
				}
			}

			function isNodeInsidePoligone(point, plane, nodes) {
				//https://github.com/substack/point-in-polygon
				var x = point.x,
				    y = point.y;
				var inside = false;

				for (var i = 0, j = plane.loop.length - 1; i < plane.loop.length; j = i++) {
					var xi = nodes[plane.loop[i]].x,
					    yi = nodes[plane.loop[i]].y;
					var xj = nodes[plane.loop[j]].x,
					    yj = nodes[plane.loop[j]].y;

					var intersect = yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
					if (intersect) {
						inside = !inside;
					}
				}

				return inside;
			}

			/*function isNormalAnlges(point1, point2, point3) {
   	var normalAngle = 5;
   	var a = getLengthOfLineSegment(point1, point2);
   	var b = getLengthOfLineSegment(point2, point3);
   	var c = getLengthOfLineSegment(point1, point3);
   	
   	var kc = Math.acos(((a*a)+(b*b)-(c*c))/(2*a*b));
   	kc = (kc*180)/Math.PI;
   	var kb = Math.acos(((a*a)+(c*c)-(b*b))/(2*a*c));
   	kb = (kb*180)/Math.PI;
   	var ka = Math.acos(((c*c)+(b*b)-(a*a))/(2*c*b));
   	ka = (ka*180)/Math.PI;
   	
   	if (kc < normalAngle || kb < normalAngle || ka < normalAngle) {
   		return false;
   	} else {
   		return true;
   	}
   	
   	function getLengthOfLineSegment(point1, point2) {
   		var x = point1.x - point2.x;
   		var y = point1.y - point2.y;
   		return Math.sqrt(x*x + y*y);
   	}
   }*/
		}

		function findPathFromTriangles(chain, triangles, loop, nodes) {
			var trianglesPath = [];
			var triangelsToSearch = triangles.map(function (triangleItem) {
				return {
					isVisited: false,
					triangle: triangleItem
				};
			});
			//get triangles that contains chain init node
			for (var i = 0; i < triangelsToSearch.length; i++) {
				if (isNodeInTriangle(chain[0], triangelsToSearch[i].triangle)) {
					trianglesPath.push({
						path: [],
						triangle: triangelsToSearch[i].triangle
					});
					triangelsToSearch[i].isVisited = true;
				}
			}
			//add method, if chain starts and ends in the same place

			//find if possible triangles, that contains first and last elements from chain
			for (var i = 0; i < trianglesPath.length; i++) {
				if (isNodeInTriangle(chain[chain.length - 1], trianglesPath[i].triangle)) {
					//add support of long path
					return handleOneTrianglePath(trianglesPath[i].triangle, chain[0], chain[chain.length - 1], loop, nodes);
				}
			}

			var isPathFind = false;
			var prePath = [];
			while (!isPathFind) {
				var newTrianglesPath = [];
				for (var i = 0; i < trianglesPath.length; i++) {
					for (var j = 0; j < triangelsToSearch.length; j++) {
						if (triangelsToSearch[j].isVisited) continue;

						var contactEdge = FindIfTriangleTouchAnotherTriangle(trianglesPath[i].triangle, triangelsToSearch[j].triangle);
						if (contactEdge !== undefined) {
							var newPath = trianglesPath[i].path.slice();
							newPath.push(contactEdge);
							newTrianglesPath.push({
								path: newPath,
								triangle: triangelsToSearch[j].triangle
							});
							triangelsToSearch[j].isVisited = true;
						}
					}
				}
				trianglesPath = newTrianglesPath;

				for (var k = 0; k < trianglesPath.length; k++) {
					if (isNodeInTriangle(chain[chain.length - 1], trianglesPath[k].triangle)) {
						isPathFind = true;
						prePath = trianglesPath[k].path;
					}
				}
			}

			var path = convertTrianglesPath(prePath, nodes, chain);

			return path;

			function isNodeInTriangle(node, triangle) {
				for (var j = 0; j < 3; j++) {
					if (triangle[j] === node) {
						return true;
					}
				}
				return false;
			}

			function handleOneTrianglePath(triangle, node1, node2, loop, nodes) {
				if (!isEdgeInLoop(node1, node2, loop)) {
					var path = [];
					path.push(getPathElem(node1, nodes));
					path.push(getPathElem(node2, nodes));
					return path;
				}

				var p1 = {
					x: nodes[triangle[0]].x,
					y: nodes[triangle[0]].y
				};
				var p2 = {
					x: nodes[triangle[1]].x,
					y: nodes[triangle[1]].y
				};
				var p3 = {
					x: nodes[triangle[2]].x,
					y: nodes[triangle[2]].y
				};

				var x = (p1.x + p2.x + p3.x) / 3;
				var y = (p1.y + p2.y + p3.y) / 3;

				var path = [];
				path.push(getPathElem(node1, nodes));
				path.push({
					name: "helpNode" + uniqueHelpPointId,
					x: x,
					y: y,
					type: "helpNode"
				});
				path.push(getPathElem(node2, nodes));
				uniqueHelpPointId++;

				function getPathElem(nodeName, nodes) {
					return {
						name: nodeName,
						x: nodes[nodeName].x,
						y: nodes[nodeName].y,
						type: nodes[nodeName].type
					};
				}
			}

			function isEdgeInLoop(node1, node2, loop) {
				for (var i = 0; i < loop.length; i++) {
					if (loop[i] === node1) {
						var prev = i - 1,
						    next = i + 1;
						if (next === loop.length) {
							next = 0;
						}
						if (prev === -1) {
							prev = loop.length - 1;
						}
						if (loop[next] === node2) {
							return true;
						}
						if (loop[prev] === node2) {
							return true;
						}
					}
				}
				return false;
			}

			function FindIfTriangleTouchAnotherTriangle(triangle1, triangle2) {
				for (var i = 0; i < 2; i++) {
					if (isNodeInTriangle(triangle1[i], triangle2) && isNodeInTriangle(triangle1[i + 1], triangle2)) {
						return [triangle1[i], triangle1[i + 1]];
					}
				}

				if (isNodeInTriangle(triangle1[0], triangle2) && isNodeInTriangle(triangle1[triangle1.length - 1], triangle2)) {
					return [triangle1[0], triangle1[triangle1.length - 1]];
				}

				return undefined;
			}

			function convertTrianglesPath(prePath, nodes, chain) {
				//add support of long path
				var path = [];

				path.push(getPathElem(chain[0], nodes));

				for (var i = 0; i < prePath.length; i++) {
					var coordinates = getMiddleOfLineSegment(prePath[i], nodes);
					path.push({
						name: "helpNode" + uniqueHelpPointId,
						x: coordinates.x,
						y: coordinates.y,
						type: "helpNode"
					});
					uniqueHelpPointId++;
				}
				path.push(getPathElem(chain[chain.length - 1], nodes));

				return path;

				function getMiddleOfLineSegment(segment, nodes) {
					var node1 = {
						x: nodes[segment[0]].x,
						y: nodes[segment[0]].y
					};
					var node2 = {
						x: nodes[segment[1]].x,
						y: nodes[segment[1]].y
					};

					return {
						x: (node1.x + node2.x) / 2,
						y: (node1.y + node2.y) / 2
					};
				}

				function getPathElem(nodeName, nodes) {
					return {
						name: nodeName,
						x: nodes[nodeName].x,
						y: nodes[nodeName].y,
						type: nodes[nodeName].type
					};
				}
			}
		}

		function putChainToPath(path, chain) {
			if (chain.length === 2) {
				return path;
			}

			if (path.length <= chain.length) {
				return increasePathLength(path, chain);
			}

			return decreasePathLength(path, chain);

			function increasePathLength(path, chain) {
				var isPathComplete = false;
				while (!isPathComplete) {
					for (var i = 0; i < path.length - 1; i = i + 2) {
						if (path.length >= chain.length) {
							isPathComplete = true;
							break;
						}
						var middle = getMiddle(path[i], path[i + 1]);
						path.splice(i + 1, 0, middle);
					}
				}

				for (var i = 1; i < path.length - 1; i++) {
					path[i].name = chain[i];
					path[i].type = "normal";
				}

				return path;

				function getMiddle(point1, point2) {
					return {
						x: (point1.x + point2.x) / 2,
						y: (point1.y + point2.y) / 2
					};
				}
			}

			function decreasePathLength(path, chain) {
				var each = Math.floor((path.length - 2) / (chain.length - 2 + 1));
				for (var i = each, j = 1; j < chain.length - 1; i = i + each, j++) {
					path[i].name = chain[j];
					path[i].type = "normal";
				}
				return path;
			}
		}

		function addPathToGraph(path, nodes, edges) {
			for (var i = 0; i < path.length; i++) {
				nodes[path[i].name] = {
					type: path[i].type,
					x: path[i].x,
					y: path[i].y
				};
			}

			for (var i = 0; i < path.length - 1; i++) {
				edges.push({
					begin: path[i].name,
					end: path[i + 1].name
				});
			}
		}

		function isPlaneLoopBroken(loop, path, nodes) {
			var loopEdge = {
				p1: { x: nodes[loop[0]].x, y: nodes[loop[0]].y },
				p2: { x: nodes["touchPoint"].x, y: nodes["touchPoint"].y }
			};

			for (var i = 0; i < path.length - 1; i++) {
				var p1 = { x: path[i].x, y: path[i].y };
				var p2 = { x: path[i + 1].x, y: path[i + 1].y };

				if (areCrossingWithTouch(loopEdge.p1, loopEdge.p2, p1, p2)) {
					return {
						isLoopBroken: true,
						newStartEdge: findNewStartEdge(path)
					};
				}
			}

			return {
				isLoopBroken: false,
				newStartEdge: undefined
			};

			function areCrossingWithTouch(p1, p2, p3, p4) {
				var v1 = vectorMult(p4.x - p3.x, p4.y - p3.y, p1.x - p3.x, p1.y - p3.y);
				var v2 = vectorMult(p4.x - p3.x, p4.y - p3.y, p2.x - p3.x, p2.y - p3.y);
				var v3 = vectorMult(p2.x - p1.x, p2.y - p1.y, p3.x - p1.x, p3.y - p1.y);
				var v4 = vectorMult(p2.x - p1.x, p2.y - p1.y, p4.x - p1.x, p4.y - p1.y);
				if (v1 == 0 && v2 == 0 && v3 == 0 && v4 == 0) {
					var l1 = Math.sqrt(sqr(p1.x - p2.x) + sqr(p1.y - p2.y));
					var l2 = Math.sqrt(sqr(p3.x - p4.x) + sqr(p3.y - p4.y));
					return sqr(p1.x + p2.x - (p3.x + p4.x)) + sqr(p1.y + p2.y - (p3.y + p4.y)) <= sqr(l1 + l2);
				}
				if (v1 * v2 <= 0 && v3 * v4 <= 0) {
					return true;
				}
				return false;

				function vectorMult(ax, ay, bx, by) {
					return ax * by - bx * ay;
				}

				function sqr(x) {
					return x * x;
				}
			}

			function findNewStartEdge(path) {
				var newStartEdge = path[1];
				for (var i = 1; i < path.length - 1; i++) {
					if (path[i].x > newStartEdge.x) {
						newStartEdge = path[i];
					}
				}
				return newStartEdge.name;
			}
		}
	};
}

exports.default = PlaneWorker;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
//this class works with coordinates in canvas
var uniqueID = 0;
function Plane(loop, isOuter, id) {
	this.loop = loop;
	this.isOuter = isOuter;
	this.id = uniqueID;
	uniqueID++;

	//add chain to plane, divide it to two planes(edges)
	this.addChain = function (chain, helpPlaneInfo) {
		if (!this.isOuter || !helpPlaneInfo.isLoopBroken) {
			return this.addSimpleChain(chain);
		}
		return this.addChainInOuterLoop(chain, helpPlaneInfo.newStartEdge);
	};

	this.addSimpleChain = function (chain) {
		var loop1 = [];
		var loop2 = [];

		var i;
		for (i = 0; i < this.loop.length; i++) {
			loop1.push(this.loop[i]);
			if (this.loop[i] === chain[0] || this.loop[i] === chain[chain.length - 1]) {
				loop2.push(this.loop[i]);
				i++;
				break;
			}
		}

		for (i; i < this.loop.length; i++) {
			loop2.push(this.loop[i]);
			if (this.loop[i] === chain[0] || this.loop[i] === chain[chain.length - 1]) {
				break;
			}
		}

		for (var j = 1; j < chain.length - 1; j++) {
			loop1.push(chain[j]);
		}

		for (var j = chain.length - 2; j > 0; j--) {
			loop2.push(chain[j]);
		}

		loop1.push(this.loop[i]);
		i++;

		for (i; i < this.loop.length; i++) {
			loop1.push(this.loop[i]);
		}

		return [new Plane(loop1, isPlaneOuter(loop1)), new Plane(loop2, isPlaneOuter(loop2))];
	};

	this.addChainInOuterLoop = function (chain, newStartEdge) {
		var loop1 = [];
		var loop2 = [];

		var i;
		for (i = 0; i < this.loop.length; i++) {
			loop1.push(this.loop[i]);
			if (this.loop[i] === chain[0] || this.loop[i] === chain[chain.length - 1]) {
				break;
			}
		}
		for (var j = 1; j < chain.length - 1; j++) {
			loop2.unshift(chain[j]);
			if (chain[j] === newStartEdge) break;
		}

		loop2.push(this.loop[i]);
		i++;

		for (var j = 1; j < chain.length - 1; j++) {
			loop1.push(chain[j]);
		}

		for (i; i < this.loop.length; i++) {
			loop2.push(this.loop[i]);
			if (this.loop[i] === chain[0] || this.loop[i] === chain[chain.length - 1]) {
				loop1.push(this.loop[i]);
				i++;
				break;
			}
		}

		for (var j = chain.length - 2; j > 0; j--) {
			loop2.push(chain[j]);
			if (chain[j] === newStartEdge) {
				break;
			}
		}

		for (i; i < this.loop.length; i++) {
			if (this.loop[i] === this.loop[0]) {
				i++;
				break;
			}
			loop1.push(this.loop[i]);
		}

		for (i; i < this.loop.length; i++) {
			loop2.push(this.loop[i]);
		}

		return [new Plane(loop1, isPlaneOuter(loop1)), new Plane(loop2, isPlaneOuter(loop2))];
	};

	function isPlaneOuter(loop) {
		for (var i = 0; i < loop.length; i++) {
			if (loop[i] === "topRight") return true;
		}
		return false;
	}
}

exports.default = Plane;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var simplify = __webpack_require__(10);

function toPoints(points, tolerance, highestQuality) {
    var mappedToObjXY = mapPointsArray2ObjectXY(points);
    var simplified;
    if (tolerance !== undefined || highestQuality !== undefined) {
        simplified = simplify(mappedToObjXY, tolerance, highestQuality);
    } else {
        simplified = mappedToObjXY;
    }
    var converted = catmullRom2bezier(simplified);
    return converted;
};

function toPath(points, tolerance, highestQuality) {
    var cubics = toPoints(points, tolerance, highestQuality);
    var attribute = `M${points[0][0]}, ${points[0][1]}`;
    for (let i = 0; i < cubics.length; i++) {
        attribute += `C${cubics[i][0]},${cubics[i][1]} ${cubics[i][2]},${cubics[i][3]} ${cubics[i][4]},${cubics[i][5]}`;
    }
    return attribute;
};

function catmullRom2bezier(pts) {
    var cubics = [];
    for (var i = 0, iLen = pts.length; i < iLen; i++) {
        var p = [
            pts[i - 1],
            pts[i],
            pts[i + 1],
            pts[i + 2]
        ];
        if (i === 0) {
            p[0] = {
                x: pts[0].x,
                y: pts[0].y
            }
        }
        if (i === iLen - 2) {
            p[3] = {
                x: pts[iLen - 2].x,
                y: pts[iLen - 2].y
            };
        }
        if (i === iLen - 1) {
            p[2] = {
                x: pts[iLen - 1].x,
                y: pts[iLen - 1].y
            };
            p[3] = {
                x: pts[iLen - 1].x,
                y: pts[iLen - 1].y
            };
        }
        var val = 6;
        cubics.push([
            (-p[0].x + val * p[1].x + p[2].x) / val,
            (-p[0].y + val * p[1].y + p[2].y) / val,
            (p[1].x + val * p[2].x - p[3].x) / val,
            (p[1].y + val * p[2].y - p[3].y) / val,
            p[2].x,
            p[2].y
        ]);
    }
    return cubics;
}

function mapPointsArray2ObjectXY(points) {
    return points.map(function(point) {
        return {
            x: point[0],
            y: point[1]
        };
    });
}

function mapPointsObjectXY2Array(points) {
    return points.map(function(point) {
        return [
            point.x,
            point.y
        ];
    });
}

module.exports = {
    toPoints: toPoints,
    toPath: toPath
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
 (c) 2013, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/

(function () { 'use strict';

// to suit your point format, run search/replace for '.x' and '.y';
// for 3D version, see 3d branch (configurability would draw significant performance overhead)

// square distance between 2 points
function getSqDist(p1, p2) {

    var dx = p1.x - p2.x,
        dy = p1.y - p2.y;

    return dx * dx + dy * dy;
}

// square distance from a point to a segment
function getSqSegDist(p, p1, p2) {

    var x = p1.x,
        y = p1.y,
        dx = p2.x - x,
        dy = p2.y - y;

    if (dx !== 0 || dy !== 0) {

        var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
            x = p2.x;
            y = p2.y;

        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p.x - x;
    dy = p.y - y;

    return dx * dx + dy * dy;
}
// rest of the code doesn't care about point format

// basic distance-based simplification
function simplifyRadialDist(points, sqTolerance) {

    var prevPoint = points[0],
        newPoints = [prevPoint],
        point;

    for (var i = 1, len = points.length; i < len; i++) {
        point = points[i];

        if (getSqDist(point, prevPoint) > sqTolerance) {
            newPoints.push(point);
            prevPoint = point;
        }
    }

    if (prevPoint !== point) newPoints.push(point);

    return newPoints;
}

// simplification using optimized Douglas-Peucker algorithm with recursion elimination
function simplifyDouglasPeucker(points, sqTolerance) {

    var len = points.length,
        MarkerArray = typeof Uint8Array !== 'undefined' ? Uint8Array : Array,
        markers = new MarkerArray(len),
        first = 0,
        last = len - 1,
        stack = [],
        newPoints = [],
        i, maxSqDist, sqDist, index;

    markers[first] = markers[last] = 1;

    while (last) {

        maxSqDist = 0;

        for (i = first + 1; i < last; i++) {
            sqDist = getSqSegDist(points[i], points[first], points[last]);

            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }

        if (maxSqDist > sqTolerance) {
            markers[index] = 1;
            stack.push(first, index, index, last);
        }

        last = stack.pop();
        first = stack.pop();
    }

    for (i = 0; i < len; i++) {
        if (markers[i]) newPoints.push(points[i]);
    }

    return newPoints;
}

// both algorithms combined for awesome performance
function simplify(points, tolerance, highestQuality) {

    var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

    points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
    points = simplifyDouglasPeucker(points, sqTolerance);

    return points;
}

// export as AMD module / Node module / browser or worker variable
if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return simplify; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
else if (typeof module !== 'undefined') module.exports = simplify;
else if (typeof self !== 'undefined') self.simplify = simplify;
else window.simplify = simplify;

})();


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map