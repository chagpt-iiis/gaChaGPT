import React from 'react'
import { Row, Col } from 'reactstrap';
import ReactStars from "react-rating-stars-component";
import teaBackground from '../../assets/images/details/tea-backgrounds/background.png'

const TeaTypeDetailsThumbs = require.context('../../assets/images/tea-types/thumbnails')
const backgroundElements = require.context('../../assets/images/details/tea-icons')

export default function IconViewChagpt(props) {
  const { id, teaType, assignedRating, src, quantity } = props.item
  const backgroundStyle = {
      background: `url('${backgroundElements(`./`+src).default}') right / 20% no-repeat, url('${teaBackground}') no-repeat center / contain`
    }

  return(
    <Col
      lg="6"
      xl="4"
      className="m-2 p-3 text-center icon-item"
      style={backgroundStyle}
    >
        <Row className="h-100">
          <Col
          xs='6'
          className="d-flex justify-content-center align-items-center">
            <Row>
            <Col xs='12' className='d-flex justify-content-center align-items-center'>
              <img
                src={TeaTypeDetailsThumbs(`./`+src).default}
                className="img-fluid"
                style={{
                  maxHeight: '64px'
                }}
              />
              </Col>
            <Col xs='12' className="d-flex justify-content-center align-items-center mt-2">
              {id}
            </Col>
            </Row>
          </Col>
          <Col
          xs='6'
          >
          <Row className='justify-content-center align-items-center h-100'>
            <Col
              xs='12'
              className="d-flex justify-content-center align-items-center p-0">
              <ReactStars
                count={assignedRating}
                size={16}
                edit={false}
                color="#ffd700"
              />
            </Col>
            <Col
              xs='12'
              className="d-flex justify-content-center align-items-center">
              X {quantity}
            </Col>
            </Row>
          </Col>
        </Row>
    </Col>
  )
}
