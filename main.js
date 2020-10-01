function validate(cell) {
  if (isNaN(cell.value) || cell.value > 9 || cell.value < 1) {
    if (cell.value.length > 1)
      cell.value = cell.value.substring(0, 1);
    else cell.value = "";
  }
}

let sudoku_board = new Array(81);
let possible = new Array(81);

function is_valid(index, value) {
  const col = index % 9;
  const row = Math.floor(index / 9);
  const square_begin = (row - (row % 3)) * 9 + (col - (col % 3));

  for (let i = 0; i < 9; ++i) {
    const col_check = i + (row * 9);
    const row_check = (i * 9) + col;
    const sqr_check = square_begin + (i % 3) + (Math.floor(i / 3) * 9);
    if (sudoku_board[col_check] == value
      || sudoku_board[row_check] == value
      || sudoku_board[sqr_check] == value)
      return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".cell").forEach((el, i) => {
    const col = i % 9;
    const row = Math.floor(i / 9);
    if (row == 0) {
      el.classList.add("border-top");
    }
    if (col == 0) {
      el.classList.add("border-left");
    }
    if (row == 8 || row == 5 || row == 2) {
      el.classList.add("border-bottom");
    }
    if (col == 8 || col == 2 || col == 5) {
      el.classList.add("border-right");
    }
  })

  document.querySelector("#solve_button").addEventListener("click", () => {
    sudoku_board.fill(0);
    let is_legal = true;
    document.querySelectorAll(".cell").forEach((el, index) => {
      if (el.value.length > 0) {
        if(!is_valid(index, parseInt(el.value))) {
          el.style['background-color'] = "red";
          is_legal = false;
        }
        sudoku_board[index] = parseInt(el.value);
      }
      else 
        possible[index] = [1, 2, 3, 4, 5, 6, 7, 8, 9];        
    });
    if(!is_legal)
      return;
    console.time("Solve");
    solve();
    console.timeEnd("Solve");
    if (sudoku_board.some(c => c == 0)) {
      console.time("Guess");
      solve_by_guess(0);
      console.timeEnd("Guess");
    }
    document.querySelectorAll(".cell").forEach((el, index) => {
      if(sudoku_board[index] != 0)
        el.value = sudoku_board[index];
    });
  });
});

function solve() {
  let is_changed;
  do {
    is_changed = false; 
    for (let i = 0; i < sudoku_board.length; ++i) {
      if (sudoku_board[i] == 0) {
        for (let val_index = possible[i].length - 1; val_index >= 0; --val_index) {
          if (!is_valid(i, possible[i][val_index])) {
            possible[i].splice(val_index, 1);
            is_changed = true;
            if (possible[i].length == 1) {
              sudoku_board[i] = possible[i][0];
              break;
            }
          }

        }
      }
    }
  } while (is_changed);
}

function solve_by_guess(index) {
  for (let i = index; i < 81; ++i) {
    if (sudoku_board[i] == 0) {
      for (let val = 1; val <= 9; ++val) {
        if (is_valid(i, val)) {
          sudoku_board[i] = val;
          if (solve_by_guess(i + 1))
            return true;
        }
      }
    sudoku_board[i] = 0;
    return false;
    }
  }
  return true;
}