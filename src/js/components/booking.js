import {templates, select } from "../settings.js";
import AmountWidget from "./AmountWidget.js";

class Booking {
    constructor(element){
    const thisBooking = this;
        thisBooking.render(element);
        thisBooking.initWidgets();
    }

    render(element){
    const thisBooking = this;   
        //tworzymy pusty obiekt dom
        thisBooking.dom = {};
        //przypisujemy referencje do kontenera
        thisBooking.dom.wrapper = element;
        // generujemy HTML z szablonu
        const generatedHTML = templates.bookingWidget();
        // Ustawiamy zawartosc
        thisBooking.dom.wrapper.innerHTML = generatedHTML;

        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    }
    initWidgets(){
        const thisBooking = this;
       
        thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);

        thisBooking.dom.peopleAmount.addEventListener('updated', function(){

        });

        thisBooking.dom.hoursAmount.addEventListener('updated', function(){

        });
    }
}

export default Booking;