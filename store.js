import items from './items.json';
import priceFormatter from './util/priceFormatter';
import { addItem } from './shoppingCart.js';
import addGlobalEventListener from './util/addGlobalEventListener';

const storeItemsContainer = document.querySelector(
  '[data-store-items-container]'
);
const storeItemTemplate = document.getElementById('store-item-template');
const IMG_URL = 'https://dummyimage.com/420x260';

export function setupStoreItems() {
  if (!storeItemsContainer) return;
  items.forEach(renderStoreItem);
  addGlobalEventListener('click', '[data-add-item-button]', e => {
    const itemId = e.target.closest('[data-store-item]').dataset.itemId;
    addItem(parseInt(itemId));
  });
}

function renderStoreItem(item) {
  const cloneStoreItem = storeItemTemplate.content.cloneNode(true);
  const itemId = item.id;

  const storeItem = cloneStoreItem.querySelector('[data-store-item]');
  storeItem.dataset.itemId = itemId;

  const image = cloneStoreItem.querySelector('[data-image]');
  image.src = `${IMG_URL}/${item.imageColor}/${item.imageColor}`;

  const name = cloneStoreItem.querySelector('[data-name]');
  name.innerText = item.name;

  const category = cloneStoreItem.querySelector('[data-category]');
  category.innerText = item.category;

  const price = cloneStoreItem.querySelector('[data-price]');
  price.innerText = priceFormatter(item.priceCents / 100);

  storeItemsContainer.append(cloneStoreItem);
}
