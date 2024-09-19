import BookplateDesigner from '@/components/bookplate-designer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Bookplate Designer</h1>
        <BookplateDesigner />
      </div>
    </main>
  )
}