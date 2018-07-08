document.getElementsByTagName("input")[2].setAttribute("disabled", "");
document.getElementsByTagName("input")[2].disabled = false;
document.getElementById("input_height").setAttribute("max", "50");
document.getElementById("input_width").setAttribute("max", "50");
const submit = document.getElementById("sizePicker").addEventListener("submit",function(event){
  event.preventDefault();
  makeGrid();
});

function makeGrid() {

  let width, height;

    width = document.getElementById("input_width").value;
    height = document.getElementById("input_height").value;

  document.getElementsByTagName("input")[2].disabled = true;

  const canvas = document.createElement("canvas");
  const x = document.getElementById("pixel_canvas");
  x.appendChild(canvas);

  drawGrid(width,height);
}


function drawGrid(x,y){
  const c = document.querySelector("canvas");
  const ctx = c.getContext("2d");
  const g=20;
  c.setAttribute("width", x*g);
  c.setAttribute("height", y*g);
  const off = c.getBoundingClientRect();
  ctx.globalAlpha=0.9;



  let xB=[];
  let yB=[];
  ctx.beginPath();
  ctx.lineWidth = "2";
  for(let i=0;i<=x*g; i+=g){
    ctx.moveTo(i,0);
    ctx.lineTo(i,y*g);
    xB.push(i);
  }
  for(let j=0;j<=y*g; j+=g){
    ctx.moveTo(0,j);
    ctx.lineTo(x*g,j);
    yB.push(j);
  }
  ctx.strokeStyle="#000";
  ctx.stroke();

  let canvasClick = c.addEventListener("click", function(event){
    let xco = event.pageX;
    let yco = event.pageY;
    let sgx = getXco(xco);
    let sgy=getYco(yco);

    let cc;
    let color = document.getElementById("colorPicker");
    cc = color.value ;

    fill(sgx,sgy,cc);
  });

  function getXco(x){
    for(let i = 0; i<xB.length; i++){
      if(xB[i] > (x-off.left)){
        x = xB[i-1];
        break;
      }
    }
    return x ;
  }

  function getYco(y){
  for(let j = 0; j<yB.length; j++){
    if(yB[j] > (y-off.top)){
      y = yB[j-1];
      break;
      }
    }
    return y;
  }

  let canvasClear = c.addEventListener("contextmenu", function(event){
    event.preventDefault();
    let xco = event.pageX;
    let yco = event.pageY;
    let sgx=getXco(xco);
    let sgy=getYco(yco);

    ctx.clearRect(sgx,sgy,g,g);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(sgx,sgy,g,g);
  });

  function fill(x,y,c){
    ctx.fillStyle = c;
    ctx.fillRect(x,y,g,g);
  }

  let cleaButton = document.createElement("input");
  cleaButton.setAttribute("value", "Clear Canvas");
  cleaButton.setAttribute("type", "button");
  document.getElementsByTagName("body")[0].appendChild(cleaButton);
  document.getElementsByTagName("input")[4].addEventListener("click", function(){
      document.getElementsByTagName("input")[2].disabled = false;
      ctx.clearRect(0,0,x*g,y*g);
      c.remove();
      document.getElementById("input_width").value=1;
      document.getElementById("input_height").value=1;
      document.getElementsByTagName("input")[4].remove();
    });
}
