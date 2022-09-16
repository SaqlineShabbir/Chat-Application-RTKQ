import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import Message from './Message';

export default function Messages({ messages = [] }) {
  const { user } = useSelector((state) => state.auth) || {};
  const { email } = user || {};
  let uniqueMessages = messages.reduce((unique, o) => {
    if (!unique.some((message) => message.id == o.id)) {
      unique.push(o);
    }
    return unique;
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh_-_197px)] p-6  flex flex-col-reverse">
      <ul className="space-y-2">
        <InfiniteScroll
          dataLength={messages?.length}
          next={() => console.log('fetching')}
          //To put endMessage and loader to the top.
          //
          hasMore={true}
          loader={<h4>Loading...</h4>}
          scrollableTarget="scrollableDiv"
          height={window.innerHeight - 197}
        >
          {uniqueMessages
            .slice()
            .sort((a, b) => a.timestamp - b.timestamp)
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
