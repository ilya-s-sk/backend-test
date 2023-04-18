import express, { Request, Response } from 'express'

const app = express();
const port = process.env.PORT || 5000;

const DB = {
  videos: [
    {
      id: 1,
      title: 'Название 1',
    },
    {
      id: 2,
      title: 'Название 2',
    },
    {
      id: 3,
      title: 'Название 3',
    },
  ]
}

app.get('/', (req: Request, res: Response) => {
  let helloMsg = 'Hi my friend!'
  res.send(helloMsg);
});

app.get('/videos', (req: Request, res: Response) => {
  const { videos } = DB;
  res.send(videos);
});

app.get('/videos/:id', (req: Request, res: Response) => {
  const { videos } = DB;
  const idToFind = req.params.id;

  const videoById = videos.find(({ id }) => id === Number(idToFind)) || null;

  if (!videoById) {
    res.status(404).send('Not found')
  }

  res.send(videoById);
});

app.post('/videos', (req: Request, res: Response) => {
  const { body } = req;

  if (!body || !body.title) {
    res.status(400).send('Invalid body');
    return;
  }

  body.id = Date.now();

  DB.videos.push(body)
  res.status(200).send('created');
})

app.listen(port, () => {
  console.log(`Express is running on port ${port}`);
})