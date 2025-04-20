import { templates, home } from '../settings.js';

class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);
    thisHome.initWidgets();
    
  }

  render(element) {
    const thisHome = this;

    const generatedHTML = templates.homeWidget(); // szablon Handlebars
    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;
  }
  

  initWidgets() {
    const thisHome = this;
  
    // Uruchom karuzelę
    const Flickity = window.Flickity;

    thisHome.flickity = new Flickity(thisHome.dom.wrapper.querySelector('.carousel'), {
      cellAlign: 'center',
      contain: true,
      autoPlay: 3000,
      wrapAround: true,
      pageDots: true
    });
    thisHome.initLinks();
  }

  initLinks() {
    const thisHome = this;

    console.log('initLinks działa');

    const handleClick = (selector, page) => {
      const element = thisHome.dom.wrapper.querySelector(selector);

      if (element) {
        console.log(`Przycisk ${selector} znaleziony`);

        element.addEventListener('click', function (event) {
          event.preventDefault();
          console.log(`Kliknięto: ${selector}, przejście na stronę #/${page}`);
          window.location.hash = '#/' + page;
        });
      } else {
        console.warn(`Nie znaleziono elementu: ${selector}`);
      }
    };

    handleClick(home.links.orderOnline.selector, home.links.orderOnline.page);
    handleClick(home.links.bookTable.selector, home.links.bookTable.page);
  }
}

export default Home;