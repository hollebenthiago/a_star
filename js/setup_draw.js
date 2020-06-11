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
    
    //defining erase walls button
    var erasebtn = createButton('Erase walls');
    erasebtn.parent('buttonsHere')

    //defining change start button
    var setstartbtn = createButton('Change beginning');
    setstartbtn.parent('buttonsHere')

    //defining change end button
    var setendbtn = createButton('Change end');
    setendbtn.parent('buttonsHere')

    //defining the start algorithm button
    var algbtn = createButton('Start');
    algbtn.parent('buttonsHere')

    

    //adding click event for draw walls button
    drawbtn.mousePressed(() => {
        drawGrid = !drawGrid;
        if (drawGrid) {
            drawbtn.elt.style.border = 'solid 5px black'
            eraseGrid   = false;
            changeStart = false;
            changeEnd   = false;
            algorithm   = false;
            path        = [];
        } 
        else {
            drawbtn.elt.style.border = 'solid 1px #555'
        }
    })

    //adding click event for erase walls button
    erasebtn.mousePressed(() => {
        eraseGrid = !eraseGrid;
        if (eraseGrid) {
            erasebtn.elt.style.border = 'solid 5px black'
            drawGrid   = false;
            changeStart = false;
            changeEnd   = false;
            algorithm   = false;
            path        = [];
        } 
        else {
            erasebtn.elt.style.border = 'solid 1px #555'
        }
    })

    //adding click event for change start button    
    setstartbtn.mousePressed(() => {
        changeStart = !changeStart;
        if (changeStart) {
            setstartbtn.elt.style.border = 'solid 5px black'
            drawGrid   = false;
            eraseGrid  = false;
            changeEnd  = false;
            algorithm  = false;
            path       = [];
        } 
        else {
            setstartbtn.elt.style.border = 'solid 1px #555'
        }
    })
    
    //adding click event for change end button    
    setendbtn.mousePressed(() => {
        changeEnd = !changeEnd;
        if (changeEnd) {
            setendbtn.elt.style.border = 'solid 5px black'
            drawGrid   = false;
            eraseGrid  = false;
            changeStart  = false;
            algorithm  = false;
            path       = [];
        } 
        else {
            setendbtn.elt.style.border = 'solid 1px #555'
        }
    })

    //adding click event for start algorithm button    
    algbtn.mousePressed(() => {
        algorithm = !algorithm;
        if (algorithm) {
            algbtn.elt.style.border = 'solid 5px black'
            drawGrid    = false;
            eraseGrid   = false;
            changeEnd   = false;
            changeStart = false;
            checking.push(start);
        } 
        else {
            algbtn.elt.style.border = 'solid 1px #555'
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

    //adding buttons to list of buttons
    buttons.push(drawbtn);
    buttons.push(setstartbtn);
    buttons.push(algbtn);
    buttons.push(topSel);
    buttons.push(lnSel);
    buttons.push(erasebtn);
    buttons.push(setendbtn);

    //adding draw/erase walls and set start/end events to canvas
    document.getElementById('defaultCanvas0').addEventListener('mousemove', addWalls)
    document.getElementById('defaultCanvas0').addEventListener('touchmove', addWalls)
    document.getElementById('defaultCanvas0').addEventListener('click', setStartEnd)    
    document.getElementById('defaultCanvas0').addEventListener('touchstart', setStartEnd)    
}

//ADD WALLS EVENT/FUNCTION
function addWalls(event) {
    var rect = document.getElementById('defaultCanvas0').getBoundingClientRect();
    mousepos = {x: (event.clientX - rect.left) / (rect.right - rect.left) * w,
                y: (event.clientY - rect.top) / (rect.bottom - rect.top) * h
            };
    let toWall = getSpot(mousepos)
    if (drawGrid) {
        grid[toWall.i][toWall.j].wall = true;
    }
    else if (eraseGrid) {
        grid[toWall.i][toWall.j].wall = false;
    }
}

function setStartEnd(event) {
    var rect = document.getElementById('defaultCanvas0').getBoundingClientRect();
    clickpos = {x: (event.clientX - rect.left) / (rect.right - rect.left) * w,
                y: (event.clientY - rect.top) / (rect.bottom - rect.top) * h
            };
    let oneEnd = getSpot(clickpos)
    if (changeStart) {
        start = [oneEnd.i, oneEnd.j]
    }
    else if (changeEnd) {
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
    clear()
    if (!drawGrid) {
        buttons[0].elt.style.border = 'solid 1px #555'
    }
    if (!eraseGrid) {
        buttons[5].elt.style.border = 'solid 1px #555'
    }
    if (!changeStart) {
        buttons[1].elt.style.border = 'solid 1px #555'
    }
    if (!changeEnd) {
        buttons[6].elt.style.border = 'solid 1px #555'
    }
    if (!algorithm) {
        buttons[2].elt.style.border = 'solid 1px #555'
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
                    if (currentGridSpot.i != currentNeighbor.i && currentGridSpot.j != currentNeighbor.j) {
                        var tempG = currentGridSpot.g + diagWeight;
                    }
                    else {
                        var tempG = currentGridSpot.g + lineWeight;
                    }
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