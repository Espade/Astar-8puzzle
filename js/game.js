



function PuzzlePiece(digit, height, width) {

    this.digit = digit;
    this.indexx = digit;


    var d = $('<div>', {
        css: {
            border: '1px solid black',
            height: height - 2,
            width: width - 2,
            position: 'absolute',

            backgroundColor: 'white',
            fontSize: '' + 8 + 'em',
            lineHeight: '200px',
            textAlign: 'center',
        },

        html: digit
    });
    if (digit === 0)
        d.css('visibility', 'hidden');


    // 绑定 数据和视图
    this.container = d;
    d.data("piece", this);

}

PuzzlePiece.prototype.freshPosition = function (x, y, do_animation) {
    this.xPos = x;
    this.yPos = y;

    if (do_animation) {


        this.container.animate({
            top: y,
            left: x
        }, delayTimes);


    } else {
        this.container.css({
            top: y,
            left: x
        });
    }

    // if(this.currentposition===this.digit){
    //     this.container.css({
    //         backgroundColor: 'green',

    //     });
    // }else{
    //     this.container.css({
    //         backgroundColor: 'white',

    //     });
    // }


};


var GAME = (function ($) {

    var gameBoardContainer;
    var solver;
    var solution;

    var pieceWidth;
    var pieceHeight;
    var pieces = [];
    var blankPiece;


    function init() {

        gameBoardContainer.css("visibility", "hidden");

        create_pieces();
        
        setupEventListener(gameBoardContainer, 'click');

    }


    function create_pieces() {


        pieceWidth = gameBoardContainer.width() / 3;
        pieceHeight = gameBoardContainer.height() / 3;


        for (var i = 0; i < 9; i++) {
            pieces.push(new PuzzlePiece(i, pieceHeight, pieceWidth));
        }


        blankPiece = pieces[0];


        return pieces;
    }

    function set_pieces(str) {

        var arr = Array(9);

        str.split('').forEach(function (digit, index) {
            arr[digit] = index
        });


        var copy = Array(9);

        for (var i = 0; i < 9; i++) {
            pieces[i].indexx=arr[pieces[i].digit];
            copy[pieces[i].indexx]=pieces[i];
        }

        pieces=copy;

        draw_pieces();
    }


    function draw_pieces() {



        if (!gameBoardContainer)
            throw "Need a container to draw board";

        var counter = 0;

        for (var i = 0; i < 3; i++) {
            var y = pieceHeight * i;
            for (var j = 0; j < 3; j++) {
                var x = pieceWidth * j;

                var p = pieces[counter++];
                p.freshPosition(x, y);
                $(gameBoardContainer).append(p.container);

            }
        }

    }


    function handleClick() {
        // 获取视图绑定的数据
        var piece = $(this).data("piece");
        try_move(piece);
    }

    function setupEventListener(element, event) {
        if (element)
            element.on(event, "div", handleClick);
    }

    function removeEventListener(element, event) {
        if (element)
            element.off(event, "div", handleClick);
    }

    function try_move(piece) {

        switch (piece.indexx) {
            case blankPiece.indexx + 1:
            case blankPiece.indexx - 1:
            case blankPiece.indexx + 3:
            case blankPiece.indexx - 3:
                move(piece);
                break;
            default:
                console.log("I can't move");
        }


    }


    function move(piece) {


        // 交换在piece数组里的位置
        var temp = piece.indexx;

        pieces[temp] = blankPiece;
        pieces[blankPiece.indexx] = piece;
        piece.indexx = blankPiece.indexx;
        blankPiece.indexx = temp;


        // 交换html里的位置
        var pieceX = piece.xPos;
        var pieceY = piece.yPos;

        piece.freshPosition(blankPiece.xPos, blankPiece.yPos, true);
        blankPiece.freshPosition(pieceX, pieceY);

        var str = '';

        for (var i = 0; i < 9; i++) {
            str += pieces[i].digit;
        }

        Input.initStr=str;


        $('#iinitStr').css("border-color", "#ccc").css("color", "black").blur(function () {
            $(this).css("border-color", "#ccc").css("color", "black");
        }).attr('value', str);



    }

    return {


        createNewGame: function (container,initStr) {

            gameBoardContainer = container;

            init();

            set_pieces(initStr);

            gameBoardContainer.css("visibility", "visible");


            return {

                set_pieces:set_pieces,

                move_position: function (index) {
                    $(pieces[index].container).trigger('click');
                },



                destroy: function () {
                    removeEventListener(gameBoardContainer, 'click');
                    gameBoardContainer.empty();
                    gameBoardContainer = null;
                    solver = null;
                    solution = null;
                    pieceWidth = null;
                    pieceHeight = null;
                    pieces = [];
                    blankPiece = null;
                }
            };

        }

    }


})(jQuery);










