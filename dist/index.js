/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var net_1 = __webpack_require__(/*! ./net */ "./src/net.ts");
var network = new net_1.Net(10, 3, 4, 5);
network.learn([
    [1, 1, 0, 1, 1, 0, 0, 0, 1, 1],
    [0, 0, 1, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 1, 1, 1, 0, 0],
], [
    [0, 0, 1, 0, 1],
    [1, 0, 0, 1, 0],
    [0, 1, 0, 0, 0],
], 0.05);


/***/ }),

/***/ "./src/net.ts":
/*!********************!*\
  !*** ./src/net.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Net = /** @class */ (function () {
    function Net(inputLayer) {
        var layers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            layers[_i - 1] = arguments[_i];
        }
        this.net = Net.initNet(inputLayer, layers);
    }
    Net.printLayer = function (layer) {
        layer.forEach(function (neuron) { return console.log("[" + neuron.reduce(function (result, w) { return result.concat(w + ","); }, '') + "]"); });
    };
    Net.prototype.exportNet = function () {
        return this.net;
    };
    Net.prototype.printNet = function () {
        this.net.forEach(Net.printLayer);
    };
    Net.prototype.learn = function (inputs, outputs, learningRate) {
        var _this = this;
        var ALLOWED_ERROR = 0.01;
        var error = 9999;
        var step = 0;
        while (error > ALLOWED_ERROR || step < 10000) {
            error = 0;
            inputs.forEach(function (input, i) {
                var _a = _this.learnStep(input, outputs[i]), dW = _a.dW, lost = _a.lost;
                _this.updateNet(dW, learningRate);
                error += lost;
            });
            error /= inputs.length;
            step++;
        }
    };
    Net.prototype.learnStep = function (input, output) {
        var netOutputs = this.forwardPropagate(input);
        return {
            lost: Net.totalLost(netOutputs.activations[netOutputs.activations.length - 1][0], output),
            dW: this.backPropagate(netOutputs, output),
        };
    };
    Net.prototype.forwardPropagate = function (input) {
        return this.net.reduce(function (_a, currentLayer, i, net) {
            var outputs = _a.outputs, activations = _a.activations;
            var dot = Net.dot(activations[i], currentLayer);
            return {
                outputs: outputs.concat([dot]),
                activations: activations.concat([
                    Net.applyFunction(dot, (i < net.length - 1 ? Net.relu : Net.sigmoid)),
                ]),
            };
        }, { outputs: [], activations: [[input]] });
    };
    Net.prototype.backPropagate = function (_a, expectedOutputs) {
        var outputs = _a.outputs, activations = _a.activations;
        var dW = new Array(this.net.length);
        var delta = Net.product([Net.calculateCost(activations[activations.length - 1][0], expectedOutputs)], Net.applyFunction(outputs[outputs.length - 1], Net.sigmoid_));
        dW[this.net.length - 1] = Net.dot(Net.transpose(activations[activations.length - 2]), delta);
        for (var i = this.net.length - 2; i > -1; i--) {
            delta = Net.product(Net.transpose(Net.dot(this.net[i + 1], Net.transpose(delta))), Net.applyFunction(outputs[i], Net.relu_));
            dW[i] = Net.dot(Net.transpose(activations[i]), delta);
        }
        return dW;
    };
    Net.prototype.updateNet = function (dW, learningRate) {
        var _this = this;
        dW.forEach(function (layer, i) {
            return layer.forEach(function (neuron, j) {
                return neuron.forEach(function (w, k) {
                    return _this.net[i][j][k] += learningRate * w;
                });
            });
        });
    };
    Net.initNet = function (inputLayer, layers) {
        var result = new Array(layers.length);
        layers.forEach(function (layer, i) {
            return result[i] = i === 0 ? Net.initLayer(inputLayer, layer) : Net.initLayer(layers[i - 1], layer);
        });
        return result;
    };
    Net.initLayer = function (inputLayer, neurons) {
        return Net.initMatrix(neurons, inputLayer);
    };
    Net.initMatrix = function (width, height) {
        var result = new Array(height);
        for (var i = 0; i < result.length; i++) {
            result[i] = new Array(width);
            for (var j = 0; j < result[i].length; j++) {
                result[i][j] = (Math.random() - 0.5);
            }
        }
        return result;
    };
    Net.dot = function (matrix1, matrix2) {
        var result = new Array(matrix1.length);
        for (var i = 0; i < matrix1.length; i++) {
            result[i] = new Array(matrix2[0].length);
            for (var j = 0; j < matrix2[0].length; j++) {
                result[i][j] = 0;
                for (var k = 0; k < matrix1[0].length; k++) {
                    result[i][j] += matrix1[i][k] * matrix2[k][j];
                }
            }
        }
        return result;
    };
    Net.product = function (matrix1, matrix2) {
        if (matrix1.length != matrix2.length || matrix1[0].length != matrix2[0].length) {
            console.error("Matrixes has different size: [" + matrix1.length + ", " + matrix1[0].length + "], [" + matrix2.length + ", " + matrix2[0].length + "]");
        }
        var result = new Array(matrix1.length);
        for (var i = 0; i < matrix1.length; i++) {
            result[i] = new Array(matrix1[0].length);
            for (var j = 0; j < matrix1[i].length; j++) {
                result[i][j] = matrix1[i][j] * matrix2[i][j];
            }
        }
        return result;
    };
    Net.applyFunction = function (matrix, func) {
        var result = new Array(matrix.length);
        for (var i = 0; i < result.length; i++) {
            result[i] = new Array(matrix[i].length);
            for (var j = 0; j < result[i].length; j++) {
                result[i][j] = func(matrix[i][j]);
            }
        }
        return result;
    };
    Net.transpose = function (matrix) {
        return matrix[0].map(function (_, i) { return matrix.map(function (row) { return row[i]; }); });
    };
    Net.relu = function (x) {
        return x > 0 ? x : 0;
    };
    Net.relu_ = function (x) {
        return x > 0 ? x : 0;
    };
    Net.sigmoid = function (x) {
        return 1 / (1 + Math.exp(-x));
    };
    Net.sigmoid_ = function (x) {
        return Net.sigmoid(x) * (1 - Net.sigmoid(x));
    };
    Net.mse = function (yExpected, y) {
        return Math.pow(yExpected - y, 2);
    };
    Net.mse_ = function (yExpected, y) {
        return -2 * (yExpected - y);
    };
    Net.calculateCost = function (outputs, expectedOutputs) {
        return outputs.map(function (y, i) { return Net.mse_(expectedOutputs[i], y); });
    };
    Net.totalLost = function (outputs, expectedOutputs) {
        return outputs.reduce(function (result, y, i) { return result += Net.mse(expectedOutputs[i], y); }, 0) / outputs.length;
    };
    return Net;
}());
exports.Net = Net;


/***/ })

/******/ });
//# sourceMappingURL=index.js.map