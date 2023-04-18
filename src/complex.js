"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var complex = /** @class */ (function () {
    /**
    * Construct a new complex number from two real numbers
    * @param real - The real component
    * @param imaginary - The imaginary component
    * @returns Complex number constructed from given parameters
    */
    function complex(real, imaginary) {
        this._real = real;
        this._img = imaginary;
    }
    Object.defineProperty(complex.prototype, "real", {
        /**
        * Get the real component of the complex number
        * @returns The real component - this._real
        */
        get: function () {
            return this._real;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(complex.prototype, "img", {
        /**
        * Get the imaginary component of the complex number
        * @returns The imaginary component - this._imaginary
        */
        get: function () {
            return this._img;
        },
        enumerable: false,
        configurable: true
    });
    /**
    * Add two complex numbers
    * @param other - The 2nd complex number operand
    * @returns x + other
    */
    complex.prototype.add = function (other) {
        return new complex(this._real + other.real, this._img + other.img);
    };
    /**
    * Subtract two complex numbers
    * @param other - The 2nd complex number operand
    * @returns x - other
    */
    complex.prototype.sub = function (other) {
        return new complex(this._real - other.real, this._img - other.img);
    };
    /**
    * Multiply two complex numbers
    * @param other - The 2nd complex number operand
    * @returns The product of x / other
    */
    complex.prototype.mult = function (other) {
        return new complex(this.real * other.real - this._img * other.img, this.real * other.img + this._img * other.real);
    };
    /**
    * Divide two complex numbers
    * @param other - The 2nd complex number operand
    * @returns The result of the division x / other
    */
    complex.prototype.div = function (other) {
        /* Complex division:
            ac + bd     bc - ad
            -------- + -------- i
            c^2 + d^2  c^2 + d^2
        */
        var ac = this._real * other.real;
        var bd = this._img * other.img;
        var bc = this._img * other.real;
        var ad = this._real * other.img;
        var cc = other.real * other.real;
        var dd = other.img * other.img;
        return new complex((ac + bd) / (cc + dd), (bc - ad) / (cc + dd));
    };
    /**
    * Scalar multiply a complex number, by a real number lambda
    * @param lambda - The real number scaling factor
    * @returns The scaled version of the complex number
    */
    complex.prototype.scalarMult = function (lambda) {
        return new complex(lambda * this.real, lambda * this.img);
    };
    /**
    * Get the magnitude(absolute value) of the complex number
    * @returns The magnitude: sqroot(a^2 + b^2)
    */
    complex.prototype.mag = function () {
        return Math.sqrt((this.real * this.real) + (this.img * this.img));
    };
    /**
    * Get the conjugate of the complex number
    * @returns The conjugate of the complex number:  a + (-bi)
    */
    complex.prototype.conj = function () {
        return new complex(this.real, -this.img);
    };
    /**
    * Get the negation of the complex number
    * @returns The negation of the complex number:  -a + (-bi)
    */
    complex.prototype.neg = function () {
        return new complex(-this.real, -this.img);
    };
    /**
    * Get the arguement of the complex number, the angle in radians with the x-axis in polar coordinates
    * @returns The arguement of the complex number
    */
    complex.prototype.arg = function () {
        return Math.atan2(this.img, this.real);
    };
    /**
    * Get the exponential of the complex number
    * @returns The exponential of the complex number: (exp(a) * cos(b)) + (exp(a) * sin(b))(i)
    */
    complex.prototype.exp = function () {
        return new complex(Math.exp(this.real) * Math.cos(this.img), Math.exp(this.real) * Math.sin(this.img));
    };
    /**
    * Get the natural base e log of the complex number
    * @returns The natural base e log of the complex number
    */
    complex.prototype.log = function () {
        return new complex(Math.log(this.mag()), Math.atan2(this.img, this.real));
    };
    /**
    * Get the sine of the complex number
    * @returns The sine of the complex number
    */
    complex.prototype.sin = function () {
        return new complex(Math.cosh(this.img) * Math.sin(this.real), Math.sinh(this.img) * Math.cos(this.real));
    };
    /**
    * Get the cosine of the complex number
    * @returns The cosine of the complex number
    */
    complex.prototype.cos = function () {
        return new complex(Math.cosh(this.img) * Math.cos(this.real), -Math.sinh(this.img) * Math.sin(this.real));
    };
    /**
    * Get the tangent of the complex number
    * @returns The tangent of the complex number
    */
    complex.prototype.tan = function () {
        // defined in terms of the identity tan(z) = sin(z) / cos(z)
        var num = this.sin();
        var denom = this.cos();
        return num.div(denom);
    };
    /**
    * Static method to construct a complex number in rectangular form from polar coordinates
    * @param theta - The angle/arguement
    * @param magnitude - The magnitude
    * @returns Complex number in rectangular coordinates constructed from the arguement theta & the magnitude
    */
    complex.fromPolar = function (theta, magnitude) {
        return new complex(magnitude * Math.cos(theta), magnitude * Math.sin(theta));
    };
    /**
    * Get the complex number's polar coordinates as a tuple
    * @returns A tuple containing the arguement/angle of the complex number as the 1st element, and the magnitude as the 2nd
    */
    complex.prototype.toPolar = function () {
        var mag = this.mag();
        var theta = this.arg();
        return [theta, mag];
    };
    /**
    * Get the complex number as a string
    * @returns String representation of the complex number
    */
    complex.prototype.toString = function () {
        if (Math.sign(this.img) === -1) {
            // bit of a dirty hack..
            return this.real + " - " + -this.img + "i";
        }
        else {
            return this.real + " + " + this.img + "i";
        }
    };
    /**
    * Compare two complex numbers for equality
    * @param other - The 2nd complex number operand
    * @returns true if equal, else false
    */
    complex.prototype.equals = function (other) {
        if (this.real === other.real && this.img === other.img) {
            return true;
        }
        else {
            return false;
        }
    };
    return complex;
}());
exports.default = complex;
