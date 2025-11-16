import { useState, useEffect } from 'react'
import { getBrands, getModels, getEngines, getStages, getPowerData } from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Calculator() {
  // State for selections
  const [brands, setBrands] = useState([])
  const [models, setModels] = useState([])
  const [engines, setEngines] = useState([])
  const [stages, setStages] = useState([])
  
  // State for selected values
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedEngine, setSelectedEngine] = useState('')
  const [selectedStage, setSelectedStage] = useState('')
  
  // State for results
  const [powerData, setPowerData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load brands on mount
  useEffect(() => {
    loadBrands()
  }, [])

  // Load models when brand changes
  useEffect(() => {
    if (selectedBrand) {
      loadModels(selectedBrand)
      setSelectedModel('')
      setSelectedEngine('')
      setSelectedStage('')
      setPowerData(null)
    }
  }, [selectedBrand])

  // Load engines when model changes
  useEffect(() => {
    if (selectedBrand && selectedModel) {
      loadEngines(selectedBrand, selectedModel)
      setSelectedEngine('')
      setSelectedStage('')
      setPowerData(null)
    }
  }, [selectedModel])

  // Load stages when engine changes
  useEffect(() => {
    if (selectedBrand && selectedModel && selectedEngine) {
      loadStages(selectedBrand, selectedModel, selectedEngine)
      setSelectedStage('')
      setPowerData(null)
    }
  }, [selectedEngine])

  // Load power data when stage changes
  useEffect(() => {
    if (selectedBrand && selectedModel && selectedEngine && selectedStage) {
      loadPowerData(selectedBrand, selectedModel, selectedEngine, selectedStage)
    }
  }, [selectedStage])

  const loadBrands = async () => {
    try {
      setLoading(true)
      const response = await getBrands()
      setBrands(response.data.brands)
    } catch (err) {
      setError('Failed to load brands')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadModels = async (brand) => {
    try {
      setLoading(true)
      const response = await getModels(brand)
      setModels(response.data.models)
    } catch (err) {
      setError('Failed to load models')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadEngines = async (brand, model) => {
    try {
      setLoading(true)
      const response = await getEngines(brand, model)
      setEngines(response.data.engines)
    } catch (err) {
      setError('Failed to load engines')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadStages = async (brand, model, engine) => {
    try {
      setLoading(true)
      const response = await getStages(brand, model, engine)
      setStages(response.data.stages)
    } catch (err) {
      setError('Failed to load stages')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadPowerData = async (brand, model, engine, stage) => {
    try {
      setLoading(true)
      setError(null)
      const response = await getPowerData(brand, model, engine, stage)
      setPowerData(response.data)
    } catch (err) {
      setError('Failed to load power data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Performance Calculator
          </h2>
          <p className="text-gray-400 text-lg">
            Calculate power gains for your performance tuning
          </p>
        </div>

        {/* Selector Card */}
        <div className="card p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand Selector */}
            <div>
              <label className="label">Brand</label>
              <select
                className="select"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                disabled={loading}
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Selector */}
            <div>
              <label className="label">Model</label>
              <select
                className="select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!selectedBrand || loading}
              >
                <option value="">Select Model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} {model.year && `(${model.year})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Engine Selector */}
            <div>
              <label className="label">Engine</label>
              <select
                className="select"
                value={selectedEngine}
                onChange={(e) => setSelectedEngine(e.target.value)}
                disabled={!selectedModel || loading}
              >
                <option value="">Select Engine</option>
                {engines.map((engine) => (
                  <option key={engine.id} value={engine.id}>
                    {engine.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stage Selector */}
            <div>
              <label className="label">Tuning Stage</label>
              <select
                className="select"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                disabled={!selectedEngine || loading}
              >
                <option value="">Select Stage</option>
                {stages.map((stage, idx) => (
                  <option key={idx} value={stage.stage}>
                    Stage {stage.stage}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-6">
              <LoadingSpinner />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Results Card */}
        {powerData && (
          <div className="card p-8 animate-fade-in">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {powerData.brand} {powerData.model}
              </h3>
              <p className="text-gray-400">
                {powerData.engine} - Stage {powerData.stage}
              </p>
            </div>

            {/* Power Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Horsepower */}
              <div className="bg-dark-900 p-6 rounded-lg border border-dark-600">
                <h4 className="text-sm font-medium text-gray-400 mb-4">Horsepower</h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Stock</span>
                  <span className="text-2xl font-bold text-white">{powerData.power.stock.hp} HP</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Tuned</span>
                  <span className="text-2xl font-bold text-primary-400">{powerData.power.tuned.hp} HP</span>
                </div>
                <div className="pt-4 border-t border-dark-600">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Gain</span>
                    <span className="text-xl font-bold text-green-400">
                      +{powerData.power.gains.hp} HP ({powerData.power.gains.hpPercent}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Torque */}
              <div className="bg-dark-900 p-6 rounded-lg border border-dark-600">
                <h4 className="text-sm font-medium text-gray-400 mb-4">Torque</h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Stock</span>
                  <span className="text-2xl font-bold text-white">{powerData.power.stock.nm} NM</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Tuned</span>
                  <span className="text-2xl font-bold text-primary-400">{powerData.power.tuned.nm} NM</span>
                </div>
                <div className="pt-4 border-t border-dark-600">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Gain</span>
                    <span className="text-xl font-bold text-green-400">
                      +{powerData.power.gains.nm} NM ({powerData.power.gains.nmPercent}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {powerData.notes && powerData.notes.length > 0 && (
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-400 mb-3">Important Notes</h4>
                <ul className="space-y-2">
                  {powerData.notes.map((note, idx) => (
                    <li key={idx} className="text-yellow-200 text-sm flex items-start">
                      <span className="mr-2">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
