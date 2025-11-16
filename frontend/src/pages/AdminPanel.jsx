import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getData, saveData } from '../utils/api'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/LoadingSpinner'

export default function AdminPanel() {
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [expandedBrands, setExpandedBrands] = useState(new Set())
  const [expandedModels, setExpandedModels] = useState(new Set())
  const [expandedEngines, setExpandedEngines] = useState(new Set())

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await getData()
      setData(response.data)
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')
      
      await saveData(data)
      setSuccess('Data saved successfully!')
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to save data')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const toggleBrand = (brandId) => {
    const newExpanded = new Set(expandedBrands)
    if (newExpanded.has(brandId)) {
      newExpanded.delete(brandId)
    } else {
      newExpanded.add(brandId)
    }
    setExpandedBrands(newExpanded)
  }

  const toggleModel = (modelKey) => {
    const newExpanded = new Set(expandedModels)
    if (newExpanded.has(modelKey)) {
      newExpanded.delete(modelKey)
    } else {
      newExpanded.add(modelKey)
    }
    setExpandedModels(newExpanded)
  }

  const toggleEngine = (engineKey) => {
    const newExpanded = new Set(expandedEngines)
    if (newExpanded.has(engineKey)) {
      newExpanded.delete(engineKey)
    } else {
      newExpanded.add(engineKey)
    }
    setExpandedEngines(newExpanded)
  }

  const updateStageValue = (brandIdx, modelIdx, engineIdx, stageIdx, field, value) => {
    const newData = { ...data }
    const numValue = parseInt(value) || 0
    newData.brands[brandIdx].models[modelIdx].engines[engineIdx].stages[stageIdx][field] = numValue
    setData(newData)
  }

  const addNewStage = (brandIdx, modelIdx, engineIdx) => {
    const newData = { ...data }
    const stages = newData.brands[brandIdx].models[modelIdx].engines[engineIdx].stages
    const newStageNum = stages.length + 1
    
    stages.push({
      stage: newStageNum.toString(),
      stockHP: 0,
      stockNM: 0,
      tunedHP: 0,
      tunedNM: 0,
      notes: []
    })
    
    setData(newData)
  }

  const deleteStage = (brandIdx, modelIdx, engineIdx, stageIdx) => {
    if (confirm('Are you sure you want to delete this stage?')) {
      const newData = { ...data }
      newData.brands[brandIdx].models[modelIdx].engines[engineIdx].stages.splice(stageIdx, 1)
      setData(newData)
    }
  }

  if (loading) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <LoadingSpinner />
          <p className="text-gray-400 mt-4">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Admin Panel</h2>
            <p className="text-gray-400">Manage tuning data</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 text-sm">
              Logged in as: <span className="text-white">{user?.email}</span>
            </span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="card p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              {data?.brands?.length || 0} brands • Total entries in database
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadData}
                className="btn btn-secondary"
                disabled={loading || saving}
              >
                Reload Data
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg text-green-400">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Data Editor */}
        <div className="space-y-4">
          {data?.brands?.map((brand, brandIdx) => (
            <div key={brand.id} className="card">
              {/* Brand Header */}
              <div
                className="p-4 cursor-pointer hover:bg-dark-700 transition-colors flex justify-between items-center"
                onClick={() => toggleBrand(brand.id)}
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">
                    {expandedBrands.has(brand.id) ? '▼' : '▶'}
                  </span>
                  <h3 className="text-xl font-bold text-white">{brand.name}</h3>
                  <span className="ml-3 text-sm text-gray-400">
                    ({brand.models?.length || 0} models)
                  </span>
                </div>
              </div>

              {/* Brand Content */}
              {expandedBrands.has(brand.id) && (
                <div className="p-4 border-t border-dark-700 space-y-3">
                  {brand.models?.map((model, modelIdx) => {
                    const modelKey = `${brand.id}-${model.id}`
                    return (
                      <div key={model.id} className="bg-dark-900 rounded-lg">
                        {/* Model Header */}
                        <div
                          className="p-3 cursor-pointer hover:bg-dark-700 transition-colors flex justify-between items-center"
                          onClick={() => toggleModel(modelKey)}
                        >
                          <div className="flex items-center">
                            <span className="text-lg mr-2">
                              {expandedModels.has(modelKey) ? '▼' : '▶'}
                            </span>
                            <span className="font-semibold text-white">{model.name}</span>
                            {model.year && (
                              <span className="ml-2 text-sm text-gray-400">({model.year})</span>
                            )}
                            <span className="ml-3 text-sm text-gray-400">
                              ({model.engines?.length || 0} engines)
                            </span>
                          </div>
                        </div>

                        {/* Model Content */}
                        {expandedModels.has(modelKey) && (
                          <div className="p-3 border-t border-dark-700 space-y-2">
                            {model.engines?.map((engine, engineIdx) => {
                              const engineKey = `${modelKey}-${engine.id}`
                              return (
                                <div key={engine.id} className="bg-dark-800 rounded-lg">
                                  {/* Engine Header */}
                                  <div
                                    className="p-3 cursor-pointer hover:bg-dark-700 transition-colors flex justify-between items-center"
                                    onClick={() => toggleEngine(engineKey)}
                                  >
                                    <div className="flex items-center">
                                      <span className="mr-2">
                                        {expandedEngines.has(engineKey) ? '▼' : '▶'}
                                      </span>
                                      <span className="text-primary-400 font-medium">{engine.name}</span>
                                      <span className="ml-3 text-sm text-gray-400">
                                        ({engine.stages?.length || 0} stages)
                                      </span>
                                    </div>
                                  </div>

                                  {/* Engine Content - Stages Table */}
                                  {expandedEngines.has(engineKey) && (
                                    <div className="p-3 border-t border-dark-700">
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                          <thead>
                                            <tr className="text-left text-gray-400 border-b border-dark-600">
                                              <th className="pb-2 pr-2">Stage</th>
                                              <th className="pb-2 pr-2">Stock HP</th>
                                              <th className="pb-2 pr-2">Stock NM</th>
                                              <th className="pb-2 pr-2">Tuned HP</th>
                                              <th className="pb-2 pr-2">Tuned NM</th>
                                              <th className="pb-2">Actions</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {engine.stages?.map((stage, stageIdx) => (
                                              <tr key={stageIdx} className="border-b border-dark-700">
                                                <td className="py-2 pr-2 text-white">Stage {stage.stage}</td>
                                                <td className="py-2 pr-2">
                                                  <input
                                                    type="number"
                                                    className="w-20 px-2 py-1 bg-dark-900 border border-dark-600 rounded text-white text-sm"
                                                    value={stage.stockHP}
                                                    onChange={(e) =>
                                                      updateStageValue(brandIdx, modelIdx, engineIdx, stageIdx, 'stockHP', e.target.value)
                                                    }
                                                  />
                                                </td>
                                                <td className="py-2 pr-2">
                                                  <input
                                                    type="number"
                                                    className="w-20 px-2 py-1 bg-dark-900 border border-dark-600 rounded text-white text-sm"
                                                    value={stage.stockNM}
                                                    onChange={(e) =>
                                                      updateStageValue(brandIdx, modelIdx, engineIdx, stageIdx, 'stockNM', e.target.value)
                                                    }
                                                  />
                                                </td>
                                                <td className="py-2 pr-2">
                                                  <input
                                                    type="number"
                                                    className="w-20 px-2 py-1 bg-dark-900 border border-dark-600 rounded text-white text-sm"
                                                    value={stage.tunedHP}
                                                    onChange={(e) =>
                                                      updateStageValue(brandIdx, modelIdx, engineIdx, stageIdx, 'tunedHP', e.target.value)
                                                    }
                                                  />
                                                </td>
                                                <td className="py-2 pr-2">
                                                  <input
                                                    type="number"
                                                    className="w-20 px-2 py-1 bg-dark-900 border border-dark-600 rounded text-white text-sm"
                                                    value={stage.tunedNM}
                                                    onChange={(e) =>
                                                      updateStageValue(brandIdx, modelIdx, engineIdx, stageIdx, 'tunedNM', e.target.value)
                                                    }
                                                  />
                                                </td>
                                                <td className="py-2">
                                                  <button
                                                    onClick={() => deleteStage(brandIdx, modelIdx, engineIdx, stageIdx)}
                                                    className="text-red-400 hover:text-red-300 text-xs"
                                                  >
                                                    Delete
                                                  </button>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                      <button
                                        onClick={() => addNewStage(brandIdx, modelIdx, engineIdx)}
                                        className="mt-3 text-sm text-primary-400 hover:text-primary-300"
                                      >
                                        + Add Stage
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Save Button at Bottom */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="btn btn-primary px-8"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
