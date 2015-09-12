/**
 * Created by ipsum on 9/12/15.
 */
var canvasMap = document.getElementById("map"); //Main Map for player
var ctxMap = canvasMap.getContext("2d");

canvasMap.width = window.innerWidth;
canvasMap.height = window.innerHeight;

/** IMAGE HANDLING *******************************************************/
var dim = 32;

function loadImage(path, callback) {
    var img = new Image();
    img.onerror = function () {
        callback('image failed to load');
    };
    img.onabort = function () {
        callback('image failed to load');
    };
    img.onload = function () {
        callback(null, img);
    };
    img.src = path;
}

/** KEY HANDLING************************************************************/
var keys = {};
window.addEventListener('keydown', function (e) {
    console.log('keyDown');
    keys[e.keyCode] = true;
    e.preventDefault();
});
window.addEventListener('keyup', function (e) {
    console.log('keyUp');
    delete keys[e.keyCode];
});


/** TILE *****************************************************************/
//Tile Definitions
function Tile(options) {
    this.width = options.width || 32;
    this.height = options.height || 32;
    this.compoundX = options.compoundX;
    this.compoundY = options.compoundY;
    this.id = options.id || 's1';
};

//Grass Tile Definitions
var gUL = new Tile({
    width: 32,
    height: 32,
    compoundX: 0,
    compoundY: 0,
    id: 'g1'
});

var gUM = new Tile({
    width: 32,
    height: 32,
    compoundX: 1,
    compoundY: 0,
    id: 'g2'
});

var gUR = new Tile({
    width: 32,
    height: 32,
    compoundX: 2,
    compoundY: 0,
    id: 'g3'
});

var gML = new Tile({
    width: 32,
    height: 32,
    compoundX: 0,
    compoundY: 1,
    id: 'g4'
});

var gMM = new Tile({
    width: 32,
    height: 32,
    compoundX: 1,
    compoundY: 1,
    id: 'g5'
});

var gMR = new Tile({
    width: 32,
    height: 32,
    compoundX: 2,
    compoundY: 1,
    id: 'g6'
});

var gBL = new Tile({
    width: 32,
    height: 32,
    compoundX: 0,
    compoundY: 2,
    id: 'g7'
});

var gBM = new Tile({
    width: 32,
    height: 32,
    compoundX: 1,
    compoundY: 2,
    id: 'g8'
});

var gBR = new Tile({
    width: 32,
    height: 32,
    compoundX: 2,
    compoundY: 2,
    id: 'g9'
});
function drawTile(tile) {
    ctxMap.drawImage(mediaSheetImg, tile.width * tile.compoundX, tile.height * tile.compoundY, tile.width, tile.height, tilesX, tilesY, tile.width, tile.height);
}

var tilesX = 0, tilesY = 0;

function drawMap(tileMap) {
    tilesX = 0;
    tilesY = 0;
    ctxMap.clearRect(0, 0, canvasMap.width, canvasMap.height);
    for (var r = 0; r < tileMap.length; r++) {
        for (var c = 0; c < tileMap[r].length; c++) {
            if (tileMap[r][c] == gUL.id) { //DRAW GRASS
                drawTile(gUL);
            } else if (tileMap[r][c] == gUM.id) {
                drawTile(gUM);
            } else if (tileMap[r][c] == gUR.id) {
                drawTile(gUR);
            } else if (tileMap[r][c] == gML.id) {
                drawTile(gML);
            } else if (tileMap[r][c] == gMM.id) {
                drawTile(gMM);
            } else if (tileMap[r][c] == gMR.id) {
                drawTile(gMR);
            } else if (tileMap[r][c] == gBL.id) {
                drawTile(gBL);
            } else if (tileMap[r][c] == gBM.id) {
                drawTile(gBM);
            } else if (tileMap[r][c] == gBR.id) {
                drawTile(gBR);
            }
            tilesX += 32;
        }

        tilesX = 0;
        tilesY += 32;
    }
}

function cJSONtTileMap(json) { //JSON Conversion to tileMap syntax # to Mephisto Tile Codes, to tile map 2d array
    var mapArray = []; //1d Array

    for (var i = 0; i < json.length; i++) { //Look through entire array
        var place = json[i]; //Start converting and copying to new array.
        if (place == 1) {
            mapArray.push('g1');
        } else if (place == 2) {
            mapArray.push('g2');
        } else if (place == 3) {
            mapArray.push('g3');
        } else if (place == 4) {
            mapArray.push('g4');
        } else if (place == 5) {
            mapArray.push('g5');
        } else if (place == 6) {
            mapArray.push('g6');
        } else if (place == 7) {
            mapArray.push('g7');
        } else if (place == 8) {
            mapArray.push('g8');
        } else if (place == 9) {
            mapArray.push('g9');
        }
    }
    return OneDtoTwoD(mapArray, 50); //Now converting the 1d array to 2d...
}

var mainMap = cJSONtTileMap(mainMapJSON); //The dungeon map in good 2d mode.

function OneDtoTwoD(list, elementsPerSubArray) { //Converting 1d array to 2d Array
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}
function gameThread() {
    drawMap(mainMap);
}

function gameLoop() {
    setInterval(gameThread, 30);
}

//Load Image Variables
var mediaSheetImg;

loadImage('media/mediaSheet.png', function (error, imgMediaSheet) {
    if (error) return console.error(error);
    mediaSheetImg = imgMediaSheet;
    gameLoop();

});