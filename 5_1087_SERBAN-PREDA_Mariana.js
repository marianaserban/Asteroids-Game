//1.Model
let canvas, context, W, H;
//let asteroizi=[{x:150,y:150,radius:15,nrRachete:1},{x:300,y:300,radius:30,nrRachete:2}]
let asteroizi=[];
let x, y;
let vY = 2, vX =-2;
let w, h, radius;  //dimensiuni pt 1 asteroid
    /*     
             COORDONATE NAVA
             3 puncte:
             dreapta (400,550) (xNavaStanga,yNavaStanga)
             stanga(450, 550) (xNavaDreapta, yNavaDreapta)
             sus(425, 500)    (xNavaSus, yNava Sus)
     */

let xNavaStanga = 400, yNavaStanga = 550;
let xNavaDreapta = 450, yNavaDreapta = 550;
let xNavaSus = 425, yNavaSus = 500;
let vNava = 5; //viteza nava
let xRacheta=425, yRacheta=500;
let vRacheta = 20;

let asteroidSelectat = -1;
let nrVieti = 3;
let puncte = 0;
let rachetaInMiscare;

//2.Desenare
function desenare() {

//stergere scena -> am luat de aici
context.clearRect(0, 0, W, H)
    //desenare un asteroid
    //in functie de i;
    // impar->se misca pe verticala
    //par -> se misca pe orizontala
    for(let asteroid of asteroizi) {
        context.beginPath();
        context.fillStyle= 'gray';
        if(asteroid.nrRachete===1) {context.fillStyle= 'gray'};
        if(asteroid.nrRachete===2) {context.fillStyle= 'red'};
        if(asteroid.nrRachete===3) {context.fillStyle= 'lightblue'};
        if(asteroid.nrRachete===4) {context.fillStyle= 'coral'};

        if (asteroid.nrRachete > 0) {
            context.arc(asteroid.x, asteroid.y, asteroid.nrRachete * asteroid.radius, 0, 2 * Math.PI);
            context.fill()
            context.beginPath();
            context.fillStyle = 'black';
            context.font = 'bold 10pt Tahoma';
            context.textBaseline = 'middle';
            context.textAlign = 'center';
            context.fillText(asteroid.nrRachete, asteroid.x, asteroid.y);
        }
     }
         //desenare nava in functie de dimensiunile canvas-ului
         context.fillStyle = 'blue';
         context.moveTo(xNavaDreapta, yNavaDreapta);
         context.lineTo(xNavaStanga, yNavaStanga);
         context.lineTo(xNavaSus, yNavaSus);
         context.fill();
    
         //desenare racheta
         context.beginPath();
         context.fillStyle = 'red';
         if(yRacheta < 0) yRacheta = 500;
         context.arc(xRacheta, yRacheta, 5, 0, 2 * Math.PI);
        context.fill()


    //desenare numar vieti
    context.beginPath();
    context.fillStyle = 'white';
    context.font = 'bold 20pt Arial';
    context.textAlign = 'left';
    context.fillText(`Mai ai ${nrVieti} vieti`, 50, 50);

    //desenare puncte
    context.beginPath();
    context.fillStyle = 'white';
    context.font = 'bold 20pt Arial';
    context.textAlign = 'left';
    context.fillText(`Ai acumulat ${puncte} puncte`, 500, 50);

    //Sfarsit joc!!!!
    /*if (nrVieti === 0) {
        context.clearRect(0, 0, W, H)
        context.beginPath();
        context.fillStyle = 'white';
        context.font = 'bold 40pt Arial';
        context.textAlign = 'middle';
        context.fillText('Sfarsit joc!', 275, 300);
    }*/
        //programare executie
        requestAnimationFrame(desenare);
}
//3.Actualizare model
function actualizareModel() {
        for (let asteroid of asteroizi) {
               if(asteroid.y+vY>=H || asteroid.y<0 ){vY=-vY}
                asteroid.y += vY;
               if(asteroid.x+vX>=W || asteroid.x<0) {vX= - vX}
                asteroid.x += vX; 
    }
    coliziuneNavaAsteroizi();
}
//Miscare nava 
function miscareNava(e) {
    //stanga
    if (e.keyCode === 37 && xNavaStanga>=0) {
        xNavaDreapta -= vNava;
        xNavaStanga -= vNava;
        xNavaSus -= vNava;
        xRacheta = xNavaSus;
    }
    //dreapta
    if (e.keyCode === 39 && xNavaDreapta<=W) {
        xNavaDreapta += vNava;
        xNavaStanga += vNava;
        xNavaSus += vNava;
        xRacheta = xNavaSus
    }
    //sus
    if (e.keyCode === 38 && yNavaSus>=0) {
        yNavaDreapta -= vNava;
        yNavaStanga -= vNava;
        yNavaSus -= vNava;
        yRacheta = yNavaSus;
       
    }
    //jos
    if (e.keyCode === 40 && yNavaStanga <= 550 /*Nu las nava mai jos decat pozitia initiala*/) {
        yNavaDreapta += vNava;
        yNavaStanga += vNava;
        yNavaSus += vNava;
        yRacheta = yNavaSus;
    }
    //Z->rotire stanga;
    if (e.keyCode === 90) {
        
    }
    //C -> rotire spre dreapta
    if (e.keyCode === 67) {
   
    }
    //X->lansez rachete
    if (e.keyCode === 88) {

        //rachetaInMiscare= setInterval(function () {            
                yRacheta -= vRacheta;
       // }, 20)

    }
}
function verificareColiziuneRachetaAsteroid(e) {
    if (e.keyCode === 88) {
        for (let asteroid of asteroizi) {
            //distanta de la racheta la asteroid
            let distanta = Math.sqrt((xRacheta - asteroid.x) * (xRacheta - asteroid.x) + (yRacheta - asteroid.y) * (yRacheta - asteroid.y))
            if (distanta < asteroid.radius) {
                asteroid.nrRachete -= 1;
                puncte += 1;
                //clearInterval(rachetaInMiscare)
            }
        }
    }
}

