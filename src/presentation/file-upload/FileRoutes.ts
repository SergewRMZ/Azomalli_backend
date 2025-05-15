import { Router } from 'express';
import { FileUploadController } from './FileController';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadMiddleware } from '../middleware/file-upload.middleware';
import { TypeMiddleware } from '../middleware/type.middleware';

export class FileUploadRoutes {
  static get routes(): Router {

    const router = Router();
    const controller = new FileUploadController(
      new FileUploadService()
    );

    router.use( FileUploadMiddleware.containFiles );
    router.use( TypeMiddleware.validTypes(['users']) );
    router.post( '/single/:type', controller.uploadFile);
    return router;
  }
}