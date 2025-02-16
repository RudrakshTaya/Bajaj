import PricingPlan from "../models/PricingPlan.js";

// ✅ Get Pricing Plans from Database
export const getPricingPlans = async (req, res) => {
  try {
    const plans = await PricingPlan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
