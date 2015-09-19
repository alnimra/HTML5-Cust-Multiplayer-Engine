/**
 * Created by alnim on 9/12/15.
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
    this.localX = options.localX;
    this.localY = options.localY;
    this.drawX = options.drawX || 0;
    this.drawY = options.drawY || 0;
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
    this.localPSX = options.localPSX;
    this.localPSY = options.localPSY;
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

/*function drawStaticSprite(sprite) {
 ctxs[sprite.canvasNum].drawImage(spriteSheetImg, sprite.width * sprite.currentFrame + sprite.clipX, sprite.height * sprite.compound, sprite.width, sprite.height, sprite.localX, sprite.localY, sprite.width, sprite.height);
 }*/
function drawStaticPlayer(sprite) {
    ctxs[sprite.canvasNum].drawImage(spriteSheetImg, sprite.width * sprite.currentFrame + sprite.clipX, sprite.height * sprite.compound, sprite.width, sprite.height, sprite.drawX, sprite.drawY, sprite.width, sprite.height);
}

function destroySprite(sprite) {
    ctxs[sprite.canvasNum].clearRect(0, 0, canvasMap.width, canvasMap.height);
}

//Sprite Drawing
var one = 0;
function drawSprite(sprite) {

    if ((65 in keys || 68 in keys || 87 in keys || 83 in keys)) {
        sprite.isActive = true;
        ctxs[sprite.canvasNum].clearRect(0, 0, canvasMap.width, canvasMap.height);

        if (65 in keys) {
            sprite.compound = 1;
            sprite.localX -= sprite.speed;
        } else if (68 in keys) {
            sprite.compound = 2;
            sprite.localX += sprite.speed;
        } else if (87 in keys) {
            sprite.compound = 3;
            sprite.localY -= sprite.speed;
        } else if (83 in keys) {
            sprite.compound = 0;
            sprite.localY += sprite.speed;
        }

        if (65 in keys || 68 in keys || 87 in keys || 83 in keys) {
            ctxs[sprite.canvasNum].drawImage(spriteSheetImg, sprite.width * sprite.currentFrame + sprite.clipX, sprite.height * sprite.compound, sprite.width, sprite.height, sprite.localX, sprite.localY, sprite.width, sprite.height);
        } else {
            ctxs[sprite.canvasNum].drawImage(spriteSheetImg, sprite.width * sprite.currentFrame * 2 + sprite.clipX, sprite.height * sprite.compound, sprite.width, sprite.height, sprite.localX, sprite.localY, sprite.width, sprite.height);

        }
        //updateOtherPlayers();
        socket.emit('∆', sprite);


        if (sprite.currentFrame == sprite.frames) {
            sprite.currentFrame = 0;
        } else {
            sprite.currentFrame++;
        }
    } else {
        sprite.isActive = false;
        // multiplayerUpdate();
        ctxs[sprite.canvasNum].clearRect(sprite.localX - sprite.speed, sprite.localY - sprite.speed, sprite.width + 2 * sprite.speed, sprite.height + 2 * sprite.speed);
        ctxs[sprite.canvasNum].drawImage(spriteSheetImg, sprite.width * sprite.currentFrame + sprite.clipX, sprite.height * sprite.compound, sprite.width, sprite.height, sprite.localX, sprite.localY, sprite.width, sprite.height);

        if(one != 1){
            socket.emit('∆', sprite);
            one = 1;
        }
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
/** COORDINATE CONVERSIONS ***********************************************/
function localToWorld(client, dim) {
    if (dim == 'x') {
        return client.localX + (client.a * client.speed);
        /*else if (client.a > client.pA)
         return client.localX - (client.a * client.speed);*/
    } else if (dim == 'y') {
        return client.localY + (client.b * client.speed);
        /*else if (client.b > client.pB)
         return client.localY - (client.b * client.speed);*/

    }
}


function worldToDraw(player, dim) {
    if (dim == 'x')
        return player.x - (user.a * user.speed);
    else if (dim == 'y')
        return player.y - (user.b * user.speed);
}
/** PORT COLLISION *******************************************************/

function portCollision(sprite, tileMap) {

    if (sprite.localX > (canvasMap.width / 2)) {


        if (sprite.a < ((tileMap[0].length * dim) - (canvasMap.width)) / sprite.speed) {
            sprite.a++;
            ctxMap.clearRect(0, 0, canvasMap.width, canvasMap.height);

            //tilesX -= sprite.speed;
            sprite.localX = (canvasMap.width / 2);
            // if (!monster.isActive) {
            //   ctxMon.clearRect(0, 0, canvasMonster.width, canvasMonster.height);
            /*for (var j in players) {
             if (players[j].name != sprite.name) {
             ctxs[players[j].canvasNum].clearRect(players[j].localX - players[j].speed, players[j].localY - players[j].speed, players[j].width + 2 * players[j].speed, players[j].height + 2 * players[j].speed);
             if (players[j].isActive == true) {
             players[j].localX -= sprite.speed;
             socket.emit('player pos', players[j]);
             drawStaticSprite(players[j]);
             }

             }
             }*/

            //   for (var i = 0; i < monsterArray.length; i++)
            //       monsterArray[i].x -= sprite.speed;
            // }
            //multiplayerUpdate();

            ctxMap.translate(-sprite.speed, 0);
            drawMap(tileMap);
            // multiplayerUpdate();


        } else if (sprite.localX + sprite.width > canvasMap.width) {
            sprite.localX = sprite.localPSX;
        }
    } else if (sprite.localX < 0) {
        sprite.localX = 0;
    }

    if (sprite.localY > canvasMap.height / 2) {
        if (sprite.b < ((tileMap.length * dim) - canvasMap.height) / sprite.speed) {
            sprite.b++;


            ctxMap.clearRect(0, 0, canvasMap.width, canvasMap.height);
            sprite.localY = canvasMap.height / 2;
            /*for (var k in players) {
             if (players[k].name != sprite.name) {
             ctxs[players[k].canvasNum].clearRect(players[k].localX - players[k].speed, players[k].localY - players[k].speed, players[k].width + 2 * players[k].speed, players[k].height + 2 * players[k].speed);

             if (players[k].isActive == true) {
             players[k].localY -= sprite.speed;
             socket.emit('player pos', players[k]);
             drawStaticSprite(players[k]);
             }

             }
             }*/
            //if (!monster.isActive) {
            // ctxMon.clearRect(0, 0, canvasMonster.width, canvasMonster.height);
            // for (var k = 0; k < monsterArray.length; k++)
            //       monsterArray[k].y -= sprite.speed;
            // }
            //multiplayerUpdate();

            ctxMap.translate(0, -sprite.speed);

            drawMap(tileMap);
            //  multiplayerUpdate();


        }
    }
    if (sprite.localX < canvasMap.width / 2 && sprite.a > 0) {
        sprite.a--;


        ctxMap.clearRect(0, 0, canvasMap.width, canvasMap.height);
        sprite.localX = canvasMap.width / 2;
        // tilesX -= sprite.speed;
        /*for (var r in players) {
         if (players[r].name != sprite.name) {
         ctxs[players[r].canvasNum].clearRect(players[r].localX - players[r].speed, players[r].localY - players[r].speed, players[r].width + 2 * players[r].speed, players[r].height + 2 * players[r].speed);
         if (players[r].isActive == true) {
         players[r].localX += sprite.speed;
         socket.emit('player pos', players[r]);
         drawStaticSprite(players[r]);
         }

         }
         }*/
        //  if (!monster.isActive) {
        //  c.localXMon.clearRect(0, 0, canvasMonster.width, canvasMonster.height);
        // for (i = 0; i < monsterArray.length; i++)
        //    monsterArray[i].x += sprite.speed;
        //  }

        ctxMap.translate(sprite.speed, 0);

        drawMap(tileMap);
        //multiplayerUpdate();


    }
    if ((sprite.localY < canvasMap.height / 2) && sprite.b > 0) {
        sprite.b--;


        ctxMap.clearRect(0, 0, canvasMap.width, canvasMap.height);
        sprite.localY = canvasMap.height / 2;


        ctxMap.translate(0, sprite.speed);


        drawMap(tileMap);
        //multiplayerUpdate();


        /*  for (var x in players) {
         if (players[x].name != sprite.name) {
         ctxs[players[x].canvasNum].clearRect(players[x].localX - players[x].speed, players[x].localY - players[x].speed, players[x].width + 2 * players[x].speed, players[x].height + 2 * players[x].speed);
         if (players[x].isActive == true) {
         players[x].localY += sprite.speed;
         socket.emit('player pos', players[x]);
         drawStaticSprite(players[x]);
         }

         }
         }*/
        //  if (!monster.isActive) {

        //ctxMon.clearRect(0, 0, canvasMonster.width, canvasMonster.height);
        //for (i = 0; i < monsterArray.length; i++)
        //    monsterArray[i].y += sprite.speed;
        //  }

    }
    if (sprite.localY < 0) {
        sprite.localY = 0;
    }
    if (sprite.localY + sprite.height > canvasMap.height) {
        sprite.localY = sprite.localPSY;
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
var user;
function newUser() {
    var rand = Math.floor(Math.random() * 999);
//Sprite Definitions
    var kuhaku = new Sprite({
        name: 'user ' + rand,
        localX: shiftX * dim,
        localY: shiftY * dim,
        a: 0,
        b: 0,
        width: 32,
        height: 48,
        speed: 10,
        frames: 3,
        userNum: userNum
    });

    user = kuhaku;
    socket.emit('init user', user);

    socket.emit('createCanvas');
    socket.on('createCanvas', function (playersar) {
        //var tempCanvasNum = user.canvasNum;
        console.log(user.canvasNum);
        createCanvas(user, playersar);
        console.log(user.canvasNum);
        /*if (tempCanvasNum != -1) {
         user.canvasNum = tempCanvasNum;
         }*/
        setInterval(gameThread, 30);
    });



}

socket.on('add player', function (playersar) {
    console.log('in add player');
    for (var i in playersar) {
        var rl = playersar[i];
        if (rl.name != user.name) {

            createCanvas(rl, playersar);

          //  ctxs[rl.canvasNum].clearRect(0, 0, canvasMap.width, canvasMap.height);
            rl.drawX = worldToDraw(rl, 'x');
            rl.drawY = worldToDraw(rl, 'y');

          //  drawStaticPlayer(rl);
            console.log('add player worked ' + i);

        }
        //multiplayerUpdate();
    }
});

function updateOtherPlayers() {
    for (var i in players) {
        if (players[i].name != user.name) {
            ctxs[players[i].canvasNum].clearRect(0, 0, canvasMap.width, canvasMap.height);
            players[i].drawX = worldToDraw(players[i], 'x');
            players[i].drawY = worldToDraw(players[i], 'y');

            drawStaticPlayer(players[i]);
        }
    }
}

/*function multiplayerUpdate(){
 socket.emit('need players array');
 socket.on('need players array', function (pli) {
 updateOtherPlayer(pli);
 });
 }*/

socket.on('∆', function (pl) {
    console.log('∆' + pl.canvasNum);

   // ctxs[pl.canvasNum].clearRect(0, 0, canvasMap.width, canvasMap.height);
    pl.drawX = worldToDraw(pl, 'x');
    pl.drawY = worldToDraw(pl, 'y');
  //  drawStaticPlayer(pl);


});

socket.on('destroy player', function (player) {
    destroySprite(player);
});
function gameThread() {
    socket.emit('fetch array');
    socket.on('fetch array', function (playerArray) {
        players = playerArray;
    });
    user.localPSX = user.localX;
    user.localPSY = user.localY;
    user.pA = user.a;
    user.pB = user.b;
    user.x = localToWorld(user, 'x');
    user.y = localToWorld(user, 'y');

    console.log('user.x  = ' + user.x);
    console.log('user.y  = ' + user.y);
    updateOtherPlayers();



    drawSprite(user);
    portCollision(user, mainMap);



}

function gameLoop() {
    newUser();
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