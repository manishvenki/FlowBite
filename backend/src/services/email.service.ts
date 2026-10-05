import nodemailer from 'nodemailer';
import { IOrder } from '../models/Order';
import { IUser } from '../models/User';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Create transport or fallback logger transport
const createEmailTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback dev transporter (logs to console)
  return {
    sendMail: async (options: any) => {
      console.log('\n=================== [BiteFlow Email Simulation] ===================');
      console.log(`📨 To:      ${options.to}`);
      console.log(`✉️ From:    ${options.from || process.env.MAIL_FROM || 'orders@biteflow.com'}`);
      console.log(`📌 Subject: ${options.subject}`);
      console.log('-------------------------------------------------------------------');
      console.log('Email dispatched successfully (Simulated SMTP mode).');
      console.log('===================================================================\n');
      return { messageId: `simulated-${Date.now()}` };
    },
  };
};

const transporter = createEmailTransporter();

// Helper to format currency in INR (₹)
const formatInr = (amount: number): string => {
  const isWhole = Number.isInteger(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: isWhole ? 0 : 2,
    minimumFractionDigits: isWhole ? 0 : 2,
  }).format(amount || 0);
};

// Brand styled email template
const generateBiteFlowEmailHtml = (params: {
  title: string;
  greeting: string;
  statusBadge: string;
  badgeBg: string;
  badgeColor: string;
  message: string;
  orderNumber: string;
  restaurantName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  totalAmount: number;
  address: string;
  actionText?: string;
  actionUrl?: string;
}) => {
  const {
    title,
    greeting,
    statusBadge,
    badgeBg,
    badgeColor,
    message,
    orderNumber,
    restaurantName,
    items,
    subtotal,
    deliveryFee,
    platformFee,
    totalAmount,
    address,
  } = params;

  const itemsRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #EDE4D3; color: #3F4933; font-size: 14px;">
          <strong>${item.quantity}×</strong> ${item.name}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #EDE4D3; color: #3F4933; font-size: 14px; text-align: right; font-weight: 600;">
          ${formatInr(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 20px 0; background-color: #FAF8F0; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFDF5; border: 1px solid #EDE4D3; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(63, 73, 51, 0.06);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #3F4933; padding: 30px 40px; text-align: center;">
                    <h1 style="margin: 0; color: #FFFDF5; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">
                      Bite<span style="color: #EDE4D3;">Flow</span>
                    </h1>
                    <p style="margin: 4px 0 0 0; color: #EDE4D3; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">
                      Order. Prepare. Deliver.
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 35px 40px;">
                    <div style="display: inline-block; background-color: ${badgeBg}; color: ${badgeColor}; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 5px 12px; border-radius: 9999px; margin-bottom: 16px;">
                      ${statusBadge}
                    </div>

                    <h2 style="margin: 0 0 12px 0; color: #3F4933; font-size: 20px; font-weight: 700;">
                      ${greeting}
                    </h2>
                    <p style="margin: 0 0 24px 0; color: #68734F; font-size: 14px; line-height: 1.6;">
                      ${message}
                    </p>

                    <!-- Order Summary Box -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7EE; border: 1px solid #EDE4D3; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                      <tr>
                        <td style="padding-bottom: 12px; border-bottom: 1px solid #DECDB8;">
                          <div style="font-size: 11px; color: #828F66; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Order Reference</div>
                          <div style="font-size: 16px; font-weight: 700; color: #3F4933; margin-top: 2px;">#${orderNumber}</div>
                        </td>
                        <td style="padding-bottom: 12px; border-bottom: 1px solid #DECDB8; text-align: right;">
                          <div style="font-size: 11px; color: #828F66; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Kitchen</div>
                          <div style="font-size: 16px; font-weight: 700; color: #3F4933; margin-top: 2px;">${restaurantName}</div>
                        </td>
                      </tr>

                      <!-- Items -->
                      <tr>
                        <td colspan="2" style="padding-top: 12px;">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            ${itemsRows}
                          </table>
                        </td>
                      </tr>

                      <!-- Totals -->
                      <tr>
                        <td colspan="2" style="padding-top: 16px;">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; color: #5b6545;">
                            <tr>
                              <td style="padding: 3px 0;">Subtotal</td>
                              <td style="padding: 3px 0; text-align: right;">${formatInr(subtotal)}</td>
                            </tr>
                            <tr>
                              <td style="padding: 3px 0;">Delivery Fee</td>
                              <td style="padding: 3px 0; text-align: right;">${formatInr(deliveryFee)}</td>
                            </tr>
                            <tr>
                              <td style="padding: 3px 0;">Platform Fee</td>
                              <td style="padding: 3px 0; text-align: right;">${formatInr(platformFee)}</td>
                            </tr>
                            <tr>
                              <td style="padding: 10px 0 0 0; font-size: 16px; font-weight: 700; color: #3F4933; border-top: 1px solid #DECDB8;">
                                Total Amount
                              </td>
                              <td style="padding: 10px 0 0 0; font-size: 18px; font-weight: 700; color: #68734F; text-align: right; border-top: 1px solid #DECDB8;">
                                ${formatInr(totalAmount)}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Delivery Address Box -->
                    <div style="background-color: #FAF7EE; border: 1px solid #EDE4D3; border-radius: 12px; padding: 16px; font-size: 13px; color: #3F4933;">
                      <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #68734F; margin-bottom: 4px;">
                        Delivery Destination
                      </div>
                      <div style="line-height: 1.5;">${address}</div>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #FAF7EE; padding: 24px 40px; text-align: center; border-top: 1px solid #EDE4D3; color: #828F66; font-size: 12px;">
                    <p style="margin: 0 0 6px 0; font-weight: 600; color: #3F4933;">
                      Thank you for dining mindfully with BiteFlow.
                    </p>
                    <p style="margin: 0;">
                      Questions about your delivery? Contact our culinary care desk at support@biteflow.com
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

// Generic mail dispatcher with error catching
const sendMail = async (options: EmailOptions): Promise<void> => {
  try {
    const from = process.env.MAIL_FROM || 'BiteFlow Dining <orders@biteflow.com>';
    await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (error) {
    console.error(`[BiteFlow Email] Error delivering mail to ${options.to}:`, error);
  }
};

const getRestaurantName = (restaurantId: any): string => {
  if (typeof restaurantId === 'object' && restaurantId !== null && 'name' in restaurantId) {
    return (restaurantId as any).name;
  }
  return 'Artisanal Kitchen';
};

const formatAddressString = (addr: any): string => {
  if (!addr) return 'Delivery Address on Record';
  const pin = addr.pincode || addr.zipCode || '560038';
  const country = addr.country ? `, ${addr.country}` : ', India';
  return `${addr.street}, ${addr.city || 'Bengaluru'}, ${addr.state || 'Karnataka'} ${pin}${country}`;
};

// 1. Order Placed Email
export const sendOrderPlacedEmail = async (order: IOrder, user: IUser): Promise<void> => {
  const restaurantName = getRestaurantName(order.restaurantId);
  const address = formatAddressString(order.deliveryAddress);

  const html = generateBiteFlowEmailHtml({
    title: `Your BiteFlow Order #${order.orderNumber} Placed`,
    greeting: `Thank you for your order, ${user.name}!`,
    statusBadge: 'Order Placed',
    badgeBg: '#E8EFE0',
    badgeColor: '#3F4933',
    message: 'Your BiteFlow order has been placed successfully. The kitchen has received your request and will begin reviewing your meal.',
    orderNumber: order.orderNumber,
    restaurantName,
    items: order.items,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    platformFee: order.platformFee,
    totalAmount: order.totalAmount,
    address,
  });

  await sendMail({
    to: user.email,
    subject: `Order Confirmed: #${order.orderNumber} from ${restaurantName}`,
    html,
  });
};

// 2. Order Accepted Email
export const sendOrderAcceptedEmail = async (order: IOrder, user: IUser): Promise<void> => {
  const restaurantName = getRestaurantName(order.restaurantId);
  const address = formatAddressString(order.deliveryAddress);

  const html = generateBiteFlowEmailHtml({
    title: `Order Accepted: #${order.orderNumber}`,
    greeting: `Great news, ${user.name}!`,
    statusBadge: 'Order Accepted',
    badgeBg: '#EDE4D3',
    badgeColor: '#3F4933',
    message: `Your order has been accepted by ${restaurantName}. The culinary staff is preparing your kitchen workstation.`,
    orderNumber: order.orderNumber,
    restaurantName,
    items: order.items,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    platformFee: order.platformFee,
    totalAmount: order.totalAmount,
    address,
  });

  await sendMail({
    to: user.email,
    subject: `Your order has been accepted: #${order.orderNumber}`,
    html,
  });
};

// 3. Order Preparing Email
export const sendOrderPreparingEmail = async (order: IOrder, user: IUser): Promise<void> => {
  const restaurantName = getRestaurantName(order.restaurantId);
  const address = formatAddressString(order.deliveryAddress);

  const html = generateBiteFlowEmailHtml({
    title: `Food Preparing: #${order.orderNumber}`,
    greeting: `Cooking in progress, ${user.name}!`,
    statusBadge: 'Preparing in Kitchen',
    badgeBg: '#FFF5E6',
    badgeColor: '#B9674B',
    message: `Your food is being prepared with fresh ingredients at ${restaurantName}.`,
    orderNumber: order.orderNumber,
    restaurantName,
    items: order.items,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    platformFee: order.platformFee,
    totalAmount: order.totalAmount,
    address,
  });

  await sendMail({
    to: user.email,
    subject: `Your food is being prepared: #${order.orderNumber}`,
    html,
  });
};

// 4. Order Ready Email
export const sendOrderReadyEmail = async (order: IOrder, user: IUser): Promise<void> => {
  const restaurantName = getRestaurantName(order.restaurantId);
  const address = formatAddressString(order.deliveryAddress);

  const html = generateBiteFlowEmailHtml({
    title: `Order Ready: #${order.orderNumber}`,
    greeting: `Packaged fresh, ${user.name}!`,
    statusBadge: 'Ready for Pickup',
    badgeBg: '#EDE4D3',
    badgeColor: '#3F4933',
    message: 'Your order is ready and has been packed in thermal, eco-friendly insulated bags awaiting courier dispatch.',
    orderNumber: order.orderNumber,
    restaurantName,
    items: order.items,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    platformFee: order.platformFee,
    totalAmount: order.totalAmount,
    address,
  });

  await sendMail({
    to: user.email,
    subject: `Your order is ready: #${order.orderNumber}`,
    html,
  });
};

// 5. Order Out For Delivery Email
export const sendOrderOutForDeliveryEmail = async (order: IOrder, user: IUser): Promise<void> => {
  const restaurantName = getRestaurantName(order.restaurantId);
  const address = formatAddressString(order.deliveryAddress);

  const html = generateBiteFlowEmailHtml({
    title: `Out For Delivery: #${order.orderNumber}`,
    greeting: `On the way, ${user.name}!`,
    statusBadge: 'Out for Delivery',
    badgeBg: '#E8EFE0',
    badgeColor: '#3F4933',
    message: 'Your order is on the way. Our delivery partner is heading toward your address.',
    orderNumber: order.orderNumber,
    restaurantName,
    items: order.items,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    platformFee: order.platformFee,
    totalAmount: order.totalAmount,
    address,
  });

  await sendMail({
    to: user.email,
    subject: `Your order is on the way: #${order.orderNumber}`,
    html,
  });
};

// 6. Order Delivered Email
export const sendOrderDeliveredEmail = async (order: IOrder, user: IUser): Promise<void> => {
  const restaurantName = getRestaurantName(order.restaurantId);
  const address = formatAddressString(order.deliveryAddress);

  const html = generateBiteFlowEmailHtml({
    title: `Order Delivered: #${order.orderNumber}`,
    greeting: `Delivered fresh, ${user.name}!`,
    statusBadge: 'Delivered',
    badgeBg: '#E0F2FE',
    badgeColor: '#0369A1',
    message: 'Your order has been delivered. We hope you enjoy your warm, artisanal dining experience.',
    orderNumber: order.orderNumber,
    restaurantName,
    items: order.items,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    platformFee: order.platformFee,
    totalAmount: order.totalAmount,
    address,
  });

  await sendMail({
    to: user.email,
    subject: `Your order has been delivered: #${order.orderNumber}`,
    html,
  });
};

// 7. Order Cancelled Email
export const sendOrderCancelledEmail = async (order: IOrder, user: IUser): Promise<void> => {
  const restaurantName = getRestaurantName(order.restaurantId);
  const address = formatAddressString(order.deliveryAddress);

  const html = generateBiteFlowEmailHtml({
    title: `Order Cancelled: #${order.orderNumber}`,
    greeting: `Hello, ${user.name}`,
    statusBadge: 'Order Cancelled',
    badgeBg: '#FEE2E2',
    badgeColor: '#B91C1C',
    message: 'Your order has been cancelled. Any pre-authorized charges have been released back to your original payment method.',
    orderNumber: order.orderNumber,
    restaurantName,
    items: order.items,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    platformFee: order.platformFee,
    totalAmount: order.totalAmount,
    address,
  });

  await sendMail({
    to: user.email,
    subject: `Your order has been cancelled: #${order.orderNumber}`,
    html,
  });
};

// Guard against duplicate emails for the same status transition
export const dispatchStatusEmailIfNew = async (order: IOrder, user: IUser, newStatus: string): Promise<void> => {
  if (!order.sentEmailStatuses) {
    order.sentEmailStatuses = [];
  }

  // Prevent sending duplicate emails for the same status transition
  if (order.sentEmailStatuses.includes(newStatus)) {
    console.log(`[BiteFlow Email] Status ${newStatus} email already delivered for order #${order.orderNumber}. Skipping.`);
    return;
  }

  switch (newStatus) {
    case 'PLACED':
      await sendOrderPlacedEmail(order, user);
      break;
    case 'ACCEPTED':
      await sendOrderAcceptedEmail(order, user);
      break;
    case 'PREPARING':
      await sendOrderPreparingEmail(order, user);
      break;
    case 'READY':
      await sendOrderReadyEmail(order, user);
      break;
    case 'OUT_FOR_DELIVERY':
      await sendOrderOutForDeliveryEmail(order, user);
      break;
    case 'DELIVERED':
      await sendOrderDeliveredEmail(order, user);
      break;
    case 'CANCELLED':
      await sendOrderCancelledEmail(order, user);
      break;
    default:
      break;
  }

  order.sentEmailStatuses.push(newStatus);
  await order.save();
};

export const emailService = {
  sendOrderPlacedEmail,
  sendOrderAcceptedEmail,
  sendOrderPreparingEmail,
  sendOrderReadyEmail,
  sendOrderOutForDeliveryEmail,
  sendOrderDeliveredEmail,
  sendOrderCancelledEmail,
  dispatchStatusEmailIfNew,
};
