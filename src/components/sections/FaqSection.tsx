import Container from "../ui/Container"

export default function FaqSection() {
  return (
    <section>
      <Container>
        <div className="py-16">
          <div className="mb-4 h-10 w-64 rounded bg-gray-200" />
          <div className="mb-10 h-6 w-96 rounded bg-gray-200" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between rounded bg-gray-100 p-5">
                <div className="h-6 w-3/4 rounded bg-gray-200" />
                <div className="h-6 w-6 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
