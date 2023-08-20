const image = new Image();
image.src = b64;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 1000;
image.addEventListener('load', function() {
    // ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    // const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    

    class Particle {
        constructor(effect, x, y, color) {
            this.effect = effect;
            this.x = Math.floor(x);
            this.y = Math.floor(y);
            this.originX = Math.floor(x);
            this.originY = Math.floor(y);
            this.color = color;
            this.size = this.effect.gap;
            this.vx = 0; //Math.random() * 2 - 1;
            this.vy = 0; //Math.random() * 2 - 1;
            this.ease = 0.05;
            this.friction = 0.8;
            this.dx = 0;
            this.dy = 0;
            this.distance = 0;
            this.force = 0;
            this.angle = 0;
        }
        update() {
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.distance = this.dx * this.dx + this.dy * this.dy;
            this.force = -this.effect.mouse.radius / this.distance;

            if( this.distance < this.effect.mouse.radius ) {
                this.angle = Math.atan2(this.dy, this.dx);
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);
            }

            this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
            this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    class Effect {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.particlesArray = [];
            this.image = image;
            this.centerX = this.width * 0.5;
            this.centerY = this.height * 0.5;
            this.x = this.centerX - this.image.width * 0.5;
            this.y = this.centerY - this.image.height * 0.5;
            this.gap = 4;
            this.mouse = {
                radius: 18000,
                x: undefined,
                y: undefined,
            };
            
            window.addEventListener('mousemove', event => {
                this.mouse.x = event.x;
                this.mouse.y = event.y;
            });
        }
        init() {
            ctx.drawImage(this.image, this.x, this.y);
            const pixels = ctx.getImageData(0, 0, this.width, this.height).data;
            for( let y = 0; y < this.height; y += this.gap ) {
                for( let x = 0; x < this.width; x +=  this.gap ) {
                    const index = (y * this.width + x) * 4;
                    const red = pixels[index];
                    const green = pixels[index+1];
                    const blue = pixels[index+2];
                    const alpha = pixels[index+3];
                    const color = `rgb(${red},${green},${blue})`;

                    if( alpha > 0 ) {
                        this.particlesArray.push(new Particle(this, x, y, color));
                    }
                }

            }
        }
        draw() {
            this.particlesArray.forEach(particle => particle.draw());
        }
        update() {
            this.particlesArray.forEach(particle => particle.update());
        }
    }

    const effect = new Effect(canvas.width, canvas.height);
    effect.init();

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.draw();
        effect.update();
        requestAnimationFrame(animate);
    }

    animate();
});

// image.addEventListener('load', function() {
//     ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
//     const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//     let particleArray = [];
//     const numberOfPaticles  = 5000;
//
//     let mappedImage = [];
//     for( let y = 0; y < canvas.height; y++ ) {
//         let row = [];
//         for( let x = 0; x < canvas.width; x++ ) {
//             const red = pixels.data[(y*4*pixels.width) + (x*4)];
//             const green = pixels.data[(y*4*pixels.width) + (x*4+1)];
//             const blue = pixels.data[(y*4*pixels.width) + (x*4+2)];
//             const brightness = calculateRelativeBrightness(red, green, blue);
//             const cell = [
//                 cellBrightness = brightness,
//                 cellColor = `rgb(${red}, ${green}, ${blue})`
//             ];
//             row.push(cell);
//         }
//         mappedImage.push(row);
//     }
//
//     function calculateRelativeBrightness(red, green, blue) {
//         return Math.sqrt(
//             (red * red) * 0.299 +
//             (green * green) * 0.587 +
//             (blue * blue) * 0.114
//         )/100;
//     }
//
//     class Particle {
//         constructor() {
//             this.x = Math.random() * canvas.width;
//             this.y = 0;
//             this.speed = 0;
//             this.velocity = Math.random() * 0.5;
//             this.size = Math.random() * 1.5 + 1;
//             this.position1 = Math.floor(this.y);
//             this.position2 = Math.floor(this.x);
//         }
//
//         update() {
//             this.position1 = Math.floor(this.y);
//             this.position2 = Math.floor(this.x);
//             this.speed = mappedImage[this.position1][this.position2][0];
//             let movement = (2.5 - this.speed) + this.velocity;
//
//             this.y += movement;
//             if( this.y >= canvas.height ) {
//                 this.y = 0;
//                 this.x = Math.random() * canvas.width;
//             }
//         }
//
//         draw() {
//             ctx.beginPath();
//             ctx.fillStyle = mappedImage[this.position1][this.position2][1];;
//             ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//             ctx.fill();
//         }
//     }
//
//     function init() {
//         for( let i = 0; i < numberOfPaticles; i++ ) {
//             particleArray.push(new Particle());
//         }
//     }
//
//     init();
//     function animate() {
//         ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
//         ctx.globalAlpha = 0.05;
//         ctx.fillStyle = 'rgb(0, 0, 0)';
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//         ctx.globalAlpha = 0.2;
//         for( let i = 0; i < particleArray.length; i++ ) {
//             particleArray[i].update();
//             ctx.globalAlpha = particleArray[i].speed * 0.03;
//             particleArray[i].draw();
//         }
//         requestAnimationFrame(animate);
//     }
//     animate();
// });
