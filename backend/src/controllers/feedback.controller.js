const Feedback = require('../models/feedback.model');

exports.createFeedback = async (req, res) => {
  try {
    const { name, role, message, stars } = req.body;

    if (!name || !message || !stars) {
      return res.status(400).json({ message: 'Name, message, and star rating are required.' });
    }

    if (stars < 1 || stars > 5) {
      return res.status(400).json({ message: 'Star rating must be between 1 and 5.' });
    }

    const feedback = await Feedback.create({
      name: name.trim(),
      role: role?.trim() || 'Pet Owner',
      message: message.trim(),
      stars: Math.round(stars),
    });

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getTopFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ stars: -1, createdAt: -1 })
      .limit(3);

    res.status(200).json({ feedbacks });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
