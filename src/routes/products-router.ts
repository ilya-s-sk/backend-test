import { Router, Request, Response } from "express";

import { productsRepository } from "../repositories/products-repository";
import { body, validationResult } from "express-validator";

export const productsRouter = Router({});

const tileValidation = body('title').trim().isLength({ min: 3, max: 30 }).withMessage('Title length should be from 3 to 30');

productsRouter.get('/', (req: Request, res: Response) => {
  const foundProducts = productsRepository.findProducts(req.query.title?.toString());
  res.send(foundProducts)
});

productsRouter.post('/',
  tileValidation,
  (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const createdProduct = productsRepository.createProduct(req.body.title);
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

productsRouter.put('/:id',
  tileValidation,
  (req: Request, res: Response) => {
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