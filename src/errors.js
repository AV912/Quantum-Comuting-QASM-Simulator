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
exports.MissingSemicolonError = exports.BadParameterError = exports.BadEqualsError = exports.BadGateError = exports.BadMeasurementError = exports.BadBarrierError = exports.BadConditionalError = exports.BadQregError = exports.BadCregError = exports.BadArgumentError = void 0;
/** Class representing a bad argument exception. */
var BadArgumentError = /** @class */ (function (_super) {
    __extends(BadArgumentError, _super);
    function BadArgumentError(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        _this.name = BadArgumentError.name;
        return _this;
    }
    return BadArgumentError;
}(Error));
exports.BadArgumentError = BadArgumentError;
/** Class representing a bad quantum register exception. */
var BadQregError = /** @class */ (function (_super) {
    __extends(BadQregError, _super);
    function BadQregError(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        _this.name = BadQregError.name;
        return _this;
    }
    return BadQregError;
}(Error));
exports.BadQregError = BadQregError;
/** Class representing a bad equality exception. */
var BadEqualsError = /** @class */ (function (_super) {
    __extends(BadEqualsError, _super);
    function BadEqualsError(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        _this.name = BadEqualsError.name;
        return _this;
    }
    return BadEqualsError;
}(Error));
exports.BadEqualsError = BadEqualsError;
/** Class representing a bad classical register exception. */
var BadCregError = /** @class */ (function (_super) {
    __extends(BadCregError, _super);
    function BadCregError(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        _this.name = BadCregError.name;
        return _this;
    }
    return BadCregError;
}(Error));
exports.BadCregError = BadCregError;
/** Class representing a bad conditional exception. */
var BadConditionalError = /** @class */ (function (_super) {
    __extends(BadConditionalError, _super);
    function BadConditionalError(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        _this.name = BadConditionalError.name;
        return _this;
    }
    return BadConditionalError;
}(Error));
exports.BadConditionalError = BadConditionalError;
/** Class representing a bad barrier exception. */
var BadBarrierError = /** @class */ (function (_super) {
    __extends(BadBarrierError, _super);
    function BadBarrierError(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        _this.name = BadBarrierError.name;
        return _this;
    }
    return BadBarrierError;
}(Error));
exports.BadBarrierError = BadBarrierError;
/** Class representing a bad measurement exception. */
var BadMeasurementError = /** @class */ (function (_super) {
    __extends(BadMeasurementError, _super);
    function BadMeasurementError(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        _this.name = BadMeasurementError.name;
        return _this;
    }
    return BadMeasurementError;
}(Error));
exports.BadMeasurementError = BadMeasurementError;
/** Class representing a bad gate exception. */
var BadGateError = /** @class */ (function (_super) {
    __extends(BadGateError, _super);
    function BadGateError(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        _this.name = BadGateError.name;
        return _this;
    }
    return BadGateError;
}(Error));
exports.BadGateError = BadGateError;
/** Class representing a bad parameter exception. */
var BadParameterError = /** @class */ (function (_super) {
    __extends(BadParameterError, _super);
    function BadParameterError(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        _this.name = BadParameterError.name;
        return _this;
    }
    return BadParameterError;
}(Error));
exports.BadParameterError = BadParameterError;
/** Class representing a missing semicolon exception. */
var MissingSemicolonError = /** @class */ (function (_super) {
    __extends(MissingSemicolonError, _super);
    function MissingSemicolonError(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        _this.name = MissingSemicolonError.name;
        return _this;
    }
    return MissingSemicolonError;
}(Error));
exports.MissingSemicolonError = MissingSemicolonError;
