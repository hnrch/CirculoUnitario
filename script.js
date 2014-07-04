
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
        window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall);  },
                                       timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


var UnitCircle = (function(global) {
    "use strict";

    global.INSTANCE;

    function UnitCircle() {
        // singleton pattern
        if (!(this instanceof UnitCircle)) {
            return new UnitCircle();
        }

        this.canvas = document.getElementById('c');
        this.context = this.canvas.getContext('2d');

        this.x = this.y = this.angleRad = 0;
        this.speed = Math.PI/360;
        this.radius = 140;

        this.run();
    }

    UnitCircle.prototype = {
        run: function() {
            console.log('running UnitCircle...');
            this.update();
        },

        update: function() {
            requestAnimationFrame(this.update.bind(this));
            this.draw();

            if (this.angleRad > Math.PI*2)
                this.angleRad = 0;

            this.x = this.radius * Math.cos(this.angleRad);
            this.y = this.radius * Math.sin(this.angleRad);

            this.angleRad += this.speed;
        },

        draw: function() {
            var ctx = this.context,
                canvas = {
                    width:   this.canvas.width,
                    height:  this.canvas.height,
                    centerX: this.canvas.width / 2,
                    centerY: this.canvas.height / 2
                };

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = 'rgb(213, 213, 213)';
            ctx.fillStyle = 'rgba(213, 213, 213, 0.5)';
            ctx.lineWidth = 100;
            ctx.lineCap = 'round';

            ctx.save();
            ctx.translate(canvas.centerX, canvas.centerY);

            this.drawCircle(ctx);
            this.drawAngle(ctx);
            this.drawSine(ctx);
            this.drawCosine(ctx);

            ctx.restore();

            this.showInfo();
        },

        // ------------------------------------------------

        drawCircle: function(ctx) {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI*2);
            ctx.closePath();
            ctx.stroke();
        },

        drawAngle: function(ctx) {
            ctx.moveTo(0, 0);
            ctx.lineTo(this.x*3, -this.y*3);
            ctx.stroke();
        },

        drawSine: function(ctx) {
            ctx.moveTo(this.x, 0);
            ctx.lineTo(this.x, -this.y);
            ctx.stroke();
        },

        drawCosine: function(ctx) {
            ctx.moveTo(0, 0);
            ctx.lineTo(this.x, 0);
            ctx.stroke();
        },

        showInfo: function(ctx) {
            var degrees = (this.angleRad * 180 / Math.PI).toFixed(2);
            var sine    = Math.sin(this.angleRad).toFixed(4);
            var cosine  = Math.cos(this.angleRad).toFixed(4);
            var tangent = Math.tan(this.angleRad).toFixed(4);
            var cosecant  = (1/sine).toFixed(4);
            var secant    = (1/cosine).toFixed(4);
            var cotangent = (1/tangent).toFixed(4);
            document.getElementById('deg').innerHTML = degrees;
            document.getElementById('sin').innerHTML = sine;
            document.getElementById('cos').innerHTML = cosine;
            document.getElementById('tan').innerHTML = tangent;
            document.getElementById('csc').innerHTML = cosecant;
            document.getElementById('sec').innerHTML = secant;
            document.getElementById('cot').innerHTML = cotangent;
        },

    }

    return {
        init: function () {
            if (!global.INSTANCE) {
                return global.INSTANCE = UnitCircle.apply(null, arguments);
            }
            return global.INSTANCE;
        },
        getInstance: function () {
            if (!global.INSTANCE) {
                return this.init.apply(this, arguments);
            }
            return global.INSTANCE;
        }
    };
}(window));


UnitCircle.init();

