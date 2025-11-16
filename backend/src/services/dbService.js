const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../supreme-tuning.json');
const BACKUP_DIR = path.join(__dirname, '../../backups');

/**
 * Read the database from JSON file
 */
function readDatabase() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // Create default database if doesn't exist
      const defaultData = {
        brands: []
      };
      writeDatabase(defaultData);
      return defaultData;
    }

    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    throw new Error('Failed to read database');
  }
}

/**
 * Write data to the database
 */
function writeDatabase(data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(DB_PATH, jsonData, 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    throw new Error('Failed to write database');
  }
}

/**
 * Create a backup of the current database
 * Returns the backup filename
 */
function createBackup() {
  try {
    // Ensure backup directory exists
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // Read current database
    const currentData = readDatabase();

    // Generate timestamp-based filename
    const timestamp = new Date()
      .toISOString()
      .replace(/:/g, '-')
      .replace(/\..+/, '');
    
    const backupFilename = `backup-${timestamp}.json`;
    const backupPath = path.join(BACKUP_DIR, backupFilename);

    // Write backup
    const jsonData = JSON.stringify(currentData, null, 2);
    fs.writeFileSync(backupPath, jsonData, 'utf8');

    console.log(`✅ Backup created: ${backupFilename}`);
    return backupFilename;
  } catch (error) {
    console.error('Error creating backup:', error);
    throw new Error('Failed to create backup');
  }
}

/**
 * Restore database from a backup file
 */
function restoreFromBackup(backupFilename) {
  try {
    const backupPath = path.join(BACKUP_DIR, backupFilename);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error('Backup file not found');
    }

    const backupData = fs.readFileSync(backupPath, 'utf8');
    const data = JSON.parse(backupData);
    
    // Create a backup of current state before restoring
    createBackup();
    
    // Restore the backup
    writeDatabase(data);
    
    return true;
  } catch (error) {
    console.error('Error restoring backup:', error);
    throw new Error('Failed to restore backup');
  }
}

module.exports = {
  readDatabase,
  writeDatabase,
  createBackup,
  restoreFromBackup
};
