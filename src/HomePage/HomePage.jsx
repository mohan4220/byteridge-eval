import React from 'react';
import { Auditpage } from '../Audit';
import { history } from '../_helpers';
import { Router, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import './Homepage.css';
import { Navbar, Nav, Table } from 'react-bootstrap';

import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';

class HomePage extends React.Component {

    state = {
        searchtext: ''
    }
    constructor(props) {
        super(props);

        history.listen((location, action) => {
            // clear alert on location change
            this.props.clearAlerts();
        });
    }

    componentDidMount() {
        this.props.getUsers();
    }

    onSearchChangeHandler = (x) => {
        this.setState({ searchtext: x });
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
                        {/* <Nav.Link ><Link to="/">Home</Link></Nav.Link> */}
                        <Nav.Link ><Link to="/home">Home</Link></Nav.Link>
                        <Nav.Link ><Link to="/Audit">Auditor</Link></Nav.Link>
                        <Nav.Link> <Link to="/login">Logout</Link></Nav.Link>
                    </Nav>
                </Navbar>
                <div className="col-md-6 col-md-offset-3">
                    <h1>Hi {user.firstName}!</h1>
                    <p>You're logged in with React!!</p>
                    <h3>All registered users:</h3>
                    <div>
                        <form style={{ marginBottom: "15px", marginTop: "15px" }}>
                            <input style={{ marginLeft: "30px", marginRight: "30px" }}
                                value={this.state.searchtext}
                                placeholder="Search by Name"
                                onChange={e => this.onSearchChangeHandler(e.target.value)}>
                            </input>
                        </form>
                        {users.items && <ReactTable
                            columns={[
                                {
                                    Header: "Name",
                                    Cell: (x, index) => {
                                        console.log(x.original)

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
                        ></ReactTable>}
                    </div>
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

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export { connectedHomePage as HomePage };