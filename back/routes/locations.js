let async = require('async/waterfall');

let express = require('express');
let router = express.Router();
let Locations = require('../models/locations');

// let axios = require('axios')
// axios.defaults.baseURL = `${process.env.AUTH0_AUDIENCE}`

function logHandleError(err) {
    if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(err.response.data)
    } else if (err.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(err.request)
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error(err.message)
    }
}

//get all locations
router.get('/', (req, res, next) => {
    Locations.find({}, function (err, content) {
        console.log(content);
        if (err) res.json({
            err: err
        });
        else res.json({content})
    })

});

//post create a location

router.post('/create', (req, res, next) => {
    Locations.create(req.body, (err, content) => {
        if (err) res.json({err: err});
        else {
            if (content) {
                res.json({content: content, msg: 'location created successfully.'})
            } else {
                res.json({err: 'Unable to create this location.'})
            }
        }
    })
});

//get a location
router.get('/:id', function (req, res, next) {
    if (!req.params.id) res.json({
        err: 'Please provide an id param.'
    });
    else {
        Locations.findById(
            req.params.id, (err, content) => {
                if (err) res.json({
                    err: err
                });
                else {
                    if (content) {
                        res.json({
                            content
                        })
                    } else {
                        res.json({
                            err: 'No location found with this id.'
                        })
                    }
                }
            })
    }
});

//delete a location
router.delete('/:id', (req, res, next) => {
    if (!req.params.id) res.json({
        err: 'Please provide an id param.'
    });
    else if (req.params.id.length !== 24)
        res.json({
            err: 'Please provide a valid id param.'
        });
    else
        Locations.findByIdAndDelete(req.params.id, (err, content) => {
            if (err) res.json({
                err: err
            });
            else
            if (content) {
                res.json({
                    _id: req.params.id,
                    msg: 'Location deleted successfully.'
                })
            } else {
                res.json({
                    err: 'No location found with this id.'
                })
            }
        })
});

module.exports = router;
