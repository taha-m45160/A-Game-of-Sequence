function bingoPrime(x, y, arr, color) {
  // row-wise
  for (let i = x; i < x + 5; i++) {
    let bing = true
    let xy = -1

    for (let j = y; j < y + 5; j++) {
      if (arr[i][j] == "-" | arr[i][j] == color) {
        bing = false
        break
      }

      if (j + 1 < y + 5) {
        xy = j
      }
    }

    if (bing) {
      return arr[i][xy]
    }
  }

  // column-wise
  for (let i = x; i < x + 5; i++) {
    let bing = true
    let xy = -1

    for (let j = y; j < y + 5; j++) {
      if (arr[j][i] == "-" | arr[j][i] == color) {
        bing = false
        break
      }

      if (j + 1 < y + 5) {
        xy = j
      }
    }

    if (bing) {
      return arr[i][xy]
    }
  }

  let bing = true
  let xy = -1
  // diagonally l-r
  for (let i = x; i < x + 5; i++) {
    if (arr[i][i] == "-" | arr[i][i] == color) {
      bing = false
      break
    }

    if (i == x + 4) {
      xy = i
    }
  }

  if (bing) {
    return arr[xy][xy]
  }

  bing = true
  xy = -1
  // diagonally r-l
  for (let i = x, j = y; i < x + 5 & j < y + 5; i++) {
    console.log(i, (y + 5) - i)
    console.log(arr[i][(y + 5) - i])
    if (arr[i][(y + 5) - i] == "-" | arr[i][(y + 5) - i] == color) {
      console.log('f', i)
      bing = false
      break
    }

    if (i == x + 4) {
      xy = i
    }
  }

  if (bing) {
    return arr[xy][y + 5 - xy]
  }

  return -1
}

const bingo = (arr) => {
  for (let i = 0; i < arr.length - 4; i++) {
    for (let j = 0; j < arr.length - 4; j++) {
      console.log("in", i, j)
      let g = bingoPrime(i, j, arr, 'b')
      console.log("out", i, j)

      if (g != -1) {
        return g
      }

      // const b = bingoPrime(i, j, arr, 'g')

      // if (b != -1) {
      //   return b
      // }
    }
  }

  return -1
}

const arr = [
  ['b', '-', 'g', 'g', 'g', 'g'],
  ['g', 'b', 'b', 'b', 'b', 'g'],
  ['g', '-', 'b', 'b', 'g', 'b'],
  ['g', 'b', 'g', 'g', '-', 'g'],
  ['g', 'b', 'g', 'b', 'b', 'b'],
  ['-', 'b', '-', '-', 'b', 'g']
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