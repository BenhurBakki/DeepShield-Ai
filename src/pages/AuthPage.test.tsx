import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import AuthPage from './AuthPage';
import { ReactNode } from 'react';

// Mock the AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
  }),
}));

const renderWithRouter = (ui: ReactNode) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('AuthPage', () => {
  it('renders login form by default', () => {
    renderWithRouter(<AuthPage />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('toggles to registration form when clicking sign up', () => {
    renderWithRouter(<AuthPage />);
    
    const toggleButton = screen.getByText("Don't have an account? Sign up");
    fireEvent.click(toggleButton);
    
    expect(screen.getByRole('heading', { name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  it('updates form fields on user input', () => {
    renderWithRouter(<AuthPage />);
    
    const emailInput = screen.getByPlaceholderText('Email Address') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput.value).toBe('test@example.com');
  });
});
