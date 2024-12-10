const board = document.getElementById("game-board");
const cards = Array(16).fill(null).map((_, i) => i % 8);
cards.sort(() => Math.random() - 0.5);

let flippedCards = [];
cards.forEach((value, i) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.value = value;
  card.addEventListener("click", () => flipCard(card));
  board.appendChild(card);
});

function flipCard(card) {
  if (card.classList.contains("flipped") || flippedCards.length === 2) return;
  card.textContent = card.dataset.value;
  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    const [first, second] = flippedCards;
    if (first.dataset.value === second.dataset.value) {
      flippedCards = [];
    } else {
      setTimeout(() => {
        first.textContent = "";
        second.textContent = "";
        first.classList.remove("flipped");
        second.classList.remove("flipped");
        flippedCards = [];
      }, 1000);
    }
  }
}
