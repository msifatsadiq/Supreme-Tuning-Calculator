const puppeteer = require('puppeteer');

/**
 * DVX Scraper - Multi-step wizard scraper for performance data
 * 
 * This is a template/example scraper. The actual implementation depends on
 * the DVX website structure which would need to be analyzed.
 * 
 * Usage: node src/scraper/scrapeDvx.js
 */

class DvxScraper {
  constructor() {
    this.browser = null;
    this.page = null;
    this.baseUrl = 'https://example-dvx-site.com'; // Replace with actual DVX URL
  }

  /**
   * Initialize browser and page
   */
  async init() {
    console.log('🚀 Launching browser...');
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  /**
   * Step 1: Select brand from dropdown/list
   */
  async selectBrand(brandName) {
    console.log(`📋 Selecting brand: ${brandName}`);
    
    try {
      // Wait for brand selector to load
      await this.page.waitForSelector('.brand-selector', { timeout: 10000 });
      
      // Click on the brand
      await this.page.click(`[data-brand="${brandName}"]`);
      
      // Wait for next step to load
      await this.page.waitForSelector('.model-selector', { timeout: 10000 });
      
      return true;
    } catch (error) {
      console.error('Error selecting brand:', error.message);
      return false;
    }
  }

  /**
   * Step 2: Select model from loaded list
   */
  async selectModel(modelName) {
    console.log(`📋 Selecting model: ${modelName}`);
    
    try {
      await this.page.waitForSelector('.model-selector', { timeout: 10000 });
      await this.page.click(`[data-model="${modelName}"]`);
      await this.page.waitForSelector('.engine-selector', { timeout: 10000 });
      
      return true;
    } catch (error) {
      console.error('Error selecting model:', error.message);
      return false;
    }
  }

  /**
   * Step 3: Select engine from loaded list
   */
  async selectEngine(engineName) {
    console.log(`📋 Selecting engine: ${engineName}`);
    
    try {
      await this.page.waitForSelector('.engine-selector', { timeout: 10000 });
      await this.page.click(`[data-engine="${engineName}"]`);
      await this.page.waitForSelector('.power-table', { timeout: 10000 });
      
      return true;
    } catch (error) {
      console.error('Error selecting engine:', error.message);
      return false;
    }
  }

  /**
   * Step 4: Extract power data from table
   */
  async extractPowerData() {
    console.log('📊 Extracting power data...');
    
    try {
      await this.page.waitForSelector('.power-table', { timeout: 10000 });
      
      // Extract data from page
      const powerData = await this.page.evaluate(() => {
        const stages = {};
        
        // Example selectors - adjust based on actual site structure
        const rows = document.querySelectorAll('.power-table tbody tr');
        
        rows.forEach(row => {
          const stageName = row.querySelector('.stage-name')?.textContent.trim();
          const stockHP = row.querySelector('.stock-hp')?.textContent.trim();
          const stockNM = row.querySelector('.stock-nm')?.textContent.trim();
          const tunedHP = row.querySelector('.tuned-hp')?.textContent.trim();
          const tunedNM = row.querySelector('.tuned-nm')?.textContent.trim();
          
          if (stageName) {
            const stageKey = stageName.toLowerCase().replace(/\s+/g, '');
            stages[stageKey] = {
              stage: stageName,
              stockHP: parseInt(stockHP) || 0,
              stockNM: parseInt(stockNM) || 0,
              tunedHP: parseInt(tunedHP) || 0,
              tunedNM: parseInt(tunedNM) || 0
            };
          }
        });
        
        return stages;
      });
      
      return powerData;
    } catch (error) {
      console.error('Error extracting power data:', error.message);
      return null;
    }
  }

  /**
   * Main scraping workflow
   */
  async scrape(brand, model, engine) {
    try {
      await this.init();
      
      console.log(`\n🔍 Scraping data for: ${brand} ${model} ${engine}\n`);
      
      // Navigate to base URL
      await this.page.goto(this.baseUrl, { waitUntil: 'networkidle2' });
      
      // Multi-step selection
      const brandSelected = await this.selectBrand(brand);
      if (!brandSelected) throw new Error('Failed to select brand');
      
      const modelSelected = await this.selectModel(model);
      if (!modelSelected) throw new Error('Failed to select model');
      
      const engineSelected = await this.selectEngine(engine);
      if (!engineSelected) throw new Error('Failed to select engine');
      
      // Extract power data
      const powerData = await this.extractPowerData();
      
      if (powerData) {
        console.log('\n✅ Successfully scraped data:');
        console.log(JSON.stringify(powerData, null, 2));
        return powerData;
      } else {
        throw new Error('Failed to extract power data');
      }
      
    } catch (error) {
      console.error('❌ Scraping failed:', error.message);
      return null;
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Cleanup browser resources
   */
  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('\n🔚 Browser closed');
    }
  }
}

/**
 * Utility function to scrape multiple configurations
 */
async function scrapeMultiple(configurations) {
  const scraper = new DvxScraper();
  const results = [];
  
  for (const config of configurations) {
    const data = await scraper.scrape(config.brand, config.model, config.engine);
    results.push({
      ...config,
      data
    });
    
    // Add delay between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return results;
}

// Example usage
if (require.main === module) {
  console.log('🤖 DVX Scraper\n');
  console.log('⚠️  Note: This is a template scraper.');
  console.log('   Update the selectors and URL based on the actual DVX website.\n');
  
  // Example configuration
  const testConfig = {
    brand: 'BMW',
    model: 'M5 F90',
    engine: 'S63B44T4'
  };
  
  const scraper = new DvxScraper();
  scraper.scrape(testConfig.brand, testConfig.model, testConfig.engine);
}

module.exports = { DvxScraper, scrapeMultiple };
