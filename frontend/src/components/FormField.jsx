import { forwardRef } from "react";

const FormField = forwardRef(({ label, id, type, value, onChange }, ref) => {
    return (
        <div className="form-field">
            <label htmlFor={id}>{label}</label>
            <input
                type={type}
                id={id}
                name={label}
                placeholder={label}
                value={value}
                ref={ref}
                onChange={onChange}
            />
        </div>
    );
});

export default FormField;