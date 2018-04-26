// var btnScramble  = $('#btnScramble');


var delayTimes = 200;


var Input = {


    initStr: '243716058', //21
    destStr: '123456780'

    // initStr: '254873160', //98
    // destStr: '123456780'

    // initStr: '513276408', //176
    // destStr: '243716058'


    // initStr: '358710246',//867
    // destStr: '123456780'

    // initStr: '735148206',//3014
    // destStr: '123456780'


    // initStr: '304571826', // 无解
    // destStr: '123456780'
};


var Game = GAME.createNewGame($('#game_board'), Input.initStr);


var Result = undefined;


// 默认str只用数字组成
function checkStr(str) {

    var check = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    var arr = str.split('');

    if (arr.length !== 9) {
        return false;
    }

    arr.forEach(function (data) {
        check[parseInt(data)]++;
    });


    for (var i = 0; i < 9; i++) {
        if (check[i] === 0) {
            return false;
        }
    }
    return true;

}


$('#iinitStr').attr('value', Input.initStr).blur(function () {
    $(this).css("border-color", "#ccc").css("color", "black");
}).focus(function () {
    $(this).css("border-color", "black").css("color", "#ccc");
})
    .change(function () {

    var istr = $(this).val();

    if (checkStr(istr)) {


        $(this).blur(function () {$(this).css("border-color", "#ccc").css("color", "black");});

        Input.initStr = istr;
        Game.set_pieces(istr);

    } else {

        $(this).blur(function () {$(this).css("border-color", "red").css("color", "red");});
    }


});


$('#idestStr').attr('value', Input.destStr).blur(function () {
    $(this).css("border-color", "#ccc").css("color", "black");
}).focus(function () {
    $(this).css("border-color", "black").css("color", "#ccc");
})
    .change(function () {


    var dstr = $(this).val();

    if (checkStr(dstr)) {


        $(this).blur(function () {$(this).css("border-color", "#ccc").css("color", "black");});

        Input.destStr = dstr;

    } else {

        $(this).blur(function () {$(this).css("border-color", "red").css("color", "red");});
    }
});



$('#finishh').on('click', function (e) {

    e.preventDefault();

    if(Result.data.length>50){
        treeSVG.duration=20;
    }


    var interval = setInterval(function finish() {
        if (!treeSVG.update()) {

            treeSVG.duration=300;
            clearInterval(interval);
        }
    }, treeSVG.duration);



});



function showTree(){

    treeSVG.resetSVG();
    $('#treeFrame').css("visibility", "visible");

    $(window).scrollTop($('#treeFrame').offset().top);

}


$('#solve').on('click', function (e) {

    e.preventDefault();

    $('#iinitStr').css("border-color", "#ccc").css("color", "black").attr('value', Input.initStr).blur(function () {
        $(this).css("border-color", "#ccc").css("color", "black");
    });


    $("#idestStr").css("border-color", "#ccc").css("color", "black").attr('value', Input.destStr).blur(function () {
        $(this).css("border-color", "#ccc").css("color", "black");
    });

    Result = Puzzle.solveByAStar();



    if (treeSVG.svg) {
        treeSVG.svg.remove();
        $('#treeFrame').css("visibility", "hidden");

    }


    if (Result !== undefined) {

        $('#resultt').css("color", "green").html(Result.prompt+"<br><br><a href=\"#instruction\" onclick=\"showTree();\">查看演示过程</a>");

        var intervall = setInterval(function finish() {
            Game.move_position(Result.moves.shift());

            if (!Result.moves.length) {
                clearInterval(intervall);
            }

        }, delayTimes);

    } else {

        treeSVG.resetSVG();


        $('#resultt').css("color", "red").html("无解。<a  href=\"more.png\" target=\"_blank\">为什么？</a>");
    }
});