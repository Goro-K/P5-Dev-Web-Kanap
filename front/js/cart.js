// on recupere la liste des produits dans le panier et on la transforme pour recuperer un Array
let cart = JSON.parse(localStorage.getItem("products"));


cart.forEach(async product => {
  const response = await fetch(`http://localhost:3000/api/products/${product.id}`) // on veut faire un fetch pour chaque id recuperer
  const prd =  await response.json()

  document.querySelector('#cart__items').innerHTML += 
    `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
      <div class="cart__item__img">
        <img src="${prd.imageUrl}" alt="${prd.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${prd.name}</h2>
          <p>${product.color}</p>
          <p>${prd.price}</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>` 
});
  
// Modification d'un produit dans la page panier

document.querySelector(".cart__item__content__settings__quantity input").addEventListener("change", function() {
  originalSetItem()
})