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

// Funktio kokonaiskustannusten laskemiseen
const pancakePriceCalc = () => {
  // Haetaan viittauksia elementteihin kokonaiskustannusten näyttämiseksi
  const totalPriceElement = document.querySelector('#totalPrice');

  // Haetaan valitun lettutyypin perushinta
  total = parseInt(typeSelect.value);
  
  // Päivitetään täytteiden ja lisukkeiden listat ja lisätään niiden hinta kokonaiskustannuksiin
  checkToppings();

  // Päivitetään teksti kokonaiskustannuksilla
  totalPriceElement.textContent = `${total}€`;
  
  // Animaatio hintamuutoksen visuaaliseen efektiin
  animatePriceChange();
};

// Funktio elementin lisäämiseksi vastaavaan listaan
const addItem = (itemName, category) => {
  if (category === 'toppings') {
    toppings.push(itemName);
  } else {
    extras.push(itemName);
  }
};

// Funktio elementin poistamiseksi vastaavasta listasta
const removeItem = (itemName, category) => {
  if (category === 'toppings') {
    toppings = toppings.filter(item => item !== itemName);
  } else {
    extras = extras.filter(item => item !== itemName);
  }
};

// Funktio valittujen täytteiden ja lisukkeiden tarkistamiseen
const checkToppings = () => {
  // Tyhjennetään täytteiden ja lisukkeiden listat
  toppings = [];
  extras = [];

  // Käydään läpi kaikki valintaruudut ja päivitetään kokonaiskustannukset ja täytteiden/lisukkeiden listat
  checkboxes.forEach(item => {
    const itemName = item.dataset.name;
    const category = item.dataset.category;

    if (item.checked) {
      total += parseInt(item.value);
      addItem(itemName, category);
    } else {
      removeItem(itemName, category);
    }
  });
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

  // Päivitetään valittu lettutyyppi
  orderTypeElement.textContent = typeSelect.selectedOptions[0].text;

  // Päivitetään valitut täytteet
  orderToppingsElement.textContent = toppings.length > 0 ? toppings.join(', ') : 'No toppings selected.';

  // Päivitetään valitut lisukkeet
  orderExtrasElement.textContent = extras.length > 0 ? extras.join(', ') : 'No extras selected.';

  // Päivitetään asiakkaan nimi
  orderNameElement.textContent = customerName;

  // Päivitetään asiakkaan lopullinen hinta
  orderPriceElement.textContent = `${total}€`;

  // Päivitetään tilauksen kokonaiskustannukset luokassa 'price-display'
  updatePriceDisplay();
};

// Tapahtumankäsittelijä lomakkeen muutokselle
form.addEventListener('change', () => {
  pancakePriceCalc();
  updatePriceDisplay();
});

// Tapahtumankäsittelijä painikkeen painallukselle
button.addEventListener('click', () => {
  displayOrder();
  createOrder();
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
  const customerName = document.querySelector('#customerName').value;
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
  pancakePriceCalc(); // Päivitetään hinta perushintaan
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
};

// Funktio kaikkien tilausten näyttämiseksi
const displayOrders = () => {
  const ordersList = document.querySelector('#ordersList');

  if (!ordersList) {
    console.error('Element with ID "ordersList" not found.');
    return;
  }

  ordersList.innerHTML = ''; // Tyhjennetään tilausten lista ennen päivitystä

  orders.forEach((order, index) => {
    const orderElement = document.createElement('div');
    orderElement.classList.add('order');

    orderElement.innerHTML = `
      <h3>Order ${index + 1}</h3>
      <div class="order-details">
        <strong>Asiakas:</strong> ${order.customerName}<br>
        <strong>Tyyppi:</strong> ${order.pancakeType}<br>
        <strong>Lisukkeet:</strong> ${order.toppings.length > 0 ? order.toppings.join(', ') : 'None'}<br>
        <strong>Lisävaihtoehdot:</strong> ${order.extras.length > 0 ? order.extras.join(', ') : 'None'}<br>
        <strong>Hinta:</strong> ${order.totalPrice}€<br>
        <strong>Status:</strong> ${order.completed ? 'Completed' : 'Pending'}
      </div>
      <button onclick="markOrderCompleted(${index})">Mark as Completed</button>
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

// Kutsutaan funktiota tilausten lataamiseksi sivun latautuessa
document.addEventListener('DOMContentLoaded', () => {
  loadOrders();
  displayOrders(); // Näytetään ladatut tilaukset
});

// Päivitä olemassa oleva tilaus ja localStorage
const updateOrder = (index, updatedOrder) => {
  orders[index] = updatedOrder;
  saveOrders();
};
