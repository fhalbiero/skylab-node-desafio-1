const express = require('express');
const { uuid } = require('uuidv4');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const repositories = [];


function findRepositoryById(req, res, next) {
    const { id } = req.params;

    const index = repositories.findIndex(repository => repository.id === id);

    if (index < 0) return res.status(400).json({error: "Repository not found"});

    req.params.index = index;
    
    next();
}

app.use('/repositories/:id', findRepositoryById);


app.get('/repositories',(req, res) => res.status(200).json(repositories));


app.post('/repositories', (req, res) => {

    const { title, url, techs } = req.body;

    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0
    }

    repositories.push(repository);

    res.status(201).json(repository);
});


app.put('/repositories/:id', (req, res) => {
    const { index } = req.params;
    const { title, url, techs } = req.body;

    const {id, likes} = repositories[index];

    const repository = {
        id,
        title,
        url,
        techs,
        likes
    }

    repositories[index] = repository;

    return res.status(200).send();
})


app.delete('/repositories/:id', (req, res) => {
    const { index } = req.params;

    repositories.splice(index, 1);

    return res.status(204).send();

});


app.post('/repositories/:id/like', findRepositoryById, (req, res) => {
    const { index } = req.params;

    repositories[index].likes = repositories[index].likes + 1;
    
    return res.status(200).send(repositories[index]);
});


app.post('/repositories/:id/unlike', findRepositoryById, (req, res) => {
    const { index } = req.params;

    if (repositories[index].likes > 0) {
       repositories[index].likes = repositories[index].likes - 1; 
    }
     
    return res.status(200).send(repositories[index]);
});


module.exports = app;
