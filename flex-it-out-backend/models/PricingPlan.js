import mongoose from "mongoose";

const PricingPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  features: [String],  // Example: ["Unlimited Workouts", "24/7 Support"]
});

export default mongoose.model("PricingPlan", PricingPlanSchema);
