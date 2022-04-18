const fs = require(`fs`);
const http = require(`http`);
const WebSocket = require(`ws`); // npm i ws

const board = [
  [
    "card back",
    "card rank-2 spades",
    "card rank-3 spades",
    "card rank-4 spades",
    "card rank-5 spades",
    "card rank-10 diams",
    "card rank-q diams",
    "card rank-k diams",
    "card rank-a diams",
    "card back",
  ],

  [
    "card rank-6 clubs",
    "card rank-5 clubs",
    "card rank-4 clubs",
    "card rank-3 clubs",
    "card rank-2 clubs",
    "card rank-4 spades",
    "card rank-5 spades",
    "card rank-6 spades",
    "card rank-7 spades",
    "card rank-a clubs",
  ],

  [
    "card rank-7 clubs",
    "card rank-a spades",
    "card rank-2 diams",
    "card rank-3 diams",
    "card rank-4 diams",
    "card rank-k clubs",
    "card rank-q clubs",
    "card rank-10 clubs",
    "card rank-8 spades",
    "card rank-k clubs",
  ],

  [
    "card rank-8 clubs",
    "card rank-k spades",
    "card rank-6 clubs",
    "card rank-5 clubs",
    "card rank-4 clubs",
    "card rank-9 hearts",
    "card rank-8 hearts",
    "card rank-9 clubs",
    "card rank-9 spades",
    "card rank-6 spades",
  ],

  [
    "card rank-9 clubs",
    "card rank-q spades",
    "card rank-7 clubs",
    "card rank-6 hearts",
    "card rank-5 hearts",
    "card rank-2 hearts",
    "card rank-7 hearts",
    "card rank-8 clubs",
    "card rank-10 spades",
    "card rank-10 clubs",
  ],

  [
    "card rank-a spades",
    "card rank-7 hearts",
    "card rank-9 diams",
    "card rank-a hearts",
    "card rank-4 hearts",
    "card rank-3 hearts",
    "card rank-k hearts",
    "card rank-10 diams",
    "card rank-6 hearts",
    "card rank-2 diams",
  ],

  [
    "card rank-k spades",
    "card rank-8 hearts",
    "card rank-8 diams",
    "card rank-2 clubs",
    "card rank-3 clubs",
    "card rank-10 hearts",
    "card rank-q hearts",
    "card rank-q diams",
    "card rank-5 hearts",
    "card rank-3 diams",
  ],

  [
    "card rank-q spades",
    "card rank-9 hearts",
    "card rank-7 diams",
    "card rank-6 diams",
    "card rank-5 diams",
    "card rank-a clubs",
    "card rank-a diams",
    "card rank-k diams",
    "card rank-4 hearts",
    "card rank-4 diams",
  ],

  [
    "card rank-10 spades",
    "card rank-10 hearts",
    "card rank-q hearts",
    "card rank-k hearts",
    "card rank-a hearts",
    "card rank-3 spades",
    "card rank-2 spades",
    "card rank-2 hearts",
    "card rank-3 hearts",
    "card rank-5 diams",
  ],

  [
    "card back",
    "card rank-9 spades",
    "card rank-8 spades",
    "card rank-7 spades",
    "card rank-6 spades",
    "card rank-9 diams",
    "card rank-8 diams",
    "card rank-7 diams",
    "card rank-6 diams",
    "card back",
  ],
];

const positionBoard = [
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
];


const deck = [
  "card rank-a spades",
  "card rank-2 spades",
  "card rank-3 spades",
  "card rank-4 spades",
  "card rank-5 spades",
  "card rank-6 spades",
  "card rank-7 spades",
  "card rank-8 spades",
  "card rank-9 spades",
  "card rank-10 spades",
  "card rank-j spades",
  "card rank-q spades",
  "card rank-k spades",
  "card rank-a clubs",
  "card rank-2 clubs",
  "card rank-3 clubs",
  "card rank-4 clubs",
  "card rank-5 clubs",
  "card rank-6 clubs",
  "card rank-7 clubs",
  "card rank-8 clubs",
  "card rank-9 clubs",
  "card rank-10 clubs",
  "card rank-j clubs",
  "card rank-q clubs",
  "card rank-k clubs",
  "card rank-a diams",
  "card rank-2 diams",
  "card rank-3 diams",
  "card rank-4 diams",
  "card rank-5 diams",
  "card rank-6 diams",
  "card rank-7 diams",
  "card rank-8 diams",
  "card rank-9 diams",
  "card rank-10 diams",
  "card rank-j diams",
  "card rank-q diams",
  "card rank-k diams",
  "card rank-a hearts",
  "card rank-2 hearts",
  "card rank-3 hearts",
  "card rank-4 hearts",
  "card rank-5 hearts",
  "card rank-6 hearts",
  "card rank-7 hearts",
  "card rank-8 hearts",
  "card rank-9 hearts",
  "card rank-10 hearts",
  "card rank-j hearts",
  "card rank-q hearts",
  "card rank-k hearts",
];

