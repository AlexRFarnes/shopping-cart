import items from './items.json';
const imageURL = 'https://dummyimage.com/';
const imageSizeLarge = '420x260/';
const imageSizeSmall = '210x130/';
const itemsContainer = document.querySelector('[data-items]');
const templateItem = document.getElementById('item-template');
const cartButton = document.querySelector('[data-cart-button]');
const shoppingItemsContainer = document.querySelector(
  '[data-shopping-container]'
);
const cartItemTemplate = document.getElementById('item-cart');
const shoppingItems = document.querySelector('[data-shopping-items]');
const price = document.querySelector('[data-total-price]');

const LOCAL_STORAGE_PREFIX = 'SHOPPING_CART';
const CART_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-items`;

let storeCartItems = loadItems();

function loadItems() {
  return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
}

function saveItems() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(storeCartItems));
}

function renderCartButton() {
  if (storeCartItems.length === 0) {
    cartButton.closest('section').classList.add('invisible');
  } else {
    cartButton.closest('section').classList.remove('invisible');
  }
}

function populateShop() {
  items.forEach(item => {
    const itemEl = templateItem.content.cloneNode(true);
    // Set the data-item-id on the first div
    itemEl.querySelector('div').dataset.itemId = item.id;
    itemEl.querySelector(
      'img'
    ).src = `${imageURL}${imageSizeLarge}${item.imageColor}/${item.imageColor}`;
    itemEl.querySelector('[data-category]').innerText = item.category;
    itemEl.querySelector('[data-name]').innerText = item.name;
    itemEl.querySelector('[data-price]').innerText = `$${(
      item.priceCents / 100
    ).toFixed(2)}`;
    itemEl.querySelector('button').addEventListener('click', e => {
      const id = +e.target.closest('[data-item-id]').dataset.itemId;
      addToCart(id);
    });
    itemsContainer.appendChild(itemEl);
  });
}

if (templateItem != null) {
  populateShop();
}
updateCart();

function calculateTotal() {
  const totalPrice = storeCartItems.reduce(
    (price, item) => (item.priceCents / 100) * item.quantity + price,
    0
  );
  price.innerText = `$${totalPrice.toFixed(2)}`;
}

function showItemsOnCartButton() {
  renderCartButton();
  cartButton.querySelector('div').innerText = storeCartItems.reduce(
    (numOfItems, item) => item.quantity + numOfItems,
    0
  );
}

function removeFromCart(id) {
  storeCartItems = storeCartItems.filter(item => item.id !== id);
  console.log(storeCartItems);
  updateCart();
}

function updateCart() {
  shoppingItems.innerHTML = '';
  let cartItem;
  storeCartItems.forEach(item => {
    cartItem = cartItemTemplate.content.cloneNode(true);
    // Set the data-item-id on the first div
    cartItem.querySelector('div').dataset.itemId = item.id;
    cartItem.querySelector('[data-name]').innerText = item.name;
    cartItem.querySelector(
      'img'
    ).src = `${imageURL}${imageSizeSmall}${item.imageColor}/${item.imageColor}`;
    cartItem.querySelector('[data-quantity]').innerText = `${
      item.quantity > 1 ? 'x' + item.quantity : ''
    }`;
    cartItem.querySelector('[data-price]').innerText = `$${(
      (item.quantity * item.priceCents) /
      100
    ).toFixed(2)}`;
    cartItem
      .querySelector('[data-remove-from-cart-button]')
      .addEventListener('click', e => {
        removeFromCart(item.id);
      });

    shoppingItems.appendChild(cartItem);
  });
  saveItems();
  showItemsOnCartButton();
  calculateTotal();
  renderCartButton();
}

function addToCart(id) {
  const item = items.find(itemObj => itemObj.id === id);
  if (storeCartItems.find(storedItem => storedItem.id === id)) {
    // Increase the quantity by one if the object already has the imte
    storeCartItems.forEach(item => {
      if (item.id === id) {
        item.quantity = item.quantity + 1;
      }
    });
  } else {
    storeCartItems.push({ ...item, quantity: 1 });
  }

  updateCart();
}

cartButton.addEventListener('click', () => {
  shoppingItemsContainer.classList.toggle('invisible');
});

// console.log(items);
