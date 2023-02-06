import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"
import { apiUrl } from "services/api";
import axiosInstance from "__mocks"
import Modal from "components/Modal";
import { ReactComponent as Logo } from 'assets/icon/logo.svg';
import { ReactComponent as LogoText } from 'assets/icon/logo-text.svg';
import { ReactComponent as Spinner } from 'assets/icon/spinner-solid.svg';

type FormField = {
  email: string,
  password: string,
}

const Login = () => {
  const initFormData: FormField = {
    email: '',
    password: '',
  }

  const validateField = ['email', 'password']

  const [error, setError] = useState<{ email?: string, password?: string }>({})
  const [formData, setFormData] = useState(initFormData)
  const [isLogging, setIsLogging] = useState(false)
  const [loginErr, setLoginErr] = useState(false)
  const { t } = useTranslation()
  let navigate = useNavigate()

  const handleSubmitForm = async (e: any) => {
    e.preventDefault()
    setIsLogging(true)
    setError({})

    if (!validate(validateField)) {
      try {
        const res = await axiosInstance.post(apiUrl + '/login', formData)
        if (res.data.access_token) {
          localStorage.setItem('token', res.data.access_token)
          navigate('/')
        } else {
          setIsLogging(false)
          navigate('/login')
        }
      } catch (err) {
        setLoginErr(true)
        setIsLogging(false)
      }
    }

    setIsLogging(false)
  }

  const validate = (validateField: any[]): boolean => {
    let err = false

    Object.keys(formData).forEach((formField) => {
      if (validateField.includes(formField)) {
        if (formData[formField as keyof FormField] === '') {
          err = true
          setError((error) => ({ ...error, [formField]: 'This field is required !' }))
        }
      }
    })

    return err
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
              <p className="mt-1 text-xs uppercase text-primary-2">Get it done</p>
            </div>
          </div>
          <form className="mt-5" onSubmit={handleSubmitForm}>
            {loginErr && (
              <p className="mb-2 text-sm text-center text-red-600">{t('Wrong email or password')}</p>
            )}
            <div className="rounded-5 p-12 shadow-4p">
              <div className="mb-4">
                <label>Email <span className="text-red-600">*</span></label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  placeholder="example@gmail.com"
                  className="p-2 w-full border-b border-b-slate-400 block"
                  onChange={handleChange}
                />
                {error.email && (<p className="mt-1 text-xs text-red-600">{error.email}</p>)}
              </div>
              <div className="mb-4">
                <label>Password <span className="text-red-600">*</span></label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  className="p-2 w-full border-b border-b-slate-400 block"
                  onChange={handleChange}
                />
                {error.password && (<p className="mt-1 text-xs text-red-600">{error.password}</p>)}
              </div>
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
