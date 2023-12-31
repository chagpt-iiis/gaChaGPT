import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap';
import WishItem from './wish-item'
import WishItemSingle from './wish-item-single'
export default class WishResults extends Component {
  constructor(props){
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  isNewItem(key) {
    return !this.props.inventory[key]
  }
  getPercentX(item) {
    if (item.type === 'character') {
        return item.percentX || 50;
    } else {
      return 50;
    }
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
        <Container>
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
                <WishItemSingle
                item={wishes[0]}
                isNewItem={this.isNewItem(wishes[0].name)}
                />
              )
              : (
                wishes.sort((item1, item2) => item2.rating - item1.rating).map((item, index) => (
                  <WishItem
                    key={index}
                    item={item}
                    isNewItem={this.isNewItem(item.name)}
                    itemPercentX={this.getPercentX(item)}
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
