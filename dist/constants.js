"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_NAME = exports.PORT = exports.__prod__ = void 0;
exports.__prod__ = process.env.NODE_ENV === 'production';
exports.PORT = process.env.PORT || 5000;
exports.COOKIE_NAME = 'redtoken';
//# sourceMappingURL=constants.js.map