import io from 'socket.io-client';
import { apiSlice } from '../api/apiSlice';
export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (id) =>
        `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_MESSAGES_PER_PAGE}`,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // create socket
        const socket = io('https://chat-application-rtkq.herokuapp.com', {
          reconnectionDelay: 1000,
          reconnection: true,
          reconnectionAttemps: 10,
          transports: ['websocket'],
          agent: false,
          upgrade: false,
          rejectUnauthorized: false,
        });

        try {
          await cacheDataLoaded;
          socket.on('message', (data) => {
            console.log(data.data);
            // console.log(data);
            updateCachedData((draft) => {
              console.log(JSON.stringify(draft));
              const message = draft.find((m) => m.id == data?.data?.id);
              if (message) {
                message.message = data?.data.message;
                message.timestamp = data?.data.timestamp;
              } else {
                draft.push(data?.data);
              }
            });
          });
        } catch (err) {
          await cacheEntryRemoved;
          socket.close();
        }
      },
    }),

    // // get  more
    // getMoreMessages: builder.query({
    //   query: (id, page) =>
    //     `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=${page}&_limit=${process.env.REACT_APP_MESSAGES_PER_PAGE}`,
    //   async onQueryStarted({ id, page }, { queryFulfilled, dispatch }) {
    //     try {
    //       const messages = await queryFulfilled;
    //       if (messages?.length > 0) {
    //         // update messages cache pessimistically start
    //         dispatch(
    //           apiSlice.util.updateQueryData(
    //             'getMessages',
    //             id,

    //             (draft) => {
    //               return [...draft, ...messages];
    //             }
    //           )
    //         );
    //       }
    //     } catch (err) {}
    //   },
    // }),

    //
    addMessage: builder.mutation({
      query: (data) => ({
        url: '/messages',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGetMessagesQuery, useAddMessageMutation } = messagesApi;
