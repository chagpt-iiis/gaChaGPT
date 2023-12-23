import React, { Component } from 'react';
import BannerButton from './banner-button';
import { Carousel } from 'react-responsive-carousel';
import Modal from './modal';
import Settings from './settings'

const banners = require.context('../assets/images/banners', true);
export default class Banners extends Component {
  constructor(props) {
    super(props)
    const selectedCharacterEventWish = this.props.getFormattedCharacterEventWish('kebabCase')
    this.state = {
      selectedBanner: 'beginners-wish',
      selectedCharacterEventWish,
      banners: {
        'beginners-wish': 'Novice Wishes',
        [selectedCharacterEventWish]: 'CháGPT Gacha',
        'epitome-invocation': 'Weapon Event Wish',
        'wanderlust-invocation': 'Standard Wish'
      },
      wishes: {
        'beginners-wish': 'beginnersWish',
        [selectedCharacterEventWish]: this.props.getFormattedCharacterEventWish('camelCase', selectedCharacterEventWish),
        'epitome-invocation': 'epitomeInvocation',
        'wanderlust-invocation': 'wanderlustInvocation'
      },
      wasBeginnersWishDisabled: false,
      isSettingsPageVisible: false
    }

    this.handleKeyPress = this.handleKeyPress.bind(this);

  }
  componentDidMount() {
    this.toggleBeginnersWish(this.props.isBeginnersWishLimited)
    this.setState({ selectedBanner: this.props.selectedBanner })
    // Add event listeners for keydown
    window.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    // Remove event listeners when the component is unmounted
    window.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress(event) {
    const key = event.key.toLowerCase();
    switch (key) {
      case 'c':
        document.getElementById('wishButton').click();
        break;
      case 'v':
        document.getElementById('wish10Button').click();
        break;
      default:
        break;
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.isBeginnersWishLimited !== this.props.isBeginnersWishLimited) {
      this.toggleBeginnersWish(this.props.isBeginnersWishLimited)
    }
    const newSelectedCharacterEventWish = this.props.getFormattedCharacterEventWish('kebabCase')
    // If the user selected a new banner
    const { selectedCharacterEventWish, selectedBanner } = this.state
    const { isBeginnersWishLimited } = this.props
    if(newSelectedCharacterEventWish !== selectedCharacterEventWish) {
      const { banners: oldBanners, wishes: oldWishes } = this.state
      const banners = {}
      const wishes = {}
      for(const b in oldBanners) {
        if(selectedCharacterEventWish === b) {
          banners[newSelectedCharacterEventWish] = 'CháGPT Gacha'
        } else {
          banners[b] = oldBanners[b]
        }
      }
      for(const w in oldWishes) {
        if(selectedCharacterEventWish === w) {
          wishes[newSelectedCharacterEventWish] = this.props.getFormattedCharacterEventWish('camelCase', newSelectedCharacterEventWish)
        } else {
          wishes[w] = oldWishes[w]
        }
      }
      let newSelectedBanner = null
      if(selectedBanner === selectedCharacterEventWish) {
        newSelectedBanner = newSelectedCharacterEventWish
      } else {
        newSelectedBanner = selectedBanner
      }
      if (isBeginnersWishLimited) {
        delete banners['beginners-wish']
        delete wishes['beginners-wish']
      }
      this.setState({
        selectedCharacterEventWish: newSelectedCharacterEventWish,
        banners,
        wishes,
        selectedBanner: newSelectedBanner
      })
    }
  }
  onCarouselChange(index) {
    this.switchBanner(Object.keys(this.state.banners)[index])
  }
  switchBanner(selectedBanner) {
    this.setState({ selectedBanner }, () => this.props.setCurrentDetails(selectedBanner))
  }
  get bannerText() {
    return this.state.banners[this.state.selectedBanner]
  }
  toggleSettingsModal(isSettingsPageVisible) {
    this.setState({
      isSettingsPageVisible
    })
  }
  toggleBeginnersWish(isLimited) {
    if (isLimited) {
      this.setState({
        selectedBanner: this.props.getFormattedCharacterEventWish('kebabCase'),
        banners: {
          [this.props.getFormattedCharacterEventWish('kebabCase')]: 'CháGPT Gacha',
          'epitome-invocation': 'Weapon Event Wish',
          'wanderlust-invocation': 'Standard Wish'
        },
        wishes: {
          [this.props.getFormattedCharacterEventWish('kebabCase')]: this.props.getFormattedCharacterEventWish('camelCase'),
          'epitome-invocation': 'epitomeInvocation',
          'wanderlust-invocation': 'wanderlustInvocation'
        },
        wasBeginnersWishDisabled: isLimited
      })
    } else {
      this.setState({
        banners: {
          'beginners-wish': 'Novice Wishes',
          [this.props.getFormattedCharacterEventWish('kebabCase')]: 'CháGPT Gacha',
          'epitome-invocation': 'Weapon Event Wish',
          'wanderlust-invocation': 'Standard Wish'
        },
        wishes: {
          'beginners-wish': 'beginnersWish',
          [this.props.getFormattedCharacterEventWish('kebabCase')]: this.props.getFormattedCharacterEventWish('camelCase'),
          'epitome-invocation': 'epitomeInvocation',
          'wanderlust-invocation': 'wanderlustInvocation'
        },
        wasBeginnersWishDisabled: isLimited
      })
    }
  }
  render() {
    const {
      selectedBanner,
      isSettingsPageVisible
     } = this.state
    const {
      wasDisclaimerSeen,
      setView,
      setSelectedWish,
      hideModal,
      reset,
      wish,
      isBeginnersWishOver10,
      getFormattedCharacterEventWish,
      updateCharacterEventWish,
      saveData,
      userWishes
    } = this.props
    const bannerKeys = Object.keys(this.state.banners);
    const selectedBannerIndex = bannerKeys.findIndex(b => b === selectedBanner)

    let wishButtonName, wish10ButtonName, settingsButtonName, detailsButtonName, inventoryButtonName;
    // console.log('selectedBanner', selectedBanner)

    if (selectedBanner ===  'chagpt-gacha-new' ) {
      wishButtonName = '单次抽取'
      wish10ButtonName = '5次抽取'
      settingsButtonName = '设置'
      detailsButtonName = '细节'
      inventoryButtonName = '记录'
    } else {
      wishButtonName = 'Wish'
      wish10ButtonName = 'Wish x10'
      settingsButtonName = 'Settings'
      detailsButtonName = 'Details'
      inventoryButtonName = 'Inventory'
    }
    return (
      <>
        {
          wasDisclaimerSeen
            ? null
            : <Modal hideModal={hideModal} />
        }
        {
          isSettingsPageVisible &&
          <Settings
            closeSettings={() => this.toggleSettingsModal(false)}
            reset={() => reset(selectedBanner)}
            updateCharacterEventWish={updateCharacterEventWish}
            getFormattedCharacterEventWish={getFormattedCharacterEventWish}
          />
        }
        <div className="wrapper banners">
          <div className="giws-banners-container" style={{ 'maxWidth': '2048px' }}>
            <div className="heading">
              <div className="current-banner" style={{ 'fontSize': '4.0rem', 'width': '600px' }}>
                <div>{this.bannerText}</div>
              </div>
              <div className="select-banner" style={{ 'width': '750px' }}>
                {
                  bannerKeys.map(banner => (
                    <BannerButton
                      key={banner}
                      isSelected={banner === selectedBanner}
                      className={banner}
                      onClick={() => this.switchBanner(banner)}
                    />
                  ))
                }
              </div>
              <div className="close-window"></div>
            </div>
            <div className="carousel-container">
              <Carousel
                className={"carousel"}
                showThumbs={false}
                showIndicators={false}
                showStatus={false}
                emulateTouch={false}
                showArrows={false}
                infiniteLoop={true}
                selectedItem={selectedBannerIndex}
                onChange={this.onCarouselChange.bind(this)}
              >
                {
                  bannerKeys.map(banner => {
                    return (
                      <div key={banner} className={`banner-slide ${banner}`}>
                        <div style={{'width': '100px', 'height': '100px', 'fontSize': '3.3rem'}}
                        title={`Your wish counter, you have wished ${userWishes[banner]} times`}
                        className="wish-counter">{userWishes[banner]}</div>
                        <img src={banners(`./${banner}.png`).default} />
                      </div>
                    )
                  })
                }
              </Carousel>
            </div>
            <div className="action-container">  
              <div className="button-container" style={{ 'fontSize': '1.5rem', 'width': '600px' }}>
                <button style={{'width': '150px' }}
                  onClick={() => this.toggleSettingsModal(true)}
                >{settingsButtonName}</button>
                <button style={{'width': '150px' }}
                  onClick={() => setView('details')}
                >{detailsButtonName}</button>
                <button style={{'width': '150px' }}
                  onClick={() => setView('inventory')}
                >{inventoryButtonName}</button>
              </div>
              <div className="wish-container d-flex justify-content-center" style={{ 'fontSize': '2.0rem'}}>
                <div
                  id='wishButton'
                  onClick={() => {
                    wish(this.state.wishes[selectedBanner], true)
                  }}
                  className="wish-button"
                  style={{'width': '300px' }}
                >{wishButtonName}</div>
                <div
                  id='wish10Button'
                  className={`wish-button ${selectedBanner === 'beginners-wish' && isBeginnersWishOver10 && 'disabled'}`}
                  onClick={() => {
                    if(isBeginnersWishOver10 && selectedBanner === 'beginners-wish') return;
                    wish(this.state.wishes[selectedBanner])
                  }}
                  style={{'width': '300px' }}
                >
                {wish10ButtonName}
              </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}
