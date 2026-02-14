import express from 'express';
import { newOrder, getAllOrders, getSingleOrder, updateOrder } from '../controllers/orderController.js'; // updateOrder add kiya
import { isAuthorized, authorizeRoles } from '../middleware/authMiddleware.js';

const orderRouter = express.Router();

// --- ORDER ROUTES ---

// 1: Create New Order (User)
orderRouter.post('/new', isAuthorized, newOrder);

// 2: Get All Orders (Admin Only)
orderRouter.get('/admin/orders', isAuthorized, authorizeRoles("admin"), getAllOrders);

// 3: Get Single Order Detail (Admin/User)
orderRouter.get('/:id', isAuthorized, getSingleOrder);

// 4: Update Order Status (Admin Only)
// Is raste se admin status change (Processing -> Delivered) kare ga
orderRouter.put('/admin/order/:id', isAuthorized, authorizeRoles("admin"), updateOrder);

export default orderRouter;