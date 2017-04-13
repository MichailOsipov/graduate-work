import {firstStep, makeOneStabilization, startStabilization} from 'spring-embedder';

import AdjacencyList from 'adjacency-list';
import {findBridges} from 'find-bridges';

import './main.scss';

var height = 800;
var width = 1500;

var timerId;

var drawField = document.getElementById("drawField");
drawField.setAttribute('height', height + "px");
drawField.setAttribute('width', width + "px");

document.getElementById("nodes-input").value = `1->2;1->6;
2->3;2->5;2->9;2->10;
3->4;3->5;
4->5;
6->7;6->8;
7->8;
9->10;
9->11;
10->11;`;

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
toDraw.addEventListener('click', function() {
	var nodesText = document.getElementById("nodes-input").value.replace(/ |\n/g,'').split(';');
	firstStep(nodesText, timerId, height, width, nodesGroup, edgesGroup);
});

var calculateOffset = document.getElementById("calculate-offset");
calculateOffset.addEventListener('click', function() {
	makeOneStabilization(nodesGroup, edgesGroup);
});

var startStab = document.getElementById("start-stabilization");
startStab.addEventListener('click', function() {
	timerId = startStabilization(timerId, nodesGroup, edgesGroup);
});

var planarityFirstStep = document.getElementById("find-bridges");

planarityFirstStep.addEventListener('click', function() {
	var nodesText = document.getElementById("nodes-input").value.replace(/ |\n/g,'').split(';');
	
	var adjacencyList = new AdjacencyList();	
	adjacencyList.initializeFromText(nodesText);	
	
	var bridges = findBridges(adjacencyList.nodes, textGroup);
	
	var components = adjacencyList.getConnectedComponents();
});