import Plane from 'plane';

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

function PlaneWorker () {//добавить хранилище контактных вершин
	this.initializeFromLoop = function (loop) {
		this.nodes = {};
		this.edges = [];
		
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
		this.planes.push(new Plane(loop.map(node => ({
			name: node,
			isFictive: false
		})), false));
		var outerLoop = loop.map(node => ({
			name: node,
			isFictive: false
		}));
		outerLoop.push({
			name: loop[0],
			isFictive: false
		});
		outerLoop.push({
			name: "touchPoint",
			isFictive: true
		});
		outerLoop.push({
			name: "topRight",
			isFictive: true
		});
		outerLoop.push({
			name: "topLeft",
			isFictive: true
		});
		outerLoop.push({
			name: "bottomLeft",
			isFictive: true
		});
		outerLoop.push({
			name: "bottomRight",
			isFictive: true
		});
		outerLoop.push({
			name: "touchPoint",
			isFictive: true
		});
		this.planes.push(new Plane(outerLoop, true));  //добавь тип грани(внутр внешн)
	}
	
	this.addChain = function (chain, plane) {
		findTriangles(plane);
		
		function findTriangles (plane) {
			var triangles = [];
			
			alert(areCrossing({
				x: 1,
				y: 3
			}, {
				x: 4,
				y: 3
			}, {
				x: 4,
				y: 3
			}, {
				x: 5,
				y: 5
			}));
			alert(areCrossing({
				x: 1,
				y: 1
			}, {
				x: 3,
				y: 3
			}, {
				x: 1,
				y: 1
			}, {
				x: 5,
				y: 5
			}));
			
			alert(areCrossing({
				x: 1,
				y: 1
			}, {
				x: 3,
				y: 3
			}, {
				x: 4,
				y: 4
			}, {
				x: 6,
				y: 6
			}));
			
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
		}
	}
}

export default PlaneWorker;