import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from "apollo-client";
import './index.css';
import App from './components/App'
import {ApolloProvider} from "react-apollo";
import CookiesProvider from "react-cookie/cjs/CookiesProvider";
import {Cookies} from 'react-cookie'
import {SnackbarProvider} from 'notistack';
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from 'apollo-cache-inmemory';
import {setContext} from 'apollo-link-context';
import {BrowserRouter, Route} from "react-router-dom";
import {ScrollContext} from 'react-router-scroll-4';

const httpLink = createHttpLink({
    uri: 'https://localhost:4000/graphql',
});

const authLink = setContext((_, {headers}) => {
    let cookies = new Cookies();

    let token;
    let session = cookies.get("session");
    if (session)
        token = cookies.get("session").id + ":" + cookies.get("session").sessionid;

    return {
        headers: {
            ...headers,
            authorization: token ? `${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

ReactDOM.render(
    <BrowserRouter>
        <ScrollContext>
            <SnackbarProvider maxSnack={3}
                              anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                              }}>
                <CookiesProvider>
                    <ApolloProvider client={client}>
                        <Route exact path="*" component={App}/>
                    </ApolloProvider>
                </CookiesProvider>
            </SnackbarProvider>
        </ScrollContext>
    </BrowserRouter>,
    document.getElementById('root')
);