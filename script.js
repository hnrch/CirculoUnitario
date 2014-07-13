
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
        if (!(this instanceof UnitCircle)) {
            return new UnitCircle();
        }

        this.canvas = document.getElementById('c');
        this.context = this.canvas.getContext('2d');
        this.angleRad = 0;
        this.speed = Math.PI/720;
        this.radius = 150;
        // todo: this.highlight = [];
        this.x = this.y = 0;
        this.info = {
            deg:0, sin:0, cos:0, tan:0, cot:0, sec:0, csc:0
        };

        this.update();
    }

    UnitCircle.prototype = {
        update: function() {
            var formulas = {
                deg: this.angleRad * 180 / Math.PI,
                sin: Math.sin(this.angleRad),
                cos: Math.cos(this.angleRad),
                tan: Math.tan(this.angleRad),
                cot: (1/Math.tan(this.angleRad)),
                sec: (1/Math.cos(this.angleRad)),
                csc: (1/Math.sin(this.angleRad)),
            }

            if (this.angleRad > Math.PI*2)
                this.angleRad = 0;

            this.x = this.radius * Math.cos(this.angleRad);
            this.y = this.radius * Math.sin(this.angleRad);

            for(var i in this.info) {
                this.info[i] = formulas[i];
            }

            //if(this.angleRad <= Math.PI/359)
            requestAnimationFrame(this.update.bind(this));
            this.draw();

            this.angleRad += this.speed;
        },

        draw: function() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            var ctx = this.context;
            var canvas = {
                width:  this.canvas.width,
                height: this.canvas.height,
            };

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(213, 213, 213, 0.4)';
            ctx.fillStyle = 'rgba(213, 213, 213, 0.5)';
            ctx.lineWidth = 7;
            ctx.lineCap = 'round';

            ctx.save();
            ctx.translate(canvas.width * 0.6, canvas.height * 0.5);

            // draw circle
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI*2);
            ctx.closePath();
            ctx.stroke();
            this.drawFunctions(ctx);

            ctx.restore();

            ctx.fillStyle = 'rgb(255, 255, 255)';
            this.showInfo(ctx);
        },

        // ------------------------------------------------

        drawFunctions: function(ctx) {
            var coords = {
                sin: [this.info.cos, 0, this.info.cos, -this.info.sin],
                cos: [0, 0, this.info.cos, 0],
                tan: [1, 0, 1, -this.info.tan],
                cot: [0, -1, this.info.cot, -1],
                sec: [0, 0, 1, -this.info.tan],
                csc: [0, 0, this.info.cot, -1],
            };

            for(var i in coords) {
                if (i === 'deg') continue;

                // multiply by radius and fix values
                // TODO: this code must be refactorized
                //       to something simpler
                coords[i] = coords[i].map(function(){

                    if (i === 'tan') {
                        if (this.angleRad > Math.PI/2 &&
                            this.angleRad < (3*Math.PI)/2) {
                            if (arguments[1] === 0 ||
                                arguments[1] === 2)
                                arguments[0] = -1;
                            if (arguments[1] === 3)
                                arguments[0] = -arguments[0];
                        }
                    }

                    if (i === 'cot') {
                        if (this.angleRad > Math.PI &&
                            this.angleRad < 2*Math.PI) {
                            if (arguments[1] === 1 ||
                                arguments[1] === 3)
                                arguments[0] = 1;
                            if (arguments[1] === 2)
                                arguments[0] = -arguments[0];
                        }
                    }

                    if (i === 'sec') {
                        if (this.angleRad > Math.PI/2 &&
                            this.angleRad < (3*Math.PI)/2) {
                            if (arguments[1] === 2)
                                arguments[0] = -1;
                            if (arguments[1] === 3)
                                arguments[0] = -arguments[0];
                        }
                    }

                    if (i === 'csc') {
                        if (this.angleRad > Math.PI &&
                            this.angleRad < 2*Math.PI) {
                            if (arguments[1] === 2)
                                arguments[0] = -arguments[0];
                            if (arguments[1] === 3)
                                arguments[0] = 1;
                        }
                    }

                    return arguments[0] * this.radius;
                }, this);

                ctx.moveTo(
                    coords[i][0],
                    coords[i][1]);
                ctx.lineTo(
                    coords[i][2],
                    coords[i][3]);
                ctx.stroke();
            }
        },

        showInfo: function(ctx) {
            var value,
                counter = 0,
                offset = 100;
            ctx.font = "bold 60px Arial";
            for(var i in this.info) {
                value = this.info[i];

                if (value)
                    value = value.toFixed(2);

                if (i === 'deg')
                    value += '\xb0';

                ctx.fillText(
                    value,
                    this.canvas.width * 0.1,
                    offset + ++counter * 60);
            };
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

