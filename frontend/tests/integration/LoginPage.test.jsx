import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginPage from "../../src/pages/LoginPage";

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('renders 2 form fields and a button', () => {
        render(
            <LoginPage />
        );
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });
    it('at first the button is disabled', () => {
        render(
            <LoginPage />
        );
        expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled();
    });
    it('the form fields change when the user types', async () => {
        render(
            <LoginPage />
        );
        await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
        await userEvent.type(screen.getByLabelText('Password'), 'password');
        expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
        expect(screen.getByLabelText('Password')).toHaveValue('password');
    });
    it('the button is enabled when the email and password are filled', async () => {
        render(
            <LoginPage />
        );
        await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
        await userEvent.type(screen.getByLabelText('Password'), 'password');
        expect(screen.getByRole('button', { name: 'Login' })).toBeEnabled();
    });
    it('the button is disabled when the email and password are not filled', () => {
        render(
            <LoginPage />
        );
        expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled();
    });
    it('the onSubmit function is called when the form is submitted', async () => {
        const onSubmit = vi.fn();
        render(
            <LoginPage onSubmit={onSubmit} />
        );
        await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
        await userEvent.type(screen.getByLabelText('Password'), 'password');
        await userEvent.click(screen.getByRole('button', { name: 'Login' }));
        expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
    });
});