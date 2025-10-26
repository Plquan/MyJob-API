// import { plainToInstance } from 'class-transformer';
// import { validate, ValidationError } from 'class-validator';
// import { RequestHandler } from 'express';
// import { HttpException } from '@/errors/http-exception';
// import { StatusCodes } from '../enums/status-code/status-code.enum';


// function validationMiddleware(
//     type: any, 
//     skipMissingProperties = false, 
//     requireFile = false,
//     fromForm = false
// ): RequestHandler {
//     return (req, res, next) => {
//         let parsedBody: any;

//         try {
//             if (fromForm) {
//                 if (typeof req.body?.data !== 'string') {
//                     const error = new HttpException(StatusCodes.BAD_REQUEST, 'ss');
//                      res.status(StatusCodes.BAD_REQUEST).json(error);
//                    return
//                 }
//                 parsedBody = JSON.parse(req.body.data);
//             } else {
//                 parsedBody = req.body;
//             }
//         } catch (err) {
//              const error = new HttpException(StatusCodes.BAD_REQUEST,'ss');
//              res.status(StatusCodes.BAD_REQUEST).json(error);
//              return
//         }

//         if (!parsedBody) {
//             const error = new HttpException(StatusCodes.BAD_REQUEST,'ss');
//              res.status(StatusCodes.BAD_REQUEST).json(error);
//              return
//         }

//         if (requireFile && !req.file) {
//              const error = new HttpException(StatusCodes.BAD_REQUEST, 'ss');
//              res.status(StatusCodes.BAD_REQUEST).json(error);
//              return
//         }

//         validate(plainToInstance(type, parsedBody), { skipMissingProperties })
//             .then((errors: ValidationError[]) => {
//                 if (errors.length > 0) {
//                     const errorMessages = errors.map((error: ValidationError) => error.constraints);
//                     const error = new HttpException(StatusCodes.BAD_REQUEST, '');
//                      res.status(StatusCodes.BAD_REQUEST).json(error);
//                      return
//                 }

//                 req.body = parsedBody;
//                 next();
//             });
//     };
// }

// export default validationMiddleware;