import React from 'react'

const Link = ({label,href}) => {
  return (
    <div>
        <a href={href}>{label}</a>
    </div>
  )
}

export default Link