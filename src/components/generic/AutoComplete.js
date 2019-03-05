import React from 'react';
import Autosuggest from 'react-autosuggest';
import {fieldToTextField} from 'formik-material-ui';
import {Field} from "formik";
import Paper from "@material-ui/core/Paper/Paper";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import TextField from "@material-ui/core/TextField/TextField";
import {Query} from "react-apollo";
import {generateLabel} from "../../util/hierarchy";

const theme = {
    container: {
        display: 'inline-block',
        position: 'relative',
        marginRight: 6 + 'px',
        width: 100 + '%'
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 1,
        left: 0,
        right: 0,
        overflow: 'auto',
        maxHeight: 50 + 'vh',
    },
    suggestion: {
        display: 'block',
        width: 99 + '%'
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    }
};

function AutoComplete(props) {
    const {query, variables, width, top, ...rest} = props;
    let {disabled, label} = props;

    let acTheme = JSON.parse(JSON.stringify(theme));
    if(width)
        acTheme.container.width = width;

    if (top)
        acTheme.container.top = top;

    return (
        <Query query={query}
           variables={variables}>
            {({loading, error, data}) => {
                if(!disabled && loading)
                    label += " (Lade...)";
                else if(error)
                    label  = " (Fehler!)";

                let suggestions = data[query.definitions[0].name.value.toLowerCase()];

                return <AutoCompleteContainer
                    suggestions={suggestions}
                    label={label}
                    theme={acTheme}
                    disabled={disabled}
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
            <Autosuggest
                   suggestions={this.state.suggestions}
                   onSuggestionSelected={(_, {suggestion}) => {
                       this.props.onChange(suggestion);
                   }}
                   onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                   onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                   getSuggestionValue={(suggestion) => generateLabel(suggestion)}
                   renderSuggestion={this.renderSuggestion}
                   inputProps={{
                       value: this.state.search,
                       onChange: this.handleChange('search'),
                   }}
                   theme={this.props.theme}
                   renderInputComponent={(inputProps) => {
                       const {inputRef = () => {}, ref, ...other} = inputProps;
                       const {error, id, label, name, type, disabled} = this.props;

                       return (
                           <Field
                               InputProps={{
                                   inputRef: node => {
                                       ref(node);
                                       inputRef(node);
                                   }
                               }}
                               component={AutoCompleteTextField}
                               {...other}
                               disabled={disabled}
                               error={error}
                               id={id}
                               label={label}
                               name={name}
                               type={type}
                           />
                       );
                   }}
                   renderSuggestionsContainer={(options) => {
                       return (
                           <Paper {...options.containerProps} square>
                               {options.children}
                           </Paper>
                       );
                   }}
               />
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
                return generateLabel(suggestion).toLowerCase().indexOf(inputValue) !== -1;
            });
    };

    renderSuggestion = (suggestion, { query, isHighlighted }) => {
        return (
            <MenuItem selected={isHighlighted} component="div">
                <div>
                    <span>{generateLabel(suggestion)}</span>
                </div>
            </MenuItem>
        );
    }
}

function AutoCompleteTextField(props) {
    return(
        <TextField
            {...fieldToTextField(props)}
            fullWidth
            className="field"
            onChange={event => {
                props.onChange(event);
                props.field.onChange(event);
            }}
            onBlur={event => {
                props.onBlur();
                props.field.onBlur(event);
            }}
        />
    );
}

export default AutoComplete;