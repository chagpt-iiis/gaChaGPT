import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap';
import WishItemChagpt from './wish-item-chagpt'
import WishItemSingleChagpt from './wish-item-single-chagpt'
export default class WishResultsChagpt extends Component {
  isNewItem(key) {
    return !this.props.inventory[key]
  }
  render() {
    const { wishes, setView, updateInventory } = this.props
    const isSingleItem = wishes.length === 1
    return (
      <div className="wish-results">
        <Container>
          <Row className="vh-10">
            <Col xs="12">
              <div className="d-flex justify-content-end mt-2">
                <div onClick={() => {
                  setView('banners');
                  updateInventory(wishes.map(item => Object.assign({}, item)));
                }} className="close-button"></div>
              </div>
            </Col>
          </Row>
          <Row className="vh-90 justify-content-center align-items-center">
            {
              isSingleItem
              ? (
                <WishItemSingleChagpt
                item={wishes[0]}
                />
              )
              : (
                wishes.sort((item1, item2) => item2.assignedRating - item1.assignedRating).map((item, index) => (
                  <WishItemChagpt
                    key={index}
                    item={item}
                    itemPercentX={50}
                  />
                  ))
              )
            }
          </Row>
        </Container>
      </div>
    )
  }
}
