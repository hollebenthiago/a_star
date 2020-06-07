const rows = 5;
const cols = 5;
const w    = 700;
const h    = 700;
let mousepos;


function gridSpot(i, j, camefrom, topology) {
    this.i        = i;
    this.j        = j;
    this.wall     = false;
    this.camefrom = camefrom;
    if (this.wall) {
        this.fill = fill('green');
    }
    else {
        this.fill = fill('red')
    }
    this.draw = function() {
        rect(this.i * w / rows, 
            this.j * h / cols, 
            w / rows - 1, 
            h / cols - 1)
    }
    this.topology = topology;
    if (this.topology == 'line') {
        this.neighbors = [];
    }
}

var grid = new Array(rows);

for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
}

function setup() {
    
    var canvas = createCanvas(w, h);
    canvas.parent('canvasHere')
    canvas.id = 'canvas-id';
    console.log(canvas.id);
    var rect = document.getElementById('defaultCanvas0').getBoundingClientRect();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = new gridSpot(i, j, undefined, 'line');
            if (i + j % 2 == 0) {
                grid[i][j].wall = false;
                fill(0);
            }
            else {
                fill('white')
            }
            
            grid[i][j].draw();
        }
    }
    console.log(grid)
    document.getElementById('defaultCanvas0').addEventListener('mousemove', (event) => {
        mousepos = {x: (event.clientX - rect.left) / (rect.right - rect.left) * w,
                    y: (event.clientY - rect.top) / (rect.bottom - rect.top) * h
                };
        console.log(mousepos)
    })
}



function draw() {
// code
    clear();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if ((i + j) % 2 == 0) {
                grid[i][j].wall = false;
                fill(0);
            }
            else {
                fill('white')
            }
            grid[i][j].draw();
        }
    }
}