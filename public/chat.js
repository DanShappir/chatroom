/**
 * Created by Dan_Shappir on 7/19/15.
 */
(function () {
    'use strict';

    const render = (msgs, {send}, root) => ReactDOM.render(<Chat msgs={msgs} send={send}/>, root);

    const Chat = ({msgs, send}) => (
        <div className='chat'>
            <Output msgs={msgs}/>
            <Input send={send}/>
        </div>
    );

    const Output = ({msgs}) => (
        <div className='output'>{
            msgs.map(({from, msg}, i) => <OutputItem key={i} name={from.name} msg={msg}/>)
        }</div>
    );

    const OutputItem = ({name, msg}) => <div><b>{name}:</b> {msg}</div>

    const Input = ({send}) => {
        let textarea;
        const _send = () => {
            const {value} = textarea;
            textarea.value = '';
            send(value);
        };
        return (
            <div className='input'>
                <textarea ref={elem => textarea = elem}/>
                <button onClick={_send}>Send</button>
            </div>
        );
    };

    const root = document.getElementById('root');
    const msgs = [];
    const chatClient = new ChatClient(location.href);
    chatClient.onConnect = () => {
        chatClient.login('Dan');
        render(msgs, chatClient, root);
    };
    chatClient.onMessage = (from, msg) => {
        msgs.push({from, msg});
        render(msgs, chatClient, root);
    };
}());
