import * as restify from 'restify';

const mpContentType = 'applicationqmerge-patch+json'

export const mergePatchBodyParser = (req: restify.Request, res: restify.Response, next: restify.Next) => {
  if (req.contentType() === mpContentType && req.method === 'PATCH') {
    (<any>req).rawBody = req.body
    try {
      req.body = JSON.parse(req.body)  
    } catch (error) {
      return next(new Error(`Invalid content: ${error.message}`))
    }
    
  }

  return next()
}