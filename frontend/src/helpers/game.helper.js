export function isEmpty(i, j, board) {
    return board[i][j] === " "
}

export function isEnemyOrEmpty(i, j, board, side) {
    return board[i][j][1] !== side
}

export function isAlly(i, j, board, side) {
    return board[i][j][1] === side
}

export function isEnemy(i, j, board, side) {
    let enemy = side === 'w' ? 'b' : 'w'
    return board[i][j][1] === enemy
}

function pawnMoveCheck(i, j, board, type, basic) {
    if (type[1] === "w") {
        // если перед ней никого нет, ходит на одну клетку
        if (i > 0 && isEmpty(i - 1, j, board)) {
            basic[i - 1][j] = 1
            // с начальной позиции пешка может ходить на 2 клетки, если там никого нет
            if (i === 6 && isEmpty(i - 2, j, board)) {
                basic[i - 2][j] = 1
            }
        }
        // если впереди по диагонали враг - можно ходить на него
        if (j < 7 && i > 0 && isEnemy(i - 1, j + 1, board, type[1])) {
            basic[i - 1][j + 1] = 1
        }
        if (j > 0 && i > 0 && isEnemy(i - 1, j - 1, board, type[1])) {
            basic[i - 1][j - 1] = 1
        }
    } else {
        // если перед ней никого нет, ходит на одну клетку
        if (i < 7 && isEmpty(i + 1, j, board)) {
            basic[i + 1][j] = 1
            // с начальной позиции пешка может ходить на 2 клетки, если там никого нет
            if (i === 1 && isEmpty(i + 2, j, board)) {
                basic[i + 2][j] = 1
            }
        }
        // если впереди по диагонали враг - можно ходить на него
        if (j < 7 && i < 7 && isEnemy(i + 1, j + 1, board, type[1])) {
            basic[i + 1][j + 1] = 1
        }
        if (j > 0 && i < 7 && isEnemy(i + 1, j - 1, board, type[1])) {
            basic[i + 1][j - 1] = 1
        }
    }
}

function kingMoveCheck(i, j, board, type, basic) {
    // король ходит на любую соседнюю клетку
    if (i > 0 && j > 0) {
        if (isEnemyOrEmpty(i - 1, j - 1, board, type[1])) {
            basic[i - 1][j - 1] = 1
        }
        if (isEnemyOrEmpty(i, j - 1, board, type[1])) {
            basic[i][j - 1] = 1
        }
        if (isEnemyOrEmpty(i - 1, j, board, type[1])) {
            basic[i - 1][j] = 1
        }
    }
    if (i < 7 && j > 0) {
        if (isEnemyOrEmpty(i + 1, j, board, type[1])) {
            basic[i + 1][j] = 1
        }
        if (isEnemyOrEmpty(i + 1, j - 1, board, type[1])) {
            basic[i + 1][j - 1] = 1
        }
        if (isEnemyOrEmpty(i, j - 1, board, type[1])) {
            basic[i][j - 1] = 1
        }
    }
    if (i < 7 && j < 7) {
        if (isEnemyOrEmpty(i + 1, j, board, type[1])) {
            basic[i + 1][j] = 1
        }
        if (isEnemyOrEmpty(i, j + 1, board, type[1])) {
            basic[i][j + 1] = 1
        }
        if (isEnemyOrEmpty(i + 1, j + 1, board, type[1])) {
            basic[i + 1][j + 1] = 1
        }
    }
    if (i > 0 && j < 7) {
        if (isEnemyOrEmpty(i, j + 1, board, type[1])) {
            basic[i][j + 1] = 1
        }
        if (isEnemyOrEmpty(i - 1, j, board, type[1])) {
            basic[i - 1][j] = 1
        }
        if (isEnemyOrEmpty(i - 1, j + 1, board, type[1])) {
            basic[i - 1][j + 1] = 1
        }
    }
}

