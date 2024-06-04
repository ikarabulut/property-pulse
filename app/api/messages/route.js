import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// POST /api/messages
export const POST = async (req) => {
  try {
    await connectDB();

    const { email, name, phone, message, property, recipient } = req.json();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user) {
      return new Response(
        JSON.stringify({ message: "You must be logged in to send a message" }),
        { status: 401 }
      );
    }

    const { user } = sessionUser;

    if (user.id === recipient) {
      return new Response(
        JSON.stringify({ message: "Cannot send message to yourself" }),
        { status: 400 }
      );
    }

    const newMessage = new Message({
      sender: user.id,
      recipient,
      property,
      name,
      email,
      phone,
      body: message,
    });

    await newMessage.save();

    return new Response(JSON.stringify({ message: "Message Sent" }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Server Error" }), {
      status: 500,
    });
  }
};
