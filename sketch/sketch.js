/*jshint esversion: 6 */
var p;

var Canvas = {
  init() {
    createCanvas(1280, 640);
    document.querySelector('main')
      .appendChild(document.querySelector('canvas'));

    p = new Particle(createVector(width / 2, 20));

  },
  draw() {
    background(51);

    p.run();

    if (p.isDead()) {
      p = new Particle(createVector(width / 3, height * (1/3.0)));
      console.log("Particle dead!");
    }
  }
};


//~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~->

var Repeller = function(x, y) {
  this.power = 300;
  this.position = createVector(x, y);

  this.display = function() {
    stroke(255);
    strokeWeight(2);
    fill(127);
    ellipse(this.position.x, this.position.y, 32, 32);
  };

  this.repel = function(p) {
    var dir = p5.Vector.sub(this.position, p.position); // Calculate direction of force
    var d = dir.mag();                                // Distance between objects
    dir.normalize();                                  // Normalize vector (distance doesn't matter here, we just want this vector for direction)
    d = constrain(d, 1, 100);                         // Keep distance within a reasonable range
    var force = -1 * this.power/ (d * d);             // Repelling force is inversely proportional to distance
    dir.mult(force);                                  // Get force vector --> magnitude * direction
    return dir;
  };
};


var ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];

  this.addParticle = function () {
    this.particles.push(new Particle(this.origin));
  };
};

ParticleSystem.prototype.run = function () {
  for (var i = this.particles.length - 1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};

// A function to apply a force to all Particles
ParticleSystem.prototype.applyForce = function (f) {
  for (var i = 0; i < this.particles.length; i++) {
    this.particles[i].applyForce(f);
  }
};

ParticleSystem.prototype.applyRepeller = function (r) {
  for (var i = 0; i < this.particles.length; i++) {
    var p = this.particles[i];
    var force = r.repel(p);
    p.applyForce(force);
  }
};

var Particle = function (position) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, 0);
  this.position = position.copy();
  this.lifespan = 1555.0;
  this.mass = 1.0;

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
  this.angle += this.angularVelocity;
  this.angularAcceleration = constrain(this.acceleration.x / 10, 0, 1);
};

// Method to display
Particle.prototype.display = function () {
  stroke(255, this.lifespan);
  strokeWeight(2);
  fill(127, this.lifespan);
  
  push();
  translate(this.position.x, this.position.y);
  rotate(this.angle);
  let size = {width: 25, height: 25};
  rect(-size.width / 2, -size.height / 2, size.width, size.height);
  pop();

};

// Is the particle still useful?
Particle.prototype.isDead = function () {
  return this.lifespan < 0.0;
};

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
      this.frameTime = (window.performance.now() - this.frameStartTime) / 10;
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