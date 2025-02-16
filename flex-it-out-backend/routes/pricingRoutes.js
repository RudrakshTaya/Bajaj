import express from "express";

const router = express.Router();

const pricingPlans = [
  { id: "basic", name: "Basic Plan", price: 100 },
  { id: "premium", name: "Premium Plan", price: 250 }
];

router.get("/", (req, res) => {
  res.json(pricingPlans);
});

export default router;
