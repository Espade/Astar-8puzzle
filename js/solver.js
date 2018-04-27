


var Move = {
    up: function (state) {
        if (state.blankIndex > 2)
            return new State(state, state.blankIndex - 3);
    },
    down: function (state) {
        if (state.blankIndex < 6) {
            return new State(state, state.blankIndex + 3);
        }
    },
    left: function (state) {
        if (state.blankIndex % 3 > 0) {
            return new State(state, state.blankIndex - 1);
        }
    },
    right: function (state) {
        if (state.blankIndex % 3 < 2) {
            return new State(state, state.blankIndex + 1);
        }
    },
};


function State(preState, blankIndex) {
    if (preState) {
        // array 表示当前数码状态
        this.array = Array.from(preState.array);
        this.array[preState.blankIndex] = this.array[blankIndex];
        this.array[blankIndex] = Puzzle.blank;

        // 空数码的位置
        this.blankIndex = blankIndex;

        // 已经花费的代价
        this.g = preState.g + 1;

        // 估计 离目标的剩余代价
        this.h = this.getHeuristic();

        this.f = this.g + this.h;

        this.preState = preState;
    }
}



State.prototype.isSolved = function () {
    for (var i = 0; i < this.array.length; i++) {
        if (this.array[i] !== i) {
            return false;
        }
    }
    return true;
};

State.prototype.indexxOf = function (stateList) {
    var L = stateList.length;

    var N = this.array.length;

    for (var i = 0; i < L; i++) {
        var j = 0;

        for (; j < N; j++) {
            if (this.array[j] !== stateList[i].array[j]) {
                break;
            }
        }
        if (j === N) {

            return i;
        }

    }

    return -1;
};

State.prototype.getHeuristic = function () {

    var manhattan = 0;
    // 曼哈顿距离
    for (var i = 0; i < this.array.length; i++) {
        if (i !== this.blankIndex) {
            manhattan += Math.abs(parseInt(i / 3) - parseInt(this.array[i] / 3)) + Math.abs((i % 3) - (this.array[i] % 3));
        }
    }
    return manhattan;

    // var hamming=0;
    // // 汉明距离
    // for (var i = 0; i < this.array.length; i++) {
    //     if(i!==this.array[i]){
    //         hamming += 1;
    //     }
    // }
    // return hamming;
};







var Puzzle = {
    createInitialState: function (init, dest) {
        var o = new State();

        o.blankIndex = init.indexOf(0);

        o.array = [];

        for (var i = 0; i < init.length; i++) {
            o.array[i] = dest.indexOf(init[i]);
        }

        // 代表空数码的那个数字
        Puzzle.blank = o.array[o.blankIndex];

        o.g = 0;

        o.h = o.getHeuristic();

        o.f = o.g + o.h;


        return o;
    },

    set: function () {
        Puzzle.init = Input.initStr.split('').map(function (data) {
            return parseInt(data);
        });
        Puzzle.dest = Input.destStr.split('').map(function (data) {
            return parseInt(data);
        });
        Puzzle.initialState = Puzzle.createInitialState(Puzzle.init, Puzzle.dest);
    },

    isSolvable: function () {

        Puzzle.set();

        var a = 0, b = 0, n = Puzzle.init.length;

        for (var i = 0; i < n - 1; i++) {
            for (var j = i + 1; j < n; j++) {
                if (Puzzle.init[i] > Puzzle.init[j]) a++;
                if (Puzzle.dest[i] > Puzzle.dest[j]) b++;
            }
            if (Puzzle.init[i] === 0 && i % 2 === 1) a++;
            if (Puzzle.dest[i] === 0 && i % 2 === 1) b++;
        }
        return (a % 2 === b % 2);
    },

    solveByAStar: function () {
        if (!Puzzle.isSolvable()) {
            return undefined;
        }

        console.log('start searching');


        var closedList = [];

        var openList = [];

        var generatedList = [];



        var showExpansion=[];
        var oneExpand={};
        var lastExpandedIndex=-1;
        var newInserted=[];



        // OPEN表保存所有已生成而未检查的节点，CLOSED表中记录已检查过的节点。
        openList.push(Puzzle.initialState);
        generatedList.push(Puzzle.initialState);
        Puzzle.initialState.id=0;



        function tryInsertOpenList(state) {
            if (state !== undefined && state.indexxOf(closedList) === -1) {
                //
                // var i = state.indexxOf(openList);
                //
                // if (i === -1) {
                openList.push(state);

                state.id = generatedList.length;

                generatedList.push(state);
                newInserted.push(state);


                // console.log("insert f="+state.f);
                // } else {
                //     if (state.f < openList[i].f) {
                //         openList[i] = state;
                //         // console.log("update f="+state.f);
                //     }
                // }

            }
        }


        while (openList.length) {

            // 之前一直写成 return a.f>b.f; 找了好久bug！！！！
            openList.sort(function (a, b) {
                return a.f - b.f;
            });

            var nowState = openList.shift();



            oneExpand.parent=lastExpandedIndex;
            oneExpand.children=newInserted.map(function (value) { return value.id; });

            showExpansion.push(oneExpand);

            oneExpand={};
            newInserted=[];
            lastExpandedIndex=nowState.id;



            closedList.push(nowState);


            // console.log('the expanded nowState.f='+nowState.f);


            console.log('already checked ' + closedList.length + ' states');
            // 生成的节点，和检查的节点，和展开的节点
            if (nowState.isSolved()) {

                var prompts='生成了 <b>'+generatedList.length+'</b> 个状态结点，检查了 <b>' + closedList.length
                    +'</b> 个结点后，<br><br>找到了目标结点！返回了一条 <b>' + nowState.g + '</b> 步的最短路径';



                var dataList= generatedList.map(function (value,key) {
                    return {id:key,array:value.array.map(function (v) {return Puzzle.dest[v];}),f:value.f};
                });

                showExpansion.splice(0,1);
                showExpansion.push({parent:lastExpandedIndex});

                var moveList=[];
                for(var p=nowState;p.id!==0;p=p.preState){
                    moveList.push(p.blankIndex);
                }
                moveList.reverse();

                return {data:dataList,process:showExpansion,moves:moveList,prompt:prompts};
            }

            tryInsertOpenList(Move.up(nowState));
            tryInsertOpenList(Move.down(nowState));
            tryInsertOpenList(Move.left(nowState));
            tryInsertOpenList(Move.right(nowState));
        }

        return 0;
    }
};


// console.log(Puzzle.solveByAStar());

//
// Puzzle.initStr='513276408';
// Puzzle.destStr='243716058';
//
//
// console.log(Puzzle.solveByAStar());




