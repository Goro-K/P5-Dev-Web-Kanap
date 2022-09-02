// on recupere la liste des produits dans le panier et on la transforme pour recuperer un Array
const products = new Map()

let cart = JSON.parse(localStorage.getItem("products"));

let totalQuantity = 0; // A chaque boucle les quantités s'additionnent

let totalPrice = 0; // A chaque boucle les prix s'additionnent


for(const product of cart) {
  const response = await fetch(`http://localhost:3000/api/products/${product.id}`) // on veut faire un fetch pour chaque id recuperer
  const productApi = await response.json()
  products.set(productApi._id, productApi)

    document.querySelector('#cart__items').innerHTML += 
      `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
          <div class="cart__item__img">
            <img src="${productApi.imageUrl}" alt="${productApi.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${productApi.name}</h2>
              <p>${product.color}</p>
              <p>${productApi.price}</p>
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

    totalPrice = totalPrice + productApi.price * product.quantity
};

// Modification du prix et quantité quand la page est recharger

document.querySelector("#totalPrice").innerHTML = totalPrice;
document.querySelector("#totalQuantity").innerHTML = totalQuantity;

// Fonction qui permet la modification du PRIX totale à la modification/suppression d'un produit

function getTotalPrice() {
  totalPrice = 0;
  document.querySelector("#totalPrice").innerHTML = totalPrice
  cart.forEach(item => {
    const productFromApi = products.get(productApi)

    totalPrice = totalPrice + productFromApi.price * item.quantity
  })
  document.querySelector("#totalPrice").innerHTML = totalPrice; // Si j'utilise new Map()le mettre à la fin de la boucle forEach()
}

// Fonction qui permet la modification de la QUANTITE totale à la modification/suppression d'un produit

function getTotalQuantity() {
  totalQuantity = 0
  cart.forEach(item => {
    totalQuantity = totalQuantity + item.quantity
  })
  document.querySelector("#totalQuantity").innerHTML = totalQuantity;
}

// modification du produit sur la page

document.querySelectorAll(".itemQuantity").forEach(itemQty => {
  itemQty.addEventListener("change", function () {
    const itemQuantity = itemQty
    const itemQuantityParsed = parseInt(itemQuantity.value)
    const product = itemQty.closest('article')
    const dataId = product.getAttribute("data-id")
    const dataColor = product.getAttribute("data-color")
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
    const product = dltQty.closest('article')
    const dataId = product.getAttribute("data-id")
    const dataColor = product.getAttribute("data-color")
    const cartIndex = cart.findIndex(cartIndex => cartIndex.color == dataColor && cartIndex.id == dataId)
    const cartSplice = cart.splice(cartIndex, 1) 

    // suppression du produit dans le localStorage
    const panierString = JSON.stringify(cart)
    localStorage.setItem("products", panierString)

    // Suppression de l'html du produit ciblé 
    product.remove()

    // modification du prix/quantité totale
    
    getTotalQuantity()
    getTotalPrice()

  })
})



// Message d'erreur Formulaire 


// Fonction Erreur Prénom/Nom/Ville
function errorMsgNumber(value, form) {
  const regName = /^[a-zA-Z\s]+$/;
  if(regName.test(value.trim())) {
    return true
  } else {
      document.querySelector(`#${form}ErrorMsg`).innerHTML = `Les caractères acceptées sont [a-z A-Z]`
      return false
    }
} 

document.querySelector(`#firstName`).addEventListener('input', function(e) {
  errorMsgNumber(e.target.value, "firstName")
})

document.querySelector(`#lastName`).addEventListener('input', function(e) {
  errorMsgNumber(e.target.value, "lastName")
})

document.querySelector(`#city`).addEventListener('input', function(e) {
  errorMsgNumber(e.target.value, "city")
})



// Erreur Adresse

function errorMsgAddress(value) {
  const regName = /^[a-zA-Z\s0-9]+$/
  if(regName.test(value.trim())) {
    return true
  } else {
      document.querySelector(`#addressErrorMsg`).innerHTML = `Les caractères acceptées sont [a-z A-Z 1-9]`
      return false
    }
}

document.querySelector(`#address`).addEventListener('input', function(e) {
  errorMsgAddress(e.target.value)
})


// Erreur Email

function errorMsgEmail(value) {
  const regName = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if(regName.test(value.trim())) {
    return true
  } else {
      document.querySelector(`#emailErrorMsg`).innerHTML = "Vous avez entré une adresse mail invalide"
      return false
    }
}

document.querySelector(`#email`).addEventListener('input', function(e) {
  errorMsgEmail(e.target.value)
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

  // Verification des erreurs dans le formulaire au clic sur le bouton Commander !
  const isValidFirstName = errorMsgNumber(e.target.firstName.value, "firstName")
  const isValidLastName = errorMsgNumber(e.target.lastName.value, "lastName")
  const isValidCity = errorMsgNumber(e.target.city.value, "city")
  const isValidAddress = errorMsgAddress(e.target.city.value)
  const isValidEmail = errorMsgEmail(e.target.email.value)

  let isFormValid = isValidFirstName && isValidLastName && isValidAddress && isValidCity && isValidEmail;

  if(isFormValid == false) {
    alert("Il y a une erreur dans le formulaire")
    return
  }

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

  window.location = `confirmation.html?orderId=${prd.orderId}`
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

/*
const products = new Map()


for((product) ){

    const product = fetch()
    products.set(product.id, product)

})




 123: { id: 123, price: 10},
 456: { id: 456, price: 10},




const productFromApi = products.get(product.id)
productFromApl.price
*/