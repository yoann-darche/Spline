const c = document.getElementById('yCanvas');
const ctx = c.getContext("2d");


const defaultColor = "#DDDDDD"

var x1=10, y1=70;
var x2=100, y2=100;
var t = 0;
var k = 0.01
var cl = "black"

var spline_pts = []

PTS = [ {x:250, y:250}, 
        {x:250, y:350}, 
        {x:350, y:350},
        {x:350, y:150},
        {x:100, y:150},
        {x:100, y:450},
        {x:450, y:450} ];




c.addEventListener("click", function(e) {
    var rect= c.getBoundingClientRect();
    const x= e.clientX - rect.left;
    const y= e.clientY - rect.top;

    PTS.push({ x: x, y:y });

});



function draw(t) {

    // clear canavas
    ctx.clearRect(0,0, c.width, c.height)
    ctx.beginPath();
    ctx.strokeStyle=cl;
    ctx.lineWidth = 2;
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2*t + ((1-t)*x1), y2*t + ((1-t)*y1));
    ctx.stroke();
}


function intermediatePoint(pt1, pt2, t) {
    return {
        x: (pt2.x*t) + ((1-t) * pt1.x),
        y: (pt2.y*t) + ((1-t) * pt1.y),
        c: pt1.c
    };
}

function drawTriangle(pts, color, d=10) {
        for(var i=0; i < pts.length; i++) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x-d,pts[i].y-d);
            ctx.lineTo(pts[i].x+d,pts[i].y-d);
            ctx.lineTo(pts[i].x,pts[i].y+d);
            ctx.lineTo(pts[i].x-d,pts[i].y-d);
            ctx.fillStyle = color;
            ctx.fill();

        }
}

function drawSpline(pts, color="#999999") {

    ctx.beginPath();
    ctx.strokeStyle=color;
    ctx.lineWidth = 4;
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach(element => {
        ctx.lineTo(element.x, element.y);
    });

    ctx.stroke();
}

function nextLevel(points, t) {

    var newPoints = [];
    for(var i=0; i<points.length-1; i++) {
        newPoints.push(intermediatePoint(points[i], points[i+1], t));
    }

    return newPoints;

}

function clear() {
    ctx.clearRect(0,0, c.width, c.height)
}

function draw2(pt1, pt2, t, c=defaultColor) {

    // clear canavas
    
    ctx.beginPath();

    ctx.strokeStyle = pt1.c ? pt1.c : c;
    ctx.lineWidth = 2;
    ctx.moveTo(pt1.x,pt1.y);
    ctx.lineTo(pt2.x*t + ((1-t)*pt1.x), pt2.y*t + ((1-t)*pt1.y));
    ctx.stroke();
}

// Appel de la fonction 
setInterval( function() { 

    t += 0.01;
    if(t > 1 ) { t=0; spline_pts=[] }
    clear();

    var points = PTS;

    while (points.length > 1) {
        for (var i=0; i<points.length -1; i++) {
            draw2(points[i], points[i+1], 1);
        }
        drawTriangle(points,"#CCCCCC", 5)
        points = nextLevel(points,t);
    }

    if (points.length >0 ) {

        // draw the last point
        drawTriangle(points,"red");

        spline_pts.push(points[0]);
        drawSpline(spline_pts,"violet");

    }

 

}, 10)


// I/O

function load() {
    const qString = window.location.search;
    const urlParams = new URLSearchParams(qString);
    try {
        Z = urlParams.get('PTS');
        if (Z) 
            PTS = eval(Z); 
       }
       catch (error) {
           
       }


}

function save() {
    k = JSON.stringify(PTS);
    k2 = encodeURIComponent(k);
    const url = window.location.href.split('?')[0] + '?PTS=' + k2;
    //console.log(url);
    window.location.replace(url);
}

load();