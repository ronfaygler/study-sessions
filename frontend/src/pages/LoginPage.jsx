import Button from "../components/Button";
import FormField from "../components/FormField";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };
    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                setError(await response.text() || "Login failed");
            } else {
                const result = await response.json();
                localStorage.setItem('token', result.token);
                setSuccess("Login succeeded");
                navigate("/home");
            }
        } catch (error) {
            setError("Login failed");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            { error && <p className="error">{error}</p> }
            { success && <p className="success">{success}</p> }
            <FormField label="Email" id="email" type="email" value={email} ref={inputRef} onChange={handleChangeEmail} />
            <FormField label="Password" id="password" type="password" value={password} onChange={handleChangePassword} />
            <Button name="Login" type="submit" disabled={!email || !password || loading} />
        </form>
    );
}

export default LoginPage;