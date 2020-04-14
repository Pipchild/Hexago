let async = require('async');

let express = require('express');
let router = express.Router();
let GameDetails = require('../models/gameDetails');
let Genre = require ('../models/genre');


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

// GET method http://localhost:3000/gamedetails?name=xxxx&distributor=yyyyy&author=aaaaaa or get all if empty
/**
 * @api {get} /gamedetails?name=xxx&author=xxx&editor=xxx&distributor=xxx&releaseDate=xxx&popularity=xxx&nbPlayer=xxx&gameLengthDesired=xxx&minAge=xxx&whatToSortBy=xxx&sortValue=xxx&limit=xxx&offset=xxx Request game information
 * @apiName GET gamedetails
 * @apiGroup gamedetails
 * @apiDescription Get a game with filters, pagination
 *
 * @apiParam {String} name Name of a game
 * @apiParam {Array} author Name of the author of a game
 * @apiParam {String} editor Name of the editor of a game
 * @apiParam {String} distributor Name of the distributor of a game
 * @apiParam {Date} releaseDate Date of the release of a game
 * @apiParam {String} popularity Popularity score of a game
 * @apiParam {String} nbPlayer Number of player desired which will compare playerMin and playerMax values
 * @apiParam {String} gameLengthDesired Time value in minutes which will compare gameLengthMin and gameLengthMax values
 * @apiParam {String} minAge Minimum age advised to play the game
 * @apiParam {String} whatToSortBy what field to use for sorting
 * @apiParam {Number} sortValue 1 for ascending sort or -1 for descending sort
 * @apiParam {Number} limit Required for pagination, set the number of entries per page
 * @apiParam {Number} offset Required for pagination, select the page desired (first one is 0)
 *
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:3100/gamedetails?limit=2&offset=1&whatToSortBy=popularity&sortValue=-1
 *
 * @apiSuccessExample {json} Success-Response:
 * {
    "content": [
        {
            "genres": [],
            "_id": "5e7a26929852d524bcfdffb3",
            "name": "Terraforming Mars",
            "author": ["Jacob Fryxelius"],
            "editor": "Intrafin",
            "distributor": "Intrafin",
            "releaseDate": "2016-04-01T00:00:00.000Z",
            "popularity": 13,
            "playerMin": 1,
            "playerMax": 5,
            "gameLengthMin": 60,
            "gameLengthMax": 120,
            "minAge": 12,
            "description": "L'ère de la domestication de Mars a commencé. Dans Terraforming Mars, de puissantes corporations travaillent pour rendre la Planète Rouge habitable. La température, l'oxygène et les océans sont les trois axes de développement principaux. Mais pour triompher, il faudra aussi construire des infrastructures pour les générations futures."
        },
        {
            "genres": [],
            "_id": "5e7a26929852d524bcfdffb1",
            "name": "Bunny Kingdom",
            "author": ["Richard Garfield"],
            "editor": "Iello",
            "distributor": "Iello",
            "releaseDate": "2018-01-01T00:00:00.000Z",
            "popularity": 12,
            "playerMin": 2,
            "playerMax": 4,
            "gameLengthMin": 30,
            "gameLengthMax": 60,
            "minAge": 14,
            "description": "Incarnez des seigneurs lapins et partez à la conquête d’un nouveau monde pour le compte du roi des lapins. Installez vos fiefs aux endroits stratégiques, exploitez les Ressources, bâtissez des Cités et préparez vos Missions secrètes pour voler à vos adversaires la victoire à la dernière minute. Chaque choix peut vous apporter les lauriers de la victoire ou l’ ombre de la défaite. Bunny Kingdom est un jeu de draft(sélection de cartes) et de placement qui se joue en 4 manches. Lors de chaque manche, les joueurs vont étendre leurs fiefs, augmenter leur Puissance et leur Richesse en construisant des Cités et en exploitant de nouvelles Ressources.Choisissez vos actions de chaque tour parmi les cartes que vous avez en main, avant de passer celles que vous ne jouez pas à vos adversaires. Chaque Manche se termine par un décompte de points dépendant de la Puissance et de la Richesse de vos Fiefs.Des Missions secrètes commandées par le roi des lapins au cours de la partie viendront sans doute perturber ce qui vous semblait établi avant le décompte final. À la fin de la partie, le joueur qui aura le plus fait prospérer son territoire sera nommé gouverneur du Nouveau Monde par le roi des lapins. Contient le plateau de jeu en version XL."
        }
    ]
}
 */
