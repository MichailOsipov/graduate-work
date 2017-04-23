import AdjacencyList from 'adjacency-list';
import {findBridges} from 'find-bridges';
import PlaneWorker from 'plane-worker';
import SvgGraphDrawer from 'svg-graph-drawer';

function HammaAlgorithmWorker (svgField) {
	this.svgField = svgField;
	this.makePlanarity = function (graph) {
		var bridges = findBridges(graph.nodes);
		graph.removeEdges(bridges);
		var components = graph.getConnectedComponents();
		for (var i = 0; i < components.length; i++) {
			this.planarizeGraph(components[i]);
		}
	}
	
	//graph without bridges
	this.planarizeGraph = function (graph) {
		var loop = this.findLoop(graph);
		if (loop.path.length == 0) return; //дать координаты или что-то еще, если одна вершина
		var planeWorker = new PlaneWorker();
		planeWorker.initializeFromLoop(loop.path);
		var svgGraphDrawer = new SvgGraphDrawer();
		svgGraphDrawer.draw(planeWorker.nodes, planeWorker.edges, svgField)
		graph.removeEdges(loop.edges); //убрать также вершины ни с чем не соединенные //мб не надо
		
		var segments = this.findSegments(graph, loop.path);
		//while segments.length != 0
		var chain;
		while (segments.length != 0) {
			this.calculateGammaFromSegments(segments, planeWorker.planes); //в поиске пути в многоугольнике - добавить реализацию использования фиктивных ребер (внешняя грань)
			segments.sort((segment1, segment2) => {
				return segment1.gammaCount > segment2.gammaCount ? 1 : -1;
			});
			
			//удалить плохие ребра у сегмента если gammaCount = 0
			//если у сегмента одна контактная вершина - сделать доп. проверку, или метод поиска цепи //добавить список уже уложенных вершин
			chain = this.findChain(segments[0], segments[0].contactNodes[0], segments[0].contactNodes[1]);
			//сделать приоритет грани, чтобы outer грань выбиралась последней
			//удалить цепь, собрать новые сегменты
			//уложить цепь, получить новые грани (добавить проверку, если только одна контактная вершина)
			//посчитать заного gamma
			planeWorker.addChain(chain, segments[0].planesIn[0]);
		}
		
	}
	
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
				}
				else if (loopLength === 0) {
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
			}
		}
	}
	
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
				graph: new AdjacencyList()
			};
			segment.graph.addNode(key);
			searchSegment(segment, key, addedNodes, graph);
			segments.push(segment);
		}
		
		return segments;
		
		function includes (array, key) {
			for (var i = 0; i < array.length; i++) {
				if (array[i] === key) return true;
			}
			
			return false;
		}
		
		function checkContactNode (node, graph, segments, addedNodes) {
			for (var neighbor in graph.nodes[node].neighbors) {
					if (includes(addedNodes, neighbor) && !visitedNodes[neighbor]) {
						var segment = {
							contactNodes: [],
							graph:  new AdjacencyList()
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
	}
	
	this.calculateGammaFromSegments = function (segments, planes) {
		for (var i = 0; i < segments.length; i++) {
			segments[i].planesIn = [];
			var gammaCount = 0;
			for (var j = 0; j < planes.length; j++) {
				if (isSegmentIn(segments[i].contactNodes, planes[i].loop)) {
					gammaCount++;
					segments[i].planesIn.push(planes[i]);
				}
			}
			segments[i].gammaCount = gammaCount;
		}
		
		function isSegmentIn(contactNodes, loop) {
			for (var i = 0; i < contactNodes.length; i++) {
				var isNodeInLoop = false;
				for (var j = 0; j < loop.length; j++) {
					if (contactNodes[i] === loop[j].name) {
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
	}

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
	}
}

export default HammaAlgorithmWorker;