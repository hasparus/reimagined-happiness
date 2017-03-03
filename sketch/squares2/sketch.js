/*jshint esversion: 6 */
var p;

var Canvas = {
  init() {
    createCanvas(1280, 640);
    document.querySelector('main')
      .appendChild(document.querySelector('canvas'));

    ps = new ParticleSystem(createVector(width / 2, -20));
    for (let i = 0; i < 30; ++i) ps.addParticle();

    slider = createSlider(0, TWO_PI, PI / 4, 0.01);
    player = new Platform();

  },
  draw() {
    background(25, 95, 141);

    var gravity = createVector(0, 0.0005);
    ps.applyForce(gravity);

    player.run();
    for (let particle of ps.particles) {
      player.hitIfCollides(particle);
    }
    ps.run();
  }
};

//~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~->

Texter = {
  texts: ['m8, rly?', 'Try harder.', "Disgraceful.", '"AMAZING. NO JOKES."',
  "Keep your anger to yourself.", "It's okay. Almost.", "You're not losing that much.",
  "Well, at least you're pretty."],

}

class Platform {
  constructor() {
    this.position = createVector(mouseX, height - 10);
    this.size = createVector(width / 10, 10);
    this.power = 10;
  }
  update() {
    this.position.x = mouseX;
  }
  display() {
    push();
    stroke(255);
    rect(this.position.x, this.position.y, this.size.x, this.size.y);
    pop();
  }
  collidesWithMe(x, y, width, height) {
    return collideRectRect(x, y, width, height, 
      this.position.x, this.position.y, this.size.x, this.size.y);
  }
  hitIfCollides(particle) {
    if (this.collidesWithMe(particle.position.x /*- 12.5*/,
                       particle.position.y /*- 12.5*/,
                       30, 30)) {
                         particle.applyForce(createVector(0, -1));
                       }
  }
  run() {
    this.update();
    this.display();
  }
}

var ParticleSystem = function (position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function (particle = new Particle(this.origin)) {
  this.origin = createVector(width * Math.random() - 20);
  this.particles.push(particle = new Particle(createVector(width * Math.random() - 20), 0));
};

ParticleSystem.prototype.run = function () {
  for (var i = this.particles.length - 1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
      this.addParticle();
    }
  }
};

// A function to apply a force to all Particles
ParticleSystem.prototype.applyForce = function (f) {
  for (var i = 0; i < this.particles.length; i++) {
    this.particles[i].applyForce(f);
  }
};

var Particle = function (position) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, 0);

  this.position = position.copy();
  this.lifespan = 275 + 600 * Math.random();
  this.mass = 0.5 + 1 * Math.random();

  let wind = createVector(0.003, 0);
  this.applyForce(wind);

  this.angle = 0;
  this.angularVelocity = 0;
  this.angularAcceleration = 0;
};

Particle.prototype.run = function () {
  this.update();
  this.display();
};

Particle.prototype.applyForce = function (force) {
  this.acceleration.add(p5.Vector.div(force, this.mass));
};

Particle.prototype.update = function () {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;

  this.angularVelocity += this.angularAcceleration;
  this.angle += constrain(this.angularVelocity * 1.5 * Math.random() / 4, -0.2, 0.2);
  this.angularAcceleration = constrain(this.acceleration.x / 10, 0, 1);
};

// Method to display
Particle.prototype.display = function () {
  /*angle = slider.value();
  stroke(255, this.lifespan);
  fill(255, this.lifespan / 2);
  translate(this.position.x, this.position.y);
  let step = PI / 2;
  for (let deg = 0; deg <= TWO_PI; deg += step) {
    rotate(step);
    push();
    this.branch(8);
    pop();
  }*/
  stroke(255, this.lifespan);
  strokeWeight(2);
  fill(240, this.lifespan / 4 - 60);

  push();
  translate(this.position.x, this.position.y);
  rotate(this.angle);
  let size = {
    width: 25,
    height: 25
  };
  rect(-size.width / 2, -size.height / 2, size.width, size.height);
  pop();

};

// Is the article still useful?
Particle.prototype.isDead = function () {
  return this.lifespan < 0.0;
};

Particle.prototype.branch = function (len) {
  line(0, 0, 0, len);
  translate(0, len);
  if (len > 2) {
    push();
    rotate(angle);
    this.branch(len * 0.67);
    pop();
    push();
    rotate(-angle);
    this.branch(len * 0.67);
    pop();
  }
}

  //~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~->

  verbose = false;
  var Logger = {
    init() {
      this.frame = 0;
      this.fpsCounter = document.querySelector('hasp-fps');
    },
    startFrame() {
      if (this.fpsCounter) {
        this.frameStartTime = window.performance.now();
      }
      if (this.group === true) {
        console.group(`frame: ${this.frame}`);
        console.time();
      }
    },
    endFrame() {
      this.frame++;
      if (this.fpsCounter) {
        this.frameTime = (window.performance.now() - this.frameStartTime) / 1000;
        if (verbose) {
          console.log(this.frameTime);
          console.log(frameRate());
        }
        this.fpsCounter.registerFrame(this.frameTime);
      }
      if (this.group === true) {
        if (verbose) {
          console.timeEnd();
          console.groupEnd();
        }
      }
    }
  };

  //~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~->


  function setup() {
    Canvas.init();
    Logger.init();
  }

  function draw() {
    Logger.startFrame();
    Canvas.draw();
    Logger.endFrame();
  }
/*
function Snowflake(position) {
  Particle.call(this, [position]);
}


Snowflake.prototype.display = function () {
  angle = slider.value();
  stroke(255);
  translate(width / 2, height / 2);
  let step = PI / 2;
  for (let deg = 0; deg <= TWO_PI; deg += step) {
    rotate(step);
    push();
    this.branch(50);
    pop();
  }
};

Snowflake.prototype.branch = function (len) {
  line(0, 0, 0, len);
  translate(0, len);
  if (len > 4) {
    push();
    rotate(angle);
    this.branch(len * 0.67);
    pop();
    push();
    rotate(-angle);
    this.branch(len * 0.67);
    pop();
  }
};

Snowflake.prototype = Object.create(Particle.prototype);
*/