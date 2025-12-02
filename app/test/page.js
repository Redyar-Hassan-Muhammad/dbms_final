// app/test-tailwind/page.js
export default function TestTailwind() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Tailwind CSS Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-100 text-blue-800 rounded-lg">
          Blue background - Tailwind is working!
        </div>
        
        <div className="p-4 bg-green-100 text-green-800 rounded-lg">
          Green background - Colors are working!
        </div>
        
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
          Yellow background - Utility classes work!
        </div>
        
        <button className="btn-primary">
          Test Primary Button
        </button>
        
        <button className="btn-secondary ml-4">
          Test Secondary Button
        </button>
        
        <div className="card mt-6">
          <h2 className="text-xl font-semibold mb-3">Test Card</h2>
          <p>This is a card component using Tailwind.</p>
        </div>
        
        <div className="mt-6">
          <label className="form-label">Test Input Field</label>
          <input type="text" className="form-input" placeholder="Type something..." />
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-100 rounded-lg">Column 1</div>
        <div className="p-4 bg-gray-100 rounded-lg">Column 2</div>
        <div className="p-4 bg-gray-100 rounded-lg">Column 3</div>
      </div>
    </div>
  )
}