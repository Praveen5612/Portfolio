import { createContext, useContext, useState, useEffect } from 'react'
import { settingsApi } from '../services/settings.api.js'

const SettingsContext = createContext({})

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({})
  const [socialLinks, setSocialLinks] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([
      settingsApi.getPublic().catch(() => ({ data: {} })),
      settingsApi.getSocialLinks().catch(() => ({ data: [] })),
    ]).then(([s, l]) => {
      setSettings(s.data || {})
      setSocialLinks(l.data || [])
      setLoaded(true)
    })
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, socialLinks, loaded }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
