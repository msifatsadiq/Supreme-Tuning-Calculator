const dbService = require('../services/dbService');
const fs = require('fs');
const path = require('path');

/**
 * Get full database data
 * Protected endpoint for admin
 */
exports.getData = (req, res) => {
  try {
    const data = dbService.readDatabase();
    res.json(data);
  } catch (error) {
    console.error('Error getting data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

/**
 * Save updated database
 * Creates automatic backup before saving
 */
exports.saveData = (req, res) => {
  try {
    const newData = req.body;

    // Validate data structure
    if (!newData || !newData.brands || !Array.isArray(newData.brands)) {
      return res.status(400).json({ 
        error: 'Invalid data structure. Expected { brands: [] }' 
      });
    }

    // Create backup before saving
    const backupPath = dbService.createBackup();

    // Save new data
    dbService.writeDatabase(newData);

    res.json({ 
      success: true, 
      message: 'Data saved successfully',
      backup: backupPath
    });

  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
};

/**
 * List all available backups
 */
exports.listBackups = (req, res) => {
  try {
    const backupDir = path.join(__dirname, '../../backups');
    
    if (!fs.existsSync(backupDir)) {
      return res.json({ backups: [] });
    }

    const files = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const stats = fs.statSync(path.join(backupDir, file));
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
      .sort((a, b) => b.modified - a.modified);

    res.json({ backups: files });
  } catch (error) {
    console.error('Error listing backups:', error);
    res.status(500).json({ error: 'Failed to list backups' });
  }
};
