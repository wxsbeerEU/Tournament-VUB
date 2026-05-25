let tournamentData = [];
let gekozenGame = "Normaal";

// PAS DEZE LIJST AAN NAAR JOUW VRIENDEN
const VRIENDENGROEP = ["Lennart", "Paul-David", "Daniël", "Nino", "Renzo", "Remi", "Jawad"]; 
let geselecteerdeSpelers = new Set();

const POLYTOPIA_MANNETJES = ["Xin-Xi", "Imperius", "Bardur", "Oumaji"];
const POLYTOPIA_MAPS = ["Dryland", "Lake", "Continents", "Pangea", "Archipelago", "Water World"];

function laadVriendenKnoppen() {
    const container = document.getElementById('friends-container');
    container.innerHTML = '';
    geselecteerdeSpelers.clear();
    updateSpelerTeller();

    VRIENDENGROEP.forEach(naam => {
        const btn = document.createElement('button');
        btn.classList.add('friend-btn');
        btn.innerText = naam;
        btn.onclick = () => toggleSpeler(naam, btn);
        container.appendChild(btn);
    });
}

function toggleSpeler(naam, btnElement) {
    if (geselecteerdeSpelers.has(naam)) {
        geselecteerdeSpelers.delete(naam);
        btnElement.classList.remove('selected');
    } else {
        if (geselecteerdeSpelers.size >= 16) {
            alert("Je kunt maximaal 16 spelers toevoegen!");
            return;
        }
        geselecteerdeSpelers.add(naam);
        btnElement.classList.add('selected');
    }
    updateSpelerTeller();
}

function voegExtraSpelerToe() {
    const input = document.getElementById('custom-player-input');
    const naam = input.value.trim();
    
    if (naam && !geselecteerdeSpelers.has(naam)) {
        if (geselecteerdeSpelers.size >= 16) {
            alert("Je kunt maximaal 16 spelers toevoegen!");
            return;
        }
        
        const container = document.getElementById('friends-container');
        const btn = document.createElement('button');
        btn.classList.add('friend-btn', 'selected');
        btn.innerText = naam;
        btn.onclick = () => toggleSpeler(naam, btn);
        container.appendChild(btn);
        
        geselecteerdeSpelers.add(naam);
        input.value = '';
        updateSpelerTeller();
    } else if (geselecteerdeSpelers.has(naam)) {
        alert("Deze speler is al toegevoegd!");
    }
}

function updateSpelerTeller() {
    document.getElementById('speler-teller').innerText = geselecteerdeSpelers.size;
}

function kiesGame(game) {
    gekozenGame = game;
    if (gekozenGame === "Polytopia") {
        document.getElementById('main-title').innerText = "👑 Polytopia Tournament";
    } else if (gekozenGame === "Rollo Rush") {
        document.getElementById('main-title').innerText = "🦔 Rollo Rush Arena";
    } else {
        document.getElementById('main-title').innerText = "Tournament Generator";
    }
    
    if (document.getElementById('friends-container').innerHTML === "") {
        laadVriendenKnoppen();
    }

    document.getElementById('game-card').classList.add('hidden');
    document.getElementById('setup-card').classList.remove('hidden');
}

function terugNaarMenu() {
    document.getElementById('main-title').innerText = "Tournament Generator";
    document.getElementById('game-card').classList.remove('hidden');
    document.getElementById('setup-card').classList.add('hidden');
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() - 0.5)];
}

function genereerUniekePolytopiaBo3() {
    let bo3Games = [];
    let beschikbareMaps = [...POLYTOPIA_MAPS];
    let beschikbareStammen = [...POLYTOPIA_MANNETJES];

    for (let i = 1; i <= 3; i++) {
        let mapIndex = Math.floor(Math.random() * beschikbareMaps.length);
        let gekozenMap = beschikbareMaps.splice(mapIndex, 1)[0];

        let stamIndex = Math.floor(Math.random() * beschikbareStammen.length);
        let gekozenStam = beschikbareStammen.splice(stamIndex, 1)[0];

        bo3Games.push({ nr: i, map: gekozenMap, stam: gekozenStam });
    }
    return bo3Games;
}

