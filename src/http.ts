const path = require('path')
const fs = require('fs')
const glob = require("glob")
const bodyParser = require('body-parser')
const express = require('express')

export const http_server = () => {
  const app = express()
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use('/', express.static(path.join(__dirname, 'react')))
  app.get('/files', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin',  "http://localhost:3001");
    glob("data/*.json", {}, function (err, files) {
      res.send({ files: files.map(f => f.replace("data/", "").replace(".json", "")) })
    })
  })
  app.get('/fetch/:id', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin',  "http://localhost:3001");
    res.send({
      code: fs.readFileSync('data/' + req.params.id + '.json', 'utf8')
    })
  })
  app.post('/fetch/:id', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin',  "http://localhost:3001");
    fs.writeFileSync('data/' + req.params.id + '.json', JSON.parse(req.body.code).toString())
    res.send({
      response: true
    })
  })
  app.get('/*', (_req, res) => res.sendFile(__dirname + '/react/index.html'))
  const server = app.listen(process.env.PORT || 3000)

  process.env.TZ = "Europe/London"
  return server
}