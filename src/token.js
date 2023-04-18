"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inverseLookup = exports.lookup = exports.notParam = exports.Token = void 0;
var Token;
(function (Token) {
    Token[Token["Illegal"] = 0] = "Illegal";
    Token[Token["EndOfFile"] = 1] = "EndOfFile";
    Token[Token["Real"] = 2] = "Real";
    Token[Token["NNInteger"] = 3] = "NNInteger";
    Token[Token["Id"] = 4] = "Id";
    Token[Token["OpenQASM"] = 5] = "OpenQASM";
    Token[Token["Semicolon"] = 6] = "Semicolon";
    Token[Token["Comma"] = 7] = "Comma";
    Token[Token["LParen"] = 8] = "LParen";
    Token[Token["LSParen"] = 9] = "LSParen";
    Token[Token["LCParen"] = 10] = "LCParen";
    Token[Token["RParen"] = 11] = "RParen";
    Token[Token["RSParen"] = 12] = "RSParen";
    Token[Token["RCParen"] = 13] = "RCParen";
    Token[Token["Arrow"] = 14] = "Arrow";
    Token[Token["Equals"] = 15] = "Equals";
    Token[Token["Plus"] = 16] = "Plus";
    Token[Token["Minus"] = 17] = "Minus";
    Token[Token["Times"] = 18] = "Times";
    Token[Token["Divide"] = 19] = "Divide";
    Token[Token["Power"] = 20] = "Power";
    Token[Token["Sin"] = 21] = "Sin";
    Token[Token["Cos"] = 22] = "Cos";
    Token[Token["Tan"] = 23] = "Tan";
    Token[Token["Exp"] = 24] = "Exp";
    Token[Token["Ln"] = 25] = "Ln";
    Token[Token["Sqrt"] = 26] = "Sqrt";
    Token[Token["Pi"] = 27] = "Pi";
    Token[Token["QReg"] = 28] = "QReg";
    Token[Token["CReg"] = 29] = "CReg";
    Token[Token["Barrier"] = 30] = "Barrier";
    Token[Token["Gate"] = 31] = "Gate";
    Token[Token["Measure"] = 32] = "Measure";
    Token[Token["Reset"] = 33] = "Reset";
    Token[Token["Include"] = 34] = "Include";
    Token[Token["If"] = 35] = "If";
    Token[Token["String"] = 36] = "String";
})(Token || (Token = {}));
exports.Token = Token;
var lookupMap = {
    'if': Token.If,
    'sin': Token.Sin,
    'cos': Token.Cos,
    'tan': Token.Tan,
    'exp': Token.Exp,
    'ln': Token.Ln,
    'sqrt': Token.Sqrt,
    'pi': Token.Pi,
    '+': Token.Plus,
    '-': Token.Minus,
    '/': Token.Divide,
    '*': Token.Times,
    '^': Token.Power
};
/**
 * Returns the token that represents a given string.
 * @param ident - The string.
 * @return The corresponding token.
 */
function lookup(ident) {
    return ident in lookupMap ? lookupMap[ident] : Token.Id;
}
exports.lookup = lookup;
/**
 * Returns the string representation of a token.
 * @param tokens - The token.
 * @return The string representation of the token.
 */
function inverseLookup(token) {
    return Object.keys(lookupMap).find(function (ident) { return lookupMap[ident] == token; });
}
exports.inverseLookup = inverseLookup;
/**
 * Determines whether a token denotes a parameter.
 * @param tokens - The token.
 * @return Whether the token does NOT denote a parameter.
 */
function notParam(token) {
    if (token == Token.NNInteger || token == Token.Real || token == Token.Id || this.inverseLookup(token)) {
        return false;
    }
    return true;
}
exports.notParam = notParam;
