import AdjacencyList from 'adjacency-list';
import {findBridges} from 'find-bridges';
import PlaneWorker from 'plane-worker';
import SvgGraphDrawer from 'svg-graph-drawer';
import SpringEmbedderWorker from 'spring-embedder';

function HammaAlgorithmWorker (svgField) {
	this.svgField = svgField;
	this.makePlanarity = function (graph) {
		var bridges = findBridges(graph.nodes);
		graph.removeEdges(bridges);
		var planarComponents = [];
		var components = graph.getConnectedComponents();
		for (var i = 0; i < components.length; i++) {
			planarComponents.push(this.planarizeGraph(components[i]));
		}
		return planarComponents;
	}
	
	//graph without bridges
	this.planarizeGraph = function (graph) {
		var loop = this.findLoop(graph);
		if (loop.path.length == 0) return {
			planaredGraph: new PlaneWorker(loop),
			badSegments: [],
			graph: graph
		};
		var planeWorker = new PlaneWorker();
		planeWorker.initializeFromLoop(loop.path);

		var svgGraphDrawer = new SvgGraphDrawer(svgField);
		svgGraphDrawer.draw(planeWorker.nodes, planeWorker.edges);
		graph.removeEdges(loop.edges); //убрать также вершины ни с чем не соединенные //мб не надо
		
		var segments = this.findSegments(graph, planeWorker.addedNodes);;
		var badSegments = [];
		//while segments.length != 0
		var chain;

		while (segments.length != 0) {
			this.calculateGammaFromSegments(segments, planeWorker.planes);
			segments.sort((segment1, segment2) => {
				return segment1.gammaCount > segment2.gammaCount ? 1 : -1;
			});
			
			//remove one of the contact nodes
			if (segments[0].gammaCount === 0) {
				badSegments.push(segments[0]);
				segments.splice(0, 1);
				continue;
			}
			
			chain = this.findChain(segments[0], segments[0].contactNodes[0], segments[0].contactNodes[1]);
			planeWorker.addChain(chain, segments[0].planesIn[0]);
			this.removeChain(graph, chain);
			segments = this.findSegments(graph, planeWorker.addedNodes);
			svgGraphDrawer.draw(planeWorker.nodes, planeWorker.edges);
		}
		return {
			planaredGraph: planeWorker,
			badSegments: badSegments,
			graph: graph
		};
		/*var springEmbedderEdges = this.convertEdgesForSpringEmbedder(planeWorker.edges);
		
		var springEmbedderWorker = new SpringEmbedderWorker(svgField);
		springEmbedderWorker.nodes = planeWorker.nodes;
		springEmbedderWorker.edges = springEmbedderEdges;*/
		
		//springEmbedderWorker.oneIteration();
		//for (var i = 0; i < 20; i++) {
		//while (true) {
			/*springEmbedderWorker.makeOneStabilization();*/
			/*setInterval(() => {
				springEmbedderWorker.oneIteration();
				svgGraphDrawer.draw(planeWorker.nodes, planeWorker.edges);
			}, 150);*/
		//}
		/*var badChain;
		//put bad segments as is
		while (badSegments.length !== 0) {
			badChain = this.findChain(badSegments[0], badSegments[0].contactNodes[0], badSegments[0].contactNodes[1]);
			
			planeWorker.addBadChain(badChain);
			this.removeChain(graph, badChain);
			badSegments = this.findSegments(graph, planeWorker.addedNodes);
			svgGraphDrawer.draw(planeWorker.nodes, planeWorker.edges);
		}*/
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
		/*!!!
		pathResult = ["1", "2", "3", "4", "5", "6", "7"];*/
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
	}
	
	this.useSpringEmbedder = function (planaredGraph) {
		var springEmbedderEdges = this.convertEdgesForSpringEmbedder(planaredGraph.edges);
		var springEmbedderWorker = new SpringEmbedderWorker(svgField);
		springEmbedderWorker.nodes = planaredGraph.nodes;
		springEmbedderWorker.edges = springEmbedderEdges;
		
		var svgGraphDrawer = new SvgGraphDrawer(svgField);
		
		var timer = setInterval(() => {
			springEmbedderWorker.oneIteration();
			svgGraphDrawer.draw(planaredGraph.nodes, planaredGraph.edges);
		}, 150);
		return timer;
	}
	
	this.convertEdgesForSpringEmbedder = function (edges) {
		var springEmbedderEdges = {};
		for (var i = 0; i < edges.length; i++) {
			if (!springEmbedderEdges[edges[i].begin]) {
				springEmbedderEdges[edges[i].begin] = {};
			}
			springEmbedderEdges[edges[i].begin][edges[i].end] = true;
			
			if (!springEmbedderEdges[edges[i].end]) {
				springEmbedderEdges[edges[i].end] = {};
			}
			springEmbedderEdges[edges[i].end][edges[i].begin] = true;
		}
		
		return springEmbedderEdges;
	}
	
	this.addNonPlanarEdges = function (component) {
		var planaredGraph = component.planaredGraph;
		var badSegments = component.badSegments;
		var graph = component.graph;
		
		var badChain;
		var svgGraphDrawer = new SvgGraphDrawer(svgField);
		while (badSegments.length !== 0) {
			badChain = this.findChain(badSegments[0], badSegments[0].contactNodes[0], badSegments[0].contactNodes[1]);
			
			planaredGraph.addBadChain(badChain);
			this.removeChain(graph, badChain);
			badSegments = this.findSegments(graph, planaredGraph.addedNodes);
			svgGraphDrawer.draw(planaredGraph.nodes, planaredGraph.edges);
		}
	}
}

export default HammaAlgorithmWorker;