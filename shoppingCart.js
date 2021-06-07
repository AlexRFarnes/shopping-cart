import items from './items.json';
import priceFormatter from './util/priceFormatter';
import addGlobalEventListener from './util/addGlobalEventListener';

const shoppingCartButton = document.querySelector(
  '[data-shopping-cart-button]'
);
const cartItemsContainer = document.querySelector(
  '[data-cart-items-container]'
);
const cartItems = document.querySelector('[data-cart-items]');
const IMG_URL = 'https://dummyimage.com/210x130';
const cartItemTemplate = document.getElementById('cart-item-template');
const cartQuantity = document.querySelector('[data-shopping-quantity]');
const totalCart = document.querySelector('[data-total]');
const APP_KEY = 'SHOPPING-CART';
const storageKey = `${APP_KEY}-shopping-items`;
let shoppingCartItems = loadCart();

export function setupShoppingCart() {
  cartItemsContainer.classList.add('invisible');
  renderCartItem();
  addGlobalEventListener('click', '[data-remove-from-cart-button]', e => {
    const itemId = e.target.closest('[data-cart-item]').dataset.itemId;
    removeItem(parseInt(itemId));
  });
}

export function addItem(id) {
  const shoppingCartItem = shoppingCartItems.find(entry => entry.id === id);
  if (shoppingCartItem) {
    shoppingCartItem.quantity++;
  } else {
    shoppingCartItems.push({ id: id, quantity: 1 });
  }
  renderCartItem();
}

function removeItem(id) {
  shoppingCartItems = shoppingCartItems.filter(entry => entry.id !== id);
  renderCartItem();
}

function renderCartItem() {
  cartItems.innerHTML = '';
  shoppingCartItems.forEach(shoppingCartItem => {
    const item = items.find(entry => entry.id === shoppingCartItem.id);
    const cloneCartItem = cartItemTemplate.content.cloneNode(true);

    const cartItem = cloneCartItem.querySelector('[data-cart-item]');
    cartItem.dataset.itemId = item.id;

    const image = cloneCartItem.querySelector('[data-image]');
    image.src = `${IMG_URL}/${item.imageColor}/${item.imageColor}`;

    const name = cloneCartItem.querySelector('[data-name]');
    name.innerText = item.name;

    const quantity = cloneCartItem.querySelector('[data-quantity]');
    quantity.innerText =
      shoppingCartItem.quantity === 1 ? '' : `x${shoppingCartItem.quantity}`;

    const price = cloneCartItem.querySelector('[data-price]');
    price.innerText = priceFormatter(
      (item.priceCents * shoppingCartItem.quantity) / 100
    );

    cartItems.append(cloneCartItem);
  });
  updateCartQuantity();
  updateTotal();
  renderCart();
  saveCart();
}

function updateTotal() {
  const totalPriceCents = shoppingCartItems.reduce((acc, cartItem) => {
    const item = items.find(entry => entry.id === cartItem.id);
    return item.priceCents * cartItem.quantity + acc;
  }, 0);
  totalCart.innerText = priceFormatter(totalPriceCents / 100);
}

function updateCartQuantity() {
  cartQuantity.innerText = shoppingCartItems.length;
}

function renderCart() {
  if (shoppingCartItems.length === 0) {
    document.querySelector('[data-cart-section]').classList.add('invisible');
    cartItemsContainer.classList.add('invisible');
  } else {
    document.querySelector('[data-cart-section]').classList.remove('invisible');
  }
}

function saveCart() {
  sessionStorage.setItem(storageKey, JSON.stringify(shoppingCartItems));
}

function loadCart() {
  return JSON.parse(sessionStorage.getItem(storageKey)) || [];
}

shoppingCartButton.addEventListener('click', () => {
  cartItemsContainer.classList.toggle('invisible');
});
