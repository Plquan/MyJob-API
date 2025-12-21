import express from 'express';
import http from 'http';

/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
export class Server {
  public app = express();
  public httpServer: http.Server;

  constructor() {
    this.httpServer = http.createServer(this.app);
  }
}