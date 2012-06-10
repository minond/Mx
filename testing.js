var beedrill, context, canvas_elem;

beedrill = document.createElement("img");
canvas_elem = document.createElement("canvas");

beedrill.src = "https://www.google.com/images/srpr/logo3w.png";
canvas_elem.height = 2000;
canvas_elem.width = 2000;

document.body.appendChild(canvas_elem);

context = canvas_elem.getContext("2d");



/*
// Set the style properties.
context.fillStyle   = '#00f';
context.strokeStyle = '#f00';
context.lineWidth   = 4;

context.beginPath();
// Start from the top-left point.
context.moveTo(10, 10); // give the (x,y) coordinates
context.lineTo(100, 10);
context.lineTo(10, 100);
context.lineTo(10, 10);

// Done! Now fill the shape, and draw the stroke.
// Note: your shape will not be visible until you call any of the two methods.
context.fill();
context.stroke();
context.closePath();
*/

beedrill.addEventListener("load", function () {
	context.drawImage(this, 1, 1);
}, false);














