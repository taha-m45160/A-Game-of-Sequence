const ws = new WebSocket(`ws://localhost:8080`);

const Sequence = () => {
  const [board, setBoard] = React.useState([[]]);
  const [positionBoard, setPositionBoard] = React.useState([[]]);
  const [cards, setCards] = React.useState([]);
  const [deck,setDeck] = React.useState([]);
  const [text, setText] = React.useState(`Waiting for players.`)
  const [color, setColor] = React.useState('')
  const [me, setMe] = React.useState('')
  const [startGame, setStartGame] = React.useState(false)
  const [endGame, setEndGame] = React.useState(false)
  const [turn, setTurn] = React.useState(false)

  let diamondSign = "♦";
  let heartSign = "♥";
  let spadesSign = "♠";
  let clubsSign = "♣";

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    if (msg.type === `newboard`) {
      setBoard(msg.board);
      setPositionBoard(msg.positionBoard)
      setColor(msg.color)
      setMe(msg.me)
    
    } else if (msg.type === `newdeck`) {
      setDeck(msg.deck)
      setCards(msg.cards)
    
    } else if (msg.type === `updatepb`) {
      setPositionBoard(msg.positionBoard)

      if (msg.status !== -1) {
        setEndGame(true)
        setText(`Game Ended. ${msg.status} won.`)
      
      } else {
        setTurn(msg.turn)
        setText(`Player ${msg.turn} to move.`)
      }
    
    } else if (msg.type === `startgame`) {
      setStartGame(true)
      setTurn(msg.firstTurn)
      setText(`Game started. ${msg.firstTurn} to move.`)
    
    } else if (msg.type === `gameend`) {

    }
  };

  const renderListItem = (str, flag, idx1, idx2) => {
    if (!flag) {
      let card = '#'

      if (positionBoard != 0) {card = positionBoard[idx2][idx1]}

      if (card == '-' | card == '#') {
        if (str.includes("back")) {
          return (
            <div class="card back"><span class="rank"></span></div>
          );
        } else {
          return (
            <div class={str}><span class="rank">{getRank(str)}</span><span class="suit">{getSuit(str)}</span></div>
          );
        }
      
      } else {
        return (
          <div className="card"><div className={card}></div></div>
        );
      }
    
    } else {
      return (
        <a class={str}><span class="rank">{getRank(str)}</span><span class="suit">{getSuit(str)}</span></a>
      );
    } 
  }

  const getRank = (str) => {
    let temp = str.split(" ")
    temp = temp[1].split("-")

    return temp[1]
  }

  const getSuit = (str) => {
    let temp = str.split(" ")
    temp = temp[2]

    if (temp == "spades") {
      return spadesSign
    } else if (temp == "hearts") {
      return heartSign
    } else if (temp == "diams") {
      return diamondSign
    } else {
      return clubsSign
    }
  }

  const isThereAJoker = () => {
    let joker = cards.filter((card) => getRank(card) == "j")

    return joker.length > 0
  }

  const indexOfJoker = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (getRank(arr[i]) == "j") {
        return i
      }
    }
  }

  const valMove = (card, idx1, idx2) => {
    // check if card is in deck
    const present = cards.includes(card)

    if (startGame & turn == me & !endGame) {
      if (present | (isThereAJoker() & positionBoard[idx2][idx1] == "-")) {
        // update cards
        if (!present) {
          let temp = [...cards]
          temp.splice(indexOfJoker(temp), 1)
          setCards(temp)
        } else {
          setCards(cards.filter((e) => e !== card))
        }
  
        // send card position and turn
        const pos = [idx2, idx1]
        const t = (turn + 1) % 4 ? (turn + 1) % 4 : 4

        const message4 = {
          position : pos,
          turn: t
        }
        ws.send(JSON.stringify(message4))

      } else {
        setText('Illegal. Move Again.')
      }
    } else if (startGame & turn != me) {
      setText(`Please wait for your turn. Player ${turn} to move.`)
    
    } else if (endGame) {
      setText(`Game ended.`)
    }
  }

  return (
    <div>
      <div>
        <div class="container">
          {
            board.map((d, idx1) => (
              <div>
                <div class="playingCards fourColours rotateHand">
                  <ul class="table">
                    {
                      d.map((item, idx2) => (
                        <div><li onClick={(ev) => valMove(item, idx1, idx2)}>{renderListItem(item, false, idx1, idx2)}</li></div>
                      ))
                    }
                  </ul>
                </div>
              </div>
            ))
          }
        </div>

        <div class="container">
        <div>
          <h1>Your Cards:</h1>
        </div>
        <div class="playingCards fourColours rotateHand">
          <ul class="table">
            {
              cards.map((item) => (
                <li>{renderListItem(item, true, 0, 0)}</li>
              ))
            }
          </ul>
        </div>

        <div class="text_box">{text}</div>
        <div class={"color " + color}></div>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<Sequence />, document.querySelector(`#root`));
