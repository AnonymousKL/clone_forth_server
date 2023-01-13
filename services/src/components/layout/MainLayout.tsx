import Header from "./Header"

const MainLayout = ({ children }: any) => {
  return (
    <div className="">
      <Header />
      {children}
    </div>
  )
}

export default MainLayout
