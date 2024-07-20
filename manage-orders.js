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


    

// Lataa ja näytä tilaukset
const displayOrders = () => {
  const ordersList = document.querySelector('#ordersList');
  ordersList.innerHTML = ''; // Tyhjennä tilausten lista ennen päivitystä

  if (!Array.isArray(orders) || orders.length === 0) {
    ordersList.innerHTML = '<p>Ei tilauksia näytettäväksi.</p>';
    console.log('Ei tilauksia näytettäväksi.');
    return;
  }

  orders.forEach((order, index) => {
    if (order) { 
      const orderElement = document.createElement('div');
      orderElement.classList.add('order');

      const creationDate = new Date(order.creationDate).toLocaleString();
      const completionDate = order.completionDate ? new Date(order.completionDate).toLocaleString() : 'Pending';

      orderElement.innerHTML = `
        <h3>Order ${index + 1}</h3>
        <div class="order-details">
          <strong>Asiakas:</strong> ${order.customerName}<br>
          <strong>Tyyppi:</strong> ${order.pancakeType}<br>
          <strong>Lisukkeet:</strong> ${(order.toppings?.length ?? 0) > 0 ? order.toppings.join(', ') : 'None'}<br>
          <strong>Lisävaihtoehdot:</strong> ${(order.extras?.length ?? 0) > 0 ? order.extras.join(', ') : 'None'}<br>
          <strong>Hinta:</strong> ${order.totalPrice}€<br>
        
          <strong>Status:</strong> ${order.completed ? 'Completed' : 'Pending'}
        </div>
        <button onclick="markOrderCompleted(${index})">Mark as Completed</button>
      `;

      ordersList.appendChild(orderElement);
    }
  });
  console.log('Tilaukset ladattu ja näytetty onnistuneesti.');
};

// Merkitse tilaus valmiiksi
const markOrderCompleted = (index) => {
  if (orders[index]) {
    orders[index].completed = true; // Muuta tilauksen tila "Completed"
    saveOrders(); // Tallenna muutokset localStorageen
    displayOrders(); // Päivitä tilausten näyttö
    
  }
};

// Lataa tilaukset ja näytä ne sivulla
document.addEventListener('DOMContentLoaded', () => {
  loadOrders();
  displayOrders(); // Näytä ladatut tilaukset
});

// Tarkista localStoragen tiedot
console.log(JSON.parse(localStorage.getItem('orders')));



