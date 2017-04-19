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
		var planes = [];/*
		planes.push(new Plane(loop.path, false));
		planes.push(new Plane(loop.path, true)); //outer edge(plane)*/
		var planeWorker = new PlaneWorker();
		planeWorker.initializeFromLoop(loop.path);
		var svgGraphDrawer = new SvgGraphDrawer();
		svgGraphDrawer.draw(planeWorker.nodes, planeWorker.edges, svgField)
		graph.removeEdges(loop.edges);
		
		this.findSegments(graph, loop); //если сегментов нет - ничего не делать
		//get segments
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
	
	//find all segments that "touches" a loop
	this.findSegments = function (graph, loop) {
		var visitedNodes = {};
		for (var key in graph.nodes) {
			if (visitedNodes[key]) continue;
			visitedNodes[key] = true;
			
			
		}
	}
}

export default HammaAlgorithmWorker;