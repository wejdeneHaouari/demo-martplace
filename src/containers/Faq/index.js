import React from 'react';
import './index.css';
import Faq from 'react-faq-component';
import HeaderBanner from '../../components/BalloonHeader/HeaderBanner';
import Footer from '../../components/Common/Footer/Footer';
import Header from '../../components/Header';

const data = {
  rows: [
    {
      title: "Why are the balloon ascensions at such unusual times?",
      content:
        "It is safest to launch hot air balloons when the surface winds are less than 6-8 mph. As the sun heats up the atmosphere, it creates breezes, otherwise known as “thermals.” Therefore, the best time to launch the balloons is while the air is still cool (shortly after sunrise or about an-hour-and-a-half before sunset).",
    },
    {
      title: "How do I get to the festival using public transportation?",
      content:
        "The Festival is held at Solberg Airport in Hunterdon County, NJ. Unfortunately, this beautiful rural setting is not accessible via mass transportation. We encourage carpooling with family and friends.",
    },
    {
      title: "Can I bring a tent and/or an umbrella?",
      content:
        "Tents are not allowed. Umbrellas are allowed but we would like you to be wary of your neighbors, please don’t block their view. If our staff sees that you are blocking other people’s view during the ascensions, we reserve the right to ask you to take it down for that time period or move you to the side away from the crowd so everyone can have a great view of the balloons or other events that might be going on around you.",
    },
    {
      title: "Is the festival handicap accessible?",
      content:
        "As with all special events and festivals, The New Jersey Festival of Ballooning reserves areas closest to the festival admission gates for vehicles displaying the proper handicapped parking tags. (Please make sure these tags are clearly visible, so police and parking personnel can direct you to the proper parking area).",
    },
    {
      title:
        "What is the difference between Digital Art, Digital Art with Experience, and Digital Art with  Merchandise?  ",
      content:
        "<strong>Digital Art</strong> :A limited-edition digital collectible NFT that reflects the adventurous spirit of our community. <br> " +
        "<strong>Digital Art with Experience </strong> : A limited-edition digital collectible NFT that provides all the features of a Digital Art NFT and also comes with a pass to the hot balloon ride experience.  <br> " +
        "<strong>Digital Art with Merchandise </strong>  :A limited-edition digital collectible NFT that provides all the features of a Digital Art NFT and also comes with physical merchandise to redeem. <br> ",
    },
    {
      title: "How can we ride a balloon?",
      content:
        "After purchasing the NFT you will receive an email with instructions to redeem the pass for a hot balloon ride at the 39th annual New Jersey Lottery Festival of Ballooning on July 29-31 2022. Your Hot air Balloon ride is valid for one of five mass ascensions. For details on the rides visit our site <a style=‘color: blue;’ href='https://balloonfestival.com/balloons/balloon-rides/' target='_blank'>https://balloonfestival.com/balloons/balloon-rides</a>",
    },
    {
      title: "How do I redeem my general admission tickets ?",
      content:
        "After purchasing the NFT you will receive an email with instructions to redeem your passes for a pair of general admission tickets at the 39th annual New Jersey Lottery Festival of Ballooning on July 29-31 2022. Your general admission tickets are valid for one of three days. For more details visit <a style=‘color: blue;’ href='https://balloonfestival.com' target='_blank'>https://balloonfestival.com</a>",
    },
    {
      title: "How to access the metaverse?",
      content:
        "Metaverse development is in progress. Once it is developed the NFT holders will receive instructions to access the Metaverse experience. ",
    },
    {
      title: "How can I sell my NFTs in other marketplaces?",
      content:
        "You will be able to sell these NFTs on the Open sea. Export your private keys to get possession of your wallet. Then connect your wallet with OpenSea to list the NFTs for sale.",
    },
    {
      title: "How to take possession of the NFT that the user purchased?",
      content:
        "You can export the private keys of your wallet from the settings page. ",
    },
    {
      title: "Am I allowed to transfer NFT to other people?",
      content:
        "Yes, you will be able to transfer the NFT to other people.  however, the experience and the merchandise associated with NFT can only be redeemed by the original buyer and cannot be transferred. ",
    },
    {
      title: "Are these NFTs are refundable?",
      content:
        "Once an NFT has been traded on the secondary market, it's no longer refundable.",
    },
    {
      title: " I have forgotten the password what should I do?",
      content:
        "Click on Reset Button at the time of login then you will get an email link to reset your new password.",
    },
    {
      title: "Can I receive a refund for my NFTs?",
      content:
        "NFT once purchased can not be refunded due to the immutable nature of the blockchain.",
    },
    {
      title: "I have purchased the NFT but did not show in my collection?",
      content:
        " It happens because of the following reasons : <br>" +
        "1. Your crypto wallet is not connected correctly <br>" +
        "2. The transaction is delayed <br>" +
        "3. Your NFT was delisted from our platform <br>",
    },
    {
      title: "Who do I contact for help?",
      content:
        "There is a Contact Us form in the footer section and also join the discord to know more support.",
    },
    {
      title: "How long to get merchandise?",
      content: "It takes 30-60 business days ",
    },
  ],
};



const FaqPage = () => {
  return (
    <>
      <Header />
      <HeaderBanner type='Frequently Asked Questions' />
      <div className='faq__ctn'>
        <Faq data={data} />
      </div>
      <Footer />
    </>
  );
};
export default FaqPage;
