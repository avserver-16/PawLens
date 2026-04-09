const Diagnosis = require('../models/diagnosis.model');
const uploadFile = require('../services/storage.service');

// Disease knowledge base for canine skin diseases
const diseaseInfo = {
  'Bacterial Dermatosis': {
    description: 'Bacterial dermatosis is a skin infection caused by bacteria, commonly Staphylococcus species. It can occur as a primary infection or secondary to other conditions like allergies or hormonal imbalances.',
    symptoms: ['Red, inflamed skin', 'Pustules or pimples', 'Crusting and scaling', 'Hair loss (alopecia)', 'Itching and scratching', 'Foul odor from skin'],
    treatment: 'Treatment typically involves topical antibacterial shampoos (chlorhexidine), oral antibiotics prescribed by a vet (such as cephalexin), and addressing any underlying conditions. Keep the affected area clean and dry. A full course of antibiotics (usually 3-6 weeks) is essential.',
    severity: 'Medium',
  },
  'Fungal Infections': {
    description: 'Fungal infections in dogs are caused by organisms like dermatophytes (ringworm), Malassezia, or other fungi. They can affect the skin, nails, and hair and are sometimes contagious to other animals and humans.',
    symptoms: ['Circular patches of hair loss', 'Scaly or crusty skin', 'Redness and inflammation', 'Darkened skin', 'Greasy or waxy skin', 'Persistent itching'],
    treatment: 'Antifungal medications (oral itraconazole or topical miconazole/ketoconazole shampoos) are the mainstay of treatment. Environmental decontamination is important to prevent reinfection. Treatment typically lasts 6-8 weeks minimum.',
    severity: 'Medium',
  },
  'Hypersensitivity Allergic Dermatosis': {
    description: 'This condition results from the immune system overreacting to allergens such as food, pollen, dust mites, or flea saliva. It is one of the most common skin conditions in dogs and can be chronic.',
    symptoms: ['Intense itching', 'Red, inflamed skin', 'Recurrent ear infections', 'Licking and chewing at paws', 'Hot spots', 'Chronic skin infections', 'Watery eyes'],
    treatment: 'Management includes identifying and avoiding allergens, antihistamines, corticosteroids for flare-ups, immunotherapy (allergy shots), omega-3 fatty acid supplements, and medicated baths. Apoquel or Cytopoint may be prescribed for long-term management.',
    severity: 'Medium',
  },
  'Parasitic Disease': {
    description: 'Parasitic skin diseases in dogs are caused by organisms such as fleas, ticks, mites (mange), and lice. These parasites feed on blood or skin cells and can cause significant discomfort and secondary infections.',
    symptoms: ['Intense scratching and biting', 'Hair loss', 'Red bumps or skin irritation', 'Visible parasites or eggs', 'Thickened, crusty skin', 'Darkened skin patches', 'Restlessness'],
    treatment: 'Treatment depends on the specific parasite. Options include topical or oral anti-parasitic medications (ivermectin, selamectin), medicated dips, prescription flea/tick preventatives, and treating the environment. Sarcoptic mange requires aggressive treatment with isoxazoline drugs.',
    severity: 'High',
  },
  'Healthy': {
    description: 'The skin appears healthy with no visible signs of disease, infection, or abnormalities. The coat is normal with no excessive shedding, bald patches, or discoloration.',
    symptoms: ['No symptoms detected'],
    treatment: 'No treatment required. Continue regular grooming and veterinary check-ups. Maintain a balanced diet and ensure your dog is up to date on preventative parasite medications.',
    severity: 'Low',
  },
};

exports.createDiagnosis = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image.' });
    }

    // Upload image to ImageKit
    const uploadResult = await uploadFile(req.file.buffer);
    const imageUrl = uploadResult.url;
    const imageFileId = uploadResult.fileId;

    // Simulate AI prediction (replace with actual model call)
    const diseaseNames = Object.keys(diseaseInfo);
    const randomDisease = diseaseNames[Math.floor(Math.random() * diseaseNames.length)];
    const confidence = Math.floor(Math.random() * 20 + 80); // 80-99%

    const info = diseaseInfo[randomDisease];

    const diagnosis = await Diagnosis.create({
      user: req.user._id,
      imageUrl,
      imageFileId,
      diseaseName: randomDisease,
      confidence,
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
