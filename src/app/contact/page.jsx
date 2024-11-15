'use client'
import NavbarComponent from '@/components/navbar/NavbarComponent'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import emailjs from '@emailjs/browser';

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({});

  // const notyf = new Notyf({
  //   duration: 3000,
  //   position: { x: 'right', y: 'top' },
  // });

  // const validateForm = () => {
  //   const errors = {};

  //   // Name validation: required, only alphabetic characters
  //   const nameRegex = /^[A-Za-z\s]+$/;
  //   if (!name) {
  //     errors.name = "Name is required.";
  //   } else if (!nameRegex.test(name)) {
  //     errors.name = "Name should contain only letters and spaces.";
  //   }

  //   // Email validation: required, valid email format
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!email) {
  //     errors.email = "Email is required.";
  //   } else if (!emailRegex.test(email)) {
  //     errors.email = "Invalid email format.";
  //   }

  //   // Phone validation: required, only numeric characters
  //   const phoneRegex = /^[0-9]+$/;
  //   if (!phone) {
  //     errors.phone = "Phone number is required.";
  //   } else if (!phoneRegex.test(phone)) {
  //     errors.phone = "Phone number should contain only numbers.";
  //   } else if (phone.length < 10) {
  //     errors.phone = "Phone number should be at least 10 digits.";
  //   }

  //   // Subject validation: required, at least 4 characters
  //   if (!subject) {
  //     errors.subject = "Subject is required.";
  //   } else if (subject.length < 4) {
  //     errors.subject = "Subject must be at least 4 characters.";
  //   }

  //   // Message validation: required, at least 10 characters
  //   if (!message) {
  //     errors.message = "Message is required.";
  //   } else if (message.length < 10) {
  //     errors.message = "Message must be at least 10 characters.";
  //   }

  //   setErrors(errors);
  //   return Object.keys(errors).length === 0;
  // };
  // const form = useRef();
  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (validateForm()) {      

  //     emailjs
  //     .sendForm('service_n3nvlis', 'template_yuymtp8', form.current, {
  //       publicKey: 'fBzhBz5xkmKXTLOOC',
  //     })
  //     .then(
  //       () => {
  //         notyf.success('Form submitted successfully');
  //       },
  //       (error) => {
  //         notyf.error('FAILED...', error.text);
  //       },
  //     );
  //     setName("");
  //     setEmail("");
  //     setPhone("");
  //     setSubject("");
  //     setMessage("");
  //     setErrors({});
  //   } else {
  //     notyf.error('Please fix the errors in the form');
  //   }
  // };

  return (
    <div>
      <NavbarComponent />
      <div className="p-5">
        <div className="h-[100%] w-full flex  justify-center gap-5">
          <div className="w-1/2 relative rounded-lg overflow-hidden h-[400px] bg-slate-600 flex items-center justify-center">
            <Image src="/img.jpg" alt="contact image" fill objectFit="cover" objectPosition="center" />
          </div>
          <div className="w-1/2 rounded-lg h-[100%] overflow-hidden bg-white flex items-center justify-center">
            <div className="w-full h-full p-5">
              <form onSubmit={handleSubmit} className="w-full h-full" ref={form}>
                <h1 className="xl-text font-bold mb-3">Enter Contact</h1>
                
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <input 
                     name="name"
                      type="text" 
                      placeholder="Name" 
                      className="w-full p-2 border border-black rounded outline-none text-black"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                  </div>
                  <div className="w-1/2">
                    <input 
                    name = "email"
                      type="text" 
                      placeholder="Email" 
                      className="w-full p-2 border border-black rounded outline-none text-black"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                  </div>
                </div>
                <br />
                
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <input 
                    name = "phone"
                      type="text" 
                      placeholder="Telephone" 
                      className="w-full p-2 border border-black rounded outline-none text-black"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {errors.phone && <p className="text-red-500">{errors.phone}</p>}
                  </div>
                  <div className="w-1/2">
                    <input 
                    name = "subject"
                      type="text" 
                      placeholder="Subject" 
                      className="w-full p-2 border border-black rounded outline-none text-black"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                    {errors.subject && <p className="text-red-500">{errors.subject}</p>}
                  </div>
                </div>
                <br />
                
                <div className="w-full">
                  <textarea
                    name="message"
                    placeholder="Message"
                    rows={6}
                    className="w-full px-5 pt-3 rounded border border-black outline-none mb-1 text-black"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                  {errors.message && <p className="text-red-500">{errors.message}</p>}
                </div>

                <button type="submit" className="bg-black w-full text-white p-3 mb-2">Send</button>
              </form>
            </div>
          </div>
        </div>
        <div className="h-[50vh] w-full bg-lime-800">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7959.781822707938!2d9.695225200000003!3d4.042677700000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1061138910bc3aff%3A0x7b5d5c6ad0bcf7f!2sSeven%20Advanced%20Academy!5e0!3m2!1sen!2srw!4v1731057290227!5m2!1sen!2srw"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
