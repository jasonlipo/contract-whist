# Contract Whist
An open-source online version of the popular Contract Whist

https://whist.jasonlipowicz.tech

### Rules

Up to 5 players can join a game.

Players start by being dealt 10 cards each. In turn, they bid for the number of tricks they will win out of 10. The total number of bids cannot equal the number of cards each player has.

The player who bids the highest (or first if more than one player bid the same) chooses the trump suit (or no trumps).

The round begins according to regular whist rules. The first bidder plays a card and all other plays must follow suit if they have a card of the same suit. If they do not, they can decide to play any card they like. The winner of the trick is the player who dealt the highest value of the leading suit. If there are any trump cards played, they steal the trick and take the win.

At the end of the 10 rounds, the scores are worked out based on the number of cards and the players' bids:
- If the number of tricks they won equals their bid, they receive:
  - `round_down(number of cards in this round / 2)` points if their bid was 0 and the sum of all bids was greater than the number of cards in the round
  - `round_up(number of cards in this round / 2)` points if their bid was 0 and the sum of all bids was less than the number of cards in the round
  - `(number of cards in this round + their bid)` points if their bid was greater than 0
- If the number of tricks they won does not equal their bid, they receive `- abs(number of tricks won - their bid)` points

The round is now over, and repeats again. This time, the number of cards per round decreases by 1, the first player to bid moves round the table and the play continues as above.

Once the round with 2 cards each finishes, the number of cards starts to increase.

The game is over when the second round of 10 cards finishes.

### Local development
#### Set up
```
git clone git@github.com:jasonlipo/contract-whist.git
cd contract-whist
npm install
cd react
npm install
```

#### Running the back-end server
```
cd /path/to/contact-whist
npm run dev-be
```

#### Running the front-end server
```
cd /path/to/contact-whist
npm run dev-fe
```

### Deploy to production
#### Build and serve
```
cd /path/to/contact-whist
npm run prod
```

Deploy the `build` folder to a web server and serve on port `3000`