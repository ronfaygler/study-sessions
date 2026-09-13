import Button from "../../src/components/Button";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe('Button', () => {
    it('renders the button name', () => {
        render(<Button name="Login" onClick={() => {}} disabled={false} />);
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('has type submit', () => {
        render(<Button name="Login" onClick={() => {}} disabled={false} />);
        expect(screen.getByRole('button', { name: 'Login' })).toHaveAttribute('type', 'submit');
    });

    it('calls the onClick handler when clicked', async () => {
        const handleClick = vi.fn();
        render(<Button name="Login" onClick={handleClick} disabled={false} />);
        await userEvent.click(screen.getByRole('button', { name: 'Login' }));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled is true', () => {
        render(<Button name="Login" onClick={() => {}} disabled={true} />);
        expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled();
    });

    it('does not call onClick when disabled', async () => {
        const handleClick = vi.fn();
        render(<Button name="Login" onClick={handleClick} disabled={true} />);
        await userEvent.click(screen.getByRole('button', { name: 'Login' }));
        expect(handleClick).not.toHaveBeenCalled();
    });
});
