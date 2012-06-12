var beedrill, context, canvas_elem;

beedrill = document.createElement("img");
canvas_elem = document.createElement("canvas");

beedrill.src = "https://www.google.com/images/srpr/logo3w.png";
canvas_elem.height = 2000;
canvas_elem.width = 2000;

document.body.appendChild(canvas_elem);

context = canvas_elem.getContext("2d");

beedrill.addEventListener("load", function () {
//	context.drawImage(this, 1, 1);
}, false);



function draw_s (x, y) {
	context.beginPath();
	context.moveTo(x * 10, y * 4);
	context.lineTo(x * 10 - 10, y * 4 - 4);
	context.lineTo(x * 10 - 20, y * 4 - 4);
	context.lineTo(x * 10 - 10, y * 4);
	context.lineTo(x * 10, y * 4);
	context.fill();
	context.closePath();
}




for (var i = 0; i < 10; i++) {
	for (var j = 0; j < 10; j++) {
		draw_s(j, i);
	}
}





