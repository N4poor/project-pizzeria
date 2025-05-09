import {templates, select, settings, classNames } from "../settings.js";
import utils from "../utils.js";
import AmountWidget from "./AmountWidget.js";
import DatePicker from "./DatePicker.js";
import HourPicker from "./HourPicker.js";
class Booking {
    constructor(element) {
      const thisBooking = this;

      thisBooking.selectedTable = null;
      thisBooking.render(element);
      thisBooking.initWidgets();
      thisBooking.getData();
    }

    sendBooking(){
      const thisBooking = this;

      const url = settings.db.url + '/' + settings.db.bookings;

      const hourStr = utils.numberToHour(thisBooking.hour); // "12:30"

      const payLoad = {
        date: thisBooking.date,
        hour: hourStr,
        table: thisBooking.selectedTable !==null ? parseInt(thisBooking.selectedTable) : null,
        duration: parseInt(thisBooking.hoursAmount.value),
        ppl: parseInt(thisBooking.peopleAmount.value),
        starters: [],
        phone: thisBooking.dom.wrapper.querySelector('input[name="phone"]').value,
        address: thisBooking.dom.wrapper.querySelector('input[name="address"]').value,
      };

      const starterInputs = thisBooking.dom.wrapper.querySelectorAll('input[name="starter"]:checked');
      for (let input of starterInputs){
        payLoad.starters.push(input.value);
      }

      const options = {
        method: "POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(payLoad),
      };

      fetch(url,options)
      .then(response => response.json())
      .then(parsedResponse => {
        console.log('booking confirmed:', parsedResponse);
        
        thisBooking.makeBooked(payLoad.date, hourStr, payLoad.duration, payLoad.table);

        thisBooking.updateDOM();

        alert('Rezerwacja potwierdzona!');
      });
    }

    initTables(){
      const thisBooking = this;

      const floorPlan = thisBooking.dom.wrapper.querySelector('.floor-plan');
      floorPlan.addEventListener('click', function(event) {
        const clickedElement = event.target;

        if(!clickedElement.classList.contains('table'))
          return;

        if(clickedElement.classList.contains(classNames.booking.tableBooked)){
          alert('this table is already booked!');
          return;
        }
        
        const tableId = parseInt(clickedElement.getAttribute(settings.booking.tableIdAttribute));

        if(thisBooking.selectedTable === tableId) {
          clickedElement.classList.remove('selected');
          thisBooking.selectedTable = null;
          return;
        }

        for(let table of thisBooking.dom.tables){
          table.classList.remove('selected');
        }

        thisBooking.selectedTable = tableId;
        clickedElement.classList.add('selected');

      });
    }
  
    getData() {
      const thisBooking = this

      const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
      const endDateParam = settings.db.dateEndParamKey   + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

      const params = {
        booking: [
          startDateParam,
          endDateParam,
        ],
        eventsCurrent:[
          settings.db.notRepeatParam,
          startDateParam,
          endDateParam,
        ],
        eventsRepeat:[
          settings.db.repeatParam,
          endDateParam,
        ],
      };

      //console.log('getData params', params);

      const urls = {
        booking:        settings.db.url + '/' + settings.db.bookings 
                                        + '?' + params.booking.join('&'),
        eventsCurrent:  settings.db.url + '/' + settings.db.events 
                                        + '?' + params.eventsCurrent.join('&'),
        eventsRepeat:   settings.db.url + '/' + settings.db.events 
                                        + '?' + params.eventsRepeat.join('&'),
      };

     //console.log ('getData urls', urls);

      Promise.all([
        fetch(urls.booking),
        fetch(urls.eventsCurrent),
        fetch(urls.eventsRepeat),
      ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
      //  console.log(bookings);
      // console.log(eventsCurrent);
      //  console.log(eventsRepeat);
      thisBooking.parsData(bookings, eventsCurrent, eventsRepeat);
      });
    }
  
    parsData(bookings, eventsCurrent, eventsRepeat){
      const thisBooking = this;

      thisBooking.booked = {};
      
      for(let item of bookings){
        thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
      }

      for(let item of eventsCurrent){
        thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
      }

      const minDate = thisBooking.datePicker.minDate;
      const maxDate = thisBooking.datePicker.maxDate;

      for(let item of eventsRepeat){
        if(item.repeat == 'daily'){
          for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
        thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }

       console.log('thisBooking.booked', thisBooking.booked);

      thisBooking.updateDOM();

    }

    makeBooked(date, hour, duration, table){
      const thisBooking = this;

      if(typeof thisBooking.booked[date] == 'undefined'){
        thisBooking.booked[date] = {};
      }

      const startHour = utils.hourToNumber(hour);

      for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
         // console.log('loop', hourBlock);

        if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
          thisBooking.booked[date][hourBlock] = [];
        }
        thisBooking.booked[date][hourBlock].push(table);

      }  
    }

    updateDOM(){
      const thisBooking = this

      thisBooking.date = thisBooking.datePicker.value;
      thisBooking.hour = thisBooking.hourPicker.value;

      let allAvailable = false;

      if(
        typeof thisBooking.booked[thisBooking.date] == 'undefined'
        ||
        typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
      ){
        allAvailable = true;
      }
      for(let table of thisBooking.dom.tables){
        let tableId = table.getAttribute(settings.booking.tableIdAttribute);
        if(!isNaN(tableId)){
          tableId = parseInt(tableId);         
        }

        if(
          !allAvailable
          &&
          thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
        ){
          table.classList.add(classNames.booking.tableBooked);
        } else {
          table.classList.remove(classNames.booking.tableBooked);
        }
      }

      for(let table of thisBooking.dom.tables){
        table.classList.remove('selected');
      }

      thisBooking.selectedTable = null;

    }

    render(element) {
      const thisBooking = this;
  
      const generatedHTML = templates.bookingWidget();
      thisBooking.dom = {};
      thisBooking.dom.wrapper = element;
      thisBooking.dom.wrapper.innerHTML = generatedHTML;
  
      thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
      thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
  
      // Get references to date and hour pickers
      thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
      thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
      thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
      
    }
  
    initWidgets() {
      const thisBooking = this;
  
      thisBooking.initTables();

      thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
      thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  
      // Initialize DatePicker and HourPicker
      thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
      thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

      thisBooking.dom.wrapper.addEventListener('updated', function(){
        thisBooking.updateDOM();
      });
    
    thisBooking.dom.datePicker.addEventListener('change', function () {
      thisBooking.updateDOM();
    });
  
    thisBooking.dom.hourPicker.addEventListener('input', function () {
      thisBooking.updateDOM();
    });
    
    thisBooking.dom.wrapper.querySelector('form.booking-form').addEventListener('submit', function(event){
      event.preventDefault();

      if (thisBooking.selectedTable === null) {
        alert('Wybierz stolik przed wysłaniem rezerwacji.');
        return;
      }

      thisBooking.sendBooking();
    });
  }
  }
  
  export default Booking;