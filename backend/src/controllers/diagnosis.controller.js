const Diagnosis = require('../models/diagnosis.model');
const uploadFile = require('../services/storage.service');

// URL of the Python AI microservice
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

// Disease knowledge base for canine skin diseases
// Keys match the model's 6 output classes
const diseaseInfo = {
  demodicosis: {
    displayName: 'Demodicosis',
    description:
      'Demodicosis is a skin disease caused by Demodex mites that live in hair follicles. While small numbers of these mites are normal, an overgrowth due to immune deficiency causes hair loss, scaling, and secondary infections. It can be localized or generalized.',
    symptoms: [
      'Patchy hair loss, especially around the face and eyes',
      'Red, scaly skin',
      'Thickened, crusty skin in severe cases',
      'Secondary bacterial infections',
      'Itching (mild to moderate)',
      'Darkened or hyperpigmented skin',
    ],
    treatment:
      'Treatment involves oral isoxazoline anti-parasitic medications (such as fluralaner or sarolaner) prescribed by a veterinarian. Medicated baths with benzoyl peroxide shampoo help clear debris. Antibiotics may be needed for secondary infections. Regular skin scrapings monitor treatment progress, which typically takes 2-4 months.',
    severity: 'High',
  },
  dermatitis: {
    displayName: 'Dermatitis',
    description:
      'Bacterial dermatitis is a skin infection caused by bacteria, commonly Staphylococcus species. It can occur as a primary infection or secondary to other conditions like allergies or hormonal imbalances.',
    symptoms: [
      'Red, inflamed skin',
      'Pustules or pimples',
      'Crusting and scaling',
      'Hair loss (alopecia)',
      'Itching and scratching',
      'Foul odor from skin',
    ],
    treatment:
      'Treatment typically involves topical antibacterial shampoos (chlorhexidine), oral antibiotics prescribed by a vet (such as cephalexin), and addressing any underlying conditions. Keep the affected area clean and dry. A full course of antibiotics (usually 3-6 weeks) is essential.',
    severity: 'Medium',
  },
  fungal_infections: {
    displayName: 'Fungal Infections',
    description:
      'Fungal infections in dogs are caused by organisms like dermatophytes (ringworm), Malassezia, or other fungi. They can affect the skin, nails, and hair and are sometimes contagious to other animals and humans.',
    symptoms: [
      'Circular patches of hair loss',
      'Scaly or crusty skin',
      'Redness and inflammation',
      'Darkened skin',
      'Greasy or waxy skin',
      'Persistent itching',
    ],
    treatment:
      'Antifungal medications (oral itraconazole or topical miconazole/ketoconazole shampoos) are the mainstay of treatment. Environmental decontamination is important to prevent reinfection. Treatment typically lasts 6-8 weeks minimum.',
    severity: 'Medium',
  },
  healthy: {
    displayName: 'Healthy',
    description:
      'The skin appears healthy with no visible signs of disease, infection, or abnormalities. The coat is normal with no excessive shedding, bald patches, or discoloration.',
    symptoms: ['No symptoms detected'],
    treatment:
      'No treatment required. Continue regular grooming and veterinary check-ups. Maintain a balanced diet and ensure your dog is up to date on preventative parasite medications.',
    severity: 'Low',
  },
  hypersensitivity: {
    displayName: 'Hypersensitivity',
    description:
      'This condition results from the immune system overreacting to allergens such as food, pollen, dust mites, or flea saliva. It is one of the most common skin conditions in dogs and can be chronic.',
    symptoms: [
      'Intense itching',
      'Red, inflamed skin',
      'Recurrent ear infections',
      'Licking and chewing at paws',
      'Hot spots',
      'Chronic skin infections',
      'Watery eyes',
    ],
    treatment:
      'Management includes identifying and avoiding allergens, antihistamines, corticosteroids for flare-ups, immunotherapy (allergy shots), omega-3 fatty acid supplements, and medicated baths. Apoquel or Cytopoint may be prescribed for long-term management.',
    severity: 'Medium',
  },
  ringworm: {
    displayName: 'Ringworm',
    description:
      'Ringworm is a highly contagious fungal infection caused by dermatophytes. Despite its name, it is not caused by a worm. It affects the skin, hair, and occasionally nails, and can spread to other animals and humans.',
    symptoms: [
      'Circular, ring-shaped patches of hair loss',
      'Red, crusty, or scaly skin at the edges',
      'Brittle or broken hairs',
      'Darkened skin patches',
      'Mild itching',
      'Inflamed nail beds',
    ],
    treatment:
      'Treatment includes oral antifungal medication (itraconazole or terbinafine) combined with topical antifungal cream or lime sulfur dips. All bedding and grooming tools must be disinfected. Treatment typically lasts 6-8 weeks. Infected animals should be isolated to prevent spread.',
    severity: 'Medium',
  },
};

/**
 * Calls the Python AI microservice to get a prediction for the uploaded image.
 * @param {Buffer} imageBuffer - The raw image buffer
 * @returns {Object} - { prediction, confidence, probabilities }
 */
async function getPredictionFromAI(imageBuffer) {
  const formData = new FormData();
  const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
  formData.append('image', blob, 'upload.jpg');

  const response = await fetch(`${AI_SERVICE_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `AI service returned status ${response.status}`);
  }

  return response.json();
}

exports.createDiagnosis = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image.' });
    }

    // Upload image to ImageKit
    const uploadResult = await uploadFile(req.file.buffer);
    const imageUrl = uploadResult.url;
    const imageFileId = uploadResult.fileId;

    // Call the Python AI service for a real prediction
    const aiResult = await getPredictionFromAI(req.file.buffer);
    const predictedClass = aiResult.prediction; // e.g. "demodicosis"
    const confidence = aiResult.confidence;       // e.g. 92.15

    const info = diseaseInfo[predictedClass];

    if (!info) {
      throw new Error(`Unknown prediction class: ${predictedClass}`);
    }

    const diagnosis = await Diagnosis.create({
      user: req.user._id,
      imageUrl,
      imageFileId,
      diseaseName: info.displayName,
      confidence: Math.round(confidence),
      description: info.description,
      symptoms: info.symptoms,
      treatment: info.treatment,
      severity: info.severity,
      petName: req.body.petName || '',
      notes: req.body.notes || '',
    });

    res.status(201).json({
      message: 'Diagnosis completed successfully',
      diagnosis,
    });
  } catch (err) {
    console.error('Diagnosis error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserDiagnoses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [diagnoses, total] = await Promise.all([
      Diagnosis.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Diagnosis.countDocuments({ user: req.user._id }),
    ]);

    res.status(200).json({
      diagnoses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getDiagnosisById = async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!diagnosis) {
      return res.status(404).json({ message: 'Diagnosis not found.' });
    }

    res.status(200).json({ diagnosis });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteDiagnosis = async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!diagnosis) {
      return res.status(404).json({ message: 'Diagnosis not found.' });
    }

    res.status(200).json({ message: 'Diagnosis deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalScans = await Diagnosis.countDocuments({ user: req.user._id });

    const diseaseDistribution = await Diagnosis.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$diseaseName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentScans = await Diagnosis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const severityDistribution = await Diagnosis.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      totalScans,
      diseaseDistribution,
      severityDistribution,
      recentScans,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
