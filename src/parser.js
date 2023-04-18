"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("./token");
var errors_1 = require("./errors");
var ast_1 = require("./ast");
/** Class representing a token parser. */
var Parser = /** @class */ (function () {
    /**
     * Creates a parser.
     * @param tokens - Tokens to parse.
     */
    function Parser(tokens) {
        this.tokens = tokens;
        this.gates = [
            'x',
            'y',
            'z',
            'u1',
            'u2',
            'u3',
            's',
            'sdg',
            'h',
            'tdg',
            'cx',
            'cy',
            'cz',
            't',
            'ccx',
            'reset',
            'cu1',
            'ccy',
            'ccz'
        ];
    }
    /**
     * Calling this method parses the code represented by the provided tokens.
     * @return The abstract syntax tree.
     */
    Parser.prototype.parse = function () {
        var ast = [];
        var i = 0;
        while (i < (this.tokens.length - 1)) {
            var nodes = this.parseNode(this.tokens.slice(i));
            ast = ast.concat(nodes ? nodes : []);
            while (!(this.matchNext(this.tokens.slice(i), [token_1.Token.Semicolon]))) {
                if (this.matchNext(this.tokens.slice(i), [token_1.Token.LCParen])) {
                    while (!(this.matchNext(this.tokens.slice(i), [token_1.Token.RCParen]))) {
                        i++;
                    }
                    break;
                }
                i++;
            }
            i++;
        }
        return ast;
    };
    /**
    * Delegates the parsing of the next set of tokens to the appropriate method.
    * @param tokens - Remaining tokens to parse.
    * @param allowVariables - Whether encountered identifiers should be consider
        variable initializations or references.
    * @return A set of AST nodes.
    */
    Parser.prototype.parseNode = function (tokens, allowVariables) {
        if (allowVariables === void 0) { allowVariables = false; }
        var token = tokens[0];
        switch (token[0]) {
            case token_1.Token.QReg:
                return [this.qreg(tokens.slice(1))];
            case token_1.Token.CReg:
                return [this.creg(tokens.slice(1))];
            case token_1.Token.Barrier:
                return [this.barrier(tokens.slice(1))];
            case token_1.Token.Measure:
                return [this.measure(tokens.slice(1))];
            case token_1.Token.Id:
                if (!(token[1].toString().indexOf('QASM') != -1) &&
                    !(token[1].toString().indexOf('include') != -1)) {
                    if (this.gates.includes(token[1].toString())) {
                        return [this.application(tokens, token[1].toString())];
                    }
                    else if (allowVariables) {
                        return [new ast_1.Variable(token[1].toString())];
                    }
                    else {
                        throw errors_1.BadGateError;
                    }
                }
                else {
                    return [];
                }
            case token_1.Token.Gate:
                return [this.gate(tokens.slice(1))];
            case token_1.Token.If:
                return [this.conditional(tokens.slice(1))];
            case token_1.Token.Power:
                return [new ast_1.Power()];
            case token_1.Token.Divide:
                return [new ast_1.Divide()];
            case token_1.Token.Times:
                return [new ast_1.Times()];
            case token_1.Token.Plus:
                return [new ast_1.Plus()];
            case token_1.Token.Minus:
                return [new ast_1.Minus()];
            case token_1.Token.Pi:
                return [new ast_1.Pi()];
            case token_1.Token.Sin:
                return [new ast_1.Sin()];
            case token_1.Token.Cos:
                return [new ast_1.Cos()];
            case token_1.Token.Exp:
                return [new ast_1.Exp()];
            case token_1.Token.Ln:
                return [new ast_1.Ln()];
            case token_1.Token.Sqrt:
                return [new ast_1.Sqrt()];
            case token_1.Token.Tan:
                return [new ast_1.Tan()];
            case token_1.Token.NNInteger:
                return [new ast_1.NNInteger(Number(token[1]))];
            case token_1.Token.Real:
                return [new ast_1.Real(Number(token[1]))];
        }
    };
    /**
     * Checks if the next tokens match those expected.
     * @param tokens - Remaining tokens to parse.
     * @param expectedTokens - Expected tokens.
     * @return Whether these is a match.
     */
    Parser.prototype.matchNext = function (tokens, expectedTokens) {
        var matches = true;
        var i = 0;
        if (tokens.length == 0) {
            return false;
        }
        while (i < expectedTokens.length) {
            if (tokens[i][0] != expectedTokens[i]) {
                matches = false;
                break;
            }
            i++;
        }
        return matches;
    };
    /**
     * Parses a quantum register.
     * @param tokens - Remaining tokens to parse.
     * @return An AST node representing the quantum register.
     */
    Parser.prototype.qreg = function (tokens) {
        if (this.matchNext(tokens, [token_1.Token.Id, token_1.Token.LSParen, token_1.Token.NNInteger, token_1.Token.RSParen, token_1.Token.Semicolon])) {
            var id = tokens[0][1];
            var size = tokens[2][1];
            return new ast_1.QReg(id.toString(), Number(size));
        }
        else {
            throw errors_1.BadQregError;
        }
    };
    /**
     * Parses a classical register.
     * @param tokens - Remaining tokens to parse.
     * @return An AST node representing the classical register.
     */
    Parser.prototype.creg = function (tokens) {
        if (this.matchNext(tokens, [token_1.Token.Id, token_1.Token.LSParen, token_1.Token.NNInteger,
            token_1.Token.RSParen, token_1.Token.Semicolon])) {
            var id = tokens[0][1];
            var size = tokens[2][1];
            return new ast_1.CReg(id.toString(), Number(size));
        }
        else {
            throw errors_1.BadCregError;
        }
    };
    /**
     * Parses a conditional.
     * @param tokens - Remaining tokens to parse.
     * @return An AST node representing the conditional.
     */
    Parser.prototype.conditional = function (tokens) {
        if (this.matchNext(tokens, [token_1.Token.LParen, token_1.Token.Id, token_1.Token.Equals, token_1.Token.NNInteger, token_1.Token.RParen])) {
            var id = tokens[1][1];
            var val = tokens[3][1];
            var node = this.parseNode(tokens.slice(5));
            return new ast_1.If(id.toString(), Number(val), node);
        }
        else {
            throw errors_1.BadConditionalError;
        }
    };
    /**
     * Parses a barrier.
     * @param tokens - Remaining tokens to parse.
     * @return An AST node representing the barrier.
     */
    Parser.prototype.barrier = function (tokens) {
        if (this.matchNext(tokens, [token_1.Token.Id, token_1.Token.Semicolon])) {
            var id = tokens[0][1];
            return new ast_1.Barrier(id.toString());
        }
        else if (this.matchNext(tokens, [token_1.Token.Id, token_1.Token.LParen,
            token_1.Token.NNInteger, token_1.Token.RParen, token_1.Token.Semicolon])) {
            var id = tokens[0][1];
            var index = tokens[2][1];
            return new ast_1.Barrier(id.toString(), Number(index));
        }
        else {
            throw errors_1.BadBarrierError;
        }
    };
    /**
     * Parses a measurement.
     * @param tokens - Remaining tokens to parse.
     * @return An AST node representing the measurement.
     */
    Parser.prototype.measure = function (tokens) {
        var first_id;
        var second_id;
        var first_index;
        var second_index;
        if (this.matchNext(tokens, [token_1.Token.Id, token_1.Token.Arrow])) {
            first_id = tokens[0][1].toString();
            tokens = tokens.slice(2);
        }
        else if (this.matchNext(tokens, [token_1.Token.Id, token_1.Token.LSParen, token_1.Token.NNInteger, token_1.Token.RSParen, token_1.Token.Arrow])) {
            first_id = tokens[0][1].toString();
            first_index = Number(tokens[2][1]);
            tokens = tokens.slice(5);
        }
        else {
            throw errors_1.BadMeasurementError;
        }
        if (this.matchNext(tokens, [token_1.Token.Id, token_1.Token.Semicolon])) {
            second_id = tokens[0][1].toString();
            tokens = tokens.slice(2);
        }
        else if (this.matchNext(tokens, [token_1.Token.Id, token_1.Token.LSParen, token_1.Token.NNInteger, token_1.Token.RSParen, token_1.Token.Semicolon])) {
            second_id = tokens[0][1].toString();
            second_index = Number(tokens[2][1]);
            tokens = tokens.slice(5);
        }
        else {
            throw errors_1.BadMeasurementError;
        }
        if (first_index != undefined && second_index != undefined) {
            return new ast_1.Measure(first_id, second_id, first_index, second_index);
        }
        else if (first_index != undefined) {
            return new ast_1.Measure(first_id, second_id, first_index = first_index);
        }
        else if (second_index != undefined) {
            return new ast_1.Measure(first_id, second_id, second_index = second_index);
        }
        return new ast_1.Measure(first_id, second_id);
    };
    /**
     * Parses an application of one of the allowed gates.
     * @param tokens - Remaining tokens to parse.
     * @return An AST node representing the gate application.
     */
    Parser.prototype.application = function (tokens, op) {
        var params = [];
        var list = [];
        var applications = [];
        var id;
        if (tokens[0][1] == op) {
            tokens = tokens.slice(1);
        }
        if (this.matchNext(tokens, [token_1.Token.LParen])) {
            if (this.matchNext(tokens.slice(1), [token_1.Token.RParen])) {
                params = [];
                tokens = tokens.slice(2);
            }
            else {
                params = this.matchParamList(tokens.slice(1));
                var count = 0;
                var commas = 0;
                for (var i in params) {
                    commas += 1;
                    for (var j in params[i]) {
                        count++;
                    }
                }
                tokens = tokens.slice(count + (commas - 1) + 2);
            }
        }
        var args = this.matchArgList(tokens);
        for (var arg in args) {
            id = args[arg][0];
            list.push(args[arg]);
        }
        applications.push(new ast_1.ApplyGate(op, list, params));
        return applications;
    };
    /**
     * Parses a subroutine used in a custom gate definition.
     * @param tokens - Expression tokens to parse.
     * @return A parsed subroutine.
     */
    Parser.prototype.sub = function (tokens) {
        var ast = [];
        var i = 0;
        if (this.matchNext(tokens.slice(i), [token_1.Token.LCParen])) {
            tokens = tokens.slice(1);
        }
        while ((i < (tokens.length - 1)) && (tokens[i][0] != token_1.Token.RCParen)) {
            var nodes = this.parseNode(tokens.slice(i));
            ast = ast.concat(nodes ? nodes : []);
            while ((!this.matchNext(tokens.slice(i), [token_1.Token.Semicolon])) &&
                (!this.matchNext(tokens.slice(i), [token_1.Token.RCParen]))) {
                i++;
            }
            if (this.matchNext(tokens.slice(i), [token_1.Token.RCParen])) {
                break;
            }
            i++;
        }
        return ast;
    };
    /**
     * Parses a parameter value.
     * @param tokens - Tokens to parse.
     * @return An AST node representing the parameter value.
     */
    Parser.prototype.matchParam = function (tokens) {
        var param;
        if (!((0, token_1.notParam)(tokens[0][0]))) {
            param = this.parseNode([tokens[0]], true);
        }
        else {
            throw errors_1.BadParameterError;
        }
        return param;
    };
    /**
     * Parses a list of parameter values.
     * @param tokens - Tokens to parse.
     * @return An array of AST nodes representing the parameter values.
     */
    Parser.prototype.matchParamList = function (tokens) {
        var args = [];
        var i = 0;
        var j = 0;
        args[0] = [];
        while (!this.matchNext(tokens.slice(j), [token_1.Token.RParen])) {
            while (!this.matchNext(tokens.slice(j), [token_1.Token.Comma]) &&
                !this.matchNext(tokens.slice(j), [token_1.Token.RParen])) {
                if ((0, token_1.notParam)(tokens[j][0])) {
                    throw errors_1.BadParameterError;
                }
                var next = this.matchParam(tokens.slice(j));
                args[i].push(next);
                j++;
            }
            if (this.matchNext(tokens.slice(j), [token_1.Token.RParen])) {
                break;
            }
            i++;
            j++;
            args[i] = [];
        }
        return args;
    };
    /**
     * Parses an argument value.
     * @param tokens - Tokens to parse.
     * @return An AST node representing the argument value.
     */
    Parser.prototype.matchArg = function (tokens) {
        var index;
        if (this.matchNext(tokens, [token_1.Token.LSParen])) {
            tokens = tokens.slice(1);
            if (this.matchNext(tokens, [token_1.Token.NNInteger])) {
                index = Number(tokens[0][1]);
                tokens = tokens.slice(1);
            }
            else {
                throw errors_1.BadArgumentError;
            }
            if (this.matchNext(tokens, [token_1.Token.RSParen])) {
                return index;
            }
            else {
                throw errors_1.BadArgumentError;
            }
        }
    };
    /**
     * Parses a list of argument values.
     * @param tokens - Tokens to parse.
     * @return An array of AST nodes representing the argument values.
     */
    Parser.prototype.matchArgList = function (tokens) {
        var args = [];
        var next;
        var id;
        var j = 0;
        while (j < tokens.length && !this.matchNext(tokens.slice(j), [token_1.Token.Semicolon])) {
            if (this.matchNext(tokens.slice(j), [token_1.Token.Id])) {
                id = tokens[j][1].toString();
                var index = this.matchArg(tokens.slice(j + 1));
                next = [id, index];
                args.push(next);
                if (index != undefined) {
                    j += 4;
                }
                else {
                    j++;
                }
                if (this.matchNext(tokens.slice(j), [token_1.Token.Comma])) {
                    j++;
                }
            }
            else {
                throw errors_1.BadArgumentError;
            }
        }
        return args;
    };
    /**
     * Parses a list of identifiers.
     * @param tokens - Tokens to parse.
     * @return An array of AST nodes representing the identifiers.
     */
    Parser.prototype.matchIdList = function (tokens) {
        var args = [];
        var head;
        if (this.matchNext(tokens, [token_1.Token.Id])) {
            head = tokens[0][1].toString();
        }
        tokens = tokens.slice(1);
        args.push(head);
        if (this.matchNext(tokens, [token_1.Token.Comma])) {
            tokens = tokens.slice(1);
            var sub = this.matchIdList(tokens);
            args = args.concat(sub);
        }
        return args;
    };
    /**
     * Parses a gate.
     * @param tokens - Remaining tokens to parse.
     * @return An AST node representing the gate.
     */
    Parser.prototype.gate = function (tokens) {
        var name;
        var params;
        var registers;
        var applications;
        if (this.matchNext(tokens, [token_1.Token.Id])) {
            name = tokens[0][1].toString();
        }
        else {
            throw errors_1.BadGateError;
        }
        tokens = tokens.slice(1);
        if (this.matchNext(tokens, [token_1.Token.LParen])) {
            tokens = tokens.slice(1);
            if (this.matchNext(tokens, [token_1.Token.RParen])) {
                params = [];
                tokens = tokens.slice(1);
            }
            else {
                params = this.matchIdList(tokens);
                var count_1 = 0;
                for (var i in params) {
                    count_1++;
                }
                tokens = tokens.slice(count_1 + 1);
            }
        }
        registers = this.matchIdList(tokens);
        var count = 0;
        for (var i in registers) {
            count++;
        }
        tokens = tokens.slice(count + (count - 1));
        applications = this.sub(tokens);
        this.gates.push(name);
        return new ast_1.Gate(name, registers, params, applications);
    };
    return Parser;
}());
exports.default = Parser;