router.get('/', (req, res, next) => {
    let data = {};
    let query = {};
    let offset = 0;
    let limit = 0;
    let whatToSort= {};

    // search by name
    if (req.query.name) {
        let toRegexp= req.query.name;
        data['name'] = new RegExp(".*"+toRegexp+".*",'i');
    }
    // search by author
    if (req.query.author) {
        let toRegexp= req.query.author;
        data['author'] = new RegExp(".*"+toRegexp+".*",'i');
    }
    // search by editor
    if (req.query.editor) {
        let toRegexp= req.query.editor;
        data['editor'] = new RegExp(".*"+toRegexp+".*",'i');
    }
    // search by distributor
    if (req.query.distributor) {
        let toRegexp= req.query.distributor;
        data['distributor'] = new RegExp(".*"+toRegexp+".*",'i');
    }
    // search by release date
    if (req.query.releaseDate) {
        data['releaseDate'] = req.query.releaseDate;
    }
    // search by popularity
    if (req.query.popularity) {
        data['popularity'] = {'$gte':req.query.popularity};
    }
    // search number of players
    if (req.query.nbPlayer) {
        data['playerMin'] = { '$lte': req.query.nbPlayer };
        data['playerMax'] = { '$gte': req.query.nbPlayer };
    }
    // search by game length
    if (req.query.gameLengthDesired){
        data['gameLengthMin'] = { '$lte':req.query.gameLengthMin};
        data['gameLengthMax'] = { '$gte':req.query.gameLengthMax};
    }
    // search by minimum age
    if (req.query.minAge) {
        data['minAge'] = { '$gte': req.query.minAge};
    }
    // sort handling
    if (req.query.whatToSortBy && !req.query.sortValue || !req.query.whatToSortBy && req.query.sortValue){
        res.send({error: 'If you want to sort the results, you must provide what to sort(whatToSortBy) AND how to sort it(sortValue)'})
    }
    else if (req.query.whatToSortBy && req.query.sortValue){
        whatToSort[req.query.whatToSortBy] = req.query.sortValue;
        console.log(whatToSort)
    }

    console.log(data);
    query = GameDetails.find(data).populate('genres').sort(whatToSort);

    //pagination handling
    if (req.query.limit) {
        limit = parseInt(req.query.limit);
        query = query.limit(limit)
    }
    if (req.query.offset) {
        offset = parseInt(req.query.offset);
        query = query.skip(offset*limit)
    }
    query.exec((err, content) => {
        if (err) res.json({err: err});
        else {
            if (content) res.send({ content: content});
            else res.send({ content: []})
        }

})
});


//post create a game
/**
 * @api {post} /gamedetails/ Create a game
 * @apiName POST gamedetails
 * @apiGroup gamedetails
 * @apiDescription Create a game
 *
 * @apiParam {String} name Name of a game, REQUIRED
 * @apiParam {Array} author Name of the author of a game
 * @apiParam {String} editor Name of the editor of a game
 * @apiParam {String} distributor Name of the distributor of a game
 * @apiParam {Date} releaseDate Date of the release of a game
 * @apiParam {String} popularity Popularity score of a game
 * @apiParam {String} playerMin Minimum number of player required to start a game, REQUIRED
 * @apiParam {String} playerMax Maximum number of player required to start a game, REQUIRED
 * @apiParam {String} gameLengthMin Minimum time value in minutes that would take a game
 * @apiParam {String} gameLengthMax Maximum time value in minutes that would take a game
 * @apiParam {String} minAge Minimum age advised to play the game
 * @apiParam {String} description Description of a game
 * @apiParam {Array} genres Genre ID(s) of a game, REQUIRED
 *
 * @apiParamExample {json} Request-Example:
 *{
		"name": "7 Wonders Duelle 25",
		"author": "Bruno Cathala, Antoine Bauza",
		"editor": "Repos Production",
		"distributor": "Repos Production",
		"releaseDate": "2015-10-01T07:22Z",
		"popularity": 9,
		"playerMin": 2,
		"playerMax": 2,
		"gameLengthMin": 30,
		"gameLengthMax": 60,
		"minAge": 10,
		"genres":["5e6f7901a0d93148f48fd5ce"],
		"description":"Triomphez de votre adversaire en développant et améliorant votre civilisation sur les plans civil, scientifique et militaire. 7 Wonders Duel est l'adaptation 2 joueurs de 7 Wonders.>"
}
 *
 * @apiSuccessExample {json} Success-Response:
 *{
    "gameDetails": {
        "author": [
            "Bruno Cathala, Antoine Bauza"
        ],
        "genres": [
            "5e6f7901a0d93148f48fd5ce"
        ],
        "_id": "5e8afc246e335f2230b4f3e2",
        "name": "7 Wonders Duelle 25",
        "editor": "Repos Production",
        "distributor": "Repos Production",
        "releaseDate": "2015-10-01T07:22:00.000Z",
        "popularity": 9,
        "playerMin": 2,
        "playerMax": 2,
        "gameLengthMin": 30,
        "gameLengthMax": 60,
        "minAge": 10,
        "description": "Triomphez de votre adversaire en développant et améliorant votre civilisation sur les plans civil, scientifique et militaire. 7 Wonders Duel est l'adaptation 2 joueurs de 7 Wonders.>",
        "__v": 0
    },
    "msg": "Game created successfully."
}
 */
