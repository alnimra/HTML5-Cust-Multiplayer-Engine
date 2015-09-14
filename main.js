/**
 * Created by ipsum on 9/12/15.
 */
var socket = io();

var canvasMap = document.getElementById("map"),//Main Map for player
    canvasSprite = document.getElementById("sprite");
var ctxMap = canvasMap.getContext("2d");

canvasSprite.width = canvasMap.width = window.innerWidth;
canvasSprite.height = canvasMap.height = window.innerHeight;
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

/** SPRITE HANDLING ******************************************************/
//Sprite Object
function Sprite(options) {
    this.x = options.x;
    this.y = options.y;
    this.name = options.name;
    this.width = options.width || 100;
    this.height = options.height || 100;
    this.speed = options.speed || 5;
    this.health = options.health || 300;
    this.isBattleActive = options.isBattleActive || false;
    this.isActive = options.isActive || true;
    this.isCollide = options.isCollide || false;
    this.hasAttacked = options.hasAttacked || false;
    this.credits = options.credits || 0;
    this.clipX = options.clipX || 0;
    this.pSX = options.pSX;
    this.pSY = options.pSY;
    this.a = options.a;
    this.b = options.b;
    this.pA = options.pA;
    this.pB = options.pB;
    this.compound = options.compoundY || 0;
    this.frames = options.frames || 4;
    this.currentFrame = options.currentFrame || 0;
    this.canvasNum = options.canvasNum || -1;
    this.socketId = options.socketId;
}

function drawStaticSprite(sprite) {
    ctxs[sprite.canvasNum].drawImage(spriteSheetImg, sprite.width * sprite.currentFrame + sprite.clipX, sprite.height * sprite.compound, sprite.width, sprite.height, sprite.x, sprite.y, sprite.width, sprite.height);
}

function destroySprite(sprite) {
    ctxs[player.canvasNum].clearRect(0, 0, canvasMap.width, canvasMap.height);
}

//Sprite Drawing
function drawSprite(sprite) {

    if ((65 in keys || 68 in keys || 87 in keys || 83 in keys)) {
        sprite.isActive = true;
        ctxs[player.canvasNum].clearRect(0, 0, canvasMap.width, canvasMap.height);

        if (65 in keys) {
            sprite.compound = 1;
            sprite.x -= sprite.speed;
        } else if (68 in keys) {
            sprite.compound = 2;
            sprite.x += sprite.speed;
        } else if (87 in keys) {
            sprite.compound = 3;
            sprite.y -= sprite.speed;
        } else if (83 in keys) {
            sprite.compound = 0;
            sprite.y += sprite.speed;
        }

        if (65 in keys || 68 in keys || 87 in keys || 83 in keys) {
            ctxs[player.canvasNum].drawImage(spriteSheetImg, sprite.width * sprite.currentFrame + sprite.clipX, sprite.height * sprite.compound, sprite.width, sprite.height, sprite.x, sprite.y, sprite.width, sprite.height);
        } else {
            ctxs[player.canvasNum].drawImage(spriteSheetImg, sprite.width * sprite.currentFrame * 2 + sprite.clipX, sprite.height * sprite.compound, sprite.width, sprite.height, sprite.x, sprite.y, sprite.width, sprite.height);

        }
        socket.emit('∆', player);

        if (sprite.currentFrame == sprite.frames) {
            sprite.currentFrame = 0;
        } else {
            sprite.currentFrame++;
        }
    } else {
        sprite.isActive = false;
        socket.emit('need players array');
        ctxs[player.canvasNum].clearRect(sprite.x - sprite.speed, sprite.y - sprite.speed, sprite.width + 2 * sprite.speed, sprite.height + 2 * sprite.speed);
        ctxs[player.canvasNum].drawImage(spriteSheetImg, sprite.width * sprite.currentFrame + sprite.clipX, sprite.height * sprite.compound, sprite.width, sprite.height, sprite.x, sprite.y, sprite.width, sprite.height);
    }
}