function startTournament() {
    let players = Array.from(geselecteerdeSpelers);

    if (players.length < 3 || players.length > 16) {
        alert("Selecteer minimaal 3 en maximaal 16 spelers!");
        return;
    }

    let bracketSize = 4;
    if (players.length > 4 && players.length <= 8) bracketSize = 8;
    if (players.length > 8 && players.length <= 16) bracketSize = 16;

    players.sort(() => Math.random() - 0.5);

    let totalRounds = Math.log2(bracketSize);
    tournamentData = [];

    for (let r = 0; r < totalRounds; r++) {
        let matchCount = bracketSize / Math.pow(2, r + 1);
        let roundMatches = [];
        for (let m = 0; m < matchCount; m++) {
            let bo3Data = (gekozenGame === "Polytopia") ? genereerUniekePolytopiaBo3() : null;
            roundMatches.push({ 
                player1: null, 
                player2: null, 
                score1: "", 
                score2: "", 
                winner: null, 
                bo3: bo3Data,
                // NIEUW: Houdt individuele winst per game (1, 2, 3) bij voor Best Of 3
                p1Games: [false, false, false],
                p2Games: [false, false, false]
            });
        }
        tournamentData.push(roundMatches);
    }

    let playerIndex = 0;
    for (let i = 0; i < bracketSize; i += 2) {
        let matchIndex = i / 2;
        tournamentData[0][matchIndex].player1 = players[playerIndex] || "Free Pass 🌟";
        playerIndex++;
        tournamentData[0][matchIndex].player2 = players[playerIndex] || "Free Pass 🌟";
        playerIndex++;
    }

    berekenToernooiLogica();

    if (gekozenGame === "Polytopia") {
        document.getElementById('bracket-title').innerText = "⚔️ Battle for the Square";
    } else if (gekozenGame === "Rollo Rush") {
        document.getElementById('bracket-title').innerText = "🦔 Rollo Rush Distance Leaderboard";
    } else {
        document.getElementById('bracket-title').innerText = "Toernooi Schema";
    }

    document.getElementById('setup-card').classList.add('hidden');
    document.getElementById('bracket-card').classList.remove('hidden');

    renderBracket();
}

function berekenToernooiLogica() {
    let totalRounds = tournamentData.length;
    for (let r = 0; r < totalRounds; r++) {
        for (let m = 0; m < tournamentData[r].length; m++) {
            let match = tournamentData[r][m];
            if (match.winner) {
                stuurDoorNaarVolgendeRonde(r, m, match.winner);
            } 
            else if (match.player1 && match.player2) {
                if (match.player1 === "Free Pass 🌟" && match.player2 === "Free Pass 🌟") {
                    match.winner = "Free Pass 🌟";
                    stuurDoorNaarVolgendeRonde(r, m, "Free Pass 🌟");
                } 
                else if (match.player2 === "Free Pass 🌟") {
                    match.winner = match.player1;
                    stuurDoorNaarVolgendeRonde(r, m, match.player1);
                } 
                else if (match.player1 === "Free Pass 🌟") {
                    match.winner = match.player2;
                    stuurDoorNaarVolgendeRonde(r, m, match.player2);
                }
            }
        }
    }
}

function stuurDoorNaarVolgendeRonde(roundIndex, matchIndex, winnerName) {
    if (roundIndex < tournamentData.length - 1) {
        const nextRoundIndex = roundIndex + 1;
        const nextMatchIndex = Math.floor(matchIndex / 2);
        if (matchIndex % 2 === 0) {
            tournamentData[nextRoundIndex][nextMatchIndex].player1 = winnerName;
        } else {
            tournamentData[nextRoundIndex][nextMatchIndex].player2 = winnerName;
        }
    }
}

// Wordt aangeroepen bij een normale klik op een speler (buiten BO3 om)
function selectWinner(roundIndex, matchIndex, winnerName) {
    if (gekozenGame === "Rollo Rush" || gekozenGame === "Polytopia") return; 

    let oudeWinnaar = tournamentData[roundIndex][matchIndex].winner;
    tournamentData[roundIndex][matchIndex].winner = winnerName;

    if (oudeWinnaar && oudeWinnaar !== winnerName) {
        wisOudeWinnaarInVolgendeRondes(roundIndex + 1, oudeWinnaar);
    }

    berekenToernooiLogica();
    renderBracket();

    if (roundIndex === tournamentData.length - 1 && winnerName && winnerName !== "Free Pass 🌟") {
        toonWinnaarPopup(winnerName);
    }
}

// NIEUW: Verwerkt het individueel aanklikken van de sub-games binnen een BO3
function selectBo3GameWinner(roundIndex, matchIndex, playerNum, gameIdx) {
    let match = tournamentData[roundIndex][matchIndex];
    let oudeWinnaar = match.winner;

    if (playerNum === 1) {
        match.p1Games[gameIdx] = !match.p1Games[gameIdx];
        if (match.p1Games[gameIdx]) match.p2Games[gameIdx] = false; // Tegenstander verliest die game automatisch
    } else {
        match.p2Games[gameIdx] = !match.p2Games[gameIdx];
        if (match.p2Games[gameIdx]) match.p1Games[gameIdx] = false; // Tegenstander verliest die game automatisch
    }

    // Tel wins
    let p1Wins = match.p1Games.filter(Boolean).length;
    let p2Wins = match.p2Games.filter(Boolean).length;

    // Wie het eerst 2 wins haalt wint de match
    if (p1Wins >= 2) {
        match.winner = match.player1;
    } else if (p2Wins >= 2) {
        match.winner = match.player2;
    } else {
        match.winner = null;
    }

    if (oudeWinnaar && oudeWinnaar !== match.winner) {
        wisOudeWinnaarInVolgendeRondes(roundIndex + 1, oudeWinnaar);
    }

    berekenToernooiLogica();
    renderBracket();

    if (roundIndex === tournamentData.length - 1 && match.winner && match.winner !== "Free Pass 🌟" && !oudeWinnaar) {
        setTimeout(() => {
            if (tournamentData[roundIndex][matchIndex].winner === match.winner) {
                toonWinnaarPopup(match.winner);
            }
        }, 400);
    }
}

