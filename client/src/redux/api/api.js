import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
    tagTypes: ["Chat"], // Chat: caching chat data
  
    endpoints: (builder) => ({
      myChats: builder.query({
        query: () => ({
          url: "chat/my",
          credentials: "include",
        }),
        providesTags: ["Chat"],
      }),
      invalidateTags:["Chat"]  // chat cache will be refeching data
    })    
})
export default api;


export const {useMyChatsQuery}=api;