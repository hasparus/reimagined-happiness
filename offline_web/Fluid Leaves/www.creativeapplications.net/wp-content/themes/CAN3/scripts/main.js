var NARDOVE = NARDOVE || {};

NARDOVE.Main = (function()
{
	var canvas = $("#can_canvas"),
		ctx = canvas.get(0).getContext("2d"),
		img = new Image(),
		movingParticles = [],
		caParticles	= [],
		borderParticles	= [],

		colors = [
			// first element on the array sets the color of CA stroke
			// all the rest are for the triangles
			["#000000", "#efefef", "#d8d8d8", "#a2a2a2", "#ffffff", "#868686"], //WB
			["#ffffff", "#000000", "#3c3c3c", "#5d5d5d", "#787878", "#dcdcdc", "#f3f3f3"], //BW
			["#ECD078", "#D95B43", "#C02942", "#542437"], //http://www.colourlovers.com/palette/694737/Thought_Provoking
			["#CFF09E", "#79BD9A", "#3B8686", "#0B486B"], //http://www.colourlovers.com/palette/580974/Adrift_in_Dreams
			["#3FB8AF", "#DAD8A7", "#FF9E9D", "#FF3D7F"] //http://www.colourlovers.com/palette/932683/Compatible
		],


		colorIndex = Math.floor(Math.random() * colors.length),
		inColor = true,

		boundCircle,

		pixelsData,
		pixels,

		stopCALettersAnimation = false,
		caCurrPoint,
		caLinePosX,
		caLinePosY,
		triangleCount = 0,
		MaxTriangles = 82,
		hasReachMaxTriangles = false,
		imageAlphaInc = 0.15, // set an initial alpha value for can-b.svg from 0.0 to 1.0
		imageAlphaFlag = false;


	function init() {
		$.ajax({
			// url: "http://www.creativeapplications.net/wp-content/themes/CAN3/scripts/data/can.svg",
			url: "http://www.creativeapplications.net/wp-content/themes/CAN3/scripts/data/can.svg",
			dataType: "xml",
			success: setup,
			error: function() {
						console.log("data load fail");
					}
		});

		// img.src = "http://www.creativeapplications.net/wp-content/themes/CAN3/scripts/data/can-b.svg";
		img.src = "http://www.creativeapplications.net/wp-content/themes/CAN3/scripts/data/can-b.svg";


		if (window.devicePixelRatio == 2) {
			canvas.get(0).width = 600;
			canvas.get(0).height = 288;
			ctx.scale(2, 2);
			canvas.get(0).style.width = "300px";
		    canvas.get(0).style.height = "144px";
		}
	}


	function setup(svgData) {
		boundCircle = $(svgData).find("#Layer_2").find("circle");

		var bounds = {
			radius: 	boundCircle.attr("r"),
			centerX: 	boundCircle.attr("cx"),
			centerY: 	boundCircle.attr("cy")
		};

		$(svgData).find("#Layer_1")
				  .find("circle")
				  .each(function(i) {
						var point = {
							x: parseFloat($(this).attr("cx")),
							y: parseFloat($(this).attr("cy"))
						};

						// Particle selection by fill color
						var fill = $(this).attr("fill").toUpperCase();
						// Get inner moving particles
						if (fill === "#FF0000") {
							movingParticles.push(new NARDOVE.Particle(ctx, bounds, point.x, point.y));
						}
						// Get static particles
						else {
							movingParticles.push(new NARDOVE.Particle(ctx, bounds, point.x, point.y, 0, 0));
						}

						// Get CA and border particles
						if (fill === "#0000FF") {
							caParticles.push(point);
						}
						else if (fill === "#3FFFCB") {
							borderParticles.push(point);
						}
					});

		caCurrPoint = 1;
		caLinePosX 	= caParticles[0].x;
		caLinePosY 	= caParticles[0].y;

		createColorArray(bounds);

		draw();
	}


	function renderTriangles(inColor) {
		var triangles = Triangulate(movingParticles);

		var t, i = 0;
		for (t in triangles) {
			var tri	= triangles[t],

				v0x = tri.v0.x,
				v0y = tri.v0.y,
				v1x = tri.v1.x,
				v1y = tri.v1.y,
				v2x = tri.v2.x,
				v2y = tri.v2.y,

				// bc -> boundCircle radius
				bc = Math.ceil(boundCircle.attr("r") * 2),
				// cx, cy -> triangle center point
				cx = Math.round((v0x + v1x + v2x) / 3),
				cy = Math.round((v0y + v1y + v2y) / 3),
				// pl -> pixel location
				pl = Math.round(((cy - 1) * (bc * 4)) + ((cx - 1) * 4)),

				R = pixels[pl],
				G = pixels[pl + 1],
				B = pixels[pl + 2];

			if (inColor) {
				if (triangleCount < i) {
					ctx.fillStyle = "rgba(" + R + ", " + G + ", " + B + ", " + 0 + ")";
				}
				else {
					ctx.fillStyle = "rgb(" + R + ", " + G + ", " + B + ")";
				}
				ctx.beginPath();
				ctx.moveTo(v0x, v0y);
				ctx.lineTo(v1x, v1y);
				ctx.lineTo(v2x, v2y);
				ctx.closePath();
				ctx.fill();
			}
			else {
				ctx.lineWidth 	= 1;
				ctx.strokeStyle = "#c9c9c9";
				ctx.beginPath();
				ctx.moveTo(v0x, v0y);
				ctx.lineTo(v1x, v1y);
				ctx.lineTo(v2x, v2y);
				ctx.closePath();
				ctx.stroke();
			}

			// Stop incrementing "i" if all triangles are drawn
			if (triangleCount < MaxTriangles) {
				i++;
			}
		}

		// If all triangles are drawn flag renderCAN() about it
		// May want to increment using a timer instead?
		(triangleCount < MaxTriangles) ? triangleCount++ : hasReachMaxTriangles = true;
	}


	function renderCAN() {
		if (!stopCALettersAnimation) {
			var easing		= 0.95,
				sourcePosX 	= caParticles[caCurrPoint - 1].x,
				sourcePosY 	= caParticles[caCurrPoint - 1].y,
				targetPosX 	= caParticles[caCurrPoint].x,
				targetPosY 	= caParticles[caCurrPoint].y,
				diffX 		= (targetPosX - caLinePosX) * easing,
				diffY 		= (targetPosY - caLinePosY) * easing;

			caLinePosX += diffX;
			caLinePosY += diffY;

			if (caLinePosX.toFixed(3) == targetPosX && caLinePosY.toFixed(3) == targetPosY) {
				if (caCurrPoint < caParticles.length - 1) {
					caCurrPoint++;
					// Skip points 4 and 8
					if (caCurrPoint === 4 || caCurrPoint === 8) {
						caCurrPoint++;
					}
				}
				else {
					// Needs this final increment to animate the closing line
					caCurrPoint++;
					stopCALettersAnimation = true;
				}
			}
		}

		ctx.lineCap 		= "round";
		ctx.lineJoin 		= "round";
		ctx.lineWidth 		= 3.5;
		ctx.strokeStyle 	= colors[colorIndex][0];

		// Draw moving point
		if (!stopCALettersAnimation) {
			ctx.fillStyle = colors[colorIndex][0];
			ctx.beginPath();
			ctx.arc(caLinePosX, caLinePosY, 4, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fill();
		}

		ctx.beginPath();
		// Draw static lines
		if (caCurrPoint > 1) {
			ctx.moveTo(caParticles[0].x, caParticles[0].y);
			var i;
			for (i = 1; i < caCurrPoint; i++) {
				var caA = caParticles[i - 1],
					caB = caParticles[i];

				ctx.lineTo(caA.x, caA.y);
				ctx.lineTo(caB.x, caB.y);
			}
			ctx.stroke();
		}

		// Draw animated line
		ctx.strokeStyle = colors[colorIndex][0];
		ctx.moveTo(sourcePosX, sourcePosY);
		ctx.lineTo(caLinePosX, caLinePosY);
		ctx.stroke();
	}


	function createColorArray(bounds) {
		clearCanvas();

		var diameter 	= bounds.radius * 2,
			cellSize	= 12,
			numCells	= Math.pow( Math.ceil(diameter / cellSize), 2),
			posX 		= 0,
			posY 		= 0;

		var i;
		for (i = 0; i < numCells; i++) {
			var col = 1 + Math.floor(Math.random() * colors[colorIndex].length);

			ctx.fillStyle = colors[colorIndex][col];
			ctx.fillRect(posX, posY, cellSize, cellSize);

			posX += cellSize;
			if (posX > diameter) {
				posX = 0;
				posY += cellSize;
			}
		}

		pixelsData 	= ctx.getImageData(0, 0, diameter, diameter);
		pixels 		= pixelsData.data;

		// ctx.putImageData( pixelsData, canvas.width() / 2, 0 );
	}


	function clearCanvas() {
		ctx.clearRect(0, 0, canvas.width(), canvas.height());
		ctx.globalAlpha = 1;
		ctx.fillStyle = "#f1f1f1";
		ctx.fillRect(0, 0, canvas.width(), canvas.height());
	}


	function draw() {
		clearCanvas();

		// Make particles move around
		var p;
		for (p in movingParticles) {
			movingParticles[p].update();
		}

		if (!hasReachMaxTriangles) {
			renderTriangles(!inColor);
		}
		renderTriangles(inColor);

		if (hasReachMaxTriangles) {
			renderCAN();
			imageAlphaFlag = true;
		}

		// Control image alpha
		if (imageAlphaFlag) {
			imageAlphaInc += 0.01;
			if (imageAlphaInc >= 1.0) {
				imageAlphaInc = 1.0;
				imageAlphaFlag = false;
			}
		}
		ctx.globalAlpha = imageAlphaInc;
		ctx.drawImage(img, 130, 0);

		setTimeout(draw, 33);
		// requestAnimationFrame(draw);
	}


	function hex2rgb(hex) {
		var h = hex.substring(1, 7);
		return {
			R: parseInt(h.substring(0, 2), 16),
			G: parseInt(h.substring(2, 4), 16),
			B: parseInt(h.substring(4, 6), 16)
		}
	}


	init();

})();
