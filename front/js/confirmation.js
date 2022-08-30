const param = new URL(window.location.href).searchParams
const orderId = param.get("orderId")

document.querySelector("#orderId").innerHTML = `${orderId}`