/** TILE MAP *****************************************************************/
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
/** DYNAMICALLY CREATE CANVASES PER USER *********************************/
var userNum = 0;
var canvassLayers = {};
var ctxs = {};
function createCanvas(pl, playersArray) {
    for (var i in playersArray) {
        if (playersArray[i].name == pl.name) {
            pl.canvasNum = i;
        }
    }
    var canvas = document.createElement('canvas');
    canvas.id = "canvas" + pl.canvasNum;
    console.log(canvas.id);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.zIndex = pl.canvasNum;
    canvas.style.position = "absolute";
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas);
    canvassLayers[pl.canvasNum] = canvas;
    ctxs[pl.canvasNum] = canvassLayers[pl.canvasNum].getContext("2d");


}
/** PORT COLLISION *******************************************************/

function portCollision(sprite, tileMap) {

    if (sprite.x > (canvasMap.width / 2)) {


        if (sprite.a < ((tileMap[0].length * dim) - (canvasMap.width)) / sprite.speed) {
            sprite.a++;
            ctxMap.clearRect(0, 0, canvasMap.width, canvasMap.height);

            //tilesX -= sprite.speed;
            sprite.x = (canvasMap.width / 2);
            // if (!monster.isActive) {
            //   ctxMon.clearRect(0, 0, canvasMonster.width, canvasMonster.height);
            for (var j in players) {
                if (players[j].name != sprite.name) {
                    ctxs[players[j].canvasNum].clearRect(players[j].x - players[j].speed, players[j].y - players[j].speed, players[j].width + 2 * players[j].speed, players[j].height + 2 * players[j].speed);
                    if (players[j].isActive == true) {
                        players[j].x -= sprite.speed;
                        socket.emit('player pos', players[j]);
                        drawStaticSprite(players[j]);
                    }

                }
            }

            //   for (var i = 0; i < monsterArray.length; i++)
            //       monsterArray[i].x -= sprite.speed;
            // }
            ctxMap.translate(-sprite.speed, 0);
            drawMap(tileMap);


        } else if (sprite.x + sprite.width > canvasMap.width) {
            sprite.x = sprite.pSX;
        }
    } else if (sprite.x < 0) {
        sprite.x = 0;
    }

    if (sprite.y > canvasMap.height / 2) {
        if (sprite.b < ((tileMap.length * dim) - canvasMap.height) / sprite.speed) {
            sprite.b++;


            ctxMap.clearRect(0, 0, canvasMap.width, canvasMap.height);
            sprite.y = canvasMap.height / 2;
            for (var k in players) {
                if (players[k].name != sprite.name) {
                    ctxs[players[k].canvasNum].clearRect(players[k].x - players[k].speed, players[k].y - players[k].speed, players[k].width + 2 * players[k].speed, players[k].height + 2 * players[k].speed);

                    if (players[k].isActive == true) {
                        players[k].y -= sprite.speed;
                        socket.emit('player pos', players[k]);
                        drawStaticSprite(players[k]);
                    }

                }
            }
            //if (!monster.isActive) {
            // ctxMon.clearRect(0, 0, canvasMonster.width, canvasMonster.height);
            // for (var k = 0; k < monsterArray.length; k++)
            //       monsterArray[k].y -= sprite.speed;
            // }
            ctxMap.translate(0, -sprite.speed);
            drawMap(tileMap);


        }
    }
    if (sprite.x < canvasMap.width / 2 && sprite.a > 0) {
        sprite.a--;


        ctxMap.clearRect(0, 0, canvasMap.width, canvasMap.height);
        sprite.x = canvasMap.width / 2;
        // tilesX -= sprite.speed;
        for (var r in players) {
            if (players[r].name != sprite.name) {
                ctxs[players[r].canvasNum].clearRect(players[r].x - players[r].speed, players[r].y - players[r].speed, players[r].width + 2 * players[r].speed, players[r].height + 2 * players[r].speed);
                if (players[r].isActive == true) {
                    players[r].x += sprite.speed;
                    socket.emit('player pos', players[r]);
                    drawStaticSprite(players[r]);
                }

            }
        }
        //  if (!monster.isActive) {
        //  ctxMon.clearRect(0, 0, canvasMonster.width, canvasMonster.height);
        // for (i = 0; i < monsterArray.length; i++)
        //    monsterArray[i].x += sprite.speed;
        //  }
        ctxMap.translate(sprite.speed, 0);

        drawMap(tileMap);


    }
    if ((sprite.y < canvasMap.height / 2) && sprite.b > 0) {
        sprite.b--;


        ctxMap.clearRect(0, 0, canvasMap.width, canvasMap.height);
        sprite.y = canvasMap.height / 2;

        ctxMap.translate(0, sprite.speed);
        drawMap(tileMap);

        for (var x in players) {
            if (players[x].name != sprite.name) {
                ctxs[players[x].canvasNum].clearRect(players[x].x - players[x].speed, players[x].y - players[x].speed, players[x].width + 2 * players[x].speed, players[x].height + 2 * players[x].speed);
                if (players[x].isActive == true) {
                    players[x].y += sprite.speed;
                    socket.emit('player pos', players[x]);
                    drawStaticSprite(players[x]);
                }

            }
        }
        //  if (!monster.isActive) {

        //ctxMon.clearRect(0, 0, canvasMonster.width, canvasMonster.height);
        //for (i = 0; i < monsterArray.length; i++)
        //    monsterArray[i].y += sprite.speed;
        //  }

    }
    if (sprite.y < 0) {
        sprite.y = 0;
    }
    if (sprite.y + sprite.height > canvasMap.height) {
        sprite.y = sprite.pSY;
    }
    /// for (i = 0; i < monsterArray.length; i++)
    //    drawStaticMonster(monsterArray[i]);
}
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

