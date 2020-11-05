import React from 'react';
import { Route, Redirect } from 'react-router-dom';

console.log("locally stored user,", localStorage.getItem('user'))

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('user')
            ? JSON.parse(localStorage.getItem('user')).role === "Auditor"
                ? <Redirect to={{ pathname: '/Audit' }} />
                : <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)
