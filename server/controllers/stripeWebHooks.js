import Stripe from "stripe";
import Booking from "../models/Booking.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebHooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle payment success
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    // Retrieve session using the payment intent ID
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntentId,
    });

    const session = sessions.data?.[0];
    const bookingId = session?.metadata?.bookingId;

    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentMethod: "Stripe",
      });
      console.log("Payment succeeded and booking updated.");
    } else {
      console.warn("No booking ID found in metadata.");
    }
  } else {
    console.log("Unhandled event type:", event.type);
  }

  await res.json({ received: true });
};
