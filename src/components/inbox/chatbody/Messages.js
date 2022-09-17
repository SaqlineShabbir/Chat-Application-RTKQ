import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { messagesApi } from '../../../features/messages/messagesApi';
import Message from './Message';

export default function Messages({ messages = [], totalCount, id }) {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const fetchMore = () => {
    setPage((prevPage) => prevPage + 1);
  };
  useEffect(() => {
    if (page > 1) {
      dispatch(messagesApi.endpoints.getMoreMessages.initiate({ id, page }));
    }
  }, [page, id, dispatch]);
  useEffect(() => {
    if (totalCount > 0) {
      const more =
        Math.ceil(
          totalCount / Number(process.env.REACT_APP_MESSAGES_PER_PAGE)
        ) > page;
      setHasMore(more);
      console.log(page);
    }
  }, [totalCount, page]);
  console.log(page);
  const { user } = useSelector((state) => state.auth) || {};
  const { email } = user || {};
  let uniqueMessages = messages.reduce((unique, o) => {
    if (!unique.some((message) => message.id == o.id)) {
      unique.push(o);
    }
    return unique;
  }, []);
  console.log(totalCount, 'frommessa');
  return (
    <div className="relative w-full h-[calc(100vh_-_197px)] p-6  flex flex-col-reverse">
      <ul className="space-y-2">
        <InfiniteScroll
          style={{
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column-reverse',
          }}
          dataLength={uniqueMessages?.length}
          next={fetchMore}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          scrollableTarget="scrollableDiv"
          height={window.innerHeight - 220}
        >
          {uniqueMessages
            .slice()
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((message) => {
              const { message: lastMessage, id, sender } = message || {};

              const justify = sender.email !== email ? 'start' : 'end';

              return (
                <Message key={id} justify={justify} message={lastMessage} />
              );
            })}
        </InfiniteScroll>
      </ul>
    </div>
  );
}
