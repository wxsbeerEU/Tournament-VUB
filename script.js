let tournamentData = [];

function startTournament() {
    const input = document.getElementById('player-input').value;
    // Splits namen op komma's en haal spaties weg
    let players = input.split(',').map(name => name.trim()).filter(name => name !== "");

    if (players.length < 3 || players.length > 16) {
        alert("Voer minimaal 3 en maximaal 16 spelers in!");
        return;
    }

    // 1. Bereken de benodigde bracket-grootte (volgende macht van 2: 4, 8 of 16)
    let bracketSize = 4;
    if (players.length > 4 && players.length <= 8) bracketSize = 8;
    if (players.length > 8 && players.length <= 16) bracketSize = 16;

    // 2. Shuffle de echte spelers (Random volgorde)
    players.sort(() => Math.random() - 0.5);

    // 3. Bereken het aantal rondes
    let totalRounds = Math.log2(bracketSize);
    tournamentData = [];

    // Bouw de lege structuur voor alle rondes op
    for (let r = 0; r < totalRounds; r++) {
        let matchCount = bracketSize / Math.pow(2, r + 1);
        let roundMatches = [];
        for (let m = 0; m < matchCount; m++) {
            roundMatches.push({ player1: null, player2: null, winner: null });
        }
        tournamentData.push(roundMatches);
    }

    // 4. Vul de allereerste ronde in met spelers en vul aan met "Free Pass 🌟"
    let playerIndex = 0;
    for (let i = 0; i < bracketSize; i += 2) {
        let matchIndex = i / 2;
        
        // Verdeel de echte spelers of geef een Free Pass als de spelers op zijn
        tournamentData[0][matchIndex].player1 = players[playerIndex] || "Free Pass 🌟";
        playerIndex++;
        tournamentData[0][matchIndex].player2 = players[playerIndex] || "Free Pass 🌟";
        playerIndex++;

        // AUTOMATISCHE DOORSTROOM ALS ER EEN FREE PASS IS
        // Als speler 2 een Free Pass is, wint speler 1 automatisch
        if (tournamentData[0][matchIndex].player2 === "Free Pass 🌟" && tournamentData[0][matchIndex].player1 !== "Free Pass 🌟") {
            tournamentData[0][matchIndex].winner = tournamentData[0][matchIndex].player1;
            stuurDoorNaarVolgendeRonde(0, matchIndex, tournamentData[0][matchIndex].player1);
        }
        // Als speler 1 een Free Pass is (omdat je bv. heel weinig spelers hebt), wint speler 2 automatisch
        else if (tournamentData[0][matchIndex].player1 === "Free Pass 🌟" && tournamentData[0][matchIndex].player2 !== "Free Pass 🌟") {
            tournamentData[0][matchIndex].winner = tournamentData[0][matchIndex].player2;
            stuurDoorNaarVolgendeRonde(0, matchIndex, tournamentData[0][matchIndex].player2);
        }
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

        // Dynamische titels voor de rondes
        let roundName = `Ronde ${roundIndex + 1}`;
        if (roundIndex === tournamentData.length - 1) roundName = "🏆 Finale";
        else if (roundIndex === tournamentData.length - 2) roundName = "Halve Finale";
        else if (roundIndex === tournamentData.length - 3) roundName = "Kwartfinale";

        const title = document.createElement('div');
        title.classList.add('round-title');
        title.innerText = roundName;
        roundDiv.appendChild(title);

        round.forEach((match, matchIndex) => {
            const matchDiv = document.createElement('div');
            matchDiv.classList.add('match');

            const p1Slot = createPlayerSlot(match.player1, match.winner, () => selectWinner(roundIndex, matchIndex, match.player1));
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

    // Als het een Free Pass is, geef het een aparte styling/layout
    if (playerName === "Free Pass 🌟") {
        slot.classList.add('loser'); // Maakt het een beetje lichter/minder opvallend
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

    // Alleen klikbaar als de speler bekend is, geen Free Pass is en er nog geen winnaar is
    if (playerName && !winnerName && playerName !== "Nog onbekend") {
        slot.onclick = clickEvent;
    }

    return slot;
}

function selectWinner(roundIndex, matchIndex, winnerName) {
    // Handmatige klik op een winnaar
    tournamentData[roundIndex][matchIndex].winner = winnerName;
    stuurDoorNaarVolgendeRonde(roundIndex, matchIndex, winnerName);
    renderBracket();
}

function stuurDoorNaarVolgendeRonde(roundIndex, matchIndex, winnerName) {
    // Als dit NIET de finale was, stuur de winnaar door
    if (roundIndex < tournamentData.length - 1) {
        const nextRoundIndex = roundIndex + 1;
        const nextMatchIndex = Math.floor(matchIndex / 2);
        
        if (matchIndex % 2 === 0) {
            tournamentData[nextRoundIndex][nextMatchIndex].player1 = winnerName;
        } else {
            tournamentData[nextRoundIndex][nextMatchIndex].player2 = winnerName;
        }

        // EXTRA CHECK: Als de winnaar in de VOLGENDE ronde tegen een "Free Pass 🌟" moet (gebeurt bij specifieke aantallen), stroomt hij nóg een ronde door
        let volgendeMatch = tournamentData[nextRoundIndex][nextMatchIndex];
        if (volgendeMatch.player1 && volgendeMatch.player2) {
            if (volgendeMatch.player1 === "Free Pass 🌟" || volgendeMatch.player2 === "Free Pass 🌟") {
                let echteWinnaar = volgendeMatch.player1 === "Free Pass 🌟" ? volgendeMatch.player2 : volgendeMatch.player1;
                volgendeMatch.winner = echteWinnaar;
                stuurDoorNaarVolgendeRonde(nextRoundIndex, nextMatchIndex, echteWinnaar);
            }
        }
    }
}

function resetTournament() {
    document.getElementById('player-input').value = '';
    document.getElementById('setup-card').classList.remove('hidden');
    document.getElementById('bracket-card').classList.add('hidden');
}
