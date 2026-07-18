import Footer from "@/src/components/layout/Footer"
import Header from "@/src/components/layout/Header"
import Button from "@/src/components/ui/Button"
import Container from "@/src/components/ui/Container"
import { customerReviews, featuredReview, reviewStats } from "@/src/data/reviews"

export default function ReviewsPage() {
  return (
    <div className="hidden md:block">
      <Header />
      <main>
        <section aria-label="Reviews hero" className="py-24">
          <Container>
            <div className="grid h-80 grid-cols-2 gap-8">
              <div className="flex flex-col justify-center gap-6">
                <p>Customer Reviews</p>
                <h1>Hear From Our Happy Customers</h1>
                <p>
                  Discover real experiences from customers who have found more confidence and clarity throughout their car buying journey.
                </p>
                <Button>Read Success Stories</Button>
              </div>
              <div className="rounded-[var(--radius)] bg-gray-200" />
            </div>
          </Container>
        </section>

        <section aria-label="Featured customer story" className="py-24">
          <Container>
            <article className="grid grid-cols-2 gap-8">
              <div className="h-96 rounded-[var(--radius)] bg-gray-200" />
              <div className="flex h-96 flex-col justify-center gap-4">
                <header>
                  <p>{featuredReview.badge}</p>
                  <h2>{featuredReview.name}</h2>
                  <p>{featuredReview.vehicle}</p>
                </header>
                <blockquote>
                  {featuredReview.testimonial.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </blockquote>
                <footer className="flex flex-col gap-4">
                  <p aria-label="5 out of 5 stars">{featuredReview.rating}</p>
                  <Button>View More Reviews</Button>
                </footer>
              </div>
            </article>
          </Container>
        </section>

        <section aria-label="Customer reviews" className="py-24">
          <Container>
            <header className="mb-10">
              <p>More Customer Reviews</p>
              <h2>What Our Customers Say</h2>
            </header>
            <div className="grid grid-cols-3 gap-8">
              {customerReviews.map((review) => (
                <article key={review.name} className="flex h-96 flex-col gap-4">
                  <header>
                    <h3>{review.name}</h3>
                    <p>{review.vehicle}</p>
                  </header>
                  <p aria-label="5 out of 5 stars">{review.rating}</p>
                  <p>{review.testimonial}</p>
                  <time dateTime={review.purchasedAt}>{review.purchasedAtLabel}</time>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section aria-label="Overall ratings summary" className="py-24">
          <Container>
            <div className="flex flex-col items-center gap-6 text-center">
              <header>
                <p>{reviewStats.badge}</p>
                <h2>{reviewStats.title}</h2>
                <p>{reviewStats.description}</p>
              </header>
              <dl className="grid w-full grid-cols-4 gap-8">
                {reviewStats.items.map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse">
                    <dt>{stat.label}</dt>
                    <dd>{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </section>

        <section aria-label="Call to action" className="py-24">
          <Container>
            <div className="flex min-h-64 flex-col items-center justify-center gap-5 rounded-[var(--radius)] bg-white px-8 py-12 text-center">
              <p>Ready to Find Your Next Car?</p>
              <h2>Start Your Car Buying Journey Today</h2>
              <p>Contact Mobee Cars for helpful guidance and support finding vehicles that fit your needs.</p>
              <div className="flex gap-4">
                <Button>Contact Us</Button>
                <Button className="!bg-white !text-[var(--secondary)] ring-1 ring-inset ring-[var(--secondary)]">Browse Inventory</Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  )
}
