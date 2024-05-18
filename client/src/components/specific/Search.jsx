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
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/reducers/misc";
import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../../redux/api/api";
import { useAsyncMutation } from '../../hooks/hook';


const Search = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const { isSearch } = useSelector((state) => state.misc);

  const [searchUser] = useLazySearchUserQuery();

  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  //Send Chat Request
  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  //Close search Dialog
  const searchCloseHandler = () => dispatch(setIsSearch(false));

  //Search user
  useEffect(() => {
    if (search !== "") {
      const timeOutId = setTimeout(() => {
        searchUser(search)
          .then(({ data }) => setUsers(data.users))
          .catch((e) => console.log(e));
      }, 500);

      return () => {
        clearTimeout(timeOutId);
      };
    }

  }, [search]);

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"18rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          size="small"
          color='success'
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <List>
          {users.map((i) => (
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
