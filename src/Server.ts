import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as controllers from './controllers';

import { Server as BaseServer } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';

export default class Server extends BaseServer {

  private readonly SERVER_START_MSG = 'Server started on port: ';
  private readonly DEV_MSG = 'Express Server is running in development mode. No front-end ' +
    'content is being served.';

  constructor() {
    super(true);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.setupControllers();
    if (process.env.NODE_ENV !== 'production') {
      this.app.get('*', (req, res) => res.send(this.DEV_MSG));
    } else {
      this.serveFrontEndProd();
    }
  }

  private setupControllers(): void {
    const ctlrInstances = [];
    for (const name in controllers) {
      if (controllers.hasOwnProperty(name)) {
        let Controller = (controllers as any)[name];
        ctlrInstances.push(new Controller());
      }
    }
    super.addControllers(ctlrInstances);
  }

  private serveFrontEndProd(): void {
    const dir = path.join(__dirname, 'public/react/');
    this.app.set('views',  dir);
    this.app.use(express.static(dir));
    this.app.get('*', (req, res) => {
      res.sendFile('index.html', {root: dir});
    });
  }


  public start(port: number): void {
    this.app.listen(port, () => {
      Logger.Imp(this.SERVER_START_MSG + port);
    });
  }
}
