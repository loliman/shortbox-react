import "@babel/polyfill";
import "isomorphic-fetch";
import 'core-js';
import 'raf/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from "apollo-client";
import './index.css';
import App from './components/App'
import {ApolloProvider} from "react-apollo";
import CookiesProvider from "react-cookie/cjs/CookiesProvider";
import {Cookies} from 'react-cookie'
import {SnackbarProvider} from 'notistack';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {setContext} from 'apollo-link-context';
import {BrowserRouter} from "react-router-dom";
import {ScrollContext} from 'react-router-scroll-4';
import {LastLocationProvider} from "react-router-last-location";
import Button from "@material-ui/core/Button/Button";
import {createUploadLink} from "apollo-upload-client";

const uploadLink = createUploadLink({
    uri: 'http://localhost:4000'
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
    link: authLink.concat(uploadLink),
    cache: new InMemoryCache()
});

//whyDidYouUpdate(React);

ReactDOM.render(
    <BrowserRouter>
        <LastLocationProvider>
            <ScrollContext>
                <SnackbarProvider maxSnack={3}
                                  action={[
                                      <Button key="hide" className="snackbarbtn" color="primary" size="small">
                                          Verbergen
                                      </Button>
                                  ]}>
                    <CookiesProvider>
                        <ApolloProvider client={client}>
                            <App />
                        </ApolloProvider>
                    </CookiesProvider>
                </SnackbarProvider>
            </ScrollContext>
        </LastLocationProvider>
    </BrowserRouter>,
    document.getElementById('root')
);