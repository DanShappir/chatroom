/**
 * Created by Dan_Shappir on 7/19/15.
 */
(function () {
    'use strict';

    const render = (msgs, chatClient, root) => ReactDOM.render(<Chat msgs={msgs} send={chatClient.send}/>, root);

    const Chat = ({msgs, send}) =>
        <div className='chat'>
            <Output msgs={msgs}/>
            <Input send={send}/>
        </div>;
    Chat.displayName = 'Chat';

    const Output = ({msgs}) =>
        <div className='output'>{
            msgs.map(({from, msg}, i) => <OutputItem key={i} name={from.name} msg={msg}/>)
            }</div>;
    Output.displayName = 'Output';

    const OutputItem = ({name, msg}) => <div><b>{name}:</b> {msg}</div>
    OutputItem.displayName = 'OutputItem';

    class Input extends React.Component {
        _send() {
            const textarea = this.refs.input;
            const {value} = textarea;
            textarea.value = '';
            this.props.send(value);
        }
        render() {
            return <div className='input'>
                <textarea ref='input'/>
                <button onClick={this._send.bind(this)}>Send</button>
            </div>;
        }
    }
    Input.displayName = 'Input';

    const root = document.getElementById('root');
    const msgs = [];
    const chatClient = new ChatClient('http://localhost');
    chatClient.onConnect = () => {
        chatClient.login('Dan');
        render(msgs, chatClient, root);
    };
    chatClient.onMessage = (from, msg) => {
        msgs.push({from, msg});
        render(msgs, chatClient, root);
    };
}());
