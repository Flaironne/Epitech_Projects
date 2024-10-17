import { FC, useState, FormEvent } from "react";
import process from "process";
import emailjs from "emailjs-com";

interface ContactFormProps {
  name: string;
  email: string;
  message: string;
}

const ContactUs: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState<string | null>(null);

  const sendEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    emailjs
      .sendForm(
        import.meta.env.VITE_REACT_APP_SERVICE_ID,
        import.meta.env.VITE_REACT_APP_TEMPLATE_ID,
        event.currentTarget,
        import.meta.env.VITE_REACT_APP_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log(result.text);
          setStateMessage("Message sent!");
          setIsSubmitting(false);
          setTimeout(() => setStateMessage(null), 5000);
          event.currentTarget.reset();
        },
        (error) => {
          console.log(error.text);
          setStateMessage("Something went wrong, please try again later.");
          setIsSubmitting(false);
          setTimeout(() => setStateMessage(null), 5000);
        }
      );
  };
  return (
    <section className="mb-32 bg-brown-02 font-patrick">
      <div
        id="map"
        className="relative h-[300px] overflow-hidden bg-cover bg-[50%] bg-no-repeat"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d659.9802914012469!2d7.760349469670179!3d48.573058685567425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4796c906d691f9d3%3A0xab14757e7dde623d!2s15%20Av.%20du%20Rhin%2C%2067100%20Strasbourg%2C%20France!5e0!3m2!1sen!2sus!4v1714594633534!5m2!1sen!2sus"
          width="100%"
          height="480"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
        ></iframe>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="block rounded-lg bg-pink-01 px-6 py-12 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] md:py-16 md:px-12 -mt-[100px] backdrop-blur-[30px] border border-brown-01">
          <div className="flex flex-wrap">
            <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:px-3 lg:mb-0 lg:w-5/12 lg:px-6">
              {/* Form starts here */}
              <form onSubmit={sendEmail}>
                {/* Name Input */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    name="from_name"
                    id="exampleInput90"
                    className="peer block min-h-[auto] w-full rounded border-2 border-brown-01 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary"
                  />
                  <label
                    htmlFor="exampleInput90"
                    className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-brown-01 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary"
                  >
                    Name
                  </label>
                </div>

                {/* Email Input */}
                <div className="relative mb-6">
                  <input
                    type="email"
                    name="user_email"
                    id="exampleInput91"
                    className="peer block min-h-[auto] w-full rounded border-2 border-brown-01 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary"
                  />
                  <label
                    htmlFor="exampleInput91"
                    className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-brown-01 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary"
                  >
                    Email address
                  </label>
                </div>

                {/* Message Textarea */}
                <div className="relative mb-6">
                  <textarea
                    name="message"
                    id="exampleFormControlTextarea1"
                    rows={3}
                    className="peer block min-h-[auto] w-full rounded border-2 border-brown-01 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100"
                  ></textarea>
                  <label
                    htmlFor="exampleFormControlTextarea1"
                    className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-brown-01 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary"
                  >
                    Message
                  </label>
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mb-6 w-full rounded bg-brown-01 text-brown-02 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal lg:mb-0"
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </button>
                {stateMessage && <p>{stateMessage}</p>}
              </form>
            </div>
            <div className="w-full lg:w-7/12">
              <div className="flex flex-wrap">
                {/* Technical Support */}
                <div className="mb-12 w-full md:w-6/12 lg:w-full xl:w-6/12">
                  <div className="flex items-start">
                    <div className="shrink-0">
                      <div className="inline-block rounded-md bg-brown-02 p-4 text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-6 grow">
                      <p className="mb-2 font-bold">Technical support</p>
                      <p className="text-sm text-brown-01">
                        palrock@equest.com
                      </p>
                      <p className="text-sm text-brown-01">1-600-890-4567</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-12 w-full md:w-6/12 lg:w-full xl:w-6/12">
                  <div className="flex items-start">
                    <div className="shrink-0">
                      <div className="inline-block rounded-md bg-brown-02 p-4 text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-7 h-7"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-6 grow">
                      <p className="mb-2 font-bold">Address</p>
                      <p className="text-sm text-brown-01">
                        15 Av. du Rhin <br />
                        67000 STRASBOURG <br />
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Contacts */}
                <div className="w-full md:w-6/12 lg:w-full xl:w-6/12">
                  <div className="align-start flex">
                    <div className="shrink-0">
                      <div className="inline-block rounded-md bg-brown-02 p-4 text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-6 grow">
                      <p className="mb-2 font-bold">Mobile</p>
                      <p className="text-brown-01">+91 123456789</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
