import React, { useState } from "react";
import "./Contact.css";
import { submitContact } from "../../service/contactService";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitContact(formData);
      if (response && response.status === 201) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
        setErrors({});
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="contact-form p-5 shadow-sm bg-white">
              <h2 className="text-center mb-4">Get in Touch</h2>
              <form onSubmit={onSubmitHandler}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="firstName"
                      className={`form-control custom-input ${
                        errors.firstName ? "is-invalid" : ""
                      }`}
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={onChangeHandler}
                      disabled={isSubmitting}
                    />
                    {errors.firstName && (
                      <div className="invalid-feedback d-block">
                        {errors.firstName}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="lastName"
                      className={`form-control custom-input ${
                        errors.lastName ? "is-invalid" : ""
                      }`}
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={onChangeHandler}
                      disabled={isSubmitting}
                    />
                    {errors.lastName && (
                      <div className="invalid-feedback d-block">
                        {errors.lastName}
                      </div>
                    )}
                  </div>
                  <div className="col-12">
                    <input
                      type="email"
                      name="email"
                      className={`form-control custom-input ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={onChangeHandler}
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div className="col-12">
                    <textarea
                      name="message"
                      className={`form-control custom-input ${
                        errors.message ? "is-invalid" : ""
                      }`}
                      rows="5"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={onChangeHandler}
                      disabled={isSubmitting}
                    ></textarea>
                    {errors.message && (
                      <div className="invalid-feedback d-block">
                        {errors.message}
                      </div>
                    )}
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

