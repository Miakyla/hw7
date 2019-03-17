var chime;

var sounds = [];
var circles = [];
var r=255;
var g=255;
var b=255;
function preload() {
  soundFormats('mp3');
  for (var i = 0; i < 10; i++) {
    sounds.push(loadSound(i + '.mp3'));
  }
}

function setup() {
  createCanvas(400, 400);
  for (var i = 0; i < sounds.length; i++) {
    let r = round(random(10, 30));
    let sound = sounds[i];
    sound.rate(0.25*pow(2, (30-r)/12));
    
    circles.push({
      r: r,
      pos: createVector(random(r*2, width - r*2), random(r*2, height - r*2)),
      vel: createVector(random(-.3, .3), random(-.3, .3)),
      chime: sound
    });
  }
}

function draw() {
  background(220);
  noStroke();
  var t = millis();
  for (var i = 0; i < circles.length; i++) {
    let circle = circles[i];

    circle.pos.add(circle.vel);

    if (circle.pos.x > width - circle.r) {
      circle.vel.x = -abs(circle.vel.x);
      circle.triggered = t;
    }
    if (circle.pos.x < circle.r) {
      circle.vel.x = abs(circle.vel.x);
      circle.triggered = t;
    }
    if (circle.pos.y > height - circle.r) {
      circle.vel.y = -abs(circle.vel.y);
      circle.triggered = t;
    }
    if (circle.pos.y < circle.r) {
      circle.vel.y = abs(circle.vel.y);
      circle.triggered = t;
    }
    for (var j = i + 1; j < circles.length; j++) {
      let other = circles[j];
      let d = circle.r + other.r;
      if (circle.pos.dist(other.pos) < d) {
        circle.triggered = t;
        other.triggered = t;
        
        // bounce circles off each other. yay math!
        let col = p5.Vector.lerp(circle.pos, other.pos, circle.r / d);
        let cn = p5.Vector.sub(circle.pos, col).normalize();
        let on = p5.Vector.sub(other.pos, col).normalize();
        circle.vel.sub(p5.Vector.mult(cn, 2 * circle.vel.dot(cn)));
        other.vel.sub(p5.Vector.mult(on, 2 * other.vel.dot(on)));
        while (circle.pos.dist(other.pos) < d) {
          circle.pos.add(p5.Vector.mult(circle.vel, 0.01));
          other.pos.add(p5.Vector.mult(other.vel, 0.01));
        }
      }
    }

    if (circle.triggered == t) {
      circle.chime.play();
    }
    if (millis() - circle.triggered < 200) {
      fill(random(100,190), random(150,220), random(100,225));
    } else {
      fill(r,g,b);
    }
    ellipse(circle.pos.x, circle.pos.y, circle.r * 2);
  }
}

function keyPressed() {
  for(i=0; i<10; i++){
  if (key == i) {
  circles.splice(i-1,1);
  }
  }
}

function mousePressed(){
  r=random(40,200);
  g=random(40,200);
  b=random(40,200);
}
