import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { sampleUsers } from '../../constants/sampleData';
import UserItem from '../shared/UserItem';
import { bgreen,bgreen2 } from '../../constants/color';

const NewGroup = () => {

  const [groupName, setGroupName] = useState("");
  const [members, setMemebers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);


  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  }
  console.log(selectedMembers);



  const submitHandler = () => { }

  const closeHandler=()=>{

  }

  return (
    <Dialog open onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>

        <DialogTitle textAlign={"center"} variant="h4">
          New Group
        </DialogTitle>

        <TextField
          label="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <Typography variant="body1">Members</Typography>

        <Stack>
          {members.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={selectMemberHandler}
              isAdded={selectedMembers.includes(i._id)}
            />
          ))}
        </Stack>


        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button
            variant="outlined"
            color="error"
            size="large"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={submitHandler}
            sx={{
              bgcolor: bgreen2,
              "&:hover": {
                bgcolor:  bgreen,
              },
            }}

          >
            Create
          </Button>
        </Stack>


      </Stack>
    </Dialog>
  )
}

export default NewGroup