var shiftX = 0, shiftY = 0;
var player = null;
function newPlayer() {
    var rand = Math.floor(Math.random() * 999);
//Sprite Definitions
    var user = new Sprite({
        name: 'user ' + rand,
        x: shiftX * dim,
        y: shiftY * dim,
        a: 0,
        b: 0,
        width: 32,
        height: 48,
        speed: 10,
        frames: 3,
        userNum: userNum
    });

    socket.emit('init player', user);

    player = user;
    socket.emit('createCanvas');
    player.socketId = socket.id;
    socket.on('createCanvas', function (players) {
        var tempCanvasNum = player.canvasNum;
        createCanvas(player, players);
        if(tempCanvasNum != -1){
            player.canvasNum = tempCanvasNum;
        }
    });
    socket.on('createPseudoCanvas', function (players) {
        if(ctxs.length != players.length){
            console.log('pseudo');
            for (var i in players) {
                if (players[i].name != player.name) {
                    createCanvas(players[i], players);
                    console.log('psuedo ' + i);
                }
            }
        }


    });
    setInterval(gameThread, 30);

    //  socket.emit('need players array now');
    //  socket.on('need players array now', function(playersArray){
    //  createCanvas(player, playersArray);
    //   });

}

socket.on('add player', function (players) {
    for (var i in players) {
        if (players[i].name != player.name) {
            drawStaticSprite(players[i]);
        }
    }
});

socket.on('∆', function (pl) {
    console.log(pl.canvasNum);
    ctxs[pl.canvasNum].clearRect(pl.x - pl.speed, pl.y - pl.speed, pl.width + 2 * pl.speed, pl.height + 2 * pl.speed);
    drawStaticSprite(pl);


});

var players;
socket.on('need players array', function (pli) {
    players = pli;
});

socket.on('destroy player', function (player) {
    destroySprite(player);
});
function gameThread() {
    player.pSX = player.x;
    player.pSY = player.y;
    player.pA = player.a;
    player.pB = player.b;

    drawSprite(player);
    portCollision(player, mainMap);


}

function gameLoop() {
    socket.emit('getUserNumData');
    socket.on('fetchUserNumData', function (uN) {
        userNum = uN;
    });
    newPlayer();
}

//Load Image Variables
var mediaSheetImg, spriteSheetImg;

loadImage('media/mediaSheet.png', function (error, imgMediaSheet) {
    if (error) return console.error(error);
    mediaSheetImg = imgMediaSheet;
    loadImage('media/spriteSheet.png', function (error, imgSpriteSheet) {
        if (error) return console.error(error);
        spriteSheetImg = imgSpriteSheet;
        drawMap(mainMap);
        gameLoop();
    });

});