
// GLOBAL VARIABLES
const rows      = 30;
const cols      = 30;
const w         = 700;
const h         = 700;
var start       = [0, 0];
var end         = [rows-1, cols-1];
var drawGrid    = false;
var changeStart = false;
var buttons     = [];
var checking    = [];
var checked     = [];
var path        = [];
var topology    = 'plane';
var ln          = 'No diagonals';
let mousepos;
let clickpos;
let algorithm;

//AUX FUNCTIONS
function removefromArray(array, element) {
    for (let i = array.length-1; i >= 0; i--) {
        if (array[i][0] ==  element[0] && array[i][1] == element[1]) {
            array.splice(i, 1);
        }
    }
}

//METRIC FUNCTION
function metric(topology, ln, a, b) {
    if (topology == 'plane' && ln == 'Allow diagonals') {
        return Math.sqrt((a[0] - b[0])**2 + (a[1] - b[1])**2);
    }
    else if (topology == 'plane' && ln == 'No diagonals') {
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
    }
    else if (topology == 'cylinder' && ln == 'Allow diagonals') {
        return Math.sqrt(Math.min(Math.abs(a[0] - b[0]), Math.abs((rows - a[0] - b[0]) % rows))**2 + Math.abs(a[1] - b[1])**2)
    }
    else if (topology == 'cylinder' && ln == 'No diagonals') {
        return Math.min(Math.abs(a[0] - b[0]), Math.abs((rows - a[0] - b[0]) % rows)) + Math.abs(a[1] - b[1])
    }
    else if (topology == 'torus' && ln == 'Allow diagonals') {
        return Math.min(Math.sqrt((a[0]  - b[0])**2 + (a[1]  - b[1])**2), 
                        Math.sqrt(((rows - a[0] - b[0]) % rows)**2  + (a[1]  - b[1])**2),
                        Math.sqrt((a[0]  - b[0])**2 + ((cols - a[1]   - b[1]) % cols)**2),
                        Math.sqrt(((rows - a[0] - b[0]) % rows)**2  + ((cols - a[1] - b[1]) % cols)**2))
    }
    else if (topology == 'torus' && ln == 'No diagonals') {
        return Math.min(Math.abs(a[0]  - b[0]) + Math.abs(a[1]  - b[1]), 
                        Math.abs((rows - a[0]  - b[0]) % rows)  + Math.abs(a[1]  - b[1]),
                        Math.abs(a[0]  - b[0]) + Math.abs((cols - a[1] - b[1])   % cols),
                        Math.abs((rows - a[0]  - b[0]) % rows   + Math.abs((cols - a[1] - b[1]) % cols)))
    }
}

//FUNCTIONS FOR THE GRID SPOTS
function getSpot(mousepos){
    let theI = Math.floor(mousepos.x/(w/rows))
    let theJ = Math.floor(mousepos.y/(h/cols))
    return {i: theI,
            j: theJ}
}

function getNeighbors(spot) {
    let neighbors = spot.neighbors
    let result = [];
    for (i = 0; i < neighbors.length; i++) {
        result.push(grid[neighbors[i][0]][neighbors[i][1]])
    }
    return result;
}

