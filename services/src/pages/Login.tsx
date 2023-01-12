import { useState } from "react"
import { useTranslation } from "react-i18next"
import axiosInstance from "__mocks"
import { ReactComponent as Logo } from 'assets/icon/logo.svg';
import { ReactComponent as LogoText } from 'assets/icon/logo-text.svg';
import { ReactComponent as Spinner } from 'assets/icon/spinner-solid.svg';
import { useNavigate } from "react-router-dom";
import Modal from "components/Modal";

const Login = () => {
  const initFormData = {
    email: '',
    password: '',
  }

  const [formData, setFormData] = useState(initFormData)
  const [isLogging, setIsLogging] = useState(false)
  const { t } = useTranslation()
  let navigate = useNavigate()

  const handleSubmitForm = async (e: any) => {
    e.preventDefault()
    setIsLogging(true)
    const res = await axiosInstance.post('/login', formData)
    if (res.data.token) {
      localStorage.setItem('token', res.data.token)
      navigate('/')
    } else {
      navigate('/login')
    }
    setIsLogging(false)
  }

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="form-wrap w-96">
          <div className="flex justify-center items-center">
            <Logo width={50} height={50} className="shrink-0" />
            <div className="ml-4">
              <LogoText />
              <p>Get it done</p>
            </div>
          </div>
          <form className="mt-5" onSubmit={handleSubmitForm}>
            <div className="rounded-5 p-12 shadow-4p">
              <input
                name="email"
                type="text"
                value={formData.email}
                placeholder="example@gmail.com"
                className="p-2 mb-4 w-full border-b border-b-slate-400 block"
                onChange={handleChange}
              />
              <input
                name="password"
                type="password"
                value={formData.password}
                className="p-2 mb-4 w-full border-b border-b-slate-400 block"
                onChange={handleChange}
              />
              <button className="px-4 py-2 mt-5 w-full rounded-10 text-white bg-primary-1" type="submit">{t('Login')}</button>
              <p className="text-center mt-5 mb-8">
                <a className="mt-4 underline text-gray-500 text-center" href="/">{t('Forgot password')}</a>
              </p>
              <button className="px-4 py-2 w-full rounded-10 border border-primary-1" type="submit">{t('Sign up')}</button>
            </div>
          </form>
        </div>
      </div>
      {isLogging && (
        <Modal
          isShow={false}
          noModalBg={true}
          onClose={() => setIsLogging(false)}
        >
          <div className="m-auto w-14 h-14">
            <Spinner className="animate-spin stroke-none fill-white" />
          </div>
        </Modal>
      )}
    </>
  )
}

export default Login
