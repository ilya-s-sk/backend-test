import request from 'supertest';
import { app } from '../../src';

const HTTP_STATUSES = {
  OK_200: 200,
  NOT_FOUND_404: 404,
  BAD_REQUEST_400: 400,
  CREATED_201: 201,
  NO_CONTENT_204: 204,
}

describe('/products', () => {

  beforeAll(async () => {    
    await request(app).delete('/products/__test__/data')    
  })

  it('should return 200 and empty array', async () => {
    await request(app)
      .get('/products')
      .expect(HTTP_STATUSES.OK_200, [])
  })

  it('should return 404 for non existing product', async () => {
    await request(app)
      .get('/products/1')
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  });

  it('should not create course with incorrect input data', async () => {
    await request(app)
      .post('/products')
      .send({title: ''})
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    
    await request(app)
      .get('/products')
      .expect(HTTP_STATUSES.OK_200, [])
  })

  let createdProduct: any = null;
  it('should create product with correct data', async () => {

    const data = { title: 'apple' };

    const createResponse = await request(app)
      .post('/products')
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201)
    
    createdProduct = createResponse.body;

    expect(createdProduct).toEqual({
      id: expect.any(Number),
      title: data.title,
    })

    await request(app)
      .get('/products')
      .expect(HTTP_STATUSES.OK_200, [createdProduct])
  });

  let createdProduct2: any = null;
  it('should create product with correct data', async () => {

    const data = {title: 'orange'};

    const createResponse = await request(app)
      .post('/products')
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201)
    
    createdProduct2 = createResponse.body;

    expect(createdProduct2).toEqual({
      id: expect.any(Number),
      title: data.title,
    })

    await request(app)
      .get('/products')
      .expect(HTTP_STATUSES.OK_200, [createdProduct, createdProduct2])
  })

  it('should not update product with incorrect input data', async () => {

    const data = {title: ''};

    await request(app)
      .put(`/products/${createdProduct.id}`)
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    
    await request(app)
      .get(`/products/${createdProduct.id}`)
      .expect(HTTP_STATUSES.OK_200, createdProduct)
  });

  it('should not update product that not exist', async () => {

    const data = {title: 'good title'};

    await request(app)
      .put(`/courses/${-100}`)
      .send(data)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('should update product with correct data', async () => {
    const data = {title: 'good title'};

    await request(app)
      .put(`/products/${createdProduct.id}`)
      .send(data)
      .expect(HTTP_STATUSES.OK_200);
    
    await request(app)
      .get(`/products/${createdProduct.id}`)
      .expect(HTTP_STATUSES.OK_200, {
        ...createdProduct,
        title: data.title,
      })

    await request(app)
      .get(`/products/${createdProduct2.id}`)
      .expect(HTTP_STATUSES.OK_200, createdProduct2)
  });

  it('should delete both products', async () => {
    await request(app)
      .delete(`/products/${createdProduct.id}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    
    await request(app)
      .get(`/products/${createdProduct.id}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);

    await request(app)
      .delete(`/products/${createdProduct2.id}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    
    await request(app)
      .get(`/products/${createdProduct2.id}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);

    await request(app)
      .get(`/products`)
      .expect(HTTP_STATUSES.OK_200, []);
    
  })
})