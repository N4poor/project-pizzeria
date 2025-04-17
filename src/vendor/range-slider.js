// Vendor/range-slider.js

export class SimpleRangeSlider {
  constructor(input) {
    this.input = input;
    this.updateBackground();
    this.input.addEventListener('input', () => this.updateBackground());
  }

  updateBackground() {
    const min = parseFloat(this.input.min) || 0;
    const max = parseFloat(this.input.max) || 100;
    const val = parseFloat(this.input.value);
    const percent = ((val - min) / (max - min)) * 100;
    this.input.style.setProperty('--value', `${percent}%`);
  }
}
