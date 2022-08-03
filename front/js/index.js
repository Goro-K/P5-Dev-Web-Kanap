const url = "http://localhost:3000/api/products"

async function getProducts() {
    // Récuperation de la liste des produits avec la méthode fetch
    const response = await fetch(url)
    const data = await response.json()
    return data
}

// stocker le résultat de la promesse = un tableau de produit

const products = await getProducts()


// Pour parcourir les donnée de resultat on crée une boucle
products.forEach(product => {
    // on utilise innerHTML += ' ' pour ne pas perdre l'itération précédente
    document.querySelector(".items").innerHTML +=
    `<a href= "product.html?id=${product._id}"> 
    <article>
    <img src="${product.imageUrl}" alt="${product.altTxt}"> 
    <h3 class="productName">${product.name}</h3> 
    <p class="productDescription">${product.description}</p>
    </article>
    </a>`
})