import FormField from "../../src/components/FormField";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe('FormField', () => {
    it('renders the label text', () => {
        render(
            <FormField label="Email" id="email" type="email" value="" onChange={() => {}} error="" />
        );
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });
    it('displays the current value of the input', () => {
        render(
            <FormField label="Email" id="email" type="email" value="test@example.com" onChange={() => {}} error="" />
        );
        expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
    });
    it('calls the onChange handler when the input value changes', async () => {
        const handleChange = vi.fn();
        render(
            <FormField label="Email" id="email" type="email" value="" onChange={handleChange} error="" />
        );
        await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
        expect(handleChange).toHaveBeenCalled();
    });

  it('shows an error message when error is provided', () => {
    render(
      <FormField label="Email" id="email" type="email" value="" onChange={() => {}} error="Invalid email" />
    );
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('does not show an error message when there is no error', () => {
    render(
      <FormField label="Email" id="email" type="email" value="" onChange={() => {}} error="" />
    );
    expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
  });
});