import AdminSidebar from '../components/admin/AdminSidebar'

export default function AdminLayout({ children, title }) {
  return (
    <div className="flex h-screen bg-ivory overflow-hidden">
      <AdminSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-clay-100 flex items-center px-8 shrink-0">
          <h1 className="font-display text-2xl text-clay-900 font-light">{title}</h1>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
