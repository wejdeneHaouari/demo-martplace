import React from 'react';

import Header from '../Header';
import Footer from '../Common/Footer/Footer';
import BalloonImage from '../../assets/images/balloons.png';
import InstagramLogo from '../../assets/images/storeFront/instagram-blue.svg';
import YoutubeLogo from '../../assets/images/storeFront/play-blue.svg';
import FacebookLogo from '../../assets/images/storeFront/facebook-blue.svg';
import TwitterLogo from '../../assets/images/storeFront/twitter-blue.svg';
import HeaderBanner from '../../components/BalloonHeader/HeaderBanner';

const StoreClosed = () => {
  return (
    <>
      <Header />
      <div className='store__closed-comp'>
        <HeaderBanner type='Store Closed' />
        <div className='post__checkout'>
          <img
            src={BalloonImage}
            alt='Balloons'
            className='post__checkout-img'
          />
          <h1 style={{ margin: '0' }}>Store Closed</h1>
          <a href='/' className='post__checkout-btn'>
            <button>Go Back to Home</button>
          </a>

          <h4>Follow us</h4>
          <div>
            <div className='post__checkout-logos'>
              <a href='https://www.instagram.com/njballoonfest/'>
                <img src={InstagramLogo} />
              </a>
              <a href='https://twitter.com/njballoonfest'>
                <img src={TwitterLogo} />
              </a>
              <a href='https://www.youtube.com/channel/UCB41nN1pvgl3ZyHs2xE0fUw'>
                <img src={YoutubeLogo} />
              </a>
              <a href='https://www.facebook.com/NJBalloonFest/?ref=ts'>
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