let genreDoNotExist = [];

router.post('/create', async(req, res, next) => {
    // check if game already exists
    const errorCheck = [];
    let gameToCreate = req.body;
    let gameToCreateGenresId =[];
        const GameAlreadyExists = await GameDetails.findOne({'name': req.body.name}, function (error, gameExists) {
            genreDoNotExist = [];
            // error handling
            if (gameExists) {
                errorCheck.push(req.body.name)
            }
        });

        if (errorCheck.length!==0){
            res.json({error : 'Game already exists by this name :' + req.body.name});
            return
        }

        if (req.body.genres.length !== 0) {

            const genrePromise = await req.body.genres.map(async (genre) =>
                Genre.findOne({_id: genre}, async function (err, result) {
                    if (!result) {
                        errorCheck.push(genre);
                    }
                    else {gameToCreateGenresId.push(result._id)}

                }));

            const resultGenre = await Promise.all(genrePromise);

            if (errorCheck.length === 0) {
                // put genre id table with game to create.
                gameToCreate.genres=gameToCreateGenresId;
                // create game in bdd
                GameDetails.create(gameToCreate, (err, content) => {
                    if (err) res.json({err: err});
                    else {
                        res.json({gameDetails: content, msg: 'Game created successfully.'})
                    }
                })
            } else {
                res.json({error: 'the following genres ' + errorCheck + ' do no exist.'});
            }
        } else {
            res.json({error: 'Genre is required.'})
        }
});

//get a game by it id
/**
 * @api {get} /gamedetails/_id get a game by it id
 * @apiName GET gamedetails
 * @apiGroup gamedetails
 * @apiDescription Get a game by it id
 *
 * @apiParam {ObjectID} _id Unique ID of a game
 *
 *
 * @apiSuccessExample {json} Success-Response:
 * {
    "content": {
        "author": [
            "Bruno Cathala, Antoine Bauza"
        ],
        "genres": [
            {
                "_id": "5e6f7901a0d93148f48fd5ce",
                "genre": "proutprout",
                "createdAt": "2020-03-16T13:02:57.605Z",
                "updatedAt": "2020-03-16T13:02:57.605Z",
                "__v": 0
            }
        ],
        "_id": "5e8afc246e335f2230b4f3e2",
        "name": "7 Wonders Duelle 25",
        "editor": "Repos Production",
        "distributor": "Repos Production",
        "releaseDate": "2015-10-01T07:22:00.000Z",
        "popularity": 9,
        "playerMin": 2,
        "playerMax": 2,
        "gameLengthMin": 30,
        "gameLengthMax": 60,
        "minAge": 10,
        "description": "Triomphez de votre adversaire en développant et améliorant votre civilisation sur les plans civil, scientifique et militaire. 7 Wonders Duel est l'adaptation 2 joueurs de 7 Wonders.>",
        "__v": 0
    }
}
 */
router.get('/:id', function (req, res, next) {
    // find a game by it id
    if (req.params.id.length !== 24) {
        res.json({
            err: 'Please provide a valid id param.'
        })
    } else {
        GameDetails.findById(
            req.params.id).populate('genres').exec((err, content) => {
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
                        err: 'No game found with this id.'
                    })
                }
            }
        })
    }
});

//delete a game
/**
 * @api {DELETE} /gamedetails/_id delete a game by it id
 * @apiName DELETE gamedetails
 * @apiGroup gamedetails
 * @apiDescription Delete a game by it id
 *
 * @apiParam {ObjectID} _id Unique ID of a game
 *
 *
 * @apiSuccessExample {json} Success-Response:
 * {
    "_id": "5e8afc246e335f2230b4f3e2",
    "msg": "Game deleted successfully."
}
 */
