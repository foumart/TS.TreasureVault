# Treasure Vault mini game

### [Play Treasure Vault](https://foumartgames.com/games/TreasureVault/)

### How to play

Click and drag the vault handle to rotate it. The game can be solved with just one interaction, can you figure it out?

**Note**: I aimed for maximum realism in this game. Simply clicking left or right to rotate the vault handle by a single 60° step felt too cheap and simplistic to me. Instead, here you rotate the handle in one direction, and no matter how many interactions you make, the current secret code you're entering will be applied only after you start rotating in the opposite direction. This represents the behavior of real secret vault doors well enough in my opinion. I hope you enjoy the challenge!

### Setup

`npm install` - installs build dependencies.

### Commands:

-   `npm run dev` - builds the game for development into the `./public/` folder.
-   `npm run serve` - opens *localhost:9000* and starts watching for file changes in `./src/`.
-   `npm run start` - runs the two commands above together.
-   `npm run build` - builds the game for production.
