const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


const existRepository = (request, response, next) => {

  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(element => element.id === id);

    if (repositoryIndex<0) 
    {
      return response.status(400).json({ error: 'Repository not found' });
    }

  request.repositoryIndex = repositoryIndex; 
  return next();
  
}

app.use("/repositories/:id", existRepository);
app.use("/repositories/:id/like", existRepository);




app.get("/repositories", (request, response) => {

  return response.status(200).json(repositories);

});

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;
  
  const newRepository = {
    id: uuid(),
    title,
    url, 
    techs,
    likes: 0
  };  

  repositories.push(newRepository);

  return response.status(201).json(newRepository);

});

app.put("/repositories/:id", (request, response) => {

  const { title, url, techs } = request.body;

  const updatedRepository = {
    title,
    url,
    techs
  }
  
  repositories[request.repositoryIndex] = {
    ...repositories[request.repositoryIndex],
    ...updatedRepository
  }

  return response.status(201).json(repositories[request.repositoryIndex]);

});

app.delete("/repositories/:id", (request, response) => {

  repositories.splice(request.repositoryIndex,1);

  return response.status(204).send();

});


app.post("/repositories/:id/like", (request, response) => {

  repositories[request.repositoryIndex] = {
    ...repositories[request.repositoryIndex],
    likes:++repositories[request.repositoryIndex].likes,
  }

  return response.status(201).json(repositories[request.repositoryIndex]);

});

module.exports = app;
