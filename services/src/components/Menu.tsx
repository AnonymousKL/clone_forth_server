import { menus } from "utils/constant"

const Menu = () => {
  return (
    <ul className="flex">
      {menus.map((menu) => (
        <li className="rounded-t-5 px-4 py-3 text-white bg-primary-1">{menu.title}</li>
      ))}
    </ul>
  )
}

export default Menu
