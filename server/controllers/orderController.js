import Order from "../models/orderModel.js";
import Product from "../models/productModels.js";
import sendEmail from "../utils/sendEmail.js";

export const newOrder = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    // Stock Update logic
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save({ validateBeforeSave: false });
      }
    }

    // --- EMAIL ITEMS LIST GENERATION ---
    const productRows = orderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs ${item.price}</td>
      </tr>
    `).join("");

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
        <h2 style="color: #0F172A; text-align: center;">ORDER CONFIRMED!</h2>
        <p>Assalam-o-Alaikum <b>${shippingInfo.name}</b>,</p>
        <p>Aapka order receive ho gaya hy. Details niche di gai hain:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #F8FAFC;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
          </tbody>
        </table>

        <div style="background-color: #F8FAFC; padding: 15px; border-radius: 10px;">
          <p style="margin: 5px 0;"><b>Subtotal:</b> Rs ${itemsPrice}</p>
          <p style="margin: 5px 0;"><b>Shipping:</b> Rs ${shippingPrice}</p>
          <p style="margin: 5px 0; font-size: 18px; color: #10B981;"><b>Total Bill:</b> Rs ${totalPrice}</p>
        </div>

        <p style="margin-top: 20px;"><b>Shipping Address:</b><br/> ${shippingInfo.address}, ${shippingInfo.city}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="text-align: center; color: #94A3B8; font-size: 12px;">Thank you for shopping with SA-Cart!</p>
      </div>
    `;

    // --- EMAIL LOGIC WITH DEBUGGING ---
    const recipientEmail = shippingInfo.email || req.user.email;
    
    console.log("DEBUG: Checking Recipient Email...", recipientEmail);

    if (recipientEmail) {
      try {
        await sendEmail({
          to: recipientEmail,
          subject: `Order Success - ID: ${order._id}`,
          html: emailHtml,
        });
        console.log("DEBUG: Email sent request successful!");
      } catch (mailErr) {
        console.log("DEBUG: sendEmail function error =>", mailErr.message);
      }
    } else {
      console.log("DEBUG: No email address found in shippingInfo or req.user!");
    }

    res.status(201).json({
      success: true,
      message: "Order placed and confirmation email process done!",
      order,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Orders -- Admin (With Sorting & Pagination)
export const getAllOrders = async (req, res) => {
  try {
    const resultPerPage = 10;
    const ordersCount = await Order.countDocuments();
    const page = Number(req.query.page) || 1;
    const skip = resultPerPage * (page - 1);

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(resultPerPage)
      .skip(skip);

    let totalAmount = 0;
    const allOrders = await Order.find();
    allOrders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      totalAmount,
      orders,
      ordersCount,
      resultPerPage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Order Details -- Admin/User
export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Order Status -- Admin
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order nahi mila" });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({ success: false, message: "Yeh order pehle hi deliver ho chuka hy" });
    }

    // Status update karna (Processing -> Shipped -> Delivered)
    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Order status update ho gaya hy",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};