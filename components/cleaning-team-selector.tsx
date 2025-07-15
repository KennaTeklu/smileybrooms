"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Users, Star, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface TeamMember {
  id: string
  name: string
  role: string
  image: string
  rating: number
  specialty: string
}

const teamMembers: TeamMember[] = [
  {
    id: "team-alpha",
    name: "Team Alpha",
    role: "Lead Cleaners",
    image: "/professional-cleaning-team.png",
    rating: 4.9,
    specialty: "Deep Cleaning, Residential",
  },
  {
    id: "team-beta",
    name: "Team Beta",
    role: "Commercial Specialists",
    image: "/professional-man-suit-headshot.png", // Placeholder for a team lead
    rating: 4.8,
    specialty: "Office Cleaning, Post-Construction",
  },
  {
    id: "team-gamma",
    name: "Team Gamma",
    role: "Eco-Friendly Experts",
    image: "/professional-woman-smiling-headshot.png", // Placeholder for a team lead
    rating: 5.0,
    specialty: "Green Cleaning, Allergy-Friendly",
  },
]

export default function CleaningTeamSelector() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)

  const handleSelectTeam = (teamId: string) => {
    setSelectedTeam(teamId)
  }

  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
              <Users className="h-8 w-8" />
              Choose Your Cleaning Team
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Select a team that best fits your needs and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <RadioGroup
              value={selectedTeam || ""}
              onValueChange={handleSelectTeam}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {teamMembers.map((team) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
                >
                  <Label htmlFor={team.id} className="flex flex-col items-center space-y-4 cursor-pointer">
                    <Card
                      className={`w-full h-full text-center p-6 transition-all duration-200 ${
                        selectedTeam === team.id
                          ? "border-blue-600 ring-2 ring-blue-600 shadow-lg"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-400"
                      }`}
                    >
                      <CardContent className="p-0 flex flex-col items-center">
                        <Image
                          src={team.image || "/placeholder.svg"}
                          alt={team.name}
                          width={120}
                          height={120}
                          className="rounded-full object-cover mb-4 border-4 border-blue-200 dark:border-blue-800"
                        />
                        <h3 className="text-xl font-semibold mb-1">{team.name}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{team.role}</p>
                        <div className="flex items-center gap-1 text-yellow-500 mb-3">
                          <Star className="h-4 w-4 fill-yellow-500" />
                          <span className="font-medium">{team.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Specialty: {team.specialty}</p>
                        <RadioGroupItem value={team.id} id={team.id} className="sr-only" />
                        {selectedTeam === team.id && <CheckCircle className="h-6 w-6 text-blue-600 mt-2" />}
                      </CardContent>
                    </Card>
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
            <div className="text-center mt-8">
              <Button size="lg" disabled={!selectedTeam}>
                Confirm Team Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
