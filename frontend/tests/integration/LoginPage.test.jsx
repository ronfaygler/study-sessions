import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginPage from "../../src/pages/LoginPage";

const renderLoginPage = () => {
    render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>
    );
};

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ token: 'fake-token' }),
            text: async () => '',
        });
    });

    it('renders 2 form fields and a button', async () => {
        renderLoginPage();
        expect(await screen.findByLabelText('Email')).toBeInTheDocument();
        expect(await screen.findByLabelText('Password')).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('at first the button is disabled', async () => {
        renderLoginPage();
        expect(await screen.findByRole('button', { name: 'Login' })).toBeDisabled();
    });

    it('the form fields change when the user types', async () => {
        renderLoginPage();
        await userEvent.type(await screen.findByLabelText('Email'), 'test@example.com');
        await userEvent.type(await screen.findByLabelText('Password'), 'password');
        expect(await screen.findByLabelText('Email')).toHaveValue('test@example.com');
        expect(await screen.findByLabelText('Password')).toHaveValue('password');
    });

    it('the button is enabled when the email and password are filled', async () => {
        renderLoginPage();
        await userEvent.type(await screen.findByLabelText('Email'), 'test@example.com');
        await userEvent.type(await screen.findByLabelText('Password'), 'password');
        expect(await screen.findByRole('button', { name: 'Login' })).toBeEnabled();
    });

    it('the button is disabled when the email and password are not filled', async () => {
        renderLoginPage();
        expect(await screen.findByRole('button', { name: 'Login' })).toBeDisabled();
    });

    it('calls the login API and shows a success message when the form is submitted', async () => {
        renderLoginPage();
        await userEvent.type(await screen.findByLabelText('Email'), 'test@example.com');
        await userEvent.type(await screen.findByLabelText('Password'), 'password');
        await userEvent.click(await screen.findByRole('button', { name: 'Login' }));

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/auth/login'),
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
            })
        );
        expect(await screen.findByText('Login succeeded')).toBeInTheDocument();
    });

    it('shows an error message when the login request fails', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: async () => ({}),
            text: async () => 'Invalid credentials',
        });
        renderLoginPage();
        await userEvent.type(await screen.findByLabelText('Email'), 'test@example.com');
        await userEvent.type(await screen.findByLabelText('Password'), 'wrong-password');
        await userEvent.click(await screen.findByRole('button', { name: 'Login' }));

        expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
    });
});
