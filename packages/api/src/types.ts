import * as Koa from 'koa'
import * as KoaRouter from 'koa-router'
import { Server } from 'http'
import winston = require('winston')

export interface IApplication {
  listen: (port: number) => Server
}
export type ApplicationState = {
  correlationId: string
}
export interface IApplicationContext
  extends Koa.ParameterizedContext<ApplicationState> {
  logger: winston.Logger
}
export type ApplicationMiddleware = Koa.Middleware<
  ApplicationState,
  IApplicationContext
>
export type ApplicationKoa = Koa<ApplicationState, IApplicationContext>
export type ApplicationRouter = KoaRouter<ApplicationState, IApplicationContext>
