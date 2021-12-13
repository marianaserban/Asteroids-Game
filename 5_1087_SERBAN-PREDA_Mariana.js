//1.Model
let canvas, context, W, H;
let asteroizi = [], n = 0;
let xNavaStanga, yNavaStanga, xNavaDreapta, yNavaDreapta, xNavaSus, yNavaSus;
let nava = { xCentru: 425, yCentru: 525, unghiNava: 60 * Math.PI/180/*0.5*/, razaNava: 30, r: 0 }
let nrVieti = 3;
let rachete = [{ x: 425, y: 525, coliziuneAsteroid: false, rachetaLansata: false }, { x: 425, y: 525, coliziuneAsteroid: false, rachetaLansata: false }, { x: 425, y: 525, coliziuneAsteroid: false, rachetaLansata: false }]
let contorRachete = -1;
let coliziuneNavaAsteroid = false;
let rachetaGalbena = false;  //nu e galbena
let totalPuncte = 0;
let contorPuncte = 0;
let numeJucator;
let nrJucatori;
let jucatori = [];
let jucator = {};
let nrSalvari = 0;


//2.Desenare
function desenareInceput() {

    context.clearRect(0, 0, W, H)
    context.beginPath();
    context.fillStyle = 'white';
    context.font = 'bold 30pt Tahoma';
    context.textAlign = 'middle';
    context.fillText('Asteroids Game', 250, 300);
}
function desenareJoc() {

    context.clearRect(0, 0, W, H) //stergere spatiu
    
    if (nrVieti > 0) {

        //desenare asteroizi
        for (let asteroid of asteroizi) {
            context.beginPath();
            context.fillStyle = 'gray';
            if (asteroid.nrRachete === 1) { context.fillStyle = 'gray' };
            if (asteroid.nrRachete === 2) { context.fillStyle = 'red' };
            if (asteroid.nrRachete === 3) { context.fillStyle = 'lightblue' };
            if (asteroid.nrRachete === 4) { context.fillStyle = 'coral' };

            if (asteroid.nrRachete > 0) {
                asteroid.radius = asteroid.nrRachete;
                context.arc(asteroid.x, asteroid.y, asteroid.radius * 10, 0, 2 * Math.PI);
                context.fill()

                //desenare numar rachete necesare distrugerii
                context.beginPath();
                context.fillStyle = 'black';
                context.font = 'bold 10pt Tahoma';
                context.textBaseline = 'middle';  //pozitionare fata de y
                context.textAlign = 'center'; //pozitionare fata de x
                context.fillText(asteroid.nrRachete, asteroid.x, asteroid.y);
            }
        }

        //calculare coordonate nava in functie de coordonatele cercului
        xNavaDreapta = nava.xCentru + nava.razaNava * Math.cos(nava.unghiNava);
        yNavaDreapta = nava.yCentru + nava.razaNava * Math.sin(nava.unghiNava);

        xNavaStanga = xNavaDreapta - 2 * nava.razaNava * Math.cos(nava.unghiNava);
        yNavaStanga = yNavaDreapta;

        xNavaSus = nava.xCentru + nava.razaNava * Math.cos(nava.unghiNava) - 2 * nava.razaNava * Math.sin(nava.unghiNava);
        yNavaSus = nava.yCentru - 2 * nava.razaNava * Math.sin(nava.unghiNava);

        if (coliziuneNavaAsteroid) {
            context.fillStyle = 'yellow';  //fac nava imuna 3 secunde
        } else {

            context.fillStyle = 'magenta';
            rachetaGalbena = false;
        }
        context.beginPath();
        context.moveTo(xNavaDreapta, yNavaDreapta);
        context.lineTo(xNavaStanga, yNavaStanga);
        //context.lineTo(xNavaSus, yNavaSus);
        context.lineTo(nava.xCentru, nava.yCentru);
        context.fill();

        //desenare rachete
        for (let racheta of rachete) {
            if (!racheta.coliziuneAsteroid) {
                context.beginPath();
                context.fillStyle = 'white';
                context.arc(racheta.x, racheta.y, 5, 0, 2 * Math.PI)
                context.fill();
            }
        }

        //desenare numar vieti
        context.beginPath();
        context.fillStyle = 'white';
        context.font = 'bold 20pt Tahoma';
        context.textAlign = 'left';
        context.fillText(`Mai ai ${nrVieti} vieti`, 50, 50);

        //desenare numar puncte necesar castigarii unei noi vieti
        let puncteRamase = 10 - contorPuncte;
        context.fillStyle = 'white';
        context.font = 'bold 15pt Tahoma';
        context.textAlign = 'left';
        context.fillText(`Inca ${puncteRamase} puncte pentru o noua viata`, 440, 580);
    }

    if (nrVieti === 0) {
        context.clearRect(0, 0, W, H)
        context.beginPath();
        context.fillStyle = 'white';
        context.font = 'bold 30pt Tahoma';
        context.textAlign = 'middle';
        context.fillText('Sfarsit joc!', 275, 250);
        if (nrSalvari===0) {
            momorareLocalStorage();  //salvare localStorage
        }
        nrSalvari = 1;

        //preiau jucatorii din localStorage
        let jucatoriLocalStorage = JSON.parse(localStorage.getItem('jucatori'));
        for (let i = 0; i < jucatoriLocalStorage.length - 1; i++) {
            for (let j = i+1; j < jucatoriLocalStorage.length; j++) {
                if (jucatoriLocalStorage[i].totalPuncte < jucatoriLocalStorage[j].totalPuncte) {
                    let aux = jucatoriLocalStorage[i];
                    jucatoriLocalStorage[i] = jucatoriLocalStorage[j];
                    jucatoriLocalStorage[j] = aux;
                }
            }
        }

        //scriere primii 5 jucatori
        let contor = 0;
        context.font = 'bold 15pt Tahoma';
        context.textAlign = 'middle';
        let xScris=275, yScris=320;
        context.fillText('Cei mai buni jucatori', 275, 290);
        while (contor < 5) {

            if (jucatoriLocalStorage[contor]) {
                context.fillText(`${jucatoriLocalStorage[contor].numeJucator + ' ' + jucatoriLocalStorage[contor].totalPuncte}`, xScris, yScris);
                contor++;
                yScris = yScris + 20;
            } else {
                break;
            }
          
        }
    }

    //desenare numar total de puncte castigate
    context.beginPath();
    context.fillStyle = 'white';
    context.font = 'bold 15pt Tahoma';
    context.textAlign = 'left';
    context.fillText(`Total ${totalPuncte} puncte`, 600, 50);

    requestAnimationFrame(desenareJoc);
}
//3.Actualizare model
function actualizare() {

    //miscare asteroizi
    for (let asteroid of asteroizi) {
        if (asteroid.y >= H || asteroid.y < 0) {
            asteroid.viteza = -asteroid.viteza
        }
        if (asteroid.x >= W || asteroid.x < 0) { asteroid.viteza = -asteroid.viteza }

        asteroid.x = asteroid.x + asteroid.viteza * Math.cos(asteroid.unghiDeplasare);
        asteroid.y = asteroid.y + asteroid.viteza * Math.sin(asteroid.unghiDeplasare);
    }

    if (contorRachete != -1) {

        //verific daca racheta a parasit spatiul
        for (let racheta of rachete) {
            if (racheta.y >= H || racheta.y < 0) {
                racheta.rachetaLansata = false
                racheta.x = nava.xCentru;
                racheta.y = nava.yCentru;
                racheta.coliziuneAsteroid = false;
                contorRachete -= 1;
            }
        }
        //deplasare racheta
        for (let racheta of rachete) {
            if (racheta.rachetaLansata) {
                racheta.y -= 2;
            }
        }

        //verificare coliziune rachete asteroizi
        for (let asteroid of asteroizi) {
            for (let racheta of rachete) {
                let distanta = Math.sqrt((racheta.x - asteroid.x) * (racheta.x - asteroid.x) + (racheta.y - asteroid.y) * (racheta.y - asteroid.y))
                let sumaRazelor = asteroid.radius * 10 + 5;
                let diferentaRazelor = Math.abs(asteroid.radius * 10 - 5);
                if (distanta < sumaRazelor && distanta > diferentaRazelor) {
                    racheta.coliziuneAsteroid = true;
                    asteroid.nrRachete -= 1;
                    if (asteroid.nrRachete === 0) {  //daca distrug asteroidul iau 5 puncte
                        totalPuncte += 5;
                        contorPuncte += 5;
                    } else {
                        totalPuncte++;
                        contorPuncte += 1;
                    }
                    if (contorPuncte >=10) {
                        nrVieti += 1;
                        contorPuncte = contorPuncte-10;  //daca au venit mai mult de 10 puncte sa se adune in continuare pentru o noua viata
                    }
                    racheta.rachetaLansata = false;
                    racheta.x = nava.xCentru;
                    racheta.y = nava.yCentru;
                    racheta.coliziuneAsteroid = false
                    contorRachete -= 1;
                }
            }
        }
    }

    //coliziune asteroizi
    for (i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
            let distanta = Math.sqrt((asteroizi[i].x - asteroizi[j].x) * (asteroizi[i].x - asteroizi[j].x) +
                (asteroizi[i].y - asteroizi[j].y) * (asteroizi[i].y - asteroizi[j].y))
            let diferentaRazelor = Math.abs(asteroizi[i].radius * 10 - asteroizi[j].radius * 10);
            if (distanta < asteroizi[i].radius * 10 + asteroizi[j].radius * 10 && distanta > diferentaRazelor) {

                asteroizi[i].x = asteroizi[i].x - asteroizi[i].viteza * Math.cos(90 * Math.PI / 180) * distanta;
                asteroizi[i].y = asteroizi[i].y - asteroizi[i].viteza * Math.sin(90 * Math.PI / 180) * distanta;

                asteroizi[j].x = asteroizi[j].x + asteroizi[j].viteza * Math.cos(asteroizi[j].unghiDeplasare) * distanta;
                asteroizi[j].y = asteroizi[j].y + asteroizi[j].viteza * Math.sin(asteroizi[j].unghiDeplasare) * distanta;
            }
        }
    } 

    //coliziune asteroizi nava
    if (rachetaGalbena === false && coliziuneNavaAsteroid === false) {
        for (let asteroid of asteroizi) {
            let distanta = Math.sqrt((nava.xCentru - asteroid.x) * (nava.xCentru - asteroid.x) + (nava.yCentru - asteroid.y) * (nava.yCentru - asteroid.y))
            let sumaRazelor = asteroid.radius * 10 + nava.razaNava;
            let diferentaRazelor = Math.abs(asteroid.radius * 10 - nava.razaNava);
            if (distanta < sumaRazelor && distanta > diferentaRazelor) {
                coliziuneNavaAsteroid = true;
                //aduc nava si rachetele in pozitia initiala
                nava.xCentru = 425;
                nava.yCentru = 525;
                for (let racheta of rachete) {
                    racheta.x = 425;
                    racheta.y = 525;
                }
                nrVieti--;
            }
        }
        //las nava 3 secunde imuna, adica restartez jocul
        if (coliziuneNavaAsteroid) {
            rachetaGalbena = true;
            setTimeout(() => {
                coliziuneNavaAsteroid = false;
            }, 3000);

            actualizareModel();
        }
    }
}
function miscareNava(e) {
    //stanga
    if (e.keyCode === 37 && xNavaStanga >= 0) {
        nava.xCentru = nava.xCentru - nava.razaNava * Math.cos(nava.unghiNava);
        //actualizam si rachelete
        for (let racheta of rachete) {
            racheta.x = racheta.x - nava.razaNava * Math.cos(nava.unghiNava);
        }
    }
    //dreapta
    if (e.keyCode === 39 && xNavaDreapta <= W) {
        nava.xCentru = nava.xCentru + nava.razaNava * Math.cos(nava.unghiNava);
        //actualizam si rachelete
        for (let racheta of rachete) {
            racheta.x = racheta.x + nava.razaNava * Math.cos(nava.unghiNava);
        }
    }
    //sus
    if (e.keyCode === 38 && /*yNavaSus >= 0*/ nava.yCentru>=0) {
        nava.yCentru = nava.yCentru - nava.razaNava * Math.sin(nava.unghiNava);
        //actualizam si rachelete
        for (let racheta of rachete) {
            racheta.y = racheta.y - nava.razaNava * Math.sin(nava.unghiNava);
        }
    }
    //jos
    if (e.keyCode === 40 && yNavaStanga <= 550 /*Nu las nava mai jos decat pozitia initiala*/) {
        nava.yCentru = nava.yCentru + nava.razaNava * Math.sin(nava.unghiNava);
        for (let racheta of rachete) {
            racheta.y = racheta.y + nava.razaNava * Math.sin(nava.unghiNava);
        }
    }
    //Z->rotire stanga;
    if (e.keyCode === 90) {
  
        nava.r-=1;
        nava.xCentru = nava.xCentru + nava.r * Math.cos(nava.unghiNava);
        nava.yCentru = nava.yCentru + nava.r * Math.sin(nava.unghiNava);

        for (let racheta of rachete) {
            racheta.x = racheta.x + nava.r * Math.cos(nava.unghiNava);
            racheta.y = racheta.y + nava.r * Math.sin(nava.unghiNava);
        }

    }
    //C -> rotire spre dreapta
    if (e.keyCode === 67) {
        nava.r += 1;
        nava.xCentru = nava.xCentru + nava.r * Math.cos(nava.unghiNava);
        nava.yCentru = nava.yCentru + nava.r * Math.sin(nava.unghiNava);

        for (let racheta of rachete) {
            racheta.x = racheta.x + nava.r * Math.cos(nava.unghiNava);
            racheta.y = racheta.y + nava.r * Math.sin(nava.unghiNava);
        }
    }
    //X->lansez rachete
    if (e.keyCode === 88) {

        if (contorRachete === 2) {

        } else {
            contorRachete += 1;
            rachete[contorRachete].rachetaLansata = true;
        }

    }
}

