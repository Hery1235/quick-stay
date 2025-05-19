import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebHooks = async (req, res) => {
  console.log("✅ Clerk webhook route hit");

  try {
    // Create a Svix instance with Clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRETS);

    // Getting headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };
    console.log("📦 Received headers:", headers);

    // Verify the webhook with raw body
    const payload = await whook.verify(req.rawBody, headers);
    console.log("✅ Webhook verified successfully");

    const { data, type } = payload;
    console.log("🧾 Webhook type:", type);
    console.log("📄 Full payload data:", data);

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: `${data.first_name} ${data.last_name}`,
      image: data.image_url,
    };

    console.log("👤 Prepared user data:", userData);

    // Handle event types
    switch (type) {
      case "user.created":
        await User.create(userData);
        console.log("✅ User created in database");
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        console.log("🔄 User updated in database");
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        console.log("❌ User deleted from database");
        break;

      default:
        console.log("⚠️ Unhandled webhook type:", type);
        break;
    }

    res.json({ success: true, message: "Webhook received and processed." });
  } catch (error) {
    console.error("❌ Error handling webhook:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebHooks;
