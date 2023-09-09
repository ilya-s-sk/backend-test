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
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../../src");
const HTTP_STATUSES = {
    OK_200: 200,
    NOT_FOUND_404: 404,
    BAD_REQUEST_400: 400,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
};
describe('/products', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app).delete('/products/__test__/data');
    }));
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .get('/products')
            .expect(HTTP_STATUSES.OK_200, []);
    }));
    it('should return 404 for non existing product', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .get('/products/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    }));
    it('should not create course with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .post('/products')
            .send({ title: '' })
            .expect(HTTP_STATUSES.BAD_REQUEST_400);
        yield (0, supertest_1.default)(src_1.app)
            .get('/products')
            .expect(HTTP_STATUSES.OK_200, []);
    }));
    let createdProduct = null;
    it('should create product with correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'apple' };
        const createResponse = yield (0, supertest_1.default)(src_1.app)
            .post('/products')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201);
        createdProduct = createResponse.body;
        expect(createdProduct).toEqual({
            id: expect.any(Number),
            title: data.title,
        });
        yield (0, supertest_1.default)(src_1.app)
            .get('/products')
            .expect(HTTP_STATUSES.OK_200, [createdProduct]);
    }));
    let createdProduct2 = null;
    it('should create product with correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'orange' };
        const createResponse = yield (0, supertest_1.default)(src_1.app)
            .post('/products')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201);
        createdProduct2 = createResponse.body;
        expect(createdProduct2).toEqual({
            id: expect.any(Number),
            title: data.title,
        });
        yield (0, supertest_1.default)(src_1.app)
            .get('/products')
            .expect(HTTP_STATUSES.OK_200, [createdProduct, createdProduct2]);
    }));
    it('should not update product with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: '' };
        yield (0, supertest_1.default)(src_1.app)
            .put(`/products/${createdProduct.id}`)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400);
        yield (0, supertest_1.default)(src_1.app)
            .get(`/products/${createdProduct.id}`)
            .expect(HTTP_STATUSES.OK_200, createdProduct);
    }));
    it('should not update product that not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'good title' };
        yield (0, supertest_1.default)(src_1.app)
            .put(`/courses/${-100}`)
            .send(data)
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    }));
    it('should update product with correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'good title' };
        yield (0, supertest_1.default)(src_1.app)
            .put(`/products/${createdProduct.id}`)
            .send(data)
            .expect(HTTP_STATUSES.OK_200);
        yield (0, supertest_1.default)(src_1.app)
            .get(`/products/${createdProduct.id}`)
            .expect(HTTP_STATUSES.OK_200, Object.assign(Object.assign({}, createdProduct), { title: data.title }));
        yield (0, supertest_1.default)(src_1.app)
            .get(`/products/${createdProduct2.id}`)
            .expect(HTTP_STATUSES.OK_200, createdProduct2);
    }));
    it('should delete both products', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .delete(`/products/${createdProduct.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(src_1.app)
            .get(`/products/${createdProduct.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.default)(src_1.app)
            .delete(`/products/${createdProduct2.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(src_1.app)
            .get(`/products/${createdProduct2.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.default)(src_1.app)
            .get(`/products`)
            .expect(HTTP_STATUSES.OK_200, []);
    }));
});
