let bagItems;

onLoad();

function onLoad() {
  let bagItemsStr = localStorage.getItem('bagItems');
  bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];
  
  // Clean up mixed data types
  bagItems = bagItems.map(id => String(id));
  localStorage.setItem('bagItems', JSON.stringify(bagItems));
  
  displayBagItems();
  displayBagSummary();
  displayBagIcon();
}

function removeFromBag(itemId) {
  console.log('Removing item:', itemId); // Debug line
  console.log('Before removal:', bagItems); // Debug line
  
  bagItems = bagItems.filter(id => String(id) !== String(itemId)); // Ensure string comparison
  localStorage.setItem('bagItems', JSON.stringify(bagItems));
  
  console.log('After removal:', bagItems); // Debug line
  
  displayBagItems();
  displayBagSummary();
  displayBagIcon();
}

function displayBagItems() {
  let container = document.querySelector('.bag-items-container');
  if (!container) return;

  if (bagItems.length === 0) {
    container.innerHTML = `<h2>Your bag is empty!</h2>`;
    return;
  }

  let innerHtml = '';
  bagItems.forEach(itemId => {
    // Convert itemId to string to match the items array IDs
    let item = items.find(i => i.id === String(itemId));
    if (item) {  // Only process if item is found
      innerHtml += `
        <div class="bag-item">
          <img class="bag-item-image" src="../${item.image}" alt="">
          <div class="bag-item-details">
            <h3>${item.company}</h3>
            <p>${item.item_name}</p>
            <p>Rs ${item.current_price} <span class="original-price">Rs ${item.original_price}</span> <span class="discount">(${item.discount_percentage}% OFF)</span></p>
            <button onclick="removeFromBag('${item.id}')">Remove</button>
          </div>
        </div>
      `;
    }
  });

  container.innerHTML = innerHtml;
}

function displayBagSummary() {
  let summaryContainer = document.querySelector('.bag-summary');
  if (!summaryContainer) return;

  if (bagItems.length === 0) {
    summaryContainer.innerHTML = '';
    return;
  }

  let totalMRP = 0, totalDiscount = 0, convenienceFee = 99;
  bagItems.forEach(itemId => {
    let item = items.find(i => i.id === String(itemId));
    if (item) {  // Only calculate if item is found
      totalMRP += item.original_price;
      totalDiscount += item.original_price - item.current_price;
    }
  });
  let finalPayment = totalMRP - totalDiscount + convenienceFee;

  summaryContainer.innerHTML = `
    <h3>PRICE DETAILS (${bagItems.length} Items)</h3>
    <div class="price-row">
      <span>Total MRP</span>
      <span>Rs ${totalMRP}</span>
    </div>
    <div class="price-row">
      <span>Discount on MRP</span>
      <span class="discount">- Rs ${totalDiscount}</span>
    </div>
    <div class="price-row">
      <span>Convenience Fee</span>
      <span>Rs ${convenienceFee}</span>
    </div>
    <hr>
    <div class="price-row total">
      <span>Total Amount</span>
      <span>Rs ${finalPayment}</span>
    </div>
    <button class="place-order-btn">PLACE ORDER</button>
  `;
}

function displayBagIcon() {
  let bagItemCountElement = document.querySelector('.bag-item-count');
  if (!bagItemCountElement) return;

  console.log('Current bagItems length:', bagItems.length); // Debug line

  if (bagItems.length > 0) {
    bagItemCountElement.style.visibility = 'visible';
    bagItemCountElement.innerText = bagItems.length;
  } else {
    bagItemCountElement.style.visibility = 'hidden';
    bagItemCountElement.innerText = '0';
  }
}