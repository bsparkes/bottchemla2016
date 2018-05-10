// basic js functions
// need to be able to specify which side the correct response should be on.



function makecard(elementID) {

  var symlist = ["♦", "♣", "✓", "♠", "♥", "■", "★", "●", "♩", "▲"];


  var sym1 = symlist[Math.floor((Math.random() * 10))];
  var sym2 = symlist[Math.floor((Math.random() * 10))];
  while (sym1 == sym2) {
    sym2 = symlist[Math.floor((Math.random() * 10))]
  }
  /* console.log(sym1);
  console.log(sym2); */

  // trialType: 2 = strong, 1 = weak, 0 = false
  var trialType = 0

  var total = 6

  var rows = (Math.ceil(total / 3));
  var cols = (total / rows);

  /* console.log([rows, cols]) */


  var canvas = document.getElementById(elementID);
  ctx = canvas.getContext("2d");

  var W = 300,
    H = 1.2 * W;
  canvas.width = W, canvas.height = H;


  var drawlist = [];
  var strList = [];
  for (i = 1; i <= rows * (cols - 1); i++) {
    drawlist.push(sym1)
  }

  if (trialType == 2) {
    sym2 = sym1
  } else if (trialType == 1) {
    sym1 = sym2
  }

  for (j = 1; j <= rows; j++) {
    strList.push(sym2)
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