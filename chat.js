/**
 * Created by Dan_Shappir on 7/19/15.
 */
(function () {
    'use strict';

    class Output extends React.Component {
        render() {
            return <div className='output'>{
                this.props.msgs.map(({from, message}) => <div><b>{from.name}:</b> {message}</div>)
            }</div>;
        }
    }

    class Input extends React.Component {
        _send() {
            var textarea = React.findDOMNode(this.refs.input);
            this.props.send(textarea.value);
        }
        render() {
            return <div className='input'>
                <textarea ref='input'/>
                <button onClick={this._send.bind(this)}>Send</button>
            </div>;
        }
    }

    class Chat extends React.Component {
        render() {
            return <div className='chat'>
                <Output msgs={this.props.msgs}/>
                <Input send={this.props.send}/>
            </div>;
        }
    }

    function chat(server, username, root) {
        var msgs = [];

        function render() {
            React.render(<Chat msgs={msgs} send={send}/>, root);
        }

        const chat = new ChatClient(server);
        const send = chat.send.bind(chat);
        chat.onConnect = function () {
            chat.login(username);
            render();
        };
        chat.onMessage = function (from, message) {
            msgs.push({from, message});
            render();
        };
    }

    const root = document.getElementById('root');
    chat(location.host, 'Dan', root);
}());
