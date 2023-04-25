import Header from "components/layout/Header"

const MainLayout = ({ children }: any) => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="p-4 sm:p-6 md:px-14 md:py-6">
        {children}
      </div>
    </div>
  )
}

export default MainLayout
