import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap';
import WishItemChagpt from './wish-item-chagpt'
import WishItemSingleChagpt from './wish-item-single-chagpt'
export default class WishResultsChagpt extends Component {
  constructor(props){
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  isNewItem(key) {
    return !this.props.inventory[key]
  }
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress(event) {
    const key = event.key.toLowerCase();
    switch (key) {
      case 'n':
        document.getElementById('close-button').click();
        break;
      default:
        break;
    }
  };
  render() {
    const { wishes, setView, updateInventory } = this.props
    const isSingleItem = wishes.length === 1
    return (
      <div className="wish-results">
        <Container style={{ 'maxWidth': '1960px' }}>
          <Row className="vh-10">
            <Col xs="12">
              <div className="d-flex justify-content-end mt-2">
                <div id="close-button" onClick={() => {
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
