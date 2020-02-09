import graph from "juijs-graph";
import ClassicTheme from "./theme";
import {clearBlocks, pullDown, isDestroying} from "../friends4block";

function createDestination(m, n, board) {
    const destination = {};

    for(let j = 0; j < n; j++) {
        let i = m - 1;
        let empties = [];

        while(i >= 0) {
            // 파괴 예정인 블럭 X로 변경하기
            let block = isDestroying(board[i][j]) ? " " : board[i][j];

            // 아래에서 위로 올라가다가 공백을 만나면, 첫번째 공백에 대한 인덱스를 저장한다.
            if(block == " ") {
                empties.push(i);

            // 계속 위로 올라가다가 블럭을 만나면 처리해준다.
            } else {
                let emptyCount = empties.filter(v => v > i).length;
                if(emptyCount > 0) {
                    destination[`${i}:${j}`] = i + emptyCount;
                }
            }

            i--;
        }
    }

    return destination;
}

graph.use(ClassicTheme);

graph.define("chart.brush.canvas.friends", [ "util.base" ], function(_) {
    var CanvasFriendsBrush = function() {
        let m, n, width, height, distance, images, ratio;

        this.drawBefore = function() {
            m = this.brush.m;
            n = this.brush.n;
            width = this.axis.x.rangeBand();
            height = this.axis.y.rangeBand();
            distance = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
            images = this.axis.data.images;
            ratio = window.devicePixelRatio || 1;
        }

        this.draw = function() {
            let step = this.chart.getCache("step") || 0;
            let newBoard = this.chart.getCache("board");

            // 값이 없으면 최초 불러온 데이터 할당, 그 외에는 계산된 데이터 할당
            newBoard = !newBoard ? this.brush.board : newBoard;

            if(step == 0) {
                // 값이 없으면 최초 불러온 데이터 할당, 그 외에는 계산된 데이터 할당
                newBoard = !newBoard ? this.brush.board : newBoard;

                // 정적인 화면 그리기
                this.drawBackground(newBoard);
                clearBlocks(m, n, newBoard);
                this.chart.setCache("step", 1);
            } else if(step == 1) {
                this.drawClearBlocks(newBoard, () => {
                    this.chart.setCache("destination", createDestination(m, n, newBoard));
                    this.chart.setCache("step", 2);
                    this.drawBackground(newBoard);
                });
            } else if(step == 2) {
                this.drawPullDown(newBoard, () => {
                    pullDown(m, n, newBoard);
                    this.chart.setCache("destination", {});
                    this.chart.setCache("step", 0);
                    this.drawBackground(newBoard);
                });
            }

            this.chart.setCache("board", newBoard);
        }

        this.drawClearBlocks = function(board, callback) {
            const tpf = this.chart.getCache("tpf");
            const fps = this.chart.getCache("fps");
            const runtime = this.chart.getCache("runtime") || 0;
            const duration = 2; // 애니메이션 지속 시간 (초)

            if(tpf == 1) return;
            this.drawBackground(board);

            // 다음 액션으로 넘어가기전에 duration의 0.3초 정도 시간만큼 딜레이한다.
            if(runtime > (duration + 0.3) * 1000) {
                this.chart.setCache("move1", 0);
                this.chart.setCache("move2", 0);
                this.chart.setCache("runtime", 0);
                callback();
            } else {
                let move1 = this.chart.getCache("move1") || 0;
                let move2 = this.chart.getCache("move2") || 0;
                let distance2 = distance / 2;
                let step = distance2 / fps / (duration / 2);
                
                if(move1 < distance2) 
                    move1 += step;

                if(runtime > (duration * 1000) / 2) {
                    if(move2 < distance2) 
                        move2 += step;
                }

                for(let i = 0; i < m; i++) {
                    for(let j = 0; j < n; j++) {
                        // 소문자 일때
                        if(isDestroying(board[i][j])) {
                            const rx = width / 2 / 2;
                            const ry = height / 2 / 2;
                            this.canvas.strokeStyle = "red";
                            this.canvas.lineWidth = distance >= 50 ? 5 : 3;

                            const x1 = this.axis.x(j) - rx;
                            const y1 = this.axis.y(i) - ry;
                            const angle1 = Math.PI * 45 / 180;
                            const tx1 = move1 * Math.cos(angle1);
                            const ty1 = move1 * Math.sin(angle1);
                            this.canvas.beginPath();
                            this.canvas.moveTo(x1, y1);
                            this.canvas.lineTo(x1 + tx1, y1 + ty1);
                            this.canvas.stroke();
                            this.canvas.closePath();

                            const x2 = this.axis.x(j) + rx;
                            const y2 = this.axis.y(i) - ry;
                            const angle2 = Math.PI * 135 / 180;
                            const tx2 = move2 * Math.cos(angle2);
                            const ty2 = move2 * Math.sin(angle2);
                            this.canvas.beginPath();
                            this.canvas.moveTo(x2, y2);
                            this.canvas.lineTo(x2 + tx2, y2 + ty2);
                            this.canvas.stroke();
                            this.canvas.closePath();
                        }    
                    }
                }

                this.chart.setCache("move1", move1);
                this.chart.setCache("move2", move2);
                this.chart.setCache("runtime", runtime + (tpf * 1000));
            }
        }

        this.drawPullDown = function(board, callback) {
            const tpf = this.chart.getCache("tpf");
            const fps = this.chart.getCache("fps");
            const runtime = this.chart.getCache("runtime") || 0;
            const destination = this.chart.getCache("destination");
            const duration = 1;

            if(tpf == 1) return;
            this.drawBackground(board, destination);

            if(runtime > duration * 1000) {
                this.chart.setCache("runtime", 0);
                callback();
            } else {
                for(let key in destination) {
                    let move = this.chart.getCache(`move_${key}`) || 0;
                    const tokens = key.split(":");
                    const rx = width / 2;
                    const ry = height / 2;
                    const i = parseInt(tokens[0]);
                    const j = parseInt(tokens[1]);
                    const x = this.axis.x(parseInt(j)) - rx;
                    const y = this.axis.y(parseInt(i)) - ry;
                    const ty = this.axis.y(destination[key]) - ry;
                    const distance = ty - y;
                    const step = distance / fps / duration;

                    // 공백일 때 그리지 않는다.
                    if(board[i][j] == " ") continue;

                    if(move < distance)
                        move += step;

                    this.canvas.drawImage(
                        images[board[i][j].toUpperCase()], 
                        x * ratio,
                        (move >= distance ? ty : (y + move)) * ratio,
                        width * ratio, 
                        height * ratio
                    );

                    this.chart.setCache(`move_${key}`, move);
                }


                this.chart.setCache("runtime", runtime + (tpf * 1000));
            }
        }
        
        this.drawBackground = function(board, destination=null) {
            for(let i = 0; i < m; i++) {
                for(let j = 0; j < n; j++) {
                    if(destination != null) {
                        // 삭제 예정인 블럭을 지워준다.
                        if(isDestroying(board[i][j])) continue;

                        // 이동 예정인 블럭을 지워준다.
                        if(destination[`${i}:${j}`]) continue;
                    }

                    // 공백일 때 그리지 않는다.
                    if(board[i][j] == " ") continue;

                    const block = board[i][j];
                    const rx = width / 2;
                    const ry = height / 2;
                    const x = this.axis.x(j) - rx;
                    const y = this.axis.y(i) - ry;

                    this.canvas.drawImage(
                        images[block.toUpperCase()], 
                        x * ratio,
                        y * ratio,
                        width * ratio, 
                        height * ratio
                    );
                }
            }
        }
    }

    CanvasFriendsBrush.setup = function() {
        return {
            m: 0,
            n: 0,
            board: []
        };
    }

    return CanvasFriendsBrush;

}, "chart.brush.canvas.core");

