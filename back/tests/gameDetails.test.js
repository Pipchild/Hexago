// const http = require('http');
const request = require('supertest')
const app = require('../app')
let id;
let idGenre;

test('Create a genre return 200', async () => {
  const res = await request(app)
  .post('/genre/create')
  .send({
    genre: 'blablablatest'
  })
  console.log(res.body)
  if (res.body.content._id) {
      idGenre = res.body.content._id
  }
  expect(res.statusCode).toBe(200);
});

test('Create a gameDetails return 200', async () => {
    const res = await request(app)
    .post('/gameDetails/create')
    .send({
      name: '7 boqds',
      author: "Bruno Cathala",
      editor: "Repos Prod",
      distributor: "Repos Prod",
      releaseDate: "2015-10-01T07:22Z",
      popularity: 9,
      playerMin: 2,
      playerMax: 2,
      gameLengthMin: 30,
      gameLengthMax: 60,
      minAge: 10,
      genres: [idGenre],
      description: "Triomphez de votre adversaire en développant et améliorant votre civilisation sur les plans civil, scientifique et militaire. 7 Wonders Duel est l'adaptation 2 joueurs de 7 Wonders."
    })
    if (res.body.gameDetails._id) {
        id = res.body.gameDetails._id
    }
    expect(res.statusCode).toBe(200);
});

test('Get gameDetails return 200', async () => {
    const res = await request(app)
      .get('/gameDetails')
    expect(res.statusCode).toBe(200);
});

test('Get a gameDetails return 200', async () => {
    const res = await request(app)
      .get('/gameDetails/' + id)
    expect(res.statusCode).toBe(200);
});

test('Get gameDetails by name return 200', async () => {
    const res = await request(app)
      .get('/gameDetails/?name=wond')
    expect(res.statusCode).toBe(200);
});

test('Get gameDetails by author return 200', async () => {
  const res = await request(app)
    .get('/gameDetails/?author=Bruno')
  expect(res.statusCode).toBe(200);
});

test('Get gameDetails by editor return 200', async () => {
  const res = await request(app)
    .get('/gameDetails/?editor=Repos')
  expect(res.statusCode).toBe(200);
});

test('Get gameDetails by distributor return 200', async () => {
  const res = await request(app)
    .get('/gameDetails/?editor=Repos')
  expect(res.statusCode).toBe(200);
});

test('Get gameDetails by release date return 200', async () => {
  const res = await request(app)
    .get('/gameDetails/?releaseDate=2015')
  expect(res.statusCode).toBe(200);
});

test('Get gameDetails by popularity return 200', async () => {
  const res = await request(app)
    .get('/gameDetails/?popularity=9')
  expect(res.statusCode).toBe(200);
});

test('Get gameDetails by number of player return 200', async () => {
  const res = await request(app)
    .get('/gameDetails/?nbPlayer=2')
  expect(res.statusCode).toBe(200);
});

test('Get gameDetails by game length return 200', async () => {
  const res = await request(app)
    .get('/gameDetails/?gameLengthDesired=30')
  expect(res.statusCode).toBe(200);
});

test('QuickSearch gameDetails by name return 200', async () => {
  const res = await request(app)
    .get('/gameDetails/quicksearch/?name=wond')
  expect(res.statusCode).toBe(200);
});

// test('Update a gameDetails return 200', async () => {
//     const res = await request(app)
//     .put('/gameDetails/' + id)
//     .send({
//       name: '7 worders'
//     })
//     console.log(res.body)
//     // if (res.body.content._id) {
//     //     id = res.body.content._id
//     // }
//     expect(res.statusCode).toBe(200);
// });

// test('Get a gameDetails return 200', async () => {
//     const res = await request(app)
//       .get('/gameDetails/' + id)
//     expect(res.body.content.name).toBe("7 worders")
//     expect(res.statusCode).toBe(200);
// });

test('Delete a gameDetails return 200', async () => {
    const res = await request(app)
      .delete('/gameDetails/' + id)
    expect(res.statusCode).toBe(200);
});

test('Delete a genre return 200', async () => {
  const res = await request(app)
    .delete('/genre/' + idGenre)
  expect(res.statusCode).toBe(200);
});