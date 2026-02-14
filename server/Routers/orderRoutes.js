import express from 'express';
import { 
  newOrder, 
  getAllOrders, 
  getSingleOrder, 
  updateOrder, 
  deleteOrder,
  myOrders // 1: Isay lazmi import karen
} from '../controllers/orderController.js';
import { isAuthorized, authorizeRoles } from '../middleware/authMiddleware.js';

const orderRouter = express.Router();

// --- ORDER ROUTES ---

// 1: Create New Order (User)
orderRouter.post('/new', isAuthorized, newOrder);

// 2: MY ORDERS (User ke apne orders - Hamesha :id se ooper!)
// Yeh route missing tha, isliye error aa raha tha
orderRouter.get('/me', isAuthorized, myOrders);

// 3: Get All Orders (Admin Only)
orderRouter.get('/admin/orders', isAuthorized, authorizeRoles("admin"), getAllOrders);

// 4: Get Single Order Detail (Admin/User)
// Yeh niche hi rahay ga taake 'me' ko ID na samjhy
orderRouter.get('/:id', isAuthorized, getSingleOrder);

// 5: Update Order Status (Admin Only)
orderRouter.put('/admin/order/:id', isAuthorized, authorizeRoles("admin"), updateOrder);

// 6: Delete Order (Admin Only)
orderRouter.delete('/admin/order/:id', isAuthorized, authorizeRoles("admin"), deleteOrder);

export default orderRouter;