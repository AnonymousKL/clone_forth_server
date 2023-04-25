import useTheme from "hooks/useTheme"

const Theme = ({ children }: any) => {
  useTheme()

  return children
}

export default Theme
