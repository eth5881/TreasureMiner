!function() {
'use strict'
	
    var cellCount = 0;
    var w = 19;
	var cellArray = [];
    var nextGeneration = [];
    var caverns = [];
    var treasures = [];
    var treasure = [];
    var treasureNum = 0;
	var rows = 50;
	var cols = 50;
    var cellCount = 0;
    var FPS = 30;
    var gold = 0;
    var minerals = 0;
    var energy = 100;
    var isDead = false;
    
    var canvas = document.querySelector( 'canvas' );
	canvas.width = w*cols;
	canvas.height = w*rows;
	var ctx = canvas.getContext( '2d' );
    document.getElementById("instructionsBtn").addEventListener("click", showInstructions);
    document.getElementById("text").style.visibility = "hidden";
    
    function showInstructions(){
        if(document.getElementById("text").style.visibility == "hidden"){
            document.getElementById("text").style.visibility = "visible";
            document.getElementById("instructionsBtn").innerHTML = "Hide Instructions";
        } else if(document.getElementById("text").style.visibility == "visible"){
            document.getElementById("text").style.visibility = "hidden";
            document.getElementById("instructionsBtn").innerHTML = "Show Instructions";
        }
    }
    
    var cell = {
        draw: function(i, j, w, color){
            ctx.fillStyle = color
            ctx.fillRect(i*w, j*w, w, w)
        }
    }
    var Tile = Object.create( cell );
    Object.assign( Tile, {
        create: function( name, value, x, y, hp ){
            var tile = Object.create( this )
            tile.name = name
            tile.value = value
            tile.x = x
            tile.y = y
            tile.hp = hp
            
            return tile
        }
    });
    
    var player = {
        draw: function(x, y, w, color){
            ctx.fillStyle = color
            ctx.fillRect(x, y, w, w)
        }
    }
    var Player = Object.create( player );
    Object.assign( Player, {
        create: function( x, y, isDrawn ){
            var player = Object.create( this )
            player.x = x
            player.y = y
            player.isDrawn = isDrawn

            return player
        }
    });
    
    var hero = Player.create(0, 0, false);
    
    function drawPlayer(){
        for(var i = 0; i < cols; i++){
            for(var j = 0; j < rows; j++){
                if(cellArray[i][j].value == 0){
                    hero.x = cellArray[i][j].x;
                    hero.y = cellArray[i][j].y;
                    hero.draw(hero.x, hero.y, w, "blue");
                    hero.isDrawn = true;
                    return;
                }
            }
        }
    }
    
    function drawLevel(){
        //create cell array, next generation array, cavern, and treasure array    
        for (var i = 0; i < rows; i++){
            cellArray[i] = [];
            nextGeneration[i] = [];
            caverns[i] = [];
            treasures[i] = [];
        }

        var count = 0;
        for(var x = 0; x < cols; x++) {
            for(var y = 0; y < rows; y++) {
                var num = Math.round(Math.random()*1);
                var temp = Math.round(Math.random()*100);
                count++;
                //assign initial value of each cell in cellArray with either 0 or 1
                cellArray[x][y] = Tile.create("tile" + count, num, 0, 0, 3);
                //assign initial value of each cell in nextGeneration to 0 by default 
                nextGeneration[x][y] = Tile.create("tile" + count, 0, 0, 0, 3);
                //make a copy of cellArray to identify caverns
                caverns[x][y] = Tile.create("tile" + count, 0, 0, 0, 3);
                //assign treasures a random value
                treasures[x][y] = Tile.create("treasure" + count, temp, 0, 0, 3);
            }
        }

        //identify neighbors of each cell
        for (var x = 1; x < cols-1; x++) {
            for (var y = 1; y < rows-1; y++) {
                var neighbors = 0;
                for (var i = -1; i <= 1; i++) {
                    for (var j = -1; j <= 1; j++) {
                        neighbors += cellArray[x+i][y+j].value;
                    }
                }

                neighbors -= cellArray[x][y].value;

                if ((cellArray[x][y].value == 1) && (neighbors < 3))
                    nextGeneration[x][y].value = 0;
                else if ((cellArray[x][y].value == 0) && (neighbors > 4))
                    nextGeneration[x][y].value = 1;
                else nextGeneration[x][y] = cellArray[x][y];          
            }
        }

        //previous cellArray equals the new generation    
        cellArray = nextGeneration;

        //make walls on all 4 sides    
        for(var i = 0; i < cols; i++){
            for(var j = 0; j < rows; j++){
                //make the walls a unique value so they will not be destroyed
                cellArray[i][0].value = 2;
                cellArray[0][j].value = 2;
                cellArray[i][cols-1].value = 2;
                cellArray[rows-1][j].value = 2;
            }
        }

        //draw tiles   
        for(var i = 0; i < cols; i++){
            for(var j = 0; j < rows; j++){
                if(cellArray[i][j].value == 1 || cellArray[i][j].value == 2){
                    cellArray[i][j].draw(i, j, w, "#674D40");
                    cellArray[i][j].x = i*w;
                    cellArray[i][j].y = j*w;
                }else{
                    cellArray[i][j].draw(i, j, w, "#995E4F");
                    cellArray[i][j].x = i*w;
                    cellArray[i][j].y = j*w;
                }
            }
        }
        
        //draw treasures
        for(var i = 0; i < cols; i++){
            for(var j = 0; j < rows; j++){
                if(cellArray[i][j].value != 1 && cellArray[i][j].value != 2){
                    if(treasures[i][j].value == 0){
                        treasures[i][j].draw(i, j, w, "#ff0")
                        treasures[i][j].x = i*w
                        treasures[i][j].y = j*w
                        treasure[treasureNum] = "hi";
                        treasureNum++;
                    }
                }
            }
        }
    }
        
    function floodFill(){
        for(var x = 0; x < cols; x++){
            for(var y = 0; y < rows; y++){
                if(cellArray[x][y].value == 0){
                    if(cellArray[x][y-1].value == 0)
                        cellArray[x][y-1].vaue == 0;
                    else if(cellArray[x][y+1].value == 0)
                        cellArray[x][y+1].value = 0;
                    else if(cellArray[x-1][y].value == 0)
                        cellArray[x-1][y].value = 0;
                    else if(cellArray[x+1][y].value == 0)
                        cellArray[x+1][y].value = 0;
                }
            }
        }
    }
    
    function update(){
        //check if player has stepped on a cell with a treasure
        for(var i = 0; i < cols; i++){
            for(var j = 0; j < rows; j++){
                if(((hero.x == treasures[i][j].x) && (hero.y == treasures[i][j].y)) && (treasures[i][j].value == 0)){
                    var num = Math.round(Math.random()*50);
                    treasures[i][j].value = 10;
                    gold += num;
                    document.getElementById("gold").innerHTML = "<b><img src=\"gold.png\"/> " + gold + "</b>";
                    treasure.pop();
                }
                if(treasure.length == 0){
                    cellArray[cellArray.length-2][cellArray.length-2].draw(cellArray.length-2, cellArray.length-2, w, "#000");
                    cellArray[cellArray.length-2][cellArray.length-2].x = (cellArray.length-2)*w;
                    cellArray[cellArray.length-2][cellArray.length-2].y = (cellArray.length-2)*w;
                    cellArray[cellArray.length-2][cellArray.length-2].value = 0;
                }
                if((hero.x == cellArray[cellArray.length-2][cellArray.length-2].x) && (hero.y == cellArray[cellArray.length-2][cellArray.length-2].y)){
                    cellArray = [];
                    nextGeneration = [];
                    caverns = [];
                    treasures = [];
                    treasure = [];
                    treasureNum = 0;
                    drawLevel();
                    drawPlayer();
                    energy = 100;
                    document.getElementById("front").style.width = energy*2 + "px";
                }
            }
        }
        if(energy == 0){
            isDead = true;
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = "#f00";
            ctx.font = "30px Orbitron";
            ctx.fillText("You ran out of energy!",canvas.width/2-260,canvas.height/2-100);
            ctx.fillText("You collected " + gold + " gold and " + minerals + " minerals.",canvas.width/2-260,canvas.height/2);
            ctx.fillText("Press Enter to Restart.",canvas.width/2-260,canvas.height/2+100);
        }
    }
    
    function draw(){
        //clear canvas for redraw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        //draw level
        for(var i = 0; i < cols; i++){
            for(var j = 0; j < rows; j++){
                if(cellArray[i][j].value == 1 || cellArray[i][j].value == 2){
                    cellArray[i][j].draw(i, j, w, "#674D40");
                    cellArray[i][j].x = i*w;
                    cellArray[i][j].y = j*w;
                }else{
                    cellArray[i][j].draw(i, j, w, "#995E4F");
                    cellArray[i][j].x = i*w;
                    cellArray[i][j].y = j*w;
                }
            }
        }
        //draw treasures
        for(var i = 0; i < cols; i++){
            for(var j = 0; j < rows; j++){
                if(cellArray[i][j].value != 1 && cellArray[i][j].value != 2){
                    if(treasures[i][j].value == 0){
                        treasures[i][j].draw(i, j, w, "#ff0")
                        treasures[i][j].x = i*w
                        treasures[i][j].y = j*w
                    }
                }
            }
        }
        //draw hero and update position
        hero.draw(hero.x, hero.y, w, "blue");       
    }
        
    drawLevel();
    drawPlayer();
    floodFill();
    
    setInterval(function() {
      draw();
      update();
    }, 1000/FPS);
    
    
    var Key = {
        _pressed: {},

        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,

        isDown: function(keyCode) {
            return this._pressed[keyCode];
        },

        onKeydown: function(event) {
            this._pressed[event.keyCode] = true;
       },

        onKeyup: function(event) {
            delete this._pressed[event.keyCode];
        }
    };
    
    document.addEventListener('keydown', function(event) {
        //press enter to restart when dead
        if (event.keyCode == 13 && isDead){
            isDead = false;
            cellArray = [];
            nextGeneration = [];
            caverns = [];
            treasures = [];
            treasure = [];
            treasureNum = 0;
            gold = 0;
            minerals = 0;
            drawLevel();
            drawPlayer();
            energy = 100;
            document.getElementById("front").style.width = energy*2 + "px";
            document.getElementById("minerals").innerHTML = "<b><img src=\"rock.png\"/> " + minerals + "</b>";
            document.getElementById("gold").innerHTML = "<b><img src=\"gold.png\"/> " + gold + "</b>";
        }
        if(!isDead){
            //move left
            if (event.keyCode == 65 && cellArray[(hero.x/w)-1][(hero.y/w)].value == 0) {
                hero.x -= w;
            }
            //move right
            if (event.keyCode == 68 && cellArray[(hero.x/w)+1][(hero.y/w)].value == 0) {
                hero.x += w;
            }
            //move up
            if (event.keyCode == 87 && cellArray[(hero.x/w)][(hero.y/w)-1].value == 0) {
                hero.y -= w; 
            }
            //move down
            if (event.keyCode == 83 && cellArray[(hero.x/w)][(hero.y/w)+1].value == 0) {
                hero.y += w;
            }
            //break walls
            if (event.keyCode == 65 && cellArray[(hero.x/w)-1][(hero.y/w)].value == 1) {
                if(cellArray[(hero.x/w)-1][(hero.y/w)].hp > 0)
                    cellArray[(hero.x/w)-1][(hero.y/w)].hp -= 1;
                else {
                    cellArray[(hero.x/w)-1][(hero.y/w)].value = 0;
                    minerals++;
                    document.getElementById("minerals").innerHTML = "<b><img src=\"rock.png\"/> " + minerals + "</b>";
                    energy-=2;
                    document.getElementById("front").style.width = energy*2 + "px";
                }
            }
            if (event.keyCode == 68 && cellArray[(hero.x/w)+1][(hero.y/w)].value == 1) {
                if(cellArray[(hero.x/w)+1][(hero.y/w)].hp > 0)
                    cellArray[(hero.x/w)+1][(hero.y/w)].hp -= 1;
                else {
                    cellArray[(hero.x/w)+1][(hero.y/w)].value = 0;
                    minerals++;
                    document.getElementById("minerals").innerHTML = "<b><img src=\"rock.png\"/> " + minerals + "</b>";
                    energy-=2;
                    document.getElementById("front").style.width = energy*2 + "px";
                }
            }
            if (event.keyCode == 87 && cellArray[(hero.x/w)][(hero.y/w)-1].value == 1) {
                if(cellArray[(hero.x/w)][(hero.y/w)-1].hp > 0)
                    cellArray[(hero.x/w)][(hero.y/w)-1].hp -= 1;
                else {
                    cellArray[(hero.x/w)][(hero.y/w)-1].value = 0;
                    minerals++;
                    document.getElementById("minerals").innerHTML = "<b><img src=\"rock.png\"/> " + minerals + "</b>";
                    energy-=2;
                    document.getElementById("front").style.width = energy*2 + "px";
                }
            }
            if (event.keyCode == 83 && cellArray[(hero.x/w)][(hero.y/w)+1].value == 1) {
                if(cellArray[(hero.x/w)][(hero.y/w)+1].hp > 0)
                    cellArray[(hero.x/w)][(hero.y/w)+1].hp -= 1;
                else {
                    cellArray[(hero.x/w)][(hero.y/w)+1].value = 0;
                    minerals++;
                    document.getElementById("minerals").innerHTML = "<b><img src=\"rock.png\"/> " + minerals + "</b>";
                    energy-=2;
                    document.getElementById("front").style.width = energy*2 + "px";
                }
            }
        }
    }, true);
}()