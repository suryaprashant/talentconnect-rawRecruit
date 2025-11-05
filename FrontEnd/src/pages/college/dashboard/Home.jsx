import PageHeader from '@/components/dashboard/PageHeader'
import Button from '@/components/ui/Button'
import { FiPlus } from 'react-icons/fi'

function Home() {
  return (
    <div>
      <PageHeader 
        title="College Dashboard"
        label="Overview"
        status="Active"
        assignee="College Admin"
        createdAt={new Date().toLocaleDateString()}
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Campus Placement</h2>
          <p className="text-gray-600">
            Manage on-campus placement drives and track student applications.
          </p>
          <div className="flex justify-end mt-4">
            <Button
              variant="primary"
              size="md"
              className="flex items-center"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Request Placement
            </Button>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Student Management</h2>
          <p className="text-gray-600">
            View and manage student registrations and placement activities.
          </p>
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              size="md"
            >
              View Students
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