function momorareLocalStorage() {
        jucator.numeJucator = numeJucator;
        jucator.totalPuncte = totalPuncte;

        if (!localStorage.getItem('jucatori')) { //daca e gol pun primul jucator

            jucatori.push(jucator);
            localStorage.setItem('jucatori', JSON.stringify(jucatori))

        } else {
            let jucatoriDinLocalStorage = JSON.parse(localStorage.getItem('jucatori'));
            jucatoriDinLocalStorage.push(jucator);
            localStorage.setItem('jucatori', JSON.stringify(jucatoriDinLocalStorage));
        }
}

function numarIntreStartSiEnd(start, end) {
    start = Math.ceil(start);  //rotunjeste pana la urmatorul numar intreg
    end = Math.floor(end);  //cel mai mare numar intreg mai mic sau egal cu un nr dat (rotunjeste prin minus)
    return Math.floor(Math.random() * (end - start + 1) + start)
}

function aplicatie() {
        btnStart = document.querySelector('#btnStart');
        canvas = document.querySelector('canvas');
        W = canvas.width, H = canvas.height;
        context = canvas.getContext('2d');
        n = 6;
        for (let i = 0; i < n; i++) {

            k = numarIntreStartSiEnd(1, 4);
                asteroizi.push({
                    x: numarIntreStartSiEnd(0, W), y: numarIntreStartSiEnd(0, H), radius: k, nrRachete: k,
                    unghiDeplasare: Math.random()* 2 *Math.PI , viteza: Math.random()
                });
        }
        desenareInceput();
        btnStart.addEventListener('click', () => {
            numeJucator = document.querySelector('#nume').value;
            if (numeJucator === "") {
                numeJucator = "Anonim";
            }
        desenareJoc();
        setInterval(actualizare, 10);

        })
    document.addEventListener('keydown', miscareNava);
    canvas.addEventListener
   
}
    document.addEventListener('DOMContentLoaded', aplicatie);