"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const node_html_parser_1 = require("node-html-parser");
const app = (0, express_1.default)();
const port = 3200; // Port 3200
app.use(express_1.default.json());
app.get('/open-positions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const department = req.query.department;
    if (!department) {
        res.status(400).json({ message: 'Department is required!' });
        return;
    }
    try {
        const response = yield (0, node_fetch_1.default)('https://www.actian.com/company/careers');
        const html = yield response.text();
        const root = (0, node_html_parser_1.parse)(html);
        const jobTitles = [];
        root.querySelectorAll('.job-heading').forEach((element) => {
            var _a, _b, _c;
            const dept = (_b = (_a = element.querySelector('.department')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
            if (dept === department) {
                const jobNameElements = (_c = element.nextElementSibling) === null || _c === void 0 ? void 0 : _c.querySelectorAll('.job-name');
                if (jobNameElements) {
                    jobNameElements.forEach((jobNameElement) => {
                        var _a;
                        const jobName = (_a = jobNameElement.textContent) === null || _a === void 0 ? void 0 : _a.trim();
                        if (jobName) {
                            jobTitles.push(jobName);
                        }
                    });
                }
            }
        });
        if (jobTitles.length === 0) {
            res.status(404).json({ message: 'No Department Found.' });
        }
        else {
            res.json({ department, jobTitles });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map