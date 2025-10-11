import express from 'express' ;
import secureRoute from 'src/middlewares/secureRouteMiddleware.js';
import { getNotifications, markAsRead } from 'src/controllers/teamMemberController.js';



const router = express.Router() ;

router.get('/', secureRoute , getNotifications) ;
router.patch('/:id/read' , secureRoute , markAsRead) ;

export default router ;