function gridSpot(i, j, camefrom, topology, ln) {
    this.i        = i;
    this.j        = j;
    this.f        = 0;
    this.g        = 0;
    this.h        = 0;
    this.wall     = false;
    this.camefrom = camefrom;
    this.ln       = ln;
    this.draw = function(m, n) {
        
        let fillStyle;
        if ((start[0] == m && start[1] == n) || (end[0] == m && end[1] == n)) {
            fillStyle = fill('blue');
            fillStyle;
        }
        else if (this.wall) {
            fillStyle = fill(0)
            fillStyle;
        }
        else {
            var inChecking = false;
            var inChecked  = false;
            var inPath     = false;
            for (i = 0; i < checking.length; i ++) {
                if (m == checking[i][0] && n == checking[i][1]) {
                    inChecking = true;
                    fillStyle  = fill('green');
                    fillStyle;
                    break;
                }
            }
            for (i = 0; i < checked.length; i ++) {
                if (m == checked[i][0] && n == checked[i][1]) {
                    inChecked  = true;
                    fillStyle  = fill('red');
                    fillStyle;
                    break;
                }
            }
            for (i = 0; i < path.length; i ++) {
                if (m == path[i][0] && n == path[i][1]) {
                    inPath  = true;
                    fillStyle  = fill('blue');
                    fillStyle;
                    break;
                }
            }
            if (!inChecking && !inChecked && !inPath) {
                fillStyle = fill('white');
                fillStyle;
            }
        }
        rect(this.i * w / rows, this.j * h / cols, 
             w / rows - 1, h / cols - 1)
        fillStyle = undefined;
    }
    this.topology     = topology;
    this.addNeighbors = function (topology, ln, i, j) {
        if (topology == 'plane') {
            this.neighbors = [];
            if (i != 0) {
                this.neighbors.push([i - 1, j])
            }
            if (i != rows - 1) {
                this.neighbors.push([i + 1, j])
            }
            if (j != 0) {
                this.neighbors.push([i, j - 1])
            }
            if (j != cols - 1) {
                this.neighbors.push([i, j + 1])
            }
            if (ln == 'Allow diagonals') {
                if (i != 0 && j != 0) {
                    this.neighbors.push([i - 1, j - 1]);
                }
                if (i != 0 && j != cols - 1) {
                    this.neighbors.push([i - 1, j + 1]);
                }
                if (i != rows - 1 && j != 0) {
                    this.neighbors.push([i + 1, j - 1]);
                }
                if (i != rows - 1 && j != cols - 1) {
                    this.neighbors.push([i + 1, j + 1]);
                }
            }
        }
        else if (topology == 'cylinder') {
            this.neighbors = [];
            if (i != 0) {
                this.neighbors.push([i - 1, j])
            }
            if (i == 0) {
                this.neighbors.push([rows - 1, j])
            }
            this.neighbors.push([(i + 1) % rows, j])
            if (j != 0) {
                this.neighbors.push([i, j - 1])
            }
            if (j != cols - 1) {
                this.neighbors.push([i, j + 1])
            }
            if (ln == 'Allow diagonals') {
                if (j != 0) {
                    if (i != 0) {
                        this.neighbors.push([i - 1, j - 1]);
                    }
                    else {
                        this.neighbors.push([rows - 1, j - 1]);
                    }
                    this.neighbors.push([(i + 1) % rows, j - 1]);                    
                }
                if (j != cols - 1) {
                    this.neighbors.push([(i + 1) % rows, j + 1]);   
                    if (i != 0) {
                        this.neighbors.push([i - 1, j + 1]);
                    }
                    else {
                        this.neighbors.push([rows - 1, j + 1]);
                    }                 
                }
            }
        }
        else if (topology == 'torus') {
            this.neighbors = [];
            if (i != 0) {
                this.neighbors.push([i - 1, j])
            }
            if (i == 0) {
                this.neighbors.push([rows - 1, j])
            }
            this.neighbors.push([(i + 1) % rows, j])
            if (j != 0) {
                this.neighbors.push([i, j - 1])
            }
            if (j == 0) {
                this.neighbors.push([i, cols - 1])
            }
            this.neighbors.push([i, (j + 1) % cols])
            if (ln == 'Allow diagonals') {
                if (j != 0) {
                    if (i != 0) {
                        this.neighbors.push([i - 1, j - 1]);
                    }
                    else {
                        this.neighbors.push([rows - 1, j - 1]);
                    }
                    this.neighbors.push([(i + 1) % rows, j - 1]);                    
                }
                if (j == 0) {
                    if (i != 0) {
                        this.neighbors.push([i - 1, cols - 1]);
                    }
                    else {
                        this.neighbors.push([rows - 1, cols - 1]);
                    }
                    this.neighbors.push([(i + 1) % rows, cols - 1]);                    
                }
                if (j != cols - 1) {
                    this.neighbors.push([(i + 1) % rows, j + 1]);   
                    if (i != 0) {
                        this.neighbors.push([i - 1, j + 1]);
                    }
                    else {
                        this.neighbors.push([rows - 1, j + 1]);
                    }                 
                }
                if (j == cols - 1) {
                    this.neighbors.push([(i + 1) % rows, 0]);   
                    if (i != 0) {
                        this.neighbors.push([i - 1, 0]);
                    }
                    else {
                        this.neighbors.push([rows - 1, 0]);
                    }                 
                }
            }
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
    var drawbtn = createButton('Draw/Erase walls');
    drawbtn.parent('buttonsHere')

    //defining change start/end button
    var setstartbtn = createButton('Set start/end');
    setstartbtn.parent('buttonsHere')

    //defining the start algorithm button
    var algbtn = createButton('Start/Stop');
    algbtn.parent('buttonsHere')

    

    //adding click event for draw walls button
    drawbtn.mousePressed(() => {
        drawGrid = !drawGrid;
        if (drawGrid) {
            drawbtn.elt.style.backgroundColor = 'red'
            changeStart = false;
            algorithm   = false;
            path        = [];
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
            path      = [];
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
            checking.push(start);
        } 
        else {
            algbtn.elt.style.backgroundColor = ''
        }
    })

    //creating canvas
    var canvas = createCanvas(w, h);
    canvas.parent('canvasHere')
    //initial drawing of the grid
    var rect = document.getElementById('defaultCanvas0').getBoundingClientRect();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = new gridSpot(i, j, undefined, topology, ln);
            grid[i][j].addNeighbors(topology, ln, i, j);
            grid[i][j].draw(i, j);
        }
    }

    //defining topology selector
    topSel = createSelect();
    topSel.parent('buttonsHere');
    topSel.option('plane');
    topSel.option('cylinder')
    topSel.option('torus');
    topSel.selected('plane');
    topSel.changed(changeTopology);

    //defining diagonal selector
    lnSel = createSelect();
    lnSel.parent('buttonsHere');
    lnSel.option('Allow diagonals');
    lnSel.option('No diagonals')
    lnSel.selected('No diagonals');
    lnSel.changed(changeLn);


    //padding between buttons
    drawbtn.elt.style.marginLeft     = '35px';
    setstartbtn.elt.style.marginLeft = '35px';
    algbtn.elt.style.marginLeft      = '35px';
    topSel.elt.style.marginLeft      = '35px';
    lnSel.elt.style.marginLeft       = '35px';

    //adding buttons to list of buttons
    buttons.push(drawbtn);
    buttons.push(setstartbtn);
    buttons.push(algbtn);
    buttons.push(topSel);
    buttons.push(lnSel);

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

function changeTopology() {
    topology = topSel.value();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].addNeighbors(topology, ln, i, j);
        }
    }
}