const divideDeckIntoPieces = (deck) => {
  let shuffled = deck
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  const result = new Array(Math.ceil(shuffled.length / 6))
    .fill()
    .map((_) => shuffled.splice(0, 6));
  return result;
};

// code to read file
const readFile = (fileName) =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, `utf-8`, (readErr, fileContents) => {
      if (readErr) {
        reject(readErr);
      } else {
        resolve(fileContents);
      }
    });
  });

// generate random integer 
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// check if someone has won
function bingoPrime(x, y, arr, color) {
  // row-wise
  let xIdx
  let yIdx

  for (let i = x; i < x + 5; i++) {
    let bing = true
    for (let j = y; j < y + 5; j++) {
      if (arr[i][j] == "-" | arr[i][j] == color) {
        bing = false
        break
      }
      xIdx = i
      yIdx = j
    }

    if (bing) {
      return arr[xIdx][yIdx]
    }
  }

  // column-wise
  for (let i = x; i < x + 5; i++) {
    let bing = true
    for (let j = y; j < y + 5; j++) {
      if (arr[j][i] == "-" | arr[j][i] == color) {
        bing = false
        break
      }
      xIdx = j
      yIdx = i
    }

    if (bing) {
      return arr[xIdx][yIdx]
    }
  }

  let bing = true
  // // diagonally l-r
  let i = x, j = y, k = 0
  while (k < 5) {
    if (arr[i][j] == "-" | arr[i][j] == color) {
      bing = false
      break
    }

    if (++k != 5) {
      i++
      j++
    }
  }

  if (bing) {
    return arr[i][j]
  }

  // // diagonally r-l
  i = x, j = y + 4, k = 0
  while (k < 5) {
    if (arr[i][j] == "-" | arr[i][j] == color) {
      return -1
    }

    if (++k != 5) {
      i++
      j--
    }
  }

  return arr[i][j]
}

const bingo = (arr) => {
  for (let i = 0; i < arr.length - 4; i++) {
    for (let j = 0; j < arr.length - 4; j++) {
      let green = bingoPrime(i, j, arr, 'blue')

      if (green != -1) {
        return green
      }

      let blue = bingoPrime(i, j, arr, 'green')

      if (blue != -1) {
        return blue
      }
    }
  }

  return -1
}

// code to create a server
const server = http.createServer(async (req, resp) => {
  console.log(`browser asked for ${req.url}`);
  if (req.url == `/mydoc`) {
    const clientHtml = await readFile(`client.html`);
    resp.end(clientHtml);
  } else if (req.url == `/myjs`) {
    const clientJs = await readFile(`client.js`);
    resp.end(clientJs);
  } else if (req.url == `/sequence.css`) {
    const sequenceCss = await readFile(`sequence.css`);
    resp.end(sequenceCss);
  } else {
    resp.end(`not found`);
  }
});

// to listen for clients
server.listen(8000);

// creating a web socket
const wss = new WebSocket.Server({ port: 8080 });

let turnCount = 0

wss.on(`connection`, (ws) => {
  const color = wss.clients.size % 2 ? 'green' : 'blue'
  const name = `${wss.clients.size}`

  const message1 = {
    type: `newboard`,
    me: name,
    color: color,
    board: board,
    positionBoard: positionBoard
  }
  ws.send(JSON.stringify(message1))

  // shuffle and divide deck
  const piece = divideDeckIntoPieces(deck)

  const message2 = {
    type: `newdeck`,
    deck: deck,
    cards: piece[wss.clients.size - 1]
  }

  ws.send(JSON.stringify(message2))

  if (wss.clients.size == 4) {
    const startGame = {
      type: `startgame`,
      firstTurn: randomInteger(1, 4)
    }

    wss.clients.forEach((client) => {
      client.send(JSON.stringify(startGame))
    })
  }

  ws.on(`message`, (m) => {
    const msg = JSON.parse(m)
    positionBoard[msg.position[0]][msg.position[1]] = color
    let check = bingo(positionBoard)
    turnCount++

    if (turnCount == 72) {
      check = "draw"
    }

    const message3 = {
      type: `updatepb`,
      positionBoard: positionBoard,
      turn: msg.turn,
      status: check
    }
    
    const message7 = {
      type: `newdeck`,
      deck: deck,
      cards: piece[parseInt(name) + 3]
    }

    if (turnCount == 36) {
      wss.clients.forEach((client) => {
        client.send(JSON.stringify(message7))
        client.send(JSON.stringify(message3))
      })
    }

    wss.clients.forEach((client) => {
      client.send(JSON.stringify(message3))
    })
  })
})