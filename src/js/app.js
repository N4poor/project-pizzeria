import {settings, select, classNames,} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/booking.js';
import Home from './components/Home.js';

  const app = {

    initHome: function () {
      const thisApp = this;
      const homeContainer = document.querySelector(select.containerOf.home);
      thisApp.home = new Home(homeContainer);
    },

    initBooking: function(){
      const thisApp = this;
      
      // znajdź kontener widgetu rezerwacji
      const bookingContainer = document.querySelector(select.containerOf.booking);

      // utwórz nową instancję klasy Booking
      thisApp.booking = new Booking(bookingContainer);
    },

    initPages: function(){
      const thisApp = this;

      thisApp.pages = document.querySelector(select.containerOf.pages).children;
      thisApp.navList = document.querySelectorAll(select.nav.links);

      let idFromHash = window.location.hash.replace('#/', '');
      if (!idFromHash) idFromHash = 'home';

      let pageMatchingHash = thisApp.pages[0].id;

      for(let page of thisApp.pages){
        if(page.id == idFromHash){
          pageMatchingHash = page.id;
          break;
        }
      }

      thisApp.activatePage(pageMatchingHash);

      for(let link of thisApp.navList){
        link.addEventListener('click', function(event){
          const clickedElement = this;
          event.preventDefault();

          /*get page id from href attribute */
          const id = clickedElement.getAttribute('href').replace('#', '');
          
          /* run thisApp.activatePage with that id */
          thisApp.activatePage(id);

          /* change URL hash */
          window.location.hash = '#/' + id;
        });
      }

      window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.replace('#/', '');
        app.activatePage(newHash);
      });
    },

    activatePage: function(pageId){
      const thisApp = this;

      /* add class active to matching pages, remove from non-matching */
      for(let page of thisApp.pages){
        page.classList.toggle(classNames.pages.active, page.id == pageId);
      }

      /* add class active to matching links, remove from non-matcing */
      for(let link of thisApp.navList){
        link.classList.toggle(
          classNames.nav.active,
          link.getAttribute('href') == '#' + pageId
        );
      }
    },

    initData: function () {
      const thisApp = this;

      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.products;

      fetch(url)
        .then(function (rawResponse) {
          return rawResponse.json();
        })
        .then(function (parsedResponse) {
          console.log('parsedResponse', parsedResponse);

          /* save parsedResponse as thisApp.data.products */
          thisApp.data.products = parsedResponse;

          /* execute initMenu method */
          thisApp.initMenu();

        });

      console.log('thisApp.data', JSON.stringify(thisApp.data));
    },

    initMenu: function () {
      const thisApp = this;

      for (let productData in thisApp.data.products) {
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }
    },

    initCart: function () {
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);

      thisApp.productList = document.querySelector(select.containerOf.menu);
      thisApp.productList.addEventListener('add-to-cart', function(event){
        app.cart.add(event.detail.product);
      });
    },

    init: function () {
      const thisApp = this;
      // console.log('***App starting ***');
      // console.log('thisApp:', thisApp);
      // console.log('classNames:', classNames);
      // console.log('settings:', settings);
      // console.log('templates:', templates);

      thisApp.initData();
      //thisApp.initMenu(); Moved to initData
      thisApp.initCart();
      thisApp.initPages();
      thisApp.initBooking();
      thisApp.initHome();
    },
  };

  app.init();

  export { app };