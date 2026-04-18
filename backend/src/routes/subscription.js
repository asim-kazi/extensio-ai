const express = require('express');
const authMiddleware = require('../middleware/auth');
const { User } = require('../models');
const router = express.Router();

// Mock upgrade route (No payment required for now)
router.post('/upgrade', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body; // Expects 'free', 'plus', or 'pro'

    if (!['free', 'plus', 'pro'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Find user and update plan
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.subscriptionStatus = plan;
    await user.save();

    res.json({
      success: true,
      message: `Successfully upgraded to ${plan.toUpperCase()} plan!`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
