import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RegisterPage from "../../src/pages/RegisterPage";

const renderRegisterPage = () => {
    render(
        <MemoryRouter>
            <RegisterPage />
        </MemoryRouter>
    );
};

const fillValidForm = async () => {
    await userEvent.type(await screen.findByLabelText('Name'), 'Jane Doe');
    await userEvent.type(await screen.findByLabelText('Email'), 'jane@example.com');
    await userEvent.type(await screen.findByLabelText('Password'), 'Password1!');
    await userEvent.selectOptions(await screen.findByLabelText('Role'), 'student');
};

describe('RegisterPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({}),
            text: async () => '',
        });
    });

    it('renders name, email, password, role fields and a button', async () => {
        renderRegisterPage();
        expect(await screen.findByLabelText('Name')).toBeInTheDocument();
        expect(await screen.findByLabelText('Email')).toBeInTheDocument();
        expect(await screen.findByLabelText('Password')).toBeInTheDocument();
        expect(await screen.findByLabelText('Role')).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: 'Register' })).toBeInTheDocument();
    });

    it('at first the button is disabled', async () => {
        renderRegisterPage();
        expect(await screen.findByRole('button', { name: 'Register' })).toBeDisabled();
    });

    it('the form fields change when the user types', async () => {
        renderRegisterPage();
        await userEvent.type(await screen.findByLabelText('Name'), 'Jane Doe');
        await userEvent.type(await screen.findByLabelText('Email'), 'jane@example.com');
        await userEvent.type(await screen.findByLabelText('Password'), 'password');
        await userEvent.selectOptions(await screen.findByLabelText('Role'), 'student');
        expect(await screen.findByLabelText('Name')).toHaveValue('Jane Doe');
        expect(await screen.findByLabelText('Email')).toHaveValue('jane@example.com');
        expect(await screen.findByLabelText('Password')).toHaveValue('password');
        expect(await screen.findByLabelText('Role')).toHaveValue('student');
    });

    it('the button is enabled when all fields are filled', async () => {
        renderRegisterPage();
        await userEvent.type(await screen.findByLabelText('Name'), 'Jane Doe');
        await userEvent.type(await screen.findByLabelText('Email'), 'jane@example.com');
        await userEvent.type(await screen.findByLabelText('Password'), 'password');
        await userEvent.selectOptions(await screen.findByLabelText('Role'), 'teacher');
        expect(await screen.findByRole('button', { name: 'Register' })).toBeEnabled();
    });

    it('the button stays disabled when a field is missing', async () => {
        renderRegisterPage();
        await userEvent.type(await screen.findByLabelText('Name'), 'Jane Doe');
        await userEvent.type(await screen.findByLabelText('Email'), 'jane@example.com');
        await userEvent.type(await screen.findByLabelText('Password'), 'password');
        expect(await screen.findByRole('button', { name: 'Register' })).toBeDisabled();
    });

    it('calls the register API and shows a success message when the form is submitted', async () => {
        renderRegisterPage();
        await fillValidForm();
        await userEvent.click(await screen.findByRole('button', { name: 'Register' }));

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/auth/register'),
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    password: 'Password1!',
                    role: 'student',
                }),
            })
        );
        expect(await screen.findByText('Registration succeeded')).toBeInTheDocument();
    });

    it('shows an error message when the register request fails', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: async () => ({}),
            text: async () => 'Email already in use',
        });
        renderRegisterPage();
        await fillValidForm();
        await userEvent.click(await screen.findByRole('button', { name: 'Register' }));

        expect(await screen.findByText('Email already in use')).toBeInTheDocument();
    });
});
