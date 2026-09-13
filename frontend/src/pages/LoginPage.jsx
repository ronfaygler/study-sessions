import Button from "../components/Button";
import FormField from "../components/FormField";
import { useState, useRef } from "react";

function LoginPage({ onSubmit }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const inputRef = useRef(null);

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);   
    };
    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.({ email, password });
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <FormField label="Email" id="email" type="email" value={email} ref={inputRef} onChange={handleChangeEmail} />
            <FormField label="Password" id="password" type="password" value={password} onChange={handleChangePassword} />
            <Button name="Login" type="submit" disabled={!email || !password} />
        </form>
    );
}

export default LoginPage;