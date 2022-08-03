// On recupere l'ID du produit en faisant un searchParams.get
const param = new URL(window.location.href).searchParams
const id = param.get("id")

console.log(id)

async function getProduct() {
    const response = await fetch(`http://localhost:3000/api/products/${id}`)
    const product = await response.json()
    return product
}

const prd = await getProduct();


document.title = `${prd.name}`
document.querySelector(".item__img").innerHTML = `<img src="${prd.imageUrl}" alt="${prd.altTxt}">`
document.querySelector("#title").innerHTML = `${prd.name}`
document.querySelector("#price").innerHTML = `${prd.price}`
document.querySelector("#description").innerHTML = `${prd.description}`

prd.colors.forEach(color => {
    document.querySelector("#colors").innerHTML += `<option value="${color}">${color}</option>`
})
