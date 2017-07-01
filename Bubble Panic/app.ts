abstract class Sprite {
    x: number;
    y: number;
    dx: number;
    dy: number;
    visible: boolean;
    radius: number;
    color: string;
    width: number;

    constructor(x: number, y: number, radius: number, width: number, color: string = "red") {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.width = width;
        this.color = color;
    }

    draw(): void {
        if (this.visible) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.width;
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.restore();
        }
    }

    abstract animate(): void;
}


class Player extends Sprite {

    readonly maxWidth: number;

    constructor(x: number, y: number, radius: number, color: string = "blue") {
        super(x, y, radius, radius, color);
        this.dx = 0;
        this.dy = 0;
        this.visible = true;
        this.maxWidth = radius;
    }
    animate(): void {
        if (this.visible) {

            if (((this.x + this.dx + this.radius) > canvas.width && this.dx > 0)
                || ((this.x + this.dx - this.radius) < 0 && this.dx < 0)) {
                this.dx = -this.dx;
            }
            this.x += this.dx;

            if (((this.y + this.dy + this.radius) > canvas.height && this.dy > 0)
                || ((this.y + this.dy - this.radius) < 0 && this.dy < 0)) {
                this.dy = -this.dy;
            }

            this.y += this.dy;
        }
    }
    heal(): void {
        this.width += 3;
        if (this.width > this.maxWidth) {
            this.width = this.maxWidth;
        }
    }

    dammage(): void {
        this.width -= 5;
        if (this.width <= 0) {
            this.visible = false;
        }
    }

}

class Healers extends Sprite {
    player: Player;

    constructor(x: number, y: number, player: Player) {
        super(x, y, 12, 4, "blue");
        this.player = player;
        this.dx = 1 - 2 * Math.random();
        this.dy = 1 - 2 * Math.random();
        this.visible = true;
    }
    animate(): void {
        if (this.visible) {
            if (((this.x + this.dx + this.radius) > canvas.width && this.dx > 0)
                || ((this.x + this.dx - this.radius) < 0 && this.dx < 0)) {
                this.dx = -this.dx;
            }
            this.x += this.dx;

            if (((this.y + this.dy + this.radius) > canvas.height && this.dy > 0)
                || ((this.y + this.dy - this.radius) < 0 && this.dy < 0)) {
                this.dy = -this.dy;
            }

            this.y += this.dy;


            if ((this.x - this.player.x) * (this.x - this.player.x) + (this.y - this.player.y) * (this.y - this.player.y) < (this.radius + this.player.radius) * (this.radius + this.player.radius)) {
                this.visible = false;
                this.player.heal();
            }
        }
    }
}


class Circle extends Sprite {

    player: Player;

    constructor(x: number, y: number, radius: number, player: Player) {
        super(x, y, radius, 3, "red");
        this.player = player;
        this.dx = 1 - 2 * Math.random();
        this.dy = 1 - 2 * Math.random();
        this.visible = true;
    }
    animate(): void {
        if (this.visible) {
            if (((this.x + this.dx + this.radius) > canvas.width && this.dx > 0)
                || ((this.x + this.dx - this.radius) < 0 && this.dx < 0)) {
                this.dx = -this.dx;
                this.radius *= 1.1;
            }
            this.x += this.dx;

            if (((this.y + this.dy + this.radius) > canvas.height && this.dy > 0)
                || ((this.y + this.dy - this.radius) < 0 && this.dy < 0)) {
                this.dy = -this.dy;
                this.radius *= 1.1;
            }

            this.y += this.dy;

            if (this.radius > 200) {
                this.visible = false;
            }
            else {
                if ((this.x - this.player.x) * (this.x - this.player.x) + (this.y - this.player.y) * (this.y - this.player.y) < (this.radius + this.player.radius) * (this.radius + this.player.radius)) {
                    this.visible = false;
                    this.player.dammage();
                }
            }
        }
    }
}

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let gameObjects: Array<Sprite> = new Array<Sprite>();

function gameLoop() {
    requestAnimationFrame(gameLoop)
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1280, 720);
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].draw();
        gameObjects[i].animate();
    }
}

function mouseDown(event: MouseEvent): void {
    let x: number = event.x - canvas.offsetLeft + window.pageXOffset;;
    let y: number = event.y - canvas.offsetTop + window.pageYOffset;

    let player: Circle = (<Circle>gameObjects[0])
    let dx: number = x - player.x;
    let dy: number = y - player.y;
    let vectorlength = Math.sqrt(dx * dx + dy * dy);
    if (vectorlength > 15) {
        player.dx = dx / vectorlength;
        player.dy = dy / vectorlength;
    }
}

window.onload = () => {
    canvas = <HTMLCanvasElement>document.getElementById("my_canvas");
    canvas.addEventListener("mousedown", mouseDown, false);

    ctx = canvas.getContext("2d");
    gameObjects.push(new Player(canvas.width / 2, canvas.height / 2, 20))
    for (let i = 0; i < 5; i++) {
        gameObjects.push(new Circle(Math.random() * (canvas.width - 200) + 100, Math.random() * 50 + 77, Math.random() * 50 + 25, <Player>gameObjects[0]));
        gameObjects.push(new Circle(Math.random() * (canvas.width - 200) + 100, -Math.random() * 50 + canvas.height - 77, Math.random() * 50 + 25, <Player>gameObjects[0]));
        gameObjects.push(new Circle(Math.random() * 50 + 77, Math.random() * (canvas.height - 200) + 100, Math.random() * 50 + 25, <Player>gameObjects[0]));
        gameObjects.push(new Circle(-Math.random() * 50 - 77 + canvas.width, Math.random() * (canvas.height - 200) + 100, Math.random() * 50 + 25, <Player>gameObjects[0]));
        gameObjects.push(new Healers(-Math.random() * 50 - 77 + canvas.width, Math.random() * (canvas.height - 200) + 100, <Player>gameObjects[0]));
    }
    gameLoop();
};