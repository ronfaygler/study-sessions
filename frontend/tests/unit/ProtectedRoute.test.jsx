import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import ProtectedRoute from "../../src/components/ProtectedRoute";

const renderWithRouter = () => {
    render(
        <MemoryRouter initialEntries={['/home']}>
            <Routes>
                <Route path="/login" element={<p>Login Page</p>} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/home" element={<p>Home Page</p>} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
};

describe('ProtectedRoute', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('renders the child route when a token exists', () => {
        localStorage.setItem('token', 'fake-token');
        renderWithRouter();
        expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    it('redirects to /login when there is no token', () => {
        renderWithRouter();
        expect(screen.getByText('Login Page')).toBeInTheDocument();
        expect(screen.queryByText('Home Page')).not.toBeInTheDocument();
    });
});
