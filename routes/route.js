import controller from '../controllers/controller.js';
import {Router} from 'express';

const router = Router();

router.get('/', controller.index_get);
router.route('/register').get(controller.register_get).post(controller.register_post);
router.route('/login').get(controller.login_get).post(controller.login_post);
router.route('/change-password').get(controller.change_password_get).post(controller.change_password_post);
export default router;