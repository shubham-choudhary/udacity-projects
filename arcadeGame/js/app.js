// Enemies our player must avoid
let Enemy = function(EnemyX,EnemyY,speedX) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = EnemyX;
    this.y = EnemyY;
    this.s = speedX;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (pause == true) {   //if wanna pause just fix the objects at thier place
      enemy1.x = enemy1.x;
      enemy2.x = enemy2.x;
      enemy3.x = enemy3.x;
    } else if (this.x >= 398) {
        this.x = 0;
    } else {
        this.x = this.x + this.s * dt ;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
let Player = function(PlayerX,PlayerY) {
    this.x = PlayerX;
    this.y = PlayerY;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function(dt) {
    //console.log(player.y)
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


Player.prototype.handleInput = function(keypressed) {

    if (pause == false) {
    switch(keypressed) {
        case 'left':
        restrictLeft();
        if(restrictleft == false){
            (this.x < 30) ? this.x = 404 : this.x = this.x - 101;
            hop.currentTime = 0;  //set the hop time 0 everytime a key is pressed if not specified jump and sound are out of sync
            hop.play();
          }
        break;

        case 'right':
        restrictRight();
        if (restrictright == false){
            (this.x > 403) ? this.x = 0 : this.x = this.x + 101;
            (this.x >403) ? winGame():"";
            hop.currentTime = 0;  //set the hop time 0 everytime a key is pressed if not specified jump and sound are out of sync
            hop.play();
          }
        break;

        case 'up':
          restrictUp();
          if (restrictup == false){
            (this.y < 50) ? ((this.x == 101 && task1completed == false) ? task1():"" ): this.y = this.y - 85; //height of player to move when move up or down 83 (row height see engine.js line 139) but 85 move player in better way
            (this.y<50) ? winGame():"";
            hop.currentTime = 0;  //set the hop time 0 everytime a key is pressed if not specified jump and sound are out of sync
            hop.play();
          }
        break;

        case 'down':
            (this.y > 390) ? this.y = this.y : this.y = this.y + 85;
            hop.currentTime = 0;  //set the hop time 0 everytime a key is pressed if not specified jump and sound are out of sync
            hop.play();
        break;

        case 'space':
            pauseGame();
            background.pause(); //to pause music also when game is paused
    }
  } else if((keypressed == 'space') && (pause == true)) {
    pauseGame();
    background.play();  //to play back music
    } else {
  }
};


function drawImage(src,positionX,positionY){  //to draw an image on canvas (draws only once)
  ctx.drawImage(src,positionX,positionY);
}

//pause game
let pause = false;
let pauseGame = function() {
   pause = !pause;
   if(pause == false) {  // if pause is false i.e game is being played then run timer else stop it
     timer=setInterval(function(){  //this setInterval function can also be defined in character function
       ctx.clearRect(490,236,100,50);
       ctx.strokeStyle = "black";
       ctx.font = "18px Arial";
       time>=0 ? ctx.strokeText(((time--) +"secs"),507,250): timesUp();
     },1000);
   } else {
     clearInterval(timer);
   }
};


//restricted movement (player cannot go on rock)
let restrictleft,restrictright,restrictup;
function restrictUp() {
  if(((player.x< 101 || (player.x >= 202 && player.x < 302)) && player.y < 77)) {
    return (restrictup = true);
  } else {
    return (restrictup = false);
  }
}

function restrictLeft() {
  if((player.x == 101 || player.x == 303) && player.y<0) {
    return (restrictleft = true);
  } else {
    return (restrictleft = false);
  }
}

function restrictRight() {
  if((player.x == 101 || player.x == 404) && player.y < 0 ) {
    return (restrictright = true);
  } else {
    return (restrictright = false);
  }
}

let task1completed = false;
let hasKey = false ;
function HasKey(){
    (player.x < 101 && player.y == 331) ? hasKey = true : "" ;
    if (hasKey == true){
       drawImage(smallKey,505,300); //if player has key show it below the timer
     }
}

let b = document.querySelector('body');
let i= document.createElement('iframe');
function task1() {
  pauseGame();
  i.setAttribute('src','Memory-game/index.html');
  b.appendChild(i);
}

window.addEventListener("message", receiveMessage, false);
function receiveMessage(event){
   if (event.data=="removetheiframe"){
      b.removeChild(i);
      pauseGame();
      task1completed = true;
      let enemy4 = new Enemy(-1,138,320);
      allEnemies.push(enemy4);
      enemy2.s = 200;
  }
}


//give player 3 life and detecting collisions to reduce it
let img = new Image();
img.onload = function(){
  drawImage(img,507,50);
  drawImage(img,507,110);
  drawImage(img,507,170);
};
img.src = 'images/Heart.png';

//detectiong collision and restting player position
let collision,life=3,
 heart_y = 0; //definig  to use for removing life heart( = the height of heart)

function checkCollisions() {
  collision = false;
  for(let i=0; i<allEnemies.length;i++) {
    if ((Math.abs(player.x - allEnemies[i].x) < 80 ) && (Math.abs(player.y - allEnemies[i].y) < 30)) {
      player.x = 0;
      player.y = 416;
      enemy1.x = 105;
      //console.log('detected: collision');
      collision = true;
      reduceLife();
      plunk.currentTime = 0;
      plunk.play();
    }
  }
  if(task1completed == true) {   //to check if player has key and then removing key from canvas if player reaches key's co-ordinates
    HasKey();
  }
}

//reduce life for game over
function reduceLife() {
  if (collision == true && life>0){
    life--;
    heart_y = heart_y - 60; //reducing y 60 so as to cover just one heart at one collision
    ctx.fillStyle = "white";
    ctx.fillRect(505,230,50,heart_y);
  } else {
    gameOver();
  }
}

function gameOver() {
  pauseGame();
  clearInterval(timer);
  clearInterval(displayGemsTimer);
  let div = document.createElement('div');
  div.classList.add("go");
  div.innerHTML="<h3>HAHA!!</h3>\nBUGS TOOK ALL YOUR LIFES<h4>BUGS ARE FAST ENOUGH OR YOU WERE LAZY?????\nYOU Lost IT!!!!</h4>";
  document.querySelector('body').appendChild(div);
}

function winGame() {
  if (player.x > 403 && player.y < 73 && hasKey == true) {
    pauseGame();
    clearInterval(timer);
    clearInterval(displayGemsTimer);
    let div = document.createElement('div');
    div.classList.add("winner");
    div.innerHTML="<h3>CONGRATS!!!</h3>\n<h3>YOU ARE BACK HOME</h3> <h4>HUNTED BY BUGS "+life+" TIME(S)</h4>";
    document.querySelector('body').appendChild(div);
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let enemy1 = new Enemy(105,399,200);
let enemy2 = new Enemy(-1,230,280);
let enemy3 = new Enemy(-1,62,300);
//let enemy4 = new Enemy(180,62,400);
let allEnemies = [enemy1,enemy2,enemy3] ;


//adding rock in first cloumn
let rock = new Image();
rock.src = 'images/rock.png';

//adding udacity help
let udacity = new Image();
udacity.src = 'images/udacity.jpg';

//give player a key to unlock door
let Door = new Image();
Door.src = 'images/Door.jpg'; //door drawn in engine.js render function

let key = new Image();
key.src = 'images/Key.png';

let smallKey = new Image();
smallKey.src = 'images/smallKey.png';


let player = new Player(0,416);


//including timer
let time=30;
let timer;

let charDiv = document.createElement('div');
charDiv.classList.add('char');
charDiv.innerHTML="<h1>WHO ARE YOU???</h1><br><img src=\"images\/char-boy.png\" onclick=\"character('images\/char-boy.png')\"><br><img src=\"images\/char-cat-girl.png\" onclick=\"character('images\/char-cat-girl.png')\"><br><img src=\"images\/char-horn-girl.png\" onclick=\"character('images\/char-horn-girl.png')\"><br><img src=\"images\/char-pink-girl.png\" onclick=\"character('images\/char-pink-girl.png')\"><br><img src=\"images\/char-princess-girl.png\" onclick=\"character('images\/char-princess-girl.png')\">";
document.querySelector('body').appendChild(charDiv);

pauseGame();
//for selectinging character
function character(charSource){
    //console.log(charSource); //to check character source
    player.sprite=charSource;
    let removeDiv = document.querySelector('.char');
    document.querySelector('body').removeChild(removeDiv);

    let gameStory = document.createElement('div'); //to add game story after the character selector window
    gameStory.classList.add('gameStory');
    gameStory.innerHTML="<h2 class=\"h2\">WHERE IS MY KEY???</h2>Ohhh SHIT!!\t I LOST IT!!!<br> NEED HELP ?? <br><h3>UDACITY at RESCUE</h3><br> JUST GET to the UDACITY TILE in GAMEBOARD and GO UP. <br> THE MEMORY GAME is DESIGNED TO HELP U REMEMBER YOUR KEY. <br> WIN the MEMORY GAME WITH 32 or FEWER MOVES and RETURN TO ARCADE GAME TO GET YOUR KEY. <br>NOW GRAB YOUR KEY and GET TO YOUR SWEET HOME SAFELY.<br><br><br><h3 style = \"color: red\">CAUTION:- Don't get hunted by the BUGS!!!!</h3><br><br><button type=\"button\" onclick=\"startGame()\">start</button>";
    document.querySelector('body').appendChild(gameStory);
    let image = document.createElement('img');
    image.setAttribute('src',charSource);
    let h2 = document.querySelector('.h2');
    gameStory.insertBefore(image,h2);
}

function startGame() {
  let removeStory = document.querySelector('.gameStory');
  document.querySelector('body').removeChild(removeStory);

  ctx.font = "18px Arial";
  ctx.strokeText(((time--) +"secs"),507,250);
  pauseGame();
  displayGemsTimer = setInterval(function(){
    displayGems = !displayGems; //so as to turn it true once player collects a gem and a new gem appears
    randomNumber = random();
  },3000);
}

//end the game when out of time
function timesUp() {
  pauseGame();
  clearInterval(timer);
  let div = document.createElement('div');
  div.classList.add("timesUp");
  div.innerHTML="<h3>SORRY!!!<br>YOU ARE OUT OF TIME!!!!</h3>";
  document.querySelector('body').appendChild(div);
  clearInterval(displayGemsTimer);
}

let randomNumber,position,noOrangeGem=0,noBlueGem=0,noGreenGem=0 ;
let orangeGem = new Image();
orangeGem.src = 'images/Gem-Orange.png';
let blueGem = new Image();
blueGem.src = 'images/Gem-Blue.png';
let greenGem = new Image();
greenGem.src = 'images/Gem-Green.png';

let smallOrangeGem = new Image();
smallOrangeGem.src = 'images/smallGem-Orange.png';
smallOrangeGem.onload = function() {
drawImage(smallOrangeGem,0,0);
};
let smallBlueGem = new Image();
smallBlueGem.src = 'images/smallGem-Blue.png';
smallBlueGem.onload = function() {
drawImage(smallBlueGem,80,0);
};
let smallGreenGem = new Image();
smallGreenGem.src = 'images/smallGem-Green.png';
smallGreenGem.onload = function() {
drawImage(smallGreenGem,160,0);
};

function random() {
  return (Math.random() * 10);  //get a random integer between 0 - 9
}

function displayCollectibles() {
  position = Math.floor(randomNumber/2); //to get no. bet. 1-5
  position == 0 ? position++ : ""; //width of game board is 505 therefore poaition should be less than 505
  //console.log(randomNumber);
  if(Math.floor(randomNumber % 3) == 0) {  //display orangeGem randomNumber%3 as we have three type of gems
    drawImage(orangeGem,position * 104, position * 83);
    collectOrangeGems(position*104,position*83);
  } else if(Math.floor(randomNumber % 3) == 1) {  //display blueGem
    drawImage(blueGem,position * 104, position * 83);
    collectBlueGems(position*104,position*83);
  } else {  //display greenGem
    drawImage(greenGem,position * 104, position * 83);
    collectGreenGems(position*104,position*83);
  }
}

function collectOrangeGems(x,y) {
  if((Math.abs(player.x - x) < 40 ) && (Math.abs(player.y - y) < 10)) {
    noOrangeGem++;
    displayGems = false ;
    ctx.clearRect(30,20,30,30);
    ctx.fillStyle = 'black';
    ctx.fillText(noOrangeGem,40,35);
  }
}

function collectBlueGems(x,y) {
  if((Math.abs(player.x - x) < 50 ) && (Math.abs(player.y - y) < 30)) {
    noBlueGem++;
    displayGems = false ;
    ctx.clearRect(120,20,30,30);
    ctx.fillStyle = "black";
    ctx.fillText(noBlueGem,130,35);
  }
}

function collectGreenGems(x,y) {
  if((Math.abs(player.x - x) < 50 ) && (Math.abs(player.y - y) < 30)) {
    noGreenGem++;
    displayGems = false ;
    ctx.clearRect(195,20,30,30);
    ctx.fillStyle = "black";
    ctx.fillText(noGreenGem,200,35);
  }
}

let displayGems = false,displayGemsTimer;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// adding sound

let backgroundMusic = new Audio('music/frogger-ringtone.mp3');
backgroundMusic.play();
backgroundMusic.autoplay;
backgroundMusic.loop = true;
backgroundMusic.controls = true;

let hop = new Audio('music/sound-frogger-hop.wav');
let plunk = new Audio('music/sound-frogger-plunk.wav');
let squash = new Audio('music/sound-frogger-squash.wav');
