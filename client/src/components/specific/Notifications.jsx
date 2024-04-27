import React, { memo } from 'react'
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { sampleNotifications } from '../../constants/sampleData';

const Notifications = () => {

  const friendRequestHandler = ({ _id, accept }) => {

  }

  return (
    <Dialog open>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Requests</DialogTitle>
        {
          sampleNotifications.length > 0 ? (
            sampleNotifications.map(({ sender, _id }) => (
              <NotificationItem
                sender={sender}
                _id={_id}
                handler={friendRequestHandler}
                key={_id}
              />
            ))

          ) : (

            <Typography textAlign={"center"}>0 Requests</Typography>
          )
        }
      </Stack>
    </Dialog>
  )
}

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        sx={{
          boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
          borderRadius: "20px 0px 0px 20px",
        }}
      >
        <Avatar />

        <Typography
          variant="body1"
          sx={{
            flexGlow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {`${name} sent you a friend request.`}
        </Typography>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
        >
          <Button onClick={() => handler({ _id, accept: true })}
            sx={{
              color: "#4CAF50", 
              "&:hover": {
                bgcolor: "#EBF3E8", 
              },
            }}

          >Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications
