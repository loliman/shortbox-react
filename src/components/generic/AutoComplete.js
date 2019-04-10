import React from 'react';
import Select from 'react-select';
import {Field} from "formik";
import Paper from "@material-ui/core/Paper/Paper";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import {Query} from "react-apollo";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import CancelIcon from "@material-ui/icons/Cancel";
import TextField from "@material-ui/core/TextField";
import AutosizeInput from "react-input-autosize";
import CreatableSelect from 'react-select/lib/Creatable';

class AutoComplete extends React.Component {
    render() {
        const {query, variables, onChange} = this.props;
        let {disabled, label, nameField} = this.props;

        if(!nameField) {
            let split = this.props.name.split('.');
            nameField = split[split.length-1];
        }

        return (
            <Query query={query}
                   variables={variables}>
                {({loading, error, data}) => {
                    let options = data[query.definitions[0].name.value.toLowerCase()];

                    return <Field {...this.props}
                                  component={AutoCompleteContainer}
                                  options={options}
                                  label={label}
                                  nameField={nameField}
                                  loadingError={error}
                                  disabled={disabled}
                                  onChange={onChange}
                                  loading={!disabled && loading}/>;
                }}
            </Query>
        );
    }
}

class AutoCompleteContainer extends React.Component {
    render() {
        let error = this.checkObj(this.props.form.errors, this.props.field.name);
        let touched = this.checkObj(this.props.form.touched, this.props.field.name);

        let typename = this.props.nameField === "name" ? "Individual" : "Series"; //Default Series, just because... :)
        if(this.props.options && this.props.options.length > 0)
            typename = this.props.options[0].__typename;

        let style = {paddingTop: '8px', width: '100%', display: 'inline-block', position: 'relative', paddingRight: '4px'};
        if(this.props.style)
            for (const [key, value] of Object.entries(this.props.style))
                style[key] = value;

        let props = {
            name: this.props.field.name,
            error: error,
            touched: touched,
            textFieldProps: {
                label: this.props.label,
                InputLabelProps: {
                    shrink: true,
                    style: this.props.error && this.props.touched ? {color: '#f44336'} : {}
                }
            },

            options: this.props.options,
            onChange: (option) => {
                this.props.onChange(option)
            },

            getOptionValue: (option) => {
                return option[this.props.nameField];
            },
            getOptionLabel: (option) => {
                if (option[this.props.nameField] === (this.props.creatable ?
                    (this.props.field.value ? this.props.field.value[this.props.nameField] : "")
                    : this.props.field.value))
                    return option[this.props.nameField];
                else
                    return this.props.generateLabel(option);
            },

            isSearchable: true,
            isClearable: true,
            isDisabled: this.props.disabled,
            isLoading: false,
            hideSelectedOptions: true,

            placeholder: (!this.props.loadingError ? 'Bitte wählen...' : 'Fehler!'),
            components: components
        };

        return (
            <div style={style}>
                {
                    !this.props.creatable ?
                        <Select {...props}
                            onBlur={this.props.field.onBlur}
                            value={
                                this.props.field.value !== '' && this.props.options ?
                                    this.props.options.find(option => {
                                        if(option[this.props.nameField] && this.props.field.value)
                                            return option[this.props.nameField].toLowerCase() === this.props.field.value.toLowerCase();
                                        else
                                           return false;
                                    }) : ''
                            }
                            noOptionsMessage={() => 'Keine Einträge gefunden'}
                        /> :
                        <CreatableSelect {...props}
                            /*
                            I don't know why, but the onBlur method seems to destroy the Series object.
                            But we don't need validation in that case anyways, so let's just ignore it.
                             */
                            onBlur={this.props.isMulti ? this.props.field.onBlur : false}
                            value={this.props.field.value}
                            isMulti={this.props.isMulti}
                            isValidNewOption={(value) => {
                                let isNew = false;
                                if(value !== '' && this.props.options) {
                                    let option = this.props.options.find(option => {
                                        if(option[this.props.nameField] && value)
                                            return option[this.props.nameField].toLowerCase() === value.toLowerCase();
                                        else
                                            return false;
                                    });

                                    if(!option) isNew = true;
                                }

                                return isNew;
                            }}
                            getNewOptionData={(value) => {
                                let newOption = {};
                                newOption[this.props.nameField] = value;
                                newOption.__typename = typename;
                                return newOption;
                            }}
                        />
                }

                {
                    (error && touched) ?
                        <div style={{
                            color: '#f44336',
                            margin: '0',
                            fontSize: '0.75rem',
                            textAlign: 'left',
                            marginTop: '8px',
                            minHeight: '1em',
                            fontFamily: '"Roboto", "Helvetica", "Arial", "sans-serif"',
                            lineHeight: '1em'
                        }}>{error}</div> : null
                }
            </div>
        );
    }

    checkObj = (obj, field) => {
        let splitted = field.split('.');
        var args = Array.prototype.slice.call(splitted);

        for (var i = 0; i < args.length; i++) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
                return null;
            }
            obj = obj[args[i]];
        }

        return obj;
    };
}

function NoOptionsMessage(props) {
    return (
        <Typography
            color="textSecondary"
            className="noOptionsMessage"
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props}/>;
}

function Control(props) {
    return (
        <TextField
            error={props.selectProps.error && props.selectProps.touched}
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: "autoSuggestField",
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.textFieldProps}
        />
    );
}

function Option(props) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder(props) {
    return (
        <Typography
            color="textSecondary"
            style={props.selectProps.error && props.selectProps.touched ? {color: '#f44336'} : {}}
            className="placeholder"
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function SingleValue(props) {
    return (
        <Typography className="singleValue" {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

function ValueContainer(props) {
    return <div className="valueContainer">{props.children}</div>;
}

const inputStyle = isHidden => ({
    background: 0,
    border: 0,
    fontSize: 'inherit',
    opacity: isHidden ? 0 : 1,
    outline: 0,
    padding: 0,
    color: 'inherit',
});

function Input(props) {
    const {className, cx, id, innerRef, isHidden, isDisabled, selectProps, getStyles, ...rest} = props;

    return (
        <div className="autoSuggestInput">
            <AutosizeInput
                id={selectProps.name ? selectProps.name : id}
                className={cx(null, { 'input': true }, className)}
                inputRef={innerRef}
                inputStyle={inputStyle(isHidden)}
                disabled={isDisabled}
                {...rest}
            />
        </div>
    );
}

function MultiValue(props) {
    return (
        <Chip
            tabIndex={-1}
            label={props.children}
            className={props.isFocused ? "chip chipFocused" : "chip"}
            onDelete={props.removeProps.onClick}
            deleteIcon={<CancelIcon {...props.removeProps} />}
        />
    );
}

function Menu(props) {
    return (
        <Paper square className="paper" {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
    Input
};

export default AutoComplete;