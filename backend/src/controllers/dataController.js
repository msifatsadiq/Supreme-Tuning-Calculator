const dbService = require('../services/dbService');
const ruleService = require('../services/ruleService');

/**
 * Get all brands
 */
exports.getBrands = (req, res) => {
  try {
    const data = dbService.readDatabase();
    const brands = data.brands.map(b => ({
      id: b.id,
      name: b.name
    }));
    
    res.json({ brands });
  } catch (error) {
    console.error('Error getting brands:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
};

/**
 * Get models for a specific brand
 */
exports.getModels = (req, res) => {
  try {
    const { brand } = req.query;
    
    if (!brand) {
      return res.status(400).json({ error: 'Brand parameter is required' });
    }

    const data = dbService.readDatabase();
    const brandData = data.brands.find(b => b.id === brand);
    
    if (!brandData) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    const models = brandData.models.map(m => ({
      id: m.id,
      name: m.name,
      year: m.year
    }));
    
    res.json({ models });
  } catch (error) {
    console.error('Error getting models:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
};

/**
 * Get engines for a specific brand and model
 */
exports.getEngines = (req, res) => {
  try {
    const { brand, model } = req.query;
    
    if (!brand || !model) {
      return res.status(400).json({ error: 'Brand and model parameters are required' });
    }

    const data = dbService.readDatabase();
    const brandData = data.brands.find(b => b.id === brand);
    
    if (!brandData) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    const modelData = brandData.models.find(m => m.id === model);
    
    if (!modelData) {
      return res.status(404).json({ error: 'Model not found' });
    }

    const engines = modelData.engines.map(e => ({
      id: e.id,
      name: e.name
    }));
    
    res.json({ engines });
  } catch (error) {
    console.error('Error getting engines:', error);
    res.status(500).json({ error: 'Failed to fetch engines' });
  }
};

/**
 * Get stages for a specific brand, model, and engine
 */
exports.getStages = (req, res) => {
  try {
    const { brand, model, engine } = req.query;
    
    if (!brand || !model || !engine) {
      return res.status(400).json({ 
        error: 'Brand, model, and engine parameters are required' 
      });
    }

    const data = dbService.readDatabase();
    const brandData = data.brands.find(b => b.id === brand);
    
    if (!brandData) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    const modelData = brandData.models.find(m => m.id === model);
    
    if (!modelData) {
      return res.status(404).json({ error: 'Model not found' });
    }

    const engineData = modelData.engines.find(e => e.id === engine);
    
    if (!engineData) {
      return res.status(404).json({ error: 'Engine not found' });
    }

    const stages = engineData.stages.map(s => ({
      stage: s.stage,
      stockHP: s.stockHP,
      stockNM: s.stockNM,
      tunedHP: s.tunedHP,
      tunedNM: s.tunedNM
    }));
    
    res.json({ stages });
  } catch (error) {
    console.error('Error getting stages:', error);
    res.status(500).json({ error: 'Failed to fetch stages' });
  }
};

/**
 * Get complete power data for a specific configuration
 * Includes special rules and notes
 */
exports.getPowerData = (req, res) => {
  try {
    const { brand, model, engine, stage } = req.query;
    
    if (!brand || !model || !engine || !stage) {
      return res.status(400).json({ 
        error: 'Brand, model, engine, and stage parameters are required' 
      });
    }

    const data = dbService.readDatabase();
    const brandData = data.brands.find(b => b.id === brand);
    
    if (!brandData) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    const modelData = brandData.models.find(m => m.id === model);
    
    if (!modelData) {
      return res.status(404).json({ error: 'Model not found' });
    }

    const engineData = modelData.engines.find(e => e.id === engine);
    
    if (!engineData) {
      return res.status(404).json({ error: 'Engine not found' });
    }

    const stageData = engineData.stages.find(s => s.stage === stage);
    
    if (!stageData) {
      return res.status(404).json({ error: 'Stage not found' });
    }

    // Apply special rules
    const notes = ruleService.applyRules(
      brandData.name,
      modelData,
      engineData
    );

    // Calculate gains
    const hpGain = stageData.tunedHP - stageData.stockHP;
    const nmGain = stageData.tunedNM - stageData.stockNM;
    const hpGainPercent = ((hpGain / stageData.stockHP) * 100).toFixed(1);
    const nmGainPercent = ((nmGain / stageData.stockNM) * 100).toFixed(1);

    res.json({
      brand: brandData.name,
      model: modelData.name,
      modelYear: modelData.year,
      engine: engineData.name,
      stage: stageData.stage,
      power: {
        stock: {
          hp: stageData.stockHP,
          nm: stageData.stockNM
        },
        tuned: {
          hp: stageData.tunedHP,
          nm: stageData.tunedNM
        },
        gains: {
          hp: hpGain,
          nm: nmGain,
          hpPercent: parseFloat(hpGainPercent),
          nmPercent: parseFloat(nmGainPercent)
        }
      },
      notes: [...(stageData.notes || []), ...notes]
    });

  } catch (error) {
    console.error('Error getting power data:', error);
    res.status(500).json({ error: 'Failed to fetch power data' });
  }
};
