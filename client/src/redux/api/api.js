import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["Chat", "User"], // Chat: caching chat data

  endpoints: (builder) => ({
    //Fetch My chats
    myChats: builder.query({
      query: () => ({
        url: "chat/my",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),


    //Search User
    searchUser: builder.query({
      query: (name) => ({
        url: `user/search?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),


    //Sending Chat Request
    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/sendrequest",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    //Get Notifications 
    getNotifications: builder.query({
      query: () => ({
        url: `user/notifications`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0, //No caching for notification
    }),

    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/acceptrequest",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Chat"], //User who accept the request his chat need to refetch
    }),

  })
})
export default api;


export const {
  useMyChatsQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useGetNotificationsQuery,
  useAcceptFriendRequestMutation
} = api;