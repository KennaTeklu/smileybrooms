import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, DollarSign, MapPin, Clock } from "lucide-react"
import Link from "next/link"

interface CareerPosition {
  id: string
  title: string
  location: string
  type: string
  salary: string
  description: string[]
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
}

const careerPositions: CareerPosition[] = [
  {
    id: "senior-cleaner",
    title: "Senior Professional Cleaner",
    location: "New York, NY",
    type: "Full-time",
    salary: "$25 - $35/hour",
    description: [
      "We are seeking an experienced and highly motivated Senior Professional Cleaner to join our growing team. This role is perfect for individuals who take pride in their work, have a keen eye for detail, and are committed to delivering exceptional cleaning services to our clients.",
      "As a Senior Professional Cleaner, you will be responsible for leading small teams, ensuring high-quality service delivery, and training junior staff. You will work in various residential and commercial settings, utilizing advanced cleaning techniques and equipment.",
    ],
    responsibilities: [
      "Lead and supervise a team of cleaners on various job sites.",
      "Perform high-quality cleaning services for residential and commercial properties.",
      "Train and mentor junior cleaning staff on best practices and safety protocols.",
      "Ensure all cleaning tasks are completed efficiently and to the highest standards.",
      "Operate and maintain cleaning equipment and supplies.",
      "Communicate effectively with clients to understand their needs and address any concerns.",
      "Adhere to all company policies, safety guidelines, and environmental regulations.",
    ],
    requirements: [
      "Minimum of 3 years of professional cleaning experience, with at least 1 year in a supervisory role.",
      "Proven ability to lead and motivate a team.",
      "Strong knowledge of various cleaning techniques, products, and equipment.",
      "Excellent attention to detail and organizational skills.",
      "Ability to work independently and as part of a team.",
      "Valid driver's license and reliable transportation.",
      "Ability to lift up to 50 lbs and perform physical tasks associated with cleaning.",
      "High school diploma or equivalent.",
    ],
    benefits: [
      "Competitive hourly wage with performance bonuses.",
      "Health, dental, and vision insurance.",
      "Paid time off and holidays.",
      "Opportunities for professional development and career advancement.",
      "Company-provided uniforms and equipment.",
      "Supportive and friendly work environment.",
    ],
  },
  {
    id: "junior-cleaner",
    title: "Junior Professional Cleaner",
    location: "New York, NY",
    type: "Part-time",
    salary: "$18 - $22/hour",
    description: [
      "Are you passionate about cleanliness and looking to start a career in professional cleaning? Join our team as a Junior Professional Cleaner! We are looking for enthusiastic and reliable individuals who are eager to learn and contribute to a sparkling clean environment for our clients.",
      "In this role, you will work alongside experienced cleaners, learning the ropes of professional cleaning services. This is an excellent opportunity for individuals seeking flexible hours and a supportive team environment.",
    ],
    responsibilities: [
      "Assist senior cleaners in performing various cleaning tasks for residential and commercial properties.",
      "Learn and apply proper cleaning techniques and safety procedures.",
      "Maintain cleanliness and organization of cleaning equipment and supplies.",
      "Follow instructions and complete assigned tasks efficiently.",
      "Contribute to a positive and collaborative team environment.",
      "Report any issues or concerns to the team lead.",
    ],
    requirements: [
      "No prior professional cleaning experience required, but a strong work ethic and willingness to learn are essential.",
      "Ability to follow instructions and work effectively in a team.",
      "Good communication skills.",
      "Reliable and punctual.",
      "Ability to lift up to 30 lbs and perform physical tasks associated with cleaning.",
      "Must be legally authorized to work in the U.S.",
    ],
    benefits: [
      "Flexible part-time hours.",
      "On-the-job training and mentorship.",
      "Opportunities for growth and advancement to a Senior Cleaner role.",
      "Supportive and friendly work environment.",
      "Company-provided uniforms and basic equipment.",
    ],
  },
  {
    id: "customer-service-rep",
    title: "Customer Service Representative",
    location: "Remote",
    type: "Full-time",
    salary: "$45,000 - $55,000/year",
    description: [
      "We are looking for a dedicated Customer Service Representative to be the first point of contact for our clients. If you have excellent communication skills, a passion for helping others, and thrive in a fast-paced environment, we encourage you to apply.",
      "This remote position involves handling inquiries, resolving issues, and ensuring a positive experience for all SmileyBrooms customers. You will play a crucial role in maintaining our reputation for outstanding service.",
    ],
    responsibilities: [
      "Respond to customer inquiries via phone, email, and chat in a timely and professional manner.",
      "Provide accurate information about our services, pricing, and booking process.",
      "Resolve customer complaints and issues with empathy and efficiency.",
      "Process bookings, cancellations, and rescheduling requests.",
      "Maintain detailed records of customer interactions and transactions.",
      "Collaborate with the cleaning teams to ensure seamless service delivery.",
      "Identify and escalate complex issues to the appropriate department.",
    ],
    requirements: [
      "Minimum of 2 years of experience in a customer service role.",
      "Excellent verbal and written communication skills.",
      "Strong problem-solving abilities and attention to detail.",
      "Proficiency in using CRM software and office applications.",
      "Ability to work independently and manage time effectively in a remote setting.",
      "High-speed internet connection and a quiet home office environment.",
      "High school diploma or equivalent; some college preferred.",
    ],
    benefits: [
      "Competitive annual salary.",
      "Health, dental, and vision insurance.",
      "Paid time off and holidays.",
      "Remote work flexibility.",
      "Opportunities for professional development.",
      "Supportive team culture.",
    ],
  },
  {
    id: "marketing-specialist",
    title: "Marketing Specialist",
    location: "New York, NY (Hybrid)",
    type: "Full-time",
    salary: "$60,000 - $75,000/year",
    description: [
      "SmileyBrooms is seeking a creative and results-driven Marketing Specialist to help us expand our brand presence and reach new customers. If you have a passion for digital marketing, content creation, and campaign management, we want to hear from you!",
      "You will be responsible for developing and executing marketing strategies across various channels, analyzing campaign performance, and contributing to our overall growth objectives.",
    ],
    responsibilities: [
      "Develop and implement digital marketing campaigns (SEO, SEM, social media, email marketing).",
      "Create engaging content for our website, blog, and social media platforms.",
      "Manage and optimize online advertising campaigns.",
      "Analyze marketing data and metrics to identify trends and opportunities for improvement.",
      "Assist in the development of marketing collateral and promotional materials.",
      "Conduct market research to identify target audiences and competitive landscapes.",
      "Collaborate with sales and customer service teams to align marketing efforts.",
      "Stay up-to-date with industry trends and best practices.",
    ],
    requirements: [
      "Bachelor's degree in Marketing, Communications, or a related field.",
      "Minimum of 3 years of experience in a marketing role, preferably in the service industry.",
      "Proven experience with SEO, SEM, social media marketing, and email marketing platforms.",
      "Strong content creation and copywriting skills.",
      "Proficiency in marketing analytics tools (e.g., Google Analytics).",
      "Excellent communication, organizational, and project management skills.",
      "Ability to work independently and as part of a hybrid team.",
    ],
    benefits: [
      "Competitive annual salary with performance bonuses.",
      "Health, dental, and vision insurance.",
      "Paid time off and holidays.",
      "Hybrid work model (mix of in-office and remote).",
      "Opportunities for professional growth and development.",
      "Dynamic and collaborative work environment.",
    ],
  },
]

export default function CareerPositionPage({ params }: { params: { position: string } }) {
  const { position } = params
  const job = careerPositions.find((p) => p.id === position)

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Job Not Found</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          The career position you are looking for does not exist.
        </p>
        <Link href="/careers" passHref>
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Careers
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/careers" passHref>
          <Button variant="outline" className="mb-4 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Careers
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
        <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 text-lg">
          <span className="flex items-center">
            <MapPin className="mr-1 h-5 w-5" /> {job.location}
          </span>
          <span className="flex items-center">
            <Clock className="mr-1 h-5 w-5" /> {job.type}
          </span>
          <span className="flex items-center">
            <DollarSign className="mr-1 h-5 w-5" /> {job.salary}
          </span>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Job Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {job.description.map((paragraph, index) => (
            <p key={index} className="text-gray-700 dark:text-gray-300">
              {paragraph}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Responsibilities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            {job.responsibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            {job.requirements.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            {job.benefits.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button size="lg" className="text-lg px-8 py-4">
          Apply Now
        </Button>
      </div>
    </div>
  )
}
