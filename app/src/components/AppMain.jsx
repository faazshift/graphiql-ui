let React = require('react');
let GraphiQL = require('graphiql');

let MaterialUI = require('material-ui');
let MaterialStyles = require('material-ui/styles');
let injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

let StorageHelper = require('../helpers/StorageHelper');

// GraphiQL isolation wrapper component
class GraphiQLWrapper extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            props: props
        };
    }

    componentWillReceiveProps(nextProps) {
        // Do nothing, since we presently never update props
    }

    render() {
        return (<GraphiQL {...this.state.props} />);
    }
}

module.exports = class AppMain extends React.Component {
    constructor(props) {
        super(props);

        this.storage = new StorageHelper('main');

        this.state = {
            url: this.storage.get('url') || '',
            method: this.storage.get('method') || 'post',
        };
    }

    _fetch(params) {
        let url = this.state.url;
        let fetchOpts = {
            method: this.state.method
        };

        if(this.state.method == 'get') {
            let getParams = [];
            for(let param in params) {
                if(params.hasOwnProperty(param)) {
                    getParams.push(`${param}=${(encodeURIComponent(JSON.stringify(params[param])))}`);
                }
            }
            if(getParams.length > 0) {
                url = `${url}?${(getParams.join('&'))}`;
            }
        } else {
            fetchOpts.headers = {'Content-Type': 'application/json'};
            fetchOpts.body = JSON.stringify(params);
        }

        return window.fetch(url, fetchOpts).then(response => response.json()).catch((err) => {
            return 'Error! Please check the URL and try again!';
        });
    }

    handleURLChange(ev, text) {
        this.storage.set('url', text);
        this.setState({url: text});
    }

    handleMethodChange(ev, index, value) {
        this.storage.set('method', value);
        this.setState({method: value});
    }

    render() {
        let methodOpts = [
            {label: 'POST', value: 'post'},
            {label: 'GET', value: 'get'},
        ].map((o, idx) => {
            return (
                <MaterialUI.MenuItem key={`${idx}:${o.value}`} value={o.value} primaryText={o.label}  />
            );
        });

        return (
            <div className="app">
                <div className="app-head">
                    <div className="app-head-left">
                        <div className="url">
                            <MaterialStyles.MuiThemeProvider>
                                <MaterialUI.TextField
                                    ref={(el) => { this.refURL = el; }}
                                    floatingLabelText="GraphQL URL"
                                    fullWidth={true}
                                    value={this.state.url}
                                    onChange={this.handleURLChange.bind(this)}
                                />
                            </MaterialStyles.MuiThemeProvider>
                        </div>
                    </div>
                    <div className="app-head-right">
                        <div className="method">
                            <MaterialStyles.MuiThemeProvider>
                                <MaterialUI.SelectField
                                    ref={(el) => { this.refMethod = el; }}
                                    floatingLabelText="Method"
                                    value={this.state.method}
                                    onChange={this.handleMethodChange.bind(this)}
                                >
                                    {methodOpts}
                                </MaterialUI.SelectField>
                            </MaterialStyles.MuiThemeProvider>
                        </div>
                    </div>
                </div>
                <div className="app-graphiql">
                    <GraphiQLWrapper fetcher={this._fetch.bind(this)} />
                </div>
            </div>
        );
    }
}