function changeLn() {
    ln = lnSel.value();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].addNeighbors(topology, ln, i, j);
        }
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
        checking = [];
        checked  = []; 
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].draw(i, j);
        }
    }
    if (algorithm) {
        path = [];
        grid[end[0]][end[1]].wall = false;
        grid[start[0]][start[1]].wall = false;
        if (checking.length > 0) {
            //still needs to check something
            var winner = 0;
            for (var i = 0; i < checking.length; i++) {
                if (grid[checking[i][0]][checking[i][1]].f <= grid[checking[winner][0]][checking[winner][1]].f) {
                    winner = i;
                }
            }
            var current = checking[winner];
            if (current[0] == end[0] && current[1] == end[1]) {
                path = [end];
                counter = current;
                let c = 0;
                while (grid[counter[0]][counter[1]].camefrom) {
                    c ++;
                    let new_i = grid[counter[0]][counter[1]].camefrom.i;
                    let new_j = grid[counter[0]][counter[1]].camefrom.j;
                    counter = [new_i, new_j]
                    path.push(counter);
                     if (new_i == start[0] && new_j == start[1]){
                         break
                     }
                }
                algorithm = !algorithm
            }

            removefromArray(checking, current);
            checked.push(current);
            let currentGridSpot = grid[current[0]][current[1]];
            let neighbors = currentGridSpot.neighbors;
            for (let i = 0; i < neighbors.length; i++) {
                var neighbor        = neighbors[i];
                var currentNeighbor = grid[neighbor[0]][neighbor[1]];
                if (currentNeighbor.wall) {
                    continue
                }
                var isChecked       = false;
                var isChecking      = false;
                for (let j = 0; j < checked.length; j++) {
                    if (neighbor[0] == checked[j][0] && neighbor[1] == checked[j][1]) {
                        isChecked = true;
                        break
                    }
                }
                for (let j = 0; j < checking.length; j++) {
                    if (neighbor[0] == checking[j][0] && neighbor[1] == checking[j][1]) {
                        isChecking = true;
                        break
                    }
                }
                if (!isChecked) {
                    var tempG = currentGridSpot.g + 1;
                    let better = false;
                    if (isChecking) {
                        if (tempG < currentNeighbor.g) { 
                            currentNeighbor.g = tempG
                            better = true;
                        }
                    }
                    else { 
                        currentNeighbor.g = tempG;
                        checking.push([currentNeighbor.i, currentNeighbor.j])
                        better = true;
                    }

                    if (better) {
                        currentNeighbor.h = metric(topology, ln, [currentNeighbor.i, currentNeighbor.j], end)
                        currentNeighbor.f = currentNeighbor.h + currentNeighbor.g;
                        currentNeighbor.camefrom = currentGridSpot;
                    }
                }

            } 

        }
        else {
            //no solution found
            console.log('whoopsie')
            algorithm = !algorithm
        }
    }
    
}