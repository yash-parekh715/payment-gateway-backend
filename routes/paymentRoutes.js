const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *                 clientSecret:
 *                   type: string
 *       400:
 *         description: Invalid or missing payment method
 *       500:
 *         description: Failed to create payment
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create a payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       500:
 *         description: Server error
 */
router.post("/payments", paymentController.createPayment);

/**
 * @swagger
 * /payments/{user_id}/process:
 *   post:
 *     summary: Process a payment
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The payment ID
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.post("/payments/:user_id/process", paymentController.processPayment);

/**
 * @swagger
 * /payments/{user_id}:
 *   get:
 *     summary: Retrieve payment status
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The payment ID
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.get("/payments/:user_id", paymentController.getPaymentStatus);

/**
 * @swagger
 * /payments/{user_id}/refund:
 *   post:
 *     summary: Refund a payment
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: payment_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The payment ID
 *     responses:
 *       200:
 *         description: Payment refunded successfully
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.post("/payments/:user_id/refund", paymentController.refundPayment);

module.exports = router;
