import { pool } from './database';
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
  app.get('/files', async (req, res) => {
    if (process.env.NODE_ENV == "development") {
      res.setHeader('Access-Control-Allow-Origin',  "http://localhost:3001");
      glob("data/*.json", {}, function (err, files) {
        res.send({ files: files.map(f => f.replace("data/", "").replace(".json", "")) })
      })
    }
    else {
      const result = await pool.query("SELECT game_id FROM games")
      res.send({ files: result.rows.map(r => r.game_id )})
    }
  })
  app.get('/fetch/:id', async (req, res) => {
    if (process.env.NODE_ENV == "development") {
      res.setHeader('Access-Control-Allow-Origin',  "http://localhost:3001");
      res.send({
        code: fs.readFileSync('data/' + req.params.id + '.json', 'utf8')
      })
    }
    else {
      const result = await pool.query("SELECT data FROM games WHERE game_id=$1", [req.params.id])
      res.send({ code: JSON.stringify(result.rows[0].data, null, 2) })
    }
  })
  app.post('/fetch/:id', async (req, res) => {
    if (process.env.NODE_ENV == "development") {
      res.setHeader('Access-Control-Allow-Origin',  "http://localhost:3001");
      fs.writeFileSync('data/' + req.params.id + '.json', JSON.parse(req.body.code).toString())
    }
    else {
      await pool.query("UPDATE games SET data=$1 WHERE game_id=$2", [JSON.parse(req.body.code).toString(), req.params.id])
    }
    res.send({
      response: true
    })
  })
  app.get('/*', (_req, res) => res.sendFile(__dirname + '/react/index.html'))
  const server = app.listen(process.env.PORT || 3000)

  process.env.TZ = "Europe/London"
  return server
}