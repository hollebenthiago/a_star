
// GLOBAL VARIABLES
const rows      = 70;
const cols      = 30;
const w         = window.innerWidth - 50;
const h         = 2*window.innerHeight/3;
let start       = [0, 0];
let end         = [rows-1, cols-1];
let diagWeight  = 1;
let lineWeight  = 1;
let drawGrid    = false;
let eraseGrid   = false;
let changeStart = false;
let changeEnd   = false;
let mouseDown   = false;
let touching    = false;
let buttons     = [];
let checking    = [];
let checked     = [];
let path        = [];
let topology    = 'plane';
let ln          = 'No diagonals';
let mousepos;
let clickpos;
let algorithm;