/**
 * Created by Dan_Shappir on 7/19/15.
 */
(function () {
    'use strict';

    const Output = ({msgs}) =>
        <div className='output'>{
            msgs.map(({from, msg}) => <div><b>{from.name}:</b> {msg}</div>)
        }</div>;
    Output.displayName = 'Output';

    class Input extends React.Component {
        _send() {
            const textarea = ReactDOM.findDOMNode(this.refs.input);
            this.props.send(textarea.value);
        }
        render() {
            return <div className='input'>
                <textarea ref='input'/>
                <button onClick={this._send.bind(this)}>Send</button>
            </div>;
        }
    }
    Input.displayName = 'Input';

    const Chat = ({msgs, send}) =>
        <div className='chat'>
            <Output msgs={msgs}/>
            <Input send={send}/>
        </div>;
    Chat.displayName = 'Chat';

    function chat(server, username, root) {
        const chat = new ChatClient(server);

        let msgs = [];

        const render = () => ReactDOM.render(<Chat msgs={msgs} send={chat.send}/>, root);

        chat.onConnect = () => {
            chat.login(username);
            render();
        };
        chat.onMessage = (from, msg) => {
            msgs.push({from, msg});
            render();
        };
    }

    const root = document.getElementById('root');
    chat('http://localhost', 'Dan', root);
}());
