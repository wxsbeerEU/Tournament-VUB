let tournamentData = [];

function startTournament() {
    const input = document.getElementById('player-input').value;
    let players = input.split(',').map(name => name.trim()).filter(name => name !== "");

    if (players.length < 3 || players.length > 16) {
        alert("Voer minimaal 3 en maximaal 16 spelers in!");
        return;
    }

    // 1. Bepaal de bracket-grootte (4, 8 of 16)
    let bracketSize = 4;
    if (players.length > 4 && players.length <= 8) bracketSize = 8;
    if (players.length > 8 && players.length <= 16) bracketSize = 16;

    // 2. Hussel de echte spelers door elkaar
    players.sort(() => Math.random() - 0.5);

    // 3. Bouw de lege toernooi-structuur
    let totalRounds = Math.log2(bracketSize);
    tournamentData = [];

    for (let r = 0; r < totalRounds; r++) {
        let matchCount = bracketSize / Math.pow(2, r + 1);
        let roundMatches = [];
        for (let m = 0; m < matchCount; m++) {
            roundMatches.push({ player1: null, player2: null, winner: null });
        }
        tournamentData.push(roundMatches);
    }

    // 4. Deel de eerste ronde in met spelers of Free Passes
    let playerIndex = 0;
    for (let i = 0; i < bracketSize; i += 2) {
        let matchIndex = i / 2;
        tournamentData[0][matchIndex].player1 = players[playerIndex] || "Free Pass 🌟";
        playerIndex++;
        tournamentData[0][matchIndex].player2 = players[playerIndex] || "Free Pass 🌟";
        playerIndex++;
    }

    // 5. Bereken de automatische doorstroom van Free Passes
    berekenToernooiLogica();

    // Wissel van kaart in de UI
    document.getElementById('setup-card').classList.add('hidden');
    document.getElementById('bracket-card').classList.remove('hidden');

    renderBracket();
}

// Centrale functie die vanaf het begin (of na een klik) alle Free Passes en winnaars doorberekent
function berekenToernooiLogica() {
    let totalRounds = tournamentData.length;

    for (let r = 0; r < totalRounds; r++) {
        for (let m = 0; m < tournamentData[r].length; m++) {
            let match = tournamentData[r][m];

            // Als een match een winnaar heeft (handmatig of automatisch), stuur deze ALTIJD door
            if (match.winner) {
                stuurDoorNaarVolgendeRonde(r, m, match.winner);
            } 
            // Automatische logica voor Free Passes (alleen als er nog géén handmatige winnaar is gekozen)
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

function selectWinner(roundIndex, matchIndex, winnerName) {
    // Sla de OUDE winnaar op om te checken of we gewisseld zijn
    let oudeWinnaar = tournamentData[roundIndex][matchIndex].winner;
    
    // Zet de nieuwe winnaar vast
    tournamentData[roundIndex][matchIndex].winner = winnerName;

    // Als we gewisseld zijn van winnaar, moeten we alle data in de komende rondes die gekoppeld was aan de oude winnaar wissen!
    if (oudeWinnaar && oudeWinnaar !== winnerName) {
        wisOudeWinnaarInVolgendeRondes(roundIndex + 1, oudeWinnaar);
    }

    // Bereken het hele toernooi opnieuw vanaf de grond af aan met de nieuwe winnaar
    berekenToernooiLogica();
    renderBracket();
}

// Recursieve functie die de oude winnaar (en zijn overwinningen verderop) uit de bracket wist
function wisOudeWinnaarInVolgendeRondes(startRound, naamOmTeWissen) {
    for (let r = startRound; r < tournamentData.length; r++) {
        for (let m = 0; m < tournamentData[r].length; m++) {
            let match = tournamentData[r][m];
            
            if (match.player1 === naamOmTeWissen) {
                match.player1 = null;
                match.winner = null; // Reset de match winnaar als deze speler had gewonnen
            }
            if (match.player2 === naamOmTeWissen) {
                match.player2 = null;
                match.winner = null;
            }
            if (match.winner === naamOmTeWissen) {
                match.winner = null;
            }
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
            // Sla lege Free Pass matches over in de UI
            if (match.player1 === "Free Pass 🌟" && match.player2 === "Free Pass 🌟") {
                return; 
            }

            const matchDiv = document.createElement('div');
            matchDiv.classList.add('match');

            const p1Slot = createPlayerSlot(match.player1, match.winner, () => selectWinner(roundIndex, matchIndex, match.player1));
            const p2Slot = createPlayerSlot(match.player2, match.winner, () => selectWinner(roundIndex, matchIndex, match.player2));

            matchDiv.appendChild(p1Slot);
            matchDiv.appendChild(p2Slot);
            roundDiv.appendChild(matchDiv);
        });

        if (roundDiv.children.length > 1) {
            container.appendChild(roundDiv);
        }
    });
}

function createPlayerSlot(playerName, winnerName, clickEvent) {
    const slot = document.createElement('div');
    slot.classList.add('player-slot');
    slot.innerText = playerName || "Nog onbekend";

    if (playerName === "Free Pass 🌟") {
        slot.classList.add('loser');
        slot.innerText = "Vrijstelling (Free Pass) 🌟";
        return slot;
    }

    if (playerName && winnerName) {
        if (playerName === winnerName) {
            slot.classList.add('winner');
            slot.innerHTML = `<span>${playerName}</span> <span class="crown">👑</span>`;
        } else {
            slot.classList.add('loser');
        }
    }

    // REPARATIE: Je kunt nu ALTIJD klikken, zolang er een echte naam staat (ook al is er al een winnaar geselecteerd!)
    if (playerName && playerName !== "Nog onbekend") {
        slot.onclick = clickEvent;
    }

    return slot;
}

function resetTournament() {
    document.getElementById('player-input').value = '';
    document.getElementById('setup-card').classList.remove('hidden');
    document.getElementById('bracket-card').classList.add('hidden');
}
