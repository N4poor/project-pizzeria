export const select = {
  templateOf: {
    menuProduct: '#template-menu-product',
    cartProduct: '#template-cart-product',
    bookingWidget: '#template-booking-widget',  // dodany nowy szablon
  },
  containerOf: {
    menu: '#product-list',
    cart: '#cart',
    pages: '#pages',               // dodany selektor kontenera stron
    booking: '.booking-wrapper',   // dodany selektor kontenera rezerwacji
    home: '.home-wrapper',
  },
  all: {
    menuProducts: '#product-list > .product',
    menuProductsActive: '#product-list > .product.active',
    formInputs: 'input, select',
  },
  menuProduct: {
    clickable: '.product__header',
    form: '.product__order',
    priceElem: '.product__total-price .price',
    imageWrapper: '.product__images',
    amountWidget: '.widget-amount',
    cartButton: '[href="#add-to-cart"]',
  },
  widgets: {
    amount: {
      input: 'input.amount',
      linkDecrease: 'a[href="#less"]',
      linkIncrease: 'a[href="#more"]',
    },
    datePicker: {
      wrapper: '.date-picker',         // widget wyboru daty
      input: 'input[name="date"]',
    },
    hourPicker: {
      wrapper: '.hour-picker',          // widget wyboru godziny
      input: 'input[type="range"]',
      output: '.output',
    },
  },

  cart: {
    productList: '.cart__order-summary',
    toggleTrigger: '.cart__summary',
    totalNumber: `.cart__total-number`,
    totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
    subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
    deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
    form: '.cart__order',
    formSubmit: '.cart__order [type="submit"]',
    phone: '[name="phone"]',
    address: '[name="address"]',
  },
  cartProduct: {
    amountWidget: '.widget-amount',
    price: '.cart__product-price',
    edit: '[href="#edit"]',
    remove: '[href="#remove"]',
  },
  booking: {
    peopleAmount: '.people-amount',       // ilość osób do rezerwacji
    hoursAmount: '.hours-amount',         // ilość godzin rezerwacji
    tables: '.floor-plan .table',          // stoły w planie podłogi
  },
  nav: {
    links: '.main-nav a',                  // linki nawigacji
  },
};

export const home = {
  links: {
    orderOnline: {
      selector: '.home__btn1.order',  // Selektor przycisku "Order Online"
      page: 'order',             // Nazwa podstrony "Order" (bez hasha)
    },
    bookTable: {
      selector: '.home__btn2.book',  // Selektor przycisku "Book a Table"
      page: 'booking',          // Nazwa podstrony "Booking"
    },
    gallery: {
      selector: '.home__gallery', // Selektor galerii
      page: 'gallery',          // Nazwa podstrony "Galeria"
    },
    contact: {
      selector: '.home__contact', // Selektor kontaktu (jeśli istnieje)
      page: 'contact',          // Nazwa podstrony "Kontakt"
    },
  },
};

export const classNames = {
  menuProduct: {
    wrapperActive: 'active',
    imageVisible: 'active',
  },
  cart: {
    wrapperActive: 'active',
  },
  booking: {
    loading: 'loading',       // klasa dla stanu ładowania
    tableBooked: 'booked',   // klasa dla zarezerwowanego stołu
  },
  nav: {
    active: 'active',         // aktywna klasa nawigacji
  },
  pages: {
    active: 'active',         // aktywna klasa podstrony
  },
};

export const settings = {
  amountWidget: {
    defaultValue: 1,
    defaultMin: 1,
    defaultMax: 9,
  },
  cart: {
    defaultDeliveryFee: 20,
  },
  hours: {
    open: 12,    // godzina otwarcia
    close: 24,   // godzina zamknięcia
  },
  datePicker: {
    maxDaysInFuture: 14,   // maksymalna liczba dni do przodu
  },
  booking: {
    tableIdAttribute: 'data-table',  // atrybut identyfikujący stół
  },
  db: {
    url: '//' + window.location.hostname + (window.location.hostname=='localhost' ? ':3131' : ''),
    products: 'products',
    orders: 'orders',
    bookings: 'bookings',
    events: 'events',
    dateStartParamKey: 'date_gte',
    dateEndParamKey: 'date_lte',
    notRepeatParam: 'repeat=false',
    repeatParam: 'repeat_ne=false',
  },
  
};



export const templates = {
  menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  bookingWidget: Handlebars.compile(document.querySelector(select.templateOf.bookingWidget).innerHTML),  // nowy szablon
  homeWidget: Handlebars.compile(document.querySelector('#template-home').innerHTML),
};