import React from 'react'

function Input(props) {
    console.log(props)
    const { type, name, value, placeholder, onChange } = props;
    return (
        <input 
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
        />
    )
}

export default Input
