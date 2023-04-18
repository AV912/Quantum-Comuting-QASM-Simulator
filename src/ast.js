"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = exports.Real = exports.NNInteger = exports.Pi = exports.Sqrt = exports.Ln = exports.Exp = exports.Tan = exports.Cos = exports.Sin = exports.Power = exports.Times = exports.Minus = exports.Plus = exports.Divide = exports.Id = exports.If = exports.Gate = exports.ApplyGate = exports.Measure = exports.Barrier = exports.CReg = exports.QReg = exports.AstNode = void 0;
/** Base class representing a basic AST node. */
var AstNode = /** @class */ (function () {
    function AstNode() {
    }
    return AstNode;
}());
exports.AstNode = AstNode;
/** Class representing a qubit register. */
var QReg = /** @class */ (function (_super) {
    __extends(QReg, _super);
    function QReg(id, size) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.size = size;
        return _this;
    }
    return QReg;
}(AstNode));
exports.QReg = QReg;
/** Class representing a classical register. */
var CReg = /** @class */ (function (_super) {
    __extends(CReg, _super);
    function CReg(id, size) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.size = size;
        return _this;
    }
    return CReg;
}(AstNode));
exports.CReg = CReg;
/** Class representing an identifier. */
var Id = /** @class */ (function (_super) {
    __extends(Id, _super);
    function Id(id) {
        var _this = _super.call(this) || this;
        _this.id = id;
        return _this;
    }
    return Id;
}(AstNode));
exports.Id = Id;
/** Class representing a barrier. */
var Barrier = /** @class */ (function (_super) {
    __extends(Barrier, _super);
    function Barrier(register, index) {
        var _this = _super.call(this) || this;
        _this.index = index || null;
        _this.register = register;
        return _this;
    }
    return Barrier;
}(AstNode));
exports.Barrier = Barrier;
/** Class representing a variable. */
var Variable = /** @class */ (function (_super) {
    __extends(Variable, _super);
    function Variable(value) {
        var _this = _super.call(this) || this;
        _this.value = value || null;
        return _this;
    }
    return Variable;
}(AstNode));
exports.Variable = Variable;
/** Class representing a measurement. */
var Measure = /** @class */ (function (_super) {
    __extends(Measure, _super);
    function Measure(src_register, dest_register, src_index, dest_index) {
        var _this = _super.call(this) || this;
        _this.src_index = src_index != undefined ? src_index : null;
        _this.src_register = src_register;
        _this.dest_index = dest_index != undefined ? dest_index : null;
        _this.dest_register = dest_register;
        return _this;
    }
    return Measure;
}(AstNode));
exports.Measure = Measure;
/** Class representing a gate application. */
var ApplyGate = /** @class */ (function (_super) {
    __extends(ApplyGate, _super);
    function ApplyGate(name, qubits, params) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.qubits = qubits;
        _this.params = params;
        return _this;
    }
    return ApplyGate;
}(AstNode));
exports.ApplyGate = ApplyGate;
/** Class representing a gate. */
var Gate = /** @class */ (function (_super) {
    __extends(Gate, _super);
    function Gate(name, registers, params, nodes) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.registers = registers;
        _this.params = params;
        _this.nodes = nodes;
        return _this;
    }
    return Gate;
}(AstNode));
exports.Gate = Gate;
/** Class representing conditional. */
var If = /** @class */ (function (_super) {
    __extends(If, _super);
    function If(register, param, gate) {
        var _this = _super.call(this) || this;
        _this.register = register;
        _this.param = param;
        _this.gate = gate;
        return _this;
    }
    return If;
}(AstNode));
exports.If = If;
/** Class representing minus. */
var Minus = /** @class */ (function (_super) {
    __extends(Minus, _super);
    function Minus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Minus;
}(AstNode));
exports.Minus = Minus;
/** Class representing plus. */
var Plus = /** @class */ (function (_super) {
    __extends(Plus, _super);
    function Plus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Plus;
}(AstNode));
exports.Plus = Plus;
/** Class representing times. */
var Times = /** @class */ (function (_super) {
    __extends(Times, _super);
    function Times() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Times;
}(AstNode));
exports.Times = Times;
/** Class representing power. */
var Power = /** @class */ (function (_super) {
    __extends(Power, _super);
    function Power() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Power;
}(AstNode));
exports.Power = Power;
/** Class representing division. */
var Divide = /** @class */ (function (_super) {
    __extends(Divide, _super);
    function Divide() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Divide;
}(AstNode));
exports.Divide = Divide;
/** Class representing pi. */
var Pi = /** @class */ (function (_super) {
    __extends(Pi, _super);
    function Pi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Pi;
}(AstNode));
exports.Pi = Pi;
/** Class representing the square root. */
var Sqrt = /** @class */ (function (_super) {
    __extends(Sqrt, _super);
    function Sqrt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Sqrt;
}(AstNode));
exports.Sqrt = Sqrt;
/** Class representing natural logarithm. */
var Ln = /** @class */ (function (_super) {
    __extends(Ln, _super);
    function Ln() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Ln;
}(AstNode));
exports.Ln = Ln;
/** Class representing exponentiation. */
var Exp = /** @class */ (function (_super) {
    __extends(Exp, _super);
    function Exp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Exp;
}(AstNode));
exports.Exp = Exp;
/** Class representing tagnent. */
var Tan = /** @class */ (function (_super) {
    __extends(Tan, _super);
    function Tan() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Tan;
}(AstNode));
exports.Tan = Tan;
/** Class representing cosine. */
var Cos = /** @class */ (function (_super) {
    __extends(Cos, _super);
    function Cos() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Cos;
}(AstNode));
exports.Cos = Cos;
/** Class representing sine. */
var Sin = /** @class */ (function (_super) {
    __extends(Sin, _super);
    function Sin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Sin;
}(AstNode));
exports.Sin = Sin;
/** Class representing an integer. */
var NNInteger = /** @class */ (function (_super) {
    __extends(NNInteger, _super);
    function NNInteger(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    return NNInteger;
}(AstNode));
exports.NNInteger = NNInteger;
/** Class representing a real. */
var Real = /** @class */ (function (_super) {
    __extends(Real, _super);
    function Real(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    return Real;
}(AstNode));
exports.Real = Real;
