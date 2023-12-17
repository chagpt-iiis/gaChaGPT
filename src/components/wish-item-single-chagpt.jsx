import React from 'react'
import { Col, Row } from 'reactstrap';
import ReactStars from "react-rating-stars-component";
const TeaTypeImages = require.context('../assets/images/tea-types');
const TeaIcons = require.context('../assets/images/details/tea-icons');
export default function WishItemSingleChagpt(props) {
  const {src, id, assignedRating, teaType} = props.item
  const backgroundImage = `url('${TeaTypeImages('./' + src).default}')`
  return (
      <Col
      xs="12"
      className="h-100 p-4"
      >
        <Row
        className="wish-item-single-container h-100 p-2"
        >
          <Col
            className="h-100 d-flex flex-column justify-content-center align-items-center wish-item-single-content"
            style={{
              background: `url('${TeaIcons(`./`+src).default}') left / 20% no-repeat`
            }}
            sm="12"
            md="3"
            >
            <div
              className="text-center text-wrap pb-1">{id}</div>
            <ReactStars
              count={assignedRating}
              size={24}
              edit={false}
              color="#ffd700"
              classNames={"justify-content-center"}
            />
          </Col>
          <Col
            className="wish-item-single h-100 w-100"
            style={{
              backgroundImage,
              backgroundSize: 'contain'
            }}
            sm="12"
            md="9"
            >
          </Col>
        </Row>
      </Col>
  )
}