function rookMoveCheck(i, j, board, type, basic) {
// ладья ходит по вертикали и горизонтали до конца доски или первой занятой клетки
    for (let y = i + 1; y < 8; y++) {
        if (isEnemyOrEmpty(y, j, board, type[1])) {
            basic[y][j] = 1
        }
        if (!isEmpty(y, j, board)) {
            break
        }
    }
    for (let y = i - 1; y >= 0; y--) {
        if (isEnemyOrEmpty(y, j, board, type[1])) {
            basic[y][j] = 1
        }
        if (!isEmpty(y, j, board)) {
            break
        }
    }
    for (let x = j + 1; x < 8; x++) {
        if (isEnemyOrEmpty(i, x, board, type[1])) {
            basic[i][x] = 1
        }
        if (!isEmpty(i, x, board)) {
            break
        }
    }
    for (let x = j - 1; x >= 0; x--) {
        if (isEnemyOrEmpty(i, x, board, type[1])) {
            basic[i][x] = 1
        }
        if (!isEmpty(i, x, board)) {
            break
        }
    }
}

function knightMoveCheck(i, j, board, type, basic) {
    if (i < 6 && j < 7 && isEnemyOrEmpty(i + 2, j + 1, board, type[1])) {
        basic[i + 2][j + 1] = 1
    }
    if (i < 6 && j > 0 && isEnemyOrEmpty(i + 2, j - 1, board, type[1])) {
        basic[i + 2][j - 1] = 1
    }
    if (i > 1 && j < 7 && isEnemyOrEmpty(i - 2, j + 1, board, type[1])) {
        basic[i - 2][j + 1] = 1
    }
    if (i > 1 && j > 0 && isEnemyOrEmpty(i - 2, j - 1, board, type[1])) {
        basic[i - 2][j - 1] = 1
    }
    if (j < 6 && i < 7 && isEnemyOrEmpty(i + 1, j + 2, board, type[1])) {
        basic[i + 1][j + 2] = 1
    }
    if (j < 6 && i > 0 && isEnemyOrEmpty(i - 1, j + 2, board, type[1])) {
        basic[i - 1][j + 2] = 1
    }
    if (j > 1 && i < 7 && isEnemyOrEmpty(i + 1, j - 2, board, type[1])) {
        basic[i + 1][j - 2] = 1
    }
    if (j > 1 && i > 0 && isEnemyOrEmpty(i - 1, j - 2, board, type[1])) {
        basic[i - 1][j - 2] = 1
    }
}

function bishopMoveCheck(i, j, board, type, basic) {
    // слон ходит по диагонали до первой преграды или конца доски
    for (let delta = 1; delta <= Math.min(i, j); delta++) {
        if (isEnemyOrEmpty(i - delta, j - delta, board, type[1])) {
            basic[i - delta][j - delta] = 1
        }
        if (!isEmpty(i - delta, j - delta, board)) {
            break
        }
    }
    for (let delta = 1; delta <= Math.min(i, 7 - j); delta++) {
        if (isEnemyOrEmpty(i - delta, j + delta, board, type[1])) {
            basic[i - delta][j + delta] = 1
        }
        if (!isEmpty(i - delta, j + delta, board)) {
            break
        }
    }
    for (let delta = 1; delta <= Math.min(7 - i, j); delta++) {
        if (isEnemyOrEmpty(i + delta, j - delta, board, type[1])) {
            basic[i + delta][j - delta] = 1
        }
        if (!isEmpty(i + delta, j - delta, board)) {
            break
        }
    }
    for (let delta = 1; delta <= Math.min(7 - i, 7 - j); delta++) {
        if (isEnemyOrEmpty(i + delta, j + delta, board, type[1])) {
            basic[i + delta][j + delta] = 1
        }
        if (!isEmpty(i + delta, j + delta, board)) {
            break
        }
    }
}

export function getHighlight(i, j, board) {
    let basic = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]]
    if (board === null) return basic
    let type = board[i][j]
    switch (type[0]) {
        case "p":
            basic[i][j] = 1
            pawnMoveCheck(i, j, board, type, basic)
            break
        case "k":
            basic[i][j] = 1
            kingMoveCheck(i, j, board, type, basic)
            break
        case 'r':
            basic[i][j] = 1
            rookMoveCheck(i, j, board, type, basic)
            break
        case 'n':
            basic[i][j] = 1
            knightMoveCheck(i, j, board, type, basic)
            break
        case 'b':
            basic[i][j] = 1
            bishopMoveCheck(i, j, board, type, basic)
            break
        case 'q':
            basic[i][j] = 1
            rookMoveCheck(i, j, board, type, basic)
            bishopMoveCheck(i, j, board, type, basic)
            break
        default:
            break
    }
    return basic
}