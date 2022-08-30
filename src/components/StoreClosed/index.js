import React from 'react';

import Header from '../Header';
import Footer from '../Common/Footer/Footer';
import MarketplaceImage from '../../assets/images/marketplaces.png';
import InstagramLogo from '../../assets/images/storeFront/instagram-blue.svg';
import YoutubeLogo from '../../assets/images/storeFront/play-blue.svg';
import FacebookLogo from '../../assets/images/storeFront/facebook-blue.svg';
import TwitterLogo from '../../assets/images/storeFront/twitter-blue.svg';
import HeaderBanner from '../MartplaceHeader/HeaderBanner';

const StoreClosed = () => {
  return (
    <>
      <Header />
      <div className='store__closed-comp'>
        <HeaderBanner type='Store Closed' />
        <div className='post__checkout'>
          <img
            src={MarketplaceImage}
            alt='Marketplaces'
            className='post__checkout-img'
          />
          <h1 style={{ margin: '0' }}>Store Closed</h1>
          <a href='/' className='post__checkout-btn'>
            <button>Go Back to Home</button>
          </a>

          <h4>Follow us</h4>
          <div>
            <div className='post__checkout-logos'>
              <a href='https://www.instagram.com/njmarketplacefest/'>
                <img src={InstagramLogo} />
              </a>
              <a href='https://twitter.com/njmarketplacefest'>
                <img src={TwitterLogo} />
              </a>
              <a href='https://www.youtube.com/channel/UCB41nN1pvgl3ZyHs2xE0fUw'>
                <img src={YoutubeLogo} />
              </a>
              <a href='https://www.facebook.com/NJMarketplaceFest/?ref=ts'>
                <img src={FacebookLogo} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StoreClosed;
