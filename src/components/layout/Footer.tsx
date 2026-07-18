import Container from "../ui/Container"

export default function Footer() {
  return (
    <footer>
      <Container>
        <div className="py-16">
          <div className="mb-10 h-10 w-40 rounded bg-gray-200" />
          <div className="mb-10 flex gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-40 flex-1 rounded bg-gray-100" />
            ))}
          </div>
          <div className="h-6 w-48 rounded bg-gray-200" />
        </div>
      </Container>
    </footer>
  )
}
