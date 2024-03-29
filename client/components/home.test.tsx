import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './home';

describe('Home page', () => {
  test('Existence of header to see if component rendered', () => {
    render(<Home />);
    const headingElement = screen.getByText(/Return Bear Take Home/i);
  
    expect(headingElement).toBeInTheDocument();
  });
  
  test('Check form rendering', () => {
    render(<Home />);

      const phoneInput = screen.getByRole('textbox', { name: 'phoneNumber' });
      expect(phoneInput).toBeInTheDocument();  

      const messageInput = screen.getByRole('textbox', { name: 'messageBox' });
      expect(messageInput).toBeInTheDocument();

      const submitBtn = screen.getByRole('button');
      expect(submitBtn).toBeInTheDocument();
  });

  // test('Check POST request', async() => {
  //   render(<Home />);
  //   const prefix = await screen.findAllByRole('paragraph');
  //   expect(prefix).toHaveDisplayValue('1')
  // })

  // test('Check FETCH status', () => {
  //   server.use(
  //     http.post("http://localhost:3003/phone/data", () => {})
  //   )
  // })
});