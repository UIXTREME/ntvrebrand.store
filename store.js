// Elementos del DOM
const categoryList = document.getElementById('category-list');
const productGrid = document.getElementById('product-grid');

// Modal
const productModal = document.getElementById('product-modal');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalMainImage = document.getElementById('modal-main-image');
const modalDescription = document.getElementById('modal-description');
const modalPrice = document.getElementById('modal-price');
const modalGallery = document.getElementById('modal-gallery');
const modalLinks = document.getElementById('modal-links');

// Almacenar data global
let storeData = {};

// 1. Cargar data.json
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    storeData = data;
    // 2. Renderizar las categorías
    renderCategories(Object.keys(storeData));

    // 3. Mostrar la primera categoría por defecto
    const firstCategory = Object.keys(storeData)[0];
    if (firstCategory) {
      renderProducts(firstCategory);
    }
  })
  .catch(err => console.error("Error al cargar el JSON:", err));

// Función para renderizar las categorías
function renderCategories(categories) {
  categoryList.innerHTML = '';
  categories.forEach(cat => {
    const li = document.createElement('li');
    li.textContent = cat;
    li.addEventListener('click', () => {
      renderProducts(cat);
    });
    categoryList.appendChild(li);
  });
}

// Función para mostrar productos de una categoría
function renderProducts(category) {
  productGrid.innerHTML = ''; // Limpiar el grid
  const products = storeData[category];

  // Si no hay productos (como "IPTV Apps" vacío), muestra un mensaje
  if (!products || products.length === 0) {
    productGrid.innerHTML = '<p style="color:#ccc;">No products available in this category.</p>';
    return;
  }

  products.forEach(product => {
    // Crear tarjeta
    const card = document.createElement('div');
    card.classList.add('product-card');

    // Imagen principal
    const img = document.createElement('img');
    img.src = product.main_image || '';
    img.alt = product.name;

    // Título
    const title = document.createElement('h3');
    title.textContent = product.name;

    // Descripción (podemos mostrar un fragmento)
    const desc = document.createElement('p');
    // Toma solo 80 caracteres para la vista previa
    desc.textContent = product.description.substring(0, 80) + '...';

    // Precio
    const price = document.createElement('p');
    price.classList.add('price');
    if (product.selfhosted_offer && product.selfhosted) {
      price.textContent = `Offer: $${product.selfhosted_offer} (Original: $${product.selfhosted})`;
    } else if (product.selfhosted) {
      price.textContent = `Price: $${product.selfhosted}`;
    } else {
      price.textContent = 'Contact for price';
    }

    // Evento al hacer clic en la tarjeta
    card.addEventListener('click', () => openModal(product));

    // Estructura
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(price);

    productGrid.appendChild(card);
  });
}

// Función para abrir el modal con detalles del producto
function openModal(product) {
  modalTitle.textContent = product.name;
  modalMainImage.src = product.main_image || '';
  modalDescription.textContent = product.description;

  // Mostrar precio u oferta
  if (product.selfhosted_offer && product.selfhosted) {
    modalPrice.textContent = `Offer: $${product.selfhosted_offer} (Original: $${product.selfhosted})`;
  } else if (product.selfhosted) {
    modalPrice.textContent = `Price: $${product.selfhosted}`;
  } else {
    modalPrice.textContent = 'Contact for price';
  }

  // Galería de imágenes
  modalGallery.innerHTML = '';
  if (product.images && product.images.length > 0) {
    product.images.forEach(imgUrl => {
      if (!imgUrl) return; // A veces viene vacío
      const thumb = document.createElement('img');
      thumb.src = imgUrl;
      thumb.alt = product.name;
      // Al hacer clic en la miniatura, se cambia la imagen principal
      thumb.addEventListener('click', () => {
        modalMainImage.src = imgUrl;
      });
      modalGallery.appendChild(thumb);
    });
  }

  // Enlaces (YouTube, Telegram, Purchase)
  modalLinks.innerHTML = '';
  if (product.ytvideo) {
    const ytLink = document.createElement('a');
    ytLink.href = product.ytvideo;
    ytLink.target = '_blank';
    ytLink.textContent = 'YouTube';
    modalLinks.appendChild(ytLink);
  }

  if (product.telegram) {
    const tgLink = document.createElement('a');
    tgLink.href = product.telegram;
    tgLink.target = '_blank';
    tgLink.textContent = 'Telegram';
    modalLinks.appendChild(tgLink);
  }

  if (product.purchase) {
    const buyLink = document.createElement('a');
    buyLink.href = product.purchase;
    buyLink.target = '_blank';
    buyLink.textContent = 'Purchase';
    modalLinks.appendChild(buyLink);
  }

  // Mostrar modal
  productModal.classList.add('show');
}

// Cerrar modal
modalClose.addEventListener('click', () => {
  productModal.classList.remove('show');
});

// Cerrar modal al hacer clic fuera de la caja
productModal.addEventListener('click', (e) => {
  if (e.target === productModal) {
    productModal.classList.remove('show');
  }
});
