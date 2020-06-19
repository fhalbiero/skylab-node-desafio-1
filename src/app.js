const express = require('express');
const { uuid } = require('uuidv4');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const repositories = [];


function findRepositoryById(request, response, next) {
    const { id } = request.params;

    const index = repositories.findIndex(repository => repository.id === id);

    if (index < 0) {
        return response.status(400).json({error: "Repository not found!"});
    }

    request.params.index = index;
    next();
}

app.use('/repositories/:id', findRepositoryById);


app.get('/repositories',(request, response) => {   
    return response.status(200).json(repositories);
});


app.post('/repositories', (request, response) => {
    const { title, url, techs } = request.body;

    const repository = { id: uuid(), title, url, techs, likes: 0 }

    repositories.push(repository);

    response.status(201).json(repository);
});


app.put('/repositories/:id', (request, response) => {
    const { index } = request.params;
    const { title, url, techs } = request.body;

    const repository = {...repositories[index], title, url, techs} 
    repositories[index] = repository

    return response.status(200).json(repository);
})


app.delete('/repositories/:id', (request, response) => {
    const { index } = request.params;

    repositories.splice(index, 1);

    return response.status(204).send();

});


app.post('/repositories/:id/like', findRepositoryById, (request, response) => {
    const { index } = request.params;

    repositories[index].likes = repositories[index].likes + 1;
    
    return response.status(200).send(repositories[index]);
});


app.post('/repositories/:id/unlike', findRepositoryById, (request, response) => {
    const { index } = request.params;

    if (repositories[index].likes > 0) {
       repositories[index].likes = repositories[index].likes - 1; 
    }
     
    return response.status(200).send(repositories[index]);
});


module.exports = app;
