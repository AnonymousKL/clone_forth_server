import clsx from 'clsx'
import { MutableRefObject, ReactNode, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  title?: string,
  isShow: boolean,
  noModalBg?: boolean,
  contentWrapPadding?: string,
  contentWrapClass?: string,
  children?: ReactNode,
  onClose: (e: any) => void,
}

const Modal = ({ title, children, noModalBg = false, contentWrapPadding = 'p-3', contentWrapClass, onClose }: Props) => {
  const contentRef: MutableRefObject<null | any> = useRef(null)

  useEffect(() => {
    function closeOnEscapeKeyDown(e: any) {
      if ((e.charCode || e.keyCode) === 27) {
        onClose(e)
      }
    }
    document.addEventListener('keydown', closeOnEscapeKeyDown)
    return () => {
      document.removeEventListener('keydown', closeOnEscapeKeyDown)
    }
  }, [])

  return (
    <>
      {createPortal(
        <div className="py-8 md:py-12 bg-stone-800/50 fixed top-0 left-0 right-0 bottom-0 flex z-50 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
          {noModalBg ? (
            <>{children}</>
          ) : (
            <div className="m-auto rounded-10 relative bg-white dark:bg-slate-300 min-w-3/4 md:min-w-2/4 xl:min-w-1/4 w-fit" ref={contentRef} onClick={(e) => e.stopPropagation()}>
              <p className="py-10p px-14 bg-blue-4/5 text-dark-primary rounded-t-10 text-center text-lg font-medium relative">
                {title}
              </p>
              <div className={clsx(contentWrapPadding, contentWrapClass)}>
                {children}
              </div>
            </div>
          )}
        </div>,
        document.getElementsByTagName('body')[0]
      )}
    </>
  )
}

export default Modal
