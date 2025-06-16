import React from 'react'

function Button({
    children,
    onClick,
    className='',
    ...props
}) {
  return (
    <button
    className={`${className} cursor-pointer`}
    onClick={onClick}
    {...props}
    >
        {children}
    </button>
  )
}

export default Button
