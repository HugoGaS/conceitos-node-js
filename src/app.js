const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.send(repositories);
});

app.post("/repositories", (request, response) => {
  let repo = request.body;
  repo = { id: uuid(), likes: 0, ...repo };

  repositories.push(repo);

  response.send(repo);
});

app.put("/repositories/:id", (request, response) => {
  let id = request.params.id;
  let data = request.body;

  let index = repositories.findIndex(e => {
    return e.id === id
  });

  if (!(index >= 0)) {
    return response.status(400).json({ "error": "Repositório não existente!" });
  }

  repositories[index].title = data.title ? data.title : repositories[index].title;
  repositories[index].techs = data.techs ? data.techs : repositories[index].techs;
  repositories[index].url = data.url ? data.url : repositories[index].url;

  return response.send(repositories[index]);

});

app.delete("/repositories/:id", (request, response) => {
  let id = request.params.id;

  let index = repositories.findIndex(e => {
    return e.id === id
  });

  if (!(index >= 0)) {
    return response.status(400).json({ "error": "Repositório não existente!" });
  }

  repositories.splice(index);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  let id = request.params.id;

  let index = repositories.findIndex(e => {
    return e.id === id
  });

  if (!(index >= 0)) {
    return response.status(400).json({ "error": "Repositório não existente!" });
  }

  repositories[index].likes = +repositories[index].likes + 1;

  return response.send(repositories[index]);
});

module.exports = app;
