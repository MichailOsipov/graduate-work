import Plane from 'plane';
import SvgGraphDrawer from 'svg-graph-drawer';

const canvasSize = {
	width: 800,
	height: 800
}

const nodeRadius = 15;

const canvasCorners = {
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

const center = {
	x: 400,
	y: 400
};

let uniqueHelpPointId = 1;

function PlaneWorker () {//добавить хранилище контактных вершин
	this.initializeFromLoop = function (loop) {
		this.nodes = {};
		this.edges = [];
		this.addedNodes = loop.slice();
		
		var radius = loop.length * 25;
		radius = Math.min(radius, 300);

		var angle = (2 * Math.PI) / loop.length;
		
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
		}
		
		this.planes = [];
		this.planes.push(new Plane(loop, false));
		
		var outerLoop = loop.slice();
		outerLoop.push(loop[0]);
		outerLoop.push("touchPoint");
		outerLoop.push("topRight");
		outerLoop.push("topLeft");
		outerLoop.push("bottomLeft");
		outerLoop.push("bottomRight");
		outerLoop.push("touchPoint");
		this.planes.push(new Plane(outerLoop, true));  //добавь тип грани(внутр внешн)
	}
	
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
		var newPlanes = plane.addChain(path.map(pathItem => {
			return pathItem.name;
		}), helpPlaneInfo);
		
		this.planes = this.planes.filter(item => {
			if (item.id === plane.id) {
				return false;
			}
			return true;
		});
		
		this.planes.push(newPlanes[0]);
		this.planes.push(newPlanes[1]);
		
		function findTriangles (plane, nodes) {
			var triangles = [];
			var edges = getEdgesFromLoop(plane.loop, nodes)
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
					x: (nodes[startName].x + nodes[endName].x)/2,
					y: (nodes[startName].y + nodes[endName].y)/2
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
				loop.splice((i + 1) % loop.length,1);
			}
			triangles.push([loop[0], loop[1], loop[2]]);
			
			var svgField = document.getElementById("drawField");
			var svgGraphDrawer = new SvgGraphDrawer(svgField);
			svgGraphDrawer.drawHelpLines(newEdges);
			return triangles;
			
			function getEdgesFromLoop (loop, nodes) {
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
			
			function areCrossing (p1, p2, p3, p4) {
				var v1 = vectorMult(p4.x - p3.x, p4.y - p3.y, p1.x - p3.x, p1.y - p3.y);
				var v2 = vectorMult(p4.x - p3.x, p4.y - p3.y, p2.x - p3.x, p2.y - p3.y);
				var v3 = vectorMult(p2.x - p1.x, p2.y - p1.y, p3.x - p1.x, p3.y - p1.y);
				var v4 = vectorMult(p2.x - p1.x, p2.y - p1.y, p4.x - p1.x, p4.y - p1.y);
				if (v1 == 0 && v2 == 0 && v3 == 0 && v4 == 0) {
					var l1 = Math.sqrt(sqr(p1.x - p2.x) + sqr(p1.y - p2.y));
					var l2 = Math.sqrt(sqr(p3.x - p4.x) + sqr(p3.y - p4.y));
					return sqr((p1.x + p2.x) - (p3.x + p4.x)) + sqr((p1.y + p2.y) - (p3.y + p4.y)) <= sqr(l1 + l2);
				}
				if ((v1 * v2) < 0 && (v3 * v4) < 0 ) {
					return true;
				}
				return false;
				
				function vectorMult (ax, ay, bx, by) {
					return ax * by - bx * ay;
				}
				
				function sqr (x) {
					return x*x;
				}
			}
			
			function isNodeInsidePoligone (point, plane, nodes) {
				//https://github.com/substack/point-in-polygon
				var x = point.x, y = point.y;
				var inside = false;
				
				for (var i = 0, j = plane.loop.length - 1; i < plane.loop.length; j = i++) {
					var xi = nodes[plane.loop[i]].x, yi = nodes[plane.loop[i]].y;
					var xj = nodes[plane.loop[j]].x, yj = nodes[plane.loop[j]].y;
					
					var intersect = ((yi > y) != (yj > y)) 
						&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
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
			var triangelsToSearch = triangles.map(triangleItem => ({
				isVisited: false,
				triangle: triangleItem
			}));
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
				
				var x = (p1.x + p2.x + p3.x)/3;
				var y = (p1.y + p2.y + p3.y)/3;
				
				var path = [];
				path.push(getPathElem(node1, nodes));
				path.push({
					name: "helpNode" + uniqueHelpPointId,
					x: x,
					y: y,
					type: "helpNode"
				})
				path.push(getPathElem(node2, nodes));
				uniqueHelpPointId++;
				
				function getPathElem(nodeName, nodes) {
					return {
						name: nodeName,
						x: nodes[nodeName].x,
						y: nodes[nodeName].y,
						type: nodes[nodeName].type
					}
				}
				
			}
			
			function isEdgeInLoop(node1, node2, loop) {
				for (var i = 0; i < loop.length; i++) {
					if (loop[i] === node1) {
						var prev = i - 1, next = i + 1;
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
		
			function FindIfTriangleTouchAnotherTriangle (triangle1, triangle2) {
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
						x: (node1.x + node2.x)/2,
						y: (node1.y + node2.y)/2
					}
				}
			
				function getPathElem(nodeName, nodes) {
					return {
						name: nodeName,
						x: nodes[nodeName].x,
						y: nodes[nodeName].y,
						type: nodes[nodeName].type
					}
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
				p1: {x: nodes[loop[0]].x, y: nodes[loop[0]].y},
				p2: {x: nodes["touchPoint"].x, y: nodes["touchPoint"].y}
			};
			
			for (var i = 0; i < path.length - 1; i++) {
				var p1 = {x: path[i].x, y: path[i].y};
				var p2 = {x: path[i + 1].x, y: path[i + 1].y};
				
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
			
			function areCrossingWithTouch (p1, p2, p3, p4) {
				var v1 = vectorMult(p4.x - p3.x, p4.y - p3.y, p1.x - p3.x, p1.y - p3.y);
				var v2 = vectorMult(p4.x - p3.x, p4.y - p3.y, p2.x - p3.x, p2.y - p3.y);
				var v3 = vectorMult(p2.x - p1.x, p2.y - p1.y, p3.x - p1.x, p3.y - p1.y);
				var v4 = vectorMult(p2.x - p1.x, p2.y - p1.y, p4.x - p1.x, p4.y - p1.y);
				if (v1 == 0 && v2 == 0 && v3 == 0 && v4 == 0) {
					var l1 = Math.sqrt(sqr(p1.x - p2.x) + sqr(p1.y - p2.y));
					var l2 = Math.sqrt(sqr(p3.x - p4.x) + sqr(p3.y - p4.y));
					return sqr((p1.x + p2.x) - (p3.x + p4.x)) + sqr((p1.y + p2.y) - (p3.y + p4.y)) <= sqr(l1 + l2);
				}
				if ((v1 * v2) <= 0 && (v3 * v4) <= 0 ) {
					return true;
				}
				return false;
				
				function vectorMult (ax, ay, bx, by) {
					return ax * by - bx * ay;
				}
				
				function sqr (x) {
					return x*x;
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
	}
}

export default PlaneWorker;