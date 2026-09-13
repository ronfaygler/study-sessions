function Button({ name, onClick, disabled }) {
    return (
        <button type="submit" onClick={onClick} disabled={disabled} className="button"> 
            {name} 
        </button>
    );
}

export default Button;