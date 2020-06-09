
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