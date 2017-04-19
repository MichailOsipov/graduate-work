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

function PlaneWorker () {
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
		this.planes.push(new Plane(loop.slice()));
		var outerLoop = loop.slice();
		outerLoop.push(loop[0]);
		outerLoop.push("touchPoint");
		outerLoop.push("topRight");
		outerLoop.push("topLeft");
		outerLoop.push("bottomLeft");
		outerLoop.push("bottomRight");
		outerLoop.push("touchPoint");
		this.planes.push(new Plane(outerLoop));  //добавь тип грани(внутр внешн)
	}
}

export default PlaneWorker;