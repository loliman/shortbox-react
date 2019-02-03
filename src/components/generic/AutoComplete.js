import React from 'react';
import Autosuggest from 'react-autosuggest';
import {fieldToTextField} from 'formik-material-ui';
import {Field} from "formik";
import Paper from "@material-ui/core/Paper/Paper";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import TextField from "@material-ui/core/TextField/TextField";
import {Query} from "react-apollo";
import QueryResult from "./QueryResult";

const theme = {
    container: {
        position: 'relative',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 1,
        left: 0,
        right: 0,
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    suggestion: {
        display: 'block',
    },
};

function AutoComplete(props) {
    const {query, variables, ...rest} = props;

    return (
        <Query query={query}
           variables={variables}>
            {({loading, error, data}) => {
                if (loading || error)
                    return <QueryResult loading={loading} error={error} />;

                return <AutoCompleteContainer
                    suggestions={data[query.definitions[0].name.value.toLowerCase()]}
                    {...rest}
                />
            }}
        </Query>
    );
}

class AutoCompleteContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: "",
            suggestions: []
        }
    }

    render() {
        return (
            <div>
                <Autosuggest
                       suggestions={this.state.suggestions}
                       onSuggestionSelected={(_, {suggestionValue}) => {
                           this.props.onChange(this.props.name, suggestionValue);
                       }}
                       onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                       onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                       getSuggestionValue={(suggestion) => suggestion[this.props.suggestionLabel]}
                       renderSuggestion={this.renderSuggestion}
                       inputProps={{
                           value: this.state.search,
                           onChange: this.handleChange('search'),
                       }}
                       theme={theme}
                       renderInputComponent={(inputProps) => {
                           const {inputRef = () => {}, ref, value, ...other} = inputProps;
                           const {error, id, label, name, onBlur, type} = this.props;

                           return (
                               <Field
                                   InputProps={{
                                       inputRef: node => {
                                           ref(node);
                                           inputRef(node);
                                       }
                                   }}
                                   className="fieldSmall"
                                   component={AutoCompleteTextField}
                                   {...other}
                                   error={error}
                                   id={id}
                                   label={label}
                                   name={name}
                                   onBlur={onBlur}
                                   type={type}
                                   value={value}
                               />
                           );
                       }}
                       renderSuggestionsContainer={(options) => (
                           <Paper {...options.containerProps} square className="suggestionContainer">
                               {options.children}
                           </Paper>
                       )}
                   />
            </div>
        );
    }

    handleSuggestionsFetchRequested = ({value}) => {
        this.setState({
            suggestions: this.getSuggestions(value),
        });
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    };

    handleChange = () => (event, { newValue }) => {
        this.setState({
            search: newValue,
        });
    };

    getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();

        return inputValue.length === 0 ? [] :
            this.props.suggestions.filter(suggestion => {
                return suggestion[this.props.suggestionLabel].toLowerCase().indexOf(inputValue) !== -1;
            });
    };

    renderSuggestion = (suggestion, { query, isHighlighted }) => {
        return (
            <MenuItem selected={isHighlighted} component="div">
                <div className="suggestionItem">
                    <span>{suggestion[this.props.suggestionLabel]}</span>
                </div>
            </MenuItem>
        );
    }
}

function AutoCompleteTextField(props) {

    return(
        <TextField
            {...fieldToTextField(props)}
            onChange={event => {
                props.onChange(event);
                props.form.setFieldValue(props.field.name, event.target.value);
            }}
        />
    );
}

export default AutoComplete;