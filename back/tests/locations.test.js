// const http = require('http');
const request = require('supertest')
const app = require('../app')
let id;


test('Create a locations return 200', async () => {
    const res = await request(app)
    .post('/locations/create')
    .send({
      locationType : 1,
      address : "24 rue pasteur",
      postCode : "92240",
      city : "Kremlin-Bicêtre"
    })
    if (res.body.content._id) {
        id = res.body.content._id
    }
    expect(res.statusCode).toBe(200);
});

test('Get locations return 200', async () => {
    const res = await request(app)
      .get('/locations')
    expect(res.statusCode).toBe(200);
});

test('Get a locations return 200', async () => {
    const res = await request(app)
      .get('/locations/' + id)
    expect(res.statusCode).toBe(200);
});

test('Delete a locations return 200', async () => {
    const res = await request(app)
      .delete('/locations/' + id)
    expect(res.statusCode).toBe(200);
});