import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import { Navbar, Nav } from 'react-bootstrap';

import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';

class Auditpage extends React.Component {

    state = {
        timeFormat: "12hr",
        searchtext: '',
        useritems: [],
        search: false,
        searchitems: []
    }

    handleTimeFormatChange = (x) => {
        // console.log("format changed", x)
        this.setState({ timeFormat: x })
    }
    convertDate = (date) => {
        date = new Date(date);
        let datestr = date.toLocaleDateString()
        let hrs = date.getHours()
        let min = date.getMinutes()
        let sec = date.getSeconds()
        if (this.state.timeFormat === "24hr") {
            let time = hrs + ":" + min + ":" + sec
            return datestr + ' ' + time
        }
        else {
            <input
                value={this.state.searchtext}
                placeholder="Search by Name"
                onChange={e => this.onSearchChangeHandler(e.target.value)}>
            </input>
            let time = (hrs % 12 || 12) + ":" + min + ":" + sec + " " + (hrs >= 12 ? "PM" : "AM")
            return datestr + ' ' + time
        }
    }
    onSearchChangeHandler = (x) => {
        this.setState({ searchtext: x });
    }
    componentDidMount() {
        this.props.getUsers();
        // this.setState({useritems:this.props.users.items})
    }

    handleDeleteUser(id) {
        return (e) => this.props.deleteUser(id);
    }

    render() {
        const { user, users } = this.props;
        let useritems = []
        if (this.state.searchtext) {
            let s = this.state.searchtext
            useritems = this.props.users.items.filter(x => x.firstName.toLowerCase().includes(s) || x.lastName.toLowerCase().includes(s))
            // console.log("lenght=======",useritems )
        } else {
            useritems = this.props.users.items
            // console.log("lenght=======",useritems)
        }
        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand ></Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link ><Link to="/home">Home</Link></Nav.Link>
                        <Nav.Link href="#features">Auditor</Nav.Link>
                        <Nav.Link> <Link to="/login">Logout</Link></Nav.Link>
                    </Nav>
                </Navbar>
                <div className="col-md-6 col-md-offset-3">

                    <h1>Hi {user.firstName}!</h1>
                    <p>You're logged in with React!!</p>
                    <h3>All login audit :</h3>
                </div>
                <div>
                    <form style={{ marginBottom: "15px", marginTop: "15px" }}>
                        <input style={{ marginLeft: "30px", marginRight: "30px" }}
                            value={this.state.searchtext}
                            placeholder="Search by Name"
                            onChange={e => this.onSearchChangeHandler(e.target.value)}>
                        </input>
                        <label for='time-format'>choose time format: </label>
                        <select name="time-format" onChange={e => this.handleTimeFormatChange(e.target.value)}>
                            <option value="12hr"> 12 Hr</option>
                            <option value="24hr"> 24 Hr</option>
                        </select>
                    </form>
                    {users.items && <ReactTable style={{ width: '100%' }}
                        columns={[
                            { Header: "ID", Cell: x => { return x.original.id } },
                            { Header: "Role", Cell: x => { return x.original.role } },
                            {
                                Header: "Created Date", Cell: x => {
                                    // console.log("created date", x.original.createdDate)
                                    let date = this.convertDate(x.original.createdDate)
                                    return date
                                }
                            },
                            {
                                id: 0,
                                Header: "Name",
                                Cell: (x) => {
                                    return x.original.firstName + ' ' + x.original.lastName
                                }
                            },
                            {
                                Header: "Action",
                                Cell: user => {
                                    user = user.original
                                    return user.deleting ? <em> - Deleting...</em>
                                        : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
                                            : <span> - <a onClick={this.handleDeleteUser(user.id)}>Delete</a></span>
                                }
                            }
                        ]}
                        defaultPageSize={10}
                        data={useritems}
                    // filterable
                    // defaultFilterMethod={(filter, row,column) =>
                    //     // console.log("filtering",filter, row._original, column)
                    //     String(row._original[column.Header]).toLowerCase().includes(filter.value)}
                    ></ReactTable>}
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return { user, users };
}

const actionCreators = {
    getUsers: userActions.getAll,
    deleteUser: userActions.delete
}

const connectedAuditPage = connect(mapState, actionCreators)(Auditpage);
export { connectedAuditPage as Auditpage };