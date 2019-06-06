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
import matchSorter from "match-sorter";
import debounceRender from 'react-debounce-render';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

class AutoComplete extends React.Component {
    constructor(props) {
        super(props);

        this.state = {options: null};
    }

    render() {
        const {query, variables, onChange, values} = this.props;
        let {disabled, label, nameField} = this.props;

        if(!nameField) {
            let split = this.props.name.split('.');
            nameField = split[split.length-1];
        }

        if(values) {
            return <Field {...this.props}
                          component={AutoCompleteContainer}
                          options={values}
                          label={label}
                          nameField={nameField}
                          loadingError={false}
                          disabled={disabled}
                          onChange={onChange}
                          onChangeValue={(value) => {
                              if(this.props.liveSearch)
                                  this.props.onChange(value, true);
                              else if(values) {
                                  let newOptions = matchSorter(values, value, {keys: [nameField]});
                                  this.setState({options: newOptions});
                              }
                          }}
                          loading={!disabled && false}/>;
        }

        return (
            <Query query={query}
                   variables={variables}
                   queryDeduplication={true}>
                {({loading, error, data}) => {
                    let optionsFromQuery = [];
                    if(data)
                        optionsFromQuery = data[query.definitions[0].name.value.toLowerCase()];

                    let options;
                    if(this.state.options)
                        options = this.state.options;
                    else
                        options = optionsFromQuery;

                    if(options)
                        options = options.slice(0, 25);

                    return <Field {...this.props}
                                  component={AutoCompleteContainer}
                                  options={options}
                                  label={label}
                                  nameField={nameField}
                                  loadingError={error}
                                  disabled={disabled}
                                  onChange={onChange}
                                  onChangeValue={(value) => {
                                      if(this.props.liveSearch)
                                          this.props.onChange(value, true);
                                      else if(optionsFromQuery) {
                                          let newOptions = matchSorter(optionsFromQuery, value, {keys: [nameField]});
                                          this.setState({options: newOptions});
                                      }
                                  }}
                                  loading={!disabled && loading}/>;
                }}
            </Query>
        );
    }
}

class AutoCompleteContainer extends React.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return JSON.stringify(this.props.field.value) !== JSON.stringify(nextProps.field.value) ||
            JSON.stringify(this.props.options) !== JSON.stringify(nextProps.options) ||
            this.props.loading !== nextProps.loading ||
            this.props.disabled !== nextProps.disabled ||
            this.props.loadingError !== nextProps.loadingError;
    }

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
                variant: this.props.variant,
                label: this.props.label,
                InputLabelProps: {
                    shrink: true,
                    style: this.props.error && this.props.touched ? {color: '#f44336'} : {}
                }
            },

            options: this.props.loading ? [] : this.props.options,
            onChange: (option) => {
                this.props.onChange(option)
            },
            onChangeValue: (value) => {
                this.props.onChangeValue(value);
            },
            filterOption: false,

            getOptionValue: (option) => {
                return option[this.props.nameField];
            },
            getOptionLabel: (option) => {
                let label = "";
                if (option[this.props.nameField] === (this.props.isMulti || this.props.creatable ?
                    (this.props.field.value ? this.props.field.value[this.props.nameField] : "")
                    : this.props.field.value))
                    label = option[this.props.nameField];
                else
                    label = this.props.generateLabel(option);
                return typeof label === "string" ? label : option[this.props.nameField];
            },

            isSearchable: true,
            isClearable: true,
            isDisabled: this.props.disabled,
            isLoading: this.props.loading,
            hideSelectedOptions: true,

            loadingMessage: () => 'Lade...',
            dropdownIcon: this.props.dropdownIcon,
            placeholder: (!this.props.loadingError ? this.props.placeholder ? this.props.placeholder.trim() : 'Bitte wählen...' : 'Fehler!'),
            components: components,
        };

        return (
            <div style={style}>
                {
                    !this.props.isMulti && !this.props.creatable?
                        <Select {...props}
                                onFocus={(e) => {
                                    if(this.props.onFocus)
                                        this.props.onFocus(e);
                                }}
                                onBlur={(e) => {
                                    if(this.props.onBlur)
                                        this.props.onBlur(e);
                                    this.props.field.onBlur(e);
                                }}
                                value={
                                    this.props.field.value !== '' && this.props.options ?
                                        this.props.options.find(option => {
                                            if(option[this.props.nameField] && this.props.field.value)
                                                return option[this.props.nameField].toLowerCase() === this.props.field.value.toLowerCase();
                                            else
                                                return false;
                                        }) : ''
                                }
                                noOptionsMessage={() => 'Keine Ergebnisse gefunden'}
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
                                             if(!this.props.creatable)
                                                 return false;

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

function LoadingMessage(props) {
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

class Control extends React.Component {
    componentWillUpdate(nextProps, nextState, nextContext) {
        if(nextProps.selectProps.inputValue !== this.props.selectProps.inputValue)
            this.props.selectProps.onChangeValue(nextProps.selectProps.inputValue)
    }

    render() {
        return (
            <TextField
                error={this.props.selectProps.error && this.props.selectProps.touched}
                fullWidth
                InputProps={{
                    inputComponent,
                    inputProps: {
                        className: "autoSuggestField",
                        inputRef: this.props.innerRef,
                        children: this.props.children,
                        ...this.props.innerProps,
                    },
                }}
                {...this.props.selectProps.textFieldProps}
            />
        );
    }
}

function Option(props) {
    let regex = new RegExp("!!\\w*!!");
    let thick = regex.exec(props.children);
    let label = props.children;

    if(thick && thick.length > 0) {
        let thickString = thick[0].substr(2, thick[0].length-4);
        thick = (<Typography variant={"caption"} className="searchCaption">&nbsp;&nbsp;{thickString}</Typography>);
        label = label.replace("!!" + thickString + "!!", "");
    }

    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
                padding: 5
            }}
            {...props.innerProps}
        >
            <Typography title={label} noWrap={true}>
                {label}
            </Typography>
            {thick}
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
    let regex = new RegExp("(?<=!!)(.*)(?=!!)");
    let thick = regex.exec(props.children);
    let label = props.children;

    if(thick && thick.length > 0) {
        let thickString = thick[0];
        thick = (<Typography variant={"caption"} className="searchCaption">{thickString}</Typography>);
        label = label.replace("!!" + thickString + "!!", "");
    }

    return (
        <Typography className="singleValue" {...props.innerProps}>
            {label}
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

function DropdownIndicator(props) {
    let icon = <KeyboardArrowDownIcon />;
    if(props.selectProps.dropdownIcon)
        icon = props.selectProps.dropdownIcon;

    return (
        <div className="dropdownIndicator"
             {...props.innerProps}>
            {icon}
        </div>
    )
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
    Input,
    DropdownIndicator,
    LoadingMessage
};

export default debounceRender(AutoComplete, 500, { leading: false });