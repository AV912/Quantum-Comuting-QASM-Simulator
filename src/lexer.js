"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("./token");
var errors_1 = require("./errors");
/**
 * Returns whether a given character could be an element of a numeric value.
 * @param c - The character.
 * @return Whether the character is numeric.
 */
function isNumeric(c) {
    return (c == '.') || !isNaN(parseInt(c));
}
/**
 * Returns whether a given character is a letter.
 * @param c - The character.
 * @return Whether the character is a letter.
 */
function isLetter(c) {
    if (c.match(/[a-z]/i)) {
        return true;
    }
    return false;
}
/**
 * Returns whether a given character is alphanumeric.
 * @param c - The character.
 * @return Whether the character is alphanumeric.
 */
function isAlpha(c) {
    if (c.match(/^[0-9a-zA-Z]+$/)) {
        return true;
    }
    return false;
}
/**
 * Returns whether a given character is a newline character.
 * @param c - The character.
 * @return Whether the character is a newline.
 */
function isNewline(c) {
    if (c.match(/\n|\r(?!\n)|\u2028|\u2029|\r\n/g)) {
        return true;
    }
    return false;
}
/** Class representing a lexer. */
var Lexer = /** @class */ (function () {
    /**
     * Creates a lexer.
     * @param input - The string to lex.
     * @param cursor - The starting cursor position.
     */
    function Lexer(input, cursor) {
        if (cursor === void 0) { cursor = 0; }
        var _this = this;
        this.verifyInput = function () {
            var lines = _this.input.split(/\n|\r(?!\n)|\u2028|\u2029|\r\n/g);
            for (var i = 0; i < lines.length; i++) {
                if (!lines[i].startsWith('//')
                    && !(lines[i].length == 0)
                    && !(lines[i].includes('gate'))
                    && !(lines[i].trim() == '{' || lines[i].trim() == '}')
                    && !lines[i].includes(';')) {
                    return false;
                }
            }
            return true;
        };
        /**
         * Calling this method lexes the code represented by the provided string.
         * @return An array of tokens and their corresponding values.
         */
        this.lex = function () {
            var tokens = [];
            var token;
            if (!_this.verifyInput()) {
                throw errors_1.MissingSemicolonError;
            }
            while (_this.cursor < _this.input.length) {
                token = _this.nextToken();
                if (token) {
                    tokens.push(token);
                }
            }
            return tokens;
        };
        /**
        * Reads a character and advances the cursor.
        * @param num - Optional cursor position modifier.
        */
        this.readChar = function (num) {
            if (num === void 0) { num = 1; }
            _this.cursor += num;
            return _this.input[_this.cursor - num];
        };
        /**
         * Advances the cusor past the next comment.
         */
        this.skipComment = function () {
            var char = '';
            while (!isNewline(char)) {
                char = _this.readChar();
            }
        };
        /**
         * Determines whether the next character to process equals a given character.
         * @param c - The given character.
         * @return Whether the next character equals the given character.
         */
        this.peekEq = function (c) { return (_this.peek() == c); };
        /**
         * Reads a character without advancing the cursor.
         * @param index - Optional peek position offset.
         */
        this.peek = function () { return _this.input[_this.cursor]; };
        /**
         * Reads a numeric value.
         * @return The numeric value as a string.
         */
        this.readNumeric = function () {
            var num = '';
            while (isNumeric(_this.peek())) {
                num += _this.readChar();
            }
            return num;
        };
        /**
         * Reads an identifier.
         * @return The identifier as a string.
         */
        this.readIdentifier = function () {
            var id = '';
            while (isAlpha(_this.peek())) {
                id += _this.readChar();
            }
            return id;
        };
        /**
         * Reads a string literal.
         * @param terminator - The literal's termination character.
         * @return The literal as a string.
         */
        this.readStringLiteral = function (terminator) {
            var lit = '';
            var char = '';
            while (!(terminator == char)) {
                char = _this.readChar();
                lit += char;
            }
            return lit;
        };
        /**
         * Advances the cusor past the next block of whitespace.
         */
        this.skipWhitespace = function () {
            while (' \t\n\r\v'.indexOf(_this.peek()) > -1) {
                _this.cursor += 1;
            }
            return null;
        };
        /**
         * Lexes the next token.
         * @return The next token and its corresponding value.
         */
        this.nextToken = function () {
            _this.skipWhitespace();
            if (_this.cursor == _this.input.length) {
                return [token_1.Token.EndOfFile];
            }
            var char = _this.peek();
            _this.readChar();
            switch (char) {
                case '=':
                    if (_this.peekEq('=')) {
                        _this.readChar();
                        return [token_1.Token.Equals];
                    }
                    else {
                        throw errors_1.BadEqualsError;
                    }
                case '-':
                    if (_this.peekEq('>')) {
                        _this.readChar();
                        return [token_1.Token.Arrow];
                    }
                    else {
                        return [token_1.Token.Minus];
                    }
                case '+':
                    return [token_1.Token.Plus];
                case '*':
                    return [token_1.Token.Times];
                case '^':
                    return [token_1.Token.Power];
                case ';':
                    return [token_1.Token.Semicolon];
                case ',':
                    return [token_1.Token.Comma];
                case '(':
                    return [token_1.Token.LParen];
                case '[':
                    return [token_1.Token.LSParen];
                case '{':
                    return [token_1.Token.LCParen];
                case ')':
                    return [token_1.Token.RParen];
                case ']':
                    return [token_1.Token.RSParen];
                case '}':
                    return [token_1.Token.RCParen];
                case '/':
                    if (_this.peekEq('/')) {
                        _this.skipComment();
                        return;
                    }
                    else {
                        return [token_1.Token.Divide];
                    }
                case 'g':
                    if ((_this.input[_this.cursor] == 'a')
                        && (_this.input[_this.cursor + 1] == 't')
                        && (_this.input[_this.cursor + 2] == 'e')) {
                        _this.readChar(3);
                        return [token_1.Token.Gate];
                    }
                    var literal = char + _this.readIdentifier();
                    return [(0, token_1.lookup)(literal), new String(literal)];
                case 'q':
                    if ((_this.input[_this.cursor] == 'r')
                        && (_this.input[_this.cursor + 1] == 'e')
                        && (_this.input[_this.cursor + 2] == 'g')) {
                        _this.readChar(3);
                        return [token_1.Token.QReg];
                    }
                    var qregLit = char + _this.readIdentifier();
                    return [(0, token_1.lookup)(qregLit), new String(qregLit)];
                case 'c':
                    if ((_this.input[_this.cursor] == 'r')
                        && (_this.input[_this.cursor + 1] == 'e')
                        && (_this.input[_this.cursor + 2] == 'g')) {
                        _this.readChar(3);
                        return [token_1.Token.QReg];
                    }
                    var cregLit = char + _this.readIdentifier();
                    return [(0, token_1.lookup)(cregLit), new String(cregLit)];
                case 'b':
                    if ((_this.input[_this.cursor] == 'a')
                        && (_this.input[_this.cursor + 1] == 'r')
                        && (_this.input[_this.cursor + 2] == 'r')
                        && (_this.input[_this.cursor + 3] == 'i')
                        && (_this.input[_this.cursor + 4] == 'e')
                        && (_this.input[_this.cursor + 5] == 'r')) {
                        _this.readChar(6);
                        return [token_1.Token.Barrier];
                    }
                    var barLit = char + _this.readIdentifier();
                    return [(0, token_1.lookup)(barLit), new String(barLit)];
                case 'm':
                    if ((_this.input[_this.cursor] == 'e')
                        && (_this.input[_this.cursor + 1] == 'a')
                        && (_this.input[_this.cursor + 2] == 's')
                        && (_this.input[_this.cursor + 3] == 'u')
                        && (_this.input[_this.cursor + 4] == 'r')
                        && (_this.input[_this.cursor + 5] == 'e')) {
                        _this.readChar(6);
                        return [token_1.Token.Measure];
                    }
                    var measureLit = char + _this.readIdentifier();
                    return [(0, token_1.lookup)(measureLit), new String(measureLit)];
                case '\"':
                    var stringLiteral = char + _this.readStringLiteral('\"');
                    return [token_1.Token.String, new String(stringLiteral)];
                case '\’':
                    var singleStringLiteral = char + _this.readStringLiteral('\’');
                    return [token_1.Token.String, new String(singleStringLiteral)];
                default:
                    if (isLetter(char)) {
                        var literal_1 = char + _this.readIdentifier();
                        return [(0, token_1.lookup)(literal_1), new String(literal_1)];
                    }
                    else if (isNumeric(char)) {
                        var num = char + _this.readNumeric();
                        if (num.indexOf('.') != -1) {
                            return [token_1.Token.Real, parseFloat(num)];
                        }
                        else {
                            return [token_1.Token.NNInteger, parseFloat(num)];
                        }
                    }
                    else {
                        return [token_1.Token.Illegal];
                    }
            }
        };
        this.input = input;
        this.cursor = cursor;
    }
    return Lexer;
}());
exports.default = Lexer;
