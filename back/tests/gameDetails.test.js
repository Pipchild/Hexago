// const http = require('http');
const request = require('supertest')
const app = require('../app')
let id;


test('Create a gameDetails return 200', async () => {
    const res = await request(app)
    .post('/gameDetails/create')
    .send({
      name: '7 wonders',
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
      genres: ["5e6f7901a0d93148f48fd5ce"],
      description: "Triomphez de votre adversaire en développant et améliorant votre civilisation sur les plans civil, scientifique et militaire. 7 Wonders Duel est l'adaptation 2 joueurs de 7 Wonders."
    })
    console.log(res.body)
    if (res.body.content._id) {
        id = res.body.content._id
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

test('Search gameDetailss return 200', async () => {
    const res = await request(app)
      .get('/gameDetails/?gameDetails=Pi&limit=3')
    expect(res.statusCode).toBe(200);
});

// test('Update a gameDetails return 200', async () => {
//     const res = await request(app)
//     .put('/gameDetails/' + id)
//     .send({
//       gameDetails: 'Paplus'
//     })
//     console.log(res.body)
//     if (res.body.content._id) {
//         id = res.body.content._id
//     }
//     expect(res.statusCode).toBe(200);
// });

// test('Get a gameDetails return 200', async () => {
//     const res = await request(app)
//       .get('/gameDetails/' + id)
//     expect(res.body.content.gameDetails).toBe("Paplutardquhier")
//     expect(res.statusCode).toBe(200);
// });

test('Delete a gameDetails return 200', async () => {
    const res = await request(app)
      .delete('/gameDetails/' + id)
    expect(res.statusCode).toBe(200);
});