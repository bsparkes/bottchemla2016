var symlist = ["♦", "♣", "✓", "♠", "♥", "■", "★", "●", "♩", "▲"];
var symText = ["diamond", "club", "tick", "spade", "heart", "square", "star", "circle", "note", "triangle"];
var symPre = ["Some of the symbols are", "There are four", "There is a"]

var trialCards = {
  someStrong: [6, 3, 0, 9],
  someWeak: [9, 0, 0, 9],
  someFalse: [0, 9, 0, 9],
  fourStrong: [4, 0, 0, 4],
  fourWeak: [6, 0, 0, 6],
  fourFalse: [2, 0, 0, 2],
  adhocStrong: [1, 0, 0, 1],
  adhocWeak: [1, 1, 0, 2],
  adhocFalse: [0, 1, 1, 2],
  target: [0, 0, 0, 0],
}

let trials = [
  // {symbols: [] prime: [], target: [], strength : []}
]

/* build trials */

for (t = 0; t < 3; t++) { // target
  for (s = 0; s < 2; s++) { // strength
    for (p = 0; p < 3; p++) { // prime
      let dict = {}
      dict["symbols"] = symbolTriple()
      dict["target"] = t
      dict["strength"] = s
      dict["prime"] = p
      trials.push(dict)
    }
  }
}

console.log('trial length')
console.log(trials.length)

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

// console.log(trialOrder)
// console.log('test')
// console.log(trials)
// console.log(trials[9])



// function someCard(canvasid, strength) {
//   if (strength == 2) {

//   } else if (strength == 1) {

//   } else {

//   }
// }



function makeCard(canvasid = 'canvas', cardspec) {

  total = cardspec[3]
  sym1 = exp.sym1
  sym2 = exp.sym2
  if (cardspec[0] == 0) {
    sym1 = exp.sym3
  }

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
    drawlist.push(sym1)
  }

  for (j = 1; j <= rows; j++) {
    strList.push(sym2)
  }

  // randomise false placement
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


function getSymbols(symTrip) {

  let sym0 = symTrip[0]
  let sym1 = symTrip[1]
  let sym2 = symTrip[2]

  exp.sym1 = symlist[sym0];
  exp.sym2 = symlist[sym1];
  exp.sym3 = symlist[sym2];
  exp.sym1t = symText[sym0];
  exp.sym2t = symText[sym1];
  exp.sym3t = symText[sym2];
}



function symbolTriple() {

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

function specifyCards(trialDict) {

  primeCat = trialDict["prime"]
  targetCat = trialDict["target"]
  strength = trialDict["strength"]

  someStrong = trialCards["someStrong"];
  someWeak = trialCards["someWeak"];
  someFalse = trialCards["someFalse"];
  fourStrong = trialCards["fourStrong"];
  fourWeak = trialCards["fourWeak"];
  fourFalse = trialCards["fourFalse"];
  adhocStrong = trialCards["adhocStrong"];
  adhocWeak = trialCards["adhocWeak"];
  adhocFalse = trialCards["adhocFalse"];

  if (strength == 0) { // if weak
    if (primeCat == 0) {
      primeOne = _.shuffle([someWeak, someFalse]);
      primeTwo = _.shuffle([someWeak, someFalse]);
    } else if (primeCat == 1) {
      primeOne = _.shuffle([fourWeak, fourFalse]);
      primeTwo = _.shuffle([fourWeak, fourFalse]);
    } else {
      primeOne = _.shuffle([adhocWeak, adhocFalse]);
      primeTwo = _.shuffle([adhocWeak, adhocFalse]);
    }
  } else { // if strong
    if (primeCat == 0) {
      primeOne = _.shuffle([someStrong, someWeak]);
      primeTwo = _.shuffle([someStrong, someWeak]);
    } else if (primeCat == 1) {
      primeOne = _.shuffle([fourStrong, fourWeak]);
      primeTwo = _.shuffle([fourStrong, fourWeak]);
    } else {
      primeOne = _.shuffle([adhocStrong, adhocWeak]);
      primeTwo = _.shuffle([adhocStrong, adhocWeak]);
    }
  }

  if (targetCat == 0) {
    targetL = someStrong;
  } else if (targetCat == 1) {
    targetL = fourStrong;
  } else {
    targetL = adhocStrong;
  }

  makeCard(canvasid = 'primeOneL', primeOne[0])
  makeCard(canvasid = 'primeOneR', primeOne[1])
  makeCard(canvasid = 'primeTwoL', primeTwo[0])
  makeCard(canvasid = 'primeTwoR', primeTwo[1])
  makeCard(canvasid = 'targetL', targetL)
  makeCard(canvasid = 'targetR', trialCards["target"])
}


console.log('current trail')
console.log(trials[currentTrial])
console.log(trials[currentTrial]["symbols"])
console.log('done')