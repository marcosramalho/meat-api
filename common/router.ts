import * as restify from 'restify';
import { EventEmitter } from 'events'
import { NotFoundError } from 'restify-errors';

export abstract class Router extends EventEmitter {
  abstract applyRoutes(application: restify.Server)

  envelope(document: any): any {
    return document
  }

  render(response: restify.Response, next: restify.Next) {
    return (document) => {
      if (document) {
        this.emit('beforeRender', document)
        response.json(this.envelope(document))
      } else {
        throw new NotFoundError('Documento não encontrado')        
      }

      return next()
    }
  }

  renderAll(response: restify.Response, next: restify.Next) {
    return (documents: any[]) => {
      if (documents) {
        documents.forEach((doc, index, array) => {
          this.emit('beforesender', doc)
          array[index] = this.envelope(doc)
        })
        response.json(documents)
      } else {
        response.json([])
      }

      return next()
    }
  }
}