// On recupere l'ID du produit en faisant un searchParams.get
const param = new URL(window.location.href).searchParams
const id = param.get("id")

async function getProduct() {
    const response = await fetch(`http://localhost:3000/api/products/${id}`)
    const product = await response.json()
    return product
}

const prd = await getProduct();

// Mise en place de l'HTML en js
document.title = `${prd.name}`
document.querySelector(".item__img").innerHTML = `<img src="${prd.imageUrl}" alt="${prd.altTxt}">`
document.querySelector("#title").innerHTML = `${prd.name}`
document.querySelector("#price").innerHTML = `${prd.price}`
document.querySelector("#description").innerHTML = `${prd.description}`

// On recupère une couleur parmis toutes les couleurs du produit et on met en place l'HTML
prd.colors.forEach(color => {
    document.querySelector("#colors").innerHTML += `<option value="${color}">${color}</option>`
})



// Au clic du bouton 'Ajouter au panier' on crée un objet qui possède 
// une quantité, une couleur et un ID
document.querySelector("#addToCart").addEventListener("click", function() {
    
    const color = document.querySelector("#colors")
    const quantity = document.querySelector("#quantity")
    const quantityParsed = parseInt(`${quantity.value}`)
    const product = {
        id : id,
        color : color.value,
        quantity : quantityParsed
    }

    // Si la quantité est = 0 on veut un message d'erreur
    
    // Quantité
    if(quantityParsed == 0){
        alert("Veuillez choisir une quantité")
        return
    }
    // Si la couleur n'a pas été choisie on veut un message d'erreur

    // Couleur
    if(color.value == "") {
        alert("Veuillez choisir une couleur")
        return
    }

    // On veut récuperer un élement du local storage (panier)
    let panierString = localStorage.getItem("products")

    // On utilise parse pour le remettre sous forme d'objet afin de le transformer en Array
    let panier = JSON.parse(panierString)

    // Si le localStorage est vide on crée un Array(vide)
    if(panier === null) {
        panier = [];
    }

    // On cherche le produit récupéré pour savoir s'il est dejà présent dans le localStorage
    let productFound = panier.find(prd => prd.id == product.id && prd.color == product.color)


    if(productFound == undefined) {     // Si le produit n'a pas été retrouvé, il n'est pas dans le panier
        panier.push(product);           //Dans ce cas on l'ajoute au panier
    } else {                            // S'il a été retrouvé, il aura une valeur déja défini, on augmentera donc sa quantité
        productFound.quantity = productFound.quantity + quantityParsed;
    }

    // On a un panier avec un nouveau produit ou une quantité en plus, on la remet sous forme chaine de caractere et on l'ajoute au localStorage
    panierString = JSON.stringify(panier) 
    localStorage.setItem("products", panierString)
    
})

