import React from 'react'

export default function BannerButton(props) {
  const {isSelected, className, onClick} = props;
  return (
    <div
    className={`banner-button ${className} ${isSelected ? 'selected': ''}`}
    // className={`banner-button ${className} ${isSelected ? 'selected': ''}`}
    style={{width: '250px', height: '100px'}}
    onClick={onClick}
    ></div>
  )
}
