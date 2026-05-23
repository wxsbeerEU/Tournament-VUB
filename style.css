:root {
    --bg-color: #0f172a;
    --card-bg: #1e293b;
    --accent-color: #f59e0b; /* Goud/Oranje voor toernooi */
    --accent-gradient: linear-gradient(135deg, #f59e0b, #d97706);
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --match-bg: #334155;
    --winner-color: #10b981; /* Groen voor winnaar */
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-main);
    margin: 0;
    padding: 16px;
    display: flex;
    justify-content: center;
    min-height: 100vh;
    box-sizing: border-box;
}

.app-container {
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

h1 {
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 5px;
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.card {
    background: var(--card-bg);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.subtitle {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-top: -5px;
    margin-bottom: 15px;
}

textarea {
    width: 100%;
    height: 80px;
    background: #0f172a;
    border: 1px solid #475569;
    border-radius: 10px;
    color: white;
    padding: 10px;
    font-size: 1rem;
    resize: none;
    box-sizing: border-box;
}

button {
    width: 100%;
    background: var(--accent-gradient);
    border: none;
    color: white;
    padding: 12px;
    font-size: 1rem;
    font-weight: 700;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 15px;
    transition: transform 0.2s;
}

button:active {
    transform: scale(0.98);
}

.hidden { display: none !important; }

.bracket-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.reset-btn {
    width: auto;
    margin: 0;
    padding: 6px 12px;
    font-size: 0.8rem;
    background: #475569;
}

/* Bracket Layout */
.rounds-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.round {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.round-title {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--accent-color);
    border-bottom: 1px solid #334155;
    padding-bottom: 5px;
}

.match {
    background: var(--match-bg);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.player-slot {
    padding: 12px 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.2s;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.player-slot:last-child {
    border-bottom: none;
}

.player-slot:hover {
    background: rgba(255, 255, 255, 0.05);
}

.player-slot.winner {
    background: rgba(16, 185, 129, 0.2);
    color: var(--winner-color);
}

.player-slot.loser {
    opacity: 0.4;
}

.crown {
    font-size: 1.1rem;
}

/* Kampioens Pop-up Styling */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    padding: 20px;
    box-sizing: border-box;
}

.winner-card {
    background: #1e293b;
    border: 2px solid var(--accent-color);
    border-radius: 24px;
    padding: 30px;
    text-align: center;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}

.confetti {
    font-size: 2rem;
    margin-bottom: 10px;
}

.champion-badge {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.2));
    border: 1px solid var(--accent-color);
    border-radius: 16px;
    padding: 20px;
    margin: 20px 0;
}

.big-crown {
    font-size: 3rem;
    display: block;
    animation: bounce 1s infinite alternate;
}

@keyframes bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-10px); }
}

#champion-name {
    margin: 10px 0 0 0;
    font-size: 2.2rem;
    color: white;
    -webkit-text-fill-color: initial;
    background: none;
    text-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
}

.celebrate-btn {
    background: #475569;
    margin-top: 20px;
}

.restart-btn {
    background: var(--accent-gradient);
    margin-top: 10px;
}
