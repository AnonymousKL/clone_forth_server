import { Link, useNavigate } from 'react-router-dom'
import useUserStore from 'store/useUserStore'
import { ReactComponent as Logo } from 'assets/icon/logo.svg'
import { ReactComponent as LogoText } from 'assets/icon/logo-text.svg'
import { ReactComponent as UserIcon } from 'assets/icon/user.svg'
import Menu from 'components/Menu'
import Search from 'components/Search'
import RingIcon from 'components/svg-icon/RingIcon'
import QuestionIcon from 'components/svg-icon/QuestionIcon'
import SettingIcon from 'components/svg-icon/SettingIcon'
import MenuMobile from 'components/MenuMobile'

const Header = () => {
  const user = useUserStore()
  const navigate = useNavigate()

  const logout = () => {
    user.setIsLoggedIn(false)
    localStorage.removeItem('token')
    return navigate("/login")
  }

  return (
    <header className="pt-3 px-5 border-b-[5px] border-primary-1">
      <div className="flex justify-between gap-4">
        <div className="h-fit">
          <Link to="/">
            <div className="flex mb-3 justify-center items-center">
              <Logo width={50} height={50} className="shrink-0" />
              <div className="ml-4">
                <LogoText />
                <p className="mt-1 text-xs uppercase text-primary-2">Get it done</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="menu h-fit self-end min-w-[70%]">
          <Menu />
        </div>
        <div className="header-right mb-3 h-fit self-end flex">
          {/* <Search className="hidden lg:block" inputClassName="h-8" /> */}
          <div className="flex items-center">
            {/* <div className="ml-2 lg:ml-3 cursor-pointer">
              <RingIcon className="fill-gray-1 hover:fill-black transition-all" />
            </div>
            <div className="ml-3 lg:ml-4 cursor-pointer">
              <QuestionIcon className="fill-gray-1 hover:fill-black transition-all" />
            </div>
            <div className="ml-3 lg:ml-4 cursor-pointer">
              <SettingIcon className="fill-gray-1 hover:fill-black transition-all" />
            </div> */}
            <div className="ml-3 lg:ml-4 cursor-pointer">
              <UserIcon onClick={logout} />
            </div>
          </div>
          <MenuMobile className="lg:hidden" />
        </div>
      </div>
    </header>
  )
}

export default Header
