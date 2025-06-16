import React from 'react'

function Input({
    type = 'text',
    placeholder,
    value = '',
    onChange,
    ...props
}) {
  return (
    <input
    className={`block w-full rounded-xl outline outline-zinc-400 border-0 py-4 px-5 bg-[rgb(46_51_61)] text-white font-light placeholder:text-white/70  ${props.className || ""}`}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    {...props}
    />
  )
}

export default Input
