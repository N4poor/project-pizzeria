import { templates } from '../settings.js';

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
  }

}



export default Home;