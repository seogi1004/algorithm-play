const assert = require('assert');

function solution(m, n, board) {
    let newBoard = [];

    for(let i = 0; i < board.length; i++) {
        newBoard[i] = board[i].split("");
    }

    clearBlocks(m, n, newBoard);
    pullDown(m, n, newBoard);
    clearBlocks(m, n, newBoard);
    pullDown(m, n, newBoard);
    clearBlocks(m, n, newBoard);
    pullDown(m, n, newBoard);
    clearBlocks(m, n, newBoard);
    pullDown(m, n, newBoard);
    clearBlocks(m, n, newBoard);
    pullDown(m, n, newBoard);
    
    return getEmptyCount(newBoard);
}

function clearBlocks(m, n, board) {
    for(let i = 0; i < m - 1; i++) {
        for(let j = 0; j < n - 1; j++) {
            if(board[i][j] == " ") continue;

            let block = board[i][j].toLowerCase();
            let rightBlock = board[i][j + 1].toLowerCase();
            let downBlock = board[i + 1][j].toLowerCase();
            let rightDownBlock = board[i + 1][j + 1].toLowerCase();
            
            if(block == rightBlock && rightBlock == rightDownBlock && rightDownBlock == downBlock) {
                board[i][j] = block;
                board[i][j + 1] = rightBlock;
                board[i + 1][j] = downBlock;
                board[i + 1][j + 1] = rightDownBlock;
            }
        }
    }    
}

/** 이 코드 리팩토링 해보자 */
function pullDown(m, n, board) {
    for(let j = 0; j < n; j++) {
        let i = m - 1;
        let empties = [];

        while(i >= 0) {
            // 파괴 예정인 블럭 X로 변경하기
            board[i][j] = isDestroying(board[i][j]) ? " " : board[i][j];

            // 변경된 블럭 다시 할당하기
            let block = board[i][j];

            // 아래에서 위로 올라가다가 공백을 만나면, 첫번째 공백에 대한 인덱스를 저장한다.
            if(block == " ") {
                empties.push(i);

            // 계속 위로 올라가다가 블럭을 만나면 처리해준다.
            } else {
                let emptyCount = empties.filter(v => v > i).length;
                if(emptyCount > 0) {
                    board[i + emptyCount][j] = block;
                    board[i][j] = " ";
                }
            }

            i--;
        }
    }
}

function isDestroying(block) {
    const code = block.charCodeAt();
    return code >= 97 && code <= 122;
}

function getEmptyCount(board) {
    let count = 0;
    for(let i = 0; i < board.length; i++) {
        for(let j = 0; j < board[i].length; j++) {
            if(board[i][j] != " ") continue;
            count++;
        }
    }
    return count;
}

module.exports.clearBlocks = clearBlocks;
module.exports.pullDown = pullDown;
module.exports.isDestroying = isDestroying;


// solution(4, 5, ["CCBDE", "AAADE", "AAABF", "CCBBF"])

// solution(5, 15, ["AAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAA"]);
// 라이언(R), 무지(M), 어피치(A), 프로도(F), 네오(N), 튜브(T), 제이지(J), 콘(C)
// solution(4, 5, ["CCBDE", "AAADE", "AAABF", "CCBBF"])
// solution(6, 6, ["TTTANT", "RRFACC", "RRRFCC", "TRRRAA", "TTMMMF", "TMMTTJ"])

assert.ok(solution(5, 15, ["AAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAA"]) == 75);
assert.ok(solution(5, 4, ["AAAA", "AAAA", "AAAA", "AAAA", "AAAA"]) == 20);// answer = 0;
assert.ok(solution(4, 5, ["CCBDE", "AAADE", "AAABF", "CCBBF"]) == 14);
assert.ok(solution(6, 6, ["TTTANT", "RRFACC", "RRRFCC", "TRRRAA", "TTMMMF", "TMMTTJ"]) == 15);

console.log("Success!!!");