router.delete('/:id', (req, res, next) => {
    if (!req.params.id) res.json({
        err: 'Please provide an id param.'
    });
    else if (req.params.id.length !== 24)
        res.json({
            err: 'Please provide a valid id param, 24 digits.'
        });
    else
        GameDetails.findByIdAndDelete(req.params.id, (err, content) => {
            if (err) res.json({
                err: err
            });
            else
            if (content) {
                res.json({
                    _id: req.params.id,
                    msg: 'Game deleted successfully.'
                })
            } else {
                res.json({
                    err: 'No game found with this id.'
                })
            }
        })
});

// modify a game
/**
 * @api {put} /gamedetails/_id Modify a game
 * @apiName PUT gamedetails
 * @apiGroup gamedetails
 * @apiDescription Modify a game
 *
 * @apiParam {ObjectID} _id Unique ID of a game, make reference to id via the request param, NOT PART OF THE REQUEST BODY
 *
 * @apiParam {String} name Name of a game, REQUIRED
 * @apiParam {Array} author Name of the author of a game
 * @apiParam {String} editor Name of the editor of a game
 * @apiParam {String} distributor Name of the distributor of a game
 * @apiParam {Date} releaseDate Date of the release of a game
 * @apiParam {String} popularity Popularity score of a game
 * @apiParam {String} playerMin Minimum number of player required to start a game, REQUIRED
 * @apiParam {String} playerMax Maximum number of player required to start a game, REQUIRED
 * @apiParam {String} gameLengthMin Minimum time value in minutes that would take a game
 * @apiParam {String} gameLengthMax Maximum time value in minutes that would take a game
 * @apiParam {String} minAge Minimum age advised to play the game
 * @apiParam {String} description Description of a game
 * @apiParam {Array} genres Genre ID(s) of a game, REQUIRED
 *
 * @apiParamExample {json} Request-Example:
 *{
		"name": "7 Wonders Duelle 55",
		"author": "Bruno Cathastrophe, Antoine Bozar",
		"editor": "En marche Production",
		"distributor": "Garde à vous Production",
		"releaseDate": "2015-10-01T07:22Z",
		"popularity": 9,
		"playerMin": 2,
		"playerMax": 2,
		"gameLengthMin": 30,
		"gameLengthMax": 60,
		"minAge": 10,
		"genres":["5e6f7901a0d93148f48fd5ce"],
		"description":"Triomphez de votre adversaire en développant et améliorant votre civilisation sur les plans civil, scientifique et militaire. 7 Wonders Duel est l'adaptation 2 joueurs de 7 Wonders.>"
}
 *
 * @apiSuccessExample {json} Success-Response:
 *{
    "gameDetails": {
        "n": 1,
        "nModified": 0,
        "ok": 1
    },
    "msg": "Game updated successfully."
}
 */
router.put('/:id', async (req, res, next) =>{
    const errorCheck = [];
    let gameToModify = req.body;
    let gameToModifyGenresId =[];
    if (!req.params.id) res.json({
        err: 'Please provide an id param.'
    });
    else if (req.params.id.length !== 24)
        res.json({
            err: 'Please provide a valid id param, 24 digits.'
        });
    // check if game already exists
    else { const GameDoesNotExists = await GameDetails.findById(req.params.id, function (error, gameExists) {
        genreDoNotExist = [];
        // error handling
        if (!gameExists) {
            errorCheck.push(req.params.id)
        }
    });

    }
    if (errorCheck.length!==0){
        res.json({error : 'Game Does not exists by this id : ' + req.params._id+ '. Please create it first!'});
        return
    }

    if (req.body.genres.length !== 0) {

        const genrePromise = await req.body.genres.map(async (genre) =>
            Genre.findOne({_id: genre}, async function (err, result) {
                if (!result) {
                    errorCheck.push(genre);
                }
                else {gameToModifyGenresId.push(result._id)}

            }));

        const resultGenre = await Promise.all(genrePromise);

        if (errorCheck.length === 0) {
            // put genre id table with game to create.
            gameToModify.genres=gameToModifyGenresId;
            // create game in bdd
            GameDetails.updateOne({_id:req.params.id}, gameToModify, (err, content) => {
                if (err) res.json({err: err});
                else {
                    res.json({gameDetails: content, msg: 'Game updated successfully.'})
                }
            })
        } else {
            res.json({error: 'the following genres ' + errorCheck + ' do no exist.'});
        }
    } else {
        res.json({error: 'Genre is required.'})
    }

});

module.exports = router;
