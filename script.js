import Grid from "./Grid.js"; // Importe la classe Grid
import Tile from "./Tile.js"; // Importe la classe Tile

const gameBoard = document.getElementById('game-board'); // Récupère l'élément game-board
const grid = new Grid(gameBoard); // Crée une instance de la classe Grid dans le html/css (Crée la grille du jeu)
console.log(grid.randomEmptyCell())
console.log(grid.cellsByColumn)
grid.randomEmptyCell().tile = new Tile(gameBoard) // Crée une cellule vide aléatoire
grid.randomEmptyCell().tile = new Tile(gameBoard) // Crée une cellule vide aléatoire (2eme cellule)

setupInput()

function setupInput(){
    window.addEventListener('keydown', handleInput, {once: true}) // Ajoute un écouteur si une touche est pressée
}

async function handleInput(e){ // Fonction qui gère l'input
    switch(e.key){ 
        case 'ArrowUp': // Si la touche est Up
            if(!canMoveUp()){
                setupInput()
                return
            }
            await moveUp(); // Fait bouger la grille vers le haut
            break;
        case 'ArrowDown': // Si la touche est Down
            if(!canMoveDown()){
                setupInput()
                return
            }
            await moveDown(); // Fait bouger la grille vers le bas
            break;
        case 'ArrowLeft': // Si la touche est Left
            if(!canMoveLeft()){
                setupInput()
                return
            }
            await moveLeft(); // Fait bouger la grille vers la gauche
            break;
        case 'ArrowRight': // Si la touche est Right
            if(!canMoveRight()){
                setupInput()
                return
            }
            await moveRight(); // Fait bouger la grille vers la droite
            break;
        default:
            setupInput() // Si aucune touche n'est pressée, relance l'écouteur
            return
    }

    grid.cells.forEach(cell => cell.mergeTiles()) // Fait fusionner les cellules

    const newTile = new Tile(gameBoard) // Crée une nouvelle cellule
    grid.randomEmptyCell().tile = newTile // Ajoute la nouvelle cellule dans une cellule vide aléatoire

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) { // Si il n'y a plus de cellule vide, on perd
        newTile.waitForTransition(true).then(() => {
            confirm('You lose!') // Affiche un message de perte
            location.reload() // Recharge la page
        })
        return
    } else {
        setupInput() // Sinon, relance l'écouteur
    }

}

function moveUp(){
    return slideTiles(grid.cellsByColumn)
}
function moveDown(){
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}
function moveLeft(){
    return slideTiles(grid.cellsByRow)
}
function moveRight(){
    return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles(cells) {
    return Promise.all(
     cells.flatMap(group => {
         const promises = []
         for (let i = 1; i < group.length; i++) {
             const cell = group[i]
             if (cell.tile == null) continue
             let lastValidCell
             for(let j = i - 1; j >= 0; j--){
                 const moveToCell = group[j]
                 if(!moveToCell.canAccept(cell.tile)) break
                 lastValidCell = moveToCell
            }

            if(lastValidCell != null){ // Est il possible de bouger la cellule ?
                promises.push(cell.tile.waitForTransition()) // Attend la transition de la cellule
                if(lastValidCell.tile != null){ // Est ce qu'on bouge là où il y a déjà une cellule ?
                    lastValidCell.mergeTile = cell.tile // Alors merge les deux cellules
                } else {
                    lastValidCell.tile = cell.tile //Sinon, bouge la cellule
                }
                cell.tile = null // Vide la cellule dans laquelle elle etait
            }

        }
        return promises
    }))
}

function canMoveUp(){
    return canMove(grid.cellsByColumn)
}
function canMoveDown(){
    return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}
function canMoveLeft(){
    return canMove(grid.cellsByRow)
}
function canMoveRight(){
    return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

function canMove(cell){
    return cell.some(group => {
        return group.some((cell, index) =>{
            if(index === 0) return false // Si la cellule est en haut, on ne peut pas bouger
            if (cell.tile == null) return false // Si la cellule est vide, on ne peut pas bouger
            const moveToCell = group[index - 1]
            return moveToCell.canAccept(cell.tile) // Si la cellule peut accepter la cellule, on peut bouger
        })
    })
}