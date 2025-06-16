import React, { act, useEffect, useState } from 'react'
import Input from './Input'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

function Select({
    placeholder,
    options,
    value,
    onChange
}) {
    const [localOptions, setLocalOptions] = useState([])
    const [showOptions, setShowOptions] = useState(false)
    
    const selected = options.find((option) => option.value === value)

    const handleInputChange = (e) =>{
        setLocalOptions(options.filter((option) => option.label.includes(e.target.value)))
        setShowOptions(true)
    }

    useEffect(() => {
        setLocalOptions(options)
    },[options])
  return (
    <div className='relative mt-2 w-full'>
      <div className='relative w-full'>
        <Input
          placeholder={placeholder}
          value={showOptions ? "" : selected?.label || ""}
          onChange={handleInputChange}
          onFocus={() => setShowOptions(true)}
        />
        <div
          className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none cursor-pointer'
          onClick={() => setShowOptions(prev => !prev)}
        >
            <ChevronUpDownIcon className='h-5 w-5 text-zinc-400' aria-hidden="true"/>
        </div>
      </div>
      {showOptions && localOptions.length > 0 && (
        <ul className='outline outline-zinc-400 absolute z-10 mt-2 p-2 max-h-60 w-full overflow-auto rounded-2xl bg-[rgb(46_51_61)] text-base shadow-lg ring-opacity-5 focus:outline-none sm:text-sm'>
            {localOptions.map((option) => (
                <li
                    key={option.value}
                    onClick={() => {
                        onChange(option);
                        setShowOptions(false);
                    }}
                    className={`cursor-pointer relative rounded-2xl select-none py-4 pl-3 pr-9 text-white hover:bg-[rgb(33_35_36)]`}
                >
                    <span
                     className={`
                        ${value === option.value ? "font-semibold" : ""}
                        block truncate
                     `}
                    >
                        {option.label}
                    </span>
                    {value === option.value && (
                        <span className='absolute inset-y-0 right-0 flex item-center pr-4 text-white items-center'>
                            <CheckIcon className='h-5 w-5' aria-hidden='true'/>
                        </span>
                    )}
                </li>
            ))}
        </ul>
      )}
    </div>
  )
}

export default Select
