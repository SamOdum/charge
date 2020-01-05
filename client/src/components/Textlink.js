import React from 'react'
import { Link } from 'react-router-dom'

function Textlink(props) {
    const linkItem = props.to ? 
        <Link to={props.to}>{props.title}</Link> :
        <a href={props.href}>{props.title}</a>
    return (
        <div>
            {linkItem}
        </div>
    )
}

export default Textlink
