let rounds = 0;
const maxRounds = 10;
let gameOver = false;

async function loadCars() {
  if (gameOver) return;

  const res = await fetch("/cars/random");
  const data = await res.json();

  const c1 = data[0];
  const c2 = data[1];

  const container = document.getElementById("game");
  container.innerHTML = `
    <div class="car" onclick="vote(${c1.id}, ${c2.id})">
      <img src="${c1.img}" alt="${c1.name}">
      <h3>${c1.name}</h3>
    </div>
    <div class="car" onclick="vote(${c2.id}, ${c1.id})">
      <img src="${c2.img}" alt="${c2.name}">
      <h3>${c2.name}</h3>
    </div>
  `;
}

async function vote(winnerId, loserId) {
  if (gameOver) return;

  rounds++;

  // Get car details from backend leaderboard
  const resLB = await fetch("/cars/leaderboard");
  const leaderboard = await resLB.json();

  const winner = leaderboard.find(c => c.id === winnerId);
  const loser = leaderboard.find(c => c.id === loserId);

  if (winner.rating < loser.rating) {
    document.getElementById("status").innerHTML = "❌ Wrong choice! Game Over!";
    gameOver = true;
    showLeaderboard();
    return;
  }

  document.getElementById("status").innerHTML = "✅ Good choice!";

  // Update ratings in backend
  await fetch("/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ winnerId, loserId })
  });

  if (rounds >= maxRounds) {
    showLeaderboard();
    return;
  }

  loadCars();
}

async function showLeaderboard() {
  const res = await fetch("/cars/leaderboard");
  const leaderboard = await res.json();

  const lb = document.getElementById("leaderboard");
  lb.innerHTML = "<h2>Leaderboard</h2>" + leaderboard.map(
    (c, i) => `<p>#${i + 1}: ${c.name} - ${c.rating}</p>`
  ).join("");
}

// Start game on page load
loadCars();