const animation = graph.include("chart.animation");
const fps = document.getElementById("fps");
let prevSec = -1;

function loadImage(url) {
    return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = url; });
}

function solution(m, n, board, size) {
    let newBoard = [];

    for(let i = 0; i < board.length; i++) {
        newBoard[i] = board[i].split("");
    }

    Promise.all([ 
        loadImage("images/A.png"),
        loadImage("images/C.png"),
        loadImage("images/F.png"),
        loadImage("images/J.png"),
        loadImage("images/M.png"),
        loadImage("images/N.png"),
        loadImage("images/R.png"),
        loadImage("images/T.png")
    ]).then(images => {
        const chart = animation("#chart", {
            width: n * size,
            height: m * size,
            padding : 0,
            axis: [{
                x : {
                    domain : Array(n).fill(""),
                    line : false
                },
                y : {
                    domain : Array(m).fill(""),
                    line : false
                },
                data: {
                    images: {
                        A: images[0],
                        C: images[1],
                        F: images[2],
                        J: images[3],
                        M: images[4],
                        N: images[5],
                        R: images[6],
                        T: images[7]
                    }
                }
            }],
            brush : [{
                type: "canvas.friends",
                m: m,
                n: n,
                board: newBoard
            }],
            interval : 0,
            style : {
                backgroundColor: "#fbf9e6"
            }
        }).run(function(runtime) {
            const sec = (runtime / 1000).toFixed(0);
            if(prevSec != sec) {
                const value = this.builder.getCache("fps").toFixed(0);
                fps.innerHTML = value;
            }
            prevSec = sec;
        });
    });
}

function randomStart(rows, cols, size) {
    const MAP = "ACFJMNRRRRRRRRT";
    const result = [];

    for(let i = 0; i < rows; i++) {
        const row = [];
        for(let j = 0; j < cols; j++) {
            const target = Math.floor(Math.random() * MAP.length);
            row.push(MAP[target]);
        }
        result.push(row.join(""));
    }

    solution(rows, cols, result, size);
}

solution(6, 6, ["TTTANT", "RRFACC", "RRRFCC", "TRRRAA", "TTMMMF", "TMMTTJ"], 75);
// randomStart(100, 100, 10);