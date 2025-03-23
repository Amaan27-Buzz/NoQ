import { useState } from 'react';
import { Button } from '../common/Button';

interface SignInFormProps {
  onSignIn: (email: string, password: string) => void;
}

export const SignInForm = ({ onSignIn }: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(email, password);
  };

  return (
    <form className="signin-form" onSubmit={handleSubmit}>
      <h2>Welcome to NoQ</h2>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Sign In</Button>
    </form>
  );
};