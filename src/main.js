import SpringEmbedderWorker from 'spring-embedder';

import AdjacencyList from 'adjacency-list';
import {findBridges} from 'find-bridges';
import HammaAlgorithmWorker from 'hamma-algorithm';

import './main.scss';

import {canvasSize} from 'canvas-parameters';
var height = canvasSize.height;
var width = canvasSize.width;

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
document.getElementById("nodes-input").value = `1->2;1->3;1->4;1->4;1->5;
2->3;2->4;2->5;
3->4;3->5;
4->5;`;

//spring-embedder
var springEmbedderWorker = new SpringEmbedderWorker(drawField);

var randomizeNodesAndDraw = document.getElementById("randomize-nodes-and-draw");
randomizeNodesAndDraw.addEventListener('click', function () {
	var nodesText = document.getElementById("nodes-input").value.replace(/ |\n/g,'').split(';');
	springEmbedderWorker.firstStep(nodesText, height, width);
});

var calculateOffset = document.getElementById("calculate-offset");
calculateOffset.addEventListener('click', function () {
	springEmbedderWorker.makeOneStabilization();
});

var startStab = document.getElementById("start-stabilization");
startStab.addEventListener('click', function () {
	springEmbedderWorker.startStabilization();
});

//hamma-algorithm
var hammaAlgorithmWorker = new HammaAlgorithmWorker(drawField);

var planarityFirstStep = document.getElementById("planarity");
var planarComponents = [];
planarityFirstStep.addEventListener('click', function () {
	springEmbedderWorker.clearTimers();
	var nodesText = document.getElementById("nodes-input").value.replace(/ |\n/g,'').split(';');
	
	var initGraph = new AdjacencyList();
	initGraph.initializeFromText(nodesText);
	
	planarComponents = hammaAlgorithmWorker.makePlanarity(initGraph);
});

var useSpringEmbedderToPlanarGraph = document.getElementById("planarity-to-spring");
var timers = [];
useSpringEmbedderToPlanarGraph.addEventListener('click', function () {
	if (timers.length !== 0) {
		stopTimers(timers);
		timers = [];
		return;
	}
	for (var i = 0; i < planarComponents.length; i++) {
		var currTimer = hammaAlgorithmWorker.useSpringEmbedder(planarComponents[i].planaredGraph);
		timers.push(currTimer);
	}
	function stopTimers (timers) {
		for (var i = 0; i < timers.length; i++) {
			clearInterval(timers[i]);
		}
	}
});

var addNonPlanarEdges = document.getElementById("add-non-planar-edges");
addNonPlanarEdges.addEventListener('click', function () {
	for (var i = 0; i < planarComponents.length; i++) {
		hammaAlgorithmWorker.addNonPlanarEdges(planarComponents[i]);
	}
});