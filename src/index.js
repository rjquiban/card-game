import React from 'react';
import ReactDOM from 'react-dom';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deckData: [],
      deckId: null,
      // storing just the name; data is held in api fetch request
      player1Cards: "p1cards",
      player2Cards: "p2cards",
      ocean: "ocean",
      // Initialize scores to 0-0
    };
  }
  
  async renderDeck() {
    this.state.deckData = await this.fetchDeck();
    this.state.deckId = this.state.deckData.deck_id;
    console.log("Deck data:")
    console.log(this.state.deckData);
    console.log("Deck id: " + this.state.deckId);

    //i think this bit of code is wrong
    this.renderPile(this.state.player1Cards, 7);
  }

  async fetchDeck() {
    try {
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1', {
        method: 'GET',
        credentials: 'same-origin'
      });
      const deck = await response.json();
      return deck;
    } catch (error) {
      console.log(error);
    }
  }

  async renderPile(pile, num) {
    let cardsDrawn = await this.drawCards(num);
    console.log("CardsDrawn: ");
    console.log(cardsDrawn);
    let cards = [];

    for(let i = 0; i < cardsDrawn.cards.length; i++) {
      cards.push(cardsDrawn.cards[i].code);
    }

    console.log("Cards: " + cards);
    this.addToPile(pile, cards);
    // .then(this.listPile(pile));
  }

  async drawCards(num) {
    try {
      const response = await fetch('https://deckofcardsapi.com/api/deck/' + this.state.deckId + '/draw/?count=' + num, {
        method: 'GET',
        credentials: 'same-origin'
      });
      const cards = await response.json();
      return cards;
    } catch (error) {
      console.log(error);
    }
  }

  async addToPile(pile, cards) {
    try {
      const response = await fetch('https://deckofcardsapi.com/api/deck/' + this.state.deckId + '/pile/' + pile +'/add/?cards=' + cards, {
        method: 'GET',
        credentials: 'same-origin'
      });
      const createdPile = await response.json();
      return createdPile;
    } catch (error) {
      console.log(error);
    }
  }

  async listPile(pile) {
    try {
      const response = await fetch("https://deckofcardsapi.com/api/deck/"+ this.state.deckId +"/pile/" + pile + "/list/", {
        method: 'GET',
        credentials: 'same-origin',
      });
      const cardPile = await response.json();
      return cardPile;
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.renderDeck();
  }
  
  render() {
    return(
      <h1>Go-Fish</h1>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);  