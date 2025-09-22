import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS, and images)
app.use(express.static("public"));

let cars = [
  { id: 1, name: "Lamborghini Aventador", img: "/images/lambo.jpg", rating: 1400 },
  { id: 2, name: "Ferrari 488", img: "/images/ferrari.jpg", rating: 1400 },
  { id: 3, name: "Porsche 911", img: "/images/porsche.jpg", rating: 1400 },
  { id: 4, name: "Bugatti Chiron", img: "/images/bugatti.jpg", rating: 1400 }
];

// Pick two random cars
function getRandomCars() {
  let c1 = cars[Math.floor(Math.random() * cars.length)];
  let c2;
  do {
    c2 = cars[Math.floor(Math.random() * cars.length)];
  } while (c1.id === c2.id);
  return [c1, c2];
}

// Update Elo scores
function updateScores(winner, loser) {
  const K = 32;
  const expectedWin = 1 / (1 + Math.pow(10, (loser.rating - winner.rating) / 400));
  const expectedLose = 1 / (1 + Math.pow(10, (winner.rating - loser.rating) / 400));

  winner.rating += Math.round(K * (1 - expectedWin));
  loser.rating += Math.round(K * (0 - expectedLose));
}

// API Routes
app.get("/cars/random", (req, res) => {
  res.json(getRandomCars());
});

app.post("/vote", (req, res) => {
  const { winnerId, loserId } = req.body;
  const winner = cars.find(c => c.id === winnerId);
  const loser = cars.find(c => c.id === loserId);

  if (winner && loser) updateScores(winner, loser);

  res.json({ success: true });
});

app.get("/cars/leaderboard", (req, res) => {
  res.json([...cars].sort((a, b) => b.rating - a.rating));
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
