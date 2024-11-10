let username = "";
let level = 1;
let maxLevel = 10;
let baseTimeLimit = 5000; // Tempo massimo di reazione per il primo livello (5 secondi)
let reactionStartTime;
let isReactionTime = false;

// Funzione per iniziare il gioco e registrare l'utente
function startGame() {
    username = document.getElementById("usernameInput").value || "Giocatore";
    document.getElementById("currentUsername").innerText = username;
    document.getElementById("welcomeScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");
    startLevel();
}

// Funzione per cambiare nome utente
function changeUsername() {
    username = prompt("Inserisci il nuovo nome utente") || username;
    document.getElementById("currentUsername").innerText = username;
}

// Funzione per cambiare il livello di difficoltà
function changeDifficulty() {
    level = parseInt(prompt("Scegli un livello (1-10):")) || level;
    level = Math.max(1, Math.min(maxLevel, level)); // Limita il livello tra 1 e 10
    startLevel();
}

// Funzione per iniziare il livello con logica e timer random
function startLevel() {
    document.getElementById("levelDisplay").innerText = `Livello: ${level}`;
    document.getElementById("reactionBox").classList.remove("go");
    document.getElementById("reactionText").innerText = "Are you ready?";
    document.getElementById("targetBox").style.display = "none"; // Nasconde il targetBox
    isReactionTime = false;

    let waitTime = Math.random() * 3000 + 1000;
    setTimeout(() => {
        isReactionTime = true;
        if (level <= 5) {
            document.getElementById("reactionBox").classList.add("go");
            document.getElementById("reactionText").innerText = "GO!";
        } else {
            document.getElementById("reactionText").innerText = "";
            positionTargetBox();
            document.getElementById("targetBox").style.display = "block";
        }
        reactionStartTime = Date.now();
    }, waitTime);
}

// Posiziona il box verde in una posizione casuale per i livelli 5-10
function positionTargetBox() {
    const reactionBox = document.getElementById("reactionBox");
    const targetBox = document.getElementById("targetBox");

    // Imposta una dimensione più piccola per il targetBox
    targetBox.style.width = "60px"; // Dimensione più piccola
    targetBox.style.height = "60px"; // Dimensione più piccola
    
    // Calcola le posizioni massime per il posizionamento casuale
    const maxLeft = reactionBox.clientWidth - targetBox.clientWidth;
    const maxTop = reactionBox.clientHeight - targetBox.clientHeight;
    
    // Genera posizioni casuali per il quadrato verde
    const randomLeft = Math.floor(Math.random() * maxLeft);
    const randomTop = Math.floor(Math.random() * maxTop);
    
    // Imposta la posizione del targetBox
    targetBox.style.left = `${randomLeft}px`;
    targetBox.style.top = `${randomTop}px`;
}

// Funzione per controllare il tempo di reazione al click
function checkReaction(event) {
    if (!isReactionTime) return;

    let reactionTime = Date.now() - reactionStartTime;
    let timeLimit = baseTimeLimit - ((level - 1) * 700);
    
    if (level > 5 && event.target.id !== "targetBox") return;

    addResultToTable(username, reactionTime);

    isReactionTime = false;

    if (reactionTime <= timeLimit) {
        nextLevel();
    } else {
        alert("Tempo scaduto! Riprova.");
        startLevel();
    }
}

// Aggiunge i risultati alla tabella
function addResultToTable(name, time) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `<td>${name}</td><td>${time} ms</td>`;
    document.getElementById("timeList").appendChild(newRow);
}

// Funzione per passare al livello successivo o terminare il gioco
function nextLevel() {
    level++;
    if (level > maxLevel) {
        showFinalScreen();
    } else {
        showOverlay(`Livello ${level}`);
        setTimeout(startLevel, 2000);
    }
}

// Funzione per mostrare l'overlay del livello con testo
function showOverlay(text) {
    const overlay = document.getElementById("levelOverlay");
    document.getElementById("overlayText").innerText = text;
    overlay.classList.remove("hidden");
    setTimeout(() => {
        overlay.classList.add("hidden");
    }, 2000);
}

// Funzione per mostrare la schermata finale con i migliori risultati
function showFinalScreen() {
    showOverlay("Congratulazioni!");
    setTimeout(() => alert("Gioco completato!"), 3000);
}
