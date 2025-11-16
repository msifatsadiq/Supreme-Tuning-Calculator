/**
 * Apply special rules based on brand, model, and engine
 * Returns an array of notes to be added
 */
function applyRules(brandName, modelData, engineData) {
  const notes = [];

  // BMW Rule: Built after June 2020
  if (brandName === 'BMW' && modelData.year) {
    const year = parseInt(modelData.year);
    const month = modelData.month ? parseInt(modelData.month) : 1;
    
    if (year > 2020 || (year === 2020 && month >= 6)) {
      notes.push('⚠️ ECU unlock required (built after June 2020)');
    }
  }

  // Mercedes Rule: M177/M178 engines from 2018+
  if (brandName === 'Mercedes' || brandName === 'Mercedes-Benz') {
    const engineName = engineData.name.toUpperCase();
    const year = parseInt(modelData.year);
    
    if ((engineName.includes('M177') || engineName.includes('M178')) && year >= 2018) {
      notes.push('⚠️ CPC upgrade required (M177/M178 2018+)');
    }
  }

  return notes;
}

/**
 * Check if a BMW model requires ECU unlock
 */
function requiresECUUnlock(brandName, modelYear, modelMonth) {
  if (brandName !== 'BMW') return false;
  
  const year = parseInt(modelYear);
  const month = modelMonth ? parseInt(modelMonth) : 1;
  
  return year > 2020 || (year === 2020 && month >= 6);
}

/**
 * Check if a Mercedes model requires CPC upgrade
 */
function requiresCPCUpgrade(brandName, engineName, modelYear) {
  if (brandName !== 'Mercedes' && brandName !== 'Mercedes-Benz') return false;
  
  const engine = engineName.toUpperCase();
  const year = parseInt(modelYear);
  
  return (engine.includes('M177') || engine.includes('M178')) && year >= 2018;
}

module.exports = {
  applyRules,
  requiresECUUnlock,
  requiresCPCUpgrade
};
