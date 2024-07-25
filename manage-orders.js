let orders = [];

// Funktio tilausten lataamiseksi localStoragesta
const loadOrders = () => {
  const savedOrders = localStorage.getItem('orders');
  orders = savedOrders ? JSON.parse(savedOrders) : [];
  console.log('Tilaukset ladattu localStoragesta:', orders);
};

// Funktio tilausten tallentamiseksi localStorageen
const saveOrders = () => {
  localStorage.setItem('orders', JSON.stringify(orders));
  console.log('Tilaukset tallennettu localStorageen.');
};

// Funktio tilausten näyttämiseksi sivulla
const displayOrders = () => {
  const ordersList = document.querySelector('#ordersList');
  if (!ordersList) {
    console.error('Elementtiä, jonka ID on "ordersList", ei löytynyt.');
    return;
  }

  ordersList.innerHTML = ''; // Tyhjennetään tilausten lista ennen päivittämistä

  if (!Array.isArray(orders) || orders.length === 0) {
    ordersList.innerHTML = '<p>Ei tilauksia näytettäväksi.</p>';
    console.log('Ei tilauksia näytettäväksi.');
    return;
  }

  orders.forEach((order, index) => {
    if (order) { 
      const orderElement = document.createElement('div');
      orderElement.classList.add('order');

      const creationDate = order.creationDate ? new Date(order.creationDate).toLocaleString() : 'Not specified';
      const completionDate = order.completionDate ? new Date(order.completionDate).toLocaleString() : 'Pending';

      orderElement.innerHTML = `
        <h3>Tilaus ${index + 1}</h3>
        <div class="order-details">
          <strong>Asiakas:</strong> ${order.customerName}<br>
          <strong>Tyyppi:</strong> ${order.pancakeType}<br>
          <strong>Lisukkeet:</strong> ${(order.toppings?.length ?? 0) > 0 ? order.toppings.join(', ') : 'Ei lisukkeita'}<br>
          <strong>Lisävaihtoehdot:</strong> ${(order.extras?.length ?? 0) > 0 ? order.extras.join(', ') : 'Ei lisävaihtoehtoja'}<br>
          <strong>Hinta:</strong> ${order.totalPrice}€<br>
          <strong>Valmistumispäivä:</strong> ${completionDate}<br>
          <strong>Tila:</strong> ${order.completed ? 'Valmis' : 'Odottaa'}
        </div>
        <button onclick="markOrderCompleted(${index})">Merkitse valmiiksi</button>
      `;

      ordersList.appendChild(orderElement);
    }
  });
  console.log('Tilaukset ladattu ja näytetty onnistuneesti.');
};

// Funktio tilauksen merkitsemiseksi valmiiksi
const markOrderCompleted = (index) => {
  if (orders[index]) {
    orders[index].completed = true; // Muutetaan tilauksen tila "Valmis"
    orders[index].completionDate = new Date().toISOString(); // Lisätään tilauksen valmistumispäivä
    saveOrders(); // Tallennetaan muutokset localStorageen
    displayOrders(); // Päivitetään tilausten näyttö
  } else {
    console.error('Tilausta indeksissä ' + index + ' ei löytynyt.');
  }
};

// Ladataan tilaukset ja näytetään ne sivulla, kun dokumentti on ladattu
document.addEventListener('DOMContentLoaded', () => {
  loadOrders();
  displayOrders(); // Näytetään ladatut tilaukset
});

// Tarkistetaan localStoragen tiedot
console.log(JSON.parse(localStorage.getItem('orders')));
