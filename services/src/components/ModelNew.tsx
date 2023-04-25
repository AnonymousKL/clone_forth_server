import clsx from "clsx";
import { ReactNode } from "react";
import Button from "./Button";
import XIcon from "./svg-icon/XIcon";

type Props = {
  title?: string,
  noModalBg?: boolean,
  contentWrapPadding?: string,
  contentWrapClass?: string,
  children?: ReactNode,
  actionButton: boolean,
  resolve: (state: boolean) => void,
}

export default function ModelNew({
  title,
  children,
  noModalBg = false,
  contentWrapPadding = 'p-3',
  contentWrapClass,
  actionButton = false,
  resolve
}: Props) {
  return (
    <div className="py-8 md:py-12 bg-stone-800/50 fixed top-0 left-0 right-0 bottom-0 flex z-50 backdrop-blur-sm overflow-y-auto" onClick={() => resolve(false)}>
      {noModalBg ? (
        <>{children}</>
      ) : (
        <div className="m-auto rounded-5 relative bg-white min-w-3/4 md:min-w-2/4 xl:min-w-1/4 w-fit" onClick={(e) => e.stopPropagation()}>
          <p className="py-10p px-14 text-white bg-primary-1 rounded-t-5 text-center text-lg font-medium relative">
            {title}
            <XIcon
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
              onClick={() => resolve(false)}
            />
          </p>
          <div className={clsx(contentWrapPadding, contentWrapClass)}>
            {children}
            {actionButton && (
              <div className="flex justify-center mt-6">
                <Button className="mr-7" onClick={() => resolve(false)}>Cancel</Button>
                <Button variant="red" onClick={() => resolve(true)}>Delete</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
