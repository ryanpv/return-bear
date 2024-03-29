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
      } else {
        for (let [key] of Object.entries(result)) {
          if (typeof result[key] === 'string') {
            const uniqueValue = [...new Set(result[key].split(',').map((item: string) => item.trim()).filter((item: string) => item !== ''))];
            // result[key] = result[key].replace(/^[\s,]+|[\s,]+$/g, '');
            result[key] = uniqueValue.join()
          }

        }
        setPhoneData(result);
        setError("");
      }
      console.log("result: ", result)
    } catch (err) {
      console.log('error with form submission: ', err);
      setError("Error with form submission")
    }
  };


  return (
    <div>
      <h1>Return Bear Take Home</h1>
      <br></br>
      <br></br>

      <form onSubmit={ submitForm }>
        <div>
          <label>Phone # (only numbers allowed)</label>
          <input 
            onChange={ phoneInputHandler }
            name='phone_number'
            type='text'
            maxLength={ 25 }
            // pattern='^[0-9]+$'
            value={ phoneNumber.phone_number }
            aria-label='phoneNumber'
          />
        </div>

        <div>
          <label>Message</label>
          <textarea
            onChange={ messageInputHandler }
            // onChange={ phoneInputHandler }
            name='message'
            value={ textMsg.message }
            // value={ phoneNumber.message }
            aria-label='messageBox'
          >

          </textarea>
        </div>

        <button
          type='submit'
        >Submit</button>
      </form>

      <h2>RESULTS:</h2>
      <h3>{ error !== '' ? `***${ error }***` : null }</h3>

      <Linkify>
        { textMsg.message }
      </Linkify>

      <div>
        <p><strong>PREFIX: </strong>{ phoneData.prefix }</p>
      </div>
      <div>
        <p><strong>OPERATOR: </strong>{ phoneData.operator }</p>
      </div>
      <div>
        <p><strong>COUNTRY: </strong>{ phoneData.country }</p>
      </div>
      <div>
        <p><strong>REGION: </strong>{ phoneData.region }</p>
      </div>
    </div>
  )
}
