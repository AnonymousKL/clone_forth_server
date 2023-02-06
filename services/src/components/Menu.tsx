import { NavLink } from "react-router-dom"
import { ReactComponent as DropdownIcon } from "assets/icon/dropdown.svg"
import { menus } from "utils/constant"

const Menu = () => {
  const itemBaseClass = 'rounded-t-5 px-4 py-3 w-[110px] transition text-white text-center inline-flex justify-center items-center '

  return (
    <ul className="flex">
      {menus.map((menu, i) => (
        <li key={i}>
          <NavLink
            to={menu.link}
            className={({ isActive }) => itemBaseClass + (isActive ? 'bg-primary-1' : 'bg-primary-3')}
          >
            <span>{menu.title}</span>
            {menu.children && (<span className="ml-2"><DropdownIcon /></span>)}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

export default Menu
