import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, EffectCoverflow, Autoplay } from "swiper";
import LeftArrow from "../../assets/images/storeFront/leftArrow.svg";
import RightArrow from "../../assets/images/storeFront/rightArrow.svg";
import PinkBanner from "../../assets/images/storeFront/titleBannerPink.svg";
import "swiper/swiper.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/effect-coverflow/effect-coverflow.scss";
import { env } from "../../constants";
import { Link } from "react-router-dom";
import HowItWorksBannerImg from "../../assets/images/backgrnd.png";

const NFTCarousel = () => {
  const [nftsForSale, setNftsForSale] = useState([]);

  const fetchCarouselData = () => {
    fetch(
      env.apiUrl +
        `api/users/getForSaleCertificatesByUsername?username=${env.username}`
    )
      .then((element) => element.json())
      .then((data) => {
        if (data) {
          setNftsForSale(data.data);
        }
      });
  };
  useEffect(() => {
    fetchCarouselData();
  }, []);

  console.log(nftsForSale);

  SwiperCore.use([Pagination, EffectCoverflow, Autoplay]);
  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);
  function getFileExtension(filename) {
    var ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? "" : ext[1];
  }

  const carousel = () => {
    return (
      <CarouselContainer>
        <Swiper
          effect="coverflow"
          grabCursor="true"
          loop="true"
          autoplay={{ delay: 1500 }}
          centeredSlides="true"
          initialSlide={4}
          spaceBetween={0}
          style={{ overflow: "none", width: "75%" }}
          loop="true"
          pagination={{ clickable: true, dynamicBullets: true }}
          coverflowEffect={{
            rotate: 20,
            stretch: 25,
            depth: 250,
            modifier: 1,
            slideShadows: false,
          }}
          breakpoints={{
            700: {
              spaceBetween: 0,
              slidesPerView: 4,
            },
            500: {
              spaceBetween: 0,
              slidesPerView: 3,
            },
          }}
        >
          {nftsForSale &&
            nftsForSale.map((slide, index) => {
              return (
                <SwiperSlide key={index} style={{ zIndex: 100 - index }}>
                  <a
                    className="nft__carousel--item"
                    href={`./balloon/viewCert?id=${slide.id}`}
                  >
                    {getFileExtension(slide.imageName) === ("mp3" || "mp4") ? (
                      <NFTSlide
                        backgroundImage={`${env.uploadImgLink}${slide.thumbNail}`}
                      >
                        <NFTInfoWrapper position={index}>
                          <p className="title">{slide.subject}</p>
                        </NFTInfoWrapper>
                        <div className="overlay"></div>
                      </NFTSlide>
                    ) : (
                      <NFTSlide
                        backgroundImage={`${env.uploadImgLink}${slide.imageName}`}
                      >
                        <NFTInfoWrapper position={index}>
                          <p className="title">{slide.subject}</p>
                        </NFTInfoWrapper>
                        <div className="overlay"></div>
                      </NFTSlide>
                    )}
                  </a>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </CarouselContainer>
    );
  };

  useEffect(() => {
    carousel();
  }, []);

  return (
    <Wrapper>
      {carousel()}
      <CTAWrapper>
        <div className="pinkBannerWrapper">
          <img src={PinkBanner}></img>
          <p>CURRENT DROP</p>
        </div>

        <h2>Song Source</h2>

        {/* <a href='/whitepaper.pdf' target='_blank' rel='noopener noreferrer'>
          <p>Learn more about the collection &gt;</p>
        </a> */}
      </CTAWrapper>
    </Wrapper>
  );
};
export default NFTCarousel;

const Wrapper = styled.div`
  width: 100%;
  height: 500px;
  background-image: url(${HowItWorksBannerImg});
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Aileron Reguler";

  @media screen and (max-width: 800px) {
    flex-direction: column;
    height: auto;
    padding: 30px 0;
  }
`;

const ArrowWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 200;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  div {
    width: 80%;
    height: 100%;
  }
`;
const CarouselContainer = styled.div`
  width: 80%;
  padding: 20px;
  overflow: hidden;
  z-index: 0;

  @media screen and (max-width: 800px) {
    width: 100%;
  }
  .swiper-container {
    padding-bottom: 40px;
  }
  .swiper-pagination-bullet {
    background-color: #fff;
  }
`;
const ArorowImg = styled.img`
  z-index: 1000;
  width: 50px;
  margin: 20px;
  cursor: pointer;
`;
const NFTSlide = styled.div`
  z-index: ${(props) => props.index};
  height: 318px;
  width: 318px;
  box-shadow: 1px 1px 10px black;
  border-radius: 5px 5px 5px 5px;
  /* border: 3px solid white; */
  display: flex;
  justify-content: flex-start;
  margin: 0;
  align-items: center;
  overflow: hidden;
  /* background-color: rgb(227, 227, 227); */
  background-image: url(${(props) => props.backgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  .overlay {
    position: absolute;
    height: 318px;
    width: 318px;
    background: rgb(0, 0, 0);
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 00) 10%,
      rgba(0, 0, 0, 0.99) 100%
    );
  }
`;

const NFTInfoWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  z-index: 100;
  bottom: 30px;
  margin-left: 15px;
  p {
    color: white;
    margin-right: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* number of lines to show */
    line-clamp: 1;
    -webkit-box-orient: vertical;
    width: 90%;
  }

  .title {
    font-size: 22px;
    font-weight: 900;
    letter-spacing: 1.25px;
    color: #fff;
    width: 305px;
    margin: 0 auto;
  }

  .type {
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 0.6px;
    height: 15px;
    color: ${(props) => {
      if (props.position === 1) {
        return "#e08e00";
      } else if (props.position === 2) {
        return "#ff53b8";
      } else if (props.position === 3) {
        return "#a2caff";
      } else if (props.position === 4) {
        return "#e08e00";
      } else if (props.position === 5) {
        return "#5c973c";
      } else if (props.position === 6) {
        return "#a2caff";
      } else if (props.position === 7) {
        return "#e08e00";
      } else if (props.position === 8) {
        return "#ff53b8";
      } else if (props.position === 9) {
        return "#a2caff";
      } else if (props.position === 10) {
        return "#e08e00";
      } else if (props.position === 11) {
        return "#5c973c";
      } else if (props.position === 12) {
        return "#a2caff";
      } else if (props.position === 13) {
        return "#e08e00";
      }
    }};
  }

  .description {
    font-size: 10px;
    color: #fff;
  }
`;

const CTAWrapper = styled.div`
  left: 18%;
  bottom: 20px;
  background-image: linear-gradient(
    117deg,
    rgba(0, 0, 0, 0.61) 31%,
    rgba(0, 0, 0, 0.93) 87%
  );
  position: absolute;
  height: 117px;
  width: 400px;
  z-index: 120;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 800px) {
    width: 100%;
    left: 0;
    bottom: auto;
    position: initial;
  }

  p {
    color: #62f1ea;
    font-weight: 500;

    margin-left: 30px;
  }

  h2 {
    letter-spacing: 2.22px;
    color: #fff;
    font-style: italic;
    font-weight: 900;
    margin-bottom: 5px;
    margin-left: 30px;
  }

  .pinkBannerWrapper {
    position: absolute;
    z-index: 200;
    bottom: 119px;
    left: -5px;

    @media screen and (max-width: 800px) {
      bottom: 140px;
    }

    p {
      color: white;
      letter-spacing: 1.5px;

      font-weight: 500;
      font-size: 11px;
      margin-left: 10px;
      margin-bottom: 0;
      margin-top: 2px;
    }
  }
  img {
    width: 130px;
    position: absolute;
    z-index: -1;
    /* bottom: 112px;
    left: -5px; */
  }
`;
