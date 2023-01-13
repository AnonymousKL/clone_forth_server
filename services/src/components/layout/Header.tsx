import { ReactComponent as Logo } from 'assets/icon/logo.svg';
import { ReactComponent as LogoText } from 'assets/icon/logo-text.svg';
import Menu from 'components/Menu';

const Header = () => {
  return (
    <header className="pt-3 px-5 border-b border-primary-1">
      <div className="flex justify-between">
        <div className="h-fit">
          <div className="flex mb-3 justify-center items-center">
            <Logo width={50} height={50} className="shrink-0" />
            <div className="ml-4">
              <LogoText />
              <p className="mt-1 text-xs uppercase text-primary-2">Get it done</p>
            </div>
          </div>
        </div>
        <div className="menu h-fit self-end">
          <Menu />
        </div>
        <div className="header-right mb-3 h-fit self-end">
          <div className="search">
            <input className="rounded-10 border border-gray-300" />
          </div>
          <div className="flex items-center">
          </div>
        </div>
      </div>
      <div></div>
    </header>
  )
}

export default Header
