import { Router, Request, Response } from "express";

let products = [{id: 1, title: 'tomato'}, {id: 2, title: 'orange'}];

export const productsRouter = Router({})

productsRouter.get('/', (req: Request, res: Response) => {
  const { title } = req.query;
  if (title) {
    res.send(products.filter(p => p.title.includes(String(title))))
    return;
  }

  res.send(products);
});

productsRouter.post('/', (req: Request, res: Response) => {
  const {body} = req;

  if (!body || !body.title) {
    return res.sendStatus(400)
  }

  const newProduct = {
    id: Date.now(),
    title: body.title
  };

  products.push(newProduct);
  res.status(201).send(newProduct);
});

productsRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  let product = products.find(p => p.id === +id);

  if (!product) {
    res.sendStatus(404);
    return;
  }

  res.send(product)
});

productsRouter.put('/:id', (req: Request, res: Response) => {
  const product = products.find(p => p.id === +req.params.id);
  if (!product) {
    res.sendStatus(404);
    return;
  }
  const {title} = req.body;
  if (!title) {
    res.sendStatus(400);
    return;
  }
  product.title = title;
  return res.status(200).send(product);

})

productsRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.sendStatus(404);
    return;
  }

  products = products.filter(p => p.id !== +id);
  res.sendStatus(204)
});