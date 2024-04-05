import React from 'react';
import Linkify from 'react-linkify';

export default function Home() {
  type PhoneNumber = {
    phone_number: string;
    message: string;
  };

  type TextMessage = {
    message: string;
  };

  type PhoneData = {
    prefix: number;
    operator: null | string;
    country_code: number;
    country: string;
    region: null | string;
  };

  const [phoneNumber, setFormData] = React.useState<PhoneNumber>({ phone_number: "", message: "" });
  const [pending, setPending] = React.useState(false);
  const [textMsg, setTextMsg] = React.useState<TextMessage>({ message: "" });
  const [phoneData, setPhoneData] = React.useState<PhoneData>({
    prefix: 0,
    operator: '',
    country_code: 0,
    country: '',
    region: ''
  });
  const [error, setError] = React.useState("");

  const phoneInputHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    const { name, value } = event.target;

    setFormData((prev) => 
      ({
        ...prev,
        [name]: value
      })
    );
  };

  const messageInputHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const { name, value } = event.target;

    setTextMsg((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setPending(true);
      const checkPhone = await fetch('http://localhost:3003/phone/data', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(phoneNumber)
      });

      const result = await checkPhone.json();

      if (result.errMsg) {
        setError(result.errMsg);
        setPhoneData({
          prefix: 0,
          operator: '',
          country_code: 0,
          country: '',
          region: ''
        });
      } else {
        for (let [key] of Object.entries(result)) {
          if (typeof result[key] === 'string') {
            const uniqueValue = [...new Set(result[key].split(',').map((item: string) => item.trim()).filter((item: string) => item !== ''))];

            result[key] = uniqueValue.join();
          }

        }
        setPhoneData(result);
        setError("");
      }
    } catch (err) {
      console.log('error with form submission: ', err);
      setError("Error with form submission")
    } finally {
      setPending(false);
    }
  };


  return (
    <div>
      <div className='container flex'>
        <div className='flex flex-1 flex-col py-12 px-8 max-w-md sm:max-w-lg mx-auto'>
          <div className='text-center sm:py-2 sm:mx-auto sm:max-w-sm'>
            <h1 className='text-4xl underline decoration-gray-400'>Return Bear Take Home</h1>
          </div>

          <div className='space-y-10 shadow-gray-300 rounded border-4 border-gray-700 mt-10 w-full px-6 sm:px-10 py-16 mx-auto sm:w-full sm:max-w-md sm:min-h-80 font-medium'>
          
            <form className='space-y-8' onSubmit={ submitForm }>
              <div>
                <label className='font-semibold text-gray-600'>
                  Phone Number
                </label>
                <div className='mt-2'>
                  <input 
                    className='block w-full py-2.5 px-3.5 ring-2 ring-gray-700 duration-300 sm:leading-6'
                    required
                    type='text'
                    name='phone_number'
                    onChange={ phoneInputHandler }
                    maxLength={ 25 }
                    value={ phoneNumber.phone_number }
                    data-testid='phoneNumber'
                  />
                </div>
              </div>

              <div>
                <div className='flex justify-between'>
                  <label className='font-semibold text-gray-600'>
                    Message
                  </label>
                </div>

                <div className='mt-2'>
                  <textarea 
                    className='block w-full py-2.5 px-3.5 border-0 ring-2 ring-gray-700 sm:leading-6'
                    name='message'
                    onChange={ messageInputHandler }
                    value={ textMsg.message }
                    aria-label='messageBox'
                  />
                </div>
              </div>

              <div className='pt-4'>
                <button
                  type='submit'
                  className='flex w-full justify-center rounded text-gray-700 ring-2 ring-gray-700 py-2.5 px-3.5 font-semibold'>
                    Submit
                  </button>
              </div> 
                
            </form>
          </div>


        </div>
      </div>

    <hr className='border-2 border-gray-900 max-w-screen-sm flex mx-auto'></hr>

      <div className='flex flex-col items-center mx-auto'>
        <div className='mb-5'>
          <h2 className='text-center font-bold'>RESULTS:</h2>
          <h3 data-testid="errMsg" className='text-red-500 font-bold'>{ error !== '' ? `***${ error }***` : null }</h3>
          <Linkify
            componentDecorator={(decoratedHref, decoratedText, key) => (
              <a
                href={decoratedHref}
                key={key}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'blue', textDecoration: 'underline' }}
              >
                {decoratedText}
              </a>
            )}
          >
              { textMsg.message }
          </Linkify>
        </div>


        { pending ? <h1>Pending results...</h1> 
        : 
          <>
            <div>
              <p data-testid='prefix'><strong>PREFIX: </strong>{ phoneData.prefix }</p>
            </div>
            <div>
              <p data-testid='operator'><strong>OPERATOR: </strong>{ phoneData.operator }</p>
            </div>
            <div>
              <p data-testid="country"><strong>COUNTRY: </strong>{ phoneData.country }</p>
            </div>
            <div>
              <p data-testid='region'><strong>REGION: </strong>{ phoneData.region }</p>
            </div>
          </>
        }
      </div>

    </div>
  )
}
