const GRID_SIZE = 4 // Définit la taille de la grille
const CELL_SIZE = 20 // Définit la taille de la cellule
const CELL_GAP = 2 // Définit l'espace entre les cellules

export default class Grid { 
  #cells  // Variable privée, ne peut être modifiée que dans la classe

  constructor(gridElement) { // Construit de la classe Grid
    gridElement.style.setProperty("--grid-size", GRID_SIZE) // Définit la taille de la grille dans le html/css
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`) // Définit la taille de la cellule dans le html/css
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`) // Définit l'espace entre les cellules dans le html/css
    this.#cells = createCellElements(gridElement).map((cellElement, index) => { 
      return new Cell(  // Crée une cellule
        cellElement,  // Cellule
        index % GRID_SIZE, // Position x de la cellule
        Math.floor(index / GRID_SIZE) // Position y de la cellule
      )
    })
  }

  get cells(){
    return this.#cells
  }

  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) =>{
      cellGrid[cell.x] = cellGrid[cell.x] || []
      cellGrid[cell.x][cell.y] = cell
      return cellGrid
    }, [])
  }

  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) =>{
      cellGrid[cell.y] = cellGrid[cell.y] || []
      cellGrid[cell.y][cell.x] = cell
      return cellGrid
    }, [])
  }

  get #emptyCells() {  // Retourne un array des cellules vides
    return this.#cells.filter(cell => cell.tile == null)
  }

  randomEmptyCell() {  // Retourne une cellule vide aléatoire
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)  // Retourne un nombre aléatoire entre 0 et le nombre de cellules vides
    return this.#emptyCells[randomIndex]; // Retourne la cellule aléatoire
  }
}

class Cell {  // Crée la classe Cell
  #cellElement // Variable privée, ne peut être modifiée que dans la classe
  #x // Variable privée, ne peut être modifiée que dans la classe
  #y // Variable privée, ne peut être modifiée que dans la classe
  #tile // Variable privée, ne peut être modifiée que dans la classe
  #mergeTile // Variables privées, ne peuvent être modifiées que dans la classe

  constructor(cellElement, x, y) { // Construit la classe Cell
    this.#cellElement = cellElement // Récupère l'élément cellElement
    this.#x = x // Récupère la position x
    this.#y = y // Récupère la position y
  }

  get x() { // Retourne la position x
    return this.#x
  }

  get y() { // Retourne la position y
    return this.#y
  }

  get tile() { // Retourne la variable privée
    return this.#tile
  }

  set tile(value) {
    this.#tile = value // Modifie la variable privée
    if (value == null) return // Si la valeur est null, retourne
    this.#tile.x = this.#x // Modifie la position x de la cellule
    this.#tile.y = this.#y // Modifie la position y de la cellule
  }

  get mergeTile() { // Retourne la variable privée
    return this.#mergeTile
  }

  set mergeTile(value) {
    this.#mergeTile = value // Modifie la variable privée
    if (value == null) return // Si la valeur est null, retourne
    this.#mergeTile.x = this.#x // Modifie la position x de la cellule
    this.#mergeTile.y = this.#y // Modifie la position y de la cellule
  }

  canAccept(tile) { // Retourne true si la cellule peut accepter la cellule
    return (this.tile == null || //S'il ny a pas de cellule, alors on peut en accepter une
      (this.mergeTile ==null && this.tile.value === tile.value) // Si un merge n'a pas lieu ET les deux cellules ont la même valeure, alors elles peuvent merge
      ) // Retourne true si la cellule est vide ou si la valeur de la cellule est égale à la valeur de la cellule
  }

  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return // Si la cellule est vide ou si la cellule est déjà merge, retourne
    this.tile.value = this.tile.value + this.mergeTile.value
    this.mergeTile.remove()
    this.mergeTile = null
  }
}

function createCellElements(gridElement) { 
  const cells = [] // Crée un array vide
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) { // Boucle pour créer les cellules
    const cell = document.createElement("div") // Crée une cellule
    cell.classList.add("cell") // Ajoute la classe cell
    cells.push(cell) // Ajoute la cellule dans l'array
    gridElement.append(cell) // Ajoute la cellule dans le html
  }
  return cells // Retourne l'array
}
