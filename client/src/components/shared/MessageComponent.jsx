import React, { memo } from 'react'
import { Box, Typography } from "@mui/material";
import { ngreen } from '../../constants/color';
import moment from "moment";

import { fileFormat } from "../../lib/features";
import RenderAttachment from './RenderAttachment';


const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;

  //user is sending message
  const sameSender = sender?._id === user?._id;

  const timeAgo = moment(createdAt).fromNow();
  return (
    <div
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "white",
        color: "black",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "fit-content",
      }}
    >
      {!sameSender && (
        <Typography color={ngreen} fontWeight={"600"} variant="caption">
          {sender.name}
        </Typography>
      )}

      {content && <Typography>{content}</Typography>}

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {

          const url = attachment.url;  //file/attachment url
          const file = fileFormat(url);  //file/attachment extension

          return (
            <Box key={index}>
            {/* <a> tag because wanted to open the link in new tab */}
              <a
                href={url}
                target="_blank"
                download
                style={{
                  color: "black",
                }}
              >
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })}



      <Typography variant="caption" color={"text.secondary"}>
        {timeAgo}
      </Typography>
    </div>
  )
}

export default memo(MessageComponent);
