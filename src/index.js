import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const coordinateLength = {
  x: 3,
  y: 3
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  boardRow() {
    const x = coordinateLength.x, y = coordinateLength.y
    let board = []
    for (let i = 0; i < y; i++) {
      let renderSqs = []
      for (let j = 0; j < x; j++) {
        const renderSq = this.renderSquare(j + (i * x))
        renderSqs = renderSqs.concat(renderSq)
      }
      const boardRow = <div className="board-row" key={i}>{renderSqs}</div>
      board = board.concat(boardRow)
    }
    return board
  }

  axis(type) {
    const length = coordinateLength[type]
    let result = []
    for (let i = 1; i <= length; i++) {
      const axis = <div className={type} key={i}>{i}</div>
      result = result.concat(axis)
    }
    return result
  }

  render() {
    return (
      <div className="coordinate-axis">
        <div className="base-point">0</div>
        <div className="x-axis">
          {this.axis('x')}
        </div>
        <div className="y-axis">
          {this.axis('y')}
        </div>
        <div className="content-axis">
          {this.boardRow()}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      coordinate: [{
        x: 0,
        y: 0
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    const coordinate = this.state.coordinate.slice(0, this.state.stepNumber + 1)
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    const x = i % coordinateLength.x + 1
    const y = Math.floor(i / coordinateLength.x) + 1
    this.setState({
      history: history.concat([{
        squares
      }]),
      coordinate: coordinate.concat([{
        x, y
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move # ${move}` :
        `Go to game start`
      const coordinate = this.state.coordinate[move]
      return (
        <li key={move} className={move === this.state.stepNumber ? 'active' : ''}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          <span className="coordinate">coordinate: ( {coordinate.x}, {coordinate.y} )</span>
        </li>
      )
    })

    let status
    if (winner) {
      status = `Winner: ${winner}`
    } else {
      status = `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
