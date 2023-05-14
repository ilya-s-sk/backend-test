import { Router, Request, Response } from "express";

const addresses = [{id: 1, value: 'Nezalejnasti 12'}, {id: 2, value: 'Selickaga 11'}];

export const addressesRouter = Router({});

addressesRouter.get('/', (req: Request, res: Response) => {
  res.send(addresses);
});

addressesRouter.get('/:id', (req: Request, res: Response) => {
  const {id} = req.params;
  let address = addresses.find(a => a.id === Number(id));

  if (!address) {
    res.sendStatus(404);
  }

  res.send(address);
});