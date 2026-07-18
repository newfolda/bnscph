import Footer from "@/src/components/layout/Footer"
import Header from "@/src/components/layout/Header"
import Button from "@/src/components/ui/Button"
import Container from "@/src/components/ui/Container"
import { featuredArticle, latestArticles } from "@/src/data/blog"

export default function BlogPage() {
  return (
    <div className="hidden md:block">
      <Header />
      <main>
        <section aria-label="Blog hero" className="py-24">
          <Container>
            <div className="grid h-80 grid-cols-2 gap-8">
              <div className="flex flex-col justify-center gap-6">
                <p>Our Blog</p>
                <h1>Insights, Tips &amp; Car Buying Guides</h1>
                <p>
                  Explore practical car-buying advice, market insights, and guides to help you make confident decisions at every stage of your journey.
                </p>
                <Button>Browse Articles</Button>
              </div>
              <div className="rounded-[var(--radius)] bg-gray-200" />
            </div>
          </Container>
        </section>

        <section aria-label="Featured article" className="py-24">
          <Container>
            <article className="grid grid-cols-2 gap-8">
              <div className="h-96 rounded-[var(--radius)] bg-gray-200" />
              <div className="flex h-96 flex-col justify-center gap-5">
                <header>
                  <p>{featuredArticle.badge}</p>
                  <p>{featuredArticle.category}</p>
                  <h2>{featuredArticle.title}</h2>
                </header>
                <p>{featuredArticle.excerpt}</p>
                <footer>
                  <p>
                    By {featuredArticle.author} <time dateTime={featuredArticle.publishedAt}>{featuredArticle.publishedAtLabel}</time>
                  </p>
                </footer>
                <Button>Read Article</Button>
              </div>
            </article>
          </Container>
        </section>

        <section aria-label="Latest articles" className="py-24">
          <Container>
            <header className="mb-10">
              <p>Latest Articles</p>
              <h2>Recent Posts</h2>
            </header>
            <div className="grid grid-cols-3 gap-8">
              {latestArticles.map((article) => (
                <article key={article.title} className="flex h-[460px] flex-col gap-4">
                  <div className="h-36 rounded-[var(--radius)] bg-gray-200" />
                  <header>
                    <p>{article.category}</p>
                    <h3>{article.title}</h3>
                  </header>
                  <p>{article.excerpt}</p>
                  <time dateTime={article.publishedAt}>{article.publishedAtLabel}</time>
                  <Button>Read More</Button>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section aria-label="Newsletter call to action" className="py-24">
          <Container>
            <div className="flex flex-col items-center rounded-[var(--radius)] bg-[var(--secondary)] px-8 py-16 text-center text-white">
              <p>Stay Updated</p>
              <h2>Get the Latest Car Buying Tips</h2>
              <p>Subscribe for useful insights, practical guides, and the latest updates from Mobee Cars.</p>
              <form aria-label="Newsletter signup" className="mt-6 flex gap-3">
                <label className="sr-only" htmlFor="newsletter-email">
                  Email Address
                </label>
                <input id="newsletter-email" name="email" placeholder="Email Address" type="email" />
                <Button type="submit">Subscribe</Button>
              </form>
              <p className="mt-4">We&apos;ll only send relevant updates. You can unsubscribe at any time.</p>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  )
}
