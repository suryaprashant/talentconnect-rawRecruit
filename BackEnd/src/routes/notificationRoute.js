import express from 'express' ;
import secureRoute from '../middlewares/secureRouteMiddleware.js';
import { getNotifications, markAsRead } from '../controllers/teamMemberController.js';
import { getUnreadNotifications } from '../controllers/notificationController.js';


const router = express.Router() ;

router.get('/', secureRoute , getNotifications) ;
router.patch('/:id/read' , secureRoute , markAsRead) ;
router .get('/unread', secureRoute, getUnreadNotifications) ;
export default router ;