// import { css } from "@emotion/styled";
import React from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

import styled from "@emotion/styled";

const Box = styled("div")(({ stl }) => stl);

export default Box;

const ICON_DEFAULTS = {
  round: true,
  size: 30,
};

export const Share = ({ url, message, hashtags, styl }) => {
  const fb = {
    url: url,
    quote: message,
    hashtag: hashtags[0],
  };
  return (
    <div className="shareClass">
      <h3>Share:</h3>
      <FacebookShareButton url={url} quote={message} hashtag={hashtags[0]}>
        <FacebookIcon {...ICON_DEFAULTS} />
      </FacebookShareButton>
      <WhatsappShareButton url={url} title={message}>
        <WhatsappIcon {...ICON_DEFAULTS} />
      </WhatsappShareButton>
      <TwitterShareButton url={url} title={message} hashtags={hashtags}>
        <TwitterIcon {...ICON_DEFAULTS} />
      </TwitterShareButton>
    </div>
  );
};
