// Haetaan viittauksia lomake-elementteihin, valintaruutuihin, lettutyyppivalitsimeen ja painikkeeseen
const form = document.querySelector('.form-container');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const typeSelect = document.querySelector('#type');
const button = document.querySelector('button');
const ordersList = document.querySelector('#ordersList');

// Muuttujat kokonaiskustannusten ja valittujen täytteiden ja lisukkeiden listojen tallentamiseen
let total = 0;
let toppings = [];
let extras = [];

// Funktio kokonaiskustannusten laskemiseen ja valittujen täytteiden ja lisukkeiden tarkistamiseen
const updateOrderDetails = () => {
  const totalPriceElement = document.querySelector('#totalPrice');
  total = parseInt(typeSelect.value);
  toppings = [];
  extras = [];
  
  checkboxes.forEach(item => {
    const itemName = item.dataset.name;
    const category = item.dataset.category;
    if (item.checked) {
      total += parseInt(item.value);
      if (category === 'toppings') {
        toppings.push(itemName);
      } else {
        extras.push(itemName);
      }
    }
  });

  totalPriceElement.textContent = `${total}€`;
  animatePriceChange();
  updatePriceDisplay();
};

// Funktio hintamuutoksen animointiin
const animatePriceChange = () => {
  const priceBanner = document.querySelector('.price-banner');
  priceBanner.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(1.05)' },
      { transform: 'scale(1)' },
    ],
    {
      duration: 100,
      iterations: 1,
    }
  );
};

// Funktio tilauksen yksityiskohtien näyttämiseksi
const displayOrder = () => {
  const customerName = document.querySelector('#customerName').value;
  const orderTypeElement = document.querySelector('#order_type');
  const orderToppingsElement = document.querySelector('#order_toppings');
  const orderExtrasElement = document.querySelector('#order_extras');
  const orderNameElement = document.querySelector('#order_name');
  const orderPriceElement = document.querySelector('#order_price');

  orderTypeElement.textContent = typeSelect.selectedOptions[0].text;
  orderToppingsElement.textContent = toppings.length > 0 ? toppings.join(', ') : 'No toppings selected.';
  orderExtrasElement.textContent = extras.length > 0 ? extras.join(', ') : 'No extras selected.';
  orderNameElement.textContent = customerName;
  orderPriceElement.textContent = `${total}€`;
};

// Tapahtumankäsittelijä lomakkeen muutokselle
form.addEventListener('change', updateOrderDetails);

// Tapahtumankäsittelijä painikkeen painallukselle
button.addEventListener('click', () => {
  displayOrder();
  clearForm(); // После создания заказа очищаем форму
});

// Funktio kokonaiskustannusten päivittämiseksi luokassa 'price-display'
const updatePriceDisplay = () => {
  const priceDisplayElement = document.querySelector('.price-display h3 span');
  priceDisplayElement.textContent = `${total}€`;
};

// Luokka yhden tilauksen esittämiseksi
class Order {
  constructor(customerName, pancakeType, toppings, extras, totalPrice) {
    this.customerName = customerName;
    this.pancakeType = pancakeType;
    this.toppings = toppings;
    this.extras = extras;
    this.totalPrice = totalPrice;
    this.completed = false; // Aluksi tilausta ei ole suoritettu
  }

  // Metodi tilauksen tiivistelmän saamiseksi
  getOrderSummary() {
    return `${this.customerName} - ${this.pancakeType}, Total: ${this.totalPrice}€`;
  }

  // Metodi tilauksen tilan päivittämiseksi
  markCompleted() {
    this.completed = true;
  }
}

// Taulukko kaikkien tilausten tallentamiseksi
let orders = [];

// Funktio uuden tilauksen luomiseksi
const createOrder = () => {
  const customerName = document.querySelector('#customerName').value.trim();
  if (!customerName) {
    alert("Kenttä 'Nimesi' on pakollinen.");
    return;
  }
  const pancakeType = typeSelect.selectedOptions[0].text;
  
  // Haetaan valitut täytteet ja lisukkeet
  const selectedToppings = toppings;
  const selectedExtras = extras;
  
  // Lasketaan tilauksen kokonaiskustannukset
  let totalPrice = total;
  
  // Luodaan uusi tilausobjekti
  const order = new Order(customerName, pancakeType, selectedToppings, selectedExtras, totalPrice);
  
  // Lisätään tilaus taulukkoon ja tallennetaan localStorageen
  addOrder(order);
  
  // Päivitetään tilausten lista hallintasivulla
  displayOrders();
};

// Funktio uuden tilauksen lisäämiseksi taulukkoon ja tallentamiseksi localStorageen
const addOrder = (order) => {
  orders.push(order);
  saveOrders();
};

// Funktio lomakkeen tyhjentämiseksi tilauksen luomisen jälkeen
const clearForm = () => {
  document.querySelector('#customerName').value = '';
  typeSelect.selectedIndex = 0;
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  updateOrderDetails(); // Päivitetään hinta perushintaan
};

// Funktio tilausten tallentamiseksi localStorageen
const saveOrders = () => {
  localStorage.setItem('orders', JSON.stringify(orders));
  console.log('Tilaukset tallennettu localStorageen.');
};

// Funktio tilausten lataamiseksi localStoragesta
const loadOrders = () => {
  const savedOrders = localStorage.getItem('orders');
  orders = savedOrders ? JSON.parse(savedOrders) : [];
  console.log('Tilaukset ladattu localStoragesta:', orders);
  displayOrders(); // Näytetään ladatut tilaukset
};

// Funktio kaikkien tilausten näyttämiseksi
const displayOrders = () => {
  if (!ordersList) {
    console.error('Element with ID "ordersList" not found.');
    return;
  }
  ordersList.innerHTML = '';
  orders.forEach((order, index) => {
    const orderElement = document.createElement('div');
    orderElement.className = `order ${order.completed ? 'completed' : ''}`;
    orderElement.innerHTML = `
      <p>${order.getOrderSummary()}</p>
      <button onclick="markOrderCompleted(${index})">Complete</button>
    `;
    ordersList.appendChild(orderElement);
  });
};

// Funktio tilauksen tilan muuttamiseksi suoritettuksi
const markOrderCompleted = (index) => {
  if (orders[index] instanceof Order) {
    orders[index].markCompleted();
    saveOrders(); // Tallennetaan muutokset localStorageen
    displayOrders(); // Päivitetään tilausten näyttö
  } else {
    console.error('Order at index ' + index + ' is not an instance of Order.');
  }
};

// Päivitä olemassa oleva tilaus ja localStorage
const updateOrder = (index, updatedOrder) => {
  orders[index] = updatedOrder;
  saveOrders();
};

// Kutsutaan funktiota tilausten lataamiseksi sivun latautuessa
document.addEventListener('DOMContentLoaded', loadOrders);



