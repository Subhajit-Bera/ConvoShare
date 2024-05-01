import React, { useEffect, useState } from 'react'
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import UserItem from '../shared/UserItem';
import { sampleUsers } from '../../constants/sampleData';

const Search = () => {
  const [search, setSearch] = useState();

  let isLoadingSendFriendRequest=false;

  const [users,setUsers]=useState(sampleUsers);

  const addFriendHandler=(id)=>{
    console.log(id);
  }
  return (
    <Dialog open>
      <Stack p={"2rem"} direction={"column"} width={"18rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <List>
          {users.map((i)=>(
            <UserItem
              user={i}
              key={i._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
             />
          ))}

        </List>
      </Stack>
    </Dialog>
  )
}

export default Search
