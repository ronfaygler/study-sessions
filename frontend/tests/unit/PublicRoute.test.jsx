import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import PublicRoute from "../../src/components/PublicRoute";

const renderWithRouter = () => {
    render(
        <MemoryRouter initialEntries={['/login']}>
            <Routes>
                <Route path="/home" element={<p>Home Page</p>} />
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<p>Login Page</p>} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
};

describe('PublicRoute', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('renders the child route when there is no token', () => {
        renderWithRouter();
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('redirects to /home when a token exists', () => {
        localStorage.setItem('token', 'fake-token');
        renderWithRouter();
        expect(screen.getByText('Home Page')).toBeInTheDocument();
        expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });
});
