/**
 * Created by Dan_Shappir on 7/19/15.
 */
(function () {
    'use strict';

    var chatClient = new ChatClient(location.host);
    chatClient.login('Dan');

    class Input extends React.Component {
        constructor(props) {
            super(props);
        }
        _send() {
            var textarea = React.findDOMNode(this.refs.input);
            this.props.chatClient.send(textarea.value);
        }
        render() {
            return <div>
                <textarea ref='input'/>
                <button onClick={this._send.bind(this)}>Send</button>
            </div>;
        }
    }

    class Output extends React.Component {
        constructor(props) {
            super(props);
            this.state = {last: ''};
        }
        componentDidMount() {
            this.props.chatClient.onMessage = (from, message) => this.setState({last: message});
        }
        render() {
            return <textarea value={this.state.last} disabled='true'/>;
        }
    }

    var root = document.getElementById('root');
    React.render(<div>
        <Input chatClient={chatClient}/>
        <br/>
        <Output chatClient={chatClient}/>
    </div>, root);
})();
