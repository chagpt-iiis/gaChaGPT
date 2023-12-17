import React from 'react'
import { Col } from 'reactstrap';
import ReactStars from "react-rating-stars-component";
const TeaTypeImages = require.context('../assets/images/tea-types');
const TeaIcons = require.context('../assets/images/details/tea-icons');
export default function WishItemChagpt(props) {
  const {itemPercentX } = props
  const {src, id, assignedRating, teaName, assignedLevelChs, color} = props.item
  return (
    <Col
    xs="2"
    md="2"
    lg="2"
    style={{
      backgroundImage: `url('${TeaTypeImages('./' + src).default}')`,
      backgroundPositionX: itemPercentX+'%',
      height: '800px',
    }}
    className={`wish-item character mx-1 px-0`}>
      <div
      className="h-100 react-stars-container d-flex flex-column align-content-center justify-content-end pb-2">
        <div className="text-center text-wrap pb-1" style={{ fontSize: '4.0rem' }}>{teaName}</div>
        <div className="text-center text-wrap pb-1" style={{ fontSize: '5.0rem' }}>{id}</div>
        <div className="text-center text-wrap pb-1" style={{ fontSize: '4.0rem', 'color': color}}>{assignedLevelChs}</div>
        {/* <ReactStars
          count={assignedRating}
          size={80}
          edit={false}
          color="#ffd700"
          classNames={"justify-content-center"}
        /> */}
      </div>
    </Col>
  )
}