function coliziuneNavaAsteroizi() {
    if (nrVieti > 0) {
        for (let asteroid of asteroizi) {
            //distanta dintre asteroid si punctul de sus
            let distantaSus = Math.sqrt((xNavaSus - asteroid.x) * (xNavaSus - asteroid.x) + (yNavaSus - asteroid.y) * (yNavaSus - asteroid.y))

            //distanta dintre asteroid si punctul din stanga
            let distantaStanga = Math.sqrt((xNavaStanga - asteroid.x) * (xNavaStanga - asteroid.x) + (yNavaStanga - asteroid.y) * (yNavaStanga - asteroid.y));

            //distanta dintre asteroid si punctul din dreapta
            let distantaDreapta = Math.sqrt((xNavaDreapta - asteroid.x) * (xNavaDreapta - asteroid.x) + (yNavaDreapta - asteroid.y) * (yNavaDreapta - asteroid.y))

            if (distantaDreapta < asteroid.radius || distantaStanga < asteroid.radius || distantaSus < asteroid.radius) {
                nrVieti--;
                console.log(nrVieti)
            }
        }
    } 
}

function aplicatie() {
 canvas = document.querySelector('canvas');
 W = canvas.width, H = canvas.height;
context = canvas.getContext('2d');
let n = 5;
 w=W/n;  
 h = H /n;           
 radius=H/40;
   let k=1;
    for (let i = 0; i < n; i++) {
        if (k <= 4) {
            asteroizi.push({
                x: k * w + Math.random() * 150, y: k * h + Math.random() * 150, radius: radius, nrRachete: k
            });
            k += 1;
        }
        if (k === 5) {
            k = 1;
        }
    }
    desenare();
    setInterval(actualizareModel, 20);
    document.addEventListener('keydown', miscareNava);
    document.addEventListener('keyup', verificareColiziuneRachetaAsteroid);
}
document.addEventListener('DOMContentLoaded', aplicatie);
