import Node, { ON, OFF } from "../../src/HashLife/node.js";
import $ from 'jquery';

$(function() {
  const canvas = document.getElementById("lifeCanvas");
  const app = new PIXI.Application({ view: canvas, width: 800, height: 800, backgroundColor: 0xFFFFFF });
  const graphics = new PIXI.Graphics();

  // Create an instance of your class and get the coordinates
  var aNode = Node.join(ON, OFF, ON, ON);
  var bNode = Node.join(aNode, aNode, aNode, aNode);
  const coordinates = Node.expand(bNode);  // Get the coordinates


  // Draw each coordinate on the canvas
  $.each(coordinates, function(index, coord) {
      const [x, y] = coord;
      graphics.beginFill(0x000000);  // Black color
      graphics.drawRect(x, y, 1, 1);  // Draw a 1x1 pixel square at (x, y)
      graphics.endFill();
  });

  app.stage.addChild(graphics);
});


// // Place holder canvas
// let canvas = document.querySelector(".field");
// let ctx = canvas.getContext('2d');
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;


// var bigNode = new Node(2, [aNode, aNode, aNode, aNode], 12, "XOXXXOXXXOXXXOXX")
// var bbNode = new Node(3, [bigNode, bigNode, bigNode, bigNode], 48, "XOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXX")
// var cNode = new Node(4, [bbNode, bbNode, bbNode, bbNode], 192, "XOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXX");
// var dNode = new Node(5, [cNode, cNode, cNode, cNode], 768, "smt")
// console.log(Node.expand(dNode, 0, 0, [canvas.width, canvas.height], 0));


// function draw() {
//     let step = 10;
//     let left = 0.5 - Math.ceil(canvas.width / step) * step;
//     let top = 0.5 - Math.ceil(canvas.height / step) * step;
//     let right = 2*canvas.width;
//     let bottom = 2*canvas.height;
//     ctx.clearRect(left, top, right - left, bottom - top);
//     ctx.beginPath();
//     for (let x = left; x < right; x += step) {
//         ctx.moveTo(x, top);
//         ctx.lineTo(x, bottom);
//     }
//     for (let y = top; y < bottom; y += step) {
//         ctx.moveTo(left, y);
//         ctx.lineTo(right, y);
//     }
//     ctx.strokeStyle = "#888";
//     ctx.stroke();
// }


// // Mouse event handling:
// let start;
// const getPos = (e) => ({
//     x: e.clientX - canvas.offsetLeft,
//     y: e.clientY - canvas.offsetTop 
// });

// const reset = () => {
//     start = null;
//     ctx.setTransform(1, 0, 0, 1, 0, 0); // reset translation
//     draw();
// }

// canvas.addEventListener("mousedown", e => {
//     reset();
//     start = getPos(e)
// });

// canvas.addEventListener("mouseup", reset);
// canvas.addEventListener("mouseleave", reset);

// canvas.addEventListener("mousemove", e => {
//     // Only move the grid when we registered a mousedown event
//     if (!start) return;
//     let pos = getPos(e);
//     // Move coordinate system in the same way as the cursor
//     ctx.translate(pos.x - start.x, pos.y - start.y);
//     draw();
//     start = pos;
// });

// draw(); // on page load