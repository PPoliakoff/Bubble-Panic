var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Sprite = (function () {
    function Sprite(x, y, radius, width, color) {
        if (color === void 0) { color = "red"; }
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.width = width;
        this.color = color;
    }
    Sprite.prototype.draw = function () {
        if (this.visible) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.width;
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.restore();
        }
    };
    return Sprite;
}());
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(x, y, radius, color) {
        if (color === void 0) { color = "blue"; }
        var _this = _super.call(this, x, y, radius, radius, color) || this;
        _this.dx = 0;
        _this.dy = 0;
        _this.visible = true;
        _this.maxWidth = radius;
        return _this;
    }
    Player.prototype.animate = function () {
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
    };
    Player.prototype.heal = function () {
        this.width += 3;
        if (this.width > this.maxWidth) {
            this.width = this.maxWidth;
        }
    };
    Player.prototype.dammage = function () {
        this.width -= 5; // comment for imortality
        if (this.width <= 0) {
            this.visible = false;
        }
    };
    return Player;
}(Sprite));
var Healers = (function (_super) {
    __extends(Healers, _super);
    function Healers(x, y, player) {
        var _this = _super.call(this, x, y, 12, 4, "blue") || this;
        _this.player = player;
        _this.dx = 1 - 2 * Math.random();
        _this.dy = 1 - 2 * Math.random();
        _this.visible = true;
        return _this;
    }
    Healers.prototype.animate = function () {
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
    };
    return Healers;
}(Sprite));
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle(x, y, radius, player) {
        var _this = _super.call(this, x, y, radius, 3, "red") || this;
        _this.player = player;
        _this.dx = 1 - 2 * Math.random();
        _this.dy = 1 - 2 * Math.random();
        _this.visible = true;
        return _this;
    }
    Circle.prototype.animate = function () {
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
    };
    return Circle;
}(Sprite));
var canvas;
var ctx;
var gameObjects = new Array();
function gameLoop() {
    requestAnimationFrame(gameLoop);
    redrawGame();
}
function redrawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < gameObjects.length; i++) {
        gameObjects[i].draw();
        gameObjects[i].animate();
    }
}
function mouseDown(event) {
    var x = (event.x - canvas.offsetLeft + window.pageXOffset) * canvas.width / canvas.offsetWidth;
    var y = (event.y - canvas.offsetTop + window.pageYOffset) * canvas.height / canvas.offsetHeight;
    var player = gameObjects[0];
    var dx = x - player.x;
    var dy = y - player.y;
    var vectorlength = Math.sqrt(dx * dx + dy * dy);
    if (vectorlength > 15) {
        player.dx = dx / vectorlength;
        player.dy = dy / vectorlength;
    }
}
function gameResize() {
    var newWidth = window.innerWidth * 0.95;
    var newHeight = window.innerHeight * 0.95;
    if (newWidth * 9 > newHeight * 16) {
        //width is too large
        newWidth = newHeight * 16 / 9;
    }
    else {
        //height is too large
        newHeight = newWidth * 9 / 16;
    }
    var gameDiv = document.getElementById("gameDiv");
    gameDiv.style.width = newWidth + "px";
    gameDiv.style.height = newHeight + "px";
    gameDiv.style.marginTop = (window.innerHeight - newHeight) / 2 + "px";
    gameDiv.style.marginLeft = (window.innerWidth - newWidth) / 2 + "px";
    //  canvas.height = canvas.offsetHeight;
    //  canvas.width = canvas.offsetWidth;
    redrawGame();
}
window.onload = function () {
    canvas = document.getElementById("myCanvas");
    canvas.addEventListener("mousedown", mouseDown, false);
    ctx = canvas.getContext("2d");
    //  window.addEventListener("orientationchange", gameResize, false);
    window.addEventListener("resize", gameResize, false);
    gameResize();
    gameObjects.push(new Player(canvas.width / 2, canvas.height / 2, 20));
    for (var i = 0; i < 5; i++) {
        gameObjects.push(new Circle(Math.random() * (canvas.width - 200) + 100, Math.random() * 50 + 77, Math.random() * 50 + 25, gameObjects[0]));
        gameObjects.push(new Circle(Math.random() * (canvas.width - 200) + 100, -Math.random() * 50 + canvas.height - 77, Math.random() * 50 + 25, gameObjects[0]));
        gameObjects.push(new Circle(Math.random() * 50 + 77, Math.random() * (canvas.height - 200) + 100, Math.random() * 50 + 25, gameObjects[0]));
        gameObjects.push(new Circle(-Math.random() * 50 - 77 + canvas.width, Math.random() * (canvas.height - 200) + 100, Math.random() * 50 + 25, gameObjects[0]));
        gameObjects.push(new Healers(-Math.random() * 50 - 77 + canvas.width, Math.random() * (canvas.height - 200) + 100, gameObjects[0]));
    }
    gameLoop();
};
//# sourceMappingURL=app.js.map