import BaseWidget from './BaseWidget.js';
import { select, settings } from '../settings.js';
import  utils  from '../utils.js';
import { SimpleRangeSlider } from '../../vendor/range-slider.js';

class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);

    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);

    thisWidget.initPlugin();
    thisWidget.renderValue();

    thisWidget.dom.input.addEventListener('input', () => {
      thisWidget.correctValue = parseFloat(thisWidget.dom.input.value);
      thisWidget.renderValue();
    });
  }

  initPlugin() {
    const thisWidget = this;
    thisWidget.slider = new SimpleRangeSlider(thisWidget.dom.input);
  }

  parseValue(value) {
    return utils.numberToHour(value);
  }

  isValid(value) {
    return (
      !isNaN(value) &&
      value >= settings.hours.open &&
      value <= settings.hours.close
    );
  }

  renderValue() {
    const thisWidget = this;
    thisWidget.dom.output.innerHTML = thisWidget.parseValue(thisWidget.value);
  }
}

export default HourPicker;
