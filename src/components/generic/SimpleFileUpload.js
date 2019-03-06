import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

export default function SimpleFileUpload(props) {
    const {label, field, form: { isSubmitting, setFieldValue }, disabled, onChange } = props;

    return (
        <div>
            <FormControl>
                <InputLabel shrink>
                    {label}
                </InputLabel>

                <Input
                    inputProps={{
                        type: 'file',
                        disabled: disabled || isSubmitting,
                        name: field.name,
                        onChange: (e) => {
                            const file = e.currentTarget.files[0];
                            setFieldValue(field.name, file);
                            onChange(file);
                        },
                    }}
                />
            </FormControl>
        </div>
    );
};