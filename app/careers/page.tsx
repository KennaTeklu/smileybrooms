import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, MapPin, Clock } from "lucide-react"
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

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-4">Join Our Team</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8">
        Explore exciting career opportunities at SmileyBrooms and help us make homes sparkle!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careerPositions.map((job) => (
          <Card key={job.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">{job.title}</CardTitle>
              <CardDescription className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4" /> <span>{job.location}</span>
                <Clock className="h-4 w-4" /> <span>{job.type}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-1" /> {job.salary}
              </p>
              <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{job.description[0]}</p>
            </CardContent>
            <div className="p-6 pt-0">
              <Link href={`/careers/${job.id}`} passHref>
                <Button className="w-full">View Details</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
