import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RegisterPage from "../../src/pages/RegisterPage";

describe('RegisterPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders name, email, password, role fields and a button', () => {
        render(<RegisterPage />);
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Role')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    });

    it('at first the button is disabled', () => {
        render(<RegisterPage />);
        expect(screen.getByRole('button', { name: 'Register' })).toBeDisabled();
    });

    it('the form fields change when the user types', async () => {
        render(<RegisterPage />);
        await userEvent.type(screen.getByLabelText('Name'), 'Jane Doe');
        await userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');
        await userEvent.type(screen.getByLabelText('Password'), 'password');
        await userEvent.selectOptions(screen.getByLabelText('Role'), 'student');
        expect(screen.getByLabelText('Name')).toHaveValue('Jane Doe');
        expect(screen.getByLabelText('Email')).toHaveValue('jane@example.com');
        expect(screen.getByLabelText('Password')).toHaveValue('password');
        expect(screen.getByLabelText('Role')).toHaveValue('student');
    });

    it('the button is enabled when all fields are filled', async () => {
        render(<RegisterPage />);
        await userEvent.type(screen.getByLabelText('Name'), 'Jane Doe');
        await userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');
        await userEvent.type(screen.getByLabelText('Password'), 'password');
        await userEvent.selectOptions(screen.getByLabelText('Role'), 'teacher');
        expect(screen.getByRole('button', { name: 'Register' })).toBeEnabled();
    });

    it('the button stays disabled when a field is missing', async () => {
        render(<RegisterPage />);
        await userEvent.type(screen.getByLabelText('Name'), 'Jane Doe');
        await userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');
        await userEvent.type(screen.getByLabelText('Password'), 'password');
        expect(screen.getByRole('button', { name: 'Register' })).toBeDisabled();
    });

    it('the onSubmit function is called when the form is submitted', async () => {
        const onSubmit = vi.fn();
        render(<RegisterPage onSubmit={onSubmit} />);
        await userEvent.type(screen.getByLabelText('Name'), 'Jane Doe');
        await userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');
        await userEvent.type(screen.getByLabelText('Password'), 'password');
        await userEvent.selectOptions(screen.getByLabelText('Role'), 'student');
        await userEvent.click(screen.getByRole('button', { name: 'Register' }));
        expect(onSubmit).toHaveBeenCalledWith({
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: 'password',
            role: 'student',
        });
    });
});
