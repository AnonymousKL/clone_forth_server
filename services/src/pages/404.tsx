import { Link } from "react-router-dom"
import errorImage from "assets/images/404.jpg"

const Error = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <img width={400} height={400} src={errorImage} alt="404" />
        <div className="mx-auto w-fit">
          <Link to="/">
            <p className="mt-5 px-4 py-2 text-primary-1/80 underline rounded-5 shadow-md">Back to homepage</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Error
