
// GLOBAL VARIABLES
const rows      = 70;
const cols      = 30;
const w         = window.innerWidth - 50;
const h         = 460;
var start       = [0, 0];
var end         = [rows-1, cols-1];
var diagWeight  = Math.sqrt(2);
var lineWeight  = 1;
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