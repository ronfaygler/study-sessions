import FormField from "../../src/components/FormField";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe('FormField', () => {
    it('renders the label text', () => {
        render(
            <FormField label="Email" id="email" type="email" value="" onChange={() => {}} />
        );
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });
    it('displays the current value of the input', () => {
        render(
            <FormField label="Email" id="email" type="email" value="test@example.com" onChange={() => {}} />
        );
        expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
    });
    it('calls the onChange handler when the input value changes', async () => {
        const handleChange = vi.fn();
        render(
            <FormField label="Email" id="email" type="email" value="" onChange={handleChange} />
        );
        await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
        expect(handleChange).toHaveBeenCalled();
    });
});
