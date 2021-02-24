"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractErrors = void 0;
const extractErrors = (errors) => {
    let fieldErrors = {};
    errors.forEach(({ property, constraints }) => {
        fieldErrors = Object.assign(Object.assign({}, fieldErrors), { [property]: Object.values(constraints)[0] });
    });
    return fieldErrors;
};
exports.extractErrors = extractErrors;
//# sourceMappingURL=extractErrors.js.map