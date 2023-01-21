import { Request, Response, Router } from 'express';
import testRoutes from './test';


const router = Router();

router.use('/test', testRoutes);

router.use('/', (req:Request,res:Response)=>res.send("student router"));


export default router;