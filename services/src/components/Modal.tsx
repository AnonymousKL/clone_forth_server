import clsx from 'clsx'
import { MutableRefObject, ReactNode, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import XIcon from 'components/svg-icon/XIcon'
import Button from 'components/Button'

type Props = {
  title?: string,
  isShow: boolean,
  noModalBg?: boolean,
  contentWrapPadding?: string,
  contentWrapClass?: string,
  children?: ReactNode,
  actionButton?: boolean,
  onAccept?: (e: any) => void,
  onCancel?: (e: any) => void,
  onClose: (e: any) => void,
}

const Modal = ({
  title,
  children,
  noModalBg = false,
  contentWrapPadding = 'p-3',
  contentWrapClass,
  actionButton = false,
  onAccept,
  onCancel,
  onClose }: Props) => {
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
            <div className="m-auto rounded-5 relative bg-white min-w-3/4 md:min-w-2/4 xl:min-w-1/4 w-fit" ref={contentRef} onClick={(e) => e.stopPropagation()}>
              <p className="py-10p px-14 text-white bg-primary-1 rounded-t-5 text-center text-lg font-medium relative">
                {title}
                <XIcon
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                  onClick={onClose}
                />
              </p>
              <div className={clsx(contentWrapPadding, contentWrapClass)}>
                {children}
                {actionButton && (
                  <div className="flex justify-center mt-6">
                    <Button className="mr-7" onClick={onCancel}>Cancel</Button>
                    <Button variant="red" onClick={onAccept}>Delete</Button>
                  </div>
                )}
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
