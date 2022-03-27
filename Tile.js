export default class Tile{
    #tileElement
    #x
    #y
    #value

    constructor(tileContainer, value = Math.random() > .5 ? 2 : 4){ //
        this.#tileElement = document.createElement('div') // Crée un élément div
        this.#tileElement.classList.add('tile') // Ajoute la classe tile à l'élément div
        tileContainer.append(this.#tileElement) // Ajoute l'élément div dans le html/css
        this.value = value // Définit la valeur de la cellule
    }

    get value(){
        return this.#value // Retourne la valeur de la cellule
    }

    set value(v){
        this.#value = v // Définit la valeur de la cellule
        this.#tileElement.textContent = v // Change le contenu de la cellule
        const power = Math.log2(v)
        const backgroundLightness = 100 - power * 9 // Calcule la luminosité de la cellule en fonction de la valeur de la cellule
        this.#tileElement.style.setProperty('--background-lightness', `${backgroundLightness}%`) // Change la luminosité du background de la cellule
        this.#tileElement.style.setProperty('--text-lightness', `${backgroundLightness <= 50 ? 90 : 10}%`) // Change la luminosité du background de la cellule
    }

    set x(value){
        this.#x = value // Définit la position x de la cellule
        this.#tileElement.style.setProperty('--x', value) // Change la position x de la cellule
    }

    set y(value){
        this.#y = value // Définit la position y de la cellule
        this.#tileElement.style.setProperty('--y', value) // Change la position y de la cellule
    }

    remove(){
        this.#tileElement.remove() // Supprime l'élément div
    }

    waitForTransition( animation = false){
        return new Promise(resolve => {
            this.#tileElement.addEventListener(animation ? 'animationend' : 'transitionend', resolve, {once: true})
        })
    }
}
