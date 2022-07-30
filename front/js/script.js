async function listProducts() {
    const response = await fetch("http://localhost:3000/api/products")
    const products = await response.json()
    return products
}


const resultat = await listProducts()



resultat.forEach(product => {
    document.querySelector(".items").innerHTML +=
    `<a href= "${product._id}"> 
    <article>
    <img src="${product.imageUrl}" alt="${product.altTxt}"> 
    <h3 class="productName">"${product.name}"</h3> 
    <p class="productDescription">"${product.description}"</p>`
})
