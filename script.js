let tournamentData = [];

function startTournament() {
    const input = document.getElementById('player-input').value;
    // Splits namen op komma's en haal spaties weg
    let players = input.split(',').map(name => name.trim()).filter(name => name !== "");

    if (players.length !== 4 && players.length !== 8) {
        alert("Voer exact 4 of 8 spelers in voor een perfecte bracket!");
        return;
    }

    // 1. Shuffle de spelers (Random volgorde)
    players.sort(() => Math.random() - 0.5);

    // 2. Bereken hoeveel rondes we hebben (4 spelers = 2 rondes, 8 spelers = 3 rondes)
    let totalRounds = Math.log2(players.length);
    tournamentData = [];

    // Bouw de lege rondes op
    for (let r = 0; r < totalRounds; r++) {
        let matchCount = players.length / Math.pow(2, r + 1);
        let roundMatches = [];
        for (let m = 0; m < matchCount; m++) {
            roundMatches.push({ player1: null, player2: null, winner: null });
        }
        tournamentData.push(roundMatches);
    }

    // Vul de allereerste ronde met de geshuffelde spelers
    for (let i = 0; i < players.length; i += 2) {
        let matchIndex = i / 2;
        tournamentData[0][matchIndex].player1 = players[i];
        tournamentData[0][matchIndex].player2 = players[i + 1] || "BYE";
    }

    // Wissel van kaart in de UI
    document.getElementById('setup-card').classList.add('hidden');
    document.getElementById('bracket-card').classList.remove('hidden');

    renderBracket();
}

function renderBracket() {
    const container = document.getElementById('rounds-container');
    container.innerHTML = '';

    tournamentData.forEach((round, roundIndex) => {
        const roundDiv = document.createElement('div');
        roundDiv.classList.add('round');

        // Bepaal de naam van de ronde
        let roundName = `Ronde ${roundIndex + 1}`;
        if (roundIndex === tournamentData.length - 1) roundName = "🏆 Finale";
        else if (roundIndex === tournamentData.length - 2) roundName = "Halve Finale";

        const title = document.createElement('div');
        title.classList.add('round-title');
        title.innerText = roundName;
        roundDiv.appendChild(title);

        round.forEach((match, matchIndex) => {
            const matchDiv = document.createElement('div');
            matchDiv.classList.add('match');

            // Speler 1 Slot
            const p1Slot = createPlayerSlot(match.player1, match.winner, () => selectWinner(roundIndex, matchIndex, match.player1));
            // Speler 2 Slot
            const p2Slot = createPlayerSlot(match.player2, match.winner, () => selectWinner(roundIndex, matchIndex, match.player2));

            matchDiv.appendChild(p1Slot);
            matchDiv.appendChild(p2Slot);
            roundDiv.appendChild(matchDiv);
        });

        container.appendChild(roundDiv);
    });
}

function createPlayerSlot(playerName, winnerName, clickEvent) {
    const slot = document.createElement('div');
    slot.classList.add('player-slot');
    slot.innerText = playerName || "Nog onbekend";

    if (playerName && winnerName) {
        if (playerName === winnerName) {
            slot.classList.add('winner');
            slot.innerHTML = `<span>${playerName}</span> <span class="crown">👑</span>`;
        } else {
            slot.classList.add('loser');
        }
    }

    // Je kunt alleen klikken als er een speler bekend is en er nog geen winnaar is geklikt
    if (playerName && !winnerName && playerName !== "Nog onbekend") {
        slot.onclick = clickEvent;
    }

    return slot;
}

function selectWinner(roundIndex, matchIndex, winnerName) {
    // Zet de winnaar in de huidige match
    tournamentData[roundIndex][matchIndex].winner = winnerName;

    // Als dit NIET de finale was, stuur de winnaar door naar de volgende ronde
    if (roundIndex < tournamentData.length - 1) {
        const nextRoundIndex = roundIndex + 1;
        const nextMatchIndex = Math.floor(matchIndex / 2);
        
        // Bepaal of de speler slot 1 of slot 2 wordt in de volgende wedstrijd
        if (matchIndex % 2 === 0) {
            tournamentData[nextRoundIndex][nextMatchIndex].player1 = winnerName;
        } else {
            tournamentData[nextRoundIndex][nextMatchIndex].player2 = winnerName;
        }
    }

    renderBracket();
}

function resetTournament() {
    document.getElementById('player-input').value = '';
    document.getElementById('setup-card').classList.remove('hidden');
    document.getElementById('bracket-card').classList.add('hidden');
}
