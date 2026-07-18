import Container from "../ui/Container"

export default function ReviewsSection() {
  return (
    <section>
      <Container>
        <div className="py-16">
          <div className="mb-4 h-10 w-64 rounded bg-gray-200" />
          <div className="mb-10 h-6 w-96 rounded bg-gray-200" />
          <div className="flex gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-1 flex-col gap-4 rounded bg-gray-100 p-6">
                <div className="h-12 w-12 rounded-full bg-gray-200" />
                <div className="h-6 w-1/2 rounded bg-gray-200" />
                <div className="h-20 w-full rounded bg-gray-200" />
                <div className="h-5 w-24 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
