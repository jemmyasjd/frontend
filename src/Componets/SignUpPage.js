import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return (
    <div className="auth-container">
      <SignUp signInUrl='/sign-in'/>
    </div>
  );
};

export default SignUpPage;
