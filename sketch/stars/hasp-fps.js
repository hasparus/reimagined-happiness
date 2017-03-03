class HaspFPS extends HTMLElement {
  constructor() {
    super();

    var tooltipize = x => `${x[0].toUpperCase()
      + x.substr(1).replace(/([A-Z])/g, ' $1').toLowerCase()}`;
    ['registeredFrames', 'registeredFramesTime', 'deltaTime'].map(field => {
      eval(`
        this.${field} = document.createElement('span');
        this.${field}.setAttribute('title', '${tooltipize(field)}');
        this.appendChild(this.${field});
      `);
    });
  }
  connectedCallback() {
    this.frames = 0;
    this.frameTimesSum = 0;
    this.lastIntervalTime = window.performance.now();
    this.intervalId = setInterval(() => {
      var format = x => ("00000" + x.toPrecision(8)).slice(-11);

      this.registeredFrames.innerHTML = this.frames;
      this.registeredFramesTime.innerHTML = format(this.frameTimesSum);
      var intervalTime = window.performance.now();
      var intervalDuration = intervalTime - this.lastIntervalTime;
      this.deltaTime.innerHTML = format(intervalDuration / 1000.0);

      this.frames = 0;
      this.frameTimesSum = 0;
      this.lastIntervalTime = intervalTime;
    }, 1000);
  }
  disconnectedCallback() {
    clearInterval(this.intervalId);
  }
  registerFrame(frameTime) {
    this.frames++;
    this.frameTimesSum += frameTime;
  }
}

customElements.define('hasp-fps', HaspFPS);