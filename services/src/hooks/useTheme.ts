import { useEffect, useState } from "react"

type Theme = 'system' | 'dark' | 'light'

let initTheme = 'system'

const useTheme = () => {
  const [ theme, setTheme ] = useState(initTheme)

  const getTheme = () => {
    const themeInStorage = localStorage.getItem('theme')
    if (themeInStorage === 'dark' || themeInStorage === 'light') {
      setTheme(themeInStorage)
      initTheme = themeInStorage
    } else {
      let media = window.matchMedia("(prefers-color-scheme: dark)")
      if (media.matches) {
        setTheme('dark')
        initTheme = 'dark'
      } else {
        setTheme('light')
        initTheme = 'light'
      }
    }
    document.documentElement.className = initTheme
  }

  const onChangeTheme = (theme: Theme) => {
    document.documentElement.className = theme
    setTheme(theme)
    localStorage.setItem('theme', theme)
  }

  useEffect(() => {
    getTheme()
  }, [])

  return { theme, setTheme, onChangeTheme }
}

export default useTheme
