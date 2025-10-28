import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: "Phone",
      details: ["+91 9351966136", "+91 9772700135"],
    },
    {
      icon: EnvelopeIcon,
      title: "Email",
      details: ["info@medilink.com", "support@medilink.com"],
    },
    {
      icon: MapPinIcon,
      title: "Location",
      details: [
        "Institute of Medical Sciences, BHU",
        "SSC Building, Varanasi, Uttar Pradesh 221005",
      ],
    },
    {
      icon: ClockIcon,
      title: "Working Hours",
      details: [
        "Monday to Friday: 8:00 AM - 8:00 PM",
        "Saturday: 9:00 AM - 5:00 PM",
      ],
    },
  ];

  return (
    <div className="bg-white w-full">
      {/* Header Section */}
      <div className="w-full bg-gradient-to-r from-primary-600 to-primary-500 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-3xl mx-auto">
            We're here to help. Reach out to us with any questions or concerns.
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactInfo.map((item) => (
            <div
              key={item.title}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-5">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              {item.details.map((detail, index) => (
                <p key={index} className="text-gray-600">
                  {detail}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form + Map Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
              <p className="text-white/90 text-lg">
                Fill out the form below and we'll get back to you as soon as
                possible.
              </p>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your Name"
                  className="w-full px-6 py-4 bg-gray-50 border-0 rounded-xl text-lg focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Your Email"
                  className="w-full px-6 py-4 bg-gray-50 border-0 rounded-xl text-lg focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="Subject"
                  className="w-full px-6 py-4 bg-gray-50 border-0 rounded-xl text-lg focus:ring-2 focus:ring-primary-500"
                />
                <textarea
                  name="message"
                  rows="4"
                  required
                  placeholder="Your Message"
                  className="w-full px-6 py-4 bg-gray-50 border-0 rounded-xl text-lg focus:ring-2 focus:ring-primary-500"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white text-lg font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Map Section */}
          <div>
            <p className="text-lg font-semibold text-primary uppercase tracking-wide">
              Visit Us
            </p>
            <h2 className="mt-3 text-4xl font-extrabold text-gray-900 mb-8">
              Our Location
            </h2>

            <div className="rounded-3xl h-96 mb-8 overflow-hidden shadow-lg relative">
              <img
                src="https://i.postimg.cc/dQ55rqRk/Whats-App-Image-2025-10-29-at-01-49-13.jpg"
                alt="Hospital Map Location"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary-600 h-12 w-12 rounded-full flex items-center justify-center shadow-lg">
                  <MapPinIcon className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="absolute top-4 left-4 right-4 bg-white/80 rounded-lg p-4 shadow-md">
                <p className="font-bold text-lg text-gray-800">
                  MediLink Hospital
                </p>
                <p className="text-sm text-gray-600">
                  Institute of Medical Sciences, BHU, SSC Building, Varanasi,
                  Uttar Pradesh 221005
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-base font-semibold text-primary uppercase tracking-wide">
              Common Questions
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
              Find answers to common questions about our services and
              facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: "What are your visiting hours?",
                a: "Our general visiting hours are from 10:00 AM to 8:00 PM daily. Specialized wards may have different visiting hours.",
              },
              {
                q: "How do I schedule an appointment?",
                a: "You can schedule appointments online, by phone, or by visiting us in person. Emergency cases do not require prior appointments.",
              },
              {
                q: "What insurance plans do you accept?",
                a: "We accept a wide range of insurance plans. Contact our insurance desk for details about your coverage.",
              },
              {
                q: "Can I access my medical records online?",
                a: "Yes, registered patients can access records through our secure patient portal.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {faq.q}
                </h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-center py-16 px-4 sm:px-6 lg:py-20">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
          Need Emergency Help?
        </h2>
        <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
          Our emergency services are available 24/7. Don’t hesitate to contact
          us for urgent care.
        </p>
        <div className="inline-flex rounded-full bg-white px-8 py-4 shadow-lg">
          <a href="tel:+918055757575" className="text-2xl font-bold text-primary">
            Emergency: +91 8055757575
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