function updateScore(roundIndex, matchIndex, playerNum, value) {
    let match = tournamentData[roundIndex][matchIndex];
    let oudeWinnaar = match.winner;

    if (playerNum === 1) match.score1 = value;
    if (playerNum === 2) match.score2 = value;

    let s1 = parseFloat(match.score1);
    let s2 = parseFloat(match.score2);

    if (!isNaN(s1) && !isNaN(s2)) {
        if (s1 > s2) {
            match.winner = match.player1;
        } else if (s2 > s1) {
            match.winner = match.player2;
        } else {
            match.winner = null; 
        }
    } else {
        match.winner = null;
    }

    if (oudeWinnaar && oudeWinnaar !== match.winner) {
        wisOudeWinnaarInVolgendeRondes(roundIndex + 1, oudeWinnaar);
    }

    berekenToernooiLogica();
    
    setTimeout(() => {
        let activeId = document.activeElement.id;
        renderBracket();
        if (activeId) {
            let el = document.getElementById(activeId);
            if (el) {
                el.focus();
                let val = el.value;
                el.value = '';
                el.value = val;
            }
        }
    }, 50);

    if (roundIndex === tournamentData.length - 1 && match.winner && match.winner !== "Free Pass 🌟" && !oudeWinnaar) {
        setTimeout(() => {
            if (tournamentData[roundIndex][matchIndex].winner === match.winner) {
                toonWinnaarPopup(match.winner);
            }
        }, 1000);
    }
}

function toonWinnaarPopup(naam) {
    document.getElementById('champion-name').innerText = naam;
    if (gekozenGame === "Polytopia") {
        document.getElementById('winner-text').innerText = "Gefeliciteerd! Je hebt de Best of 3 gewonnen, het Square veroverd en heerst over alle stammen! 🌌";
    } else if (gekozenGame === "Rollo Rush") {
        document.getElementById('winner-text').innerText = "Gefeliciteerd! Met een legendarische afstand rol jij iedereen naar huis en ben je de absolute Rollo Rush Koning! 🦔⚡";
    } else {
        document.getElementById('winner-text').innerText = "Gefeliciteerd! Jij bent de absolute koning van het toernooi.";
    }
    document.getElementById('winner-overlay').classList.remove('hidden');
}

function sluitWinnaarPopup() {
    document.getElementById('winner-overlay').classList.add('hidden');
}

function wisOudeWinnaarInVolgendeRondes(startRound, naamOmTeWissen) {
    for (let r = startRound; r < tournamentData.length; r++) {
        for (let m = 0; m < tournamentData[r].length; m++) {
            let match = tournamentData[r][m];
            if (match.player1 === naamOmTeWissen) { match.player1 = null; match.winner = null; match.score1 = ""; match.score2 = ""; match.p1Games = [false,false,false]; match.p2Games = [false,false,false]; }
            if (match.player2 === naamOmTeWissen) { match.player2 = null; match.winner = null; match.score1 = ""; match.score2 = ""; match.p1Games = [false,false,false]; match.p2Games = [false,false,false]; }
            if (match.winner === naamOmTeWissen) { match.winner = null; }
        }
    }
}

