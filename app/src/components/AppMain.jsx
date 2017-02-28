let React = require('react');
let GraphiQL = require('graphiql');

let MaterialUI = require('material-ui');
let MaterialStyles = require('material-ui/styles');
let injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

let StorageHelper = require('../helpers/StorageHelper');

let HeaderModal = require('./HeaderModal');

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

        let headers = [];
        let headersStr = this.storage.get('headers');
        if(headersStr !== null) {
            headers = JSON.parse(headersStr);
        }

        this.state = {
            showHeaderModal: false,
            url: this.storage.get('url') || '',
            method: this.storage.get('method') || 'post',
            headers: headers,
            status: 200
        };
    }

    _headerArrayToObject(headerArray = []) {
        let obj = {};
        headerArray.forEach((arrayObj) => {
            if(arrayObj !== null && 'name' in arrayObj && arrayObj['name'].length > 0) {
                obj[arrayObj['name'].toLowerCase()] = arrayObj['value'];
            }
        });

        return obj;
    }

    _fetch(params) {
        let url = this.state.url;
        let fetchOpts = {
            method: this.state.method,
            headers: Object.assign({
                'Accept': 'application/json',
            }, this._headerArrayToObject(this.state.headers)) // Mix in user supplied headers
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
            fetchOpts.headers['Content-Type'] = 'application/json';
            fetchOpts.body = JSON.stringify(params);
        }

        return window.fetch(url, fetchOpts).then((response) => {
            this.setState({status: response.status});
            return response.json().catch((err) => {
                throw "Not a JSON response! Do the URL and request method refer to a GraphQL endpoint?";
            });
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

    handleHeaderChange(headers = []) {
        this.storage.set('headers', JSON.stringify(headers));
        this.setState({headers: headers});
    }

    handleHeaderClear() {
        this.storage.set('headers', JSON.stringify([]));
        this.setState({headers: []});
    }

    toggleHeaderModal(value, ev) {
        this.setState({showHeaderModal: value});
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
                            <div className="headers">
                                <MaterialStyles.MuiThemeProvider>
                                    <MaterialUI.RaisedButton
                                        label={`Headers (${(this.state.headers.length)})`}
                                        primary={true}
                                        onClick={this.toggleHeaderModal.bind(this, true)}
                                    />
                                </MaterialStyles.MuiThemeProvider>
                                {' '}
                                <MaterialStyles.MuiThemeProvider>
                                    <MaterialUI.RaisedButton
                                        label="Clear"
                                        primary={true}
                                        onClick={this.handleHeaderClear.bind(this)}
                                    />
                                </MaterialStyles.MuiThemeProvider>
                            </div>
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
                        {/*<div className="status">{`HTTP Status: ${this.state.status}`}</div>*/}
                    </div>
                </div>
                <div className="app-graphiql">
                    <GraphiQLWrapper fetcher={this._fetch.bind(this)} />
                </div>
                <HeaderModal
                    show={this.state.showHeaderModal}
                    headers={this.state.headers}
                    onChange={this.handleHeaderChange.bind(this)}
                    onClose={this.toggleHeaderModal.bind(this, false)}
                />
            </div>
        );
    }
}