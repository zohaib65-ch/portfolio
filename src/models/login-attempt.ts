import { type InferSchemaType, type Model, Schema, model, models } from "mongoose";

export const LOGIN_WINDOW_SECONDS = 15 * 60;

// One document per failed login. The TTL index drops them after the window,
// so counting documents for an IP gives its recent failures.
const loginAttemptSchema = new Schema(
  {
    ip: { type: String, required: true, index: true },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: LOGIN_WINDOW_SECONDS,
    },
  },
  { collection: "login_attempts" }
);

type LoginAttemptDoc = InferSchemaType<typeof loginAttemptSchema>;

export const LoginAttempt =
  (models.LoginAttempt as Model<LoginAttemptDoc>) ||
  model<LoginAttemptDoc>("LoginAttempt", loginAttemptSchema);
