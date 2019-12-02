import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

// 棋盘格子大小 x,y
const coordinateLength = {
  x: 3,
  y: 3
}

let victorys = []

/**
 *  3*3 棋盘格子 胜利条件
 *  待优化 ---- 
 */
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      victorys = victorys.concat(lines[i])
      return squares[a]
    } else {
      victorys = []
    }
  }
  return null
}

// 每个单独的棋盘格子
function Square(props) {
  return (
    <button className={'square ' + (props.isWin ? 'winner' : '')} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

// 棋盘区域  包括坐标轴 格子
class Board extends React.Component {
  renderSquare(i) { 
    let isWin = false
    victorys.map(val => {
      if (val === i) {
        isWin = true
      }
      return false
    })
    return (
      <Square
        key={i}
        isWin={isWin}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  // 循环渲染格子区域
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

  // 循环渲染坐标轴
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

// 游戏区域
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
      xIsNext: true,
      isToLater: true
    }
  }

  // 点击格子触发函数
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const squares = history[history.length - 1].squares.slice()
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

  // 跳转到历史记录
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  // 升序、降序 切换
  changeOrder() {
    this.setState({
      isToLater: !this.state.isToLater
    }, () => console.log(this.state.isToLater))
  }

  // 历史记录列表
  moves(history) {
    let moves = history.map((step, move) => {
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
    moves = this.state.isToLater ? moves : moves.reverse()
    return moves
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    let status
    if (winner) {
      status = `Winner: ${winner}`
    } else {
      status = `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`
    }

    let order = <button onClick={() => this.changeOrder()}>升序 / 降序</button>

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status} {order}</div>
          <ol>{this.moves(history)}</ol>
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
