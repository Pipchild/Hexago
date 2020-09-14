// const http = require('http');
const request = require('supertest')
const app = require('../app')
let id;


test('Create a genre return 200', async () => {
    const res = await request(app)
    .post('/genre/create')
    .send({
      genre: 'testunitaire'
    })
    console.log(res.body)
    if (res.body.content._id) {
        id = res.body.content._id
    }
    expect(res.statusCode).toBe(200);
});

test('Get genres return 200', async () => {
    const res = await request(app)
      .get('/genre')
    expect(res.statusCode).toBe(200);
});

test('Get a genre return 200', async () => {
    const res = await request(app)
      .get('/genre/' + id)
    expect(res.statusCode).toBe(200);
});

test('Search genres return 200', async () => {
    const res = await request(app)
      .get('/genre/?genre=Pi&limit=3')
    expect(res.statusCode).toBe(200);
});

// test('Update a genre return 200', async () => {
//     const res = await request(app)
//     .put('/genre/' + id)
//     .send({
//       genre: 'Paplus'
//     })
//     console.log(res.body)
//     if (res.body.content._id) {
//         id = res.body.content._id
//     }
//     expect(res.statusCode).toBe(200);
// });

// test('Get a genre return 200', async () => {
//     const res = await request(app)
//       .get('/genre/' + id)
//     expect(res.body.content.genre).toBe("Paplutardquhier")
//     expect(res.statusCode).toBe(200);
// });

test('Delete a genre return 200', async () => {
    const res = await request(app)
      .delete('/genre/' + id)
    expect(res.statusCode).toBe(200);
});