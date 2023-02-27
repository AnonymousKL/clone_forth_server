import clsx from "clsx"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Drawer } from "antd"
import { menus } from "utils/constant"
import { ReactComponent as DropdownIcon } from "assets/icon/dropdown.svg"
import HamburgerIcon from "./svg-icon/HamburgerIcon"

type Props = {
  className?: string
}

const MenuMobile = ({ className }: Props) => {
  const [open, setOpen] = useState(false)
  const itemBaseClass = 'px-4 py-2 mb-1 min-w-[120px] transition text-lg inline-flex '

  return (
    <div className={clsx(className)}>
      <button
        className="px-3 py-1 ml-2 rounded-md border"
        onClick={() => setOpen(true)}
      >
        <HamburgerIcon />
      </button>
      <Drawer className="lg:hidden" title="Menu" placement="right" onClose={() => setOpen(false)} open={open}>
        <ul>
          {menus.map((menu, i) => (
            <li key={i}>
              <NavLink
                to={menu.link}
                className={({ isActive }) => itemBaseClass + (isActive ? 'text-primary-3 border-primary-3 border-b-2' : 'border-transparent border-b-2')}
              >
                <span>{menu.title}</span>
                {menu.children && (<span className="ml-2"><DropdownIcon /></span>)}
              </NavLink>
            </li>
          ))}
        </ul>
      </Drawer>
    </div>
  )
}

export default MenuMobile
