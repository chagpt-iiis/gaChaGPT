import React from 'react'
import { Row, Col } from 'reactstrap';
import ReactStars from "react-rating-stars-component";
const TeaTypeDetailsThumbs = require.context('../../assets/images/tea-types/thumbnails')
export default function ListViewChagpt(props) {
  const {id, teaType, assignedRating, src, quantity} = props.item
  return (
    <Col
      xs="12"
      className="card my-2 p-2"
    >
      <div className="list-item">
        <Row>
          <Col xs='3' className="d-flex justify-content-center align-items-center">
            <img
            src={TeaTypeDetailsThumbs(`./`+src).default}
            className="img-fluid"
            style={{
              maxHeight: '64px'
            }}
            />
          </Col>
          <Col xs='3' className="d-flex justify-content-center align-items-center">
            {id}
          </Col>
          <Col xs='3' className="d-flex justify-content-center align-items-center">
            <ReactStars
              count={assignedRating}
              size={15}
              edit={false}
              color="#ffd700"
            />
          </Col>
          <Col xs='3' className="d-flex justify-content-center align-items-center">
            X {quantity}
          </Col>
        </Row>
      </div>
    </Col>
  )
}
