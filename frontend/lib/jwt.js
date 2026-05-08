import jwt from "jsonwebtoken";

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) return "dev-secret-key";
  return secret;
};
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// generate access token
export const generateToken = (user) => {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, getSecret(), {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// verify access token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, getSecret());
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

// generate refresh token
export const generateRefreshToken = (user) => {
  const payload = {
    userId: user._id.toString(),
    type: "refresh",
  };

  return jwt.sign(payload, getSecret(), {
    expiresIn: "30d",
  });
};