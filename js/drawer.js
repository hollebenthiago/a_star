
// GLOBAL VARIABLES
const rows      = 55;
const cols      = 55;
const w         = 700;
const h         = 700;
var start       = [0, 0];
var end         = [rows-1, cols-1];
var drawGrid    = false;
var changeStart = false;
var buttons     = [];
let mousepos;
let clickpos;
let algorithm;


//FUNCTIONS FOR THE GRID SPOTS
function getSpot(mousepos){
    let theI = Math.floor(mousepos.x/(w/rows))
    let theJ = Math.floor(mousepos.y/(h/cols))
    return {i: theI,
            j: theJ}
}

function getNeighbors(spot) {
    neighbors = spot.neighbors
    let result = [];
    for (i = 0; i < neighbors.length; i++) {
        result.push(grid[neighbors[i][0]][neighbors[i][1]])
    }
    return result;
}

function gridSpot(i, j, camefrom, topology) {
    this.i        = i;
    this.j        = j;
    this.wall     = false;
    this.camefrom = camefrom;
    this.draw = function(m, n) {
        
        let fillStyle;
        if ((start[0] == m && start[1] == n) || (end[0] == m && end[1] == n)) {
            fillStyle = fill('blue');
            fillStyle;
        }
        else if (!this.wall) {
            fillStyle = fill('white')
            fillStyle;
        }
        else {
            fillStyle = fill(0);
            fillStyle;
        }
        rect(this.i * w / rows, this.j * h / cols, 
             w / rows - 1, h / cols - 1)
        fillStyle = undefined;
    }
    this.topology = topology;
    if (this.topology == 'line') {
        this.neighbors = [];
        if (i == 0 && j == 0) {
            this.neighbors.push(
                [i + 1, j],
                [i, j + 1],
            )
        }
        else if (i == 0 && j != 0 ) {
            this.neighbors.push(
                [i + 1, j],
                [i, j + 1],
                [i, j - 1],
            )
        }
        else if (i != 0 && j == 0) {
            this.neighbors.push(
                [i + 1, j],
                [i - 1, j],
                [i, j + 1],
            )
        }
        else {
            this.neighbors.push(
                [i + 1, j],
                [i - 1, j],
                [i, j + 1],
                [i, j - 1],
            )
        }
    }
}
//START GRID
var grid = new Array(rows);

for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
}


//SETUP FUNCTION
function setup() {

    //defining draw walls button
    var drawbtn = createButton('Draw walls');
    drawbtn.parent('buttonsHere')

    //defining change start/end button
    var setstartbtn = createButton('Set start/end');
    setstartbtn.parent('buttonsHere')

    //defining the start algorithm button
    var algbtn = createButton('Start!');
    algbtn.parent('buttonsHere')

    //adding click event for draw walls button
    drawbtn.mousePressed(() => {
        drawGrid = !drawGrid;
        if (drawGrid) {
            drawbtn.elt.style.backgroundColor = 'red'
            changeStart = false;
            algorithm   = false;
        } 
        else {
            drawbtn.elt.style.backgroundColor = ''
        }
    })

    //adding click event for change start/end button    
    setstartbtn.mousePressed(() => {
        changeStart = !changeStart;
        if (changeStart) {
            setstartbtn.elt.style.backgroundColor = 'red'
            drawGrid  = false;
            algorithm = false;

        } 
        else {
            setstartbtn.elt.style.backgroundColor = ''
        }
    })

    //adding click event for start algorithm button    
    algbtn.mousePressed(() => {
        algorithm = !algorithm;
        if (algorithm) {
            algbtn.elt.style.backgroundColor = 'red'
            drawGrid    = false;
            changeStart = false;
        } 
        else {
            algbtn.elt.style.backgroundColor = ''
        }
    })


    //adding buttons to list of buttons
    buttons.push(drawbtn);
    buttons.push(setstartbtn);
    buttons.push(algbtn);

    //creating canvas
    var canvas = createCanvas(w, h);
    canvas.parent('canvasHere')
    //initial drawing of the grid
    var rect = document.getElementById('defaultCanvas0').getBoundingClientRect();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = new gridSpot(i, j, undefined, 'line');
            grid[i][j].draw(i, j);
        }
    }
    //adding draw walls and set start/end events to canvas
    document.getElementById('defaultCanvas0').addEventListener('mousemove', addWalls)
    document.getElementById('defaultCanvas0').addEventListener('click', setStartEnd)    
}

//ADD WALLS EVENT/FUNCTION
function addWalls(event) {
    var rect = document.getElementById('defaultCanvas0').getBoundingClientRect();
    mousepos = {x: (event.clientX - rect.left) / (rect.right - rect.left) * w,
                y: (event.clientY - rect.top) / (rect.bottom - rect.top) * h
            };
    let toWall = getSpot(mousepos)
    if (event.shiftKey && drawGrid) {
        grid[toWall.i][toWall.j].wall = true;
    }
    else if (!event.shiftKey && event.ctrlKey && drawGrid) {
        grid[toWall.i][toWall.j].wall = false;
    }
}

function setStartEnd(event) {
    var rect = document.getElementById('defaultCanvas0').getBoundingClientRect();
    clickpos = {x: (event.clientX - rect.left) / (rect.right - rect.left) * w,
                y: (event.clientY - rect.top) / (rect.bottom - rect.top) * h
            };
    let oneEnd = getSpot(clickpos)
    if (event.shiftKey && changeStart) {
        start = [oneEnd.i, oneEnd.j]
    }
    else if (!event.shiftKey && event.ctrlKey && changeStart) {
        end = [oneEnd.i, oneEnd.j]
    }
}

//LOOP
function draw() {
    // code
    if (!drawGrid) {
        buttons[0].elt.style.backgroundColor = ''
    }
    if (!changeStart) {
        buttons[1].elt.style.backgroundColor = ''
    }
    if (!algorithm) {
        buttons[2].elt.style.backgroundColor = ''
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].draw(i, j);
        }
    }
    
}