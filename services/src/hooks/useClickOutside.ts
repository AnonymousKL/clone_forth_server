import { useEffect, useState } from "react"

export const useClickOutside = (ref: any) => {
  const [clickOutside, setClickOutside] = useState(false)

  useEffect(() => {
    function handleClickOutside (e: any) {
      if (ref.current && !ref.current.contains(e.target)) {
        setClickOutside(true)
      } else {
        setClickOutside(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [ref.current])
  return clickOutside
}
