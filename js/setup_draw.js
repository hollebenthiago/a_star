//SETUP FUNCTION
function setup() {

    //defining draw walls button
    var drawbtn = createButton('Draw walls');
    drawbtn.parent('buttonsHere')
    
    //defining erase walls button
    var erasebtn = createButton('Erase walls');
    erasebtn.parent('buttonsHere')

    //defining draw walls button
    var dwaterbtn = createButton('Draw water');
    dwaterbtn.parent('buttonsHere')
    
    //defining erase walls button
    var ewaterbtn = createButton('Erase water');
    ewaterbtn.parent('buttonsHere')

    //defining change start button
    var setstartbtn = createButton('Beginning');
    setstartbtn.parent('buttonsHere')

    //defining change end button
    var setendbtn = createButton('End');
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
            dwaterGrid  = false;
            ewaterGrid  = false;
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
            drawGrid    = false;
            dwaterGrid  = false;
            ewaterGrid  = false;
            changeStart = false;
            changeEnd   = false;
            algorithm   = false;
            path        = [];
        } 
        else {
            erasebtn.elt.style.border = 'solid 1px #555'
        }
    })

    //adding click event for draw water button
    dwaterbtn.mousePressed(() => {
        dwaterGrid = !dwaterGrid;
        if (dwaterGrid) {
            dwaterbtn.elt.style.border = 'solid 5px black'
            drawGrid    = false;
            eraseGrid   = false;
            ewaterGrid  = false;
            changeStart = false;
            changeEnd   = false;
            algorithm   = false;
            path        = [];
        } 
        else {
            dwaterbtn.elt.style.border = 'solid 1px #555'
        }
    })

    //adding click event for erase water button
    ewaterbtn.mousePressed(() => {
        ewaterGrid = !ewaterGrid;
        if (ewaterGrid) {
            ewaterbtn.elt.style.border = 'solid 5px black'
            drawGrid    = false;
            eraseGrid   = false;
            dwaterGrid  = false;
            changeStart = false;
            changeEnd   = false;
            algorithm   = false;
            path        = [];
        } 
        else {
            ewaterbtn.elt.style.border = 'solid 1px #555'
        }
    })

    //adding click event for change start button    
    setstartbtn.mousePressed(() => {
        changeStart = !changeStart;
        if (changeStart) {
            setstartbtn.elt.style.border = 'solid 5px black'
            drawGrid   = false;
            eraseGrid  = false;
            dwaterGrid = false;
            ewaterGrid = false;
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
            drawGrid    = false;
            eraseGrid   = false;
            dwaterGrid  = false;
            ewaterGrid  = false;
            changeStart = false;
            algorithm   = false;
            path        = [];
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
            dwaterGrid  = false;
            ewaterGrid  = false;
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

    //defining a wall randomizer
    var randbtn = createButton('Walls');
    randbtn.parent('buttonsHere')

    //adding click event for start algorithm button    
    randbtn.mousePressed(() => {
        path = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j].wall = false;
            }
        }
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (Math.random() < 0.3) {
                    grid[i][j].wall = true
                }
                grid[i][j].draw(i, j)
            }
        }
    })

    //adding buttons to list of buttons
    buttons.push(drawbtn);
    buttons.push(setstartbtn);
    buttons.push(algbtn);
    buttons.push(topSel);
    buttons.push(lnSel);
    buttons.push(erasebtn);
    buttons.push(setendbtn);
    buttons.push(dwaterbtn);
    buttons.push(ewaterbtn);
    buttons.push(randbtn);

    //adding draw/erase walls and set start/end events to canvas
    document.getElementById('defaultCanvas0').addEventListener('mousedown', checkMouseTouch)
    document.addEventListener('mouseup', checkMouseTouch)
    document.getElementById('defaultCanvas0').addEventListener('touchstart', checkMouseTouch)
    document.getElementById('defaultCanvas0').addEventListener('touchend', checkMouseTouch)
    document.getElementById('defaultCanvas0').addEventListener('mousemove', addWalls)
    document.getElementById('defaultCanvas0').addEventListener('touchmove', addWalls)
    document.getElementById('defaultCanvas0').addEventListener('click', setStartEnd)    
    document.getElementById('defaultCanvas0').addEventListener('touchstart', setStartEnd)    
}

//LOOP
function draw() {
    clear()
    if (!drawGrid) {
        buttons[0].elt.style.border = 'solid 1px #555'
    }
    if (!eraseGrid) {
        buttons[5].elt.style.border = 'solid 1px #555'
    }
    if (!dwaterGrid) {
        buttons[7].elt.style.border = 'solid 1px #555'
    }
    if (!ewaterGrid) {
        buttons[8].elt.style.border = 'solid 1px #555'
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
                while (grid[counter[0]][counter[1]].camefrom) {
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
                        var tempG = currentGridSpot.g + currentNeighbor.weight + diagWeight;
                    }
                    else {
                        var tempG = currentGridSpot.g + currentNeighbor.weight + lineWeight;
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
            console.log('no solution found')
            algorithm = !algorithm
        }
    }
}

function windowResized() {
    w = windowWidth - 50
    h = 2 * windowHeight/3
    resizeCanvas(w, h);
    let btns = document.getElementsByTagName('button')
    // for (let i = 0; i < buttons.length; i++) {
    //     btns[i].style.width = String((windowHeight - 50)/15).concat('px');
    //     btns[i].style.fontSize = String((windowHeight - 50)/90).concat('px');        
    // }
    // for (let i = 0; i < selects.length; i++) {
    //     document.getElementsByTagName('select')[i].style.width = String((windowHeight - 50)).concat('px');
    // }
}