import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Home from './home';
import { server } from '../mocks/server';
import { rest } from 'msw';

describe('Home page', () => {
  test('Existence of header to see if component rendered', () => {
    render(<Home />);

    const headingElement = screen.getByText(/Return Bear Take Home/i);
    expect(headingElement).toBeInTheDocument();
  });
  
  test('Check form rendering', () => {
    render(<Home />);

    const phoneInput = screen.getByTestId( 'phoneNumber');
    expect(phoneInput).toBeInTheDocument();  

    const messageInput = screen.getByRole('textbox', { name: 'messageBox' });
    expect(messageInput).toBeInTheDocument();

    const submitBtn = screen.getByRole('button');
    expect(submitBtn).toBeInTheDocument();
  });

  test('Check POST request', async() => {
    render(<Home />);

    const phoneInput = screen.getByTestId('phoneNumber');
    // const messageInput = screen.getByRole('textbox', { name: 'messageBox' });
    const submitBtn = screen.getByRole('button', { name: 'submitBtn' });

    fireEvent.change(phoneInput, { target: { value: '1902' }})

    fireEvent.click(submitBtn);

    await waitFor(() => {
      const countryPara = screen.getByTestId("country");
      expect(countryPara).toHaveTextContent('Canada');
    });
  });

  test('Testing catch ERROR for POST request', async() => {    
    server.use(
      rest.post("http://localhost:3003/phone/data", (req, res, ctx) => {
        return res(
          ctx.status(400),
          // ctx.json({ errMsg: "Unable to fulfill return request." })
          )
        }) 
      );

    render(<Home />);

    const submitBtn = screen.getByRole('button', { name: 'submitBtn' });
    fireEvent.click(submitBtn);

    const error = screen.getByTestId("errMsg");
    expect(error).toBeInTheDocument();
    
    await waitFor(() => {
      console.log("err: ", error.textContent)
      expect(error).toHaveTextContent("Error with form submission");
    });
  });
});