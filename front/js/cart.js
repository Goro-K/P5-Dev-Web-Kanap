// on recupere la liste des produits dans le panier et on la transforme pour recuperer un Array
let cart = JSON.parse(localStorage.getItem("products"));

let totalQuantity = 0; // A chaque boucle les quantités s'additionnent

let totalPrice = 0; // A chaque boucle les prix s'additionnent

for(const product of cart) {
  const response = await fetch(`http://localhost:3000/api/products/${product.id}`) // on veut faire un fetch pour chaque id recuperer
  const prd = await response.json()

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
                <input type="number" class="itemQuantity" data-id="${product.id}" data-color="${product.color}" name="itemQuantity" min="1" max="100" value="${product.quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem" data-id="${product.id}" data-color="${product.color}">Supprimer</p>
              </div>
            </div>
          </div>
        </article>`;

    /// la totalité des quantité de la boucle doivent s'additionner pour donner la quantité total
    totalQuantity = totalQuantity + product.quantity

    // La totalité des prix de la boucle doivent s'additionner pour donner la quantité total

    totalPrice = totalPrice + prd.price * product.quantity
};

// Modification du prix et quantité quand la page est recharger

document.querySelector("#totalPrice").innerHTML = totalPrice;
document.querySelector("#totalQuantity").innerHTML = totalQuantity;

// Fonction qui permet la modification du prix totale à la modification/suppression d'un produit
async function getTotalPrice() {
  totalPrice = 0;
  document.querySelector("#totalPrice").innerHTML = totalPrice
  cart.forEach(async (item) => {
    const response = await fetch(`http://localhost:3000/api/products/${item.id}`)
    const product = await response.json()

    totalPrice = totalPrice + product.price * item.quantity

    document.querySelector("#totalPrice").innerHTML = totalPrice;
    return
  })
}

// Fonction qui permet la modification de la quantité totale à la modification/suppression d'un produit

function getTotalQuantity() {
  totalQuantity = 0
  document.querySelector("#totalQuantity").innerHTML = totalQuantity;
  cart.forEach(item => {
    totalQuantity = totalQuantity + item.quantity
    document.querySelector("#totalQuantity").innerHTML = totalQuantity;
    })
  }

// modification du produit sur la page

document.querySelectorAll(".itemQuantity").forEach(itemQty => {
  itemQty.addEventListener("change", function () {
    const itemQuantity = itemQty
    const itemQuantityParsed = parseInt(itemQuantity.value)
    const dataId = itemQty.getAttribute("data-id")
    const dataColor = itemQty.getAttribute("data-color")
    const productFound = cart.find(prd => prd.id == dataId && prd.color == dataColor)
    productFound.quantity = itemQuantityParsed

    // modification du produit sur le Local Storage
    const panierString = JSON.stringify(cart)
    localStorage.setItem("products", panierString)

    // modification du prix/quantité totale 
    getTotalQuantity()
    getTotalPrice()
  })
})




// Suppression du produit

document.querySelectorAll(".deleteItem").forEach(dltQty => {
  dltQty.addEventListener("click", function() {
    const dataId = dltQty.getAttribute("data-id")
    const dataColor = dltQty.getAttribute("data-color")
    const cartIndex = cart.findIndex(cartIndex => cartIndex.color == dataColor && cartIndex.id == dataId)
    const cartSplice = cart.splice(cartIndex, 1) 

    // Suppression de l'html du produit ciblé 
    const elementDelete = document.querySelector(`.cart__item[data-id="${dataId}"][data-color="${dataColor}"]`);
    elementDelete.remove()

    // suppression du produit dans le localStorage
    const panierString = JSON.stringify(cart)
    localStorage.setItem("products", panierString)

    // modification du prix/quantité totale
    
    getTotalQuantity()
    getTotalPrice()

  })
})



// Message d'erreur Formulaire


// Fonction Erreur Prénom/Nom/Ville

function errorMsgNumber(form) {
  document.querySelector(`#${form}`).addEventListener('input', function(e) {
    var regName = /^[a-zA-Z\s]+$/;
    var name = e.target.value;
    if(!regName.test(name.trim())) {
      document.querySelector(`#${form}ErrorMsg`).innerHTML = `Les caractères acceptées sont [a-z A-Z]`
      return false
    } else {
        return true
    }
  } 
)}

errorMsgNumber("lastName")
errorMsgNumber("firstName")
errorMsgNumber("city")

// Erreur Adresse

document.querySelector(`#address`).addEventListener('input', function(e) {
  var regName = /^[a-zA-Z\s0-9]+$/
  if(!regName.test(e.target.value.trim())) {
    document.querySelector(`#addressErrorMsg`).innerHTML = `Les caractères acceptées sont [a-z A-Z 1-9]`
    return false
  } else {
      return true
  }
})

// Erreur Email

document.querySelector(`#email`).addEventListener('input', function(e) {
  var regName = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if(!regName.test(e.target.value.trim())) {
    document.querySelector(`#emailErrorMsg`).innerHTML = "Vous avez entré une adresse mail invalide"
    return false
  } else {
      return true
  }
})

// Constituer un objet contact (à partir des données du formulaire) 

const form = document.querySelector(".cart__order__form")

form.addEventListener('submit', async function(e) {
  e.preventDefault();

// Constituer un tableau de produit
  const products = cart.map(product => product.id)

  const contact = {
    products,
    contact : {    
      firstName : e.target.firstName.value,
      lastName : e.target.lastName.value,
      address : e.target.address.value,
      city : e.target.city.value,
      email : e.target.email.value,
    }
  };


// Requete POST sur API 
  const response = await fetch(`http://localhost:3000/api/products/order`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contact),
  })
  const prd = await response.json()
  return prd
})




/*
const promises = cart.map(async (product) => {
    // await fetch()
    // product.quantity =   10  product.price = 1000
    
     sum = sum + product.price * product.quantity
  
     sum = 210 + 1000 * 10
     sum = 210 + 10000
     sum = 10210
})

// promises = [Promise1, Promese2, Promese3]


await Promise.all(promises)
*/