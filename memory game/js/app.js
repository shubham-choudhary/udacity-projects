/*
 * Create a list that holds all of your cards
 */
let deckCards = document.querySelectorAll(".card");



/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


for(let i=0; i<deckCards.length;i++){
  deckCards[i].classList.remove("show","open","match");
}

//let newDeck=shuffle(deckCards); //for the provided shuffle method
let deck = document.querySelector(".deck");
shuffle(deck); //for the one u found at https://stackoverflow.com/questions/7070054

/* //for appending if using default shuffle method
for(let i=0;i<newDeck.length;i++){
  let x=deck.appendChild(newDeck[i]);
  deck.replaceChild(newDeck[i],deckCards[i]);
  //console.log(newDeck[i],deckCards[i])
}




// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
*/

//another shuffle from stackoverflow  https://stackoverflow.com/questions/7070054

function shuffle(array){
  for (var i = array.children.length; i >= 0; i--) {
      array.appendChild(array.children[Math.random() * i | 0]);
  }
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let starChild = document.querySelectorAll(".fa-star");
let cards=document.getElementsByClassName("card");
let openCards=[]; //to contain only open cards
let cardIndex=[]; //to contain the index of clicked cards and check if same card is clicked; if the clicked cards match have them else pop them out
let moves=document.getElementsByClassName("moves"),count = 0;
let restart=document.getElementsByClassName("restart")[0];
restart.addEventListener("click", function(){
  reset();
});

let section=document.querySelector("section");
let timerDiv=document.createElement("div");
section.appendChild(timerDiv);
let date= new Date().getTime();
let timer=setInterval(function(){
  let elapsedTime= Date.now();
  timerDiv.innerHTML = Math.floor((elapsedTime-date)/1000)+" seconds";
},1000);


for(let i=0;i<cards.length;i++){
  cards[i].classList.toggle("flip");
  cards[i].addEventListener("click", function(){
    if(cardIndex.every(x=> i!=x)){  //check the index of clicked card arrow function is used
      cardIndex.push(i);
      countMoves();
      displayCard(cards[i],i);
  }
});
}

function countMoves(){  //increment the counter and the moves
  count++;
  moves[0].innerHTML=count;
  ruStar(count);
}

function ruStar(count){
  count<=28 ? "":(count<=32?starChild[2].remove():(count<=36? "":(count<=41? starChild[0].remove(): "")));
}

function winner(){  //display game win message
  if(cardIndex.length==16){
    clearInterval(timer);
    let div=document.querySelector("div");
    //div.removeChild(deck);
    let winElement=document.createElement("div");
    winElement.classList.add("winner");
    div.appendChild(winElement);
    winElement.innerHTML="<div><span class=\"congrats\">YOU WON!!!<\/span><br><h5>TIME TAKEN To COMPLETE: "+timerDiv.innerHTML+"<br>MOVES TAKEN: "+count+"<br>YOUR RATING: "+document.querySelectorAll(".fa-star").length+"star</h5><button type=\"button\" onclick=\"reset()\"><i class=\"fa fa-repeat\"></i><\/button>";
    let colors=["red","yellow","blue","green"];
    let colorIndex=0;
    let congrats=document.querySelector(".congrats");
    let newCongrats="";
    let congratsChar=congrats.innerHTML.split("");
    for(let i=0;i<congratsChar.length;i++){
      if(colorIndex>=colors.length){
        colorIndex=0
      }
      newCongrats +="<span style=\"color: "+colors[colorIndex]+";font-size: 2em; font-family: sans-serif;\">"+congratsChar[i]+"<\/span>";
      colorIndex++;
    }
    congrats.innerHTML=newCongrats;
  }
}

function reset(){
  if(confirm("ARE U SURE U WANNA RESTART!!!!")==true){
    location.reload();
  }
}

function displayCard(item,i){
   item.classList.add("open","show");
   addToOpenCards(item);
}

function addToOpenCards(item,i){
  openCards.push(item);
  matchCards(item,i);
}

function matchCards(item,i){
  if(openCards.length > 1){
    if(openCards[0].children[0].classList.value == item.children[0].classList.value){
        lockMatchedCards(item);
        winner();
    } else{
      removeCard(item,i);
    }
  }
}

function removeCard(item){
  if(openCards.length > 1){
    cardIndex.pop();  //remove the last two incorrect index from cardIndex
    cardIndex.pop();
    openCards[0].classList.add("donot-match");
    openCards[1].classList.add("donot-match");
    setTimeout(function(){
      openCards[0].classList.remove("show","open","donot-match");
      openCards[1].classList.remove("show","open","donot-match");
      for(let i=openCards.length; i>0;i--){
        openCards.pop();
      }
  },500);
  }
}

function lockMatchedCards(item){
  openCards[0].classList.add("match");
  item.classList.add("match");
  for(let i=openCards.length; i>0;i--){
    openCards.pop();
  }
}
