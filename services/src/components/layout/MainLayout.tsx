import Header from "components/layout/Header"

const MainLayout = ({ children }: any) => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="px-14 pt-6">
        {children}
      </div>
    </div>
  )
}

export default MainLayout
