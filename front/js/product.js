let params = new URL(window.location).searchParams;
let id = params.get("id");
console.log(id)


async function listId() {
    // Récuperation de la liste des produits avec la méthode fetch
    const response = await fetch("http://localhost:3000/api/products/_id")
    const products = await response.json()
    return products 
}