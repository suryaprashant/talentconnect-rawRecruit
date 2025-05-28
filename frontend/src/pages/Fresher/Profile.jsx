import { useState } from 'react'
import PageHeader from '@/components/dashboard/PageHeader'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { FiLinkedin, FiGithub, FiGlobe, FiPlus } from 'react-icons/fi'

function Fresher_Profile() {
  const [activeTab, setActiveTab] = useState('overview')
  const [switchToPro, setSwitchToPro] = useState(false)
  const [workExperiences, setWorkExperiences] = useState([{
    company: '',
    jobRole: '',
    startDate: '',
    description: '',
    currentSalary: '',
    expectedSalary: ''
  }])
  
  const skills = [
    'SQL', 'REST', 'CSS 3', 'HTML 5', 'Node.js', 'React.js',
    'AWS S3', 'AWS IAM', 'AWS EC2', 'AWS RDS', 'AWS ECS'
  ]
  
  const locations = ['Noida', 'Delhi', 'Gurgaon', 'Bangalore', 'Pune', 'Mumbai', 'Hyderabad']

  const handleWorkExperienceChange = (index, field, value) => {
    const newExperiences = [...workExperiences]
    newExperiences[index][field] = value
    setWorkExperiences(newExperiences)
  }

  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, {
      company: '',
      jobRole: '',
      startDate: '',
      description: '',
      currentSalary: '',
      expectedSalary: ''
    }])
  }

  if (switchToPro) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar size="lg" name="Name Surname" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Name Surname</h2>
                <p className="text-gray-600">hello@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Switch to Professional</span>
              <button
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-black bg-black transition-colors duration-200 ease-in-out focus:outline-none"
                role="switch"
                aria-checked={true}
                onClick={() => setSwitchToPro(false)}
              >
                <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upload your recent resume or CV</h3>
            <p className="mt-1 text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
            </p>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Switch to Professional Dashboard!
            </h3>
            <p className="text-gray-600 mb-6">
              Let us know your job interests and preferred locations so we can recommend the best opportunities for you.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Experience
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black">
                  <option value="">Select Company</option>
                  <option value="company1">Company 1</option>
                  <option value="company2">Company 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Role
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black">
                  <option value="">Select Role</option>
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  rows="3"
                  placeholder="Enter job description"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Salary
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                    USD
                  </span>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Salary
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                    USD
                  </span>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setSwitchToPro(false)}
                  className="border-black text-black hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="bg-black hover:bg-gray-900"
                >
                  Switch
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <PageHeader 
        title="Profile"
        createdAt="July 1, 2023"
      />
      
      {/* Profile Header */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar size="xl" name="Name Surname" />
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Name Surname</h2>
                <p className="text-gray-600">hello@demo.io</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Switch to Professional</span>
                <button
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    switchToPro ? 'bg-black' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={switchToPro}
                  onClick={() => setSwitchToPro(!switchToPro)}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      switchToPro ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {['overview', 'profile', 'resume'].map((tab) => (
            <button
              key={tab}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">What recruiters will see</h3>
            <div className="border-2 border-gray-200 rounded-lg divide-y divide-gray-200">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar size="lg" name="Name Surname" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">Name Surname</h4>
                        <p className="text-sm text-gray-600">College of Engineering, 2018 - 2023</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
                          <FiLinkedin className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
                          <FiGithub className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
                          <FiGlobe className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">About</h5>
                        <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum.</p>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Email address</p>
                            <p className="text-gray-900">hello@demo.io</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Mobile Number</p>
                            <p className="text-gray-900">1234567890</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Education</h5>
                        <p className="text-gray-900">Bachelor of Technology, Computer Science</p>
                        <p className="text-gray-600">College of Engineering, 2018 - 2023</p>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Skills</h5>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <Badge key={skill} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Interested Industry Type</h5>
                        <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">IT Industry</Badge>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Interested Job Roles</h5>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">Software Engineer</Badge>
                          <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">Data Analyst</Badge>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Preferred Job Locations</h5>
                        <div className="flex flex-wrap gap-2">
                          {locations.map((location) => (
                            <Badge key={location} variant="primary" size="md" className="bg-gray-100 text-gray-800">
                              {location}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Looking for</h5>
                        <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">Internship</Badge>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Employment Type</h5>
                        <div className="flex gap-2">
                          <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">Full-time</Badge>
                          <Badge variant="primary" size="md" className="bg-gray-100 text-gray-800">Remote</Badge>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Language</h5>
                        <p className="text-gray-900">English</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Profile Tab Content */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <form className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your degree"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your institution"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year of Graduation
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter graduation year"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addWorkExperience}
                    type="button"
                  >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
                {workExperiences.map((exp, index) => (
                  <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.company}
                          onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                        >
                          <option value="">Select Company</option>
                          <option value="company1">Company 1</option>
                          <option value="company2">Company 2</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Role
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.jobRole}
                          onChange={(e) => handleWorkExperienceChange(index, 'jobRole', e.target.value)}
                        >
                          <option value="">Select Role</option>
                          <option value="developer">Developer</option>
                          <option value="designer">Designer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={exp.startDate}
                          onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows="3"
                        value={exp.description}
                        onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                        placeholder="Describe your role and responsibilities"
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Salary
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                            USD
                          </span>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={exp.currentSalary}
                            onChange={(e) => handleWorkExperienceChange(index, 'currentSalary', e.target.value)}
                            placeholder="Enter amount"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expected Salary
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                            USD
                          </span>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={exp.expectedSalary}
                            onChange={(e) => handleWorkExperienceChange(index, 'expectedSalary', e.target.value)}
                            placeholder="Enter amount"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Skills & Experience</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skills
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                      placeholder="Enter your skills (comma separated)"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                      placeholder="Describe your experience"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Resume Tab Content */}
      {activeTab === 'resume' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload your resume/CV</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                className="hidden"
                id="resume-upload"
                accept=".pdf,.doc,.docx"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900"
              >
                Upload Resume
              </label>
              <p className="mt-2 text-sm text-gray-600">
                Supported formats: PDF, DOC, DOCX
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Fresher_Profile;