function renderBracket() {
    const container = document.getElementById('rounds-container');
    container.innerHTML = '';

    tournamentData.forEach((round, roundIndex) => {
        const roundDiv = document.createElement('div');
        roundDiv.classList.add('round');

        let roundName = `Ronde ${roundIndex + 1}`;
        if (roundIndex === tournamentData.length - 1) roundName = "🏆 Finale";
        else if (roundIndex === tournamentData.length - 2) roundName = "Halve Finale";
        else if (roundIndex === tournamentData.length - 3) roundName = "Kwartfinale";

        const title = document.createElement('div');
        title.classList.add('round-title');
        title.innerText = roundName;
        roundDiv.appendChild(title);

        round.forEach((match, matchIndex) => {
            if (match.player1 === "Free Pass 🌟" && match.player2 === "Free Pass 🌟") {
                return; 
            }

            const matchDiv = document.createElement('div');
            matchDiv.classList.add('match');

            if (gekozenGame === "Polytopia" && match.player1 && match.player2 && match.player1 !== "Free Pass 🌟" && match.player2 !== "Free Pass 🌟") {
                const bo3Box = document.createElement('div');
                bo3Box.classList.add('polytopia-bo3-box');
                
                let gamesHTML = `<div class="bo3-title">⚔️ Best of 3 Setup</div>`;
                match.bo3.forEach(g => {
                    gamesHTML += `
                        <div class="bo3-game">
                            <span class="game-number">G${g.nr}</span>
                            <div class="game-details">
                                <span class="map-text">🗺️ ${g.map}</span>
                                <span class="tribe-text">👥 Beide spelers: <strong>${g.stam}</strong></span>
                            </div>
                        </div>`;
                });
                
                bo3Box.innerHTML = gamesHTML;
                matchDiv.appendChild(bo3Box);
            }

            const p1Slot = createPlayerSlot(match, match.player1, match.winner, () => selectWinner(roundIndex, matchIndex, match.player1), roundIndex, matchIndex, 1, match.score1);
            const p2Slot = createPlayerSlot(match, match.player2, match.winner, () => selectWinner(roundIndex, matchIndex, match.player2), roundIndex, matchIndex, 2, match.score2);

            matchDiv.appendChild(p1Slot);
            matchDiv.appendChild(p2Slot);
            roundDiv.appendChild(matchDiv);
        });

        if (roundDiv.children.length > 0) {
            container.appendChild(roundDiv);
        }
    });
}

function createPlayerSlot(match, playerName, winnerName, clickEvent, roundIndex, matchIndex, playerNum, scoreValue) {
    const slot = document.createElement('div');
    slot.classList.add('player-slot');

    if (playerName === "Free Pass 🌟") {
        slot.classList.add('loser');
        slot.innerText = "Vrijstelling (Free Pass) 🌟";
        return slot;
    }

    const nameSpan = document.createElement('span');
    nameSpan.innerText = playerName || "Nog onbekend";
    slot.appendChild(nameSpan);

    if (playerName && winnerName) {
        if (playerName === winnerName) {
            slot.classList.add('winner');
            nameSpan.innerHTML = `${playerName} <span class="crown">👑</span>`;
        } else {
            slot.classList.add('loser');
        }
    }

    // VOOR ROLLO RUSH MODE: Score inputs tonen
    if (gekozenGame === "Rollo Rush" && playerName && playerName !== "Nog onbekend") {
        const scoreInput = document.createElement('input');
        scoreInput.type = "number";
        scoreInput.id = `score-${roundIndex}-${matchIndex}-${playerNum}`;
        scoreInput.classList.add('score-input');
        scoreInput.placeholder = "Score";
        scoreInput.value = scoreValue || "";
        
        scoreInput.onclick = (e) => e.stopPropagation();
        scoreInput.oninput = (e) => updateScore(roundIndex, matchIndex, playerNum, e.target.value);
        
        slot.appendChild(scoreInput);
    } 
    // VOOR POLYTOPIA MODE: Best of 3 sub-ronde verdeling knopjes toevoegen
    else if (gekozenGame === "Polytopia" && playerName && playerName !== "Nog onbekend" && match.player1 && match.player2 && match.player1 !== "Free Pass 🌟" && match.player2 !== "Free Pass 🌟") {
        const dotContainer = document.createElement('div');
        dotContainer.classList.add('bo3-dot-container');

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.classList.add('bo3-dot');
            dot.innerText = `G${i+1}`;
            
            // Controleer of deze game als gewonnen staat aangevinkt
            let isChecked = (playerNum === 1) ? match.p1Games[i] : match.p2Games[i];
            if (isChecked) {
                dot.classList.add('checked');
            }

            dot.onclick = (e) => {
                e.stopPropagation(); // Voorkomt dat de hele balk getriggerd wordt
                selectBo3GameWinner(roundIndex, matchIndex, playerNum, i);
            };
            dotContainer.appendChild(dot);
        }
        slot.appendChild(dotContainer);
    } 
    // STANDAARD TOERNOOI KLIKBAARHEID
    else if (gekozenGame !== "Rollo Rush" && gekozenGame !== "Polytopia" && playerName && playerName !== "Nog onbekend") {
        slot.onclick = clickEvent;
    }

    return slot;
}

function resetTournament() {
    sluitWinnaarPopup();
    
    laadVriendenKnoppen(); 
    document.getElementById('custom-player-input').value = '';

    document.getElementById('bracket-card').classList.add('hidden');
    document.getElementById('setup-card').classList.add('hidden');
    document.getElementById('game-card').classList.remove('hidden');
    document.getElementById('main-title').innerText = "Tournament Generator";
}
