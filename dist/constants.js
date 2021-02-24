"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.__prod__ = void 0;
exports.__prod__ = process.env.NODE_ENV === 'production';
exports.PORT = process.env.PORT || 5000;
//# sourceMappingURL=constants.js.map