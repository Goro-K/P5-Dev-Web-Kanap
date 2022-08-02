async function listProducts() {
    // Récuperation de la liste des produits avec la méthode fetch
    const response = await fetch("http://localhost:3000/api/products")
    const products = await response.json()
    return products
}

// stocker le résultat de la promesse = un tableau de produit

const resultat = await listProducts()


// Pour parcourir les donnée de resultat on crée une boucle
resultat.forEach(product => {
    // on utilise innerHTML += ' ' pour ne pas perdre l'itération précédente
    document.querySelector(".items").innerHTML +=
    `<a href= "${product._id}"> 
    <article>
    <img src="${product.imageUrl}" alt="${product.altTxt}"> 
    <h3 class="productName">"${product.name}"</h3> 
    <p class="productDescription">"${product.description}"</p>`
})