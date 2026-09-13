import Button from "../components/Button";
import FormField from "../components/FormField";
import { useState, useEffect } from "react";
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from "../../../constants.js";
import { useRef } from "react";

function RegisterPage({ onSubmit }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const inputRef = useRef(null);
    const [error, setError] = useState("");

    const isDisabled = !(name && email && password && role);

    useEffect(()=>{
        inputRef.current.focus();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (!name.trim()) {
            setError(`Name is required`);
            return;
        }
        if (!/^[A-Za-z\s'-]+$/.test(name.trim())) {
            setError(`Name can only contain letters, spaces, hyphens and apostrophes`);
            return;
        }
        if (name.length < 3){
            setError(`Name must be at least 3 characters long`)
        }
        if (!email.trim()) {
            setError(`Email is required`);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError(`Please enter a valid email address`);
            return;
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
            return;
        }
        if(password.includes(' ')) {
            setError(`Password cannot contain spaces`);
            return;
        }
        if(password === password.toLowerCase()) {
            setError(`Password must contain at least one uppercase letter`);
            return;
        }
        if(password === password.toUpperCase()) {
            setError(`Password must contain at least one lowercase letter`);
            return;
        }
        if(!/[0-9]/.test(password)) {
            setError(`Password must contain at least one number`);
            return;
        }
        if(!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            setError(`Password must contain at least one special character`);
            return;
        }
        if(password.length > MAX_PASSWORD_LENGTH) {
            setError(`Password must be at most ${MAX_PASSWORD_LENGTH} characters long`);
            return;
        }
        onSubmit?.({ name, email, password, role });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            <FormField
                label="Name"
                id="name"
                type="text"
                value={name}
                ref = {inputRef}
                onChange={(e) => setName(e.target.value)}
            />
            <FormField
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <FormField
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="form-field">
                <label htmlFor="role">Role</label>
                <select id="role" name="Role" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">Select role</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
            </div>
            <Button name="Register" onClick={handleSubmit} disabled={isDisabled} />
            { error && <p className="error">{error} </p> }
        </form>
    );
}

export default RegisterPage;
