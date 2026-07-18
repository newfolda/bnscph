import Footer from "@/src/components/layout/Footer"
import Header from "@/src/components/layout/Header"
import Button from "@/src/components/ui/Button"
import Container from "@/src/components/ui/Container"

export default function ContactPage() {
  return (
    <div className="hidden md:block">
      <Header />
      <main>
        <section aria-label="Contact hero" className="py-24">
          <Container>
            <div className="grid h-80 grid-cols-2 gap-8">
              <div className="flex flex-col justify-center gap-6">
                <p>Contact Us</p>
                <h1>We&apos;re Here to Help</h1>
                <p>Get in touch with our team and we&apos;ll be happy to help with any questions you may have.</p>
                <Button>Contact Our Team</Button>
              </div>
              <div className="rounded-[var(--radius)] bg-gray-200" />
            </div>
          </Container>
        </section>

        <section aria-label="Contact details and form" className="py-24">
          <Container>
            <div className="grid grid-cols-2 gap-8">
              <aside aria-labelledby="contact-information-heading" className="flex h-96 flex-col gap-5">
                <p>Get in Touch</p>
                <h2 id="contact-information-heading">Contact Information</h2>
                <address className="flex flex-col gap-4 not-italic">
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="h-8 w-8 rounded-full bg-gray-200" />
                    <div>
                      <p>Office Address</p>
                      <p>123 Placeholder Street, Singapore</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="h-8 w-8 rounded-full bg-gray-200" />
                    <div>
                      <p>Email Address</p>
                      <p>hello@mobeecars.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="h-8 w-8 rounded-full bg-gray-200" />
                    <div>
                      <p>Phone Number</p>
                      <p>+65 0000 0000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span aria-hidden="true" className="h-8 w-8 rounded-full bg-gray-200" />
                    <div>
                      <p>Business Hours</p>
                      <p>Monday to Friday, 9:00 AM to 6:00 PM</p>
                    </div>
                  </div>
                </address>
              </aside>
              <form aria-labelledby="contact-form-heading" className="flex min-h-96 flex-col gap-4">
                <h2 id="contact-form-heading">Send Us a Message</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="full-name">Full Name</label>
                    <input id="full-name" name="fullName" type="text" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email-address">Email Address</label>
                    <input id="email-address" name="email" type="email" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone-number">Phone Number (Optional)</label>
                    <input id="phone-number" name="phone" type="tel" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject">Subject</label>
                    <input id="subject" name="subject" type="text" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={4} />
                </div>
                <Button type="submit">Send Message</Button>
              </form>
            </div>
          </Container>
        </section>

        <section aria-label="Location" className="py-24">
          <Container>
            <div className="flex flex-col gap-6">
              <div>
                <p>Visit Us</p>
                <h2>Find Our Office</h2>
                <p>Stop by our office or schedule a meeting with our team at a time that works for you.</p>
              </div>
              <div aria-label="Office location map placeholder" className="h-[420px] rounded-[var(--radius)] bg-gray-200" role="img" />
              <address>123 Placeholder Street, Singapore</address>
            </div>
          </Container>
        </section>

        <section aria-label="Call to action" className="py-24">
          <Container>
            <div className="flex h-64 flex-col items-center justify-center gap-5 rounded-[var(--radius)] bg-[var(--secondary)] px-8 text-center text-white">
              <p>Ready to Get Started?</p>
              <h2>Let&apos;s Find Your Next Car</h2>
              <p>Contact our team today and we&apos;ll help you take the next step with confidence.</p>
              <div className="flex gap-4">
                <Button>Browse Cars</Button>
                <Button className="!bg-white !text-[var(--secondary)]">Contact Us</Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  )
}
