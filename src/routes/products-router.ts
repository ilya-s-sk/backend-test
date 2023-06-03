import { Router, Request, Response } from "express";

import { productsRepository } from "../repositories/products-repository";

export const productsRouter = Router({})

productsRouter.get('/', (req: Request, res: Response) => {
  const foundProducts = productsRepository.findProducts(req.query.title?.toString());
  res.send(foundProducts)
});

productsRouter.post('/', (req: Request, res: Response) => {
  const {body} = req;

  if (!body || !body.title) {
    return res.sendStatus(400)
  }

  const createdProduct = productsRepository.createProduct(body.title);
  res.status(201).send(createdProduct);
});

productsRouter.get('/:id', (req: Request, res: Response) => {
  const product = productsRepository.findProductById(+req.params.id);

  if (product) {
    res.send(product)
  } else {
    res.sendStatus(404);
  }  
});

productsRouter.put('/:id', (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title) {
    res.sendStatus(400);
    return;
  }

  const id = Number(req.params.id);
  const isProductUpdated = productsRepository.updateProduct(id, title)

  if (isProductUpdated) {
    const updatedProduct = productsRepository.findProductById(id);
    res.status(200).send(updatedProduct);
  } else {
    res.sendStatus(404);
  }
})

productsRouter.delete('/:id', (req: Request, res: Response) => {
  const isDeleted = productsRepository.deleteProduct(Number(req.params.id));
  if (isDeleted) {
    res.sendStatus(204)
  } else {
    res.sendStatus(404);
  }
});

productsRouter.delete('/__test__/data', (req: Request, res: Response) => {
  productsRepository.deleteAll();
  res.sendStatus(204);
});