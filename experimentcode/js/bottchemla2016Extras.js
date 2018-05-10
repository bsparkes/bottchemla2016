var symlist = ["♦", "♣", "✓", "♠", "♥", "■", "★", "●", "♩", "▲"];
var symText = ["diamond", "club", "tick", "spade", "heart", "square", "star", "circle", "note", "triangle"];

let trials = [
  // {symbols: [] prime1: [], prime2: [], target: []},
]

/* build trials */

for (t = 0; t < 3; t++) { // target
  for (s = 0; s < 2; s++) { // strength
    for (p = 0; p < 3; p++) { // prime
      let dict = {}
      dict["symbols"] = symbolPair()
      dict["target"] = t
      dict["strength"] = s
      dict["prime"] = p
      trials.push(dict)
    }
  }
}

/* We've now got an array of trial dictionaries.
   The next thing to do is shuffle these. This is primarily so that
   there is something that the html can access when creating cards.
*/

var trialOrder = [],
  b = trials.length;
while (b--) {
  trialOrder[b] = b
}

trialOrder = _.shuffle(trialOrder)

/*
  So, we can now go through trialOrder in normal fashion to get something randomised.
  This is all rather ugly, but it's the web…
 */

var currentTrial = 0


console.log(trialOrder)

console.log('test')
console.log(trials)
console.log(trials[9])


function makecard(canvasid = 'canvas',
  trialType = 0, //2 = strong, 1 = weak, 0 = false
  total = 6,
) {

  var rows = (Math.ceil(total / 3));
  var cols = (total / rows);

  /* console.log([rows, cols]) */

  var canvas = document.getElementById(canvasid);
  ctx = canvas.getContext("2d");
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  var W = 300,
    H = 1.2 * W;
  canvas.width = W, canvas.height = H;


  var drawlist = [];
  var strList = [];
  for (i = 1; i <= rows * (cols - 1); i++) {
    drawlist.push(exp.sym1)
  }

  if (trialType == 2) {
    exp.sym2 = exp.sym1
  } else if (trialType == 1) {
    exp.sym1 = exp.sym2
  }

  for (j = 1; j <= rows; j++) {
    strList.push(exp.sym2)
  }

  if (Math.random() >= 0.5) {
    drawlist = drawlist.concat(strList)
  } else {
    drawlist = strList.concat(drawlist)
  }

  /* console.log(drawlist) */

  var symbol = [];

  var symCount = 0;

  if (rows > 1) {
    [rows, cols] = [cols, rows]
  }
  var Wc = W / cols,
    Hr = H / rows


  for (i = 1; i <= rows; i++) {
    for (j = 1; j <= cols; j++) {
      symbol[i] = {
        y: (Math.floor((i * Hr) - Hr / 2)),
        x: (Math.floor((j * Wc) - Wc / 2)),

        color: "black",
        unisym: drawlist[symCount],

        draw: symbols
      };
      symCount++;
      var s = symbol[i];
      s.draw(s.x, s.y, s.color, s.unisym);
    }
  }

  function symbols(x, y, color, unisym) {
    ctx.font = "36px sans-serif";
    ctx.fillStyle = color;
    textDimensions = ctx.measureText(unisym);
    x = (x - (textDimensions.width / 2))
    ctx.fillText(unisym, x, y);
  }
}


function getSymbols(s) {

  var sym0 = s[0]
  var sym1 = s[1]

  exp.sym1 = symlist[sym0];
  exp.sym2 = symlist[sym1];
  exp.sym1t = symText[sym0];
  exp.sym2t = symText[sym1];
}



function symbolPair() {

  let sym1i = Math.floor((Math.random() * 10))
  let sym2i = Math.floor((Math.random() * 10))
  let sym3i = Math.floor((Math.random() * 10))

  while (sym1i == sym2i) {
    sym2i = Math.floor((Math.random() * 10))
  }
  while (sym1i == sym3i | sym2i == sym3i) {
    sym3i = Math.floor((Math.random() * 10))
  }
  return [sym1i, sym2i, sym3i]
}

/*
  Each trial is represented as a
*/

console.log('current trail')
console.log(trials[currentTrial])
console.log(trials[currentTrial]["symbols"])
console.log('done')