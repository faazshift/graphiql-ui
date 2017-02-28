let React = require('react');

let MaterialUI = require('material-ui');
let MaterialStyles = require('material-ui/styles');

module.exports = class HeaderModal extends React.Component {
    addHeader() {
        let headers = this.props.headers || [];
        headers.push({name: '', value: ''});
        this.props.onChange(headers);
    }

    editHeader(idx, key, ev, value) {
        console.log(idx, key, ev, value);
        let headers = this.props. headers || [];
        headers[idx][key] = value;
        this.props.onChange(headers);
    }

    deleteHeader(idx) {
        let headers = this.props.headers || [];
        headers.splice(idx, 1);
        this.props.onChange(headers);
    }

    render() {
        let actions = [
            <MaterialUI.RaisedButton
                label="Close"
                primary={true}
                onClick={this.props.onClose}
            />
        ];

        let col3Width = '100px';

        return (
            <MaterialStyles.MuiThemeProvider>
                <MaterialUI.Dialog
                    title="Custom HTTP Headers"
                    actions={actions}
                    modal={false}
                    open={this.props.show}
                    onRequestClose={this.props.onClose}
                    autoScrollBodyContent={true}
                >
                    <MaterialUI.Table
                        selectable={false}
                    >
                        <MaterialUI.TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <MaterialUI.TableRow>
                                <MaterialUI.TableHeaderColumn>Name</MaterialUI.TableHeaderColumn>
                                <MaterialUI.TableHeaderColumn>Value</MaterialUI.TableHeaderColumn>
                                <MaterialUI.TableHeaderColumn style={{width: col3Width}}></MaterialUI.TableHeaderColumn>
                            </MaterialUI.TableRow>
                        </MaterialUI.TableHeader>
                        <MaterialUI.TableBody displayRowCheckbox={false}>
                            {this.props.headers.map((header, idx) => {
                                return (
                                    <MaterialUI.TableRow>
                                        <MaterialUI.TableRowColumn>
                                            <MaterialUI.TextField
                                                fullWidth={true}
                                                value={header['name']}
                                                onChange={this.editHeader.bind(this, idx, 'name')}
                                            />
                                        </MaterialUI.TableRowColumn>
                                        <MaterialUI.TableRowColumn>
                                            <MaterialUI.TextField
                                                fullWidth={true}
                                                value={header['value']}
                                                onChange={this.editHeader.bind(this, idx, 'value')}
                                            />
                                        </MaterialUI.TableRowColumn>
                                        <MaterialUI.TableRowColumn style={{width: col3Width}}>
                                            <MaterialUI.RaisedButton
                                                label="Remove"
                                                onClick={this.deleteHeader.bind(this, idx)}
                                            />
                                        </MaterialUI.TableRowColumn>
                                    </MaterialUI.TableRow>
                                );
                            })}
                        </MaterialUI.TableBody>
                    </MaterialUI.Table>
                    <MaterialUI.FlatButton
                        label="Add Header"
                        primary={true}
                        onClick={this.addHeader.bind(this)}
                    />
                </MaterialUI.Dialog>
            </MaterialStyles.MuiThemeProvider>
        );
    }
}