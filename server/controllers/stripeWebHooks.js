import stripe from "stripe";
import Booking from "../models/Booking.js";

// Api to handle stripe webhooks
export const stripeWebHooks = async (request, responce) => {
  // Stripe gateway initilize

  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRETS
    );
  } catch (error) {
    responce
      .status(400)
      .send(`Webhook error from stripe webhook: ${error.message}`);
  }

  //Handle the evnet
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    // Getting session metadata

    const session = await stripeInstance.checkout.sessions.list({
      payment_intent: paymentIntentId,
    });
    const { bookingId } = session.data[0].metadata;
    // Mark payment as paid #]
    await Booking.findByIdAndUpdate(bookingId, {
      isPaid: true,
      paymentMethod: "Stripe",
    });
  } else {
    console.log("Unhandled event type ".event.type);
  }
  responce.json({ recived: true });
};
