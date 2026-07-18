import Container from "../ui/Container"

export default function HeroSection() {
  return (
    <section>
      <Container>
        <div className="flex gap-8 py-16">
          <div className="flex flex-1 flex-col justify-center gap-6">
            <div className="h-12 w-3/4 rounded bg-gray-200" />
            <div className="h-20 w-full rounded bg-gray-200" />
            <div className="h-12 w-40 rounded bg-gray-200" />
          </div>
          <div className="h-80 flex-1 rounded bg-gray-200" />
        </div>
      </Container>
    </section>
  )
}
