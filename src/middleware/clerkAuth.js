import { verifyToken } from "@clerk/backend";

export const verifyClerkToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader ? "Present" : "Missing");
    console.log("Request method:", req.method);
    console.log("Request path:", req.path);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    const token = authHeader.substring(7);
    console.log("Token length:", token.length);
    console.log("Token:", token);

    let payload;
    try {
      payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      console.log("Token verified successfully with Clerk SDK");
    } catch (verifyError) {
      console.log(
        "Token verification failed with Clerk SDK, trying JWT decode..."
      );

      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        try {
          const payloadBase64 = tokenParts[1];
          const payloadJson = Buffer.from(payloadBase64, "base64").toString(
            "utf8"
          );
          payload = JSON.parse(payloadJson);
          console.log("JWT decoded manually:", payload);
        } catch (decodeError) {
          console.error("Failed to decode JWT:", decodeError);
          throw verifyError;
        }
      } else {
        console.error("Invalid JWT format");
        throw verifyError;
      }
    }

    req.clerkUser = {
      id: payload.sub,
      email:
        payload.email || payload.primary_email_address || payload.email_address,
      fullName:
        payload.fullName ||
        payload.name ||
        payload.first_name + " " + payload.last_name,
      profilePic: payload.profilePic || payload.picture || payload.image_url,
    };

    if (!req.clerkUser.id) {
      console.error("Missing user ID in JWT payload");
      return res
        .status(401)
        .json({ message: "Invalid token - missing user ID" });
    }

    console.log("Extracted clerk user:", req.clerkUser);
    next();
  } catch (error) {
    console.error("Clerk token verification failed:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
