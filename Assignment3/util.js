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
          let green = bingoPrime(i, j, arr, 'b')

          if (green != -1) {
              return green
          }

          let blue = bingoPrime(i, j, arr, 'g')

          if (blue != -1) {
              return blue
          }
      }
  }

  return -1
}

const arr = [
  ['g', 'b', 'b', 'g', 'g', 'b'],
  ['g', 'b', 'b', 'b', 'b', 'g'],
  ['g', '-', 'b', 'b', 'g', 'b'],
  ['g', 'b', 'b', 'g', 'b', 'g'],
  ['b', '-', '-', 'b', 'b', 'b'],
  ['-', 'g', '-', '-', 'b', 'g']
]

console.log(bingo(arr))
// let x = 1
// let y = 1
// for (let i = x; i < x + 5; i++) {
//   console.log(i)
//   if (arr[i][(y + 5) - i] == "-" | arr[i][(y + 5) - i] == 'b') {
//     console.log(i)
//     bing = false
//     break
//   }
// }